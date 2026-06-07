import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  fetchRemoteProgress,
  recordExerciseCompletion,
  replaceRemoteProgress,
  resetRemoteProgress,
} from "../lib/learning/progressRepository";

export interface Progress {
  completedExercises: string[];
  xp: number;
  streak: number;
}

const STORAGE_KEY = "mk_progress_v1";

function isValidProgress(p: unknown): p is Progress {
  return (
    p !== null &&
    typeof p === "object" &&
    Array.isArray((p as Progress).completedExercises) &&
    typeof (p as Progress).xp === "number" &&
    typeof (p as Progress).streak === "number"
  );
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isValidProgress(parsed)) return parsed;
    }
  } catch {
    // ignore parse / storage errors
  }
  return { completedExercises: [], xp: 0, streak: 1 };
}

function persist(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function mergeProgress(local: Progress, remote: Progress): Progress {
  return {
    completedExercises: Array.from(new Set([...remote.completedExercises, ...local.completedExercises])),
    xp: Math.max(local.xp, remote.xp),
    streak: Math.max(local.streak, remote.streak),
  };
}

function isSameProgress(a: Progress, b: Progress) {
  if (a.xp !== b.xp || a.streak !== b.streak) return false;
  if (a.completedExercises.length !== b.completedExercises.length) return false;
  const bSet = new Set(b.completedExercises);
  return a.completedExercises.every((id) => bSet.has(id));
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load);
  const didLoadRemote = useRef(false);

  useEffect(() => {
    if (didLoadRemote.current) return;
    didLoadRemote.current = true;

    let alive = true;
    void fetchRemoteProgress().then((remote) => {
      if (!alive || !remote) return;
      setProgress((local) => {
        const merged = mergeProgress(local, remote);
        if (isSameProgress(local, merged)) return local;
        persist(merged);
        void replaceRemoteProgress(merged);
        return merged;
      });
    });

    return () => {
      alive = false;
    };
  }, []);

  // O(1) lookups — derived once per progress change
  const completedSet = useMemo(
    () => new Set(progress.completedExercises),
    [progress.completedExercises],
  );

  const completeExercises = useCallback((ids: string[], xpGained: number) => {
    setProgress((prev) => {
      const prevSet = new Set(prev.completedExercises);
      const newCompleted = [...prev.completedExercises];
      for (const id of ids) {
        if (!prevSet.has(id)) newCompleted.push(id);
      }
      const updated: Progress = { ...prev, completedExercises: newCompleted, xp: prev.xp + xpGained };
      persist(updated);
      void recordExerciseCompletion(ids);
      return updated;
    });
  }, []);

  const isCompleted = useCallback(
    (id: string) => completedSet.has(id),
    [completedSet],
  );

  const getUnitProgress = useCallback(
    (exerciseIds: string[]) => exerciseIds.filter((id) => completedSet.has(id)).length,
    [completedSet],
  );

  const resetProgress = useCallback(() => {
    const fresh: Progress = { completedExercises: [], xp: 0, streak: 1 };
    persist(fresh);
    void resetRemoteProgress();
    setProgress(fresh);
  }, []);

  const syncProgress = useCallback(() => {
    void replaceRemoteProgress(progress);
  }, [progress]);

  return { progress, completeExercises, isCompleted, getUnitProgress, resetProgress, syncProgress };
}
