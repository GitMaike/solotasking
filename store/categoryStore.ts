import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Category = {
  id: string;
  nome: string;
  cor: string;
};

const CORES = [
  "#7F77DD",
  "#D4537E",
  "#378ADD",
  "#1D9E75",
  "#AFA9EC",
  "#5DCAA5",
  "#EF9F27",
  "#F0997B",
];

const DEFAULTS: Category[] = [
  { id: "rotina", nome: "Rotina", cor: "#7F77DD" },
  { id: "trabalho", nome: "Trabalho", cor: "#D4537E" },
  { id: "estudos", nome: "Estudos", cor: "#378ADD" },
  { id: "treino", nome: "Treino", cor: "#1D9E75" },
];

type CategoryState = { categories: Category[] };
type CategoryActions = {
  adicionar: (nome: string) => void;
  editar: (id: string, nome: string) => void;
  remover: (id: string) => void;
};

export const useCategoryStore = create<CategoryState & CategoryActions>()(
  persist(
    (set, get) => ({
      categories: DEFAULTS,

      adicionar: (nome) => {
        const trimmed = nome.trim();
        if (!trimmed) return;
        const id =
          trimmed.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now();
        const cor = CORES[get().categories.length % CORES.length];
        set((s) => ({
          categories: [...s.categories, { id, nome: trimmed, cor }],
        }));
      },

      editar: (id, nome) => {
        const trimmed = nome.trim();
        if (!trimmed) return;
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === id ? { ...c, nome: trimmed } : c,
          ),
        }));
      },

      remover: (id) => {
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
      },
    }),
    {
      name: "category-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
