import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const dark = useColorScheme() === "dark";
  const bg = dark ? "#0a0a0f" : "#ffffff";
  const text = dark ? "#e8e6f0" : "#0a0a0f";

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: bg },
        headerTintColor: text,
        contentStyle: { backgroundColor: bg },
      }}
    >
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
