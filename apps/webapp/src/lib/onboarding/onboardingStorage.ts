import type { OnboardingAnswer, OnboardingResult } from "../../data/onboarding";

const STORAGE_KEY = "mk_onboarding_v1";

export interface OnboardingRecord {
  completed: true;
  answers: OnboardingAnswer[];
  result: OnboardingResult;
  completedAt: string;
}

export function loadOnboardingRecord(): OnboardingRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isOnboardingRecord(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveOnboardingRecord(record: OnboardingRecord) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

export function hasCompletedOnboarding() {
  return Boolean(loadOnboardingRecord());
}

function isOnboardingRecord(value: unknown): value is OnboardingRecord {
  if (value === null || typeof value !== "object") return false;
  const record = value as OnboardingRecord;
  return (
    record.completed === true &&
    Array.isArray(record.answers) &&
    typeof record.completedAt === "string" &&
    record.result !== null &&
    typeof record.result === "object"
  );
}
