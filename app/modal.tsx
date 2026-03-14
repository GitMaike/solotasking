import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { type Dificuldade } from "../constants/game";
import { useTaskStore, type Categoria } from "../store/taskStore";

const CATEGORIAS_PADRAO: { id: Categoria; nome: string }[] = [
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

// Botão cross-platform: usa onClick no web, onPress no nativo
function Btn({
  onPress,
  style,
  children,
}: {
  onPress: () => void;
  style?: any;
  children: React.ReactNode;
}) {
  if (Platform.OS === "web") {
    return (
      <div
        onClick={onPress}
        style={{ cursor: "pointer", userSelect: "none", ...style }}
      >
        {children}
      </div>
    );
  }
  const { TouchableOpacity } = require("react-native");
  return (
    <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

export default function ModalScreen() {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [dificuldade, setDificuldade] = useState<Dificuldade | null>(null);
  const [categoriaCustom, setCategoriaCustom] = useState("");
  const [mostrarCampoCustom, setMostrarCampoCustom] = useState(false);
  const { criarTarefa } = useTaskStore();
  const router = useRouter();
  const dark = useColorScheme() === "dark";

  const podeSalvar =
    nome.trim().length > 0 && categoria !== null && dificuldade !== null;

  const salvar = () => {
    if (!podeSalvar) return;
    criarTarefa({
      nome: nome.trim(),
      categoria: categoria!,
      dificuldade: dificuldade!,
    });
    router.replace("/(tabs)/tasks");
  };

  const voltar = () => router.replace("/(tabs)/tasks");

  const bg = dark ? "#0a0a0f" : "#f5f5f5";
  const cardBg = dark ? "#0f0f1a" : "#ffffff";
  const border = dark ? "#1a1630" : "#e0e0e0";
  const textPrimary = dark ? "#e8e6f0" : "#0a0a0f";
  const textMuted = "#888780";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 0.5,
          borderColor: border,
        }}
      >
        <Btn onPress={voltar} style={{ marginRight: 16, padding: 4 }}>
          <Text style={{ fontSize: 16, color: "#7F77DD", fontWeight: "500" }}>
            ← Voltar
          </Text>
        </Btn>
        <Text style={{ fontSize: 17, fontWeight: "500", color: textPrimary }}>
          Nova missão
        </Text>
      </View>

      {/* Formulário */}
      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "500",
            color: textMuted,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Nome da missão
        </Text>
        <TextInput
          style={{
            backgroundColor: cardBg,
            borderRadius: 10,
            padding: 14,
            fontSize: 15,
            borderWidth: 0.5,
            borderColor: border,
            color: textPrimary,
            marginBottom: 20,
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
            marginBottom: 8,
          }}
        >
          Categoria
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 8,
          }}
        >
          {CATEGORIAS_PADRAO.map((c) => {
            const sel = categoria === c.id;
            return (
              <Btn
                key={c.id}
                onPress={() => {
                  setCategoria(c.id);
                  setMostrarCampoCustom(false);
                }}
                style={{
                  paddingLeft: 14,
                  paddingRight: 14,
                  paddingTop: 9,
                  paddingBottom: 9,
                  borderRadius: 8,
                  borderWidth: sel ? 1.5 : 0.5,
                  borderColor: sel ? "#534AB7" : border,
                  backgroundColor: sel ? "#1a1630" : cardBg,
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
              </Btn>
            );
          })}
          <Btn
            onPress={() => {
              setMostrarCampoCustom(true);
              setCategoria(null);
            }}
            style={{
              paddingLeft: 14,
              paddingRight: 14,
              paddingTop: 9,
              paddingBottom: 9,
              borderRadius: 8,
              borderWidth: mostrarCampoCustom ? 1.5 : 0.5,
              borderColor: mostrarCampoCustom ? "#534AB7" : border,
              backgroundColor: mostrarCampoCustom ? "#1a1630" : cardBg,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "500",
                color: mostrarCampoCustom ? "#7F77DD" : textMuted,
              }}
            >
              + Outra
            </Text>
          </Btn>
        </View>

        {mostrarCampoCustom && (
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
            <TextInput
              style={{
                flex: 1,
                backgroundColor: cardBg,
                borderRadius: 8,
                padding: 10,
                fontSize: 14,
                borderWidth: 0.5,
                borderColor: "#534AB7",
                color: textPrimary,
              }}
              value={categoriaCustom}
              onChangeText={setCategoriaCustom}
              placeholder="Nome da categoria"
              placeholderTextColor="#5F5E5A"
              maxLength={20}
              autoFocus
            />
            <Btn
              onPress={() => {
                if (categoriaCustom.trim())
                  setCategoria(
                    categoriaCustom
                      .trim()
                      .toLowerCase()
                      .replace(/\s/g, "_") as Categoria,
                  );
              }}
              style={{
                backgroundColor: "#534AB7",
                borderRadius: 8,
                paddingLeft: 14,
                paddingRight: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "500" }}>Ok</Text>
            </Btn>
          </View>
        )}
        {mostrarCampoCustom && categoria && (
          <Text style={{ fontSize: 12, color: "#1D9E75", marginBottom: 8 }}>
            ✓ Categoria: {categoria}
          </Text>
        )}

        <Text
          style={{
            fontSize: 11,
            fontWeight: "500",
            color: textMuted,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            marginBottom: 8,
            marginTop: 12,
          }}
        >
          Dificuldade
        </Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 32 }}>
          {DIFICULDADES.map((d) => {
            const sel = dificuldade === d.id;
            return (
              <Btn
                key={d.id}
                onPress={() => setDificuldade(d.id)}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: sel ? 1.5 : 0.5,
                  borderColor: sel ? "#534AB7" : border,
                  backgroundColor: sel ? "#1a1630" : cardBg,
                  display: "flex",
                  flexDirection: "column",
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
              </Btn>
            );
          })}
        </View>

        <Btn
          onPress={salvar}
          style={{
            backgroundColor: podeSalvar
              ? "#534AB7"
              : dark
                ? "#1a1630"
                : "#d0d0d0",
            borderRadius: 12,
            padding: 16,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: podeSalvar ? "#fff" : textMuted,
              fontSize: 15,
              fontWeight: "500",
            }}
          >
            Adicionar missão
          </Text>
        </Btn>
      </View>
    </SafeAreaView>
  );
}
