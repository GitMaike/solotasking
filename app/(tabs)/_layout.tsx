import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { LevelUpModal } from "../../components/LevelUpModal.web";
import { TourGuide } from "../../components/TourGuide.web";
import { XPFloatLayer } from "../../components/XPFloat.web";
import { useTheme } from "../../hooks/useThemes";
import { t } from "../../locales";

function TabIcon({ label, color }: { label: string; color: string }) {
  return <Text style={{ color, fontSize: 20 }}>{label}</Text>;
}

function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <div
      onClick={toggle}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        marginRight: 12,
        backgroundColor: isDark ? "#0f0f1a" : "#f0f0f0",
        border: `1.5px solid ${isDark ? "#534AB7" : "#d0b040"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: isDark
          ? "0 0 12px rgba(83,74,183,0.4)"
          : "0 0 12px rgba(208,176,64,0.3)",
        fontSize: 18,
      }}
    >
      <span
        style={{
          display: "inline-block",
          transition: "transform 0.4s ease",
          transform: isDark ? "rotate(0deg)" : "rotate(180deg)",
        }}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </div>
  );
}

export default function TabLayout() {
  const { isDark } = useTheme();
  const activeColor = "#7F77DD";
  const inactiveColor = isDark ? "#444441" : "#888780";
  const bgColor = isDark ? "#0a0a0f" : "#ffffff";
  const textColor = isDark ? "#e8e6f0" : "#0a0a0f";

  return (
    <>
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
          headerTintColor: textColor,
          headerShown: true,
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ThemeToggle />
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("tabs.home"),
            tabBarIcon: ({ color }) => <TabIcon label="⌂" color={color} />,
            headerTitle: t("home.title"),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: t("tabs.tasks"),
            tabBarIcon: ({ color }) => <TabIcon label="◎" color={color} />,
            headerTitle: t("tasks.title"),
          }}
        />
        <Tabs.Screen
          name="friends"
          options={{
            title: t("tabs.friends"),
            headerTitle: t("friends.title"),
            tabBarIcon: ({ color }) => <TabIcon label="⚔" color={color} />,
            tabBarButton: (props) => (
              <div id="tour-tab-guilda" style={{ flex: 1, display: "flex" }}>
                {props.children as React.ReactNode}
              </div>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t("tabs.profile"),
            tabBarIcon: ({ color }) => <TabIcon label="◈" color={color} />,
            headerTitle: t("profile.title"),
          }}
        />
        <Tabs.Screen name="progress" options={{ href: null }} />
        <Tabs.Screen name="completed" options={{ href: null }} />
      </Tabs>

      <XPFloatLayer />
      <LevelUpModal />
      <TourGuide />
    </>
  );
}
