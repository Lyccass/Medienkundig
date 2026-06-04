import { useState } from "react";
import { Play, Pause } from "lucide-react";
import type { AudioAuswahlData } from "../data/courses";
import { HighlightTerms } from "../utils/highlightTerms";
import styles from "./AudioAuswahl.module.css";

interface Props {
  data: AudioAuswahlData;
  onAnswer: (selectedIndex: number) => void;
  disabled?: boolean;
}

export function AudioAuswahl({ data, onAnswer, disabled }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [played, setPlayed] = useState(false);

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

      <div className={styles.player}>
        <button
          type="button"
          className={`${styles.playBtn} ${played ? styles.played : ""}`}
          onClick={() => setPlayed(true)}
          aria-label="Audiobeitrag abspielen"
        >
          {played ? <Pause size={20} strokeWidth={2} /> : <Play size={20} strokeWidth={2} />}
        </button>
        <div className={styles.playerInfo}>
          <span className={styles.playerLabel}>{data.audioLabel}</span>
          <div className={`${styles.waveform} ${played ? styles.waveformPlayed : ""}`} aria-hidden>
            {Array.from({ length: 28 }).map((_, i) => (
              <span
                key={i}
                className={`${styles.bar} ${styles[`bar${i % 7}`]}`}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          className={styles.transcriptToggle}
          onClick={() => setShowTranscript((v) => !v)}
        >
          {showTranscript ? "Transkript ausblenden" : "Transkript lesen"}
        </button>
      </div>

      {showTranscript && (
        <blockquote className={styles.transcript}>{data.transcript}</blockquote>
      )}

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
                <span className={styles.letter}>{String.fromCharCode(65 + i)}</span>
                <span className={styles.text}>{opt}</span>
                {state === "correct" && <span className={styles.check}>✓</span>}
                {state === "wrong" && <span className={styles.check}>✗</span>}
              </button>
            </li>
          );
        })}
      </ul>

    </div>
  );
}
