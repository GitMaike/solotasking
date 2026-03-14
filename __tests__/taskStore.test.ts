import { act } from "react";
import { useTaskStore } from "../store/taskStore";
import { usePlayerStore } from "../store/playerStore";

beforeEach(() => {
  useTaskStore.setState({ pendentes: [], concluidas: [] });
  usePlayerStore.setState({ xpAtual: 0, level: 1, xpTotal: 0, streak: 0 });
});

describe("criarTarefa", () => {
  it("adiciona tarefa à lista de pendentes", () => {
    act(() =>
      useTaskStore.getState().criarTarefa({
        nome: "Treinar 30 minutos",
        categoria: "treino",
        dificuldade: "medio",
      }),
    );
    expect(useTaskStore.getState().pendentes).toHaveLength(1);
    expect(useTaskStore.getState().pendentes[0].nome).toBe(
      "Treinar 30 minutos",
    );
  });

  it("calcula o XP correto pela dificuldade", () => {
    act(() =>
      useTaskStore.getState().criarTarefa({
        nome: "Tarefa épica",
        categoria: "trabalho",
        dificuldade: "epico",
      }),
    );
    expect(useTaskStore.getState().pendentes[0].xp).toBe(100);
  });

  it("gera IDs únicos para cada tarefa", () => {
    act(() => {
      useTaskStore
        .getState()
        .criarTarefa({ nome: "A", categoria: "rotina", dificuldade: "facil" });
      useTaskStore
        .getState()
        .criarTarefa({ nome: "B", categoria: "rotina", dificuldade: "facil" });
    });
    const [t1, t2] = useTaskStore.getState().pendentes;
    expect(t1.id).not.toBe(t2.id);
  });
});

describe("concluirTarefa", () => {
  it("move tarefa de pendentes para concluídas", () => {
    act(() =>
      useTaskStore.getState().criarTarefa({
        nome: "Estudar inglês",
        categoria: "ingles",
        dificuldade: "facil",
      }),
    );
    const id = useTaskStore.getState().pendentes[0].id;

    act(() => useTaskStore.getState().concluirTarefa(id));

    expect(useTaskStore.getState().pendentes).toHaveLength(0);
    expect(useTaskStore.getState().concluidas).toHaveLength(1);
  });

  it("dá XP ao jogador ao concluir", () => {
    act(() =>
      useTaskStore.getState().criarTarefa({
        nome: "Tocar guitarra",
        categoria: "musica",
        dificuldade: "medio",
      }),
    );
    const id = useTaskStore.getState().pendentes[0].id;

    act(() => useTaskStore.getState().concluirTarefa(id));

    expect(usePlayerStore.getState().xpAtual).toBe(25);
  });

  it("não faz nada se o id não existe", () => {
    act(() => useTaskStore.getState().concluirTarefa("id-inexistente"));
    expect(useTaskStore.getState().concluidas).toHaveLength(0);
    expect(usePlayerStore.getState().xpAtual).toBe(0);
  });
});

describe("apagarTarefa", () => {
  it("remove tarefa da lista de pendentes", () => {
    act(() =>
      useTaskStore.getState().criarTarefa({
        nome: "Tarefa a apagar",
        categoria: "rotina",
        dificuldade: "facil",
      }),
    );
    const id = useTaskStore.getState().pendentes[0].id;

    act(() => useTaskStore.getState().apagarTarefa(id));

    expect(useTaskStore.getState().pendentes).toHaveLength(0);
  });

  it("deduz 25 XP do jogador ao apagar", () => {
    act(() => usePlayerStore.getState().ganharXP(100));
    act(() =>
      useTaskStore.getState().criarTarefa({
        nome: "Tarefa a apagar",
        categoria: "rotina",
        dificuldade: "facil",
      }),
    );
    const id = useTaskStore.getState().pendentes[0].id;

    act(() => useTaskStore.getState().apagarTarefa(id));

    expect(usePlayerStore.getState().xpAtual).toBe(75);
  });

  it("não apaga tarefas concluídas", () => {
    act(() =>
      useTaskStore.getState().criarTarefa({
        nome: "Tarefa concluída",
        categoria: "estudos",
        dificuldade: "medio",
      }),
    );
    const id = useTaskStore.getState().pendentes[0].id;
    act(() => useTaskStore.getState().concluirTarefa(id));

    // tenta apagar pelo mesmo id — não deve funcionar
    act(() => useTaskStore.getState().apagarTarefa(id));

    expect(useTaskStore.getState().concluidas).toHaveLength(1);
  });
});
