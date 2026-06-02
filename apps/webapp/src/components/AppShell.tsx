import styles from "./AppShell.module.css";

function Logo() {
  return (
    <a href="http://medienkundig.local" className={styles.logo} aria-label="Zurück zur Startseite">
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect width="28" height="28" rx="8" fill="var(--color-primary)"/>
        <path d="M14 5L21 9.5V18.5L14 23L7 18.5V9.5L14 5Z" fill="white" fillOpacity="0.25"/>
        <path d="M14 8L19 11V17L14 20L9 17V11L14 8Z" fill="white"/>
      </svg>
      <span>medienkundig</span>
    </a>
  );
}

function NavItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <a href="#" className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}>
      {label}
    </a>
  );
}

export function AppShell() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Logo />
        <nav className={styles.nav} aria-label="App-Navigation">
          <NavItem label="Profil" active />
          <NavItem label="Lernpfade" />
          <NavItem label="Erfolge" />
          <NavItem label="Weiteres" />
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardIcon} aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="var(--color-primary-soft)"/>
              <path d="M18 7L27 12V24L18 29L9 24V12L18 7Z" fill="none" stroke="var(--color-primary)" strokeWidth="2"/>
              <polyline points="13,18 17,22 23,14" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className={styles.title}>medienkundig Webapp</h1>
          <p className={styles.description}>
            Hier entsteht Ihre persönliche Lernumgebung. Lernpfade, Übungen,
            Fortschritt und mehr – alles auf einem Blick.
          </p>

          <div className={styles.statusBadge}>In Entwicklung</div>

          <a href="http://medienkundig.local" className={styles.backLink}>
            ← Zurück zur Startseite
          </a>
        </div>
      </main>
    </div>
  );
}
