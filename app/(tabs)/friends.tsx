import { useEffect, useState } from "react";
import { getSubRank } from "../../constants/game";
import { useTheme } from "../../hooks/useThemes";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/authStore";

type Friend = {
  id: string;
  username: string;
  display_name: string;
  xp_total: number;
  level: number;
  friendship_id: string;
  status: "pending" | "accepted";
  i_requested: boolean;
};

type SearchResult = {
  id: string;
  username: string;
  display_name: string;
};

export default function FriendsScreen() {
  const { user } = useAuthStore();
  const { isDark } = useTheme();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<SearchResult[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [loading, setLoading] = useState(true);

  const bg = isDark ? "#0a0a0f" : "#f5f5f5";
  const card = isDark ? "#0f0f1a" : "#ffffff";
  const bord = isDark ? "#1a1630" : "#e0e0e0";
  const text = isDark ? "#e8e6f0" : "#0a0a0f";
  const muted = "#888780";
  const input = isDark ? "#070710" : "#f0f0f0";

  const carregarAmigos = async () => {
    if (!user) return;
    setLoading(true);

    const { data: friendships } = await supabase
      .from("friendships")
      .select("id, requester_id, addressee_id, status")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    if (!friendships?.length) {
      setFriends([]);
      setLoading(false);
      return;
    }

    const friendIds = friendships.map((f) =>
      f.requester_id === user.id ? f.addressee_id : f.requester_id,
    );

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, display_name")
      .in("id", friendIds);

    const { data: stats } = await supabase
      .from("player_stats")
      .select("user_id, xp_total, level")
      .in("user_id", friendIds);

    const merged: Friend[] = friendships.map((f) => {
      const friendId =
        f.requester_id === user.id ? f.addressee_id : f.requester_id;
      const profile = profiles?.find((p) => p.id === friendId);
      const stat = stats?.find((s) => s.user_id === friendId);
      return {
        id: friendId,
        username: profile?.username ?? "?",
        display_name: profile?.display_name ?? "?",
        xp_total: stat?.xp_total ?? 0,
        level: stat?.level ?? 1,
        friendship_id: f.id,
        status: f.status,
        i_requested: f.requester_id === user.id,
      };
    });

    setFriends(merged);
    setLoading(false);
  };

  useEffect(() => {
    carregarAmigos();
  }, [user]);

  const buscarUsuarios = async () => {
    if (!busca.trim() || !user) return;
    setBuscando(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, username, display_name")
      .ilike("username", `%${busca.trim()}%`)
      .neq("id", user.id)
      .limit(8);
    setResultados(data ?? []);
    setBuscando(false);
  };

  const enviarPedido = async (addresseeId: string) => {
    if (!user) return;
    await supabase
      .from("friendships")
      .insert({ requester_id: user.id, addressee_id: addresseeId });
    setResultados([]);
    setBusca("");
    carregarAmigos();
  };

  const responderPedido = async (friendshipId: string, aceitar: boolean) => {
    if (aceitar) {
      await supabase
        .from("friendships")
        .update({ status: "accepted" })
        .eq("id", friendshipId);
    } else {
      await supabase.from("friendships").delete().eq("id", friendshipId);
    }
    carregarAmigos();
  };

  const removerAmigo = async (friendshipId: string) => {
    if (!window.confirm("Remover este amigo?")) return;
    await supabase.from("friendships").delete().eq("id", friendshipId);
    carregarAmigos();
  };

  const pendentes = friends.filter((f) => f.status === "pending");
  const aceitos = friends
    .filter((f) => f.status === "accepted")
    .sort((a, b) => b.xp_total - a.xp_total);

  const jaAmigo = (id: string) => friends.some((f) => f.id === id);

  return (
    <div
      style={{
        backgroundColor: bg,
        minHeight: "100vh",
        padding: 16,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Buscar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscarUsuarios()}
          placeholder="Buscar caçador pelo username..."
          style={{
            flex: 1,
            backgroundColor: input,
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 14,
            border: `0.5px solid ${bord}`,
            color: text,
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        <button
          onClick={buscarUsuarios}
          disabled={buscando}
          style={{
            backgroundColor: "#534AB7",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "0 18px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 14,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {buscando ? "..." : "Buscar"}
        </button>
      </div>

      {/* Resultados da busca */}
      {resultados.length > 0 && (
        <div
          style={{
            backgroundColor: card,
            border: `0.5px solid ${bord}`,
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: muted,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: "0 0 10px",
            }}
          >
            Resultados
          </p>
          {resultados.map((r) => (
            <div
              key={r.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
                borderTop: `0.5px solid ${bord}`,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: isDark ? "#1a1630" : "#eeedfb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#7F77DD",
                  flexShrink: 0,
                }}
              >
                {r.username[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: text,
                    margin: 0,
                  }}
                >
                  {r.username}
                </p>
                <p style={{ fontSize: 12, color: muted, margin: 0 }}>
                  {r.display_name}
                </p>
              </div>
              {jaAmigo(r.id) ? (
                <span style={{ fontSize: 12, color: muted }}>já na guilda</span>
              ) : (
                <button
                  onClick={() => enviarPedido(r.id)}
                  style={{
                    backgroundColor: "#534AB7",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "7px 14px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  + Convidar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pedidos pendentes */}
      {pendentes.length > 0 && (
        <div
          style={{
            backgroundColor: card,
            border: `1px solid #534AB7`,
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#7F77DD",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: "0 0 10px",
            }}
          >
            Pedidos pendentes ({pendentes.length})
          </p>
          {pendentes.map((f) => (
            <div
              key={f.friendship_id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
                borderTop: `0.5px solid ${bord}`,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: isDark ? "#1a1630" : "#eeedfb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#7F77DD",
                  flexShrink: 0,
                }}
              >
                {f.username[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: text,
                    margin: 0,
                  }}
                >
                  {f.username}
                </p>
                <p style={{ fontSize: 12, color: muted, margin: 0 }}>
                  {f.i_requested
                    ? "Aguardando resposta..."
                    : "Quer entrar na sua guilda"}
                </p>
              </div>
              {!f.i_requested && (
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => responderPedido(f.friendship_id, true)}
                    style={{
                      backgroundColor: "#1D9E75",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "7px 12px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    Aceitar
                  </button>
                  <button
                    onClick={() => responderPedido(f.friendship_id, false)}
                    style={{
                      backgroundColor: "transparent",
                      color: "#D85A30",
                      border: "0.5px solid #993C1D",
                      borderRadius: 8,
                      padding: "7px 12px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: 12,
                    }}
                  >
                    Recusar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Ranking da guilda */}
      <div
        style={{
          backgroundColor: card,
          border: `0.5px solid ${bord}`,
          borderRadius: 12,
          padding: 12,
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: muted,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            margin: "0 0 10px",
          }}
        >
          Ranking da guilda ({aceitos.length})
        </p>
        {aceitos.length === 0 && (
          <p
            style={{
              fontSize: 14,
              color: muted,
              textAlign: "center",
              padding: "20px 0",
              margin: 0,
            }}
          >
            Nenhum amigo ainda. Busque pelo username para convidar.
          </p>
        )}
        {aceitos.map((f, i) => {
          const rank = getSubRank(f.xp_total);
          return (
            <div
              key={f.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 0",
                borderTop: `0.5px solid ${bord}`,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: i < 3 ? "#EF9F27" : muted,
                  minWidth: 20,
                }}
              >
                #{i + 1}
              </span>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: isDark ? "#1a1630" : "#eeedfb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#7F77DD",
                  flexShrink: 0,
                }}
              >
                {f.username[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: text,
                    margin: 0,
                  }}
                >
                  {f.username}
                </p>
                <p style={{ fontSize: 12, color: muted, margin: 0 }}>
                  {rank.rank}-{rank.sub} · {rank.nome} · Nível {f.level}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: 13,
                    color: "#7F77DD",
                    fontWeight: 500,
                    margin: 0,
                  }}
                >
                  {f.xp_total.toLocaleString("pt-BR")}
                </p>
                <p style={{ fontSize: 11, color: muted, margin: 0 }}>
                  XP total
                </p>
              </div>
              <button
                onClick={() => removerAmigo(f.friendship_id)}
                style={{
                  background: "none",
                  border: "none",
                  color: muted,
                  cursor: "pointer",
                  fontSize: 16,
                  padding: "4px 6px",
                  marginLeft: 4,
                }}
                title="Remover amigo"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
