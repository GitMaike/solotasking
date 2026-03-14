import { useEffect, useState } from "react";

type LevelUpInfo = {
  novoLevel: number;
  rankAnterior: string;
  novoRank: string;
  rankMudou: boolean;
};

let showListeners: ((info: LevelUpInfo) => void)[] = [];

export function dispararLevelUp(info: LevelUpInfo) {
  showListeners.forEach((fn) => fn(info));
}

export function LevelUpModal() {
  const [info, setInfo] = useState<LevelUpInfo | null>(null);
  const [visible, setVisible] = useState(false);
  const [animando, setAnimando] = useState(false);

  useEffect(() => {
    const fn = (newInfo: LevelUpInfo) => {
      setInfo(newInfo);
      setVisible(true);
      setAnimando(false);
      setTimeout(() => setAnimando(true), 50);
    };
    showListeners.push(fn);
    return () => {
      showListeners = showListeners.filter((l) => l !== fn);
    };
  }, []);

  if (!visible || !info) return null;

  return (
    <>
      <style>{`
        @keyframes starPulse {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.2) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { box-shadow: 0 0 0px rgba(127,119,221,0); }
          50%  { box-shadow: 0 0 40px rgba(127,119,221,0.6); }
          100% { box-shadow: 0 0 20px rgba(127,119,221,0.3); }
        }
        @keyframes particle {
          0%   { opacity: 1; transform: translate(0,0) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
        }
        .levelup-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex; align-items: center; justify-content: center;
          z-index: 9998; padding: 20px;
          backdrop-filter: blur(4px);
        }
        .levelup-card {
          background: #0f0f1a;
          border: 1.5px solid #534AB7;
          border-radius: 20px;
          padding: 36px 28px;
          max-width: 320px; width: 100%;
          text-align: center;
          font-family: system-ui, sans-serif;
          position: relative;
          overflow: hidden;
          animation: shimmer 2s ease-in-out infinite;
        }
        .levelup-card.in {
          animation: fadeInUp 0.4s ease-out forwards, shimmer 2s ease-in-out infinite;
        }
        .levelup-star {
          font-size: 64px; margin-bottom: 8px;
          display: block;
        }
        .levelup-star.in {
          animation: starPulse 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .particle {
          position: absolute;
          width: 8px; height: 8px;
          border-radius: 50%;
          animation: particle 0.8s ease-out forwards;
        }
      `}</style>

      <div className="levelup-overlay" onClick={() => setVisible(false)}>
        <div
          className={`levelup-card ${animando ? "in" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Partículas decorativas */}
          {animando &&
            Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * 360;
              const dist = 80 + Math.random() * 60;
              const tx = Math.cos((angle * Math.PI) / 180) * dist;
              const ty = Math.sin((angle * Math.PI) / 180) * dist;
              const cores = [
                "#7F77DD",
                "#1D9E75",
                "#EF9F27",
                "#D4537E",
                "#5DCAA5",
              ];
              const cor = cores[i % cores.length];
              return (
                <div
                  key={i}
                  className="particle"
                  style={
                    {
                      left: "50%",
                      top: "30%",
                      backgroundColor: cor,
                      "--tx": `${tx}px`,
                      "--ty": `${ty}px`,
                      animationDelay: `${i * 0.04}s`,
                    } as React.CSSProperties
                  }
                />
              );
            })}

          <span className={`levelup-star ${animando ? "in" : ""}`}>⚔️</span>

          <p
            style={{
              fontSize: 13,
              color: "#888780",
              margin: "0 0 4px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Level up!
          </p>
          <p
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#7F77DD",
              margin: "0 0 4px",
              lineHeight: 1,
            }}
          >
            {info.novoLevel}
          </p>

          {info.rankMudou && (
            <div
              style={{
                backgroundColor: "#1a1630",
                border: "1px solid #534AB7",
                borderRadius: 10,
                padding: "10px 16px",
                margin: "12px 0",
                display: "inline-block",
              }}
            >
              <p style={{ fontSize: 12, color: "#888780", margin: "0 0 2px" }}>
                Novo rank desbloqueado!
              </p>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#7F77DD",
                  margin: 0,
                }}
              >
                {info.novoRank}
              </p>
            </div>
          )}

          <p style={{ fontSize: 13, color: "#5F5E5A", margin: "12px 0 20px" }}>
            Toque para continuar
          </p>

          <button
            onClick={() => setVisible(false)}
            style={{
              width: "100%",
              backgroundColor: "#534AB7",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "13px 0",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Continuar caçando ⚔️
          </button>
        </div>
      </div>
    </>
  );
}
