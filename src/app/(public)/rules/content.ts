export type Stat = {
  value: string;
  label: string;
};

export type StepIcon = 'pencil' | 'lock' | 'trophy';

export type Step = {
  icon: StepIcon;
  title: string;
  body: string;
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
  { value: '1', label: 'Tribune' },
];

export const steps: Step[] = [
  {
    icon: 'pencil',
    title: 'Saisir un pronostic',
    body: 'Pour chaque match, soumettez un score précis pour les deux équipes. Les matches de groupes sont ouverts dès le lancement ; chaque tour à élimination directe est publié dès que les équipes sont connues.',
  },
  {
    icon: 'lock',
    title: 'Verrouillage au coup d’envoi',
    body: 'Les pronostics restent modifiables jusqu’au coup d’envoi. Passé cet instant, ils sont définitivement scellés.',
  },
  {
    icon: 'trophy',
    title: 'Décompte des points',
    body: 'Les points sont attribués selon le barème à la fin de chaque match et le classement est mis à jour automatiquement.',
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
