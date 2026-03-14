export const XP_POR_DIFICULDADE = {
  facil: 10,
  medio: 25,
  dificil: 50,
  epico: 100,
} as const;

export type Dificuldade = keyof typeof XP_POR_DIFICULDADE;

export const CUSTO_APAGAR_TAREFA = 25;

export const XP_PARA_PROXIMO_LEVEL = (level: number): number => {
  return level * 200;
};

export const RANKS = [
  { letra: "E", nome: "Iniciante", xpMinimo: 0 },
  { letra: "D", nome: "Aprendiz", xpMinimo: 1000 },
  { letra: "C", nome: "Aventureiro", xpMinimo: 5000 },
  { letra: "B", nome: "Caçador", xpMinimo: 15000 },
  { letra: "A", nome: "Elite", xpMinimo: 40000 },
  { letra: "S", nome: "Shadow Monarch", xpMinimo: 100000 },
] as const;

export const getRank = (xpTotal: number) => {
  return [...RANKS].reverse().find((r) => xpTotal >= r.xpMinimo) ?? RANKS[0];
};
