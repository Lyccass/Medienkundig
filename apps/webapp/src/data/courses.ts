export interface MCQData {
  type: "multipleChoice";
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
  glossarLinks?: string[];
}

export interface BildAuswahlData {
  type: "bildAuswahl";
  question: string;
  imageDescription: string;
  options: { label: string; hint?: string }[];
  correct: number;
  glossarLinks?: string[];
}

export interface AudioAuswahlData {
  type: "audioAuswahl";
  question: string;
  audioLabel: string;
  transcript: string;
  options: string[];
  correct: number;
  explanation?: string;
  glossarLinks?: string[];
}

export interface MemoryData {
  type: "memory";
  question: string;
  pairs: { term: string; definition: string }[];
  explanation?: string;
  glossarLinks?: string[];
}

export interface VervollstaendigenData {
  type: "vervollstaendigen";
  question: string;
  before: string;
  after: string;
  options: string[];
  correct: number;
  explanation?: string;
  glossarLinks?: string[];
}

export type ScenarioType = "email" | "sms" | "web" | "social" | "chat";

export interface FallScenario {
  type: ScenarioType;
  from?: string;
  subject?: string;
  sender?: string;
  url?: string;
  content: string;
}

export interface FallData {
  type: "fall";
  question: string;
  scenario: FallScenario;
  options: string[];
  correct: number;
  explanation?: string;
  glossarLinks?: string[];
}

export type ExerciseData =
  | MCQData
  | BildAuswahlData
  | AudioAuswahlData
  | MemoryData
  | VervollstaendigenData
  | FallData;

export interface Exercise {
  id: string;
  data: ExerciseData;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
}

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  colorSoft: string;
  units: Unit[];
}

export const categories: Category[] = [
  {
    id: "scamming",
    title: "Scamming",
    subtitle: "Online- & Offline-Betrug",
    color: "#d97706",
    colorSoft: "#fef3e6",
    units: [
      {
        id: "scam-unit1",
        title: "Betrug erkennen",
        description: "Lerne die häufigsten Betrugsmaschen im Internet und am Telefon zu erkennen.",
        exercises: [
          {
            id: "scam-1",
            data: {
              type: "multipleChoice",
              question: "Was ist Phishing?",
              options: [
                "Eine Angelmethode im Internet",
                "Täuschungsversuche per E-Mail oder Nachricht, um Daten zu stehlen",
                "Ein Sicherheitsprogramm für E-Mails",
                "Eine Art soziales Netzwerk",
              ],
              correct: 1,
              explanation:
                "Phishing bezeichnet gefälschte Nachrichten, die Sie zur Preisgabe sensibler Daten verleiten sollen.",
              glossarLinks: ["phishing"],
            },
          },
          {
            id: "scam-2",
            data: {
              type: "fall",
              question: "Was ist das wichtigste Warnsignal in dieser E-Mail?",
              scenario: {
                type: "email",
                from: "sparkasse-sicherheit@konto-verify.net",
                subject: "⚠️ Ihr Konto wurde gesperrt – Sofortmaßnahme erforderlich",
                content:
                  "Sehr geehrter Kunde,\n\nwir haben ungewöhnliche Aktivitäten auf Ihrem Konto festgestellt. Um eine dauerhafte Sperrung zu verhindern, bestätigen Sie Ihre Daten innerhalb von 24 Stunden.\n\nJetzt bestätigen: bit.ly/sparkasse-verify\n\nMit freundlichen Grüßen\nIhr Sicherheitsteam",
              },
              options: [
                "Die E-Mail hat einen freundlichen Ton",
                "Die Domain »konto-verify.net« gehört nicht zur Sparkasse",
                "Die E-Mail enthält einen Link",
                "Die E-Mail erwähnt ungewöhnliche Aktivitäten",
              ],
              correct: 1,
              explanation:
                "Die echte Sparkassen-Domain lautet sparkasse.de. »konto-verify.net« ist eine Fälschung – das klassische Merkmal von Phishing.",
              glossarLinks: ["phishing", "domain-spoofing", "domain"],
            },
          },
          {
            id: "scam-3",
            data: {
              type: "vervollstaendigen",
              question: "Ergänzen Sie den Satz:",
              before: "Beim ",
              after:
                " versuchen Kriminelle, durch gefälschte E-Mails an Ihre Passwörter zu gelangen.",
              options: ["Phishing", "Surfen", "Chatten", "Lesen"],
              correct: 0,
              explanation:
                "Phishing ist eine der häufigsten Angriffsmethoden im Internet – erkennbar an fremden Domains, gefälschten Absendern und künstlicher Dringlichkeit.",
              glossarLinks: ["phishing"],
            },
          },
          {
            id: "scam-4",
            data: {
              type: "memory",
              question: "Ordnen Sie die Begriffe den richtigen Erklärungen zu:",
              pairs: [
                { term: "Phishing", definition: "Gefälschte E-Mails zum Datendiebstahl" },
                { term: "Spam", definition: "Unerwünschte Massen­nachrichten" },
                { term: "Social Engineering", definition: "Psychologische Manipulation" },
                { term: "Malware", definition: "Schädliche Software" },
              ],
              explanation:
                "Diese vier Begriffe beschreiben die häufigsten digitalen Bedrohungsformen. Wer sie kennt, erkennt Angriffe früher und reagiert sicherer.",
              glossarLinks: ["phishing", "spam", "social-engineering", "malware"],
            },
          },
          {
            id: "scam-5",
            data: {
              type: "audioAuswahl",
              question: "Hören Sie die Nachricht. Um welche Art von Betrug handelt es sich?",
              audioLabel: "Telefonanruf – 00:23",
              transcript:
                "»Guten Tag, hier spricht die Sicherheitsabteilung Ihrer Bank. Wir haben verdächtige Aktivitäten auf Ihrem Konto festgestellt. Bitte teilen Sie uns sofort Ihre PIN mit, damit wir Ihr Konto schützen können.«",
              options: [
                "Ein normaler Sicherheitshinweis der Bank",
                "Vishing – Telefonbetrug durch Identitätsvortäuschung",
                "Eine automatische Spam-Nachricht",
                "Ein seriöser Kundendienst-Anruf",
              ],
              correct: 1,
              explanation:
                "Banken und Behörden fragen am Telefon niemals nach PIN oder Passwort. Legen Sie bei solchen Anrufen sofort auf und wählen Sie die offizielle Nummer selbst.",
              glossarLinks: ["social-engineering", "phishing"],
            },
          },
        ],
      },
    ],
  },
  {
    id: "news",
    title: "News & Quellen",
    subtitle: "Informationen kritisch bewerten",
    color: "#2563eb",
    colorSoft: "#eff6ff",
    units: [
      {
        id: "news-unit1",
        title: "Quellen prüfen",
        description:
          "Wie erkenne ich verlässliche Nachrichten, seriöse Quellen und Falschinformationen?",
        exercises: [
          {
            id: "news-1",
            data: {
              type: "multipleChoice",
              question: "Was ist ein verlässliches Merkmal einer seriösen Nachrichtenquelle?",
              options: [
                "Viele Ausrufezeichen und emotionale Sprache",
                "Klare Quellenangaben und erkennbarer Autor",
                "Ein reißerischer Titel mit vielen Großbuchstaben",
                "Fehlende Datumsangabe",
              ],
              correct: 1,
              explanation:
                "Seriöse Quellen nennen Autoren, Daten und belegen Aussagen mit Verweisen.",
              glossarLinks: ["fake-news"],
            },
          },
          {
            id: "news-2",
            data: {
              type: "fall",
              question: "Welche Merkmale zeigen, dass dieser Post nicht vertrauenswürdig ist?",
              scenario: {
                type: "social",
                sender: "Wahrheit_enthüllt",
                url: "gesundheit-fakten24.net",
                content:
                  "🚨🚨 SCHOCK!! Regierung plant geheimen Chip in Impfstoffen!! Whistleblower enthüllt ALLES was sie verbergen!!! Teile das JETZT bevor es gelöscht wird!!! Kein Impressum, kein Autor, kein Datum.",
              },
              options: [
                "Reißerische Sprache, fehlende Quellenangabe und unbekannte Domain",
                "Der Post wurde sehr oft geteilt",
                "Der Absender hat einen deutschen Namen",
                "Whistleblower-Informationen sind immer glaubwürdig",
              ],
              correct: 0,
              explanation:
                "Fehlende Quellenangaben, übertriebene Sprache (!!!), Aufforderung zum Teilen und unbekannte Domains sind klassische Merkmale von Fake News.",
              glossarLinks: ["fake-news", "clickbait"],
            },
          },
          {
            id: "news-3",
            data: {
              type: "vervollstaendigen",
              question: "Ergänzen Sie den Satz:",
              before:
                "Absichtlich verbreitete Falschinformationen, die wie echte Nachrichten wirken, nennt man ",
              after: ".",
              options: ["Fake News", "Wetterberichte", "Produktbewertungen", "Suchbegriffe"],
              correct: 0,
              explanation:
                "Fake News sind gezielt verbreitete Falschinformationen. Prüfen Sie vor dem Teilen immer: Wer hat das geschrieben, wann, und mit welcher Quellenangabe?",
              glossarLinks: ["fake-news"],
            },
          },
          {
            id: "news-4",
            data: {
              type: "memory",
              question: "Ordnen Sie die Begriffe den richtigen Erklärungen zu:",
              pairs: [
                { term: "Clickbait", definition: "Reißerische Schlagzeilen für mehr Klicks" },
                { term: "Filterblase", definition: "Algorithmus zeigt nur meinungsbestätigende Inhalte" },
                { term: "Fake News", definition: "Absichtlich verbreitete Falschinformation" },
                { term: "Deepfake", definition: "KI-generierte, täuschend echte Medien" },
              ],
              explanation:
                "Diese Begriffe beschreiben, wie digitale Medien unsere Wahrnehmung verzerren können – bewusstes Erkennen ist der erste Schritt zur Medienkompetenz.",
              glossarLinks: ["clickbait", "filterbubble", "fake-news", "deepfake"],
            },
          },
          {
            id: "news-5",
            data: {
              type: "multipleChoice",
              question: "Was sollten Sie tun, bevor Sie eine Nachricht teilen?",
              options: [
                "Sofort teilen, damit Freunde es auch erfahren",
                "Nur auf das Titelbild schauen",
                "Quelle prüfen und Inhalt mit anderen Quellen abgleichen",
                "Den Titel ausreichend finden",
              ],
              correct: 2,
              explanation:
                "Vor dem Teilen: Quelle recherchieren und mehrere unabhängige Quellen vergleichen.",
              glossarLinks: ["fake-news", "clickbait"],
            },
          },
        ],
      },
    ],
  },
  {
    id: "socialmedia",
    title: "Social Media",
    subtitle: "Sicher in sozialen Netzwerken",
    color: "#9333ea",
    colorSoft: "#faf5ff",
    units: [
      {
        id: "sm-unit1",
        title: "Sicher auf Social Media",
        description:
          "Erkenne Manipulation, Deepfakes und problematische Inhalte in sozialen Netzwerken.",
        exercises: [
          {
            id: "sm-1",
            data: {
              type: "multipleChoice",
              question: "Was ist eine Filterblase?",
              options: [
                "Ein Datenschutzprogramm für soziale Netzwerke",
                "Ein Filter für unerwünschte Nachrichten",
                "Wenn Algorithmen nur Inhalte zeigen, die zur eigenen Meinung passen",
                "Eine Blockierfunktion in sozialen Netzwerken",
              ],
              correct: 2,
              explanation:
                "Algorithmen verstärken die eigene Perspektive, bis andere Sichtweisen kaum noch sichtbar sind.",
              glossarLinks: ["filterbubble"],
            },
          },
          {
            id: "sm-2",
            data: {
              type: "fall",
              question: "Was stimmt mit dieser Nachricht nicht?",
              scenario: {
                type: "sms",
                sender: "+49 176 94837261",
                content:
                  "Ihr DHL-Paket (Nr. 1Z999AA10123456784) konnte nicht zugestellt werden. Eine Nachnahmegebühr von 1,99 € ist fällig. Bezahlen Sie hier: dhl-lieferung-neu.net/zahlen",
              },
              options: [
                "DHL verlangt manchmal Gebühren per SMS",
                "Die Domain »dhl-lieferung-neu.net« ist nicht die offizielle DHL-Website",
                "Die Sendungsnummer sieht verdächtig aus",
                "Der Betrag von 1,99 € ist zu hoch",
              ],
              correct: 1,
              explanation:
                "Die offizielle DHL-Website lautet dhl.de. »dhl-lieferung-neu.net« ist eine Fälschung. Solche SMS-Betrugsversuche nennt man »Smishing« (SMS + Phishing).",
              glossarLinks: ["phishing", "domain-spoofing"],
            },
          },
          {
            id: "sm-3",
            data: {
              type: "vervollstaendigen",
              question: "Ergänzen Sie den Satz:",
              before: "Ein ",
              after:
                " ist ein KI-generiertes Video, das eine reale Person etwas sagen lässt, was sie nie gesagt hat.",
              options: ["Deepfake", "Screenshot", "Selfie", "Livestream"],
              correct: 0,
              explanation:
                "Deepfakes werden immer überzeugender. Im Zweifel immer die Originalquelle suchen – auf dem offiziellen Kanal der Person oder Institution.",
              glossarLinks: ["deepfake"],
            },
          },
          {
            id: "sm-4",
            data: {
              type: "memory",
              question: "Ordnen Sie die Begriffe den richtigen Erklärungen zu:",
              pairs: [
                { term: "Deepfake", definition: "KI-gefälschtes, täuschend echtes Video" },
                { term: "Filterblase", definition: "Eingeschränkte Sichtweise durch Algorithmen" },
                { term: "Social Engineering", definition: "Manipulation durch Ausnutzen von Vertrauen" },
                { term: "Clickbait", definition: "Klickköder mit übertriebenen Versprechen" },
              ],
              explanation:
                "Diese Begriffe zeigen, wie Social-Media-Plattformen unsere Wahrnehmung und unser Verhalten gezielt beeinflussen können.",
              glossarLinks: ["deepfake", "filterbubble", "social-engineering", "clickbait"],
            },
          },
          {
            id: "sm-5",
            data: {
              type: "multipleChoice",
              question:
                "Sie sehen ein Social-Media-Video, das Ihnen unglaubwürdig erscheint. Was tun Sie?",
              options: [
                "Sofort teilen, damit alle gewarnt werden",
                "Nur in einer privaten Gruppe teilen",
                "Quelle und Originalvideo suchen, bei Verdacht melden",
                "Kommentar hinterlassen und weiterscrollen",
              ],
              correct: 2,
              explanation:
                "Vor dem Weiterleiten immer Quelle prüfen – und verdächtige Inhalte der Plattform melden.",
              glossarLinks: ["deepfake", "fake-news"],
            },
          },
        ],
      },
    ],
  },
  {
    id: "general",
    title: "Allgemeines",
    subtitle: "Passwörter & Datenschutz",
    color: "#16a34a",
    colorSoft: "#f0fdf4",
    units: [
      {
        id: "gen-unit1",
        title: "Passwörter & Sicherheit",
        description:
          "Lerne, wie du deine Konten und persönlichen Daten im Internet effektiv schützt.",
        exercises: [
          {
            id: "gen-1",
            data: {
              type: "multipleChoice",
              question: "Was zeichnet ein sicheres Passwort aus?",
              options: [
                "Ihr Geburtsdatum – leicht zu merken",
                "Der Name Ihres Haustieres",
                "Mindestens 12 Zeichen: Buchstaben, Zahlen und Sonderzeichen gemischt",
                "»passwort123« – einfach und bekannt",
              ],
              correct: 2,
              explanation:
                "Lange, zufällige Kombinationen sind kaum zu erraten. Ein Passwort-Manager hilft beim Merken.",
              glossarLinks: ["zwei-faktor"],
            },
          },
          {
            id: "gen-2",
            data: {
              type: "fall",
              question: "Warum sollten Sie auf dieser Seite KEINE Daten eingeben?",
              scenario: {
                type: "web",
                url: "https://paypa1.com/de/login",
                content:
                  "Die Seite sieht aus wie die echte PayPal-Loginseite: PayPal-Logo, blaues Design, Felder für E-Mail und Passwort. Der Unterschied ist kaum sichtbar.",
              },
              options: [
                "HTTPS-Seiten sind immer sicher",
                "Die URL enthält eine »1« (Ziffer) statt dem Buchstaben »l« in »paypal«",
                "PayPal-Login-Seiten sind generell gefährlich",
                "Das Design entspricht nicht dem Original",
              ],
              correct: 1,
              explanation:
                "»paypa1.com« mit einer Ziffer 1 statt dem Buchstaben l ist Domain-Spoofing. HTTPS allein garantiert keine Echtheit – die Domain muss immer genau geprüft werden.",
              glossarLinks: ["domain-spoofing", "https", "domain", "phishing"],
            },
          },
          {
            id: "gen-3",
            data: {
              type: "vervollstaendigen",
              question: "Ergänzen Sie den Satz:",
              before: "Die ",
              after:
                " fügt beim Login einen zweiten Sicherheitsschritt hinzu – z. B. einen Code per SMS.",
              options: [
                "Zwei-Faktor-Authentifizierung",
                "Passworterinnerung",
                "Virensoftware",
                "Datensicherung",
              ],
              correct: 0,
              explanation:
                "2FA ist eine der effektivsten Schutzmaßnahmen: Selbst wenn jemand Ihr Passwort stiehlt, bleibt der Zugang ohne den zweiten Faktor gesperrt.",
              glossarLinks: ["zwei-faktor"],
            },
          },
          {
            id: "gen-4",
            data: {
              type: "memory",
              question: "Ordnen Sie die Begriffe den richtigen Erklärungen zu:",
              pairs: [
                { term: "HTTPS", definition: "Verschlüsselte Webverbindung" },
                { term: "2FA", definition: "Zweiter Sicherheitsschritt beim Login" },
                { term: "VPN", definition: "Verschlüsselt die Internetverbindung" },
                { term: "Cookie", definition: "Speichert Nutzerdaten im Browser" },
              ],
              explanation:
                "Diese Technologien schützen Ihre Verbindungen und Daten im Alltag. HTTPS und 2FA sollten bei jedem sensiblen Dienst aktiv sein.",
              glossarLinks: ["https", "zwei-faktor", "vpn", "cookie"],
            },
          },
          {
            id: "gen-5",
            data: {
              type: "audioAuswahl",
              question: "Was hätte den Kontozugriff am ehesten verhindert?",
              audioLabel: "Sicherheitsszenario – 00:18",
              transcript:
                "»Ihr E-Mail-Konto wurde von einem unbekannten Gerät in einem anderen Land aufgerufen. Das Passwort war korrekt eingegeben worden. Welche Maßnahme hätte dies am ehesten verhindert?«",
              options: [
                "Ein noch längerer Benutzername",
                "Zwei-Faktor-Authentifizierung aktivieren",
                "Mehr E-Mails regelmäßig löschen",
                "Ein einfacheres, leicht merkbares Passwort wählen",
              ],
              correct: 1,
              explanation:
                "Mit aktivierter 2FA bleibt ein Konto auch nach einem Passwort-Diebstahl geschützt, weil der Angreifer den zweiten Faktor (z. B. SMS-Code) nicht hat.",
              glossarLinks: ["zwei-faktor"],
            },
          },
        ],
      },
    ],
  },
];
