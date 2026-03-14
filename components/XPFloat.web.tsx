import { useEffect, useState } from "react";

type XPFloatItem = {
  id: string;
  valor: number;
  positivo: boolean;
  x: number;
  y: number;
};

// Store global de notificações — simples, sem Zustand
let listeners: ((items: XPFloatItem[]) => void)[] = [];
let items: XPFloatItem[] = [];

export function dispararXPFloat(
  valor: number,
  positivo: boolean,
  x?: number,
  y?: number,
) {
  const item: XPFloatItem = {
    id: `${Date.now()}-${Math.random()}`,
    valor,
    positivo,
    x: x ?? window.innerWidth / 2,
    y: y ?? window.innerHeight / 2,
  };
  items = [...items, item];
  listeners.forEach((fn) => fn(items));

  // Remove após a animação
  setTimeout(() => {
    items = items.filter((i) => i.id !== item.id);
    listeners.forEach((fn) => fn(items));
  }, 1200);
}

export function XPFloatLayer() {
  const [floats, setFloats] = useState<XPFloatItem[]>([]);

  useEffect(() => {
    const fn = (newItems: XPFloatItem[]) => setFloats([...newItems]);
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes xpFloat {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          20%  { opacity: 1; transform: translateY(-8px) scale(1.15); }
          100% { opacity: 0; transform: translateY(-60px) scale(0.9); }
        }
        .xp-float {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          font-family: system-ui, sans-serif;
          font-size: 18px;
          font-weight: 700;
          animation: xpFloat 1.1s ease-out forwards;
          text-shadow: 0 1px 8px rgba(0,0,0,0.25);
          white-space: nowrap;
          transform: translateX(-50%);
        }
      `}</style>
      {floats.map((f) => (
        <div
          key={f.id}
          className="xp-float"
          style={{
            left: f.x,
            top: f.y,
            color: f.positivo ? "#1D9E75" : "#D85A30",
          }}
        >
          {f.positivo ? "+" : "-"}
          {f.valor} XP
        </div>
      ))}
    </>
  );
}
