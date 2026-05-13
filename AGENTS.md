<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Conventions du projet

## Workflow Git

- **GitHub Flow** (trunk-based) : `main` est la seule branche longue, toujours déployable. Pas de branche `develop`.
- Une branche courte par travail : `feat/<slug>`, `fix/<slug>`, `chore/<slug>`. Créée depuis `main`, mergée par PR, puis supprimée.
- **PR petites et rapides** : viser < 1-2 jours de vie. Si la branche dérive trop, rebase sur `main` plutôt que merger `main` dedans.
- **Squash merge par défaut** : 1 PR = 1 commit sur `main`. Historique linéaire, lisible.
- **Preview deployments** (Vercel) par branche pour valider avant merge — pas besoin d'environnement d'intégration partagé.
- Ne **jamais** force-push sur `main`. Force-push autorisé uniquement sur ses propres branches de feature, et avec `--force-with-lease`.

## Commits Git

- Utiliser **Conventional Commits** : `type(scope?): description`
- Types autorisés : `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`
- Description en minuscules, à l'impératif présent, sans point final
- **Ne pas** ajouter de ligne `Co-Authored-By: Claude` ni de mention « Generated with Claude Code » dans les messages de commit ou les PR
- Exemples :
  - `feat(auth): add magic link login`
  - `fix: handle empty cart state`
  - `refactor(api): extract user repository`
- Un commit `feat` doit être **atomique** : une feature cohérente = un commit (pas de mélange feat + refactor sans rapport).

## Nommage des fichiers et dossiers

- **kebab-case partout** : fichiers et dossiers (ex. `user-card.tsx`, `auth-provider.tsx`, `lib/date-utils.ts`)
- Les segments de route dans `app/` suivent la même règle (ils deviennent l'URL)
- Les exports nommés à l'intérieur des fichiers restent en PascalCase pour les composants (`export function UserCard()`) et camelCase pour le reste

## Stack technique

- **Framework** : Next.js 16 (App Router) + React 19 — voir l'avertissement en haut du fichier, lire `node_modules/next/dist/docs/` avant tout code Next.js
- **Langage** : TypeScript
- **Package manager** : pnpm
- **Base de données** : PostgreSQL (Neon) via Prisma 7 (`@prisma/adapter-pg`) — schéma dans `prisma/schema.prisma`, client généré dans `src/generated/prisma` (⚠️ **ne pas** laisser dans `src/app/` : risque de collision avec le routing Next.js)
- **Tests** : Vitest, fichiers `*.test.ts` colocalisés à côté du code. Obligatoires pour la logique métier critique (ex. `lib/scoring.ts`).
- **Auth** : `better-auth` — architecture, flows, rate limit et guards détaillés dans [`docs/auth.md`](./docs/auth.md)
- **Email** : Resend
- **UI** : shadcn/ui (style `radix-nova`, RSC activé) + Tailwind CSS v4 + Radix UI + icônes Lucide
- **Lint** : ESLint 9 (`eslint-config-next`)

## Structure des dossiers

```
src/
  app/              # routes (App Router) — kebab-case, deviennent des URLs
  generated/prisma/ # client Prisma généré (ne pas éditer, hors de src/app/)
  components/       # composants partagés
    ui/             # primitives shadcn (alias @/components/ui)
  lib/              # utilitaires partagés (alias @/lib, @/lib/utils)
    prisma.ts       # singleton PrismaClient — toujours importer via @/lib/prisma
  hooks/            # hooks React (alias @/hooks)
  env.ts            # validation runtime des env vars (zod / @t3-oss/env-nextjs)
prisma/
  schema.prisma
```

Alias d'import configurés : `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, `@/hooks`, `@/env`.

### Ordre des imports

1. Modules externes (`react`, `next/*`, packages npm)
2. Alias internes `@/...`
3. Imports relatifs (`./`, `../`)

À déléguer à ESLint si possible (`eslint-plugin-import`).

## Commandes courantes

- `pnpm dev` — serveur de développement
- `pnpm build` — build de production
- `pnpm start` — sert le build
- `pnpm lint` — ESLint
- `pnpm exec prisma migrate dev` — créer/appliquer une migration locale
- `pnpm exec prisma generate` — régénérer le client Prisma après modification du schéma
- `pnpm exec prisma studio` — UI pour explorer la base

## Conventions Next.js / React

- **Server Components par défaut.** N'ajouter `"use client"` qu'en cas de réel besoin.
- **Heuristique avant `"use client"`** : vérifier qu'on a réellement besoin de `useState`, `useEffect`, ou d'un event handler DOM. Sinon, rester en RSC.
- **Garder la frontière client la plus basse possible** : préférer composer un Server Component qui rend un petit Client Component feuille, plutôt que de marquer toute une page `"use client"`.
- **Données** : fetch directement dans les Server Components (async/await) ; éviter `useEffect` pour de la data fetching côté client.
- **Prisma** : toujours importer le client depuis le singleton `@/lib/prisma`. Ne **jamais** instancier `new PrismaClient()` en dehors de ce fichier — sinon connexions multiples et erreurs Neon en dev (HMR).
- **Cache / revalidation** : utiliser les primitives Next.js 16 (`use cache`, `cacheTag`, `cacheLife`, `updateTag`). Lire `node_modules/next/dist/docs/` avant d'utiliser une API de cache — les anciennes API (`unstable_cache`, etc.) peuvent être dépréciées.
- **Composants UI** : ajouter via `pnpm dlx shadcn@latest add <component>` plutôt que de copier à la main ; les primitives vont dans `src/components/ui/`.
- **Styling** : Tailwind v4 (config dans `src/app/globals.css`), `cn()` depuis `@/lib/utils` pour combiner classes, `class-variance-authority` pour les variants de composants.

### Server Actions

- **Validation** : zod en tout début d'action sur toutes les entrées (FormData incluse).
- **Auth** : appeler `getCurrentUser()` (ou `requireAdmin()` pour les actions admin) avant toute logique métier.
- **Retour normalisé** : `{ ok: true, data } | { ok: false, error }`. Ne pas throw côté serveur pour des erreurs métier attendues.
- **Quand préférer une route API REST** plutôt qu'une Server Action :
  - webhooks entrants (Stripe, Resend, etc.)
  - streaming SSE
  - endpoints publics consommés par des tiers
  - uploads `FormData` complexes (multipart streaming, fichiers volumineux)

### Accessibilité

- Privilégier les primitives **Radix** (via shadcn) plutôt que recoder un composant interactif.
- Pour les composants custom : labels explicites, `aria-*` quand pertinent (état, rôle, description).

### Internationalisation

- **UI en français uniquement.**
- **Code, commentaires, noms de variables en anglais.**

## Variables d'environnement

- Validation runtime via `src/env.ts` (zod ou `@t3-oss/env-nextjs`).
- **Toujours importer via `@/env`**, jamais `process.env` directement dans le code applicatif — garantit le typage et l'échec rapide au boot si une variable manque.

## Sécurité & secrets

- Ne jamais committer `.env*` (sauf `.env.example`).
- Ne jamais logguer ni inclure dans des messages d'erreur : tokens, mots de passe, clés API, données utilisateur sensibles.
- Toute donnée provenant du client (formulaires, query params, headers) est non fiable jusqu'à validation côté serveur (zod).

