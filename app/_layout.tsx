import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";

export default function RootLayout() {
  const dark = useColorScheme() === "dark";
  const bg = dark ? "#0a0a0f" : "#ffffff";
  const text = dark ? "#e8e6f0" : "#0a0a0f";
  const { user, initialized, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const checkOnboarding = async () => {
      const seg0 = segments[0] as string;
      const inAuth = seg0 === "auth";
      const inOnboarding = seg0 === "onboarding";

      if (!user && !inAuth) {
        router.replace("/auth" as any);
        return;
      }
      if (user && (inAuth || inOnboarding)) {
        const { data } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .maybeSingle();
        const needsOnboarding =
          !data?.username || data.username === user.email?.split("@")[0];
        router.replace(
          needsOnboarding ? ("/onboarding" as any) : ("/(tabs)" as any),
        );
      }
    };
    checkOnboarding();
  }, [user, initialized]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: bg },
        headerTintColor: text,
        contentStyle: { backgroundColor: bg },
      }}
    >
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          title: "Nova missão",
          headerStyle: { backgroundColor: bg },
          headerTintColor: text,
        }}
      />
      <Stack.Screen name="+not-found" options={{ title: "Não encontrado" }} />
    </Stack>
  );
}
