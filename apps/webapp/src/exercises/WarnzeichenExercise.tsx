import { useState } from "react";
import type { WarnzeichenData } from "../data/courses";
import { SCENARIO_ICONS, SCENARIO_LABELS } from "../constants/ui";
import { HighlightTerms } from "../utils/highlightTerms";
import styles from "./WarnzeichenExercise.module.css";

interface Props {
  data: WarnzeichenData;
  onAnswer: (selectedIndex: number) => void;
  disabled?: boolean;
}

function includesValue(values: string[], value: string) {
  return values.includes(value);
}

export function WarnzeichenExercise({ data, onAnswer, disabled }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function toggleZone(id: string) {
    if (disabled || submitted) return;
    setSelected((current) =>
      includesValue(current, id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function submit() {
    if (disabled || submitted || selected.length === 0) return;
    const correct = data.zones.every((zone) => includesValue(selected, zone.id) === zone.suspicious);
    setSubmitted(true);
    onAnswer(correct ? 1 : 0);
  }

  function getState(zoneId: string, suspicious: boolean) {
    const isSelected = includesValue(selected, zoneId);
    if (!submitted) return isSelected ? "selected" : "default";
    if (isSelected && suspicious) return "correct";
    if (isSelected && !suspicious) return "wrong";
    if (!isSelected && suspicious) return "missed";
    return "neutral";
  }

  return (
    <div className={styles.root}>
      <p className={styles.question}>
        <HighlightTerms text={data.question} ids={data.glossarLinks} />
      </p>

      <div className={styles.label}>
        {SCENARIO_ICONS[data.scenarioType]}
        <span>{SCENARIO_LABELS[data.scenarioType]}</span>
      </div>

      <div className={styles.document}>
        {data.zones.map((zone) => {
          const state = getState(zone.id, zone.suspicious);
          return (
            <button
              key={zone.id}
              type="button"
              className={`${styles.zone} ${styles[state]}`}
              onClick={() => toggleZone(zone.id)}
              disabled={disabled || submitted}
              aria-pressed={includesValue(selected, zone.id)}
            >
              <span className={styles.zoneLabel}>{zone.label}</span>
              <span className={styles.zoneText}>{zone.text}</span>
              {submitted && zone.explanation && state !== "neutral" && (
                <span className={styles.zoneHint}>{zone.explanation}</span>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.submit}
        onClick={submit}
        disabled={disabled || submitted || selected.length === 0}
      >
        Warnzeichen prüfen
      </button>
    </div>
  );
}
