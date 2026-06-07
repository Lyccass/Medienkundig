import React, { createContext, useContext } from "react";
import { useProgress } from "./useProgress";
import type { Progress } from "./useProgress";

interface ProgressContextValue {
  progress: Progress;
  completeExercises: (ids: string[]) => void;
  isCompleted: (id: string) => boolean;
  getUnitProgress: (exerciseIds: string[]) => number;
  resetProgress: () => void;
  syncProgress: () => void;
  refreshProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const value = useProgress();
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgressContext(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgressContext must be used within <ProgressProvider>");
  return ctx;
}
