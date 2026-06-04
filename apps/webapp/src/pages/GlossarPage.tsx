import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { glossarTerms, glossarCategories } from "@medienkundig/ui";
import { useGlossar } from "../glossar/GlossarContext";
import { PageHeader } from "../components/PageHeader";
import styles from "./GlossarPage.module.css";

const sorted = [...glossarTerms].sort((a, b) => a.term.localeCompare(b.term, "de"));

export function GlossarPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { open } = useGlossar();

  const q = query.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      sorted.filter((t) => {
        const matchCat = activeCategory === "all" || t.category === activeCategory;
        const matchQ = !q || t.term.toLowerCase().includes(q) || t.short.toLowerCase().includes(q);
        return matchCat && matchQ;
      }),
    [q, activeCategory],
  );

  // Group by first letter
  const grouped = useMemo(() => {
    const g: Record<string, typeof sorted> = {};
    for (const t of filtered) {
      const letter = t.term[0].toUpperCase();
      (g[letter] ??= []).push(t);
    }
    return g;
  }, [filtered]);

  const letters = Object.keys(grouped).sort();

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.head}>
        <div className={styles.headInner}>
          <div>
            <h1 className={styles.title}>Glossar</h1>
            <p className={styles.sub}>{glossarTerms.length} Begriffe rund um Medienkompetenz, einfach erklärt.</p>
          </div>
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} aria-hidden />
            <input
              type="search"
              placeholder="Begriff suchen…"
              className={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Glossar durchsuchen"
            />
          </div>
        </div>
      </div>

      {/* Two-pane body */}
      <div className={styles.body}>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <p className={styles.sidebarLabel}>Kategorien</p>
          <nav className={styles.catNav}>
            <button
              type="button"
              className={`${styles.cat} ${activeCategory === "all" ? styles.catActive : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              <span className={styles.catDot} />
              Alle
              <span className={styles.catCount}>{glossarTerms.length}</span>
            </button>
            {(glossarCategories as string[]).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.cat} ${activeCategory === cat ? styles.catActive : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span className={styles.catDot} />
                {cat}
                <span className={styles.catCount}>{glossarTerms.filter((t) => t.category === cat).length}</span>
              </button>
            ))}
          </nav>

          {letters.length > 0 && (
            <div className={styles.alphaNav}>
              {letters.map((l) => (
                <a key={l} className={styles.alphaLink} href={`#gl-${l}`}>{l}</a>
              ))}
            </div>
          )}
        </aside>

        {/* Term list */}
        <main className={styles.main}>
          {letters.length === 0 ? (
            <p className={styles.empty}>Kein Begriff gefunden.</p>
          ) : (
            letters.map((letter) => (
              <div key={letter} className={styles.group} id={`gl-${letter}`}>
                <div className={styles.letter}>{letter}</div>
                <ul className={styles.list} role="list">
                  {grouped[letter].map((term) => (
                    <li key={term.id} className={styles.row}>
                      <button
                        type="button"
                        className={styles.rowBtn}
                        onClick={() => open(term.id)}
                      >
                        <div className={styles.rowLeft}>
                          <span className={styles.rowTerm}>{term.term}</span>
                          <span className={styles.rowShort}>{term.short}</span>
                        </div>
                        <div className={styles.rowRight}>
                          <span className={styles.rowCat}>{term.category}</span>
                          <svg className={styles.rowArrow} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                            <path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </main>

      </div>
    </div>
  );
}
