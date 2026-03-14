import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { XP_POR_DIFICULDADE, type Dificuldade } from "../constants/game";
import { usePlayerStore } from "./playerStore";

export type Categoria = string;

export type Tarefa = {
  id: string;
  nome: string;
  categoria: Categoria;
  dificuldade: Dificuldade;
  xp: number;
  criadaEm: string;
};

export type TarefaConcluida = Tarefa & {
  concluidaEm: string;
  removida?: boolean; // true = foi apagada, false/undefined = foi concluída
  xpCobrado?: number; // custo cobrado ao remover (sempre 25)
};

export type TaskState = {
  pendentes: Tarefa[];
  concluidas: TarefaConcluida[];
};

export type TaskActions = {
  criarTarefa: (dados: Omit<Tarefa, "id" | "xp" | "criadaEm">) => void;
  concluirTarefa: (id: string) => void;
  apagarTarefa: (id: string) => void;
};

const gerarId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const useTaskStore = create<TaskState & TaskActions>()(
  persist(
    (set, get) => ({
      pendentes: [],
      concluidas: [],

      criarTarefa: (dados) => {
        const novaTarefa: Tarefa = {
          id: gerarId(),
          nome: dados.nome,
          categoria: dados.categoria,
          dificuldade: dados.dificuldade,
          xp: XP_POR_DIFICULDADE[dados.dificuldade],
          criadaEm: new Date().toISOString(),
        };
        set((state) => ({ pendentes: [...state.pendentes, novaTarefa] }));
      },

      concluirTarefa: (id) => {
        const { pendentes, concluidas } = get();
        const tarefa = pendentes.find((t) => t.id === id);
        if (!tarefa) return;

        const tarefaConcluida: TarefaConcluida = {
          ...tarefa,
          concluidaEm: new Date().toISOString(),
          removida: false,
        };

        set({
          pendentes: pendentes.filter((t) => t.id !== id),
          concluidas: [tarefaConcluida, ...concluidas],
        });

        usePlayerStore.getState().ganharXP(tarefa.xp);
      },

      apagarTarefa: (id) => {
        const { pendentes, concluidas } = get();
        const tarefa = pendentes.find((t) => t.id === id);
        if (!tarefa) return;

        // Registra no histórico com marcador de remoção
        const tarefaRemovida: TarefaConcluida = {
          ...tarefa,
          concluidaEm: new Date().toISOString(),
          removida: true,
          xpCobrado: 25,
        };

        set({
          pendentes: pendentes.filter((t) => t.id !== id),
          concluidas: [tarefaRemovida, ...concluidas],
        });

        // Deduz o custo — pode regredir de level
        usePlayerStore.getState().deduzirXP();
      },
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
