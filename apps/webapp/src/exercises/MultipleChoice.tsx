import { useState } from "react";
import type { MCQData } from "../data/courses";
import { HighlightTerms } from "../utils/highlightTerms";
import styles from "./MultipleChoice.module.css";

interface Props {
  data: MCQData;
  onAnswer: (selectedIndex: number) => void;
  disabled?: boolean;
  revealCorrect?: number;
  selectedAnswer?: number;
}

export function MultipleChoice({ data, onAnswer, disabled, revealCorrect, selectedAnswer }: Props) {
  const [picked, setPicked] = useState<number | null>(selectedAnswer ?? null);

  function handlePick(i: number) {
    if (disabled || picked !== null) return;
    setPicked(i);
    onAnswer(i);
  }

  return (
    <div className={styles.root}>
      <p className={styles.question}>
        <HighlightTerms text={data.question} ids={data.glossarLinks} />
      </p>

      <ul className={styles.options}>
        {data.options.map((opt, i) => {
          let state: "default" | "correct" | "wrong" | "missed" = "default";
          if (picked !== null || revealCorrect !== undefined) {
            if (i === data.correct) state = "correct";
            else if (i === picked && picked !== data.correct) state = "wrong";
          }
          return (
            <li key={i}>
              <button
                type="button"
                className={`${styles.option} ${styles[state]}`}
                onClick={() => handlePick(i)}
                disabled={disabled || picked !== null}
                aria-pressed={picked === i}
              >
                <span className={styles.letter}>{String.fromCharCode(65 + i)}</span>
                <span className={styles.text}>{opt}</span>
                {state === "correct" && <span className={styles.icon}>✓</span>}
                {state === "wrong" && <span className={styles.icon}>✗</span>}
              </button>
            </li>
          );
        })}
      </ul>

    </div>
  );
}
