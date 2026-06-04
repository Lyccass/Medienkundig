import { useState } from "react";
import type { BildAuswahlData } from "../data/courses";
import { GlossarTerm } from "../glossar/GlossarTerm";
import styles from "./BildAuswahl.module.css";

interface Props {
  data: BildAuswahlData;
  onAnswer: (selectedIndex: number) => void;
  disabled?: boolean;
}

const OPTION_ICONS = ["🔴", "🟡", "🟢", "🔵"];

export function BildAuswahl({ data, onAnswer, disabled }: Props) {
  const [picked, setPicked] = useState<number | null>(null);

  function handlePick(i: number) {
    if (disabled || picked !== null) return;
    setPicked(i);
    onAnswer(i);
  }

  return (
    <div className={styles.root}>
      <p className={styles.question}>{data.question}</p>

      <div className={styles.imageFrame} aria-label={data.imageDescription}>
        <svg viewBox="0 0 320 160" className={styles.imagePlaceholder} aria-hidden>
          <rect width="320" height="160" rx="12" fill="#f0eeff" />
          <rect x="20" y="20" width="130" height="55" rx="8" fill="#ddd8f8" />
          <rect x="170" y="20" width="130" height="55" rx="8" fill="#ddd8f8" />
          <rect x="20" y="85" width="130" height="55" rx="8" fill="#ddd8f8" />
          <rect x="170" y="85" width="130" height="55" rx="8" fill="#ddd8f8" />
          <text x="160" y="148" textAnchor="middle" fill="#a89ee0" fontSize="11" fontFamily="Ubuntu Sans Variable, Ubuntu Sans">
            {data.imageDescription}
          </text>
        </svg>
      </div>

      <ul className={styles.options}>
        {data.options.map((opt, i) => {
          let state: "default" | "correct" | "wrong" = "default";
          if (picked !== null) {
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
              >
                <span className={styles.icon}>{OPTION_ICONS[i]}</span>
                <span className={styles.text}>{opt.label}</span>
                {picked !== null && opt.hint && i === picked && (
                  <span className={styles.hint}>{opt.hint}</span>
                )}
                {picked !== null && opt.hint && i === data.correct && i !== picked && (
                  <span className={styles.hint}>{opt.hint}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {data.glossarLinks && data.glossarLinks.length > 0 && (
        <div className={styles.glossar}>
          <span className={styles.glossarLabel}>Begriffe:</span>
          {data.glossarLinks.map((id) => (
            <GlossarTerm key={id} id={id}>
              {id}
            </GlossarTerm>
          ))}
        </div>
      )}
    </div>
  );
}
