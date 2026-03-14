import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { XP_POR_DIFICULDADE, type Dificuldade } from "../constants/game";
import { usePlayerStore } from "./playerStore";

// --- Tipos ---

export type Categoria =
  | "rotina"
  | "treino"
  | "estudos"
  | "trabalho"
  | "ingles"
  | "musica";

export type Tarefa = {
  id: string;
  nome: string;
  categoria: Categoria;
  dificuldade: Dificuldade;
  xp: number;
  criadaEm: string; // ISO string da data de criação
};

export type TarefaConcluida = Tarefa & {
  concluidaEm: string; // ISO string da data de conclusão
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

// --- Helpers ---

const gerarId = (): string => {
  // ID único baseado em timestamp + número aleatório
  // Simples e suficiente para uso local sem servidor
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
};

// --- Store ---

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
        set((state) => ({
          pendentes: [...state.pendentes, novaTarefa],
        }));
      },

      concluirTarefa: (id) => {
        const { pendentes, concluidas } = get();
        const tarefa = pendentes.find((t) => t.id === id);

        // Se a tarefa não existe, não faz nada
        if (!tarefa) return;

        // Move para concluídas com timestamp
        const tarefaConcluida: TarefaConcluida = {
          ...tarefa,
          concluidaEm: new Date().toISOString(),
        };

        set({
          pendentes: pendentes.filter((t) => t.id !== id),
          concluidas: [tarefaConcluida, ...concluidas],
        });

        // Dá o XP ao jogador — taskStore avisa playerStore
        usePlayerStore.getState().ganharXP(tarefa.xp);
      },

      apagarTarefa: (id) => {
        const { pendentes } = get();
        const tarefa = pendentes.find((t) => t.id === id);

        // Só apaga pendentes — concluídas são imutáveis
        if (!tarefa) return;

        set({
          pendentes: pendentes.filter((t) => t.id !== id),
        });

        // Deduz o custo do jogador — pode regredir de level
        usePlayerStore.getState().deduzirXP();
      },
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
