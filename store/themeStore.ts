import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemePreference = "system" | "dark" | "light";

type ThemeState = { preference: ThemePreference };
type ThemeActions = { setPreference: (p: ThemePreference) => void };

export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    (set) => ({
      preference: "system",
      setPreference: (preference) => set({ preference }),
    }),
    { name: "theme-storage", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
