import { useRef, useState } from "react";
import { dispararXPFloat } from "../../components/XPFloat.web";
import { type Dificuldade } from "../../constants/game";
import { useTheme } from "../../hooks/useThemes";
import { useCategoryStore } from "../../store/categoryStore";
import { useTaskStore, type Categoria } from "../../store/taskStore";

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
  const { categories, adicionar, editar, remover } = useCategoryStore();
  const { isDark } = useTheme();

  const [mostrarForm, setMostrarForm] = useState(false);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [dificuldade, setDificuldade] = useState<Dificuldade | null>(null);
  const [dataLimite, setDataLimite] = useState("");
  const [modalApagar, setModalApagar] = useState<{
    id: string;
    nome: string;
    xp: number;
  } | null>(null);

  const [novaCategoria, setNovaCategoria] = useState("");
  const [mostrarAddCat, setMostrarAddCat] = useState(false);
  const [editandoCat, setEditandoCat] = useState<string | null>(null);
  const [editNome, setEditNome] = useState("");
  const clickTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const bg = isDark ? "#0a0a0f" : "#f5f5f5";
  const card = isDark ? "#0f0f1a" : "#ffffff";
  const bord = isDark ? "#1a1630" : "#e0e0e0";
  const text = isDark ? "#e8e6f0" : "#0a0a0f";
  const muted = "#888780";
  const input = isDark ? "#070710" : "#f0f0f0";

  const podeSalvar =
    nome.trim().length > 0 && categoria !== null && dificuldade !== null;

  const salvar = () => {
    if (!podeSalvar) return;
    const catObj = categories.find((c) => c.id === categoria);
    criarTarefa({
      nome: nome.trim(),
      categoria: categoria!,
      categoriaNome: catObj?.nome ?? categoria!,
      dificuldade: dificuldade!,
      dataLimite: dataLimite
        ? new Date(dataLimite + "T23:59:59").toISOString()
        : undefined,
    });
    setNome("");
    setCategoria(null);
    setDificuldade(null);
    setDataLimite("");
    setMostrarForm(false);
  };

  const confirmarApagar = () => {
    if (!modalApagar) return;
    dispararXPFloat(25, false, window.innerWidth / 2, window.innerHeight / 2);
    apagarTarefa(modalApagar.id);
    setModalApagar(null);
  };

  const handleCatClick = (id: string, nomeAtual: string) => {
    if (clickTimers.current[id]) {
      clearTimeout(clickTimers.current[id]);
      delete clickTimers.current[id];
      setEditandoCat(id);
      setEditNome(nomeAtual);
    } else {
      clickTimers.current[id] = setTimeout(() => {
        delete clickTimers.current[id];
        setCategoria(id as Categoria);
      }, 250);
    }
  };

  const salvarEdicaoCat = (id: string) => {
    editar(id, editNome);
    setEditandoCat(null);
    setEditNome("");
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

  const prazoExpirado = (data: string) => new Date(data) < new Date();

  return (
    <div
      style={{
        backgroundColor: bg,
        minHeight: "100vh",
        padding: 16,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <button
        id="tour-nova-missao"
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
        }}
      >
        {mostrarForm ? "✕ Cancelar" : "+ Nova missão"}
      </button>

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
              marginBottom: 8,
            }}
          >
            {categories.map((c) => {
              const sel = categoria === c.id;
              if (editandoCat === c.id) {
                return (
                  <div key={c.id} style={{ display: "flex", gap: 4 }}>
                    <input
                      autoFocus
                      value={editNome}
                      onChange={(e) => setEditNome(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") salvarEdicaoCat(c.id);
                        if (e.key === "Escape") setEditandoCat(null);
                      }}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: `1.5px solid #534AB7`,
                        backgroundColor: input,
                        color: text,
                        fontSize: 13,
                        fontFamily: "inherit",
                        outline: "none",
                        width: 120,
                      }}
                    />
                    <button
                      onClick={() => salvarEdicaoCat(c.id)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: "none",
                        backgroundColor: "#534AB7",
                        color: "#fff",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: 12,
                      }}
                    >
                      Ok
                    </button>
                    <button
                      onClick={() => setEditandoCat(null)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: `0.5px solid ${bord}`,
                        backgroundColor: "transparent",
                        color: muted,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: 12,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                );
              }
              return (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: `${sel ? 1.5 : 0.5}px solid ${sel ? (c.cor ?? "#534AB7") : bord}`,
                    backgroundColor: sel
                      ? isDark
                        ? "#1a1630"
                        : "#eeedfb"
                      : input,
                    cursor: "pointer",
                  }}
                >
                  <span
                    onClick={() => handleCatClick(c.id, c.nome)}
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: sel ? (c.cor ?? "#7F77DD") : text,
                    }}
                  >
                    {c.nome}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remover(c.id);
                      if (categoria === c.id) setCategoria(null);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0 2px",
                      color: sel ? (c.cor ?? muted) : muted,
                      fontSize: 12,
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </div>
              );
            })}

            {mostrarAddCat ? (
              <div style={{ display: "flex", gap: 4 }}>
                <input
                  autoFocus
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && novaCategoria.trim()) {
                      adicionar(novaCategoria);
                      setNovaCategoria("");
                      setMostrarAddCat(false);
                    }
                    if (e.key === "Escape") setMostrarAddCat(false);
                  }}
                  placeholder="Nova categoria"
                  maxLength={20}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: `1.5px solid #534AB7`,
                    backgroundColor: input,
                    color: text,
                    fontSize: 13,
                    fontFamily: "inherit",
                    outline: "none",
                    width: 140,
                  }}
                />
                <button
                  onClick={() => {
                    if (novaCategoria.trim()) {
                      adicionar(novaCategoria);
                      setNovaCategoria("");
                    }
                    setMostrarAddCat(false);
                  }}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "none",
                    backgroundColor: "#534AB7",
                    color: "#fff",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 12,
                  }}
                >
                  Ok
                </button>
              </div>
            ) : (
              <button
                onClick={() => setMostrarAddCat(true)}
                style={{
                  padding: "9px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  border: `0.5px dashed ${bord}`,
                  backgroundColor: "transparent",
                  color: muted,
                  fontSize: 13,
                  fontFamily: "inherit",
                }}
              >
                + Nova
              </button>
            )}
          </div>
          <p style={{ fontSize: 11, color: muted, margin: "0 0 20px" }}>
            Clique para selecionar · duplo clique para editar · ✕ para remover
          </p>

          <label style={labelStyle}>Dificuldade</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
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
                    backgroundColor: sel
                      ? isDark
                        ? "#1a1630"
                        : "#eeedfb"
                      : input,
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

          <label style={labelStyle}>Prazo (opcional)</label>
          <div id="tour-prazo" style={{ marginBottom: 24 }}>
            <input
              type="date"
              value={dataLimite}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDataLimite(e.target.value)}
              style={
                {
                  backgroundColor: input,
                  borderRadius: 8,
                  padding: "11px 14px",
                  fontSize: 14,
                  border: `0.5px solid ${bord}`,
                  color: text,
                  outline: "none",
                  fontFamily: "inherit",
                  colorScheme: isDark ? "dark" : "light",
                } as React.CSSProperties
              }
            />
            {dataLimite && (
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 12, color: "#EF9F27" }}>
                  ⚠ Penalidade por expiração aumenta com o seu rank
                </span>
                <button
                  onClick={() => setDataLimite("")}
                  style={{
                    fontSize: 11,
                    color: muted,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textDecoration: "underline",
                  }}
                >
                  remover
                </button>
              </div>
            )}
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
                : isDark
                  ? "#1a1630"
                  : "#d5d5d5",
              color: podeSalvar ? "#fff" : muted,
              cursor: podeSalvar ? "pointer" : "not-allowed",
            }}
          >
            Adicionar missão
          </button>
        </div>
      )}

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

      {pendentes.map((t, idx) => {
        const catCor =
          categories.find((c) => c.id === t.categoria)?.cor ??
          CAT_COR[t.categoria] ??
          "#534AB7";
        const temPrazo = !!t.dataLimite;
        const expirou = temPrazo && prazoExpirado(t.dataLimite!);
        return (
          <div
            key={t.id}
            id={idx === 0 ? "tour-apagar" : undefined}
            style={{
              backgroundColor: card,
              border: `0.5px solid ${expirou ? "#993C1D" : bord}`,
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
                  backgroundColor: catCor,
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
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: 10,
                    padding: "3px 9px",
                    borderRadius: 10,
                    border: `0.5px solid ${catCor}`,
                    color: catCor,
                    fontWeight: 500,
                  }}
                >
                  {t.categoriaNome ?? t.categoria}
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
                {temPrazo && (
                  <span
                    style={{
                      fontSize: 10,
                      padding: "3px 9px",
                      borderRadius: 10,
                      border: `0.5px solid ${expirou ? "#993C1D" : "#534AB7"}`,
                      color: expirou ? "#D85A30" : "#7F77DD",
                      fontWeight: 500,
                    }}
                  >
                    {expirou
                      ? "⚠ expirou"
                      : `até ${new Date(t.dataLimite!).toLocaleDateString("pt-BR")}`}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() =>
                    setModalApagar({ id: t.id, nome: t.nome, xp: t.xp })
                  }
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
                  onClick={(e) => {
                    const rect = (
                      e.target as HTMLElement
                    ).getBoundingClientRect();
                    dispararXPFloat(
                      t.xp,
                      true,
                      rect.left + rect.width / 2,
                      rect.top,
                    );
                    concluirTarefa(t.id);
                  }}
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
        );
      })}

      {modalApagar && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.75)",
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
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: isDark ? "#1a0a0a" : "#fff0f0",
                border: "1.5px solid #993C1D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: 24,
              }}
            >
              ⚠
            </div>
            <p
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: text,
                margin: "0 0 6px",
              }}
            >
              Apagar missão
            </p>
            <p style={{ fontSize: 13, color: muted, margin: "0 0 16px" }}>
              "{modalApagar.nome}"
            </p>
            <div
              style={{
                backgroundColor: isDark ? "#1a0a0a" : "#fff5f5",
                border: "0.5px solid #993C1D",
                borderRadius: 8,
                padding: "10px 16px",
                marginBottom: 24,
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
                -25 XP · pode regredir de level
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
