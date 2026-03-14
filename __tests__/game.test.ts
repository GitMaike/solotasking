import {
  CUSTO_APAGAR_TAREFA,
  CUSTO_EDITAR_TAREFA,
  XP_PARA_PROXIMO_LEVEL,
  XP_POR_DIFICULDADE,
  getPenalidadeExpiracao,
  getSubRank,
} from "../constants/game";

describe("XP_POR_DIFICULDADE", () => {
  it("tarefa fácil vale 10 XP", () => {
    expect(XP_POR_DIFICULDADE.facil).toBe(10);
  });
  it("tarefa épica vale 100 XP", () => {
    expect(XP_POR_DIFICULDADE.epico).toBe(100);
  });
});

describe("XP_PARA_PROXIMO_LEVEL", () => {
  it("level 1 precisa de 200 XP", () => {
    expect(XP_PARA_PROXIMO_LEVEL(1)).toBe(200);
  });
  it("level 5 precisa de 1000 XP", () => {
    expect(XP_PARA_PROXIMO_LEVEL(5)).toBe(1000);
  });
});

describe("getSubRank", () => {
  it("0 XP = E-III Novato", () => {
    const r = getSubRank(0);
    expect(r.rank).toBe("E");
    expect(r.sub).toBe("III");
    expect(r.nome).toBe("Novato");
  });
  it("1000 XP = E-II Sobrevivente", () => {
    expect(getSubRank(1000).nome).toBe("Sobrevivente");
  });
  it("6000 XP = D-III Recruta", () => {
    const r = getSubRank(6000);
    expect(r.rank).toBe("D");
    expect(r.nome).toBe("Recruta");
  });
  it("25000 XP = C-III Caçador", () => {
    expect(getSubRank(25000).rank).toBe("C");
  });
  it("1000000 XP = S-I Monarca das Sombras", () => {
    const r = getSubRank(1000000);
    expect(r.rank).toBe("S");
    expect(r.nome).toBe("Monarca das Sombras");
  });
});

describe("penalidades", () => {
  it("custo apagar = 25 XP", () => {
    expect(CUSTO_APAGAR_TAREFA).toBe(25);
  });
  it("custo editar = 12 XP (metade)", () => {
    expect(CUSTO_EDITAR_TAREFA).toBe(12);
  });
  it("penalidade expiração rank E = 25", () => {
    expect(getPenalidadeExpiracao(0)).toBe(25);
  });
  it("penalidade expiração rank D = 50", () => {
    expect(getPenalidadeExpiracao(6000)).toBe(50);
  });
  it("penalidade expiração rank S = 150", () => {
    expect(getPenalidadeExpiracao(500000)).toBe(150);
  });
});
