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
  const [picked, setPicked] = useState<number | null>(null);

  function handlePick(i: number) {
    if (disabled || picked !== null) return;
    setPicked(i);
    onAnswer(i);
  }

  const filledWord = picked !== null ? data.options[picked] : null;

  return (
    <div className={styles.root}>
      <p className={styles.question}>
        <HighlightTerms text={data.question} ids={data.glossarLinks} />
      </p>

      <div className={styles.sentence} aria-live="polite">
        <span>{data.before}</span>
        <span
          className={`${styles.blank} ${
            picked !== null
              ? picked === data.correct
                ? styles.correct
                : styles.wrong
              : ""
          }`}
        >
          {filledWord ?? "___"}
        </span>
        <span>{data.after}</span>
      </div>

      <div className={styles.chips}>
        {data.options.map((opt, i) => {
          let state: "default" | "correct" | "wrong" | "dim" = "default";
          if (picked !== null) {
            if (i === picked && picked === data.correct) state = "correct";
            else if (i === picked) state = "wrong";
            else if (i === data.correct) state = "correct";
            else state = "dim";
          }
          return (
            <button
              key={i}
              type="button"
              className={`${styles.chip} ${styles[state]}`}
              onClick={() => handlePick(i)}
              disabled={disabled || picked !== null}
            >
              {opt}
            </button>
          );
        })}
      </div>

    </div>
  );
}
