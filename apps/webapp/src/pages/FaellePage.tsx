import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, MapPinned } from "lucide-react";
import { faelle, type FallAdventure, type FallTopic } from "../data/faelle";
import { categories, type Exercise } from "../data/courses";
import { TOPIC_ICONS, THEME_ICONS } from "../constants/ui";
import { PageHeader } from "../components/PageHeader";
import styles from "./FaellePage.module.css";

const THEME_FILTERS = ["Alle", "Alltag", "Online-Shopping", "Konto", "Reise"] as const;

interface Props {
  onStartFall: (exercises: Exercise[]) => void;
}

function getTopic(topic: FallTopic) {
  return categories.find((cat) => cat.id === topic);
}

function toExercises(fall: FallAdventure): Exercise[] {
  return fall.steps.map((step) => ({ id: step.id, data: step.data }));
}

export function FaellePage({ onStartFall }: Props) {
  const [activeTheme, setActiveTheme] = useState<(typeof THEME_FILTERS)[number]>("Alle");

  const filtered = useMemo(
    () => activeTheme === "Alle" ? faelle : faelle.filter((f) => f.theme === activeTheme),
    [activeTheme],
  );

  return (
    <div className="pageShell">
      <PageHeader title="Fälle" subtitle="Mehrteilige Alltagsszenarien mit echten Entscheidungen." />

      <div className="pageBody">

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <p className={styles.sidebarLabel}>Thema</p>
          <nav className={styles.catNav}>
            {THEME_FILTERS.map((theme) => {
              const count = theme === "Alle" ? faelle.length : faelle.filter((f) => f.theme === theme).length;
              return (
                <button
                  key={theme}
                  type="button"
                  className={`${styles.cat} ${activeTheme === theme ? styles.catActive : ""}`}
                  onClick={() => setActiveTheme(theme)}
                >
                  <span className={styles.catDot} />
                  {theme !== "Alle" && <span className={styles.catIcon}>{THEME_ICONS[theme]}</span>}
                  {theme}
                  <span className={styles.catCount}>{count}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Adventure list */}
        <main className={styles.main}>
          <ul className={styles.list} role="list">
            {filtered.map((fall) => (
              <li key={fall.id} className={styles.row}>
                <button
                  type="button"
                  className={styles.rowBtn}
                  onClick={() => onStartFall(toExercises(fall))}
                >
                  <div className={styles.rowLeft}>
                    <span className={styles.theme}>{fall.theme}</span>
                    <span className={styles.rowTitle}>{fall.title}</span>
                    <span className={styles.rowSub}>{fall.subtitle}</span>
                    <span className={styles.setting}>
                      <MapPinned size={13} strokeWidth={2} />
                      {fall.setting}
                    </span>
                    <div className={styles.topicRow}>
                      {fall.topics.map((topic) => {
                        const cat = getTopic(topic);
                        if (!cat) return null;
                        return (
                          <span key={topic} className={styles.topic}>
                            {TOPIC_ICONS[topic]}
                            {cat.title}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.rowRight}>
                    <span className={styles.stepCount}>
                      <BookOpen size={13} strokeWidth={2} />
                      {fall.steps.length} Stationen
                    </span>
                    <span className={styles.start}>
                      Starten
                      <ArrowRight size={15} strokeWidth={2} />
                    </span>
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
