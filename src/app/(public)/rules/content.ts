export type Stat = {
  value: string;
  label: string;
};

export type StepIcon = 'pencil' | 'lock' | 'trophy';

export type Step = {
  icon: StepIcon;
  title: string;
  body: string;
  detail: string;
  hint: string;
};

export type ScoringRow = {
  label: string;
  points: number;
};

export type ScoringExample = {
  prono: string;
  result: string;
  points: number;
  label: string;
};

export type RankingRow = {
  rank: number;
  name: string;
  points: number;
  highlight?: boolean;
};

export const stats: Stat[] = [
  { value: '104', label: 'Matches à pronostiquer' },
  { value: '5', label: 'Points max par match' },
  { value: '1', label: 'Tribune. Un seul classement.' },
];

export const steps: Step[] = [
  {
    icon: 'pencil',
    title: 'Choisis ton score',
    body: 'Avant chaque match, indique le score que tu prévois pour l’équipe domicile et l’extérieur.',
    detail:
      'Pas de pari sur l’issue seule : c’est un vrai score, buts pour buts. Tu peux pronostiquer jusqu’aux 104 rencontres de la compétition, des matches de groupes à la finale.',
    hint: 'Un pronostic oublié = 0 point. Pense à passer un coup d’œil avant chaque journée.',
  },
  {
    icon: 'lock',
    title: 'Verrouillage au coup d’envoi',
    body: 'Tu peux modifier ton pronostic autant que tu veux jusqu’au coup d’envoi. Après, il est figé.',
    detail:
      'À la seconde où l’arbitre siffle le début du match, ton pronostic est verrouillé côté serveur. Plus de modification possible, même en cas de blessure de dernière minute ou de composition surprise.',
    hint: 'Astuce : ajuste tes pronos jusqu’à la dernière minute si la compo officielle change la donne.',
  },
  {
    icon: 'trophy',
    title: 'Marque des points',
    body: 'Score exact, bon écart, ou simplement bon vainqueur — chaque réussite rapporte. Voir le barème ci-dessous.',
    detail:
      'Le classement se met à jour automatiquement dès le coup de sifflet final. Les matches à élimination directe valent le double : autant dire que la fin de compétition peut tout renverser.',
    hint: 'En cas d’égalité, on départage au nombre de scores exacts, puis aux bons vainqueurs.',
  },
];

export const scoringRows: ScoringRow[] = [
  { label: 'Score exact trouvé', points: 5 },
  { label: 'Bon vainqueur et bon écart de buts', points: 3 },
  { label: 'Bon vainqueur uniquement (ou match nul)', points: 1 },
  { label: 'Issue du match non trouvée', points: 0 },
];

export const scoringExamples: ScoringExample[] = [
  { prono: '2 - 1', result: '2 - 1', points: 5, label: 'Score exact' },
  { prono: '2 - 1', result: '3 - 2', points: 3, label: 'Bon écart de buts' },
  { prono: '2 - 1', result: '4 - 0', points: 1, label: 'Bon vainqueur' },
];

export const rankingExample: RankingRow[] = [
  { rank: 1, name: '@camille', points: 187 },
  { rank: 2, name: '@thomasb', points: 182 },
  { rank: 3, name: '@lea', points: 176 },
  { rank: 4, name: '@tribune', points: 171, highlight: true },
  { rank: 5, name: '@juju', points: 168 },
  { rank: 6, name: '@sarahk', points: 164 },
];
