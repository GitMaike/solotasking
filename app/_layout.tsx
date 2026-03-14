import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

// Ícones simples em SVG inline — sem dependência externa
function IconHome({ color }: { color: string }) {
  return (
    // Usamos Text como fallback visual limpo
    // Na próxima iteração trocamos por expo-symbols
    <TabIcon label="⌂" color={color} />
  );
}

function TabIcon({ label, color }: { label: string; color: string }) {
  const { Text } = require("react-native");
  return <Text style={{ color, fontSize: 20 }}>{label}</Text>;
}

export default function TabLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const activeColor = "#7F77DD";
  const inactiveColor = isDark ? "#444441" : "#888780";
  const bgColor = isDark ? "#0a0a0f" : "#ffffff";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopColor: isDark ? "#1a1630" : "#e0e0e0",
          borderTopWidth: 0.5,
        },
        headerStyle: { backgroundColor: bgColor },
        headerTintColor: isDark ? "#e8e6f0" : "#0a0a0f",
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => <TabIcon label="⌂" color={color} />,
          headerTitle: "SoloTasking",
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tarefas",
          tabBarIcon: ({ color }) => <TabIcon label="◎" color={color} />,
          headerTitle: "Missões do dia",
        }}
      />
      <Tabs.Screen
        name="completed"
        options={{
          title: "Concluídas",
          tabBarIcon: ({ color }) => <TabIcon label="✓" color={color} />,
          headerTitle: "Missões concluídas",
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progresso",
          tabBarIcon: ({ color }) => <TabIcon label="▲" color={color} />,
          headerTitle: "Seu progresso",
        }}
      />
    </Tabs>
  );
}
