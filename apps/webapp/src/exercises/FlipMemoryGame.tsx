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
  const [gamePhase, setGamePhase] = useState<"playing" | "complete">("playing");

  const totalPairs = data.pairs.length;

  useEffect(() => {
    if (matchedPairIds.length === totalPairs && totalPairs > 0) {
      // Slight delay to let the last match animation settle, then show summary
      setTimeout(() => {
        setGamePhase("complete");
        onComplete();
      }, 500);
    }
  }, [matchedPairIds, totalPairs, onComplete]);

  function handleClick(i: number) {
    if (blocked || states[i] !== "hidden" || gamePhase !== "playing") return;

    const next = [...states];
    next[i] = "flipped";
    setStates(next);

    const nextSelected = [...selected, i];

    if (nextSelected.length < 2) {
      setSelected(nextSelected);
      return;
    }

    setSelected([]);
    setBlocked(true);
    setAttempts((a) => a + 1);

    const [a, b] = nextSelected;
    if (cards[a].pairId === cards[b].pairId) {
      const matched = [...next];
      matched[a] = "matched";
      matched[b] = "matched";
      setStates(matched);
      setMatchedPairIds((ids) => [...ids, cards[a].pairId]);
      setBlocked(false);
    } else {
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

  // ── Complete phase: show all term definitions ──
  if (gamePhase === "complete") {
    const defsWithInfo = data.pairs.filter((p) => p.info);
    return (
      <div className={styles.complete}>
        <p className={styles.completeHeader}>
          Alle {totalPairs} Paare gefunden
          {attempts > 0 && <span className={styles.completeSub}> · {attempts} Versuche</span>}
        </p>
        {defsWithInfo.length > 0 && (
          <div className={styles.defsList}>
            {defsWithInfo.map((pair) => (
              <DefinitionCard key={pair.term} term={pair.term} info={pair.info!} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Playing phase ──
  const matchedCount = matchedPairIds.length;

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
    </div>
  );
}
