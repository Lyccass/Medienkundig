import { useState } from "react";
import type { NextStepData } from "../data/courses";
import { HighlightTerms } from "../utils/highlightTerms";
import { ScenarioPreview } from "./ScenarioPreview";
import styles from "./NextStepExercise.module.css";

interface Props {
  data: NextStepData;
  onAnswer: (selectedIndex: number) => void;
  disabled?: boolean;
}

export function NextStepExercise({ data, onAnswer, disabled }: Props) {
  const [picked, setPicked] = useState<number | null>(null);

  function handlePick(i: number) {
    if (disabled || picked !== null) return;
    setPicked(i);
    onAnswer(i);
  }

  return (
    <div className={styles.root}>
      <ScenarioPreview scenario={data.scenario} note="Entscheide den nächsten sicheren Schritt" />

      <p className={styles.question}>
        <HighlightTerms text={data.question} ids={data.glossarLinks} />
      </p>

      <ul className={styles.options}>
        {data.options.map((option, i) => {
          let state: "default" | "correct" | "wrong" = "default";
          if (picked !== null) {
            if (i === data.correct) state = "correct";
            else if (i === picked && picked !== data.correct) state = "wrong";
          }

          return (
            <li key={option}>
              <button
                type="button"
                className={`${styles.option} ${styles[state]}`}
                onClick={() => handlePick(i)}
                disabled={disabled || picked !== null}
              >
                <span className={styles.letter}>{String.fromCharCode(65 + i)}</span>
                <span className={styles.text}>{option}</span>
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
