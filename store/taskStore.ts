import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  CUSTO_EDITAR_TAREFA,
  getPenalidadeExpiracao,
  XP_POR_DIFICULDADE,
  type Dificuldade,
} from "../constants/game";
import { usePlayerStore } from "./playerStore";

export type Categoria = string;

export type Tarefa = {
  id: string;
  nome: string;
  categoria: Categoria;
  categoriaNome: string;
  dificuldade: Dificuldade;
  xp: number;
  criadaEm: string;
  dataLimite?: string;
};

export type TarefaConcluida = Tarefa & {
  concluidaEm: string;
  removida?: boolean;
  expirada?: boolean;
  xpCobrado?: number;
};

type TaskState = {
  pendentes: Tarefa[];
  concluidas: TarefaConcluida[];
};

type TaskActions = {
  criarTarefa: (dados: Omit<Tarefa, "id" | "xp" | "criadaEm">) => void;
  editarTarefa: (
    id: string,
    dados: Partial<Pick<Tarefa, "nome" | "dataLimite">>,
  ) => void;
  concluirTarefa: (id: string) => void;
  apagarTarefa: (id: string) => void;
  verificarExpiradas: () => void;
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
          categoriaNome: dados.categoriaNome,
          dificuldade: dados.dificuldade,
          xp: XP_POR_DIFICULDADE[dados.dificuldade],
          criadaEm: new Date().toISOString(),
          dataLimite: dados.dataLimite,
        };
        set((s) => ({ pendentes: [...s.pendentes, novaTarefa] }));
      },

      editarTarefa: (id, dados) => {
        const tarefa = get().pendentes.find((t) => t.id === id);
        if (!tarefa) return;

        set((s) => ({
          pendentes: s.pendentes.map((t) =>
            t.id === id ? { ...t, ...dados } : t,
          ),
        }));

        // Editar custa metade da penalidade de apagar
        usePlayerStore.getState().deduzirXP(CUSTO_EDITAR_TAREFA);
      },

      concluirTarefa: (id) => {
        const { pendentes, concluidas } = get();
        const tarefa = pendentes.find((t) => t.id === id);
        if (!tarefa) return;

        set({
          pendentes: pendentes.filter((t) => t.id !== id),
          concluidas: [
            {
              ...tarefa,
              concluidaEm: new Date().toISOString(),
              removida: false,
            },
            ...concluidas,
          ],
        });
        usePlayerStore.getState().ganharXP(tarefa.xp);
      },

      apagarTarefa: (id) => {
        const { pendentes, concluidas } = get();
        const tarefa = pendentes.find((t) => t.id === id);
        if (!tarefa) return;

        set({
          pendentes: pendentes.filter((t) => t.id !== id),
          concluidas: [
            {
              ...tarefa,
              concluidaEm: new Date().toISOString(),
              removida: true,
              xpCobrado: 25,
            },
            ...concluidas,
          ],
        });
        usePlayerStore.getState().deduzirXP(25);
      },

      verificarExpiradas: () => {
        const { pendentes, concluidas } = get();
        const agora = new Date();
        const { xpTotal } = usePlayerStore.getState();
        const penalidade = getPenalidadeExpiracao(xpTotal);

        const expiradas = pendentes.filter((t) => {
          if (!t.dataLimite) return false;
          return new Date(t.dataLimite) < agora;
        });

        if (expiradas.length === 0) return;

        const novasConcluidas: TarefaConcluida[] = expiradas.map((t) => ({
          ...t,
          concluidaEm: new Date().toISOString(),
          removida: true,
          expirada: true,
          xpCobrado: penalidade,
        }));

        set({
          pendentes: pendentes.filter((t) => {
            if (!t.dataLimite) return true;
            return new Date(t.dataLimite) >= agora;
          }),
          concluidas: [...novasConcluidas, ...concluidas],
        });

        // Deduz penalidade por cada tarefa expirada
        expiradas.forEach(() => {
          usePlayerStore.getState().deduzirXP(penalidade);
        });
      },
    }),
    { name: "task-storage", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
