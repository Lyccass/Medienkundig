import { useState } from "react";
import { Mail, MessageSquare, Globe, Share2, ShieldAlert, Newspaper, Smartphone, Lock } from "lucide-react";
import { faelle } from "../data/faelle";
import { categories } from "../data/courses";
import type { Exercise } from "../data/courses";
import styles from "./FaellePage.module.css";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  scamming:    <ShieldAlert size={14} strokeWidth={2} />,
  news:        <Newspaper   size={14} strokeWidth={2} />,
  socialmedia: <Smartphone  size={14} strokeWidth={2} />,
  general:     <Lock        size={14} strokeWidth={2} />,
};

const SCENARIO_ICONS: Record<string, React.ReactNode> = {
  email:  <Mail          size={13} strokeWidth={2} />,
  sms:    <MessageSquare size={13} strokeWidth={2} />,
  chat:   <MessageSquare size={13} strokeWidth={2} />,
  web:    <Globe         size={13} strokeWidth={2} />,
  social: <Share2        size={13} strokeWidth={2} />,
};

const SCENARIO_LABELS: Record<string, string> = {
  email: "E-Mail", sms: "SMS", chat: "Chat", web: "Website", social: "Social Media",
};

interface Props {
  onStartFall: (exercise: Exercise, categoryId: string) => void;
}

export function FaellePage({ onStartFall }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

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
    ...courseFalls.map((f) => ({ id: f.id, categoryId: f.categoryId, title: f.title, exercise: { id: f.id, data: f.data } as Exercise })),
    ...faelle.map((f) => ({ id: f.id, categoryId: f.categoryId, title: f.title, exercise: { id: f.id, data: f.data } as Exercise })),
  ];

  const filtered = activeCategory === "all" ? allFalls : allFalls.filter((f) => f.categoryId === activeCategory);

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <div className={styles.headInner}>
          <div>
            <h1 className={styles.pageTitle}>Fälle</h1>
            <p className={styles.pageSubtitle}>Echte Szenarien analysieren und Betrugsversuche erkennen.</p>
          </div>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filterBarInner}>
          <button type="button" className={`${styles.chip} ${activeCategory === "all" ? styles.chipActive : ""}`} onClick={() => setActiveCategory("all")}>
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
                style={activeCategory === cat.id ? { background: cat.colorSoft, color: cat.color, borderColor: `${cat.color}55` } : {}}
                onClick={() => setActiveCategory(cat.id)}
              >
                {CATEGORY_ICONS[cat.id]}{cat.title} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.list}>
          {filtered.map(({ id, categoryId, title, exercise }) => {
            const cat = categories.find((c) => c.id === categoryId);
            const fallData = exercise.data as Extract<typeof exercise.data, { type: "fall" }>;
            const previewLine = fallData.scenario.from ?? fallData.scenario.url ?? fallData.scenario.sender ?? null;

            return (
              <button key={id} type="button" className={styles.row} onClick={() => onStartFall(exercise, categoryId)}>
                <div className={styles.rowLeft}>
                  <span className={styles.rowTitle}>{title}</span>
                  <span className={styles.rowQuestion}>{fallData.question}</span>
                  {previewLine && <span className={styles.rowPreview}>{previewLine}</span>}
                </div>
                <div className={styles.rowRight}>
                  {cat && (
                    <span className={styles.rowCat} style={{ color: cat.color }}>
                      {CATEGORY_ICONS[categoryId]}{cat.title}
                    </span>
                  )}
                  <span className={styles.rowType}>
                    {SCENARIO_ICONS[fallData.scenario.type]}{SCENARIO_LABELS[fallData.scenario.type]}
                  </span>
                  <svg className={styles.rowArrow} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
