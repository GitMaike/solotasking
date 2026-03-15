import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getSubRank } from "../../constants/game";
import { useTheme } from "../../hooks/useThemes";
import { useAuthStore } from "../../store/authStore";
import { usePlayerStore } from "../../store/playerStore";
import { carregarDadosDoUsuario } from "../../store/syncStore";
import { useTaskStore } from "../../store/taskStore";
import { useTourStore } from "../../store/tourStore";

export default function DashboardScreen() {
  const { xpAtual, level, xpTotal, streak, verificarStreak } = usePlayerStore();
  const { pendentes, concluidas, verificarExpiradas } = useTaskStore();
  const { user } = useAuthStore();
  const { tourCompleto, iniciarTour } = useTourStore();
  const rank = getSubRank(xpTotal);
  const { isDark: dark } = useTheme();
  const s = dark ? darkStyles : lightStyles;

  useEffect(() => {
    verificarStreak();
    verificarExpiradas();
    if (user) {
      carregarDadosDoUsuario(user.id);
      if (!tourCompleto) {
        setTimeout(() => iniciarTour(), 1500);
      }
    }
  }, [user]);

  const xpNecessario = level * 200;
  const progresso = xpNecessario > 0 ? xpAtual / xpNecessario : 0;

  return (
    <ScrollView style={s.container}>
      <View nativeID="tour-dashboard-rank" style={s.card}>
        <View style={s.rankRow}>
          <View nativeID="tour-rank-badge" style={s.rankBadge}>
            <Text style={s.rankLetra}>{rank.rank}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.rankNome}>{rank.nome}</Text>
            <Text style={s.levelText}>Nível {level}</Text>
          </View>
          <View nativeID="tour-streak" style={s.streakBadge}>
            <Text style={s.streakNum}>{streak}</Text>
            <Text style={s.streakLabel}>streak</Text>
          </View>
        </View>

        <View style={s.xpBarBg}>
          <View
            style={[
              s.xpBarFill,
              { width: `${Math.min(progresso * 100, 100)}%` as any },
            ]}
          />
        </View>
        <View style={s.xpLabels}>
          <Text style={s.xpText}>{xpAtual} XP</Text>
          <Text style={s.xpText}>{xpNecessario} XP</Text>
        </View>
      </View>

      <View style={s.statsRow}>
        <View style={s.statCard}>
          <Text style={s.statNum}>{xpTotal}</Text>
          <Text style={s.statLabel}>XP total</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statNum}>{pendentes.length}</Text>
          <Text style={s.statLabel}>pendentes</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statNum}>
            {concluidas.filter((t) => !t.removida).length}
          </Text>
          <Text style={s.statLabel}>concluídas</Text>
        </View>
      </View>

      {pendentes.length === 0 ? (
        <View style={s.emptyCard}>
          <Text style={s.emptyText}>Nenhuma missão pendente.</Text>
          <Text style={s.emptySubText}>
            Vá para a aba Tarefas para criar uma.
          </Text>
        </View>
      ) : (
        <View style={s.card}>
          <Text style={s.sectionTitle}>Missões de hoje</Text>
          {pendentes.slice(0, 3).map((t) => (
            <View key={t.id} style={s.taskRow}>
              <View style={s.taskDot} />
              <Text style={s.taskNome} numberOfLines={1}>
                {t.nome}
              </Text>
              <Text style={s.taskXP}>+{t.xp} XP</Text>
            </View>
          ))}
          {pendentes.length > 3 && (
            <Text style={s.maisText}>
              +{pendentes.length - 3} mais na aba Tarefas
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const base = {
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 0.5 },
  rankRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
    marginBottom: 16,
  },
  rankBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#534AB7",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  rankLetra: { fontSize: 20, fontWeight: "500" as const, color: "#7F77DD" },
  rankNome: { fontSize: 14, fontWeight: "500" as const },
  levelText: { fontSize: 12, marginTop: 2, color: "#888780" },
  streakBadge: {
    alignItems: "center" as const,
    borderRadius: 8,
    padding: 8,
    minWidth: 52,
  },
  streakNum: { fontSize: 20, fontWeight: "500" as const },
  streakLabel: { fontSize: 10, color: "#888780" },
  xpBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden" as const,
    marginBottom: 4,
  },
  xpBarFill: {
    height: "100%" as const,
    backgroundColor: "#534AB7",
    borderRadius: 4,
  },
  xpLabels: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
  },
  xpText: { fontSize: 11, color: "#888780" },
  statsRow: { flexDirection: "row" as const, gap: 8, marginBottom: 12 },
  statCard: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: "center" as const,
    borderWidth: 0.5,
  },
  statNum: { fontSize: 22, fontWeight: "500" as const, color: "#7F77DD" },
  statLabel: { fontSize: 11, color: "#888780", marginTop: 2 },
  emptyCard: {
    borderRadius: 12,
    padding: 24,
    alignItems: "center" as const,
    borderWidth: 0.5,
  },
  emptyText: { fontSize: 14, fontWeight: "500" as const, marginBottom: 4 },
  emptySubText: { fontSize: 12, color: "#888780" },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "500" as const,
    color: "#888780",
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
    marginBottom: 12,
  },
  taskRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 0.5,
  },
  taskDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#534AB7" },
  taskNome: { flex: 1, fontSize: 14 },
  taskXP: { fontSize: 12, color: "#7F77DD", fontWeight: "500" as const },
  maisText: {
    fontSize: 12,
    color: "#888780",
    marginTop: 8,
    textAlign: "center" as const,
  },
};

const lightStyles = StyleSheet.create({
  ...base,
  container: { ...base.container, backgroundColor: "#f5f5f5" },
  card: { ...base.card, backgroundColor: "#ffffff", borderColor: "#e0e0e0" },
  rankBadge: { ...base.rankBadge, backgroundColor: "#f0effe" },
  rankNome: { ...base.rankNome, color: "#0a0a0f" },
  streakBadge: { ...base.streakBadge, backgroundColor: "#f0effe" },
  streakNum: { ...base.streakNum, color: "#534AB7" },
  xpBarBg: { ...base.xpBarBg, backgroundColor: "#e0e0e0" },
  statCard: {
    ...base.statCard,
    backgroundColor: "#ffffff",
    borderColor: "#e0e0e0",
  },
  emptyCard: {
    ...base.emptyCard,
    backgroundColor: "#ffffff",
    borderColor: "#e0e0e0",
  },
  emptyText: { ...base.emptyText, color: "#0a0a0f" },
  taskRow: { ...base.taskRow, borderTopColor: "#f0f0f0" },
  taskNome: { ...base.taskNome, color: "#0a0a0f" },
});

const darkStyles = StyleSheet.create({
  ...base,
  container: { ...base.container, backgroundColor: "#0a0a0f" },
  card: { ...base.card, backgroundColor: "#0f0f1a", borderColor: "#1a1630" },
  rankBadge: { ...base.rankBadge, backgroundColor: "#1a1630" },
  rankNome: { ...base.rankNome, color: "#e8e6f0" },
  streakBadge: { ...base.streakBadge, backgroundColor: "#1a1630" },
  streakNum: { ...base.streakNum, color: "#7F77DD" },
  xpBarBg: { ...base.xpBarBg, backgroundColor: "#1a1630" },
  statCard: {
    ...base.statCard,
    backgroundColor: "#0f0f1a",
    borderColor: "#1a1630",
  },
  emptyCard: {
    ...base.emptyCard,
    backgroundColor: "#0f0f1a",
    borderColor: "#1a1630",
  },
  emptyText: { ...base.emptyText, color: "#e8e6f0" },
  taskRow: { ...base.taskRow, borderTopColor: "#1a1630" },
  taskNome: { ...base.taskNome, color: "#e8e6f0" },
});
