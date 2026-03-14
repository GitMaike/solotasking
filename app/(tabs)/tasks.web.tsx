import { useState } from "react";
import { useColorScheme } from "react-native";
import { type Dificuldade } from "../../constants/game";
import { useTaskStore, type Categoria } from "../../store/taskStore";

const CATEGORIAS: { id: Categoria; nome: string }[] = [
  { id: "rotina", nome: "Rotina" },
  { id: "treino", nome: "Treino" },
  { id: "estudos", nome: "Estudos" },
  { id: "trabalho", nome: "Trabalho" },
];

const DIFICULDADES: { id: Dificuldade; nome: string; xp: number }[] = [
  { id: "facil", nome: "Fácil", xp: 10 },
  { id: "medio", nome: "Médio", xp: 25 },
  { id: "dificil", nome: "Difícil", xp: 50 },
  { id: "epico", nome: "Épico", xp: 100 },
];

const CAT_COR: Record<string, string> = {
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
  const [categoriaCustom, setCategoriaCustom] = useState("");
  const [mostrarCampoCustom, setMostrarCampoCustom] = useState(false);
  const [dificuldade, setDificuldade] = useState<Dificuldade | null>(null);
  const [modalApagar, setModalApagar] = useState<{
    id: string;
    nome: string;
  } | null>(null);

  const bg = dark ? "#0a0a0f" : "#f5f5f5";
  const card = dark ? "#0f0f1a" : "#ffffff";
  const bord = dark ? "#1a1630" : "#e0e0e0";
  const text = dark ? "#e8e6f0" : "#0a0a0f";
  const muted = "#888780";
  const input = dark ? "#070710" : "#f0f0f0";

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
    setCategoriaCustom("");
    setMostrarCampoCustom(false);
    setMostrarForm(false);
  };

  const confirmarApagar = () => {
    if (!modalApagar) return;
    apagarTarefa(modalApagar.id);
    setModalApagar(null);
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    color: muted,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: 8,
  };

  return (
    <div
      style={{
        backgroundColor: bg,
        minHeight: "100vh",
        padding: 16,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Botão nova missão */}
      <button
        onClick={() => setMostrarForm((v) => !v)}
        style={{
          width: "100%",
          backgroundColor: mostrarForm ? "#3C3489" : "#534AB7",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          padding: "14px 0",
          fontSize: 15,
          fontWeight: 500,
          cursor: "pointer",
          marginBottom: 16,
          fontFamily: "inherit",
          transition: "background 0.2s",
        }}
      >
        {mostrarForm ? "✕ Cancelar" : "+ Nova missão"}
      </button>

      {/* Formulário */}
      {mostrarForm && (
        <div
          style={{
            backgroundColor: card,
            border: `0.5px solid ${bord}`,
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <label style={labelStyle}>Nome da missão</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Estudar 30 minutos"
            maxLength={80}
            style={{
              width: "100%",
              backgroundColor: input,
              borderRadius: 8,
              padding: "12px 14px",
              fontSize: 14,
              border: `0.5px solid ${bord}`,
              color: text,
              outline: "none",
              marginBottom: 20,
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />

          <label style={labelStyle}>Categoria</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: mostrarCampoCustom ? 8 : 20,
            }}
          >
            {CATEGORIAS.map((c) => {
              const sel = categoria === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setCategoria(c.id);
                    setMostrarCampoCustom(false);
                    setCategoriaCustom("");
                  }}
                  style={{
                    padding: "9px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    border: `${sel ? 1.5 : 0.5}px solid ${sel ? "#534AB7" : bord}`,
                    backgroundColor: sel ? "#1a1630" : input,
                    color: sel ? "#7F77DD" : text,
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {c.nome}
                </button>
              );
            })}
            {/* Categoria customizada */}
            <button
              onClick={() => {
                setMostrarCampoCustom(true);
                setCategoria(null);
              }}
              style={{
                padding: "9px 16px",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "inherit",
                border: `${mostrarCampoCustom ? 1.5 : 0.5}px solid ${mostrarCampoCustom ? "#534AB7" : bord}`,
                backgroundColor: mostrarCampoCustom ? "#1a1630" : input,
                color: mostrarCampoCustom ? "#7F77DD" : muted,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              + Outra
            </button>
          </div>

          {mostrarCampoCustom && (
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input
                type="text"
                value={categoriaCustom}
                onChange={(e) => setCategoriaCustom(e.target.value)}
                placeholder="Nome da categoria"
                maxLength={20}
                autoFocus
                style={{
                  flex: 1,
                  backgroundColor: input,
                  borderRadius: 8,
                  padding: "10px 12px",
                  fontSize: 14,
                  border: `0.5px solid #534AB7`,
                  color: text,
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              <button
                onClick={() => {
                  if (categoriaCustom.trim()) {
                    setCategoria(
                      categoriaCustom
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, "_") as Categoria,
                    );
                  }
                }}
                style={{
                  backgroundColor: "#534AB7",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "0 16px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 500,
                  fontSize: 14,
                }}
              >
                Ok
              </button>
            </div>
          )}
          {mostrarCampoCustom && categoria && (
            <p style={{ fontSize: 12, color: "#1D9E75", margin: "0 0 16px" }}>
              ✓ Categoria: {categoria}
            </p>
          )}

          <label style={labelStyle}>Dificuldade</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {DIFICULDADES.map((d) => {
              const sel = dificuldade === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setDificuldade(d.id)}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 8,
                    cursor: "pointer",
                    border: `${sel ? 1.5 : 0.5}px solid ${sel ? "#534AB7" : bord}`,
                    backgroundColor: sel ? "#1a1630" : input,
                    fontFamily: "inherit",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: sel ? "#7F77DD" : text,
                      marginBottom: 2,
                    }}
                  >
                    {d.nome}
                  </div>
                  <div style={{ fontSize: 11, color: muted }}>+{d.xp} XP</div>
                </button>
              );
            })}
          </div>

          <button
            onClick={salvar}
            disabled={!podeSalvar}
            style={{
              width: "100%",
              borderRadius: 10,
              padding: "14px 0",
              fontSize: 15,
              fontWeight: 500,
              border: "none",
              fontFamily: "inherit",
              backgroundColor: podeSalvar
                ? "#534AB7"
                : dark
                  ? "#1a1630"
                  : "#d5d5d5",
              color: podeSalvar ? "#ffffff" : muted,
              cursor: podeSalvar ? "pointer" : "not-allowed",
            }}
          >
            Adicionar missão
          </button>
        </div>
      )}

      {/* Lista vazia */}
      {pendentes.length === 0 && !mostrarForm && (
        <div
          style={{
            backgroundColor: card,
            border: `0.5px solid ${bord}`,
            borderRadius: 12,
            padding: 40,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: text,
              margin: "0 0 6px",
            }}
          >
            Nenhuma missão pendente
          </p>
          <p style={{ fontSize: 13, color: muted, margin: 0 }}>
            Toque em "+ Nova missão" para criar uma
          </p>
        </div>
      )}

      {/* Lista de tarefas */}
      {pendentes.map((t) => (
        <div
          key={t.id}
          style={{
            backgroundColor: card,
            border: `0.5px solid ${bord}`,
            borderRadius: 12,
            padding: 14,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: CAT_COR[t.categoria] ?? "#534AB7",
                marginTop: 6,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                flex: 1,
                fontSize: 14,
                fontWeight: 500,
                color: text,
                lineHeight: "20px",
              }}
            >
              {t.nome}
            </span>
            <span
              style={{
                fontSize: 13,
                color: "#7F77DD",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              +{t.xp} XP
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <span
                style={{
                  fontSize: 10,
                  padding: "3px 9px",
                  borderRadius: 10,
                  border: `0.5px solid ${CAT_COR[t.categoria] ?? "#534AB7"}`,
                  color: CAT_COR[t.categoria] ?? "#534AB7",
                  fontWeight: 500,
                }}
              >
                {t.categoria}
              </span>
              <span
                style={{
                  fontSize: 10,
                  padding: "3px 9px",
                  borderRadius: 10,
                  border: `0.5px solid ${bord}`,
                  color: muted,
                  fontWeight: 500,
                }}
              >
                {t.dificuldade}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setModalApagar({ id: t.id, nome: t.nome })}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "0.5px solid #993C1D",
                  backgroundColor: "transparent",
                  color: "#D85A30",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Apagar
              </button>
              <button
                onClick={() => concluirTarefa(t.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: "#534AB7",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Modal de confirmação de exclusão */}
      {modalApagar && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: 20,
          }}
        >
          <div
            style={{
              backgroundColor: card,
              borderRadius: 16,
              border: "1px solid #534AB7",
              padding: 28,
              maxWidth: 340,
              width: "100%",
              textAlign: "center",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            <p
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: text,
                margin: "0 0 8px",
              }}
            >
              Apagar missão
            </p>
            <p style={{ fontSize: 13, color: muted, margin: "0 0 4px" }}>
              "{modalApagar.nome}"
            </p>
            <div
              style={{
                backgroundColor: dark ? "#1a0a0a" : "#fff5f5",
                border: "0.5px solid #993C1D",
                borderRadius: 8,
                padding: "10px 16px",
                margin: "16px 0 24px",
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  color: "#D85A30",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Custo: -25 XP · pode regredir de level
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setModalApagar(null)}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: 10,
                  border: `0.5px solid ${bord}`,
                  backgroundColor: "transparent",
                  color: text,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarApagar}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: 10,
                  border: "none",
                  backgroundColor: "#993C1D",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Apagar (-25 XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
