import React from "react";
import { ShieldAlert, Newspaper, Smartphone, Lock, ChevronRight } from "lucide-react";
import { categories } from "../data/courses";
import type { Progress } from "../store/useProgress";
import styles from "./LearnPage.module.css";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  scamming:    <ShieldAlert size={20} strokeWidth={2} />,
  news:        <Newspaper   size={20} strokeWidth={2} />,
  socialmedia: <Smartphone  size={20} strokeWidth={2} />,
  general:     <Lock        size={20} strokeWidth={2} />,
};

interface Props {
  progress: Progress;
  onNavigateToCategory: (categoryId: string) => void;
}

export function LearnPage({ progress, onNavigateToCategory }: Props) {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Lernpfade</h1>
      <p className={styles.pageSubtitle}>Wähle ein Thema und starte deine Lerneinheit.</p>

      <div className={styles.list}>
        {categories.map((cat) => {
          const allIds = cat.units.flatMap((u) => u.exercises.map((e) => e.id));
          const done = allIds.filter((id) => progress.completedExercises.includes(id)).length;
          const total = allIds.length;
          const pct = total === 0 ? 0 : done / total;
          const finished = done === total;

          return (
            <button
              key={cat.id}
              type="button"
              className={styles.row}
              onClick={() => onNavigateToCategory(cat.id)}
            >
              <span className={styles.rowBar} style={{ background: cat.color }} />

              <span className={styles.rowIcon} style={{ color: cat.color }}>
                {CATEGORY_ICONS[cat.id]}
              </span>

              <span className={styles.rowBody}>
                <span className={styles.rowHead}>
                  <span className={styles.rowTitle}>{cat.title}</span>
                  <span className={styles.rowCount} style={{ color: finished ? "#16a34a" : cat.color }}>
                    {finished ? "✓" : `${done}/${total}`}
                  </span>
                </span>
                <span className={styles.rowSub}>{cat.subtitle}</span>
                <span className={styles.rowProgress}>
                  <span
                    className={styles.rowProgressFill}
                    style={{ width: `${pct * 100}%`, background: finished ? "#16a34a" : cat.color }}
                  />
                </span>
              </span>

              <ChevronRight size={16} strokeWidth={2} className={styles.rowArrow} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
