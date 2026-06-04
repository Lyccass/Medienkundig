import React from "react";
import styles from "./PageHeader.module.css";

interface Props {
  title?: string;
  subtitle?: string;
  /** Right-side content (search bar, stats strip, etc.) */
  action?: React.ReactNode;
  /** Replaces the default title+subtitle when the left side needs custom markup */
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action, children }: Props) {
  return (
    <div className={styles.head}>
      <div className={styles.inner}>
        {children ?? (
          <div className={styles.left}>
            {title && <h1 className={styles.title}>{title}</h1>}
            {subtitle && <p className={styles.sub}>{subtitle}</p>}
          </div>
        )}
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
