import { useEffect, useRef } from "react";
import { glossarTerms } from "@medienkundig/ui";
import { useGlossar } from "./GlossarContext";
import styles from "./GlossarModal.module.css";

export function GlossarModal() {
  const { activeTerm, open, close } = useGlossar();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeTerm) {
      document.body.style.overflow = "hidden";
      closeRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [activeTerm]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [close]);

  if (!activeTerm) return null;

  const related = activeTerm.related
    .map((id) => glossarTerms.find((t) => t.id === id))
    .filter(Boolean) as typeof glossarTerms;

  return (
    <div className={styles.overlay} role="dialog" aria-modal aria-labelledby="gm-term">
      <div className={styles.backdrop} onClick={close} />
      <div className={styles.sheet}>

        <div className={styles.closeRow}>
          <button ref={closeRef} className={styles.close} onClick={close} aria-label="Schließen" type="button">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          <p className={styles.category}>{activeTerm.category}</p>
          <h2 className={styles.term} id="gm-term">{activeTerm.term}</h2>
          <p className={styles.short}>{activeTerm.short}</p>
          <div className={styles.divider} />
          <p className={styles.full}>{activeTerm.full}</p>

          {activeTerm.example && (
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Beispiel</span>
              <p className={styles.exampleText}>{activeTerm.example}</p>
            </div>
          )}

          {activeTerm.media && (
            <div className={styles.media}>
              {activeTerm.media.type === "youtube" ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeTerm.media.src}`}
                  title={activeTerm.term}
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <img src={activeTerm.media.src} alt={activeTerm.term} loading="lazy" />
              )}
              {activeTerm.media.caption && (
                <p className={styles.mediaCaption}>{activeTerm.media.caption}</p>
              )}
            </div>
          )}

          {related.length > 0 && (
            <div className={styles.related}>
              <span className={styles.relatedLabel}>Verwandt</span>
              {related.map((r) => (
                <button key={r.id} className={styles.relatedChip} onClick={() => open(r.id)} type="button">
                  {r.term}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          {activeTerm.source && (
            <a className={styles.source} href={activeTerm.source.url} target="_blank" rel="noopener">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {activeTerm.source.label}
            </a>
          )}
          <a href="http://medienkundig.local/glossar" className={styles.glossarLink}>
            Alle Begriffe →
          </a>
        </div>

      </div>
    </div>
  );
}
