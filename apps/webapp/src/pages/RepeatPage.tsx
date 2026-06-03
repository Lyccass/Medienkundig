import { useMemo, useState } from "react";
import { categories } from "../data/courses";
import type { Exercise, Category } from "../data/courses";
import type { Progress } from "../store/useProgress";
import styles from "./RepeatPage.module.css";

const CATEGORY_ICONS: Record<string, string> = {
  scamming: "🛡️",
  news: "📰",
  socialmedia: "📱",
  general: "🔒",
};

const TYPE_LABELS: Record<string, string> = {
  multipleChoice: "Multiple Choice",
  bildAuswahl: "Bild-Auswahl",
  audioAuswahl: "Audio",
  memory: "Memory",
  vervollstaendigen: "Lückentext",
};

interface ExerciseWithMeta {
  exercise: Exercise;
  category: Category;
}

interface Props {
  progress: Progress;
  onStartRepeat: (exercises: Exercise[], categoryId: string) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function RepeatPage({ progress, onStartRepeat }: Props) {
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

  function handleStartAll() {
    const exs = filtered.map((item) => item.exercise);
    onStartRepeat(exs, "repeat");
  }

  if (allCompleted.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Wiederholen</h1>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📚</span>
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
      <h1 className={styles.pageTitle}>Wiederholen</h1>
      <p className={styles.pageSubtitle}>
        {allCompleted.length} abgeschlossene Übungen – in zufälliger Reihenfolge.
      </p>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <button
            type="button"
            className={`${styles.filterChip} ${filter === "all" ? styles.filterActive : ""}`}
            onClick={() => setFilter("all")}
          >
            Alle ({allCompleted.length})
          </button>
          {categories.map((cat) => {
            const count = allCompleted.filter((i) => i.category.id === cat.id).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.id}
                type="button"
                className={`${styles.filterChip} ${filter === cat.id ? styles.filterActive : ""}`}
                style={filter === cat.id ? { background: cat.colorSoft, color: cat.color, borderColor: cat.color } : {}}
                onClick={() => setFilter(cat.id)}
              >
                {CATEGORY_ICONS[cat.id]} {cat.title} ({count})
              </button>
            );
          })}
        </div>

        <button type="button" className={styles.startAllBtn} onClick={handleStartAll} disabled={filtered.length === 0}>
          {filtered.length} Übungen starten
        </button>
      </div>

      <div className={styles.list}>
        {filtered.map(({ exercise, category }) => (
          <button
            key={exercise.id}
            type="button"
            className={styles.exerciseCard}
            onClick={() => onStartRepeat([exercise], category.id)}
            style={{ borderLeft: `4px solid ${category.color}` }}
          >
            <div className={styles.cardLeft}>
              <span className={styles.catBadge} style={{ background: category.colorSoft, color: category.color }}>
                {CATEGORY_ICONS[category.id]} {category.title}
              </span>
              <p className={styles.cardQuestion}>
                {exercise.data.type !== "memory"
                  ? (exercise.data as { question: string }).question
                  : (exercise.data as { question: string }).question}
              </p>
            </div>
            <span className={styles.typeBadge}>
              {TYPE_LABELS[exercise.data.type]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
