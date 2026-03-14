import { useRouter } from "expo-router";
import { useState } from "react";
import { useColorScheme } from "react-native";
import { useAuthStore } from "../store/authStore";

export default function AuthScreen() {
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [username, setUsername] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, loading } =
    useAuthStore();
  const router = useRouter();
  const dark = useColorScheme() === "dark";

  const bg = dark ? "#0a0a0f" : "#f5f5f5";
  const card = dark ? "#0f0f1a" : "#ffffff";
  const bord = dark ? "#1a1630" : "#e0e0e0";
  const text = dark ? "#e8e6f0" : "#0a0a0f";
  const muted = "#888780";
  const input = dark ? "#070710" : "#f0f0f0";

  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: input,
    borderRadius: 10,
    padding: "13px 16px",
    fontSize: 15,
    border: `0.5px solid ${bord}`,
    color: text,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    marginBottom: 12,
  };

  const handleSubmit = async () => {
    setErro(null);
    setSucesso(null);
    if (!email || !senha) {
      setErro("Preencha todos os campos");
      return;
    }
    if (modo === "cadastro" && !username) {
      setErro("Escolha um nome de usuário");
      return;
    }
    if (senha.length < 6) {
      setErro("Senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (modo === "login") {
      const { error } = await signInWithEmail(email, senha);
      if (error) {
        setErro(error);
        return;
      }
      router.replace("/(tabs)");
    } else {
      const { error } = await signUpWithEmail(email, senha, username);
      if (error) {
        setErro(error);
        return;
      }
      setSucesso("Conta criada! Verifique seu email para confirmar.");
    }
  };

  const handleGoogle = async () => {
    setErro(null);
    const { error } = await signInWithGoogle();
    if (error) setErro(error);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>⚔️</div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#7F77DD",
              margin: "0 0 4px",
            }}
          >
            SoloTasking
          </h1>
          <p style={{ fontSize: 14, color: muted, margin: 0 }}>
            Sua vida é um RPG. Comece a evoluir.
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: card,
            border: `0.5px solid ${bord}`,
            borderRadius: 16,
            padding: 28,
          }}
        >
          {/* Tabs login/cadastro */}
          <div
            style={{
              display: "flex",
              marginBottom: 24,
              backgroundColor: input,
              borderRadius: 10,
              padding: 4,
            }}
          >
            {(["login", "cadastro"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setModo(m);
                  setErro(null);
                  setSucesso(null);
                }}
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 14,
                  fontWeight: 500,
                  backgroundColor: modo === m ? "#534AB7" : "transparent",
                  color: modo === m ? "#fff" : muted,
                  transition: "all 0.2s",
                }}
              >
                {m === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          {/* Campos */}
          {modo === "cadastro" && (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nome de caçador (único)"
              style={inputStyle}
              maxLength={30}
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={inputStyle}
          />
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha (mín. 6 caracteres)"
            style={{ ...inputStyle, marginBottom: 20 }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />

          {/* Erro / sucesso */}
          {erro && (
            <div
              style={{
                backgroundColor: dark ? "#1a0a0a" : "#fff5f5",
                border: "0.5px solid #993C1D",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 16,
              }}
            >
              <p style={{ fontSize: 13, color: "#D85A30", margin: 0 }}>
                {erro}
              </p>
            </div>
          )}
          {sucesso && (
            <div
              style={{
                backgroundColor: dark ? "#0a1a0a" : "#f0fff4",
                border: "0.5px solid #1D9E75",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 16,
              }}
            >
              <p style={{ fontSize: 13, color: "#1D9E75", margin: 0 }}>
                {sucesso}
              </p>
            </div>
          )}

          {/* Botão principal */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#3C3489" : "#534AB7",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "14px 0",
              fontSize: 15,
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              marginBottom: 16,
            }}
          >
            {loading
              ? "Aguarde..."
              : modo === "login"
                ? "Entrar na guilda"
                : "Criar personagem"}
          </button>

          {/* Divisor */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div style={{ flex: 1, height: 0.5, backgroundColor: bord }} />
            <span style={{ fontSize: 12, color: muted }}>ou</span>
            <div style={{ flex: 1, height: 0.5, backgroundColor: bord }} />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: "transparent",
              color: text,
              border: `0.5px solid ${bord}`,
              borderRadius: 10,
              padding: "13px 0",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </button>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: muted,
            marginTop: 20,
          }}
        >
          Rank E · Novato te espera do outro lado
        </p>
      </div>
    </div>
  );
}
