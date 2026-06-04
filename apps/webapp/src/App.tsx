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

const LESSON_SLIDES: Record<string, Array<Omit<Extract<Exercise["data"], { type: "lesson" }>, "type">>> = {
  grundlagen: [
    {
      title: "Woran du eine Internetadresse erkennst",
      body: "Eine Internetadresse zeigt, wohin ein Link führt. Der wichtigste Teil heißt Domain: Das ist der Hauptname direkt vor .de, .com oder einer ähnlichen Endung.",
      bullets: ["Eine kurze Domain ist leichter zu prüfen.", "Zusatzwörter wie login24 oder sicher-konto können ein Warnzeichen sein."],
      glossarLinks: ["domain"],
    },
    {
      title: "Sichere Verbindung bedeutet nicht automatisch sichere Seite",
      body: "HTTPS und das Schloss im Browser zeigen nur, dass die Verbindung verschlüsselt ist. Auch Betrugsseiten können HTTPS nutzen.",
      bullets: ["Prüfe zusätzlich die Domain der Webseite.", "Gib persönliche Daten nur ein, wenn du sicher bist."],
      glossarLinks: ["https"],
    },
  ],
  scamming: [
    {
      title: "Betrug im Internet wirkt oft dringend",
      body: "Viele Betrugsversuche setzen dich unter Druck: angeblich läuft ein Konto ab, ein Paket wartet oder ein Familienmitglied braucht sofort Hilfe. Das Fachwort Phishing beschreibt gefälschte Nachrichten, die Daten stehlen sollen.",
      bullets: ["Nimm dir Zeit.", "Öffne keine Links aus der Nachricht.", "Frage über einen bekannten Kontaktweg nach."],
      glossarLinks: ["phishing"],
    },
    {
      title: "Gefälschte Nachrichten erkennen",
      body: "Gefälschte E-Mails oder SMS sehen oft echt aus. Bei Phishing achtest du besonders auf Absender, Link-Adresse und ungewöhnliche Forderungen.",
      bullets: ["Banken fragen keine Passwörter per Nachricht ab.", "Unbekannte Nummern sollten nie direkt Geld bekommen."],
      glossarLinks: ["phishing"],
    },
  ],
  news: [
    {
      title: "Nicht jede Meldung ist eine verlässliche Nachricht",
      body: "Bevor du eine Nachricht glaubst oder weiterleitest, prüfe, wer sie veröffentlicht hat. Reißerische Überschriften nennt man oft Clickbait.",
      bullets: ["Achte auf Datum und Quelle.", "Suche nach einer zweiten Bestätigung."],
      glossarLinks: ["clickbait"],
    },
  ],
  socialmedia: [
    {
      title: "Soziale Netzwerke zeigen nicht alles neutral",
      body: "Plattformen zeigen dir oft Inhalte, die zu deinen bisherigen Klicks passen. So kann eine Filterblase entstehen: Du siehst dann weniger andere Sichtweisen.",
      bullets: ["Prüfe starke Behauptungen außerhalb der Plattform.", "Teile persönliche Daten nur bewusst."],
      glossarLinks: ["filterblase"],
    },
  ],
};

function withLessonSlides(categoryId: string, exercises: Exercise[]): Exercise[] {
  const slides = LESSON_SLIDES[categoryId] ?? [];
  if (slides.length === 0) return exercises;

  return exercises.flatMap((exercise, index) => {
    const slide = slides[index % slides.length];
    return [
      {
        id: `lesson-${categoryId}-${index + 1}`,
        data: {
          type: "lesson",
          mediaType: "text",
          ...slide,
        },
      } satisfies Exercise,
      exercise,
    ];
  });
}

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
              goExercise(withLessonSlides(catId, exercises), catId, { returnToCategory: view.categoryId })
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
