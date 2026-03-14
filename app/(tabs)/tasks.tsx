import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { type Dificuldade } from "../../constants/game";
import { useTaskStore, type Categoria } from "../../store/taskStore";

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

const CATEGORIA_COR: Record<string, string> = {
  rotina: "#7F77DD",
  treino: "#1D9E75",
  estudos: "#378ADD",
  trabalho: "#D4537E",
  ingles: "#5DCAA5",
  musica: "#AFA9EC",
};

export default function TasksScreen() {
  const { pendentes, concluirTarefa, apagarTarefa, criarTarefa } =
    useTaskStore();
  const dark = useColorScheme() === "dark";

  const [mostrarForm, setMostrarForm] = useState(false);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [dificuldade, setDificuldade] = useState<Dificuldade | null>(null);

  const bg = dark ? "#0a0a0f" : "#f5f5f5";
  const cardBg = dark ? "#0f0f1a" : "#ffffff";
  const border = dark ? "#1a1630" : "#e0e0e0";
  const textPrimary = dark ? "#e8e6f0" : "#0a0a0f";
  const textMuted = "#888780";

  const podeSalvar =
    nome.trim().length > 0 && categoria !== null && dificuldade !== null;

  const salvar = () => {
    if (!podeSalvar) return;
    criarTarefa({
      nome: nome.trim(),
      categoria: categoria!,
      dificuldade: dificuldade!,
    });
    setNome("");
    setCategoria(null);
    setDificuldade(null);
    setMostrarForm(false);
  };

  const confirmarApagar = (id: string, taskNome: string) => {
    Alert.alert(
      "Apagar missão",
      `Apagar "${taskNome}" custa 25 XP. Confirmar?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: () => apagarTarefa(id),
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="always"
      >
        {/* Botão abrir/fechar formulário */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setMostrarForm((v) => !v)}
          style={{
            backgroundColor: mostrarForm ? "#3C3489" : "#534AB7",
            borderRadius: 10,
            padding: 14,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 15, fontWeight: "500" }}>
            {mostrarForm ? "✕ Cancelar" : "+ Nova missão"}
          </Text>
        </TouchableOpacity>

        {/* Formulário */}
        {mostrarForm && (
          <View
            style={{
              backgroundColor: cardBg,
              borderWidth: 0.5,
              borderColor: border,
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "500",
                color: textMuted,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Nome
            </Text>
            <TextInput
              style={{
                backgroundColor: bg,
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                borderWidth: 0.5,
                borderColor: border,
                color: textPrimary,
                marginBottom: 14,
              }}
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Estudar 30 minutos"
              placeholderTextColor="#5F5E5A"
              maxLength={80}
            />

            <Text
              style={{
                fontSize: 11,
                fontWeight: "500",
                color: textMuted,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Categoria
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 14,
              }}
            >
              {CATEGORIAS.map((c) => {
                const sel = categoria === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    activeOpacity={0.7}
                    onPress={() => setCategoria(c.id)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 9,
                      borderRadius: 8,
                      borderWidth: sel ? 1.5 : 0.5,
                      borderColor: sel ? "#534AB7" : border,
                      backgroundColor: sel ? "#1a1630" : bg,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "500",
                        color: sel ? "#7F77DD" : textPrimary,
                      }}
                    >
                      {c.nome}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text
              style={{
                fontSize: 11,
                fontWeight: "500",
                color: textMuted,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Dificuldade
            </Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
              {DIFICULDADES.map((d) => {
                const sel = dificuldade === d.id;
                return (
                  <TouchableOpacity
                    key={d.id}
                    activeOpacity={0.7}
                    onPress={() => setDificuldade(d.id)}
                    style={{
                      flex: 1,
                      padding: 10,
                      borderRadius: 8,
                      borderWidth: sel ? 1.5 : 0.5,
                      borderColor: sel ? "#534AB7" : border,
                      backgroundColor: sel ? "#1a1630" : bg,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "500",
                        color: sel ? "#7F77DD" : textPrimary,
                        marginBottom: 2,
                      }}
                    >
                      {d.nome}
                    </Text>
                    <Text style={{ fontSize: 10, color: textMuted }}>
                      +{d.xp} XP
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              activeOpacity={podeSalvar ? 0.8 : 1}
              onPress={salvar}
              style={{
                backgroundColor: podeSalvar
                  ? "#534AB7"
                  : dark
                    ? "#1a1630"
                    : "#d0d0d0",
                borderRadius: 10,
                padding: 14,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: podeSalvar ? "#fff" : textMuted,
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                Adicionar missão
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lista de tarefas */}
        {pendentes.length === 0 && !mostrarForm && (
          <View
            style={{
              backgroundColor: cardBg,
              borderWidth: 0.5,
              borderColor: border,
              borderRadius: 12,
              padding: 32,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                color: textPrimary,
                marginBottom: 6,
              }}
            >
              Nenhuma missão pendente
            </Text>
            <Text style={{ fontSize: 13, color: textMuted }}>
              Toque em "+ Nova missão" para criar uma
            </Text>
          </View>
        )}

        {pendentes.map((t) => (
          <View
            key={t.id}
            style={{
              backgroundColor: cardBg,
              borderWidth: 0.5,
              borderColor: border,
              borderRadius: 12,
              padding: 14,
              marginBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: CATEGORIA_COR[t.categoria] ?? "#534AB7",
                  marginTop: 6,
                }}
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: "500",
                  color: textPrimary,
                  lineHeight: 20,
                }}
              >
                {t.nome}
              </Text>
              <Text
                style={{ fontSize: 13, color: "#7F77DD", fontWeight: "500" }}
              >
                +{t.xp} XP
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", gap: 6 }}>
                <View
                  style={{
                    borderWidth: 0.5,
                    borderRadius: 10,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderColor: CATEGORIA_COR[t.categoria] ?? "#534AB7",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: CATEGORIA_COR[t.categoria] ?? "#534AB7",
                      fontWeight: "500",
                    }}
                  >
                    {t.categoria}
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 0.5,
                    borderRadius: 10,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderColor: border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: textMuted,
                      fontWeight: "500",
                    }}
                  >
                    {t.dificuldade}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => confirmarApagar(t.id, t.nome)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    borderWidth: 0.5,
                    borderColor: "#993C1D",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#D85A30",
                      fontWeight: "500",
                    }}
                  >
                    Apagar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => concluirTarefa(t.id)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    backgroundColor: "#534AB7",
                  }}
                >
                  <Text
                    style={{ fontSize: 12, color: "#fff", fontWeight: "500" }}
                  >
                    Concluir
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
