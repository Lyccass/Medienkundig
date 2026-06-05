import React from "react";
import { ShieldAlert, Newspaper, Smartphone, Lock, HelpCircle, Star, ChevronLeft } from "lucide-react";
import { categories } from "../data/courses";
import type { Exercise } from "../data/courses";
import type { Progress } from "../store/useProgress";
import { TYPE_ICONS, TYPE_LABELS } from "../constants/ui";
import { isRealExercise } from "../utils/exercises";
import styles from "./CategoryPage.module.css";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  scamming:    <ShieldAlert size={22} strokeWidth={2} />,
  news:        <Newspaper   size={22} strokeWidth={2} />,
  socialmedia: <Smartphone  size={22} strokeWidth={2} />,
  general:     <Lock        size={22} strokeWidth={2} />,
};

/* ── Path geometry ── */
const NODE_R = 30;           // radius of each node circle
const STEP_H = 130;          // vertical distance between node centres
const PAD_TOP = 50;
const CONTAINER_W = 380;
const MAX_PATH_CLASS_COUNT = 16;

// Repeating x-centres for the path rhythm (fraction of CONTAINER_W)
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
  const doneChain: NodeDef[] = [];
  for (const node of nodes) {
    if (node.state !== "done") break;
    doneChain.push(node);
  }
  if (doneChain.length < 2) return "";
  return buildSvgPath(doneChain);
}

interface PathViewProps {
  exercises: Exercise[];
  completedIds: string[];
  onNodeClick: (exerciseId: string) => void;
}

function PathView({ exercises, completedIds, onNodeClick }: PathViewProps) {
  const nodes = buildNodes(exercises, completedIds);
  if (nodes.length === 0) return null;

  const pathClassCount = Math.min(exercises.length, MAX_PATH_CLASS_COUNT);
  const totalH = PAD_TOP + (exercises.length - 1) * STEP_H + NODE_R + PAD_TOP;
  const fullPath = buildSvgPath(nodes);
  const donePath = buildDonePath(nodes);

  return (
    <div className={styles.pathOuter}>
      <div className={`${styles.pathContainer} ${styles[`pathCount${pathClassCount}`]}`}>
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
            <path className={styles.pathTrackLine} d={fullPath} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          )}
          {/* Completed portion */}
          {donePath && (
            <path className={styles.pathDoneLine} d={donePath} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          )}
          {/* Active node glow ring */}
          {nodes.map((n) =>
            n.state === "active" ? (
              <circle className={styles.nodeGlow} key={`glow-${n.id}`} cx={n.cx} cy={n.cy} r={NODE_R + 10} />
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
              className={`${styles.node} ${styles[`nodePos${Math.min(i, MAX_PATH_CLASS_COUNT - 1)}`]} ${isDone ? styles.nodeDone : ""} ${isActive ? styles.nodeActive : ""} ${isLocked ? styles.nodeLocked : ""} ${isLast ? styles.nodeLast : ""}`}
              onClick={() => onNodeClick(node.id)}
              disabled={isLocked}
              aria-label={`Übung ${i + 1}: ${"question" in node.exercise.data ? node.exercise.data.question : TYPE_LABELS[node.exercise.data.type] ?? node.exercise.data.type}`}
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
                {i + 1}. {TYPE_LABELS[node.exercise.data.type] ?? node.exercise.data.type}
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

  const allIds = category.units.flatMap((u) => u.exercises.filter(isRealExercise).map((e) => e.id));
  const done = allIds.filter((id) => progress.completedExercises.includes(id)).length;
  const total = allIds.length;
  const pct = total === 0 ? 0 : done / total;

  function getStartIndexForExercise(unitExercises: Exercise[], exerciseId: string) {
    const exerciseIndex = unitExercises.findIndex((exercise) => exercise.id === exerciseId);
    if (exerciseIndex <= 0) return Math.max(exerciseIndex, 0);
    return unitExercises[exerciseIndex - 1].data.type === "lesson" ? exerciseIndex - 1 : exerciseIndex;
  }

  function handleNodeClick(unitExercises: Exercise[], exerciseId: string) {
    const startIndex = getStartIndexForExercise(unitExercises, exerciseId);
    onStartExercises(unitExercises.slice(startIndex), categoryId);
  }

  function handleUnitStart(unitExercises: Exercise[]) {
    const realExercises = unitExercises.filter(isRealExercise);
    const completedRealCount = realExercises.filter((exercise) =>
      progress.completedExercises.includes(exercise.id),
    ).length;

    if (completedRealCount === realExercises.length) {
      onStartExercises(unitExercises, categoryId);
      return;
    }

    if (completedRealCount === 0) {
      onStartExercises(unitExercises, categoryId);
      return;
    }

    const firstIncomplete = unitExercises.findIndex(
      (e) => isRealExercise(e) && !progress.completedExercises.includes(e.id),
    );
    const startIndex = firstIncomplete === -1
      ? 0
      : getStartIndexForExercise(unitExercises, unitExercises[firstIncomplete].id);
    onStartExercises(unitExercises.slice(startIndex), categoryId);
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={onBack} aria-label="Zurück">
          <ChevronLeft size={18} strokeWidth={2} />
          Lernpfade
        </button>

        <div className={styles.heroBar}>
          <div className={styles.heroLeft}>
            <span className={styles.heroIcon}>{CATEGORY_ICONS[category.id]}</span>
            <div>
              <h1 className={styles.heroTitle}>{category.title}</h1>
              <p className={styles.heroSub}>{category.subtitle}</p>
            </div>
          </div>
          <div className={styles.heroProgress}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle className={styles.heroProgressTrack} cx="26" cy="26" r="21" fill="none" strokeWidth="5" />
              <circle
                className={styles.heroProgressFill}
                cx="26" cy="26" r="21"
                fill="none"
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
        {category.units.map((unit, unitIndex) => {
          const pathExercises = unit.exercises.filter(isRealExercise);
          const unitIds = pathExercises.map((e) => e.id);
          const unitDone = unitIds.filter((id) => progress.completedExercises.includes(id)).length;
          const unitTotal = unitIds.length;
          const allUnitDone = unitDone === unitTotal;
          const firstIncomplete = pathExercises.findIndex(
            (e) => !progress.completedExercises.includes(e.id),
          );
          const btnLabel = allUnitDone ? "Wiederholen" : firstIncomplete > 0 ? "Fortsetzen" : "Starten";

          return (
            <div key={unit.id} className={styles.unit}>
              {/* Unit header */}
              <div className={styles.unitHeader}>
                <div className={styles.unitInfo}>
                  <p className={styles.unitEyebrow}>Einheit {unitIndex + 1}</p>
                  <h2 className={styles.unitTitle}>{unit.title}</h2>
                  <p className={styles.unitDesc}>{unit.description}</p>
                </div>
                <button
                  type="button"
                  className={styles.startBtn}
                  onClick={() => handleUnitStart(unit.exercises)}
                >
                  {btnLabel}
                </button>
              </div>

              {/* Exercise path */}
              <PathView
                exercises={pathExercises}
                completedIds={progress.completedExercises}
                onNodeClick={(exerciseId) => handleNodeClick(unit.exercises, exerciseId)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
