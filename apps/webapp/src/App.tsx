import { useEffect, useState, useCallback } from "react";
import { GlossarProvider } from "./glossar/GlossarContext";
import { GlossarModal } from "./glossar/GlossarModal";
import { AppShell } from "./components/AppShell";
import { ErrorBoundary } from "./components/ErrorBoundary";
import type { Page } from "./components/AppShell";
import { AuthPage } from "./pages/AuthPage";
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
import { getOnboardingResult, onboardingExercises } from "./data/onboarding";
import { hasCompletedOnboarding, saveOnboardingRecord } from "./lib/onboarding/onboardingStorage";
import { recordExerciseAttempt } from "./lib/learning/progressRepository";
import { useAuthStatus } from "./lib/supabase/useAuthStatus";

type View =
  | { type: "onboarding" }
  | { type: "auth" }
  | { type: "learn" }
  | { type: "category"; categoryId: string }
  | { type: "faelle" }
  | { type: "exercise"; exercises: Exercise[]; categoryId: string; returnToCategory?: string; returnToFaelle?: boolean }
  | { type: "repeat" }
  | { type: "glossar" }
  | { type: "profile" };

function getInitialView(): View {
  const params = new URLSearchParams(window.location.search);
  const authIntent = params.get("auth");
  const onboardingIntent = params.get("onboarding");

  if (
    authIntent === "login" ||
    authIntent === "register" ||
    authIntent === "callback" ||
    authIntent === "reset-password"
  ) return { type: "auth" };
  if (onboardingIntent === "1") return { type: "onboarding" };
  if (!hasCompletedOnboarding()) return { type: "onboarding" };
  return { type: "learn" };
}

export default function App() {
  const [view, setView] = useState<View>(getInitialView);
  const { progress, completeExercises, resetProgress, refreshProgress } = useProgressContext();
  const auth = useAuthStatus();

  const goLearn    = useCallback(() => setView({ type: "learn" }),    []);
  const goRepeat   = useCallback(() => setView({ type: "repeat" }),   []);
  const goProfile  = useCallback(() => setView({ type: "profile" }),  []);
  const goFaelle   = useCallback(() => setView({ type: "faelle" }),   []);
  const goGlossar  = useCallback(() => setView({ type: "glossar" }),  []);
  const goAuth     = useCallback(() => setView({ type: "auth" }),     []);
  const goCategory = useCallback((categoryId: string) => setView({ type: "category", categoryId }), []);

  useEffect(() => {
    if (!auth.loading && auth.isRegistered && view.type === "onboarding") {
      goLearn();
    }
  }, [auth.loading, auth.isRegistered, view.type, goLearn]);

  useEffect(() => {
    if (!auth.loading && !auth.isRegistered && view.type === "profile") {
      goAuth();
    }
  }, [auth.loading, auth.isRegistered, view.type, goAuth]);

  useEffect(() => {
    if (!auth.loading && auth.userId) {
      refreshProgress();
    }
  }, [auth.loading, auth.userId, refreshProgress]);

  const goExercise = useCallback(
    (exercises: Exercise[], categoryId: string, opts?: { returnToCategory?: string; returnToFaelle?: boolean }) =>
      setView({ type: "exercise", exercises, categoryId, ...opts }),
    [],
  );

  const handleExerciseComplete = useCallback(
    (_xpEarned: number, exerciseIds: string[]) => {
      completeExercises(exerciseIds);
      if (view.type !== "exercise") return;
      if (view.returnToFaelle) goFaelle();
      else if (view.returnToCategory) goCategory(view.returnToCategory);
      else goLearn();
    },
    [view, completeExercises, goFaelle, goCategory, goLearn],
  );

  const handleExerciseClose = useCallback(() => {
    if (view.type !== "exercise") return;
    if (view.returnToFaelle) goFaelle();
    else if (view.returnToCategory) goCategory(view.returnToCategory);
    else goLearn();
  }, [view, goFaelle, goCategory, goLearn]);

  const completeOnboarding = useCallback((correctExerciseIds: string[]) => {
    const result = getOnboardingResult(correctExerciseIds.length, onboardingExercises.length);
    saveOnboardingRecord({
      completed: true,
      answers: correctExerciseIds.map((id) => ({ questionId: id, optionId: "correct" })),
      result,
      completedAt: new Date().toISOString(),
    });
    goCategory(result.recommendedCategoryId);
  }, [goCategory]);

  const closeOnboarding = useCallback(() => {
    if (hasCompletedOnboarding()) {
      goLearn();
      return;
    }
    completeOnboarding([]);
  }, [completeOnboarding, goLearn]);

  if (view.type === "onboarding") {
    return (
      <GlossarProvider>
        <ErrorBoundary>
          <ExercisePage
            exercises={onboardingExercises}
            categoryTitle="Einstufung"
            onComplete={(_xp, correctIds) => completeOnboarding(correctIds)}
            onClose={closeOnboarding}
            completionVariant="assessment"
            getAssessmentResult={getOnboardingResult}
          />
        </ErrorBoundary>
        <GlossarModal />
      </GlossarProvider>
    );
  }

  if (view.type === "auth") {
    return (
      <GlossarProvider>
        <ErrorBoundary>
          <AuthPage auth={auth} onBack={goLearn} onAuthSuccess={refreshProgress} />
        </ErrorBoundary>
        <GlossarModal />
      </GlossarProvider>
    );
  }

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
            onAttempt={(exerciseId, correct, selectedIndex) => {
              void recordExerciseAttempt(exerciseId, correct, selectedIndex);
            }}
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
          else if (auth.isRegistered) goProfile();
          else goAuth();
        }}
        isRegistered={auth.isRegistered}
        onOpenAuth={goAuth}
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
          <ProfilePage
            progress={progress}
            auth={auth}
            onOpenAuth={goAuth}
            onResetProgress={resetProgress}
          />
        )}
      </AppShell>
      <GlossarModal />
    </GlossarProvider>
  );
}
