import React from "react";
import { ShieldAlert, Newspaper, Smartphone, Lock } from "lucide-react";
import { categories } from "../data/courses";
import type { Progress } from "../store/useProgress";
import styles from "./ProfilePage.module.css";

interface Props {
  progress: Progress;
  onResetProgress: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  scamming:    <ShieldAlert size={24} strokeWidth={2} />,
  news:        <Newspaper   size={24} strokeWidth={2} />,
  socialmedia: <Smartphone  size={24} strokeWidth={2} />,
  general:     <Lock        size={24} strokeWidth={2} />,
};

function RadialProgress({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max === 0 ? 0 : value / max;
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;

  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className={styles.radial}>
      <circle cx="28" cy="28" r={r} fill="none" stroke="#e9e6fa" strokeWidth="5" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.4,0,0.2,1)" }}
      />
      <text x="28" y="33" textAnchor="middle" fontSize="12" fontWeight="700" fill={color}>
        {value}/{max}
      </text>
    </svg>
  );
}

export function ProfilePage({ progress, onResetProgress }: Props) {
  const totalExercises = categories.reduce(
    (sum, cat) => sum + cat.units.reduce((s, u) => s + u.exercises.length, 0),
    0,
  );
  const completedCount = progress.completedExercises.length;
  const overallPct = totalExercises === 0 ? 0 : Math.round((completedCount / totalExercises) * 100);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Dein Profil</h1>

      {/* Avatar + name */}
      <div className={styles.hero}>
        <div className={styles.avatar}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="20" r="10" fill="white" fillOpacity="0.9" />
            <ellipse cx="24" cy="42" rx="16" ry="10" fill="white" fillOpacity="0.7" />
          </svg>
        </div>
        <div className={styles.heroInfo}>
          <p className={styles.heroName}>Lernende Person</p>
          <p className={styles.heroSub}>Medienkompetenz-Kurs</p>
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🔥</span>
          <span className={styles.statValue}>{progress.streak}</span>
          <span className={styles.statLabel}>Tage-Serie</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>⚡</span>
          <span className={styles.statValue}>{progress.xp}</span>
          <span className={styles.statLabel}>XP gesamt</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>✅</span>
          <span className={styles.statValue}>{completedCount}</span>
          <span className={styles.statLabel}>Abgeschlossen</span>
        </div>
      </div>

      {/* Overall progress */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Gesamtfortschritt</h2>
        <div className={styles.overallBar}>
          <div className={styles.overallFill} style={{ width: `${overallPct}%` }} />
        </div>
        <p className={styles.overallLabel}>{overallPct}% abgeschlossen</p>
      </div>

      {/* Per-category progress */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Kategorien</h2>
        <div className={styles.categoryGrid}>
          {categories.map((cat) => {
            const catExercises = cat.units.flatMap((u) => u.exercises.map((e) => e.id));
            const catCompleted = catExercises.filter((id) =>
              progress.completedExercises.includes(id),
            ).length;
            return (
              <div key={cat.id} className={styles.categoryCard}>
                <RadialProgress value={catCompleted} max={catExercises.length} color={cat.color} />
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryIcon} style={{ color: cat.color }}>{CATEGORY_ICONS[cat.id]}</span>
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
            { icon: "🌱", label: "Erste Schritte", unlocked: completedCount >= 1 },
            { icon: "🎯", label: "Scharf­schütze", unlocked: progress.xp >= 50 },
            { icon: "🏆", label: "Meisterlernender", unlocked: completedCount >= totalExercises && totalExercises > 0 },
            { icon: "🔥", label: "7-Tage-Serie", unlocked: progress.streak >= 7 },
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
  );
}
