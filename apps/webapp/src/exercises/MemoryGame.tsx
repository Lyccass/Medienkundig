import { useState, useEffect } from "react";
import type { MemoryData } from "../data/courses";
import { HighlightTerms } from "../utils/highlightTerms";
import { DefinitionCard } from "./DefinitionCard";
import { shuffle } from "../utils/shuffle";
import styles from "./MemoryGame.module.css";

interface Props {
  data: MemoryData;
  onComplete: () => void;
}

export function MemoryGame({ data, onComplete }: Props) {
  const [terms] = useState(() => shuffle(data.pairs.map((p) => p.term)));
  const [defs] = useState(() => shuffle(data.pairs.map((p) => p.definition)));
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedDef, setSelectedDef] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [shake, setShake] = useState<string[]>([]);
  const [revealed, setRevealed] = useState<Array<{ term: string; info: string }>>([]);
  const [newestTerm, setNewestTerm] = useState<string | null>(null);

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
        if (pair.info) {
          setRevealed((r) => [...r, { term: pair.term, info: pair.info! }]);
          setNewestTerm(pair.term);
          setTimeout(() => setNewestTerm(null), 800);
        }
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

  const hasInfo = data.pairs.some((p) => p.info);

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

      {hasInfo && revealed.length > 0 && (
        <div className={styles.revealed}>
          <p className={styles.revealedLabel}>Gefundene Begriffe</p>
          <div className={styles.revealedList}>
            {revealed.map(({ term, info }) => (
              <DefinitionCard key={term} term={term} info={info} isNew={newestTerm === term} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
