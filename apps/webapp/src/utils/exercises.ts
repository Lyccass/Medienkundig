import type { Exercise } from "../data/courses";

export function isRealExercise(exercise: Exercise): boolean {
  return exercise.data.type !== "lesson";
}
