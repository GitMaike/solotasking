import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "../lib/supabase";

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
};

type AuthActions = {
  initialize: () => void;
  signUpWithEmail: (
    email: string,
    password: string,
    username: string,
  ) => Promise<{ error: string | null }>;
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  initialize: () => {
    // Escuta mudanças de sessão em tempo real
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null, initialized: true });
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },

  signUpWithEmail: async (email, password, username) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, display_name: username } },
    });
    set({ loading: false });
    return { error: error?.message ?? null };
  },

  signInWithEmail: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    set({ loading: false });
    return { error: error?.message ?? null };
  },

  signInWithGoogle: async () => {
    set({ loading: true });
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth`
        : undefined;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    set({ loading: false });
    return { error: error?.message ?? null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
    // Limpa dados locais ao deslogar
    const { useTaskStore } = await import("./taskStore");
    const { usePlayerStore } = await import("./playerStore");
    const { useCategoryStore } = await import("./categoryStore");
    useTaskStore.setState({ pendentes: [], concluidas: [] });
    usePlayerStore.setState({
      xpAtual: 0,
      level: 1,
      xpTotal: 0,
      streak: 0,
      ultimoDiaAtivo: null,
    });
    useCategoryStore.setState({ categories: [] });
    // Limpa AsyncStorage/localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("task-storage");
      localStorage.removeItem("player-storage");
      localStorage.removeItem("category-storage");
      localStorage.removeItem("theme-storage");
    }
  },
}));
