// 12 groups (A..L) of 4 teams. Reference teams by their FIFA `code` from teams.ts.
// `pot` is the seeding pot (1..4) used for the official draw.

export type GroupSeed = {
  /** Single uppercase letter, A..L */
  name: string;
  /** Exactly 4 entries */
  teams: { code: string; pot: 1 | 2 | 3 | 4 }[];
};

export const groups: GroupSeed[] = [
  // Example — fill the 12 groups.
  {
    name: 'A',
    teams: [
      { code: 'MEX', pot: 1 },
      { code: 'RSA', pot: 2 },
      { code: 'KOR', pot: 3 },
      { code: 'CZE', pot: 4 },
    ],
  },
  {
    name: 'B',
    teams: [
      { code: 'CAN', pot: 1 },
      { code: 'BIH', pot: 2 },
      { code: 'QAT', pot: 3 },
      { code: 'SUI', pot: 4 },
    ],
  },
  {
    name: 'C',
    teams: [
      { code: 'BRA', pot: 1 },
      { code: 'MAR', pot: 2 },
      { code: 'HTI', pot: 3 },
      { code: 'SCO', pot: 4 },
    ],
  },
  {
    name: 'D',
    teams: [
      { code: 'USA', pot: 1 },
      { code: 'PAR', pot: 2 },
      { code: 'AUS', pot: 3 },
      { code: 'TUR', pot: 4 },
    ],
  },
  {
    name: 'E',
    teams: [
      { code: 'GER', pot: 1 },
      { code: 'CUW', pot: 2 },
      { code: 'CIV', pot: 3 },
      { code: 'ECU', pot: 4 },
    ],
  },
  {
    name: 'F',
    teams: [
      { code: 'NED', pot: 1 },
      { code: 'JPN', pot: 2 },
      { code: 'SWE', pot: 3 },
      { code: 'TUN', pot: 4 },
    ],
  },
  {
    name: 'G',
    teams: [
      { code: 'BEL', pot: 1 },
      { code: 'EGY', pot: 2 },
      { code: 'IRI', pot: 3 },
      { code: 'NZL', pot: 4 },
    ],
  },
  {
    name: 'H',
    teams: [
      { code: 'ESP', pot: 1 },
      { code: 'CPV', pot: 2 },
      { code: 'KSA', pot: 3 },
      { code: 'URU', pot: 4 },
    ],
  },
  {
    name: 'I',
    teams: [
      { code: 'FRA', pot: 1 },
      { code: 'SEN', pot: 2 },
      { code: 'IRQ', pot: 3 },
      { code: 'NOR', pot: 4 },
    ],
  },
  {
    name: 'J',
    teams: [
      { code: 'ARG', pot: 1 },
      { code: 'ALG', pot: 2 },
      { code: 'AUT', pot: 3 },
      { code: 'JOR', pot: 4 },
    ],
  },
  {
    name: 'K',
    teams: [
      { code: 'POR', pot: 1 },
      { code: 'COD', pot: 2 },
      { code: 'UZB', pot: 3 },
      { code: 'COL', pot: 4 },
    ],
  },
  {
    name: 'L',
    teams: [
      { code: 'ENG', pot: 1 },
      { code: 'CRO', pot: 2 },
      { code: 'GHA', pot: 3 },
      { code: 'PAN', pot: 4 },
    ],
  },
];
