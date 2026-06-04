import React from "react";
import { ShieldAlert, Newspaper, Smartphone, Lock, Flame, Zap, Sprout, Target, Trophy } from "lucide-react";
import { categories } from "../data/courses";
import type { Progress } from "../store/useProgress";
import styles from "./ProfilePage.module.css";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  scamming:    <ShieldAlert size={20} strokeWidth={2} />,
  news:        <Newspaper   size={20} strokeWidth={2} />,
  socialmedia: <Smartphone  size={20} strokeWidth={2} />,
  general:     <Lock        size={20} strokeWidth={2} />,
};

function RadialProgress({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : value / max;
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;

  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className={styles.radial}>
      <circle className={styles.radialTrack} cx="28" cy="28" r={r} fill="none" strokeWidth="5" />
      <circle
        cx="28" cy="28" r={r}
        fill="none"
        className={styles.radialFill}
        strokeWidth="5"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
      />
      <text className={styles.radialText} x="28" y="33" textAnchor="middle" fontSize="12" fontWeight="700">
        {value}/{max}
      </text>
    </svg>
  );
}

interface Props {
  progress: Progress;
  onResetProgress: () => void;
}

export function ProfilePage({ progress, onResetProgress }: Props) {
  const totalExercises = categories.reduce(
    (sum, cat) => sum + cat.units.reduce((s, u) => s + u.exercises.length, 0), 0,
  );
  const completedCount = progress.completedExercises.length;
  const overallPct = totalExercises === 0 ? 0 : Math.round((completedCount / totalExercises) * 100);

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <div className={styles.headInner}>
          <div className={styles.heroLeft}>
            <div className={styles.avatar}>
              <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="20" r="10" fill="white" fillOpacity="0.9" />
                <ellipse cx="24" cy="42" rx="16" ry="10" fill="white" fillOpacity="0.7" />
              </svg>
            </div>
            <div>
              <h1 className={styles.pageTitle}>Lernende Person</h1>
              <p className={styles.pageSubtitle}>Medienkompetenz-Kurs</p>
            </div>
          </div>

          <div className={styles.headStats}>
            <div className={styles.headStat}>
              <span className={styles.headStatValue}><Flame size={18} strokeWidth={2} /> {progress.streak}</span>
              <span className={styles.headStatLabel}>Tage-Serie</span>
            </div>
            <div className={styles.headStatDivider} />
            <div className={styles.headStat}>
              <span className={styles.headStatValue}><Zap size={18} strokeWidth={2} /> {progress.xp}</span>
              <span className={styles.headStatLabel}>XP gesamt</span>
            </div>
            <div className={styles.headStatDivider} />
            <div className={styles.headStat}>
              <span className={styles.headStatValue}>{overallPct}%</span>
              <span className={styles.headStatLabel}>Abgeschlossen</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Overall progress */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Gesamtfortschritt</h2>
          <progress className={styles.overallBar} value={overallPct} max={100} aria-label="Gesamtfortschritt" />
          <p className={styles.overallLabel}>{completedCount} von {totalExercises} Übungen abgeschlossen</p>
        </div>

        {/* Per-category */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Kategorien</h2>
          <div className={styles.categoryGrid}>
            {categories.map((cat) => {
              const catExercises = cat.units.flatMap((u) => u.exercises.map((e) => e.id));
              const catCompleted = catExercises.filter((id) => progress.completedExercises.includes(id)).length;
              return (
                <div key={cat.id} className={styles.categoryCard}>
                  <RadialProgress value={catCompleted} max={catExercises.length} />
                  <div className={styles.categoryInfo}>
                    <span className={styles.categoryIcon}>{CATEGORY_ICONS[cat.id]}</span>
                    <div>
                      <p className={styles.categoryTitle}>{cat.title}</p>
                      <p className={styles.categorySubtitle}>{cat.subtitle}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Errungenschaften</h2>
          <div className={styles.badges}>
            {[
              { icon: <Sprout size={20} strokeWidth={1.8} />, label: "Erste Schritte",   unlocked: completedCount >= 1 },
              { icon: <Target size={20} strokeWidth={1.8} />, label: "Scharfschütze",    unlocked: progress.xp >= 50 },
              { icon: <Trophy size={20} strokeWidth={1.8} />, label: "Meisterlernender", unlocked: completedCount >= totalExercises && totalExercises > 0 },
              { icon: <Flame  size={20} strokeWidth={1.8} />, label: "7-Tage-Serie",     unlocked: progress.streak >= 7 },
            ].map((b) => (
              <div key={b.label} className={`${styles.badge} ${b.unlocked ? styles.badgeUnlocked : ""}`}>
                <span className={styles.badgeIcon}>{b.icon}</span>
                <span className={styles.badgeLabel}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reset */}
        <div className={styles.resetSection}>
          <button type="button" className={styles.resetBtn} onClick={onResetProgress}>
            Fortschritt zurücksetzen
          </button>
        </div>
      </div>
    </div>
  );
}
