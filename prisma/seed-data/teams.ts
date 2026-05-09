// 48 qualified teams. Fill in `code` with the FIFA 3-letter code (uppercase).
// `flagUrl` is optional — `https://flagcdn.com/<iso2>.svg` works as a default.

export type TeamSeed = {
  /** Display name (FR) */
  name: string;
  /** FIFA 3-letter code, uppercase, unique */
  code: string;
  /** Optional flag URL */
  flagUrl?: string;
  /** Optional FIFA ranking at seed time */
  fifaRanking?: number;
};

export const teams: TeamSeed[] = [
  // Example — remove and replace with the 48 qualified teams.
  {
    name: 'Canada',
    code: 'CAN',
    flagUrl: 'https://flagcdn.com/ca.svg',
    fifaRanking: 30,
  },
  {
    name: 'USA',
    code: 'USA',
    flagUrl: 'https://flagcdn.com/us.svg',
    fifaRanking: 16,
  },
  {
    name: 'Mexico',
    code: 'MEX',
    flagUrl: 'https://flagcdn.com/mx.svg',
    fifaRanking: 15,
  },
  {
    name: 'Afrique du Sud',
    code: 'RSA',
    flagUrl: 'https://flagcdn.com/za.svg',
    fifaRanking: 60,
  },
  {
    name: 'Algérie',
    code: 'ALG',
    flagUrl: 'https://flagcdn.com/dz.svg',
    fifaRanking: 28,
  },
  {
    name: 'Allemagne',
    code: 'GER',
    flagUrl: 'https://flagcdn.com/de.svg',
    fifaRanking: 10,
  },
  {
    name: 'Angleterre',
    code: 'ENG',
    flagUrl: 'https://flagcdn.com/gb-eng.svg',
    fifaRanking: 4,
  },
  {
    name: 'Arabie saoudite',
    code: 'KSA',
    flagUrl: 'https://flagcdn.com/sa.svg',
    fifaRanking: 61,
  },
  {
    name: 'Argentine',
    code: 'ARG',
    flagUrl: 'https://flagcdn.com/ar.svg',
    fifaRanking: 3,
  },
  {
    name: 'Australie',
    code: 'AUS',
    flagUrl: 'https://flagcdn.com/au.svg',
    fifaRanking: 27,
  },
  {
    name: 'Autriche',
    code: 'AUT',
    flagUrl: 'https://flagcdn.com/at.svg',
    fifaRanking: 24,
  },
  {
    name: 'Belgique',
    code: 'BEL',
    flagUrl: 'https://flagcdn.com/be.svg',
    fifaRanking: 9,
  },
  {
    name: 'Bosnie-Herzégovine',
    code: 'BIH',
    flagUrl: 'https://flagcdn.com/ba.svg',
    fifaRanking: 65,
  },
  {
    name: 'Brésil',
    code: 'BRA',
    flagUrl: 'https://flagcdn.com/br.svg',
    fifaRanking: 6,
  },
  {
    name: 'Cap-Vert',
    code: 'CPV',
    flagUrl: 'https://flagcdn.com/cv.svg',
    fifaRanking: 69,
  },
  {
    name: 'Colombie',
    code: 'COL',
    flagUrl: 'https://flagcdn.com/co.svg',
    fifaRanking: 13,
  },
  {
    name: "Côte d'Ivoire",
    code: 'CIV',
    flagUrl: 'https://flagcdn.com/ci.svg',
    fifaRanking: 34,
  },
  {
    name: 'Croatie',
    code: 'CRO',
    flagUrl: 'https://flagcdn.com/hr.svg',
    fifaRanking: 11,
  },
  {
    name: 'Curaçao',
    code: 'CUW',
    flagUrl: 'https://flagcdn.com/cw.svg',
    fifaRanking: 82,
  },
  {
    name: 'Écosse',
    code: 'SCO',
    flagUrl: 'https://flagcdn.com/gb-sct.svg',
    fifaRanking: 43,
  },
  {
    name: 'Égypte',
    code: 'EGY',
    flagUrl: 'https://flagcdn.com/eg.svg',
    fifaRanking: 29,
  },
  {
    name: 'Équateur',
    code: 'ECU',
    flagUrl: 'https://flagcdn.com/ec.svg',
    fifaRanking: 23,
  },
  {
    name: 'Espagne',
    code: 'ESP',
    flagUrl: 'https://flagcdn.com/es.svg',
    fifaRanking: 2,
  },
  {
    name: 'France',
    code: 'FRA',
    flagUrl: 'https://flagcdn.com/fr.svg',
    fifaRanking: 1,
  },
  {
    name: 'Ghana',
    code: 'GHA',
    flagUrl: 'https://flagcdn.com/gh.svg',
    fifaRanking: 74,
  },
  {
    name: 'Haïti',
    code: 'HTI',
    flagUrl: 'https://flagcdn.com/ht.svg',
    fifaRanking: 83,
  },
  {
    name: 'Irak',
    code: 'IRQ',
    flagUrl: 'https://flagcdn.com/iq.svg',
    fifaRanking: 57,
  },
  {
    name: 'Japon',
    code: 'JPN',
    flagUrl: 'https://flagcdn.com/jp.svg',
    fifaRanking: 18,
  },
  {
    name: 'Jordanie',
    code: 'JOR',
    flagUrl: 'https://flagcdn.com/jo.svg',
    fifaRanking: 63,
  },
  {
    name: 'Maroc',
    code: 'MAR',
    flagUrl: 'https://flagcdn.com/ma.svg',
    fifaRanking: 8,
  },
  {
    name: 'Norvège',
    code: 'NOR',
    flagUrl: 'https://flagcdn.com/no.svg',
    fifaRanking: 31,
  },
  {
    name: 'Nouvelle-Zélande',
    code: 'NZL',
    flagUrl: 'https://flagcdn.com/nz.svg',
    fifaRanking: 85,
  },
  {
    name: 'Ouzbékistan',
    code: 'UZB',
    flagUrl: 'https://flagcdn.com/uz.svg',
    fifaRanking: 50,
  },
  {
    name: 'Panama',
    code: 'PAN',
    flagUrl: 'https://flagcdn.com/pa.svg',
    fifaRanking: 33,
  },
  {
    name: 'Paraguay',
    code: 'PAR',
    flagUrl: 'https://flagcdn.com/py.svg',
    fifaRanking: 40,
  },
  {
    name: 'Pays-Bas',
    code: 'NED',
    flagUrl: 'https://flagcdn.com/nl.svg',
    fifaRanking: 7,
  },
  {
    name: 'Portugal',
    code: 'POR',
    flagUrl: 'https://flagcdn.com/pt.svg',
    fifaRanking: 5,
  },
  {
    name: 'Qatar',
    code: 'QAT',
    flagUrl: 'https://flagcdn.com/qa.svg',
    fifaRanking: 55,
  },
  {
    name: 'République démocratique du Congo',
    code: 'COD',
    flagUrl: 'https://flagcdn.com/cd.svg',
    fifaRanking: 46,
  },
  {
    name: 'République de Corée',
    code: 'KOR',
    flagUrl: 'https://flagcdn.com/kr.svg',
    fifaRanking: 25,
  },
  {
    name: "République islamique d'Iran",
    code: 'IRI',
    flagUrl: 'https://flagcdn.com/ir.svg',
    fifaRanking: 21,
  },
  {
    name: 'Sénégal',
    code: 'SEN',
    flagUrl: 'https://flagcdn.com/sn.svg',
    fifaRanking: 14,
  },
  {
    name: 'Suède',
    code: 'SWE',
    flagUrl: 'https://flagcdn.com/se.svg',
    fifaRanking: 38,
  },
  {
    name: 'Suisse',
    code: 'SUI',
    flagUrl: 'https://flagcdn.com/ch.svg',
    fifaRanking: 19,
  },
  {
    name: 'Tchéquie',
    code: 'CZE',
    flagUrl: 'https://flagcdn.com/cz.svg',
    fifaRanking: 41,
  },
  {
    name: 'Tunisie',
    code: 'TUN',
    flagUrl: 'https://flagcdn.com/tn.svg',
    fifaRanking: 44,
  },
  {
    name: 'Turquie',
    code: 'TUR',
    flagUrl: 'https://flagcdn.com/tr.svg',
    fifaRanking: 22,
  },
  {
    name: 'Uruguay',
    code: 'URU',
    flagUrl: 'https://flagcdn.com/uy.svg',
    fifaRanking: 17,
  },
];
