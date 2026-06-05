import styles from "./DefinitionCard.module.css";

interface Props {
  term: string;
  info: string;
  isNew?: boolean;
}

export function DefinitionCard({ term, info, isNew }: Props) {
  return (
    <div className={`${styles.card} ${isNew ? styles.new : ""}`}>
      <span className={styles.termChip}>{term}</span>
      <p className={styles.info}>{info}</p>
    </div>
  );
}
