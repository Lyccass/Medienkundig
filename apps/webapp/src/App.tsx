import { useState, useCallback } from "react";
import { GlossarProvider } from "./glossar/GlossarContext";
import { GlossarModal } from "./glossar/GlossarModal";
import { AppShell } from "./components/AppShell";
import { ErrorBoundary } from "./components/ErrorBoundary";
import type { Page } from "./components/AppShell";
import { ExercisePage } from "./pages/ExercisePage";
import { ProfilePage } from "./pages/ProfilePage";
import { LearnPage } from "./pages/LearnPage";
import { CategoryPage } from "./pages/CategoryPage";
import { RepeatPage } from "./pages/RepeatPage";
import { FaellePage } from "./pages/FaellePage";
import { GlossarPage } from "./pages/GlossarPage";
import { useProgressContext } from "./store/ProgressContext";
import { categories } from "./data/courses";
import type { Exercise } from "./data/courses";

type View =
  | { type: "learn" }
  | { type: "category"; categoryId: string }
  | { type: "faelle" }
  | { type: "exercise"; exercises: Exercise[]; categoryId: string; returnToCategory?: string; returnToFaelle?: boolean }
  | { type: "repeat" }
  | { type: "glossar" }
  | { type: "profile" };

export default function App() {
  const [view, setView] = useState<View>({ type: "learn" });
  const { progress, completeExercises, resetProgress } = useProgressContext();

  const goLearn    = useCallback(() => setView({ type: "learn" }),    []);
  const goRepeat   = useCallback(() => setView({ type: "repeat" }),   []);
  const goProfile  = useCallback(() => setView({ type: "profile" }),  []);
  const goFaelle   = useCallback(() => setView({ type: "faelle" }),   []);
  const goGlossar  = useCallback(() => setView({ type: "glossar" }),  []);
  const goCategory = useCallback((categoryId: string) => setView({ type: "category", categoryId }), []);

  const goExercise = useCallback(
    (exercises: Exercise[], categoryId: string, opts?: { returnToCategory?: string; returnToFaelle?: boolean }) =>
      setView({ type: "exercise", exercises, categoryId, ...opts }),
    [],
  );

  const handleExerciseComplete = useCallback(
    (xpEarned: number, exerciseIds: string[]) => {
      completeExercises(exerciseIds, xpEarned);
      const v = view as Extract<View, { type: "exercise" }>;
      if (v.returnToFaelle) goFaelle();
      else if (v.returnToCategory) goCategory(v.returnToCategory);
      else goLearn();
    },
    [view, completeExercises, goFaelle, goCategory, goLearn],
  );

  const handleExerciseClose = useCallback(() => {
    const v = view as Extract<View, { type: "exercise" }>;
    if (v.returnToFaelle) goFaelle();
    else if (v.returnToCategory) goCategory(v.returnToCategory);
    else goLearn();
  }, [view, goFaelle, goCategory, goLearn]);

  if (view.type === "exercise") {
    const cat = categories.find((c) => c.id === view.categoryId);
    const isFallRun = view.categoryId === "faelle";
    return (
      <GlossarProvider>
        <ErrorBoundary>
          <ExercisePage
            exercises={view.exercises}
            categoryTitle={cat?.title ?? (isFallRun ? "Fall" : "Wiederholen")}
            onComplete={handleExerciseComplete}
            onClose={handleExerciseClose}
          />
        </ErrorBoundary>
        <GlossarModal />
      </GlossarProvider>
    );
  }

  const navPage: Page =
    view.type === "learn" || view.type === "category" ? "learn" :
    view.type === "faelle"  ? "faelle"  :
    view.type === "repeat"  ? "repeat"  :
    view.type === "glossar" ? "glossar" : "profile";

  return (
    <GlossarProvider>
      <AppShell
        activePage={navPage}
        onNavigate={(p) => {
          if      (p === "learn")   goLearn();
          else if (p === "faelle")  goFaelle();
          else if (p === "repeat")  goRepeat();
          else if (p === "glossar") goGlossar();
          else                      goProfile();
        }}
        xp={progress.xp}
        streak={progress.streak}
      >
        {view.type === "learn" && (
          <LearnPage progress={progress} onNavigateToCategory={goCategory} />
        )}
        {view.type === "category" && (
          <CategoryPage
            categoryId={view.categoryId}
            progress={progress}
            onBack={goLearn}
            onStartExercises={(exercises, catId) =>
              goExercise(exercises, catId, { returnToCategory: view.categoryId })
            }
          />
        )}
        {view.type === "faelle" && (
          <FaellePage
            onStartFall={(exercises) =>
              goExercise(exercises, "faelle", { returnToFaelle: true })
            }
          />
        )}
        {view.type === "repeat" && (
          <RepeatPage
            onStartRepeat={(exercises, catId) => goExercise(exercises, catId)}
          />
        )}
        {view.type === "glossar" && <GlossarPage />}
        {view.type === "profile" && (
          <ProfilePage progress={progress} onResetProgress={resetProgress} />
        )}
      </AppShell>
      <GlossarModal />
    </GlossarProvider>
  );
}
