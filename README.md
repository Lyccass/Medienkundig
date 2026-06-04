# medienkundig

Monorepo für das medienkundig-Projekt – eine Plattform zur Förderung von Medienkompetenz im digitalen Alltag.

---

## Projektstruktur

```
medienkundig/
├── apps/
│   ├── landing/          # SEO-Landingpage (Astro)
│   └── webapp/           # Web-App-Shell (React + Vite)
├── packages/
│   ├── theme/            # Geteilte CSS-Design-Tokens
│   └── ui/               # Geteilte UI-Komponenten (ausbaubar)
├── docker/
│   └── Caddyfile         # Reverse-Proxy-Konfiguration
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

## Voraussetzungen

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (für Docker-basierte Entwicklung)
- **oder** [Node.js 20+](https://nodejs.org/) und [pnpm](https://pnpm.io/) für lokale Entwicklung ohne Docker

---

## Lokale Entwicklung mit Docker

### 1. `/etc/hosts` einrichten

Fügen Sie folgende Zeilen zur Datei `/etc/hosts` hinzu (macOS/Linux: `/etc/hosts`, Windows: `C:\Windows\System32\drivers\etc\hosts`):

```
127.0.0.1 medienkundig.local
127.0.0.1 app.medienkundig.local
```

### 2. Projekt starten

```bash
docker compose up
```

Beim ersten Start werden alle Abhängigkeiten automatisch installiert. Das dauert einige Minuten.

### 3. URLs

| URL | Inhalt |
|-----|--------|
| http://medienkundig.local | Landingpage |
| http://app.medienkundig.local | Web-App |

> **Hinweis:** HTTPS ist lokal deaktiviert. Caddy läuft im HTTP-only-Modus für `.local`-Domains.

---

## Lokale Entwicklung ohne Docker (mit pnpm)

```bash
# Abhängigkeiten installieren
pnpm install

# Alle Apps gleichzeitig starten
pnpm dev
```

Direkter Zugriff ohne `/etc/hosts`-Einträge:

| URL | Inhalt |
|-----|--------|
| http://localhost:4321 | Landingpage |
| http://localhost:5173 | Web-App |

---

## Design-Tokens anpassen

Alle Design-Tokens sind zentral in einer Datei definiert:

```
packages/theme/src/index.css
```

Wichtige Tokens:

| Token | Beschreibung |
|-------|-------------|
| `--color-primary` | Hauptmarkenfarbe (Lila) |
| `--color-text` | Haupttextfarbe |
| `--color-bg` | Seitenhintergrund |
| `--font-sans` | Schriftart |
| `--radius-md` | Standardabrundung |

Änderungen wirken sich sofort auf Landing und Webapp aus.

---

## Assets hinzufügen

### Maskottchen ersetzen

```
apps/landing/public/assets/mascot-placeholder.svg
```

Ersetzen Sie diese Datei mit dem echten Maskottchen (SVG empfohlen, PNG möglich). Die Referenz in `Hero.astro` bleibt gleich.

### Video einbinden

Das Video-Platzhalterbild liegt hier:

```
apps/landing/public/assets/video-poster-placeholder.svg
```

**Option A – Lokale Videodatei:**
Legen Sie die Videodatei unter `apps/landing/public/assets/intro.mp4` ab und übergeben Sie den Pfad als Prop:

```astro
<VideoIntro videoSrc="/assets/intro.mp4" posterSrc="/assets/video-poster.jpg" />
```

**Option B – YouTube/Vimeo-Embed:**
Übergeben Sie die Embed-URL als Prop:

```astro
<VideoIntro embedUrl="https://www.youtube-nocookie.com/embed/VIDEO_ID" />
```

---

## Weiterbauen – nächste Schritte

Die Web-App (`apps/webapp`) ist aktuell ein leerer Shell. Mögliche nächste Schritte:

1. **Routing** – React Router oder TanStack Router einrichten
2. **Auth** – Einfache Authentifizierung (z.B. Supabase, Clerk)
3. **Lernpfade** – Inhaltsstruktur und Quiz-Logik implementieren
4. **Fortschritt** – User-State verwalten (z.B. Zustand, Jotai)
5. **Glossar/Wiki** – Content-Management via Astro Content Collections erweitern
6. **Selbsttest** – Interaktiver Einstiegstest auf der Landingpage

---

## Technologie-Stack

| Bereich | Technologie |
|---------|-------------|
| Landingpage | [Astro 4](https://astro.build/) |
| Web-App | [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) |
| Sprache | TypeScript |
| Pakete | [pnpm Workspaces](https://pnpm.io/workspaces) |
| Proxy | [Caddy 2](https://caddyserver.com/) |
| Container | [Docker Compose](https://docs.docker.com/compose/) |
| Schrift | Ubuntu Sans |

---

© 2025 medienkundig
