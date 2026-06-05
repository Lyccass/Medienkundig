import { useState, useCallback, useEffect } from "react";
import { X, Check, RotateCcw } from "lucide-react";
import type { Exercise } from "../data/courses";
import { MultipleChoice } from "../exercises/MultipleChoice";
import { BildAuswahl } from "../exercises/BildAuswahl";
import { AudioAuswahl } from "../exercises/AudioAuswahl";
import { MemoryGame } from "../exercises/MemoryGame";
import { FlipMemoryGame } from "../exercises/FlipMemoryGame";
import { Vervollstaendigen } from "../exercises/Vervollstaendigen";
import { FallExercise } from "../exercises/FallExercise";
import { WarnzeichenExercise } from "../exercises/WarnzeichenExercise";
import { NextStepExercise } from "../exercises/NextStepExercise";
import { UrlTrainerExercise } from "../exercises/UrlTrainerExercise";
import { HighlightTerms } from "../utils/highlightTerms";
import styles from "./ExercisePage.module.css";

interface Props {
  exercises: Exercise[];
  categoryTitle: string;
  onComplete: (xpEarned: number, exerciseIds: string[]) => void;
  onClose: () => void;
}

type Phase =
  | { type: "question" }
  | { type: "feedback"; correct: boolean; explanation?: string }
  | { type: "complete"; xp: number };

const XP_CORRECT = 10;
const XP_MEMORY = 20;

function getNextLessonButtonLabel(exercises: Exercise[], index: number) {
  const next = exercises[index + 1];
  if (!next) return "Fertig";
  if (next.data.type === "lesson") return "Weiter";

  const exerciseNumber = exercises
    .slice(0, index + 2)
    .filter((exercise) => exercise.data.type !== "lesson")
    .length;

  return `Weiter zu Übung ${exerciseNumber}`;
}

export function ExercisePage({
  exercises,
  categoryTitle,
  onComplete,
  onClose,
}: Props) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>({ type: "question" });
  const [xpEarned, setXpEarned] = useState(0);
  const [correctExerciseIds, setCorrectExerciseIds] = useState<string[]>([]);

  const current = exercises[index];
  const isMemory = current?.data.type === "memory";

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && phase.type === "feedback") advance();
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, phase]);

  function handleAnswer(selectedIndex: number) {
    const data = current.data;
    if (
      data.type === "multipleChoice" ||
      data.type === "bildAuswahl" ||
      data.type === "audioAuswahl" ||
      data.type === "vervollstaendigen" ||
      data.type === "fall" ||
      data.type === "nextStep" ||
      data.type === "urlTrainer"
    ) {
      const correct = selectedIndex === data.correct;
      setXpEarned((x) => x + (correct ? XP_CORRECT : 0));
      if (correct) {
        setCorrectExerciseIds((ids) => ids.includes(current.id) ? ids : [...ids, current.id]);
      }
      setPhase({ type: "feedback", correct, explanation: data.explanation });
    }

    if (data.type === "warnzeichen") {
      const correct = selectedIndex === 1;
      setXpEarned((x) => x + (correct ? XP_CORRECT : 0));
      if (correct) {
        setCorrectExerciseIds((ids) => ids.includes(current.id) ? ids : [...ids, current.id]);
      }
      setPhase({ type: "feedback", correct, explanation: data.explanation });
    }
  }

  const handleMemoryComplete = useCallback(() => {
    setXpEarned((x) => x + XP_MEMORY);
    setCorrectExerciseIds((ids) => ids.includes(current.id) ? ids : [...ids, current.id]);
    const explanation = current.data.type === "memory" ? current.data.explanation : undefined;
    setPhase({ type: "feedback", correct: true, explanation });
  }, [current]);

  function advance() {
    const next = index + 1;
    if (next >= exercises.length) {
      setPhase({ type: "complete", xp: xpEarned });
    } else {
      setIndex(next);
      setPhase({ type: "question" });
    }
  }

  const progress = (index + (phase.type !== "question" ? 1 : 0)) / exercises.length;
  const scoredExercises = exercises.filter((exercise) => exercise.data.type !== "lesson");

  /* ── Complete screen ── */
  if (phase.type === "complete") {
    const maxXp = scoredExercises.length * XP_CORRECT;
    const correctCount = correctExerciseIds.length;
    const perfect = correctCount === scoredExercises.length;
    return (
      <div className={styles.page}>
        <div className={styles.completeWrap}>
          <div className={`${styles.completeCircle} ${perfect ? styles.completePerfect : ""}`}>
            <Check className={styles.iconOnDark} size={40} strokeWidth={2.5} />
          </div>
          <h2 className={styles.completeTitle}>{perfect ? "Perfekt! 🎉" : "Gut gemacht!"}</h2>
          <p className={styles.completeSub}>Einheit abgeschlossen</p>

          <div className={styles.xpBubble}>
            <span className={styles.xpIcon}>⚡</span>
            <span className={styles.xpNum}>+{phase.xp}</span>
            <span className={styles.xpLabel}>XP</span>
          </div>

          {!perfect && (
            <p className={styles.completeTip}>
              {correctCount} von {scoredExercises.length} Übungen richtig beantwortet
            </p>
          )}

          <button
            type="button"
            className={styles.doneBtn}
            onClick={() => onComplete(phase.xp, correctExerciseIds)}
          >
            WEITER
          </button>
        </div>
      </div>
    );
  }

  /* ── Exercise screen ── */
  const isFeedback = phase.type === "feedback";
  const isCorrect  = isFeedback && phase.correct;
  const isWrong    = isFeedback && !phase.correct;

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <header className={styles.topBar}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Beenden">
          <X size={18} strokeWidth={2} />
        </button>

        <progress className={styles.progressTrack} value={progress} max={1} aria-label="Fortschritt" />

        <span className={styles.stepCounter}>{index + 1}/{exercises.length}</span>
      </header>

      {/* Body */}
      <main className={styles.body}>
        <div className={`${styles.exerciseCard} ${current.data.type === "lesson" ? styles.lessonMode : ""}`} key={current.id}>
          <p className={styles.catLabel}>{categoryTitle}</p>

          {current.data.type === "multipleChoice" && (
            <MultipleChoice data={current.data} onAnswer={handleAnswer} disabled={isFeedback} />
          )}
          {current.data.type === "lesson" && (
            <div className={styles.lesson}>
              <p className={styles.lessonKicker}>
                {current.data.kicker ?? (current.data.mediaType === "audio" ? "Hören & verstehen" : current.data.mediaType === "video" ? "Ansehen & verstehen" : "Kurz erklärt")}
              </p>
              <h1 className={styles.lessonTitle}>{current.data.title}</h1>
              <p className={styles.lessonBody}>
                <HighlightTerms text={current.data.body} ids={current.data.glossarLinks} />
              </p>
              {current.data.bullets && (
                <ul className={styles.lessonList}>
                  {current.data.bullets.map((bullet) => (
                    <li key={bullet}>
                      <HighlightTerms text={bullet} ids={current.data.glossarLinks} />
                    </li>
                  ))}
                </ul>
              )}
              {current.data.sections && (
                <div className={styles.lessonSections}>
                  {current.data.sections.map((section, i) => (
                    <div key={i} className={styles.lessonSection}>
                      <p className={styles.lessonSectionHeading}>{section.heading}</p>
                      {section.body && (
                        <p className={styles.lessonSectionBody}>
                          <HighlightTerms text={section.body} ids={current.data.glossarLinks} />
                        </p>
                      )}
                      {section.bullets && (
                        <ul className={styles.lessonSectionList}>
                          {section.bullets.map((bullet, j) => (
                            <li key={j}>
                              <HighlightTerms text={bullet} ids={current.data.glossarLinks} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <button type="button" className={styles.lessonBtn} onClick={advance}>
                {getNextLessonButtonLabel(exercises, index)}
              </button>
            </div>
          )}
          {current.data.type === "bildAuswahl" && (
            <BildAuswahl data={current.data} onAnswer={handleAnswer} disabled={isFeedback} />
          )}
          {current.data.type === "audioAuswahl" && (
            <AudioAuswahl data={current.data} onAnswer={handleAnswer} disabled={isFeedback} />
          )}
          {current.data.type === "memory" && (
            current.data.variant === "flip"
              ? <FlipMemoryGame data={current.data} onComplete={handleMemoryComplete} />
              : <MemoryGame data={current.data} onComplete={handleMemoryComplete} />
          )}
          {current.data.type === "vervollstaendigen" && (
            <Vervollstaendigen data={current.data} onAnswer={handleAnswer} disabled={isFeedback} />
          )}
          {current.data.type === "fall" && (
            <FallExercise data={current.data} onAnswer={handleAnswer} disabled={isFeedback} />
          )}
          {current.data.type === "warnzeichen" && (
            <WarnzeichenExercise data={current.data} onAnswer={handleAnswer} disabled={isFeedback} />
          )}
          {current.data.type === "nextStep" && (
            <NextStepExercise data={current.data} onAnswer={handleAnswer} disabled={isFeedback} />
          )}
          {current.data.type === "urlTrainer" && (
            <UrlTrainerExercise data={current.data} onAnswer={handleAnswer} disabled={isFeedback} />
          )}
        </div>
      </main>

      {/* Bottom strip — ALWAYS same height to prevent layout shift */}
      <div
        className={`${styles.bottomBar} ${isCorrect ? styles.correct : ""} ${isWrong ? styles.wrong : ""}`}
      >
        {isFeedback ? (
          <>
            <div className={styles.feedbackLeft}>
              <div className={`${styles.feedbackBadge} ${isCorrect ? styles.badgeCorrect : styles.badgeWrong}`}>
                {isCorrect
                  ? <Check className={styles.iconOnDark} size={16} strokeWidth={2.5} />
                  : <X className={styles.iconOnDark} size={16} strokeWidth={2.5} />
                }
              </div>
              <div className={styles.feedbackTexts}>
                <p className={styles.feedbackTitle}>
                  {isCorrect ? "Richtig!" : "Nicht ganz…"}
                </p>
                {phase.explanation && (
                  <p className={styles.feedbackExplain}>{phase.explanation}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              className={`${styles.continueBtn} ${isCorrect ? styles.continueBtnGreen : styles.continueBtnRed}`}
              onClick={advance}
              autoFocus
            >
              WEITER
            </button>
          </>
        ) : isMemory ? (
          <p className={styles.hintText}>
            <RotateCcw className={styles.inlineIcon} size={13} strokeWidth={2} />
            Alle Paare zuordnen, um fortzufahren
          </p>
        ) : (
          /* empty placeholder keeps the height */
          <span />
        )}
      </div>
    </div>
  );
}
