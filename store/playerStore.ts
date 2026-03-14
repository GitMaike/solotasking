import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  CUSTO_APAGAR_TAREFA,
  getRank,
  XP_PARA_PROXIMO_LEVEL,
} from "../constants/game";

// --- Tipos ---
// Definir tipos antes da lógica é o hábito mais importante do TypeScript.
// O compilador vai te avisar se você passar o dado errado em qualquer lugar.

export type PlayerState = {
  xpAtual: number; // XP dentro do level atual (zera ao subir de level)
  level: number; // level atual do jogador
  xpTotal: number; // XP acumulado de toda a vida (nunca diminui, define o rank)
  streak: number; // dias consecutivos com pelo menos 1 tarefa concluída
};

export type PlayerActions = {
  ganharXP: (quantidade: number) => void;
  deduzirXP: (quantidade?: number) => void;
  resetarStreak: () => void;
  incrementarStreak: () => void;
};

// --- Store ---

export const usePlayerStore = create<PlayerState & PlayerActions>()(
  persist(
    (set, get) => ({
      // Estado inicial — jogador começa do zero
      xpAtual: 0,
      level: 1,
      xpTotal: 0,
      streak: 0,

      // Chamada quando o jogador completa uma tarefa
      ganharXP: (quantidade) => {
        const { xpAtual, level, xpTotal } = get();
        const novoXPTotal = xpTotal + quantidade;
        let novoXP = xpAtual + quantidade;
        let novoLevel = level;

        // Loop porque uma tarefa épica pode subir mais de um level de uma vez
        while (novoXP >= XP_PARA_PROXIMO_LEVEL(novoLevel)) {
          novoXP -= XP_PARA_PROXIMO_LEVEL(novoLevel);
          novoLevel += 1;
        }

        set({ xpAtual: novoXP, level: novoLevel, xpTotal: novoXPTotal });
      },

      // Chamada quando o jogador apaga uma tarefa pendente (custa 25 XP)
      deduzirXP: (quantidade = CUSTO_APAGAR_TAREFA) => {
        const { xpAtual, level, xpTotal } = get();

        // xpTotal diminui — a penalidade é real e afeta o rank
        const novoXPTotal = Math.max(0, xpTotal - quantidade);

        if (xpAtual >= quantidade) {
          set({ xpAtual: xpAtual - quantidade, xpTotal: novoXPTotal });
          return;
        }

        let resto = quantidade - xpAtual;
        let novoLevel = level;
        let novoXP = 0;

        while (resto > 0 && novoLevel > 1) {
          novoLevel -= 1;
          const xpDoLevelAnterior = XP_PARA_PROXIMO_LEVEL(novoLevel);
          if (resto <= xpDoLevelAnterior) {
            novoXP = xpDoLevelAnterior - resto;
            resto = 0;
          } else {
            resto -= xpDoLevelAnterior;
          }
        }

        if (novoLevel <= 1 && resto > 0) {
          novoLevel = 1;
          novoXP = 0;
        }

        set({ xpAtual: novoXP, level: novoLevel, xpTotal: novoXPTotal });
      },

      incrementarStreak: () => {
        set((state) => ({ streak: state.streak + 1 }));
      },

      resetarStreak: () => {
        set({ streak: 0 });
      },
    }),

    // persist salva o estado no AsyncStorage automaticamente
    // toda vez que o estado muda, ele serializa e grava
    {
      name: "player-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// Seletor separado para o rank — calculado a partir do xpTotal
// Não fica no estado porque é sempre derivado, nunca guardado
export const useRank = () => {
  const xpTotal = usePlayerStore((state) => state.xpTotal);
  return getRank(xpTotal);
};
