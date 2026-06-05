import { useState } from "react";
import type { UrlTrainerData } from "../data/courses";
import { HighlightTerms } from "../utils/highlightTerms";
import styles from "./UrlTrainerExercise.module.css";

interface Props {
  data: UrlTrainerData;
  onAnswer: (selectedIndex: number) => void;
  disabled?: boolean;
}

export function UrlTrainerExercise({ data, onAnswer, disabled }: Props) {
  const [picked, setPicked] = useState<number | null>(null);

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

      {data.instruction && <p className={styles.instruction}>{data.instruction}</p>}

      <ul className={styles.urls}>
        {data.options.map((option, i) => {
          let state: "default" | "correct" | "wrong" = "default";
          if (picked !== null) {
            if (i === data.correct) state = "correct";
            else if (i === picked && picked !== data.correct) state = "wrong";
          }

          return (
            <li key={option.url}>
              <button
                type="button"
                className={`${styles.urlOption} ${styles[state]}`}
                onClick={() => handlePick(i)}
                disabled={disabled || picked !== null}
              >
                <span className={styles.url}>{option.url}</span>
                {picked !== null && option.note && (i === picked || i === data.correct) && (
                  <span className={styles.note}>{option.note}</span>
                )}
                {state === "correct" && <span className={styles.mark}>✓</span>}
                {state === "wrong" && <span className={styles.mark}>✗</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
