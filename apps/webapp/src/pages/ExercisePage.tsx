import { useState, useCallback, useEffect } from "react";
import { X, Check, RotateCcw } from "lucide-react";
import type { Exercise } from "../data/courses";
import { MultipleChoice } from "../exercises/MultipleChoice";
import { BildAuswahl } from "../exercises/BildAuswahl";
import { AudioAuswahl } from "../exercises/AudioAuswahl";
import { MemoryGame } from "../exercises/MemoryGame";
import { Vervollstaendigen } from "../exercises/Vervollstaendigen";
import { FallExercise } from "../exercises/FallExercise";
import styles from "./ExercisePage.module.css";

interface Props {
  exercises: Exercise[];
  categoryColor: string;
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

export function ExercisePage({
  exercises,
  categoryColor,
  categoryTitle,
  onComplete,
  onClose,
}: Props) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>({ type: "question" });
  const [xpEarned, setXpEarned] = useState(0);

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
      data.type === "fall"
    ) {
      const correct = selectedIndex === (data as { correct: number }).correct;
      setXpEarned((x) => x + (correct ? XP_CORRECT : 0));
      setPhase({
        type: "feedback",
        correct,
        explanation: (data as { explanation?: string }).explanation,
      });
    }
  }

  const handleMemoryComplete = useCallback(() => {
    setXpEarned((x) => x + XP_MEMORY);
    const explanation = (current.data as { explanation?: string }).explanation;
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

  /* ── Complete screen ── */
  if (phase.type === "complete") {
    const maxXp = exercises.length * XP_CORRECT;
    const perfect = phase.xp >= maxXp;
    return (
      <div className={styles.page}>
        <div className={styles.completeWrap}>
          <div className={`${styles.completeCircle} ${perfect ? styles.completePerfect : ""}`}>
            <Check size={40} strokeWidth={2.5} color="white" />
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
              {Math.round((phase.xp / maxXp) * 100)}% korrekt
            </p>
          )}

          <button
            type="button"
            className={styles.doneBtn}
            style={{ background: categoryColor }}
            onClick={() => onComplete(phase.xp, exercises.map((e) => e.id))}
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

        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress * 100}%`, background: categoryColor }}
          />
        </div>

        <span className={styles.stepCounter}>{index + 1}/{exercises.length}</span>
      </header>

      {/* Body */}
      <main className={styles.body}>
        <div className={styles.exerciseCard}>
          <p className={styles.catLabel} style={{ color: categoryColor }}>
            {categoryTitle}
          </p>

          {current.data.type === "multipleChoice" && (
            <MultipleChoice data={current.data} onAnswer={handleAnswer} disabled={isFeedback} />
          )}
          {current.data.type === "bildAuswahl" && (
            <BildAuswahl data={current.data} onAnswer={handleAnswer} disabled={isFeedback} />
          )}
          {current.data.type === "audioAuswahl" && (
            <AudioAuswahl data={current.data} onAnswer={handleAnswer} disabled={isFeedback} />
          )}
          {current.data.type === "memory" && (
            <MemoryGame data={current.data} onComplete={handleMemoryComplete} />
          )}
          {current.data.type === "vervollstaendigen" && (
            <Vervollstaendigen data={current.data} onAnswer={handleAnswer} disabled={isFeedback} />
          )}
          {current.data.type === "fall" && (
            <FallExercise data={current.data} onAnswer={handleAnswer} disabled={isFeedback} />
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
                  ? <Check size={16} strokeWidth={2.5} color="white" />
                  : <X size={16} strokeWidth={2.5} color="white" />
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
            <RotateCcw size={13} strokeWidth={2} style={{ display: "inline", marginRight: "0.375rem", verticalAlign: "middle" }} />
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
