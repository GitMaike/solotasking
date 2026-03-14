import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { RANKS } from "../../constants/game";
import { usePlayerStore, useRank } from "../../store/playerStore";
import { useTaskStore } from "../../store/taskStore";

export default function ProgressScreen() {
  const { level, xpAtual, xpTotal, streak } = usePlayerStore();
  const { concluidas } = useTaskStore();
  const rank = useRank();
  const dark = useColorScheme() === "dark";
  const s = dark ? darkStyles : lightStyles;

  const proximoRank = RANKS.find((r) => r.xpMinimo > xpTotal);

  return (
    <ScrollView style={s.container}>
      {/* Rank atual */}
      <View style={s.rankCard}>
        <Text style={s.rankLetra}>{rank.letra}</Text>
        <View>
          <Text style={s.rankNome}>{rank.nome}</Text>
          <Text style={s.rankSub}>
            Rank {rank.letra} · Nível {level}
          </Text>
        </View>
      </View>

      {/* Stats grid */}
      <View style={s.grid}>
        <View style={s.statCard}>
          <Text style={s.statNum}>{xpTotal.toLocaleString("pt-BR")}</Text>
          <Text style={s.statLabel}>XP total</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statNum}>{level}</Text>
          <Text style={s.statLabel}>level</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statNum}>{streak}</Text>
          <Text style={s.statLabel}>streak dias</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statNum}>{concluidas.length}</Text>
          <Text style={s.statLabel}>concluídas</Text>
        </View>
      </View>

      {/* Próximo rank */}
      {proximoRank && (
        <View style={s.card}>
          <Text style={s.sectionTitle}>Próximo rank</Text>
          <Text style={s.proximoRankLetra}>
            {proximoRank.letra} — {proximoRank.nome}
          </Text>
          <Text style={s.proximoXP}>
            Faltam {(proximoRank.xpMinimo - xpTotal).toLocaleString("pt-BR")} XP
          </Text>
        </View>
      )}

      {/* Tabela de ranks */}
      <View style={s.card}>
        <Text style={s.sectionTitle}>Tabela de ranks</Text>
        {RANKS.map((r) => {
          const ativo = r.letra === rank.letra;
          return (
            <View key={r.letra} style={[s.rankRow, ativo && s.rankRowAtivo]}>
              <Text style={[s.rankRowLetra, ativo && { color: "#7F77DD" }]}>
                {r.letra}
              </Text>
              <Text style={[s.rankRowNome, ativo && { color: "#7F77DD" }]}>
                {r.nome}
              </Text>
              <Text style={s.rankRowXP}>
                {r.xpMinimo.toLocaleString("pt-BR")} XP
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const base = {
  container: { flex: 1, padding: 16 },
  rankCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 0.5,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 16,
  },
  rankLetra: {
    fontSize: 48,
    fontWeight: "500" as const,
    color: "#7F77DD",
    lineHeight: 56,
  },
  rankNome: { fontSize: 18, fontWeight: "500" as const },
  rankSub: { fontSize: 13, color: "#888780", marginTop: 2 },
  grid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
    marginBottom: 12,
  },
  statCard: {
    width: "48%" as const,
    borderRadius: 10,
    padding: 14,
    borderWidth: 0.5,
    alignItems: "center" as const,
  },
  statNum: { fontSize: 24, fontWeight: "500" as const, color: "#7F77DD" },
  statLabel: { fontSize: 12, color: "#888780", marginTop: 4 },
  card: { borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 0.5 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "500" as const,
    color: "#888780",
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
    marginBottom: 12,
  },
  proximoRankLetra: {
    fontSize: 16,
    fontWeight: "500" as const,
    marginBottom: 4,
  },
  proximoXP: { fontSize: 13, color: "#888780" },
  rankRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 10,
    borderTopWidth: 0.5,
  },
  rankRowAtivo: {},
  rankRowLetra: { width: 28, fontSize: 15, fontWeight: "500" as const },
  rankRowNome: { flex: 1, fontSize: 14 },
  rankRowXP: { fontSize: 12, color: "#888780" },
};

const lightStyles = StyleSheet.create({
  ...base,
  container: { ...base.container, backgroundColor: "#f5f5f5" },
  rankCard: {
    ...base.rankCard,
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
  },
  rankNome: { ...base.rankNome, color: "#0a0a0f" },
  statCard: {
    ...base.statCard,
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
  },
  card: { ...base.card, backgroundColor: "#fff", borderColor: "#e0e0e0" },
  proximoRankLetra: { ...base.proximoRankLetra, color: "#0a0a0f" },
  rankRow: { ...base.rankRow, borderTopColor: "#f0f0f0" },
  rankRowLetra: { ...base.rankRowLetra, color: "#0a0a0f" },
  rankRowNome: { ...base.rankRowNome, color: "#0a0a0f" },
});

const darkStyles = StyleSheet.create({
  ...base,
  container: { ...base.container, backgroundColor: "#0a0a0f" },
  rankCard: {
    ...base.rankCard,
    backgroundColor: "#0f0f1a",
    borderColor: "#1a1630",
  },
  rankNome: { ...base.rankNome, color: "#e8e6f0" },
  statCard: {
    ...base.statCard,
    backgroundColor: "#0f0f1a",
    borderColor: "#1a1630",
  },
  card: { ...base.card, backgroundColor: "#0f0f1a", borderColor: "#1a1630" },
  proximoRankLetra: { ...base.proximoRankLetra, color: "#e8e6f0" },
  rankRow: { ...base.rankRow, borderTopColor: "#1a1630" },
  rankRowLetra: { ...base.rankRowLetra, color: "#e8e6f0" },
  rankRowNome: { ...base.rankRowNome, color: "#e8e6f0" },
});
