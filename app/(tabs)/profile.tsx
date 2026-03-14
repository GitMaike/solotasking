import { useEffect, useState } from "react";
import { getSubRank } from "../../constants/game";
import { useTheme } from "../../hooks/useThemes";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/authStore";
import { usePlayerStore } from "../../store/playerStore";
import { useTaskStore } from "../../store/taskStore";
import { useThemeStore } from "../../store/themeStore";

const CATEGORIA_COR: Record<string, string> = {
  rotina: "#7F77DD",
  treino: "#1D9E75",
  estudos: "#378ADD",
  trabalho: "#D4537E",
  ingles: "#5DCAA5",
  musica: "#AFA9EC",
};

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const { xpAtual, xpTotal, level, streak } = usePlayerStore();
  const { concluidas } = useTaskStore();
  const { isDark } = useTheme();
  const { preference, setPreference } = useThemeStore();

  const [profile, setProfile] = useState<{
    username: string;
    display_name: string;
    avatar_url: string | null;
  } | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<"stats" | "historico">("stats");

  const rank = getSubRank(xpTotal);

  const bg = isDark ? "#0a0a0f" : "#f5f5f5";
  const card = isDark ? "#0f0f1a" : "#ffffff";
  const bord = isDark ? "#1a1630" : "#e0e0e0";
  const text = isDark ? "#e8e6f0" : "#0a0a0f";
  const muted = "#888780";
  const input = isDark ? "#070710" : "#f0f0f0";

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("username, display_name, avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
      });
  }, [user]);

  const handleSignOut = async () => {
    if (!window.confirm("Sair da conta?")) return;
    await signOut();
  };

  const inicialAvatar = profile?.username?.[0]?.toUpperCase() ?? "?";
  const concluidasReais = concluidas.filter((t) => !t.removida && !t.expirada);
  const removidas = concluidas.filter((t) => t.removida || t.expirada);

  return (
    <div
      style={{
        backgroundColor: bg,
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Header do perfil */}
      <div
        style={{
          backgroundColor: card,
          borderBottom: `0.5px solid ${bord}`,
          padding: "24px 20px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 16,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "2px solid #534AB7",
              overflow: "hidden",
              flexShrink: 0,
              backgroundColor: isDark ? "#1a1630" : "#eeedfb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: 24, fontWeight: 600, color: "#7F77DD" }}>
                {inicialAvatar}
              </span>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: text,
                margin: "0 0 2px",
              }}
            >
              {profile?.display_name ?? "..."}
            </p>
            <p style={{ fontSize: 13, color: muted, margin: "0 0 4px" }}>
              @{profile?.username ?? "..."} · {user?.email}
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                backgroundColor: isDark ? "#1a1630" : "#eeedfb",
                border: "0.5px solid #534AB7",
                borderRadius: 20,
                padding: "3px 10px",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: "#7F77DD" }}>
                {rank.rank}
              </span>
              <span style={{ fontSize: 12, color: "#AFA9EC" }}>
                {rank.nome}
              </span>
            </div>
          </div>
        </div>

        {/* Barra de XP */}
        <div style={{ marginBottom: 6 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 12, color: muted }}>Nível {level}</span>
            <span style={{ fontSize: 12, color: muted }}>
              {xpAtual} / {level * 200} XP
            </span>
          </div>
          <div
            style={{
              backgroundColor: isDark ? "#1a1630" : "#e0e0e0",
              borderRadius: 4,
              height: 6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                backgroundColor: "#534AB7",
                borderRadius: 4,
                width: `${Math.min((xpAtual / (level * 200)) * 100, 100)}%`,
                transition: "width 0.6s ease",
              }}
            />
          </div>
        </div>

        {/* Stats rápidos */}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {[
            { val: xpTotal.toLocaleString("pt-BR"), label: "XP total" },
            { val: concluidasReais.length, label: "missões" },
            { val: streak, label: "streak" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                backgroundColor: isDark ? "#0a0a0f" : "#f5f5f5",
                borderRadius: 8,
                padding: "8px 0",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#7F77DD",
                  margin: 0,
                }}
              >
                {s.val}
              </p>
              <p style={{ fontSize: 11, color: muted, margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Tema */}
        <div
          style={{
            backgroundColor: card,
            border: `0.5px solid ${bord}`,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: muted,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: "0 0 12px",
            }}
          >
            Tema
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {(["system", "dark", "light"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPreference(p)}
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 500,
                  border: `${preference === p ? 1.5 : 0.5}px solid ${preference === p ? "#534AB7" : bord}`,
                  backgroundColor:
                    preference === p ? (isDark ? "#1a1630" : "#eeedfb") : input,
                  color: preference === p ? "#7F77DD" : text,
                }}
              >
                {p === "system"
                  ? "⚙ Sistema"
                  : p === "dark"
                    ? "🌙 Escuro"
                    : "☀️ Claro"}
              </button>
            ))}
          </div>
        </div>

        {/* Abas histórico / stats */}
        <div
          style={{
            display: "flex",
            backgroundColor: input,
            borderRadius: 10,
            padding: 4,
            marginBottom: 12,
          }}
        >
          {(["stats", "historico"] as const).map((a) => (
            <button
              key={a}
              onClick={() => setAbaAtiva(a)}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 14,
                fontWeight: 500,
                backgroundColor: abaAtiva === a ? "#534AB7" : "transparent",
                color: abaAtiva === a ? "#fff" : muted,
                transition: "all 0.2s",
              }}
            >
              {a === "stats" ? "Progresso" : "Histórico"}
            </button>
          ))}
        </div>

        {/* Stats de ranks */}
        {abaAtiva === "stats" && (
          <div
            style={{
              backgroundColor: card,
              border: `0.5px solid ${bord}`,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: muted,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                margin: "0 0 12px",
              }}
            >
              Tabela de ranks
            </p>
            {[
              {
                letra: "E",
                nome: "Novato / Sobrevivente / Desafiante",
                min: 0,
                max: 5999,
              },
              {
                letra: "D",
                nome: "Recruta / Discípulo / Veterano",
                min: 6000,
                max: 24999,
              },
              {
                letra: "C",
                nome: "Caçador / Rastreador / Guardião",
                min: 25000,
                max: 74999,
              },
              {
                letra: "B",
                nome: "Sentinela / Executor / Comandante",
                min: 75000,
                max: 199999,
              },
              {
                letra: "A",
                nome: "Lendário / Mítico / Supremo",
                min: 200000,
                max: 499999,
              },
              {
                letra: "S",
                nome: "Soberano / Transcendente / Monarca",
                min: 500000,
                max: Infinity,
              },
            ].map((r) => {
              const ativo = rank.rank === r.letra;
              return (
                <div
                  key={r.letra}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 8px",
                    borderRadius: 6,
                    marginBottom: 2,
                    backgroundColor: ativo
                      ? isDark
                        ? "#1a1630"
                        : "#f0effe"
                      : "transparent",
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: ativo ? "#7F77DD" : muted,
                      minWidth: 20,
                    }}
                  >
                    {r.letra}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 13,
                      color: ativo ? text : muted,
                    }}
                  >
                    {r.nome}
                  </span>
                  <span style={{ fontSize: 11, color: muted }}>
                    {r.min.toLocaleString("pt-BR")} XP
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Histórico de tarefas */}
        {abaAtiva === "historico" && (
          <div
            style={{
              backgroundColor: card,
              border: `0.5px solid ${bord}`,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: muted,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                margin: "0 0 12px",
              }}
            >
              Concluídas ({concluidasReais.length})
            </p>
            {concluidasReais.length === 0 && (
              <p
                style={{
                  fontSize: 14,
                  color: muted,
                  textAlign: "center",
                  padding: "16px 0",
                  margin: 0,
                }}
              >
                Nenhuma missão concluída ainda
              </p>
            )}
            {concluidasReais.map((t) => {
              const cor = CATEGORIA_COR[t.categoria] ?? "#534AB7";
              return (
                <div
                  key={t.id + t.concluidaEm}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 0",
                    borderTop: `0.5px solid ${bord}`,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: cor,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ flex: 1, fontSize: 13, color: text }}>
                    {t.nome}
                  </span>
                  <span
                    style={{ fontSize: 12, color: "#1D9E75", fontWeight: 500 }}
                  >
                    +{t.xp} XP
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: muted,
                      minWidth: 60,
                      textAlign: "right",
                    }}
                  >
                    {new Date(t.concluidaEm).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              );
            })}

            {removidas.length > 0 && (
              <>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#D85A30",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    margin: "16px 0 8px",
                  }}
                >
                  Removidas / expiradas ({removidas.length})
                </p>
                {removidas.map((t) => (
                  <div
                    key={t.id + t.concluidaEm}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 0",
                      borderTop: `0.5px solid ${bord}`,
                      opacity: 0.6,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#993C1D",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        flex: 1,
                        fontSize: 13,
                        color: text,
                        textDecoration: "line-through",
                      }}
                    >
                      {t.nome}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#D85A30",
                        fontWeight: 500,
                      }}
                    >
                      -{t.xpCobrado} XP
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: muted,
                        minWidth: 60,
                        textAlign: "right",
                      }}
                    >
                      {t.expirada ? "expirou" : "removida"}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleSignOut}
          style={{
            width: "100%",
            backgroundColor: "transparent",
            color: "#D85A30",
            border: "0.5px solid #993C1D",
            borderRadius: 12,
            padding: "14px 0",
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}
