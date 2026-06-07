import { categories } from "../../data/courses";
import { isRealExercise } from "../../utils/exercises";

interface ExerciseMeta {
  categoryId: string;
  exerciseId: string;
  exerciseType: string;
}

const exerciseIndex = new Map<string, ExerciseMeta>();

for (const category of categories) {
  for (const unit of category.units) {
    for (const exercise of unit.exercises) {
      if (!isRealExercise(exercise)) continue;
      exerciseIndex.set(exercise.id, {
        categoryId: category.id,
        exerciseId: exercise.id,
        exerciseType: exercise.data.type,
      });
    }
  }
}

export function getExerciseMeta(exerciseId: string): ExerciseMeta {
  return exerciseIndex.get(exerciseId) ?? {
    categoryId: "unknown",
    exerciseId,
    exerciseType: "unknown",
  };
}

export function getKnownExerciseIds(exerciseIds: string[]): string[] {
  return Array.from(
    new Set(exerciseIds.filter((exerciseId) => exerciseIndex.has(exerciseId))),
  );
}
