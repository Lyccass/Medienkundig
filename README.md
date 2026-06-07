# medienkundig

**medienkundig** ist eine interaktive Lernplattform zur Förderung digitaler Medienkompetenz – entwickelt im Rahmen einer Bachelorarbeit.

Die Plattform richtet sich an *Digital Immigrants*: Menschen ab 50, die im Alltag zunehmend mit digitalen Medien in Berührung kommen, aber bisher wenig formale Berührungspunkte damit hatten. Ziel ist es, grundlegende Konzepte wie sichere Passwörter, das Erkennen von Betrug oder den kritischen Umgang mit Online-Nachrichten niedrigschwellig und verständlich zu vermitteln – ohne Fachjargon, ohne Überforderung.

---

## Was die Plattform bietet

Die App ist in vier Themenbereiche gegliedert:

- **Digitale Grundlagen** – Was sind Links, Domains und Logins? Wie erkenne ich eine echte Webseite?
- **Betrug erkennen** – Phishing, Fake-Shops und gefälschte Nachrichten entlarven
- **News & Quellen prüfen** – Falschmeldungen erkennen, Quellen kritisch hinterfragen
- **Social Media verstehen** – Datenschutz, Privatsphäre und bewusstes Teilen in sozialen Netzwerken

### Einstufung

Beim ersten Besuch durchläuft man eine kurze Einstufung (20 Fragen). Danach bekommt man ein Level (Einsteiger / Fortgeschritten / Sicher) und wird direkt zum passenden Themenbereich weitergeleitet – kein Raten, wo man anfangen soll.

### Aufgabenformate

Jede Lerneinheit enthält Aufgaben in verschiedenen Formaten, je nach Lernziel:

- Multiple Choice
- URL-Trainer (echte vs. gefälschte Domains einschätzen)
- Szenarien (Schritt-für-Schritt-Entscheidungen)
- Warnzeichen erkennen
- Memory
- Lückentext
- Bild- und Audio-Auswahl

### Fortschritt & Konto

Fortschritt wird zuerst lokal gespeichert – ohne Login, ohne Konto. Wer sich registriert, bekommt einen Sync mit der Cloud, sodass der Fortschritt auf mehreren Geräten erhalten bleibt. XP und eine Tages-Serie motivieren dabei, regelmäßig zu üben.

### Glossar

Ein eingebautes Glossar erklärt wichtige Begriffe direkt im Kontext – Begriffe in Aufgaben und Feedbacks sind verlinkt und öffnen eine Erklärung ohne die Übung zu unterbrechen.

---

## Technischer Aufbau

Das Projekt ist als pnpm-Monorepo organisiert:

```
medienkundig/
├── apps/
│   ├── landing/     # Öffentliche Landingpage (Astro)
│   └── webapp/      # Lern-App (React + Vite)
├── packages/
│   ├── theme/       # Geteilte CSS-Design-Tokens
│   └── ui/          # Geteilte UI-Komponenten
├── supabase/        # Schema, Migrations, RLS-Policies, RPCs
├── docker-compose.yml
└── README.md
```

| Bereich | Technologie |
|---------|-------------|
| Landingpage | Astro 4 |
| Lern-App | React 18 + Vite 5 |
| Sprache | TypeScript |
| Pakete | pnpm Workspaces |
| Backend | Supabase (Postgres + Auth) |
| Proxy | Caddy 2 |
| Container | Docker Compose |
| Schrift | Ubuntu Sans Variable |

### Backend & Datenspeicherung

Fortschritt wird primär in `localStorage` gehalten – die App funktioniert also auch komplett ohne Konto. Mit einem registrierten Konto wird der Fortschritt über Supabase in die Cloud synchronisiert.

Nutzer können die App anonym starten. Beim Registrieren wird der lokale Fortschritt automatisch ins neue Konto übertragen. Die Vergabe von XP und das Streak-Tracking laufen über serverseitige Postgres-Funktionen, damit nichts manipuliert werden kann.

Mehr Details dazu in [`supabase/README.md`](supabase/README.md).

---

## Lokal starten

### Umgebungsvariablen

Die App braucht eine Supabase-Instanz. Lege eine `.env.local` Datei in `apps/webapp/` an:

```env
VITE_SUPABASE_URL=https://dein-projekt.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=dein-anon-key
```

### Mit Docker

```bash
# /etc/hosts einmalig ergänzen:
# 127.0.0.1 medienkundig.local
# 127.0.0.1 app.medienkundig.local

docker compose up
```

| URL | Inhalt |
|-----|--------|
| http://medienkundig.local | Landingpage |
| http://app.medienkundig.local | Lern-App |

### Ohne Docker (pnpm)

```bash
pnpm install
pnpm dev
```

| URL | Inhalt |
|-----|--------|
| http://localhost:4321 | Landingpage |
| http://localhost:5173 | Lern-App |

### Supabase-Einstellungen

Im Supabase-Dashboard müssen folgende Einstellungen aktiv sein:

- E-Mail-Authentifizierung aktiviert
- E-Mail-Bestätigung eingeschaltet
- Anonymous Sign-ins aktiviert (damit Fortschritt vor der Registrierung getrackt wird)

Migration einspielen:

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
```

---

## Design-Tokens

Alle visuellen Grundeinstellungen sind zentral definiert:

```
packages/theme/src/index.css
```

Änderungen dort gelten automatisch für Landingpage und App.

---

*Bachelorarbeit – Luka Sandvoß und Jacquline Lehmann, 2025/2026*
