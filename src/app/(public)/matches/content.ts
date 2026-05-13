import type { MatchStatus, Phase } from '@/generated/prisma/client';

export const PHASE_LABEL: Record<Phase, string> = {
  GROUP: 'Phase de groupes',
  ROUND_OF_32: '16es de finale',
  ROUND_OF_16: '8es de finale',
  QUARTER_FINAL: 'Quarts de finale',
  SEMI_FINAL: 'Demi-finales',
  THIRD_PLACE: 'Match pour la 3e place',
  FINAL: 'Finale',
};

export const STATUS_LABEL: Record<MatchStatus, string> = {
  SCHEDULED: 'À venir',
  LIVE: 'En direct',
  FINISHED: 'Terminé',
  CANCELLED: 'Annulé',
};
