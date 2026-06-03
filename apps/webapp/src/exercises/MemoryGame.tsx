import { useState, useEffect } from "react";
import type { MemoryData } from "../data/courses";
import { HighlightTerms } from "../utils/highlightTerms";
import styles from "./MemoryGame.module.css";

interface Props {
  data: MemoryData;
  onComplete: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MemoryGame({ data, onComplete }: Props) {
  const [terms] = useState(() => shuffle(data.pairs.map((p) => p.term)));
  const [defs] = useState(() => shuffle(data.pairs.map((p) => p.definition)));
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedDef, setSelectedDef] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [shake, setShake] = useState<string[]>([]);

  function isTermMatched(term: string) {
    return matched.includes(term);
  }
  function isDefMatched(def: string) {
    const pair = data.pairs.find((p) => p.definition === def);
    return pair ? matched.includes(pair.term) : false;
  }

  useEffect(() => {
    if (selectedTerm && selectedDef) {
      const pair = data.pairs.find((p) => p.term === selectedTerm);
      if (pair && pair.definition === selectedDef) {
        setMatched((m) => [...m, selectedTerm]);
        setSelectedTerm(null);
        setSelectedDef(null);
      } else {
        setShake([selectedTerm, selectedDef]);
        setTimeout(() => {
          setSelectedTerm(null);
          setSelectedDef(null);
          setShake([]);
        }, 600);
      }
    }
  }, [selectedTerm, selectedDef, data.pairs]);

  useEffect(() => {
    if (matched.length === data.pairs.length && data.pairs.length > 0) {
      setTimeout(onComplete, 500);
    }
  }, [matched, data.pairs.length, onComplete]);

  function pickTerm(term: string) {
    if (isTermMatched(term) || shake.length > 0) return;
    setSelectedTerm((prev) => (prev === term ? null : term));
  }

  function pickDef(def: string) {
    if (isDefMatched(def) || shake.length > 0 || !selectedTerm) return;
    setSelectedDef(def);
  }

  return (
    <div className={styles.root}>
      <p className={styles.question}>
        <HighlightTerms text={data.question} ids={data.glossarLinks} />
      </p>
      <p className={styles.hint}>Wähle einen Begriff links, dann die passende Erklärung rechts.</p>

      <div className={styles.grid}>
        <div className={styles.column}>
          <span className={styles.colLabel}>Begriff</span>
          {terms.map((term) => {
            const isMatch = isTermMatched(term);
            const isSel = selectedTerm === term;
            const isShk = shake.includes(term);
            return (
              <button
                key={term}
                type="button"
                className={`${styles.card} ${isMatch ? styles.matched : ""} ${isSel ? styles.selected : ""} ${isShk ? styles.shake : ""}`}
                onClick={() => pickTerm(term)}
                disabled={isMatch}
              >
                {term}
              </button>
            );
          })}
        </div>

        <div className={styles.column}>
          <span className={styles.colLabel}>Bedeutung</span>
          {defs.map((def) => {
            const isMatch = isDefMatched(def);
            const isSel = selectedDef === def;
            const isShk = shake.includes(def);
            return (
              <button
                key={def}
                type="button"
                className={`${styles.card} ${isMatch ? styles.matched : ""} ${isSel ? styles.selected : ""} ${isShk ? styles.shake : ""}`}
                onClick={() => pickDef(def)}
                disabled={isMatch || !selectedTerm}
              >
                {def}
              </button>
            );
          })}
        </div>
      </div>

      <p className={styles.progress}>
        {matched.length} von {data.pairs.length} Paaren gefunden
      </p>

    </div>
  );
}
