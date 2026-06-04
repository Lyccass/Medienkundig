import { useMemo, useState } from "react";
import { categories } from "../data/courses";
import type { Exercise, Category } from "../data/courses";
import { useProgressContext } from "../store/ProgressContext";
import { shuffle } from "../utils/shuffle";
import { TYPE_LABELS } from "../constants/ui";
import styles from "./RepeatPage.module.css";

interface ExerciseWithMeta {
  exercise: Exercise;
  category: Category;
}

interface Props {
  onStartRepeat: (exercises: Exercise[], categoryId: string) => void;
}

export function RepeatPage({ onStartRepeat }: Props) {
  const { progress } = useProgressContext();
  const [filter, setFilter] = useState<string>("all");

  const allCompleted = useMemo<ExerciseWithMeta[]>(() => {
    const items: ExerciseWithMeta[] = [];
    for (const cat of categories) {
      for (const unit of cat.units) {
        for (const ex of unit.exercises) {
          if (progress.completedExercises.includes(ex.id)) {
            items.push({ exercise: ex, category: cat });
          }
        }
      }
    }
    return shuffle(items);
  }, [progress.completedExercises]);

  const filtered = filter === "all"
    ? allCompleted
    : allCompleted.filter((item) => item.category.id === filter);

  if (allCompleted.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.head}>
          <div className={styles.headInner}>
            <div>
              <h1 className={styles.title}>Wiederholen</h1>
              <p className={styles.sub}>Abgeschlossene Übungen gezielt festigen.</p>
            </div>
          </div>
        </div>
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Noch keine Übungen abgeschlossen</p>
          <p className={styles.emptyText}>
            Schließe zuerst Lerneinheiten ab – dann erscheinen sie hier zum Wiederholen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.head}>
        <div className={styles.headInner}>
          <div>
            <h1 className={styles.title}>Wiederholen</h1>
            <p className={styles.sub}>{allCompleted.length} abgeschlossene Übungen – in zufälliger Reihenfolge.</p>
          </div>
        </div>
      </div>

      {/* Two-pane body */}
      <div className={styles.body}>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <p className={styles.sidebarLabel}>Kategorie</p>
          <nav className={styles.catNav}>
            <button
              type="button"
              className={`${styles.cat} ${filter === "all" ? styles.catActive : ""}`}
              onClick={() => setFilter("all")}
            >
              <span className={styles.catDot} />
              Alle
              <span className={styles.catCount}>{allCompleted.length}</span>
            </button>
            {categories.map((cat) => {
              const count = allCompleted.filter((i) => i.category.id === cat.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`${styles.cat} ${filter === cat.id ? styles.catActive : ""}`}
                  onClick={() => setFilter(cat.id)}
                >
                  <span className={styles.catDot} />
                  {cat.title}
                  <span className={styles.catCount}>{count}</span>
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            className={styles.startBtn}
            onClick={() => onStartRepeat(filtered.map((i) => i.exercise), "repeat")}
            disabled={filtered.length === 0}
          >
            {filtered.length} Übungen starten
          </button>
        </aside>

        {/* Exercise list */}
        <main className={styles.main}>
          <ul className={styles.list} role="list">
            {filtered.map(({ exercise, category }) => (
              <li key={exercise.id} className={styles.row}>
                <button
                  type="button"
                  className={styles.rowBtn}
                  onClick={() => onStartRepeat([exercise], category.id)}
                >
                  <div className={styles.rowLeft}>
                    <span className={styles.rowCat}>{category.title}</span>
                    <p className={styles.rowQuestion}>
                      {(exercise.data as { question: string }).question}
                    </p>
                  </div>
                  <div className={styles.rowRight}>
                    <span className={styles.rowType}>{TYPE_LABELS[exercise.data.type]}</span>
                    <svg className={styles.rowArrow} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </main>

      </div>
    </div>
  );
}
