import { useState } from "react";
import { Mail, MessageSquare, Globe, Share2, AlertTriangle } from "lucide-react";
import type { FallData } from "../data/courses";
import { HighlightTerms } from "../utils/highlightTerms";
import styles from "./FallExercise.module.css";

interface Props {
  data: FallData;
  onAnswer: (selectedIndex: number) => void;
  disabled?: boolean;
}

const SCENARIO_ICONS = {
  email:  <Mail          size={13} strokeWidth={2} />,
  sms:    <MessageSquare size={13} strokeWidth={2} />,
  chat:   <MessageSquare size={13} strokeWidth={2} />,
  web:    <Globe         size={13} strokeWidth={2} />,
  social: <Share2        size={13} strokeWidth={2} />,
};

const SCENARIO_LABELS = {
  email: "E-Mail", sms: "SMS", chat: "Chat", web: "Website", social: "Social Media",
};

export function FallExercise({ data, onAnswer, disabled }: Props) {
  const [picked, setPicked] = useState<number | null>(null);

  function handlePick(i: number) {
    if (disabled || picked !== null) return;
    setPicked(i);
    onAnswer(i);
  }

  const { scenario } = data;

  return (
    <div className={styles.root}>
      {/* Scenario label */}
      <div className={styles.label}>
        {SCENARIO_ICONS[scenario.type]}
        <span>{SCENARIO_LABELS[scenario.type]}</span>
      </div>

      {/* Scenario content — no card wrapper */}
      <div className={styles.scenario}>
        {scenario.type === "email" && (
          <>
            <div className={styles.emailMeta}>
              <span className={styles.metaKey}>Von</span>
              <span className={styles.emailFrom}>{scenario.from}</span>
            </div>
            {scenario.subject && (
              <div className={styles.emailMeta}>
                <span className={styles.metaKey}>Betreff</span>
                <span className={styles.metaVal}>{scenario.subject}</span>
              </div>
            )}
            <p className={styles.body}>{scenario.content}</p>
          </>
        )}

        {(scenario.type === "sms" || scenario.type === "chat") && (
          <>
            <p className={styles.sender}>{scenario.sender ?? "Unbekannte Nummer"}</p>
            <div className={styles.bubble}>{scenario.content}</div>
          </>
        )}

        {scenario.type === "web" && (
          <>
            <div className={styles.urlBar}>
              <Globe size={11} strokeWidth={2} className={styles.urlIcon} />
              <span className={styles.urlText}>{scenario.url}</span>
            </div>
            <p className={styles.body}>{scenario.content}</p>
          </>
        )}

        {scenario.type === "social" && (
          <>
            {scenario.sender && <p className={styles.sender}>{scenario.sender}</p>}
            <p className={styles.body}>{scenario.content}</p>
            {scenario.url && (
              <span className={styles.socialUrl}>
                <Globe size={11} /> {scenario.url}
              </span>
            )}
          </>
        )}

        <div className={styles.warningNote}>
          <AlertTriangle size={12} strokeWidth={2} />
          Analysiere den Inhalt sorgfältig
        </div>
      </div>

      {/* Question */}
      <p className={styles.question}>
        <HighlightTerms text={data.question} ids={data.glossarLinks} />
      </p>

      {/* Options */}
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
                {state === "correct" && <span className={styles.mark}>✓</span>}
                {state === "wrong"   && <span className={styles.mark}>✗</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
