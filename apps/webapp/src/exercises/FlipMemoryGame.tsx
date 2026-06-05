import { useState, useEffect } from "react";
import type { MemoryData } from "../data/courses";
import { DefinitionCard } from "./DefinitionCard";
import { shuffle } from "../utils/shuffle";
import styles from "./FlipMemoryGame.module.css";

interface CardItem {
  id: number;
  pairId: number;
  type: "term" | "definition";
  label: string;
}

type CardState = "hidden" | "flipped" | "matched" | "wrong";

interface Props {
  data: MemoryData;
  onComplete: () => void;
}

export function FlipMemoryGame({ data, onComplete }: Props) {
  const [cards] = useState<CardItem[]>(() =>
    shuffle(
      data.pairs.flatMap((pair, pairId) => [
        { id: pairId * 2, pairId, type: "term" as const, label: pair.term },
        { id: pairId * 2 + 1, pairId, type: "definition" as const, label: pair.definition },
      ])
    )
  );

  const [states, setStates] = useState<CardState[]>(() =>
    Array(data.pairs.length * 2).fill("hidden" as CardState)
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [blocked, setBlocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [matchedPairIds, setMatchedPairIds] = useState<number[]>([]);
  const [revealedDefs, setRevealedDefs] = useState<Array<{ term: string; info: string }>>([]);
  const [newestTerm, setNewestTerm] = useState<string | null>(null);

  useEffect(() => {
    if (matchedPairIds.length === data.pairs.length && data.pairs.length > 0) {
      setTimeout(onComplete, 600);
    }
  }, [matchedPairIds, data.pairs.length, onComplete]);

  function handleClick(i: number) {
    if (blocked || states[i] !== "hidden") return;

    const next = [...states];
    next[i] = "flipped";
    setStates(next);

    const nextSelected = [...selected, i];

    if (nextSelected.length < 2) {
      setSelected(nextSelected);
      return;
    }

    // Two cards selected — evaluate
    setSelected([]);
    setBlocked(true);
    setAttempts((a) => a + 1);

    const [a, b] = nextSelected;
    if (cards[a].pairId === cards[b].pairId) {
      // Match
      const matched = [...next];
      matched[a] = "matched";
      matched[b] = "matched";
      setStates(matched);
      setMatchedPairIds((ids) => [...ids, cards[a].pairId]);

      const pair = data.pairs[cards[a].pairId];
      if (pair.info) {
        const term = pair.term;
        setRevealedDefs((r) => [...r, { term, info: pair.info! }]);
        setNewestTerm(term);
        setTimeout(() => setNewestTerm(null), 900);
      }
      setBlocked(false);
    } else {
      // Mismatch — flash red, then flip back
      const wrong = [...next];
      wrong[a] = "wrong";
      wrong[b] = "wrong";
      setStates(wrong);

      setTimeout(() => {
        setStates((s) => {
          const reset = [...s];
          reset[a] = "hidden";
          reset[b] = "hidden";
          return reset;
        });
        setBlocked(false);
      }, 850);
    }
  }

  const matchedCount = matchedPairIds.length;
  const totalPairs = data.pairs.length;

  return (
    <div className={styles.root}>
      <div className={styles.scoreBar}>
        <span>
          Paare gefunden: <strong>{matchedCount}/{totalPairs}</strong>
        </span>
        <span>
          Versuche: <strong>{attempts}</strong>
        </span>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotTerm}`} />
          Begriff
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotDef}`} />
          Beispiel
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotMatched}`} />
          Gefunden
        </span>
      </div>

      <div className={styles.grid}>
        {cards.map((card, i) => {
          const state = states[i];
          const isRevealed = state !== "hidden";
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleClick(i)}
              disabled={state === "matched"}
              className={[
                styles.card,
                styles[state],
                isRevealed ? styles[card.type] : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label={state === "hidden" ? "Verdeckte Karte" : card.label}
            >
              <span className={styles.inner}>
                <span className={styles.back}>?</span>
                <span className={styles.front}>{card.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {revealedDefs.length > 0 && (
        <div className={styles.defs}>
          <p className={styles.defsLabel}>Gefundene Begriffe</p>
          <div className={styles.defsList}>
            {revealedDefs.map(({ term, info }) => (
              <DefinitionCard
                key={term}
                term={term}
                info={info}
                isNew={newestTerm === term}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
