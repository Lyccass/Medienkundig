import type { Progress } from "../../store/useProgress";
import { ensureSupabaseUser } from "../supabase/auth";
import { getSupabaseClient } from "../supabase/client";
import type { Json } from "../supabase/types";
import { getKnownExerciseIds } from "./exerciseIndex";

export async function fetchRemoteProgress(): Promise<Progress | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user) return null;

  const [{ data: progressRows, error: progressError }, { data: statsRow, error: statsError }] = await Promise.all([
    supabase
      .from("learning_progress")
      .select("exercise_id")
      .eq("user_id", user.id),
    supabase
      .from("user_stats")
      .select("xp, streak")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  if (progressError || statsError) return null;

  return {
    completedExercises: progressRows?.map((row) => row.exercise_id) ?? [],
    xp: statsRow?.xp ?? 0,
    streak: statsRow?.streak ?? 1,
  };
}

export async function recordExerciseAttempt(
  exerciseId: string,
  correct: boolean,
  answer?: Json,
): Promise<void> {
  const [knownExerciseId] = getKnownExerciseIds([exerciseId]);
  if (!knownExerciseId) return;

  const user = await ensureSupabaseUser();
  const supabase = getSupabaseClient();
  if (!user || !supabase) return;

  const { error } = await supabase.rpc("record_learning_attempt", {
    p_exercise_id: knownExerciseId,
    p_correct: correct,
    p_answer: answer ?? null,
  });
  if (error) console.warn("[progress] record_learning_attempt failed:", error.message);
}

export async function recordExerciseCompletion(
  exerciseIds: string[],
): Promise<Pick<Progress, "xp" | "streak"> | null> {
  if (exerciseIds.length === 0) return null;

  const user = await ensureSupabaseUser();
  const supabase = getSupabaseClient();
  if (!user || !supabase) return null;

  const { data, error } = await supabase.rpc("complete_learning_exercises", {
    p_exercise_ids: getKnownExerciseIds(exerciseIds),
  });
  if (error) console.warn("[progress] complete_learning_exercises failed:", error.message);
  if (!data || error) return null;
  return { xp: data.xp, streak: data.streak };
}

export async function syncRemoteProgress(progress: Progress): Promise<Pick<Progress, "xp" | "streak"> | null> {
  const user = await ensureSupabaseUser();
  const supabase = getSupabaseClient();
  if (!user || !supabase) return null;

  const exerciseIds = getKnownExerciseIds(progress.completedExercises);

  if (exerciseIds.length > 0) {
    const { data, error } = await supabase.rpc("complete_learning_exercises", {
      p_exercise_ids: exerciseIds,
    });
    if (error) console.warn("[progress] syncRemoteProgress RPC failed:", error.message);
    if (!data || error) return null;
    return { xp: data.xp, streak: data.streak };
  }

  return null;
}

export async function resetRemoteProgress(): Promise<Pick<Progress, "xp" | "streak"> | null> {
  const user = await ensureSupabaseUser();
  const supabase = getSupabaseClient();
  if (!user || !supabase) return null;

  const { data, error } = await supabase.rpc("reset_learning_progress", {});
  if (error) console.warn("[progress] reset_learning_progress failed:", error.message);
  if (!data || error) return null;
  return { xp: data.xp, streak: data.streak };
}
