import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TourState = {
  tourCompleto: boolean;
  tourAtivo: boolean;
  passoAtual: number;
};

type TourActions = {
  iniciarTour: () => void;
  avancarPasso: () => void;
  voltarPasso: () => void;
  pularTour: () => void;
  concluirTour: () => void;
  resetarTour: () => void;
};

export const useTourStore = create<TourState & TourActions>()(
  persist(
    (set, get) => ({
      tourCompleto: false,
      tourAtivo: false,
      passoAtual: 0,

      iniciarTour: () => set({ tourAtivo: true, passoAtual: 0 }),
      avancarPasso: () => {
        const { passoAtual } = get();
        set({ passoAtual: passoAtual + 1 });
      },
      voltarPasso: () => {
        const { passoAtual } = get();
        if (passoAtual > 0) set({ passoAtual: passoAtual - 1 });
      },
      pularTour: () => set({ tourAtivo: false, tourCompleto: true }),
      concluirTour: () => set({ tourAtivo: false, tourCompleto: true }),
      resetarTour: () =>
        set({ tourCompleto: false, tourAtivo: false, passoAtual: 0 }),
    }),
    { name: "tour-storage", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
