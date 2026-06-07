import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { ProgressProvider } from "./store/ProgressContext";
import { categories } from "./data/courses";
import { isRealExercise } from "./utils/exercises";
import App from "./App";

if (import.meta.env.DEV) {
  const allIds = categories.flatMap((c) => c.units.flatMap((u) => u.exercises.filter(isRealExercise).map((e) => e.id)));
  const dupes = allIds.filter((id, i) => allIds.indexOf(id) !== i);
  if (dupes.length) console.warn("[medienkundig] Duplicate exercise IDs:", dupes);
}

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <StrictMode>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </StrictMode>
);
