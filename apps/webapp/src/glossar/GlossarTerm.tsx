import { useGlossar } from "./GlossarContext";
import type { ReactNode } from "react";
import styles from "./GlossarTerm.module.css";

interface Props {
  id: string;
  children: ReactNode;
}

export function GlossarTerm({ id, children }: Props) {
  const { open } = useGlossar();
  return (
    <button className={styles.term} type="button" onClick={() => open(id)}>
      {children}
    </button>
  );
}
