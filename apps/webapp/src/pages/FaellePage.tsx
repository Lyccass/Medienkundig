import { useState } from "react";
import { Mail, MessageSquare, Globe, Share2, ChevronRight, ShieldAlert, Newspaper, Smartphone, Lock } from "lucide-react";
import { faelle } from "../data/faelle";
import { categories } from "../data/courses";
import type { Exercise } from "../data/courses";
import styles from "./FaellePage.module.css";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  scamming:    <ShieldAlert size={16} strokeWidth={2} />,
  news:        <Newspaper   size={16} strokeWidth={2} />,
  socialmedia: <Smartphone  size={16} strokeWidth={2} />,
  general:     <Lock        size={16} strokeWidth={2} />,
};

const SCENARIO_ICONS: Record<string, React.ReactNode> = {
  email:  <Mail          size={14} strokeWidth={2} />,
  sms:    <MessageSquare size={14} strokeWidth={2} />,
  chat:   <MessageSquare size={14} strokeWidth={2} />,
  web:    <Globe         size={14} strokeWidth={2} />,
  social: <Share2        size={14} strokeWidth={2} />,
};

const SCENARIO_LABELS: Record<string, string> = {
  email:  "E-Mail",
  sms:    "SMS",
  chat:   "Chat",
  web:    "Website",
  social: "Social Media",
};

interface Props {
  onStartFall: (exercise: Exercise, categoryId: string) => void;
}

export function FaellePage({ onStartFall }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Gather all fall-type exercises from courses + standalone faelle
  const courseFalls: { id: string; categoryId: string; title: string; data: Exercise["data"] }[] = [];
  for (const cat of categories) {
    for (const unit of cat.units) {
      for (const ex of unit.exercises) {
        if (ex.data.type === "fall") {
          courseFalls.push({ id: ex.id, categoryId: cat.id, title: unit.title, data: ex.data });
        }
      }
    }
  }

  const allFalls = [
    ...courseFalls.map((f) => ({
      id: f.id,
      categoryId: f.categoryId,
      title: f.title,
      exercise: { id: f.id, data: f.data } as Exercise,
    })),
    ...faelle.map((f) => ({
      id: f.id,
      categoryId: f.categoryId,
      title: f.title,
      exercise: { id: f.id, data: f.data } as Exercise,
    })),
  ];

  const filtered = activeCategory === "all"
    ? allFalls
    : allFalls.filter((f) => f.categoryId === activeCategory);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Fälle</h1>
      <p className={styles.pageSubtitle}>
        Echte Szenarien analysieren und Betrugsversuche erkennen.
      </p>

      {/* Category filter */}
      <div className={styles.filters}>
        <button
          type="button"
          className={`${styles.chip} ${activeCategory === "all" ? styles.chipActive : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          Alle ({allFalls.length})
        </button>
        {categories.map((cat) => {
          const count = allFalls.filter((f) => f.categoryId === cat.id).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              type="button"
              className={`${styles.chip} ${activeCategory === cat.id ? styles.chipActive : ""}`}
              style={
                activeCategory === cat.id
                  ? { background: cat.colorSoft, color: cat.color, borderColor: `${cat.color}66` }
                  : {}
              }
              onClick={() => setActiveCategory(cat.id)}
            >
              {CATEGORY_ICONS[cat.id]}
              {cat.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Fall cards */}
      <div className={styles.list}>
        {filtered.map(({ id, categoryId, title, exercise }) => {
          const cat = categories.find((c) => c.id === categoryId);
          const fallData = exercise.data as Extract<typeof exercise.data, { type: "fall" }>;

          return (
            <button
              key={id}
              type="button"
              className={styles.card}
              style={{ "--cat-color": cat?.color, borderLeftColor: cat?.color } as React.CSSProperties}
              onClick={() => onStartFall(exercise, categoryId)}
            >
              <div className={styles.cardTop}>
                <div className={styles.badges}>
                  {cat && (
                    <span
                      className={styles.catBadge}
                      style={{ background: cat.colorSoft, color: cat.color }}
                    >
                      {CATEGORY_ICONS[categoryId]}
                      {cat.title}
                    </span>
                  )}
                  <span className={styles.typeBadge}>
                    {SCENARIO_ICONS[fallData.scenario.type]}
                    {SCENARIO_LABELS[fallData.scenario.type]}
                  </span>
                </div>
                <ChevronRight size={16} strokeWidth={2} className={styles.cardArrow} />
              </div>

              <p className={styles.cardTitle}>{title}</p>
              <p className={styles.cardQuestion}>{fallData.question}</p>

              {/* Scenario preview */}
              <div className={styles.preview}>
                {fallData.scenario.from && (
                  <span className={styles.previewMeta}>Von: {fallData.scenario.from}</span>
                )}
                {fallData.scenario.url && (
                  <span className={styles.previewMeta}>{fallData.scenario.url}</span>
                )}
                {fallData.scenario.sender && (
                  <span className={styles.previewMeta}>{fallData.scenario.sender}</span>
                )}
                <p className={styles.previewContent}>
                  {fallData.scenario.content.slice(0, 100)}
                  {fallData.scenario.content.length > 100 ? "…" : ""}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
