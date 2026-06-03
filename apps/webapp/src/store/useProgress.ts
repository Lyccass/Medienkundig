import { useState, useCallback } from "react";

export interface Progress {
  completedExercises: string[];
  xp: number;
  streak: number;
}

const STORAGE_KEY = "mk_progress_v1";

function load(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Progress;
  } catch {
    // ignore parse errors
  }
  return { completedExercises: [], xp: 0, streak: 1 };
}

function persist(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load);

  const completeExercises = useCallback((ids: string[], xpGained: number) => {
    setProgress((prev) => {
      const newCompleted = [...prev.completedExercises];
      for (const id of ids) {
        if (!newCompleted.includes(id)) newCompleted.push(id);
      }
      const updated: Progress = { ...prev, completedExercises: newCompleted, xp: prev.xp + xpGained };
      persist(updated);
      return updated;
    });
  }, []);

  const isCompleted = useCallback(
    (id: string) => progress.completedExercises.includes(id),
    [progress],
  );

  const getUnitProgress = useCallback(
    (exerciseIds: string[]) =>
      exerciseIds.filter((id) => progress.completedExercises.includes(id)).length,
    [progress],
  );

  const resetProgress = useCallback(() => {
    const fresh: Progress = { completedExercises: [], xp: 0, streak: 1 };
    persist(fresh);
    setProgress(fresh);
  }, []);

  return { progress, completeExercises, isCompleted, getUnitProgress, resetProgress };
}
