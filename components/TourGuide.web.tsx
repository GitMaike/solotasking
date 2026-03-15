import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../hooks/useThemes";
import { useTourStore } from "../store/tourStore";

type Passo = {
  titulo: string;
  descricao: string;
  elementId: string | null;
  posicao: "top" | "bottom" | "left" | "right" | "center";
  icone: string;
  rota?: string;
};

const PASSOS: Passo[] = [
  {
    titulo: "Bem-vindo ao SoloTasking ⚔️",
    descricao:
      "Sua vida é um RPG. Complete missões reais para ganhar XP, subir de rank e evoluir. Este é seu painel de progresso — vamos te mostrar tudo.",
    elementId: "tour-dashboard-rank",
    posicao: "bottom",
    icone: "🗺️",
    rota: "/",
  },
  {
    titulo: "Seu rank e streak",
    descricao:
      "Aqui fica seu rank atual e o streak diário. Abra o app todo dia para manter o streak. Se passar um dia sem abrir, o contador reseta.",
    elementId: "tour-streak",
    posicao: "bottom",
    icone: "🔥",
    rota: "/",
  },
  {
    titulo: "Crie suas missões",
    descricao:
      'Clique em "+ Nova missão" para criar uma tarefa. Escolha a dificuldade — Fácil (+10 XP), Médio (+25), Difícil (+50) ou Épico (+100 XP).',
    elementId: "tour-nova-missao",
    posicao: "bottom",
    icone: "📋",
    rota: "/tasks",
  },
  {
    titulo: "Defina um prazo",
    descricao:
      "Tarefas com prazo precisam ser concluídas a tempo. Se expirarem, você perde XP — a penalidade aumenta conforme seu rank atual.",
    elementId: null,
    posicao: "center",
    icone: "⏰",
    rota: "/tasks",
  },
  {
    titulo: "Cuidado ao apagar missões ⚠️",
    descricao:
      "Apagar uma tarefa custa -25 XP e pode fazer você regredir de nível. Só apague se realmente não for completar a missão.",
    elementId: null,
    posicao: "center",
    icone: "⚠️",
    rota: "/tasks",
  },
  {
    titulo: "Sistema de ranks",
    descricao:
      "Você começa como Novato (E-III) e evolui até Monarca das Sombras (S-I). Cada rank tem 3 sub-níveis. Veja seu progresso completo na aba Perfil.",
    elementId: null,
    posicao: "center",
    icone: "🏆",
    rota: "/tasks",
  },
  {
    titulo: "Guilda de caçadores",
    descricao:
      "Na aba Guilda você busca outros caçadores pelo username, envia convites e vê o ranking de XP entre seus amigos.",
    elementId: "tour-tab-guilda",
    posicao: "top",
    icone: "⚔️",
    rota: "/friends",
  },
  {
    titulo: "Pronto para evoluir! 🚀",
    descricao:
      "Você já sabe o essencial. Complete missões diariamente, mantenha o streak e suba de rank. Boa sorte, caçador!",
    elementId: null,
    posicao: "center",
    icone: "🚀",
    rota: "/",
  },
];

type DestaqPos = { top: number; left: number; width: number; height: number };
type TooltipPos = { top: number; left: number; largura: number };

export function TourGuide() {
  const {
    tourAtivo,
    passoAtual,
    avancarPasso,
    voltarPasso,
    pularTour,
    concluirTour,
  } = useTourStore();
  const { isDark } = useTheme();
  const router = useRouter();
  const [tooltipPos, setTooltipPos] = useState<TooltipPos | null>(null);
  const [destaqPos, setDestaqPos] = useState<DestaqPos | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tentativasRef = useRef(0);

  const passo = PASSOS[passoAtual];
  const isUltimo = passoAtual === PASSOS.length - 1;

  const calcularPosicao = () => {
    if (!passo) return;

    // Passo sem elemento — mostra no centro
    if (!passo.elementId) {
      setDestaqPos(null);
      setTooltipPos({
        top: window.innerHeight / 2 - 120,
        left: window.innerWidth / 2 - 150,
        largura: 300,
      });
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const el = document.getElementById(passo.elementId);
    if (!el) {
      tentativasRef.current += 1;
      if (tentativasRef.current > 20) {
        // Elemento não encontrado após várias tentativas — mostra no centro
        setDestaqPos(null);
        setTooltipPos({
          top: window.innerHeight / 2 - 120,
          left: window.innerWidth / 2 - 150,
          largura: 300,
        });
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const rect = el.getBoundingClientRect();
    const tooltipW = 300;
    const tooltipH = 200;
    const gap = 14;

    setDestaqPos({
      top: rect.top - 6,
      left: rect.left - 6,
      width: rect.width + 12,
      height: rect.height + 12,
    });

    let top = 0;
    let left = rect.left + rect.width / 2 - tooltipW / 2;

    if (passo.posicao === "bottom") top = rect.bottom + gap;
    else if (passo.posicao === "top") top = rect.top - tooltipH - gap;
    else if (passo.posicao === "left") {
      top = rect.top + rect.height / 2 - tooltipH / 2;
      left = rect.left - tooltipW - gap;
    } else if (passo.posicao === "right") {
      top = rect.top + rect.height / 2 - tooltipH / 2;
      left = rect.right + gap;
    }

    left = Math.max(12, Math.min(left, window.innerWidth - tooltipW - 12));
    top = Math.max(12, Math.min(top, window.innerHeight - tooltipH - 12));

    setTooltipPos({ top, left, largura: tooltipW });
  };

  useEffect(() => {
    if (!tourAtivo) {
      setTooltipPos(null);
      setDestaqPos(null);
      return;
    }
    if (!passo) return;

    tentativasRef.current = 0;

    // Navega para a rota correta do passo
    if (passo.rota) {
      router.replace(passo.rota as any);
    }

    // Aguarda renderização e tenta encontrar o elemento
    const timeout = setTimeout(() => {
      calcularPosicao();
      if (passo.elementId) {
        intervalRef.current = setInterval(calcularPosicao, 200);
      }
    }, 400);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [tourAtivo, passoAtual]);

  if (!tourAtivo || !passo) return null;

  const card = isDark ? "#0f0f1a" : "#ffffff";
  const bord = "#534AB7";
  const text = isDark ? "#e8e6f0" : "#0a0a0f";
  const muted = "#888780";

  const Seta = () => {
    const base: React.CSSProperties = {
      position: "absolute",
      width: 0,
      height: 0,
    };
    if (!destaqPos || passo.posicao === "center") return null;
    if (passo.posicao === "bottom")
      return (
        <div
          style={{
            ...base,
            top: -10,
            left: "50%",
            transform: "translateX(-50%)",
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderBottom: `10px solid ${bord}`,
          }}
        />
      );
    if (passo.posicao === "top")
      return (
        <div
          style={{
            ...base,
            bottom: -10,
            left: "50%",
            transform: "translateX(-50%)",
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: `10px solid ${bord}`,
          }}
        />
      );
    if (passo.posicao === "left")
      return (
        <div
          style={{
            ...base,
            right: -10,
            top: "50%",
            transform: "translateY(-50%)",
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderLeft: `10px solid ${bord}`,
          }}
        />
      );
    if (passo.posicao === "right")
      return (
        <div
          style={{
            ...base,
            left: -10,
            top: "50%",
            transform: "translateY(-50%)",
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderRight: `10px solid ${bord}`,
          }}
        />
      );
    return null;
  };

  return (
    <>
      <style>{`
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(83,74,183,0.6); }
          70%  { box-shadow: 0 0 0 12px rgba(83,74,183,0); }
          100% { box-shadow: 0 0 0 0 rgba(83,74,183,0); }
        }
        .tour-highlight { animation: pulseRing 1.5s infinite; }
        @keyframes tourFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tour-tooltip { animation: tourFadeIn 0.25s ease-out forwards; }
      `}</style>

      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9990,
          pointerEvents: "none",
        }}
      >
        {destaqPos ? (
          <>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: destaqPos.top,
                backgroundColor: "rgba(0,0,0,0.65)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: destaqPos.top,
                left: 0,
                width: destaqPos.left,
                height: destaqPos.height,
                backgroundColor: "rgba(0,0,0,0.65)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: destaqPos.top,
                left: destaqPos.left + destaqPos.width,
                right: 0,
                height: destaqPos.height,
                backgroundColor: "rgba(0,0,0,0.65)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: destaqPos.top + destaqPos.height,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.65)",
              }}
            />
            <div
              className="tour-highlight"
              style={{
                position: "absolute",
                top: destaqPos.top,
                left: destaqPos.left,
                width: destaqPos.width,
                height: destaqPos.height,
                border: `2px solid #534AB7`,
                borderRadius: 10,
              }}
            />
          </>
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.65)",
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      {tooltipPos && (
        <div
          className="tour-tooltip"
          key={passoAtual}
          style={{
            position: "fixed",
            top: tooltipPos.top,
            left: tooltipPos.left,
            width: tooltipPos.largura,
            zIndex: 9999,
            pointerEvents: "all",
          }}
        >
          <Seta />
          <div
            style={{
              backgroundColor: card,
              border: `1.5px solid ${bord}`,
              borderRadius: 14,
              padding: 20,
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>{passo.icone}</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#7F77DD",
                  flex: 1,
                  lineHeight: 1.3,
                }}
              >
                {passo.titulo}
              </span>
              <button
                onClick={pularTour}
                style={{
                  background: "none",
                  border: "none",
                  color: muted,
                  cursor: "pointer",
                  fontSize: 16,
                  padding: "0 2px",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>

            <p
              style={{
                fontSize: 13,
                color: text,
                lineHeight: 1.6,
                margin: "0 0 16px",
              }}
            >
              {passo.descricao}
            </p>

            {/* Dots */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginBottom: 14,
              }}
            >
              {PASSOS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === passoAtual ? 18 : 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor:
                      i === passoAtual
                        ? "#534AB7"
                        : isDark
                          ? "#1a1630"
                          : "#e0e0e0",
                    transition: "all 0.2s",
                  }}
                />
              ))}
              <span style={{ fontSize: 11, color: muted, marginLeft: "auto" }}>
                {passoAtual + 1}/{PASSOS.length}
              </span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {passoAtual > 0 && (
                <button
                  onClick={voltarPasso}
                  style={{
                    padding: "9px 14px",
                    borderRadius: 8,
                    border: `0.5px solid ${isDark ? "#1a1630" : "#e0e0e0"}`,
                    backgroundColor: "transparent",
                    color: muted,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ← Voltar
                </button>
              )}
              <button
                onClick={isUltimo ? concluirTour : avancarPasso}
                style={{
                  flex: 1,
                  padding: "9px 14px",
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: "#534AB7",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {isUltimo ? "Começar a caçar ⚔️" : "Próximo →"}
              </button>
            </div>

            {passoAtual === 0 && (
              <button
                onClick={pularTour}
                style={{
                  width: "100%",
                  marginTop: 10,
                  background: "none",
                  border: "none",
                  color: muted,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textDecoration: "underline",
                }}
              >
                Pular tutorial
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
