import { supabase } from "../lib/supabase";
import { useCategoryStore } from "./categoryStore";
import { usePlayerStore } from "./playerStore";
import { useTaskStore } from "./taskStore";

export async function carregarDadosDoUsuario(userId: string) {
  await Promise.all([
    carregarPlayerStats(userId),
    carregarTarefas(userId),
    carregarCategorias(userId),
  ]);
}

async function carregarPlayerStats(userId: string) {
  const { data } = await supabase
    .from("player_stats")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!data) return;
  if (data.xp_total === 0 && data.level === 1 && data.streak === 0) return;

  usePlayerStore.setState({
    xpAtual: data.xp_atual,
    xpTotal: data.xp_total,
    level: data.level,
    streak: data.streak,
    ultimoDiaAtivo: data.ultimo_dia_ativo,
  });
}

async function carregarTarefas(userId: string) {
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("criada_em", { ascending: false });

  if (!data || data.length === 0) return;

  const pendentes = data
    .filter((t) => t.status === "pendente")
    .map((t) => ({
      id: t.id,
      nome: t.nome,
      categoria: t.category_id ?? "rotina",
      categoriaNome: t.category_nome ?? t.category_id ?? "Rotina",
      dificuldade: t.dificuldade,
      xp: t.xp,
      criadaEm: t.criada_em,
      dataLimite: t.data_limite ?? undefined,
    }));

  const concluidas = data
    .filter((t) => t.status !== "pendente")
    .map((t) => ({
      id: t.id,
      nome: t.nome,
      categoria: t.category_id ?? "rotina",
      categoriaNome: t.category_nome ?? t.category_id ?? "Rotina",
      dificuldade: t.dificuldade,
      xp: t.xp,
      criadaEm: t.criada_em,
      dataLimite: t.data_limite ?? undefined,
      concluidaEm: t.concluida_em ?? t.criada_em,
      removida: t.status === "removida",
      expirada: t.status === "expirada",
      xpCobrado: t.xp_cobrado ?? undefined,
    }));

  useTaskStore.setState({ pendentes, concluidas });
}

async function carregarCategorias(userId: string) {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (!data || data.length === 0) return;

  useCategoryStore.setState({
    categories: data.map((c) => ({
      id: c.id,
      nome: c.nome,
      cor: c.cor,
    })),
  });
}

export async function salvarPlayerStats(userId: string) {
  const { xpAtual, xpTotal, level, streak, ultimoDiaAtivo } =
    usePlayerStore.getState();

  await supabase
    .from("player_stats")
    .update({
      xp_atual: xpAtual,
      xp_total: xpTotal,
      level,
      streak,
      ultimo_dia_ativo: ultimoDiaAtivo,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
}

export async function salvarTarefaNova(userId: string, tarefaId: string) {
  const tarefa = useTaskStore
    .getState()
    .pendentes.find((t) => t.id === tarefaId);
  if (!tarefa) return;

  const { data: catData } = await supabase
    .from("categories")
    .select("id")
    .eq("user_id", userId)
    .eq("nome", tarefa.categoriaNome)
    .maybeSingle();

  const { error } = await supabase.from("tasks").insert({
    id: tarefa.id,
    user_id: userId,
    category_id: catData?.id ?? null,
    category_nome: tarefa.categoriaNome,
    nome: tarefa.nome,
    dificuldade: tarefa.dificuldade,
    xp: tarefa.xp,
    status: "pendente",
    data_limite: tarefa.dataLimite ?? null,
    criada_em: tarefa.criadaEm,
  });

  if (error) console.warn("Erro ao salvar tarefa:", error.message);
}

export async function atualizarStatusTarefa(
  tarefaId: string,
  status: "concluida" | "removida" | "expirada",
  xpCobrado?: number,
) {
  const { error } = await supabase
    .from("tasks")
    .update({
      status,
      concluida_em: new Date().toISOString(),
      xp_cobrado: xpCobrado ?? null,
    })
    .eq("id", tarefaId);

  if (error) console.warn("Erro ao atualizar tarefa:", error.message);
}

export async function salvarCategoriaNova(
  userId: string,
  nome: string,
  cor: string,
) {
  const { data, error } = await supabase
    .from("categories")
    .insert({ user_id: userId, nome, cor })
    .select("id")
    .single();

  if (error) console.warn("Erro ao salvar categoria:", error.message);
  return data?.id ?? null;
}

export async function removerCategoriaBanco(
  userId: string,
  categoriaId: string,
) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("user_id", userId)
    .eq("id", categoriaId);

  if (error) console.warn("Erro ao remover categoria:", error.message);
}
