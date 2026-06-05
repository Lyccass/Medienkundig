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

      {data.image ? (
        <div className={styles.imagePreview}>
          <img className={styles.emailImage} src={data.image.src} alt={data.image.alt} />
          <div className={styles.markerLayer} aria-label="Markierte Stellen im Screenshot">
            {data.zones.map((zone, i) => {
              const state = getState(zone.id, zone.suspicious);
              const active = includesValue(selected, zone.id);
              return (
                <button
                  key={zone.id}
                  type="button"
                  className={`${styles.imageMarker} ${styles[`imageMarkerPos${i}`]} ${styles[state]}`}
                  onClick={() => toggleZone(zone.id)}
                  disabled={disabled || submitted}
                  aria-pressed={active}
                  aria-label={`${i + 1}: ${zone.label}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={styles.preview}>
          <div className={styles.previewHeader}>
            <span className={styles.fakeLogo}>S</span>
            <div>
              <p className={styles.fakeBrand}>Sparkasse Sicherheit</p>
              <p className={styles.fakeMeta}>Konto-Überprüfung</p>
            </div>
          </div>

          <div className={styles.document}>
            {data.zones.map((zone, i) => {
              const state = getState(zone.id, zone.suspicious);
              const active = includesValue(selected, zone.id);
              return (
                <button
                  key={zone.id}
                  type="button"
                  className={`${styles.zone} ${styles[state]}`}
                  onClick={() => toggleZone(zone.id)}
                  disabled={disabled || submitted}
                  aria-pressed={active}
                >
                  <span className={styles.marker}>{i + 1}</span>
                  <span className={styles.zoneLabel}>{zone.label}</span>
                  <span className={styles.zoneText}>{zone.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.answerBlock}>
        <p className={styles.answerTitle}>Welche Nummern sind Warnzeichen?</p>
        <ul className={styles.choices}>
          {data.zones.map((zone, i) => {
            const state = getState(zone.id, zone.suspicious);
            const active = includesValue(selected, zone.id);
            return (
              <li key={zone.id}>
                <button
                  type="button"
                  className={`${styles.choice} ${styles[state]}`}
                  onClick={() => toggleZone(zone.id)}
                  disabled={disabled || submitted}
                  aria-pressed={active}
                >
                  <span className={styles.checkbox} aria-hidden>
                    {active ? "✓" : ""}
                  </span>
                  <span className={styles.choiceNumber}>{i + 1}</span>
                  <span className={styles.choiceText}>{zone.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
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
