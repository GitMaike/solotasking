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

const gerarId = (): string => {
  // Gera UUID v4 válido — compatível com PostgreSQL
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Import dinâmico para evitar dependência circular
const getUserId = () => {
  try {
    const { useAuthStore } = require("./authStore");
    return useAuthStore.getState().user?.id ?? null;
  } catch {
    return null;
  }
};

const sincronizarTarefa = async (
  tipo: "criar" | "concluir" | "apagar" | "expirar",
  tarefaId: string,
  xpCobrado?: number,
) => {
  try {
    const userId = getUserId();
    if (!userId) return;

    const { salvarTarefaNova, atualizarStatusTarefa, salvarPlayerStats } =
      await import("./syncStore");

    if (tipo === "criar") {
      await salvarTarefaNova(userId, tarefaId);
    } else if (tipo === "concluir") {
      await atualizarStatusTarefa(tarefaId, "concluida");
      await salvarPlayerStats(userId);
    } else if (tipo === "apagar") {
      await atualizarStatusTarefa(tarefaId, "removida", xpCobrado);
      await salvarPlayerStats(userId);
    } else if (tipo === "expirar") {
      await atualizarStatusTarefa(tarefaId, "expirada", xpCobrado);
      await salvarPlayerStats(userId);
    }
  } catch (e) {
    // Falha silenciosa — dados locais já foram salvos
    console.warn("Sync falhou:", e);
  }
};

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
        sincronizarTarefa("criar", novaTarefa.id);
      },

      editarTarefa: (id, dados) => {
        const tarefa = get().pendentes.find((t) => t.id === id);
        if (!tarefa) return;
        set((s) => ({
          pendentes: s.pendentes.map((t) =>
            t.id === id ? { ...t, ...dados } : t,
          ),
        }));
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
        sincronizarTarefa("concluir", id);
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
        sincronizarTarefa("apagar", id, 25);
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

        expiradas.forEach((t) => {
          usePlayerStore.getState().deduzirXP(penalidade);
          sincronizarTarefa("expirar", t.id, penalidade);
        });
      },
    }),
    { name: "task-storage", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
