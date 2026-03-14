import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { type Dificuldade } from "../constants/game";
import { useTaskStore, type Categoria } from "../store/taskStore";

const CATEGORIAS: { id: Categoria; nome: string }[] = [
  { id: "rotina", nome: "Rotina" },
  { id: "treino", nome: "Treino" },
  { id: "estudos", nome: "Estudos" },
  { id: "trabalho", nome: "Trabalho" },
  { id: "ingles", nome: "Inglês" },
  { id: "musica", nome: "Música" },
];

const DIFICULDADES: { id: Dificuldade; nome: string; xp: number }[] = [
  { id: "facil", nome: "Fácil", xp: 10 },
  { id: "medio", nome: "Médio", xp: 25 },
  { id: "dificil", nome: "Difícil", xp: 50 },
  { id: "epico", nome: "Épico", xp: 100 },
];

export default function ModalScreen() {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [dificuldade, setDificuldade] = useState<Dificuldade | null>(null);
  const { criarTarefa } = useTaskStore();
  const router = useRouter();
  const dark = useColorScheme() === "dark";
  const s = dark ? darkStyles : lightStyles;

  const podeSalvar =
    nome.trim().length > 0 && categoria !== null && dificuldade !== null;

  const salvar = () => {
    if (!podeSalvar) return;
    criarTarefa({
      nome: nome.trim(),
      categoria: categoria!,
      dificuldade: dificuldade!,
    });
    router.back();
  };

  return (
    <ScrollView style={s.container}>
      <Text style={s.label}>Nome da missão</Text>
      <TextInput
        style={s.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Ex: Estudar 30 minutos"
        placeholderTextColor="#5F5E5A"
        maxLength={80}
      />

      <Text style={s.label}>Categoria</Text>
      <View style={s.grid}>
        {CATEGORIAS.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[s.optBtn, categoria === c.id && s.optBtnSel]}
            onPress={() => setCategoria(c.id)}
          >
            <Text style={[s.optText, categoria === c.id && s.optTextSel]}>
              {c.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={s.label}>Dificuldade</Text>
      <View style={s.row}>
        {DIFICULDADES.map((d) => (
          <TouchableOpacity
            key={d.id}
            style={[s.diffBtn, dificuldade === d.id && s.diffBtnSel]}
            onPress={() => setDificuldade(d.id)}
          >
            <Text style={[s.diffNome, dificuldade === d.id && s.diffNomeSel]}>
              {d.nome}
            </Text>
            <Text style={s.diffXP}>+{d.xp} XP</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[s.saveBtn, !podeSalvar && s.saveBtnDisabled]}
        onPress={salvar}
        disabled={!podeSalvar}
      >
        <Text style={s.saveBtnText}>Adicionar missão</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const base = {
  container: { flex: 1, padding: 20 },
  label: {
    fontSize: 11,
    fontWeight: "500" as const,
    color: "#888780",
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
    marginBottom: 8,
    marginTop: 20,
  },
  input: { borderRadius: 10, padding: 14, fontSize: 15, borderWidth: 0.5 },
  grid: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 8 },
  optBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  optBtnSel: { backgroundColor: "#1a1630", borderColor: "#534AB7" },
  optText: { fontSize: 13, fontWeight: "500" as const },
  optTextSel: { color: "#7F77DD" },
  row: { flexDirection: "row" as const, gap: 8 },
  diffBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    alignItems: "center" as const,
  },
  diffBtnSel: { backgroundColor: "#1a1630", borderColor: "#534AB7" },
  diffNome: { fontSize: 12, fontWeight: "500" as const, marginBottom: 2 },
  diffNomeSel: { color: "#7F77DD" },
  diffXP: { fontSize: 10, color: "#888780" },
  saveBtn: {
    backgroundColor: "#534AB7",
    borderRadius: 12,
    padding: 16,
    alignItems: "center" as const,
    marginTop: 32,
    marginBottom: 40,
  },
  saveBtnDisabled: { backgroundColor: "#1a1630" },
  saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "500" as const },
};

const lightStyles = StyleSheet.create({
  ...base,
  container: { ...base.container, backgroundColor: "#f5f5f5" },
  input: {
    ...base.input,
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
    color: "#0a0a0f",
  },
  optBtn: { ...base.optBtn, backgroundColor: "#fff", borderColor: "#e0e0e0" },
  optText: { ...base.optText, color: "#0a0a0f" },
  diffBtn: { ...base.diffBtn, backgroundColor: "#fff", borderColor: "#e0e0e0" },
  diffNome: { ...base.diffNome, color: "#0a0a0f" },
});

const darkStyles = StyleSheet.create({
  ...base,
  container: { ...base.container, backgroundColor: "#0a0a0f" },
  input: {
    ...base.input,
    backgroundColor: "#0f0f1a",
    borderColor: "#1a1630",
    color: "#e8e6f0",
  },
  optBtn: {
    ...base.optBtn,
    backgroundColor: "#0f0f1a",
    borderColor: "#1a1630",
  },
  optText: { ...base.optText, color: "#e8e6f0" },
  diffBtn: {
    ...base.diffBtn,
    backgroundColor: "#0f0f1a",
    borderColor: "#1a1630",
  },
  diffNome: { ...base.diffNome, color: "#e8e6f0" },
});
