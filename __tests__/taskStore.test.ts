import { act } from "react";
import { usePlayerStore } from "../store/playerStore";
import { useTaskStore } from "../store/taskStore";

const tarefaBase = {
  nome: "Teste",
  categoria: "rotina",
  categoriaNome: "Rotina",
  dificuldade: "medio" as const,
};

beforeEach(() => {
  useTaskStore.setState({ pendentes: [], concluidas: [] });
  usePlayerStore.setState({
    xpAtual: 0,
    level: 1,
    xpTotal: 0,
    streak: 0,
    ultimoDiaAtivo: null,
  });
});

describe("criarTarefa", () => {
  it("adiciona tarefa com categoriaNome", () => {
    act(() => {
      useTaskStore.getState().criarTarefa(tarefaBase);
    });
    expect(useTaskStore.getState().pendentes[0].categoriaNome).toBe("Rotina");
  });

  it("calcula XP correto", () => {
    act(() => {
      useTaskStore
        .getState()
        .criarTarefa({ ...tarefaBase, dificuldade: "epico" });
    });
    expect(useTaskStore.getState().pendentes[0].xp).toBe(100);
  });

  it("salva dataLimite quando fornecida", () => {
    const dataLimite = new Date(Date.now() + 86400000).toISOString();
    act(() => {
      useTaskStore.getState().criarTarefa({ ...tarefaBase, dataLimite });
    });
    expect(useTaskStore.getState().pendentes[0].dataLimite).toBe(dataLimite);
  });

  it("gera IDs únicos", () => {
    act(() => {
      useTaskStore.getState().criarTarefa({ ...tarefaBase, nome: "A" });
      useTaskStore.getState().criarTarefa({ ...tarefaBase, nome: "B" });
    });
    const [t1, t2] = useTaskStore.getState().pendentes;
    expect(t1.id).not.toBe(t2.id);
  });
});

describe("editarTarefa", () => {
  it("edita o nome da tarefa", () => {
    act(() => {
      useTaskStore.getState().criarTarefa(tarefaBase);
    });
    act(() => {
      usePlayerStore.getState().ganharXP(50);
    });
    const id = useTaskStore.getState().pendentes[0].id;
    act(() => {
      useTaskStore.getState().editarTarefa(id, { nome: "Nome editado" });
    });
    expect(useTaskStore.getState().pendentes[0].nome).toBe("Nome editado");
  });

  it("cobra 12 XP para editar", () => {
    act(() => {
      useTaskStore.getState().criarTarefa(tarefaBase);
    });
    act(() => {
      usePlayerStore.getState().ganharXP(50);
    });
    const id = useTaskStore.getState().pendentes[0].id;
    act(() => {
      useTaskStore.getState().editarTarefa(id, { nome: "Editado" });
    });
    expect(usePlayerStore.getState().xpAtual).toBe(38);
  });

  it("não edita tarefa inexistente", () => {
    act(() => {
      useTaskStore.getState().editarTarefa("inexistente", { nome: "X" });
    });
    expect(usePlayerStore.getState().xpAtual).toBe(0);
  });
});

describe("concluirTarefa", () => {
  it("move para concluídas com removida=false", () => {
    act(() => {
      useTaskStore.getState().criarTarefa(tarefaBase);
    });
    const id = useTaskStore.getState().pendentes[0].id;
    act(() => {
      useTaskStore.getState().concluirTarefa(id);
    });
    expect(useTaskStore.getState().pendentes).toHaveLength(0);
    expect(useTaskStore.getState().concluidas[0].removida).toBe(false);
  });

  it("dá XP ao jogador", () => {
    act(() => {
      useTaskStore.getState().criarTarefa(tarefaBase);
    });
    const id = useTaskStore.getState().pendentes[0].id;
    act(() => {
      useTaskStore.getState().concluirTarefa(id);
    });
    expect(usePlayerStore.getState().xpAtual).toBe(25);
  });

  it("não faz nada se o id não existe", () => {
    act(() => {
      useTaskStore.getState().concluirTarefa("id-inexistente");
    });
    expect(useTaskStore.getState().concluidas).toHaveLength(0);
    expect(usePlayerStore.getState().xpAtual).toBe(0);
  });
});

describe("apagarTarefa", () => {
  it("registra no histórico com removida=true e xpCobrado=25", () => {
    act(() => {
      useTaskStore.getState().criarTarefa(tarefaBase);
    });
    act(() => {
      usePlayerStore.getState().ganharXP(100);
    });
    const id = useTaskStore.getState().pendentes[0].id;
    act(() => {
      useTaskStore.getState().apagarTarefa(id);
    });
    const h = useTaskStore.getState().concluidas[0];
    expect(h.removida).toBe(true);
    expect(h.xpCobrado).toBe(25);
    expect(usePlayerStore.getState().xpAtual).toBe(75);
    expect(usePlayerStore.getState().xpTotal).toBe(75);
  });

  it("não apaga tarefas já concluídas", () => {
    act(() => {
      useTaskStore.getState().criarTarefa(tarefaBase);
    });
    const id = useTaskStore.getState().pendentes[0].id;
    act(() => {
      useTaskStore.getState().concluirTarefa(id);
    });
    act(() => {
      useTaskStore.getState().apagarTarefa(id);
    });
    expect(useTaskStore.getState().concluidas).toHaveLength(1);
    expect(useTaskStore.getState().concluidas[0].removida).toBe(false);
  });

  it("não faz nada se id não existe", () => {
    act(() => {
      useTaskStore.getState().apagarTarefa("id-inexistente");
    });
    expect(useTaskStore.getState().concluidas).toHaveLength(0);
  });
});

describe("verificarExpiradas", () => {
  it("remove tarefas com prazo vencido e cobra penalidade", () => {
    const passado = new Date(Date.now() - 1000).toISOString();
    act(() => {
      useTaskStore
        .getState()
        .criarTarefa({ ...tarefaBase, dataLimite: passado });
    });
    act(() => {
      usePlayerStore.getState().ganharXP(100);
    });
    act(() => {
      useTaskStore.getState().verificarExpiradas();
    });
    expect(useTaskStore.getState().pendentes).toHaveLength(0);
    expect(useTaskStore.getState().concluidas[0].expirada).toBe(true);
    expect(usePlayerStore.getState().xpAtual).toBe(75);
  });

  it("não remove tarefas sem prazo", () => {
    act(() => {
      useTaskStore.getState().criarTarefa(tarefaBase);
    });
    act(() => {
      useTaskStore.getState().verificarExpiradas();
    });
    expect(useTaskStore.getState().pendentes).toHaveLength(1);
  });

  it("não remove tarefas com prazo futuro", () => {
    const futuro = new Date(Date.now() + 86400000).toISOString();
    act(() => {
      useTaskStore
        .getState()
        .criarTarefa({ ...tarefaBase, dataLimite: futuro });
    });
    act(() => {
      useTaskStore.getState().verificarExpiradas();
    });
    expect(useTaskStore.getState().pendentes).toHaveLength(1);
  });
});
