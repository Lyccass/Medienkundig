export const VISIBLE_IDS = ["grundlagen", "scamming", "news", "socialmedia"] as const;
export type VisibleId = typeof VISIBLE_IDS[number];

export const STEPS: Record<VisibleId, string> = {
  grundlagen:  "01",
  scamming:    "02",
  news:        "03",
  socialmedia: "04",
};

export const DISPLAY_TITLES: Record<VisibleId, string> = {
  grundlagen:  "Digitale Grundlagen",
  scamming:    "Betrug erkennen",
  news:        "News & Quellen prüfen",
  socialmedia: "Social Media verstehen",
};

export const DESCRIPTIONS: Record<VisibleId, string> = {
  grundlagen:  "Verstehe die Basis: Logins, Links, Domains und sichere Passwörter.",
  scamming:    "Gefälschte Nachrichten, falsche Anrufe und unseriöse Shops erkennen.",
  news:        "Falschmeldungen erkennen und Informationen kritisch hinterfragen.",
  socialmedia: "Sicher und bewusst auf Facebook, WhatsApp & Co. unterwegs sein.",
};

export const LEARNING_GOALS: Record<VisibleId, string[]> = {
  grundlagen: [
    "Was Domains, Links und Logins bedeuten",
    "Wie du echte von gefälschten Webseiten unterscheidest",
    "Wie du deine Daten im Alltag schützt",
  ],
  scamming: [
    "Typische Tricks von Betrügern erkennen",
    "Gefälschte E-Mails, SMS und Online-Shops prüfen",
    "Wie du im Verdachtsfall richtig reagierst",
  ],
  news: [
    "Quellen gezielt prüfen und einschätzen",
    "Falschmeldungen und Gerüchte erkennen",
    "Informationen kritisch hinterfragen",
  ],
  socialmedia: [
    "Datenschutzeinstellungen richtig nutzen",
    "Risiken bei Gewinnspielen und Anfragen erkennen",
    "Sicher und bewusst Inhalte teilen",
  ],
};

export const PREVIEW_DESC: Record<VisibleId, string> = {
  grundlagen:
    "Verstehe die wichtigen Begriffe und Funktionen, die du im Alltag brauchst – Schritt für Schritt erklärt.",
  scamming:
    "Lerne, wie Betrüger vorgehen und wie du dich vor gefälschten Nachrichten, falschen Shops und Druck schützt.",
  news:
    "Entwickle einen kritischen Blick und lerne, Quellen zu prüfen, bevor du Informationen glaubst oder teilst.",
  socialmedia:
    "Erkenne, welche Daten du in sozialen Netzwerken teilst – und wie du deine Privatsphäre schützt.",
};

export interface AlltegItem {
  label: string;
  text: string;
  variant: "real" | "fake" | "neutral";
}

export interface AlltegEntry {
  heading: string;
  desc: string;
  items: AlltegItem[];
}

export const ALLTAG: Record<VisibleId, AlltegEntry> = {
  grundlagen: {
    heading: "Beispiel aus dem Alltag",
    desc: "Zwei Webseiten sehen ähnlich aus – aber nur eine ist echt.",
    items: [
      { label: "Echt", text: "https://medienkundig.de — Schloss und https:// sichtbar",        variant: "real" },
      { label: "Fake", text: "http://medienkundig-login24.net — kein Schloss, fremde Domain", variant: "fake" },
    ],
  },
  scamming: {
    heading: "Woran du Betrug erkennst",
    desc: "Diese E-Mail sieht offiziell aus – ist aber eine Falle. Typische Warnsignale:",
    items: [
      { label: "Absender",    text: "contact@kanairpw.com – keine seriöse Firmen-Domain",   variant: "fake" },
      { label: "Zeitdruck",   text: "»So schnell wie möglich« – bewusst erzeugte Panik",    variant: "fake" },
      { label: "KI-Absender", text: "»AI Agent« – kein echter Mensch hinter der Nachricht", variant: "fake" },
    ],
  },
  news: {
    heading: "So prüfst du eine Schlagzeile",
    desc: "Vor dem Teilen: Drei Fragen, die du dir immer stellen solltest.",
    items: [
      { label: "Quelle",      text: "Ist das eine bekannte, seriöse Seite?",                    variant: "neutral" },
      { label: "Verbreitung", text: "Berichten andere Medien dasselbe?",                         variant: "neutral" },
      { label: "Datum",       text: "Ist der Artikel aktuell oder aus dem Kontext gerissen?",   variant: "neutral" },
    ],
  },
  socialmedia: {
    heading: "Echtes Angebot oder Falle?",
    desc: "Auch auf bekannten Plattformen gibt es Fälschungen. Darauf achten:",
    items: [
      { label: "Preis",       text: "Deutlich unter Marktpreis? Oft zu gut, um wahr zu sein", variant: "fake" },
      { label: "Bewertungen", text: "Viele generisch-positive Rezensionen? Vorsicht",          variant: "fake" },
      { label: "Verkäufer",   text: "Privatperson, Händler oder offizielle Marke – prüfen!",  variant: "neutral" },
    ],
  },
};
