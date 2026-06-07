import type { Progress } from "../../store/useProgress";
import { ensureSupabaseUser } from "../supabase/auth";
import { getSupabaseClient } from "../supabase/client";
import { getKnownExerciseIds } from "./exerciseIndex";

export async function fetchRemoteProgress(): Promise<Progress | null> {
  const user = await ensureSupabaseUser();
  const supabase = getSupabaseClient();
  if (!user || !supabase) return null;

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
  answer?: unknown,
): Promise<void> {
  const [knownExerciseId] = getKnownExerciseIds([exerciseId]);
  if (!knownExerciseId) return;

  const user = await ensureSupabaseUser();
  const supabase = getSupabaseClient();
  if (!user || !supabase) return;

  await supabase.rpc("record_learning_attempt", {
    p_exercise_id: knownExerciseId,
    p_correct: correct,
    p_answer: answer ?? null,
  });
}

export async function recordExerciseCompletion(
  exerciseIds: string[],
): Promise<void> {
  if (exerciseIds.length === 0) return;

  const user = await ensureSupabaseUser();
  const supabase = getSupabaseClient();
  if (!user || !supabase) return;

  await supabase.rpc("complete_learning_exercises", {
    p_exercise_ids: getKnownExerciseIds(exerciseIds),
  });
}

export async function replaceRemoteProgress(progress: Progress): Promise<void> {
  const user = await ensureSupabaseUser();
  const supabase = getSupabaseClient();
  if (!user || !supabase) return;

  const exerciseIds = getKnownExerciseIds(progress.completedExercises);

  await supabase.from("profiles").upsert({ user_id: user.id }, { onConflict: "user_id" });
  if (exerciseIds.length > 0) {
    await supabase.rpc("complete_learning_exercises", {
      p_exercise_ids: exerciseIds,
    });
  }
}

export async function resetRemoteProgress(): Promise<void> {
  const user = await ensureSupabaseUser();
  const supabase = getSupabaseClient();
  if (!user || !supabase) return;

  await Promise.all([
    supabase.from("learning_progress").delete().eq("user_id", user.id),
    supabase.from("exercise_attempts").delete().eq("user_id", user.id),
  ]);

  await supabase.from("user_stats").upsert(
    {
      user_id: user.id,
      xp: 0,
      streak: 1,
      last_activity_date: null,
    },
    { onConflict: "user_id" },
  );
}
