import { useState } from "react";
import type { VervollstaendigenData } from "../data/courses";
import { HighlightTerms } from "../utils/highlightTerms";
import styles from "./Vervollstaendigen.module.css";

interface Props {
  data: VervollstaendigenData;
  onAnswer: (selectedIndex: number) => void;
  disabled?: boolean;
}

export function Vervollstaendigen({ data, onAnswer, disabled }: Props) {
  const gapCount = data.correctAnswers?.length ?? 1;
  const parts = data.parts ?? [data.before, data.after];
  const [picked, setPicked] = useState<Array<number | null>>(
    Array.from({ length: gapCount }, () => null),
  );
  const [submitted, setSubmitted] = useState(false);

  function handlePick(i: number) {
    if (disabled || submitted || picked.includes(i)) return;
    const nextGap = picked.findIndex((value) => value === null);
    if (nextGap === -1) return;

    const next = [...picked];
    next[nextGap] = i;
    setPicked(next);

    if (next.every((value) => value !== null)) {
      const isCorrect = data.correctAnswers
        ? data.correctAnswers.every((answer, gapIndex) => data.options[next[gapIndex] ?? -1] === answer)
        : next[0] === data.correct;
      setSubmitted(true);
      onAnswer(isCorrect ? data.correct : -1);
    }
  }

  function getGapState(gapIndex: number): "default" | "correct" | "wrong" {
    if (!submitted) return "default";
    const selected = picked[gapIndex];
    if (selected === null) return "wrong";
    const expected = data.correctAnswers?.[gapIndex] ?? data.options[data.correct];
    return data.options[selected] === expected ? "correct" : "wrong";
  }

  return (
    <div className={styles.root}>
      <p className={styles.question}>
        <HighlightTerms text={data.question} ids={data.glossarLinks} />
      </p>

      <div className={styles.sentence} aria-live="polite">
        {Array.from({ length: gapCount }).map((_, gapIndex) => {
          const selected = picked[gapIndex];
          const state = getGapState(gapIndex);
          return (
            <span key={gapIndex} className={styles.sentencePart}>
              <span>{parts[gapIndex]}</span>
              <span className={`${styles.blank} ${state !== "default" ? styles[state] : ""}`}>
                {selected !== null ? data.options[selected] : "___"}
              </span>
            </span>
          );
        })}
        <span>{parts[gapCount]}</span>
      </div>

      <div className={styles.chips}>
        {data.options.map((opt, i) => {
          let state: "default" | "correct" | "wrong" | "dim" = "default";
          const usedGap = picked.findIndex((value) => value === i);
          if (submitted) {
            if (usedGap !== -1) state = getGapState(usedGap);
            else if (data.correctAnswers?.includes(opt) || i === data.correct) state = "correct";
            else state = "dim";
          } else if (picked.includes(i)) {
            state = "dim";
          }
          return (
            <button
              key={i}
              type="button"
              className={`${styles.chip} ${styles[state]}`}
              onClick={() => handlePick(i)}
              disabled={disabled || submitted || picked.includes(i)}
            >
              {opt}
            </button>
          );
        })}
      </div>

    </div>
  );
}
