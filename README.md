# medienkundig

**medienkundig** ist eine interaktive Lernplattform zur Förderung digitaler Medienkompetenz – entwickelt im Rahmen einer Bachelorarbeit.

Die Plattform richtet sich an sogenannte *Digital Immigrants*: Menschen ab 50, die im Alltag zunehmend mit digitalen Medien in Berührung kommen, aber bisher wenig formale Berührungspunkte damit hatten. Ziel ist es, grundlegende Konzepte wie sichere Passwörter, das Erkennen von Betrug oder den kritischen Umgang mit Online-Nachrichten niedrigschwellig und verständlich zu vermitteln – ohne Fachjargon, ohne Überforderung.

---

## Was die Plattform bietet

Die App ist in vier Themenbereiche gegliedert:

- **Digitale Grundlagen** – Was sind Links, Domains und Logins? Wie erkenne ich eine echte Webseite?
- **Betrug erkennen** – Phishing, Fake-Shops und gefälschte Nachrichten entlarven
- **News & Quellen prüfen** – Falschmeldungen erkennen, Quellen kritisch hinterfragen
- **Social Media verstehen** – Datenschutz, Privatsphäre und bewusstes Teilen in sozialen Netzwerken

Jedes Thema enthält kurze Lerneinheiten mit Aufgaben in verschiedenen Formaten (Multiple Choice, Szenarien, Memory, Lückentexte). Fortschritt wird lokal gespeichert, ein Glossar erklärt wichtige Begriffe, und ein Wiederholungsmodus hilft dabei, Gelerntes zu festigen.

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
├── docker-compose.yml
└── README.md
```

| Bereich | Technologie |
|---------|-------------|
| Landingpage | Astro 4 |
| Lern-App | React 18 + Vite 5 |
| Sprache | TypeScript |
| Pakete | pnpm Workspaces |
| Proxy | Caddy 2 |
| Container | Docker Compose |
| Schrift | Ubuntu Sans Variable |

---

## Lokal starten

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

---

## Design-Tokens

Alle visuellen Grundeinstellungen sind zentral definiert:

```
packages/theme/src/index.css
```

Änderungen dort gelten automatisch für Landingpage und App.

---

*Bachelorarbeit – Luka Sandvoß und Jacquline Lehmann, 2025/2026*
