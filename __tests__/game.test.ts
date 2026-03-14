import {
  XP_POR_DIFICULDADE,
  XP_PARA_PROXIMO_LEVEL,
  getRank,
  CUSTO_APAGAR_TAREFA,
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
  it("a curva cresce com o level", () => {
    expect(XP_PARA_PROXIMO_LEVEL(3)).toBeGreaterThan(XP_PARA_PROXIMO_LEVEL(2));
  });
});

describe("getRank", () => {
  it("0 XP = Rank E", () => {
    expect(getRank(0).letra).toBe("E");
  });
  it("999 XP ainda é Rank E", () => {
    expect(getRank(999).letra).toBe("E");
  });
  it("1000 XP exatos = Rank D", () => {
    expect(getRank(1000).letra).toBe("D");
  });
  it("100000 XP = Shadow Monarch", () => {
    expect(getRank(100000).letra).toBe("S");
  });
});

describe("CUSTO_APAGAR_TAREFA", () => {
  it("custo de apagar é 25 XP", () => {
    expect(CUSTO_APAGAR_TAREFA).toBe(25);
  });
});
