# Authentification — Tribune

Documentation du système d'auth : architecture, flows, rate limiting et sécurité.

> Ce document décrit **ce qui existe** dans le code. Pour les conventions générales du projet, voir `AGENTS.md`.

## Sommaire

- [Stack](#stack)
- [Carte des fichiers](#carte-des-fichiers)
- [Modèle de données](#modèle-de-données)
- [Flows utilisateur](#flows-utilisateur)
  - [Inscription](#inscription)
  - [Vérification email](#vérification-email)
  - [Connexion](#connexion)
  - [Mot de passe oublié / réinitialisation](#mot-de-passe-oublié--réinitialisation)
- [Server Actions vs `auth.api` vs handler Better Auth](#server-actions-vs-authapi-vs-handler-better-auth)
- [Garde-fous et middleware](#garde-fous-et-middleware)
- [Rate limiting](#rate-limiting)
- [Cookies](#cookies)
- [Emails](#emails)
- [Variables d'environnement](#variables-denvironnement)
- [Setup dev](#setup-dev)
- [Limitations connues](#limitations-connues)

---

## Stack

| Composant | Choix |
|---|---|
| Lib auth | `better-auth` (email + password, vérification email obligatoire) |
| Persistence | PostgreSQL via Prisma 7 (adapter `prismaAdapter`) |
| Storage secondaire | Upstash Redis (sessions, verifications, rate limit) — fallback DB/memory si absent |
| Emails | React Email + Resend |
| Forms côté client | TanStack React Form + Zod |
| UI | shadcn/ui + Tailwind v4 |

**Pourquoi vérification email obligatoire ?** Empêche les inscriptions massives via emails jetables et garantit qu'on peut joindre l'utilisateur (reset password, notifications matchs). Conséquence : `autoSignIn` est désactivé à l'inscription.

---

## Carte des fichiers

```
src/
├── app/
│   ├── api/auth/[...all]/route.ts    # Catch-all → handler Better Auth
│   ├── (auth)/                       # Route group "guest-only"
│   │   ├── sign-up/                  # page.tsx + sign-up-form.tsx + actions.ts
│   │   ├── sign-in/                  # idem
│   │   ├── forgot-password/          # idem
│   │   ├── reset-password/           # idem
│   │   └── verify-email/             # page.tsx + resend-verification-button.tsx + actions.ts
│   └── (app)/                        # Route group "user-only" (protégée par layout)
│       └── profile/                  # page de profil + sign-out + verified-toast
├── lib/
│   ├── auth.ts                       # Config Better Auth (côté serveur)
│   ├── auth-client.ts                # Client browser (signIn, signOut, useSession)
│   ├── auth-helpers.ts               # getSession / getCurrentUser (avec React.cache)
│   ├── auth-guards.ts                # requireUser / requireGuest / requireAdmin / requirePendingVerification
│   ├── auth-secondary-storage.ts     # Adapter Upstash → Better Auth SecondaryStorage
│   ├── rate-limit.ts                 # Limiteurs Upstash pour les Server Actions
│   ├── redis.ts                      # Client Upstash (ou null en dev)
│   ├── pending-verification.ts       # Cookies "vérification en cours" (UX)
│   ├── email.tsx                     # sendEmail + helpers de rendu
│   └── username.ts                   # Schema Zod du pseudo
├── emails/
│   ├── verification-email.tsx        # Template React Email
│   └── reset-password-email.tsx
├── proxy.ts                          # Middleware Next.js 16 (renommé "proxy")
└── env.ts                            # Validation Zod des env vars
```

---

## Modèle de données

Tables créées par Better Auth (schéma dans `prisma/schema.prisma`) :

- `user` — `id`, `email` (unique), `username` (unique, `citext`), `emailVerified`, `role` (`USER` | `ADMIN`), `name`, `image`, `createdAt`, `updatedAt`
- `session` — sessions persistées, FK → `user`
- `account` — credentials hashés (provider `credential`) + comptes OAuth (futurs)
- `verification` — tokens à usage unique (vérif email, reset password)

**Spécificités du projet** :
- `username` est stocké en `Citext` (case-insensitive). Lookup via Prisma `findUnique` fonctionne, mais l'affichage garde la casse de saisie.
- `role: Role` est un champ custom (additionalField côté config + enum côté Prisma).
- `name` est rempli automatiquement avec le `username` lors de la création (cf. `databaseHooks.user.create.before`).

---

## Flows utilisateur

### Inscription

```
Client (sign-up-form.tsx)
   │  POST signUpAction({ username, email, password })
   ▼
Server Action (sign-up/actions.ts)
   ├─ zod parse
   ├─ rate-limit IP (Upstash : 3/min)
   ├─ pré-check unicité username/email (DB) → erreurs par champ
   ├─ auth.api.signUpEmail(...)
   │     └─ databaseHooks.user.create.before : valide + assigne username
   │     └─ envoie email de vérification (waitUntil + Resend)
   ├─ cookie "pending_verification_email" + "sent_at"
   └─ retour { ok: true }
   ▼
Client → router.push("/verify-email")
```

**Pourquoi un pré-check unicité côté action** alors que Better Auth + la contrainte SQL feraient le job ? Pour produire des messages d'erreur par champ (`fieldErrors.username`, `fieldErrors.email`) plus précis que l'`APIError` générique de Better Auth. Il subsiste une race condition entre le pré-check et le `signUpEmail`, mais la contrainte unique en SQL la rattrape (avec un message moins joli en cas de collision).

### Vérification email

```
User clique le lien dans l'email
   ▼
GET /api/auth/verify-email?token=...&callbackURL=/profile?verified=1
   ▼
Handler Better Auth (route.ts)
   ├─ vérifie le token
   ├─ user.emailVerified = true
   ├─ autoSignInAfterVerification = true → crée la session
   └─ redirige → /profile?verified=1
   ▼
ProfilePage → <VerifiedToast /> consomme ?verified=1 et affiche un toast
```

Si l'utilisateur reste sur `/verify-email`, le bouton "Renvoyer l'email" appelle `resendVerificationAction` qui :
- lit le cookie `pending_verification_email`
- check rate-limit (3 envois / 5 min par IP+email)
- rappelle `auth.api.sendVerificationEmail`

### Connexion

```
Client (sign-in-form.tsx)
   │  POST signInAction({ email, password, rememberMe })
   ▼
Server Action (sign-in/actions.ts)
   ├─ zod parse
   ├─ rate-limit IP+email (5/min)
   ├─ auth.api.signInEmail({..., headers: await headers()})
   │     ├─ succès → cookie de session posé via nextCookies() plugin
   │     └─ EMAIL_NOT_VERIFIED → on relance un email de vérif + set cookie pending
   ├─ clearPendingVerificationEmail() si succès
   └─ retour { ok: true } | { ok: false, needsVerification?: true }
   ▼
Client → router.push("/profile") + router.refresh()
```

Le `headers: await headers()` passé à `auth.api.signInEmail` est important : il permet à Better Auth de tracer l'IP et le user-agent dans la session.

### Mot de passe oublié / réinitialisation

**Étape 1 — demande de reset** (`forgotPasswordAction`) :
```
Client soumet email
   ▼
Server Action
   ├─ zod parse
   ├─ rate-limit IP (3 / 15 min)
   ├─ auth.api.requestPasswordReset({ email, redirectTo: "/reset-password" })
   │     └─ envoie l'email si le compte existe (sinon : no-op)
   └─ retour TOUJOURS { ok: true }   ← anti-énumération
```

L'erreur est **silencieusement avalée** par design : un attaquant ne doit pas pouvoir savoir si un email est inscrit ou non.

**Étape 2 — l'utilisateur clique le lien**, atterrit sur `/reset-password?token=...&error=...?`

**Étape 3 — soumission** (`resetPasswordAction`) :
```
Server Action
   ├─ zod parse (mot de passe + confirmation)
   ├─ auth.api.resetPassword({ newPassword, token })
   │     └─ revokeSessionsOnPasswordReset: true → toutes les sessions sont invalidées
   └─ retour { ok: true } ou { ok: false, error }
```

L'utilisateur doit ensuite se reconnecter (toutes ses sessions ont été révoquées, y compris celles d'autres appareils).

---

## Server Actions vs `auth.api` vs handler Better Auth

Trois manières d'invoquer Better Auth coexistent. **Important** : elles n'ont pas les mêmes propriétés.

### 1. Handler HTTP `/api/auth/[...all]` (route.ts)

```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
export const { GET, POST } = toNextJsHandler(auth);
```

Endpoint catch-all qui reçoit les requêtes "publiques" de Better Auth : clic sur lien email, callbacks OAuth, etc.

- ✅ Soumis au rate limit Better Auth (`rateLimit.customRules`)
- ✅ Vérification CSRF / trusted origins
- Utilisé par : liens dans les emails (verify, reset), callbacks futurs OAuth.

### 2. `auth.api.xxx()` appelé depuis nos Server Actions

```ts
'use server'
import { auth } from "@/lib/auth";
await auth.api.signInEmail({ body, headers: await headers() });
```

C'est ce qu'on fait pour `signUp`, `signIn`, `forgotPassword`, `resetPassword`, `sendVerificationEmail`.

- ❌ **N'est pas soumis au rate limit interne de Better Auth** (doc officielle : « Server-side requests made using `auth.api` aren't affected by rate limiting »). C'est pourquoi on a un rate limiter maison via Upstash (cf. plus bas) appliqué dans chaque action.
- ✅ Pose les cookies de session via le plugin `nextCookies()`.
- ✅ Trace IP/user-agent si on passe `headers: await headers()`.

### 3. `authClient.xxx()` côté browser (`auth-client.ts`)

```ts
import { signIn, signOut, useSession } from "@/lib/auth-client";
```

- ✅ Soumis au rate limit Better Auth (request HTTP → handler).
- Utilisé par : `SignOutButton`, et tout endroit qui a besoin de `useSession` dans un Client Component.
- **Non utilisé pour les flows sign-in/sign-up** : on est passé par des Server Actions pour pouvoir mêler validation custom, cookies UX et pré-checks DB.

### Récap décisionnel

| Besoin | Quoi utiliser |
|---|---|
| Sign-out simple côté client | `authClient.signOut()` |
| Hook `useSession()` dans un composant client | `authClient.useSession()` |
| Form complexe avec validation + pré-checks + cookies UX | Server Action qui appelle `auth.api.*` |
| Endpoint public attaqué directement (webhook, lien email) | Route HTTP catch-all (configurée d'office par Better Auth) |

---

## Garde-fous et middleware

Trois couches de protection, complémentaires.

### Couche 1 — Middleware (`src/proxy.ts`)

```ts
export const config = {
  matcher: ["/profile/:path*", "/dashboard/:path*", "/admin/:path*"],
};
```

Lit le cookie de session via `getSessionCookie` (Better Auth). **Ne vérifie pas la signature** — c'est une barrière rapide qui économise un render + DB query si l'utilisateur n'est manifestement pas connecté. Ce n'est PAS la sécurité finale.

> Note Next.js 16 : le fichier s'appelle `proxy.ts` et exporte une fonction `proxy` (renommage volontaire de `middleware`).

### Couche 2 — Layout `(app)/layout.tsx`

```ts
export default async function AppLayout({ children }) {
  await requireUser();
  return <>{children}</>;
}
```

Appelle `requireUser()` une fois pour tout le groupe `(app)`. Grâce à `React.cache()` dans `auth-helpers.ts`, les pages enfants qui rappellent `getCurrentUser`/`requireUser` ne déclenchent **pas** une seconde requête DB dans le même render.

### Couche 3 — Guards (`src/lib/auth-guards.ts`)

| Guard | Comportement |
|---|---|
| `requireGuest()` | Si session existe → redirect `/`. Pour les pages sign-in/sign-up/forgot-password. |
| `requireUser()` | Si pas de user → redirect `/verify-email` (si cookie pending) ou `/sign-in`. Sinon retourne le `User`. |
| `requireAdmin()` | `requireUser()` + check `role === 'ADMIN'`, sinon redirect `/`. |
| `requirePendingVerification()` | Pour `/verify-email` : refuse si déjà vérifié, refuse si pas de cookie pending. Sinon retourne l'email. |

**Convention** : les pages d'auth (`(auth)/*`) appellent `requireGuest()`, les pages applicatives sont sous `(app)/` qui appelle `requireUser()` au layout. Pour l'admin, ajouter `await requireAdmin()` en tête de page.

---

## Rate limiting

Deux limiteurs distincts, complémentaires :

### A. Rate limit Better Auth (interne)

Configuré dans `src/lib/auth.ts` :

```ts
rateLimit: {
  enabled: true,
  storage: redisSecondaryStorage ? "secondary-storage" : "memory",
  window: 60,
  max: 100,
  customRules: {
    "/sign-in/email": { window: 60, max: 5 },
    "/sign-up/email": { window: 60, max: 3 },
    "/request-password-reset": { window: 900, max: 3 },
    "/send-verification-email": { window: 300, max: 3 },
    "/reset-password": { window: 600, max: 5 },
  },
},
```

**Couvre quoi ?** Les requêtes HTTP entrantes sur `/api/auth/*` : clic sur lien email, callback de vérification, future requête OAuth. Comptage par IP (avec normalisation IPv6 /64 par défaut).

**Ne couvre pas** : nos Server Actions qui passent par `auth.api.*` en interne. C'est documenté côté Better Auth, pas un bug.

### B. Rate limit applicatif (`src/lib/rate-limit.ts`)

Wrapper autour de `@upstash/ratelimit` (algo sliding window). Cinq limiteurs nommés :

| Nom | Limite | Fenêtre | Appliqué dans |
|---|---|---|---|
| `signUp` | 3 | 1 min | `sign-up/actions.ts` (par IP) |
| `signIn` | 5 | 1 min | `sign-in/actions.ts` (par IP + email) |
| `forgotPassword` | 3 | 15 min | `forgot-password/actions.ts` (par IP) |
| `resendVerification` | 3 | 5 min | `verify-email/actions.ts` (par IP + email) |
| `availabilityCheck` | 20 | 1 min | `sign-up/actions.ts` (par IP, pour check username/email) |

**Usage** :
```ts
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const ip = await getClientIp();
const limit = await checkRateLimit('signIn', `${ip}:${email}`);
if (!limit.ok) {
  return { ok: false, error: `Réessaie dans ${limit.retryAfterSeconds}s.` };
}
```

**Identifier** : combiner `ip:email` (ou `ip:username`) pour les actions liées à un compte spécifique. Évite qu'un attaquant bloque tout un range IP en spammant une seule cible.

**Fallback dev** : si `UPSTASH_REDIS_REST_URL`/`TOKEN` ne sont pas définis (cas par défaut en dev), le client Redis vaut `null`, `checkRateLimit` retourne toujours `{ ok: true }`. En production, les env vars sont **requises** (cf. `env.ts:superRefine`) — l'app refusera de démarrer sans.

### Pourquoi pas un seul système ?

- Le rate limit Better Auth opère au niveau HTTP, on n'en a pas la main fine dans les Server Actions.
- Le rate limit applicatif est explicite, lisible dans le code de l'action, et peut combiner IP + autre identifiant.
- Les deux partagent le même Redis (secondary storage), donc même infra.

---

## Cookies

| Cookie | Posé par | Rôle | Sécurité |
|---|---|---|---|
| Session Better Auth | `nextCookies()` plugin | Auth principale | `httpOnly`, `secure` (prod), signé HMAC |
| `tribune_pending_verification_email` | `lib/pending-verification.ts` | UX — drive le routing /verify-email | `httpOnly`, `secure` (prod), **non signé** |
| `tribune_pending_verification_sent_at` | idem | Cooldown du bouton "renvoyer" | idem |

Le cookie `pending_verification_email` stocke un email en clair. Pas une faille car non utilisé pour l'autorisation, mais c'est de la PII visible côté client. Acceptable pour cet usage UX, mais à signer si on l'utilise un jour pour de la logique de sécurité.

---

## Emails

Pipeline simple :

```
auth.ts ─► sendVerificationEmail({ user, url })
            └► renderVerificationEmail(url)  ← React Email
                  └► sendEmail({ to, subject, html, text })  ← Resend
                        └► waitUntil(...)   ← Vercel : non bloquant
```

**Templates** : `src/emails/*.tsx` (React Email).
- `verification-email.tsx`
- `reset-password-email.tsx`

Chaque template exporte aussi une version `text` pour les clients qui ne rendent pas le HTML.

**Dev** : `pnpm email:dev` lance React Email Studio sur `src/emails`. En dev, `sendEmail` log aussi le contenu texte sur la console (`console.info`) — utile pour récupérer le lien sans configurer Resend.

**`waitUntil`** : configuré via `advanced.backgroundTasks.handler` dans `auth.ts`. Sur Vercel, ça permet à la requête HTTP de répondre sans attendre Resend. Sur d'autres plateformes, fallback gérée par Better Auth.

---

## Variables d'environnement

Validation dans `src/env.ts` (Zod + `superRefine` pour les contraintes conditionnelles).

| Variable | Obligatoire | Notes |
|---|---|---|
| `DATABASE_URL` | toujours | URL Postgres |
| `BETTER_AUTH_SECRET` | toujours | ≥ 32 chars, `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | toujours | URL canonique de l'app |
| `RESEND_API_KEY` | toujours | Clé Resend |
| `RESEND_FROM_EMAIL` | toujours | Doit être vérifié sur un domaine Resend |
| `UPSTASH_REDIS_REST_URL` | hors dev | Auto-injecté par Marketplace Vercel |
| `UPSTASH_REDIS_REST_TOKEN` | hors dev | idem |
| `VERCEL_ENV`, `VERCEL_URL` | injecté | Utilisés pour `baseURL` en preview |

**Toujours importer via `@/env`**, jamais `process.env` directement.

---

## Setup dev

```bash
# 1. Variables d'env
cp .env.example .env.local
# remplir DATABASE_URL, BETTER_AUTH_SECRET (openssl rand -base64 32),
# BETTER_AUTH_URL=http://localhost:3000, RESEND_API_KEY, RESEND_FROM_EMAIL

# 2. Base de données
pnpm exec prisma migrate dev
pnpm exec prisma generate

# 3. Serveur
pnpm dev
```

**Sans Upstash en dev** : rate limit no-op, Better Auth utilise sa mémoire. Parfait pour itérer.

**Pour tester avec Upstash en dev** : provisionner via Vercel Marketplace, puis `vercel env pull .env.local`.

**Pour visualiser les emails sans Resend** : `pnpm email:dev` lance le studio React Email. Sinon, en dev `sendEmail` log le contenu sur la console.

---

## Limitations connues

- **`auth.api.*` bypass le rate limit interne** de Better Auth. C'est compensé par notre rate limit applicatif (cf. plus haut). À garder en tête si on ajoute un nouveau flow : penser au `checkRateLimit` en tête d'action.
- **Pré-check unicité dans `signUpAction`** : crée une race condition rattrapée par la contrainte SQL. Le UX se dégrade un poil en cas de collision (message moins précis).
- **Cookie `pending_verification_email` non signé** : voir section Cookies. PII en clair côté client.
- **Pas de 2FA pour l'instant** : si on en ajoute, utiliser le plugin `twoFactor` de Better Auth (skill `two-factor-authentication-best-practices`).
- **Pas d'audit log** : pas de trace des connexions/changements d'email. Si besoin, brancher `databaseHooks.session.create.after` (cf. skill `better-auth-security-best-practices`).
- **OAuth non câblé** : la table `account` est prête à accueillir des providers OAuth ; il suffira d'ajouter `socialProviders: { ... }` dans `auth.ts`.

---

## Ressources

- Better Auth docs : https://better-auth.com/docs
- Upstash Ratelimit : https://github.com/upstash/ratelimit-js
- React Email : https://react.email
- Resend : https://resend.com/docs
