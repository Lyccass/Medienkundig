import React, { useState } from "react";
import { CheckCircle2, Play } from "lucide-react"; // CheckCircle2 used in LearnSection (right panel)
import { categories, type Category } from "../data/courses";
import type { Progress } from "../store/useProgress";
import {
  VISIBLE_IDS, STEPS, DISPLAY_TITLES, DESCRIPTIONS,
  LEARNING_GOALS, PREVIEW_DESC, ALLTAG,
} from "../data/learnPaths";
import type { AlltegEntry, VisibleId } from "../data/learnPaths";
import styles from "./LearnPage.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Preview panel sub-components (uniform sizing, reusable)
// ─────────────────────────────────────────────────────────────────────────────

function TintyFrame() {
  return (
    <div className={styles.tintyWrap}>
      <img src="/tinty.png" alt="Tinty" className={styles.tintyImg} />
    </div>
  );
}

function LearnSection({ goals }: { goals: string[] }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Was du lernst</h3>
      <ul className={styles.learnList}>
        {goals.map((g) => (
          <li key={g} className={styles.learnItem}>
            <CheckCircle2 className={styles.checkIcon} size={15} strokeWidth={2.5} />
            {g}
          </li>
        ))}
      </ul>
    </div>
  );
}


function AlltegSection({ heading, desc, items }: AlltegEntry) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{heading}</h3>
      <p className={styles.sectionDesc}>{desc}</p>
      <div className={styles.alltag}>
        {items.map((item) => (
          <div key={item.label} className={styles.allt}>
            <span
              className={styles.alltLabel}
              data-variant={item.variant}
            >
              {item.label}
            </span>
            <span className={styles.alltText}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CTABlock({ onStart }: { onStart: () => void }) {
  return (
    <div className={styles.ctaWrap}>
      <button
        type="button"
        className={styles.ctaBtn}
        onClick={onStart}
      >
        <Play size={18} strokeWidth={2.5} fill="white" />
        Lerneinheit starten
      </button>
      <p className={styles.ctaDuration}>Dauer: ca. 15 Minuten</p>
    </div>
  );
}

function isVisibleId(id: string): id is VisibleId {
  return VISIBLE_IDS.includes(id as VisibleId);
}

type VisibleCategory = Category & { id: VisibleId };

interface Props {
  progress: Progress;
  onNavigateToCategory: (categoryId: string) => void;
}

export function LearnPage({ progress, onNavigateToCategory }: Props) {
  const visible = categories.filter((c): c is VisibleCategory => isVisibleId(c.id));
  const [selectedId, setSelectedId] = useState<VisibleId>(visible[0]?.id ?? "grundlagen");
  const selected = visible.find((c) => c.id === selectedId) ?? visible[0];

  const getProgress = (cat: typeof categories[0]) => {
    const allIds = cat.units.flatMap((u) => u.exercises.map((e) => e.id));
    const done   = allIds.filter((id) => progress.completedExercises.includes(id)).length;
    return { done, total: allIds.length };
  };

  return (
    <div className={styles.page}>

      {/* ── LEFT: path list ──────────────────────────────────────── */}
      <div className={styles.left}>
        <div className={styles.leftHeader}>
          <h1 className={styles.title}>Lernpfade</h1>
          <p className={styles.subtitle}>Wähle ein Thema und starte deine Lerneinheit.</p>
        </div>

        <div className={styles.pathWrap}>
          {visible.map((cat) => {
            const { done, total } = getProgress(cat);
            const isSelected = cat.id === selectedId;
            const finished   = done === total && total > 0;

            return (
              <button
                key={cat.id}
                type="button"
                className={`${styles.row} ${isSelected ? styles.rowSelected : ""}`}
                onClick={() => setSelectedId(cat.id)}
              >
                <span
                  className={styles.circle}
                >
                  {STEPS[cat.id]}
                </span>

                <span className={styles.rowBody}>
                  <span className={styles.rowHead}>
                    <span className={styles.rowTitle}>{DISPLAY_TITLES[cat.id]}</span>
                    <span className={styles.rowCount}>
                      {finished ? "Fertig" : `${done}/${total}`}
                    </span>
                  </span>

                  <span className={styles.rowDesc}>{DESCRIPTIONS[cat.id]}</span>

                  <span
                    className={`${styles.startBtn} ${isSelected ? styles.startBtnActive : ""}`}
                    role="button"
                    tabIndex={-1}
                    onClick={(e) => { e.stopPropagation(); onNavigateToCategory(cat.id); }}
                  >
                    Mit Beispiel starten
                  </span>
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* ── RIGHT: white wave panel ───────────────────────────────── */}
      {selected && (
        <aside className={styles.right}>
          <div className={styles.previewInner}>
            <span className={styles.previewLabel}>VORSCHAU</span>

            <h2 className={styles.previewTitle}>
              {DISPLAY_TITLES[selected.id] ?? selected.title}
            </h2>

            <p className={styles.previewDesc}>{PREVIEW_DESC[selected.id]}</p>

            <TintyFrame />

            <LearnSection goals={LEARNING_GOALS[selected.id] ?? []} />

            <AlltegSection {...ALLTAG[selected.id]} />

            <CTABlock
              onStart={() => onNavigateToCategory(selected.id)}
            />
          </div>
        </aside>
      )}
    </div>
  );
}
