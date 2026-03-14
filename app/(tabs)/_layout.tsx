import { Tabs } from "expo-router";
import { Text, useColorScheme } from "react-native";

function TabIcon({ label, color }: { label: string; color: string }) {
  return <Text style={{ color, fontSize: 20 }}>{label}</Text>;
}

export default function TabLayout() {
  const dark = useColorScheme() === "dark";
  const activeColor = "#7F77DD";
  const inactiveColor = dark ? "#444441" : "#888780";
  const bgColor = dark ? "#0a0a0f" : "#ffffff";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopColor: dark ? "#1a1630" : "#e0e0e0",
          borderTopWidth: 0.5,
        },
        headerStyle: { backgroundColor: bgColor },
        headerTintColor: dark ? "#e8e6f0" : "#0a0a0f",
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
