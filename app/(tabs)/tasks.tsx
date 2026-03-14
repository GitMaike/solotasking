import { useRouter } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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

export default function TasksScreen() {
  const { pendentes, concluirTarefa, apagarTarefa } = useTaskStore();
  const router = useRouter();
  const dark = useColorScheme() === "dark";
  const s = dark ? darkStyles : lightStyles;

  const confirmarApagarTarefa = (id: string, nome: string) => {
    Alert.alert(
      "Apagar missão",
      `Apagar "${nome}" custa 25 XP e pode regredir seu level. Confirmar?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar (-25 XP)",
          style: "destructive",
          onPress: () => apagarTarefa(id),
        },
      ],
    );
  };

  return (
    <View style={s.container}>
      <ScrollView style={{ flex: 1 }}>
        {pendentes.length === 0 ? (
          <View style={s.emptyCard}>
            <Text style={s.emptyText}>Nenhuma missão pendente</Text>
            <Text style={s.emptySubText}>
              Toque em + para criar uma nova missão
            </Text>
          </View>
        ) : (
          pendentes.map((t) => (
            <View key={t.id} style={s.card}>
              <View style={s.cardTop}>
                <View
                  style={[
                    s.catDot,
                    {
                      backgroundColor: CATEGORIA_COR[t.categoria] ?? "#534AB7",
                    },
                  ]}
                />
                <Text style={s.taskNome} numberOfLines={2}>
                  {t.nome}
                </Text>
                <Text style={s.taskXP}>+{t.xp} XP</Text>
              </View>
              <View style={s.cardBottom}>
                <View style={s.pills}>
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
                  <View style={s.pill}>
                    <Text style={s.pillText}>{t.dificuldade}</Text>
                  </View>
                </View>
                <View style={s.actions}>
                  <TouchableOpacity
                    style={s.btnDelete}
                    onPress={() => confirmarApagarTarefa(t.id, t.nome)}
                  >
                    <Text style={s.btnDeleteText}>Apagar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={s.btnComplete}
                    onPress={() => concluirTarefa(t.id)}
                  >
                    <Text style={s.btnCompleteText}>Concluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Botão flutuante para adicionar */}
      <TouchableOpacity style={s.fab} onPress={() => router.push("/modal")}>
        <Text style={s.fabText}>+</Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 12,
  },
  catDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  taskNome: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 20,
  },
  taskXP: { fontSize: 13, color: "#7F77DD", fontWeight: "500" as const },
  cardBottom: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  pills: { flexDirection: "row" as const, gap: 6 },
  pill: {
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillText: { fontSize: 10, fontWeight: "500" as const },
  actions: { flexDirection: "row" as const, gap: 8 },
  btnDelete: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#993C1D",
  },
  btnDeleteText: { fontSize: 12, color: "#D85A30", fontWeight: "500" as const },
  btnComplete: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#534AB7",
  },
  btnCompleteText: { fontSize: 12, color: "#fff", fontWeight: "500" as const },
  fab: {
    position: "absolute" as const,
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#534AB7",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  fabText: { color: "#fff", fontSize: 28, lineHeight: 32 },
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
  pill: { ...base.pill, borderColor: "#e0e0e0" },
  pillText: { ...base.pillText, color: "#888780" },
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
  pill: { ...base.pill, borderColor: "#333" },
  pillText: { ...base.pillText, color: "#888780" },
});
