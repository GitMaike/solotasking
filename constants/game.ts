export const XP_POR_DIFICULDADE = {
  facil: 10,
  medio: 25,
  dificil: 50,
  epico: 100,
} as const;

export type Dificuldade = keyof typeof XP_POR_DIFICULDADE;

export const CUSTO_APAGAR_TAREFA = 25;

export const XP_PARA_PROXIMO_LEVEL = (level: number): number => level * 200;

// Sub-ranks: cada rank principal tem 3 sub-níveis
// Total: 6 ranks × 3 sub-níveis = 18 estágios de progressão
export const SUB_RANKS = [
  // Rank E — Iniciante (0 a 5.999 XP total)
  { id: "E-III", rank: "E", sub: "III", nome: "Novato", xpMinimo: 0 },
  { id: "E-II", rank: "E", sub: "II", nome: "Sobrevivente", xpMinimo: 1000 },
  { id: "E-I", rank: "E", sub: "I", nome: "Desafiante", xpMinimo: 3000 },

  // Rank D — Aprendiz (6.000 a 24.999 XP total)
  { id: "D-III", rank: "D", sub: "III", nome: "Recruta", xpMinimo: 6000 },
  { id: "D-II", rank: "D", sub: "II", nome: "Discípulo", xpMinimo: 11000 },
  { id: "D-I", rank: "D", sub: "I", nome: "Veterano", xpMinimo: 18000 },

  // Rank C — Aventureiro (25.000 a 74.999 XP total)
  { id: "C-III", rank: "C", sub: "III", nome: "Caçador", xpMinimo: 25000 },
  { id: "C-II", rank: "C", sub: "II", nome: "Rastreador", xpMinimo: 38000 },
  { id: "C-I", rank: "C", sub: "I", nome: "Guardião", xpMinimo: 55000 },

  // Rank B — Caçador Elite (75.000 a 199.999 XP total)
  { id: "B-III", rank: "B", sub: "III", nome: "Sentinela", xpMinimo: 75000 },
  { id: "B-II", rank: "B", sub: "II", nome: "Executor", xpMinimo: 110000 },
  { id: "B-I", rank: "B", sub: "I", nome: "Comandante", xpMinimo: 155000 },

  // Rank A — Elite (200.000 a 499.999 XP total)
  { id: "A-III", rank: "A", sub: "III", nome: "Lendário", xpMinimo: 200000 },
  { id: "A-II", rank: "A", sub: "II", nome: "Mítico", xpMinimo: 300000 },
  { id: "A-I", rank: "A", sub: "I", nome: "Supremo", xpMinimo: 400000 },

  // Rank S — Shadow Monarch (500.000+ XP total)
  { id: "S-III", rank: "S", sub: "III", nome: "Soberano", xpMinimo: 500000 },
  { id: "S-II", rank: "S", sub: "II", nome: "Transcendente", xpMinimo: 700000 },
  {
    id: "S-I",
    rank: "S",
    sub: "I",
    nome: "Monarca das Sombras",
    xpMinimo: 1000000,
  },
] as const;

export type SubRank = (typeof SUB_RANKS)[number];

export const getSubRank = (xpTotal: number): SubRank => {
  return (
    [...SUB_RANKS].reverse().find((r) => xpTotal >= r.xpMinimo) ?? SUB_RANKS[0]
  );
};

// Mantém compatibilidade com código antigo que usa getRank
export const getRank = getSubRank;

// Penalidade por expiração de prazo — escala com o rank
export const PENALIDADE_EXPIRACAO: Record<string, number> = {
  E: 25,
  D: 50,
  C: 75,
  B: 100,
  A: 125,
  S: 150,
};

export const getPenalidadeExpiracao = (xpTotal: number): number => {
  const rank = getSubRank(xpTotal);
  return PENALIDADE_EXPIRACAO[rank.rank];
};

// Custo de edição = metade da penalidade de apagar
export const CUSTO_EDITAR_TAREFA = Math.floor(CUSTO_APAGAR_TAREFA / 2); // 12 XP

export const RANKS = SUB_RANKS; // alias para compatibilidade
