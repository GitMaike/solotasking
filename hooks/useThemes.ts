import { useColorScheme } from "react-native";
import { useThemeStore } from "../store/themeStore";

export function useTheme() {
  const system = useColorScheme();
  const { preference, setPreference } = useThemeStore();

  const isDark =
    preference === "system" ? system === "dark" : preference === "dark";

  const toggle = () => {
    setPreference(isDark ? "light" : "dark");
  };

  return { isDark, toggle, preference };
}
