import type { ReactNode } from "react";
import { BookOpen, RefreshCw, User, FolderSearch, BookMarked, Flame, Zap } from "lucide-react";
import styles from "./AppShell.module.css";

export type Page = "learn" | "repeat" | "profile" | "faelle" | "glossar";

interface NavItemDef {
  id: Page;
  label: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItemDef[] = [
  { id: "learn",   label: "Lernen",      icon: <BookOpen     size={22} strokeWidth={1.8} /> },
  { id: "faelle",  label: "Fälle",       icon: <FolderSearch size={22} strokeWidth={1.8} /> },
  { id: "repeat",  label: "Wiederholen", icon: <RefreshCw    size={22} strokeWidth={1.8} /> },
  { id: "glossar", label: "Glossar",     icon: <BookMarked   size={22} strokeWidth={1.8} /> },
  { id: "profile", label: "Profil",      icon: <User         size={22} strokeWidth={1.8} /> },
];

interface Props {
  activePage: Page;
  onNavigate: (page: Page) => void;
  xp: number;
  streak: number;
  children: ReactNode;
}

export function AppShell({ activePage, onNavigate, xp, streak, children }: Props) {
  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <nav className={styles.sidebar} aria-label="App-Navigation">
        <div className={styles.sidebarTop}>
          <a href="http://medienkundig.local" className={styles.logo} aria-label="Startseite">
            <img src="/logo.png" alt="medienkundig" className={styles.logoImg} />
          </a>

          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`${styles.navItem} ${activePage === item.id ? styles.navItemActive : ""}`}
                  onClick={() => onNavigate(item.id)}
                  aria-current={activePage === item.id ? "page" : undefined}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.sidebarBottom}>
          <div className={styles.statPill}>
            <span title="Tage-Serie" className={styles.statItem}><Flame size={13} strokeWidth={2} /> {streak}</span>
            <span className={styles.statDivider} />
            <span title="XP" className={styles.statItem}><Zap size={13} strokeWidth={2} /> {xp}</span>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className={styles.main}>{children}</main>

      {/* Bottom nav mobile */}
      <nav className={styles.bottomNav} aria-label="Mobile Navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.bottomNavItem} ${activePage === item.id ? styles.bottomNavItemActive : ""}`}
            onClick={() => onNavigate(item.id)}
            aria-current={activePage === item.id ? "page" : undefined}
          >
            <span className={styles.bottomNavIcon}>{item.icon}</span>
            <span className={styles.bottomNavLabel}>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
