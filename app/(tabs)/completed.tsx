import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useTaskStore } from "../../store/taskStore";

const CATEGORIA_COR: Record<string, string> = {
  rotina: "#7F77DD",
  treino: "#1D9E75",
  estudos: "#378ADD",
  trabalho: "#D4537E",
  ingles: "#5DCAA5",
  musica: "#AFA9EC",
};

export default function CompletedScreen() {
  const { concluidas } = useTaskStore();
  const dark = useColorScheme() === "dark";
  const s = dark ? darkStyles : lightStyles;

  return (
    <ScrollView style={s.container}>
      {concluidas.length === 0 ? (
        <View style={s.emptyCard}>
          <Text style={s.emptyText}>Nenhuma missão concluída ainda</Text>
          <Text style={s.emptySubText}>
            Complete tarefas para ver seu histórico aqui
          </Text>
        </View>
      ) : (
        concluidas.map((t) => (
          <View key={t.id + t.concluidaEm} style={s.card}>
            <View style={s.cardTop}>
              <View
                style={[
                  s.catDot,
                  { backgroundColor: CATEGORIA_COR[t.categoria] ?? "#534AB7" },
                ]}
              />
              <Text style={s.taskNome} numberOfLines={2}>
                {t.nome}
              </Text>
              <Text style={s.taskXP}>+{t.xp} XP</Text>
            </View>
            <View style={s.cardBottom}>
              <Text style={s.dateText}>
                {new Date(t.concluidaEm).toLocaleDateString("pt-BR")}
              </Text>
              <View
                style={[
                  s.pill,
                  { borderColor: CATEGORIA_COR[t.categoria] ?? "#534AB7" },
                ]}
              >
                <Text
                  style={[
                    s.pillText,
                    { color: CATEGORIA_COR[t.categoria] ?? "#534AB7" },
                  ]}
                >
                  {t.categoria}
                </Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const base = {
  container: { flex: 1, padding: 16 },
  emptyCard: {
    borderRadius: 12,
    padding: 32,
    alignItems: "center" as const,
    marginTop: 40,
    borderWidth: 0.5,
  },
  emptyText: { fontSize: 15, fontWeight: "500" as const, marginBottom: 6 },
  emptySubText: { fontSize: 13 },
  card: { borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 0.5 },
  cardTop: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    gap: 10,
    marginBottom: 8,
  },
  catDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  taskNome: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 20,
  },
  taskXP: { fontSize: 13, color: "#1D9E75", fontWeight: "500" as const },
  cardBottom: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  dateText: { fontSize: 11 },
  pill: {
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillText: { fontSize: 10, fontWeight: "500" as const },
};

const lightStyles = StyleSheet.create({
  ...base,
  container: { ...base.container, backgroundColor: "#f5f5f5" },
  emptyCard: {
    ...base.emptyCard,
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
  },
  emptyText: { ...base.emptyText, color: "#0a0a0f" },
  emptySubText: { ...base.emptySubText, color: "#888780" },
  card: { ...base.card, backgroundColor: "#fff", borderColor: "#e0e0e0" },
  taskNome: { ...base.taskNome, color: "#0a0a0f" },
  dateText: { ...base.dateText, color: "#888780" },
});

const darkStyles = StyleSheet.create({
  ...base,
  container: { ...base.container, backgroundColor: "#0a0a0f" },
  emptyCard: {
    ...base.emptyCard,
    backgroundColor: "#0f0f1a",
    borderColor: "#1a1630",
  },
  emptyText: { ...base.emptyText, color: "#e8e6f0" },
  emptySubText: { ...base.emptySubText, color: "#888780" },
  card: { ...base.card, backgroundColor: "#0f0f1a", borderColor: "#1a1630" },
  taskNome: { ...base.taskNome, color: "#e8e6f0" },
  dateText: { ...base.dateText, color: "#888780" },
});
