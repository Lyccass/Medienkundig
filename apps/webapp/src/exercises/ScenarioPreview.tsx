import { AlertTriangle, Globe } from "lucide-react";
import type { FallScenario } from "../data/courses";
import { SCENARIO_ICONS, SCENARIO_LABELS } from "../constants/ui";
import styles from "./ScenarioPreview.module.css";

interface Props {
  scenario: FallScenario;
  note?: string;
}

export function ScenarioPreview({ scenario, note = "Analysiere den Inhalt sorgfältig" }: Props) {
  return (
    <>
      <div className={styles.label}>
        {SCENARIO_ICONS[scenario.type]}
        <span>{SCENARIO_LABELS[scenario.type]}</span>
      </div>

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
                <Globe size={11} strokeWidth={2} />
                {scenario.url}
              </span>
            )}
          </>
        )}

        <div className={styles.warningNote}>
          <AlertTriangle size={12} strokeWidth={2} />
          {note}
        </div>
      </div>
    </>
  );
}
