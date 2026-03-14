// O mock é resolvido automaticamente pelo moduleNameMapper no package.json
// Não precisamos mais do jest.mock() manual aqui

import { act } from "react";
import { usePlayerStore } from "../store/playerStore";

beforeEach(() => {
  usePlayerStore.setState({
    xpAtual: 0,
    level: 1,
    xpTotal: 0,
    streak: 0,
  });
});

describe("ganharXP", () => {
  it("adiciona XP ao estado", () => {
    act(() => usePlayerStore.getState().ganharXP(25));
    expect(usePlayerStore.getState().xpAtual).toBe(25);
    expect(usePlayerStore.getState().xpTotal).toBe(25);
  });

  it("sobe de level quando atinge o limite", () => {
    act(() => usePlayerStore.getState().ganharXP(200));
    expect(usePlayerStore.getState().level).toBe(2);
    expect(usePlayerStore.getState().xpAtual).toBe(0);
  });

  it("carrega o XP excedente para o próximo level", () => {
    act(() => usePlayerStore.getState().ganharXP(250));
    expect(usePlayerStore.getState().level).toBe(2);
    expect(usePlayerStore.getState().xpAtual).toBe(50);
  });

  it("xpTotal nunca diminui ao ganhar XP", () => {
    act(() => usePlayerStore.getState().ganharXP(100));
    act(() => usePlayerStore.getState().ganharXP(50));
    expect(usePlayerStore.getState().xpTotal).toBe(150);
  });
});

describe("deduzirXP", () => {
  it("desconta 25 XP quando tem saldo suficiente", () => {
    act(() => usePlayerStore.getState().ganharXP(100));
    act(() => usePlayerStore.getState().deduzirXP());
    expect(usePlayerStore.getState().xpAtual).toBe(75);
    expect(usePlayerStore.getState().level).toBe(1);
  });

  it("regride de level quando não tem XP suficiente", () => {
    act(() => usePlayerStore.getState().ganharXP(200));
    expect(usePlayerStore.getState().level).toBe(2);
    expect(usePlayerStore.getState().xpAtual).toBe(0);

    act(() => usePlayerStore.getState().deduzirXP());
    expect(usePlayerStore.getState().level).toBe(1);
    expect(usePlayerStore.getState().xpAtual).toBe(175);
  });

  it("não vai abaixo do level 1", () => {
    act(() => usePlayerStore.getState().deduzirXP());
    expect(usePlayerStore.getState().level).toBe(1);
    expect(usePlayerStore.getState().xpAtual).toBe(0);
  });

  it("xpTotal diminui ao deduzir XP", () => {
    act(() => usePlayerStore.getState().ganharXP(100));
    act(() => usePlayerStore.getState().deduzirXP());
    expect(usePlayerStore.getState().xpTotal).toBe(75); // 100 - 25 = 75
  });
});

describe("streak", () => {
  it("incrementa streak", () => {
    act(() => usePlayerStore.getState().incrementarStreak());
    act(() => usePlayerStore.getState().incrementarStreak());
    expect(usePlayerStore.getState().streak).toBe(2);
  });

  it("reseta streak para zero", () => {
    act(() => usePlayerStore.getState().incrementarStreak());
    act(() => usePlayerStore.getState().resetarStreak());
    expect(usePlayerStore.getState().streak).toBe(0);
  });
});
