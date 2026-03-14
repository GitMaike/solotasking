import { act } from "react";
import { usePlayerStore } from "../store/playerStore";

beforeEach(() => {
  usePlayerStore.setState({
    xpAtual: 0,
    level: 1,
    xpTotal: 0,
    streak: 0,
    ultimoDiaAtivo: null,
  });
});

describe("ganharXP", () => {
  it("adiciona XP ao estado", () => {
    act(() => {
      usePlayerStore.getState().ganharXP(25);
    });
    expect(usePlayerStore.getState().xpAtual).toBe(25);
    expect(usePlayerStore.getState().xpTotal).toBe(25);
  });

  it("sobe de level quando atinge o limite", () => {
    act(() => {
      usePlayerStore.getState().ganharXP(200);
    });
    expect(usePlayerStore.getState().level).toBe(2);
    expect(usePlayerStore.getState().xpAtual).toBe(0);
  });

  it("carrega o XP excedente para o próximo level", () => {
    act(() => {
      usePlayerStore.getState().ganharXP(250);
    });
    expect(usePlayerStore.getState().level).toBe(2);
    expect(usePlayerStore.getState().xpAtual).toBe(50);
  });

  it("xpTotal nunca diminui ao ganhar XP", () => {
    act(() => {
      usePlayerStore.getState().ganharXP(100);
    });
    act(() => {
      usePlayerStore.getState().ganharXP(50);
    });
    expect(usePlayerStore.getState().xpTotal).toBe(150);
  });
});

describe("deduzirXP", () => {
  it("desconta 25 XP quando tem saldo suficiente", () => {
    act(() => {
      usePlayerStore.getState().ganharXP(100);
    });
    act(() => {
      usePlayerStore.getState().deduzirXP();
    });
    expect(usePlayerStore.getState().xpAtual).toBe(75);
    expect(usePlayerStore.getState().level).toBe(1);
  });

  it("regride de level quando não tem XP suficiente", () => {
    act(() => {
      usePlayerStore.getState().ganharXP(200);
    });
    expect(usePlayerStore.getState().level).toBe(2);
    expect(usePlayerStore.getState().xpAtual).toBe(0);

    act(() => {
      usePlayerStore.getState().deduzirXP();
    });
    expect(usePlayerStore.getState().level).toBe(1);
    expect(usePlayerStore.getState().xpAtual).toBe(175);
  });

  it("não vai abaixo do level 1", () => {
    act(() => {
      usePlayerStore.getState().deduzirXP();
    });
    expect(usePlayerStore.getState().level).toBe(1);
    expect(usePlayerStore.getState().xpAtual).toBe(0);
  });

  it("xpTotal diminui ao deduzir XP", () => {
    act(() => {
      usePlayerStore.getState().ganharXP(100);
    });
    act(() => {
      usePlayerStore.getState().deduzirXP();
    });
    expect(usePlayerStore.getState().xpTotal).toBe(75);
  });
});

describe("streak", () => {
  it("incrementa streak", () => {
    act(() => {
      usePlayerStore.getState().incrementarStreak();
    });
    act(() => {
      usePlayerStore.getState().incrementarStreak();
    });
    expect(usePlayerStore.getState().streak).toBe(2);
  });

  it("reseta streak para zero", () => {
    act(() => {
      usePlayerStore.getState().incrementarStreak();
    });
    act(() => {
      usePlayerStore.getState().resetarStreak();
    });
    expect(usePlayerStore.getState().streak).toBe(0);
  });
});

describe("verificarStreak", () => {
  it("define streak=1 na primeira abertura", () => {
    usePlayerStore.setState({ streak: 0, ultimoDiaAtivo: null });
    act(() => {
      usePlayerStore.getState().verificarStreak();
    });
    expect(usePlayerStore.getState().streak).toBe(1);
    expect(usePlayerStore.getState().ultimoDiaAtivo).toBeTruthy();
  });

  it("não muda streak se já abriu hoje", () => {
    const dataHoje = new Date().toISOString().split("T")[0];
    usePlayerStore.setState({ streak: 5, ultimoDiaAtivo: dataHoje });
    act(() => {
      usePlayerStore.getState().verificarStreak();
    });
    expect(usePlayerStore.getState().streak).toBe(5);
  });

  it("incrementa streak se abriu ontem", () => {
    const ontem = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    usePlayerStore.setState({ streak: 3, ultimoDiaAtivo: ontem });
    act(() => {
      usePlayerStore.getState().verificarStreak();
    });
    expect(usePlayerStore.getState().streak).toBe(4);
  });

  it("reseta streak se perdeu mais de 1 dia", () => {
    const anteontem = new Date(Date.now() - 2 * 86400000)
      .toISOString()
      .split("T")[0];
    usePlayerStore.setState({ streak: 10, ultimoDiaAtivo: anteontem });
    act(() => {
      usePlayerStore.getState().verificarStreak();
    });
    expect(usePlayerStore.getState().streak).toBe(1);
  });
});
