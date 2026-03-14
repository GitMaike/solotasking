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
          <Text style={s.emptyText}>Nenhuma missão no histórico ainda</Text>
          <Text style={s.emptySubText}>
            Complete ou remova tarefas para ver aqui
          </Text>
        </View>
      ) : (
        concluidas.map((t) => (
          <View
            key={t.id + t.concluidaEm}
            style={[s.card, t.removida && s.cardRemovida]}
          >
            <View style={s.cardTop}>
              <View
                style={[
                  s.catDot,
                  {
                    backgroundColor: t.removida
                      ? "#993C1D"
                      : (CATEGORIA_COR[t.categoria] ?? "#534AB7"),
                  },
                ]}
              />
              <Text
                style={[s.taskNome, t.removida && s.taskNomeRemovida]}
                numberOfLines={2}
              >
                {t.nome}
              </Text>
              {t.removida ? (
                <Text style={s.xpRemovido}>-{t.xpCobrado} XP</Text>
              ) : (
                <Text style={s.xpGanho}>+{t.xp} XP</Text>
              )}
            </View>

            <View style={s.cardBottom}>
              <Text style={s.dateText}>
                {new Date(t.concluidaEm).toLocaleDateString("pt-BR")}
              </Text>
              <View
                style={[
                  s.badge,
                  t.removida ? s.badgeRemovida : s.badgeConcluida,
                ]}
              >
                <Text
                  style={[
                    s.badgeText,
                    t.removida ? s.badgeTextRemovida : s.badgeTextConcluida,
                  ]}
                >
                  {t.removida ? "removida pelo usuário" : t.categoria}
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
  cardRemovida: { opacity: 0.7 },
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
  taskNomeRemovida: { textDecorationLine: "line-through" as const },
  xpGanho: { fontSize: 13, color: "#1D9E75", fontWeight: "500" as const },
  xpRemovido: { fontSize: 13, color: "#D85A30", fontWeight: "500" as const },
  cardBottom: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  dateText: { fontSize: 11 },
  badge: {
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeConcluida: { borderColor: "#1D9E75" },
  badgeRemovida: { borderColor: "#993C1D" },
  badgeText: { fontSize: 10, fontWeight: "500" as const },
  badgeTextConcluida: { color: "#1D9E75" },
  badgeTextRemovida: { color: "#D85A30" },
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
