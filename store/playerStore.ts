import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  CUSTO_APAGAR_TAREFA,
  getSubRank,
  XP_PARA_PROXIMO_LEVEL,
} from "../constants/game";

export type PlayerState = {
  xpAtual: number;
  level: number;
  xpTotal: number;
  streak: number;
  ultimoDiaAtivo: string | null;
};

export type PlayerActions = {
  ganharXP: (quantidade: number) => void;
  deduzirXP: (quantidade?: number) => void;
  incrementarStreak: () => void;
  resetarStreak: () => void;
  verificarStreak: () => void;
};

const hoje = () => new Date().toISOString().split("T")[0];

const diffDias = (a: string, b: string) => {
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  return Math.round(Math.abs(da - db) / 86400000);
};

export const usePlayerStore = create<PlayerState & PlayerActions>()(
  persist(
    (set, get) => ({
      xpAtual: 0,
      level: 1,
      xpTotal: 0,
      streak: 0,
      ultimoDiaAtivo: null,

      ganharXP: (quantidade) => {
        const { xpAtual, level, xpTotal } = get();
        const rankAntes = getSubRank(xpTotal);
        const novoXPTotal = xpTotal + quantidade;
        let novoXP = xpAtual + quantidade;
        let novoLevel = level;
        let levelUpOcorreu = false;

        while (novoXP >= XP_PARA_PROXIMO_LEVEL(novoLevel)) {
          novoXP -= XP_PARA_PROXIMO_LEVEL(novoLevel);
          novoLevel += 1;
          levelUpOcorreu = true;
        }

        set({ xpAtual: novoXP, level: novoLevel, xpTotal: novoXPTotal });

        if (levelUpOcorreu) {
          const rankDepois = getSubRank(novoXPTotal);
          try {
            const {
              dispararLevelUp,
            } = require("../components/LevelUpModal.web");
            dispararLevelUp({
              novoLevel,
              rankAnterior: rankAntes.nome,
              novoRank: rankDepois.nome,
              rankMudou: rankAntes.id !== rankDepois.id,
            });
          } catch {}
        }
      },

      deduzirXP: (quantidade = CUSTO_APAGAR_TAREFA) => {
        const { xpAtual, level, xpTotal } = get();
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
          const xpDoLevel = XP_PARA_PROXIMO_LEVEL(novoLevel);
          if (resto <= xpDoLevel) {
            novoXP = xpDoLevel - resto;
            resto = 0;
          } else {
            resto -= xpDoLevel;
          }
        }

        if (novoLevel <= 1 && resto > 0) {
          novoLevel = 1;
          novoXP = 0;
        }

        set({ xpAtual: novoXP, level: novoLevel, xpTotal: novoXPTotal });
      },

      verificarStreak: () => {
        const { ultimoDiaAtivo, streak } = get();
        const dataHoje = hoje();

        if (!ultimoDiaAtivo) {
          set({ streak: 1, ultimoDiaAtivo: dataHoje });
          return;
        }

        if (ultimoDiaAtivo === dataHoje) return;

        const diff = diffDias(ultimoDiaAtivo, dataHoje);

        if (diff === 1) {
          set({ streak: streak + 1, ultimoDiaAtivo: dataHoje });
        } else {
          set({ streak: 1, ultimoDiaAtivo: dataHoje });
        }
      },

      incrementarStreak: () => set((s) => ({ streak: s.streak + 1 })),
      resetarStreak: () => set({ streak: 0 }),
    }),
    {
      name: "player-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useRank = () => {
  const xpTotal = usePlayerStore((s) => s.xpTotal);
  return getSubRank(xpTotal);
};
