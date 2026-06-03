import React from "react";
import { ShieldAlert, Newspaper, Smartphone, Lock, HelpCircle, ImageIcon, Volume2, Shuffle, PenLine, Star, ChevronLeft } from "lucide-react";
import { categories } from "../data/courses";
import type { Category, Exercise } from "../data/courses";
import type { Progress } from "../store/useProgress";
import styles from "./CategoryPage.module.css";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  scamming:    <ShieldAlert size={22} strokeWidth={2} />,
  news:        <Newspaper   size={22} strokeWidth={2} />,
  socialmedia: <Smartphone  size={22} strokeWidth={2} />,
  general:     <Lock        size={22} strokeWidth={2} />,
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  multipleChoice:  <HelpCircle size={16} strokeWidth={2} />,
  bildAuswahl:     <ImageIcon  size={16} strokeWidth={2} />,
  audioAuswahl:    <Volume2    size={16} strokeWidth={2} />,
  memory:          <Shuffle    size={16} strokeWidth={2} />,
  vervollstaendigen: <PenLine  size={16} strokeWidth={2} />,
  fall:            <ShieldAlert size={16} strokeWidth={2} />,
};

/* ── Path geometry ── */
const NODE_R = 30;           // radius of each node circle
const STEP_H = 130;          // vertical distance between node centres
const PAD_TOP = 50;
const CONTAINER_W = 380;

// x-centre for each of up to 8 exercises (fraction of CONTAINER_W)
const X_FRACS = [0.62, 0.28, 0.64, 0.16, 0.50, 0.72, 0.32, 0.55];

interface NodeDef {
  id: string;
  cx: number;
  cy: number;
  exercise: Exercise;
  state: "done" | "active" | "locked";
}

function buildNodes(
  exercises: Exercise[],
  completedIds: string[],
): NodeDef[] {
  const firstIncomplete = exercises.findIndex((e) => !completedIds.includes(e.id));

  return exercises.map((ex, i) => {
    const done = completedIds.includes(ex.id);
    const state: NodeDef["state"] = done
      ? "done"
      : firstIncomplete === i
        ? "active"
        : "locked";

    return {
      id: ex.id,
      cx: Math.round(X_FRACS[i % X_FRACS.length] * CONTAINER_W),
      cy: PAD_TOP + i * STEP_H,
      exercise: ex,
      state,
    };
  });
}

function buildSvgPath(nodes: NodeDef[]): string {
  if (nodes.length < 2) return "";
  let d = `M ${nodes[0].cx} ${nodes[0].cy}`;
  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i];
    const b = nodes[i + 1];
    const mid = (a.cy + b.cy) / 2;
    d += ` C ${a.cx} ${mid}, ${b.cx} ${mid}, ${b.cx} ${b.cy}`;
  }
  return d;
}

function buildDonePath(nodes: NodeDef[]): string {
  const done = nodes.filter((n) => n.state === "done");
  if (done.length < 2) return "";
  return buildSvgPath(done);
}

interface PathViewProps {
  exercises: Exercise[];
  category: Category;
  completedIds: string[];
  onNodeClick: (index: number) => void;
}

function PathView({ exercises, category, completedIds, onNodeClick }: PathViewProps) {
  const nodes = buildNodes(exercises, completedIds);
  const totalH = PAD_TOP + (exercises.length - 1) * STEP_H + NODE_R + PAD_TOP;
  const fullPath = buildSvgPath(nodes);
  const donePath = buildDonePath(nodes);

  return (
    <div className={styles.pathOuter}>
      <div className={styles.pathContainer} style={{ height: totalH, maxWidth: CONTAINER_W }}>
        {/* SVG background path */}
        <svg
          className={styles.pathSvg}
          width={CONTAINER_W}
          height={totalH}
          viewBox={`0 0 ${CONTAINER_W} ${totalH}`}
          fill="none"
          aria-hidden
        >
          {/* Ghost full path */}
          {fullPath && (
            <path d={fullPath} stroke={category.colorSoft} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          )}
          {/* Completed portion */}
          {donePath && (
            <path d={donePath} stroke="#16a34a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          )}
          {/* Active node glow ring */}
          {nodes.map((n) =>
            n.state === "active" ? (
              <circle key={`glow-${n.id}`} cx={n.cx} cy={n.cy} r={NODE_R + 10} fill={category.color} opacity="0.12" />
            ) : null,
          )}
        </svg>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isDone = node.state === "done";
          const isActive = node.state === "active";
          const isLocked = node.state === "locked";
          const isLast = i === exercises.length - 1;

          return (
            <button
              key={node.id}
              type="button"
              className={`${styles.node} ${isDone ? styles.nodeDone : ""} ${isActive ? styles.nodeActive : ""} ${isLocked ? styles.nodeLocked : ""} ${isLast ? styles.nodeLast : ""}`}
              style={{
                left: node.cx - NODE_R,
                top: node.cy - NODE_R,
                width: NODE_R * 2,
                height: NODE_R * 2,
                "--node-color": isDone ? "#16a34a" : isActive ? category.color : "#c8c4d8",
                "--node-soft": isDone ? "#dcfce7" : isActive ? category.colorSoft : "#f0eef8",
              } as React.CSSProperties}
              onClick={() => onNodeClick(i)}
              disabled={isLocked}
              aria-label={`Übung ${i + 1}: ${node.exercise.data.type === "memory" ? "Memory" : (node.exercise.data as { question: string }).question}`}
              aria-disabled={isLocked}
            >
              {isDone ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10l5 5 7-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className={styles.nodeIcon}>
                  {isLocked
                    ? <Lock size={14} strokeWidth={2} />
                    : isLast
                      ? <Star size={14} strokeWidth={2} />
                      : (TYPE_ICONS[node.exercise.data.type] ?? <HelpCircle size={14} strokeWidth={2} />)
                  }
                </span>
              )}

              <span className={styles.nodeLabel}>
                {i + 1}. {node.exercise.data.type}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface Props {
  categoryId: string;
  progress: Progress;
  onBack: () => void;
  onStartExercises: (exercises: Exercise[], categoryId: string) => void;
}

export function CategoryPage({ categoryId, progress, onBack, onStartExercises }: Props) {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return null;

  const allIds = category.units.flatMap((u) => u.exercises.map((e) => e.id));
  const done = allIds.filter((id) => progress.completedExercises.includes(id)).length;
  const total = allIds.length;
  const pct = total === 0 ? 0 : done / total;

  function handleNodeClick(unitExercises: Exercise[], startIndex: number) {
    onStartExercises(unitExercises.slice(startIndex), categoryId);
  }

  function handleUnitStart(unitExercises: Exercise[]) {
    const firstIncomplete = unitExercises.findIndex(
      (e) => !progress.completedExercises.includes(e.id),
    );
    const startIndex = firstIncomplete === -1 ? 0 : firstIncomplete;
    onStartExercises(unitExercises.slice(startIndex), categoryId);
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header} style={{ "--cat-color": category.color } as React.CSSProperties}>
        <button type="button" className={styles.backBtn} onClick={onBack} aria-label="Zurück">
          <ChevronLeft size={18} strokeWidth={2} />
          Lernpfade
        </button>

        <div className={styles.heroBar} style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}cc)` }}>
          <div className={styles.heroLeft}>
            <span className={styles.heroIcon}>{CATEGORY_ICONS[category.id]}</span>
            <div>
              <h1 className={styles.heroTitle}>{category.title}</h1>
              <p className={styles.heroSub}>{category.subtitle}</p>
            </div>
          </div>
          <div className={styles.heroProgress}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="21" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="5" />
              <circle
                cx="26" cy="26" r="21"
                fill="none"
                stroke="white"
                strokeWidth="5"
                strokeDasharray={`${pct * 132} ${(1 - pct) * 132}`}
                strokeDashoffset="33"
                strokeLinecap="round"
              />
              <text x="26" y="31" textAnchor="middle" fontSize="11" fontWeight="800" fill="white">
                {done}/{total}
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Units */}
      <div className={styles.units}>
        {category.units.map((unit) => {
          const unitIds = unit.exercises.map((e) => e.id);
          const unitDone = unitIds.filter((id) => progress.completedExercises.includes(id)).length;
          const unitTotal = unitIds.length;
          const allUnitDone = unitDone === unitTotal;
          const firstIncomplete = unit.exercises.findIndex(
            (e) => !progress.completedExercises.includes(e.id),
          );
          const btnLabel = allUnitDone ? "Wiederholen" : firstIncomplete > 0 ? "Fortsetzen" : "Starten";

          return (
            <div key={unit.id} className={styles.unit}>
              {/* Unit header */}
              <div className={styles.unitHeader} style={{ background: category.colorSoft, borderColor: `${category.color}33` }}>
                <div className={styles.unitInfo}>
                  <p className={styles.unitEyebrow} style={{ color: category.color }}>Einheit 1</p>
                  <h2 className={styles.unitTitle}>{unit.title}</h2>
                  <p className={styles.unitDesc}>{unit.description}</p>
                </div>
                <button
                  type="button"
                  className={styles.startBtn}
                  style={{ background: category.color }}
                  onClick={() => handleUnitStart(unit.exercises)}
                >
                  {btnLabel}
                </button>
              </div>

              {/* Exercise path */}
              <PathView
                exercises={unit.exercises}
                category={category}
                completedIds={progress.completedExercises}
                onNodeClick={(i) => handleNodeClick(unit.exercises, i)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
