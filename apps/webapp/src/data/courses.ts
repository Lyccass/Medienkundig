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
  explanation?: string;
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
  variant?: "flip";
  question: string;
  pairs: { term: string; definition: string; info?: string }[];
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
  parts?: string[];
  correctAnswers?: string[];
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

export interface WarnzeichenZone {
  id: string;
  label: string;
  text: string;
  suspicious: boolean;
  explanation?: string;
}

export interface WarnzeichenData {
  type: "warnzeichen";
  question: string;
  scenarioType: ScenarioType;
  image?: {
    src: string;
    alt: string;
  };
  zones: WarnzeichenZone[];
  explanation?: string;
  glossarLinks?: string[];
}

export interface NextStepData {
  type: "nextStep";
  question: string;
  scenario: FallScenario;
  options: string[];
  correct: number;
  explanation?: string;
  glossarLinks?: string[];
}

export interface UrlTrainerOption {
  url: string;
  note?: string;
}

export interface UrlTrainerData {
  type: "urlTrainer";
  question: string;
  instruction?: string;
  options: UrlTrainerOption[];
  correct: number;
  explanation?: string;
  glossarLinks?: string[];
}

export interface LessonSection {
  heading: string;
  body?: string;
  bullets?: string[];
}

export interface LessonData {
  type: "lesson";
  title: string;
  kicker?: string;
  body: string;
  bullets?: string[];
  sections?: LessonSection[];
  buttonLabel?: string;
  mediaType?: "text" | "audio" | "video";
  glossarLinks?: string[];
}

export type ExerciseData =
  | LessonData
  | MCQData
  | BildAuswahlData
  | AudioAuswahlData
  | MemoryData
  | VervollstaendigenData
  | FallData
  | WarnzeichenData
  | NextStepData
  | UrlTrainerData;

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
  units: Unit[];
}

export const categories: Category[] = [
  {
    id: "grundlagen",
    title: "Digitale Grundlagen",
    subtitle: "Logins, Links & Datensicherheit",
    units: [
      {
        id: "gl-unit1",
        title: "Erste Schritte im Internet",
        description: "Lerne die wichtigsten Begriffe und Konzepte für einen sicheren Alltag im Internet.",
        exercises: [
          {
            id: "gl-1",
            data: {
              type: "multipleChoice",
              question: "Was ist eine Domain?",
              options: [
                "Ein Passwort für eine Webseite",
                "Die Adresse einer Webseite im Internet",
                "Ein Benutzerkonto",
                "Ein Sicherheitsprogramm",
              ],
              correct: 1,
              explanation: "Eine Domain ist die Adresse einer Webseite, zum Beispiel medienkundig.de.",
              glossarLinks: ["domain"],
            },
          },
          {
            id: "gl-2",
            data: {
              type: "urlTrainer",
              question: "Welche Adresse gehört wirklich zu medienkundig?",
              instruction: "Achte auf die eigentliche Domain. Zusatzwörter, fremde Endungen und lange Anhängsel sind Warnzeichen.",
              options: [
                {
                  url: "medienkundig.de",
                  note: "Das ist die kurze, echte Domain.",
                },
                {
                  url: "medienkundig-login24.net",
                  note: "Hier ist die eigentliche Domain »medienkundig-login24.net« – nicht medienkundig.de.",
                },
                {
                  url: "medienkundig.de.sicherheit-login.net",
                  note: "Die eigentliche Domain ist »sicherheit-login.net«. »medienkundig.de« steht nur davor.",
                },
                {
                  url: "medienkundig-kundenservice.de",
                  note: "Zusatzwörter können auf eine fremde Domain hinweisen.",
                },
              ],
              correct: 0,
              explanation: "Die echte Seite hat eine kurze, klare Domain ohne Zusatzwörter und nutzt HTTPS.",
              glossarLinks: ["domain", "https"],
            },
          },
          {
            id: "gl-3",
            data: {
              type: "multipleChoice",
              question: "Was bedeutet das Schloss-Symbol in der Browserzeile?",
              options: [
                "Die Seite gehört einer Bank",
                "Die Verbindung zur Seite ist verschlüsselt (HTTPS)",
                "Die Seite ist kostenlos",
                "Sie sind eingeloggt",
              ],
              correct: 1,
              explanation: "Das Schloss zeigt HTTPS an – Ihre Verbindung ist verschlüsselt und sicherer.",
              glossarLinks: ["https"],
            },
          },
          {
            id: "gl-4",
            data: {
              type: "multipleChoice",
              question: "Was ist ein sicheres Passwort?",
              options: [
                "Ihr Geburtstag",
                "Der Name Ihres Haustieres",
                "Eine zufällige Kombination aus Buchstaben, Zahlen und Sonderzeichen",
                "Das Wort »Passwort«",
              ],
              correct: 2,
              explanation: "Sichere Passwörter sind lang, zufällig und enthalten verschiedene Zeichentypen.",
              glossarLinks: ["passwort"],
            },
          },
          {
            id: "gl-5",
            data: {
              type: "multipleChoice",
              question: "Was ist ein Link?",
              options: [
                "Ein Benutzername",
                "Eine klickbare Verknüpfung zu einer anderen Seite",
                "Eine Art Dateivirus",
                "Ein spezielles Fenster im Browser",
              ],
              correct: 1,
              explanation: "Ein Link ist eine klickbare Verknüpfung, die Sie direkt zu einer anderen Seite führt.",
              glossarLinks: ["link"],
            },
          },
          {
            id: "gl-6",
            data: {
              type: "vervollstaendigen",
              question: "Füllen Sie die Lücken mit den passenden Begriffen.",
              before: "",
              after: "",
              parts: [
                "Eine ",
                " ist der Name einer Webseite. Ein ",
                " führt zu einer anderen Seite. ",
                " zeigt eine verschlüsselte Verbindung an.",
              ],
              correctAnswers: ["Domain", "Link", "HTTPS"],
              options: ["Link", "Passwort", "Domain", "HTTPS", "Cookie"],
              correct: 0,
              explanation:
                "Domain, Link und HTTPS sind Grundbegriffe für sicheres Bewegen im Internet.",
              glossarLinks: ["domain", "link", "https"],
            },
          },
          {
            id: "gl-7",
            data: {
              type: "memory",
              question: "Ordnen Sie die Begriffe den richtigen Erklärungen zu:",
              pairs: [
                { term: "Domain", definition: "Name einer Webseite" },
                { term: "Link", definition: "Klickbare Verbindung zu einer Seite" },
                { term: "HTTPS", definition: "Verschlüsselte Verbindung" },
                { term: "Cookie", definition: "Speichert Informationen im Browser" },
              ],
              explanation:
                "Diese vier Begriffe tauchen überall auf. Wer sie kennt, sieht auf einen Blick, ob eine Webseite vertrauenswürdig ist.",
              glossarLinks: ["domain", "https", "cookie"],
            },
          },
        ],
      },
    ],
  },
  {
    id: "scamming",
    title: "Betrug erkennen",
    subtitle: "Gefälschte Nachrichten & falsche Angebote",
    units: [
      {
        id: "scam-unit1",
        title: "Lektion 1: Vier häufige Maschen",
        description: "Lerne Phishing, Smishing, den Enkeltrick und den Schockanruf kennen – und erkenne sie, bevor sie dir schaden.",
        exercises: [
          {
            id: "scam-l1-intro",
            data: {
              type: "lesson",
              title: "Bist du fit gegen Betrug?",
              kicker: "Lektion 1 · Einstieg",
              body: "Ob am Telefon, per E-Mail oder an der Haustür – Betrugsversuche begegnen uns heute überall. Das Bundeskriminalamt zählte allein 2024 über 131.000 Cybercrime-Fälle in Deutschland – und erstmals kommen dabei KI-gestützte Methoden zum Einsatz. Wer einmal gelernt hat, worauf man achten muss, erkennt die meisten Maschen auf den ersten Blick.",
              mediaType: "text",
              glossarLinks: ["phishing", "ki"],
            },
          },
          {
            id: "scam-l1-phishing-exp",
            data: {
              type: "lesson",
              title: "Phishing – Die gefälschte Bank-E-Mail",
              kicker: "Fall 1 · Phishing",
              body: "Betrüger kopieren das Design echter Unternehmen täuschend genau – Logo, Schriftart, Farben. Der Link führt auf eine gefälschte Webseite, die genauso aussieht wie das echte Online-Banking. Wer dort seine Zugangsdaten eingibt, liefert sie direkt an die Täter.",
              sections: [
                {
                  heading: "Woran du es erkennst",
                  bullets: [
                    "Die Absenderadresse sieht merkwürdig aus – z.B. sparkasse@mail-service92.com statt sparkasse.de",
                    "Echte Banken fragen nie per E-Mail nach deinen Zugangsdaten",
                    "Die Sprache wirkt dringend und drohend – das ist Absicht",
                  ],
                },
                {
                  heading: "Was du tun sollst",
                  bullets: [
                    "Den Link nicht anklicken und die E-Mail löschen",
                    "Im Zweifel direkt bei deiner Bank anrufen – die Nummer selbst eintippen, nie aus der E-Mail kopieren",
                  ],
                },
              ],
              mediaType: "text",
              glossarLinks: ["phishing", "domain", "url"],
            },
          },
          {
            id: "scam-l1-phishing",
            data: {
              type: "warnzeichen",
              question: "Welche nummerierten Stellen sind Warnzeichen in dieser E-Mail?",
              scenarioType: "email",
              image: {
                src: "/warnzeichen-dpd-email.png",
                alt: "Screenshot einer angeblichen DPD-Zustellbenachrichtigung in einem E-Mail-Postfach.",
              },
              zones: [
                {
                  id: "subject",
                  label: "Betreff",
                  text: "Zustellbenachrichtigung für Sendung DPD_883221 / 5/19/2026",
                  suspicious: true,
                  explanation: "Der Betreff wirkt automatisch übersetzt und enthält ein ungewöhnliches Datum im US-Format.",
                },
                {
                  id: "sender",
                  label: "Absender",
                  text: "INFO <info@iwyiwy.co.jp>",
                  suspicious: true,
                  explanation: "Die Absender-Domain passt nicht zu DPD. Genau die Domain nach dem @ ist entscheidend.",
                },
                {
                  id: "logo",
                  label: "DPD-Logo",
                  text: "Logo und Gestaltung",
                  suspicious: false,
                  explanation: "Ein echtes Logo allein beweist keinen Betrug. Betrüger kopieren Logos sehr leicht.",
                },
                {
                  id: "date",
                  label: "Datum",
                  text: "5/19/2026 - 16:41:36",
                  suspicious: true,
                  explanation: "Das Datumsformat und die eingeblendete Markierung wirken untypisch für eine deutsche Paketmail.",
                },
                {
                  id: "button",
                  label: "Button",
                  text: "Zustellung neu planen",
                  suspicious: true,
                  explanation: "Der Button soll zum Klicken verleiten. Vor dem Klick wäre die echte URL zu prüfen.",
                },
              ],
              explanation:
                "Richtig sind 1, 2, 4 und 5: verdächtiger Betreff, fremde Absender-Domain, auffälliges Datum und ein klickbarer Zustell-Button. 3 allein ist kein Beweis, weil Logos leicht kopiert werden.",
              glossarLinks: ["phishing", "domain", "url"],
            },
          },
          {
            id: "scam-l1-smishing-exp",
            data: {
              type: "lesson",
              title: 'Smishing – Die Fake-SMS von „DHL"',
              kicker: "Fall 2 · Smishing",
              body: "Smishing bedeutet Phishing per SMS. Die Nachricht sieht aus wie eine echte Paketbenachrichtigung – mit Sendungsnummer, freundlichem Ton und einem Link. Wer klickt, landet auf einer gefälschten Seite oder lädt unbemerkt Schadsoftware auf sein Handy herunter.",
              sections: [
                {
                  heading: "Woran du es erkennst",
                  bullets: [
                    "Du erwartest gar kein Paket – oder die SMS kommt aus dem Nichts",
                    "Der Link sieht seltsam aus – z.B. dhl-zustellung.info statt dhl.de",
                    "Echte Paketdienste fragen nie per SMS nach Zahlungsdaten",
                  ],
                },
                {
                  heading: "Was du tun sollst",
                  bullets: [
                    "Nicht klicken und die SMS löschen",
                    "Falls du ein Paket erwartest: direkt auf der offiziellen Website des Paketdienstes nachsehen",
                  ],
                },
              ],
              mediaType: "text",
              glossarLinks: ["smishing", "phishing", "domain", "malware"],
            },
          },
          {
            id: "scam-l1-smishing",
            data: {
              type: "nextStep",
              question: "Was solltest du mit dieser SMS tun?",
              scenario: {
                type: "sms",
                sender: "DHL",
                content:
                  "Ihr Paket konnte heute nicht zugestellt werden. Bitte bestätigen Sie Ihre Adresse innerhalb von 24h, sonst wird es zurückgeschickt:\ndhl-zustellung.info/re-deliver",
              },
              options: [
                "Den Link anklicken, um das Paket zu erhalten",
                "Die SMS ignorieren und löschen",
                "Die SMS an die Familie weiterleiten, damit sie aufpassen",
                "Auf den Link klicken, aber keine persönlichen Daten eingeben",
              ],
              correct: 1,
              explanation:
                "Smishing-SMS enthalten Links zu gefälschten Seiten. Einzige sichere Reaktion: SMS löschen und die offizielle DHL-Website direkt im Browser aufrufen.",
              glossarLinks: ["smishing", "phishing", "domain"],
            },
          },
          {
            id: "scam-l1-enkeltrick-exp",
            data: {
              type: "lesson",
              title: "Enkeltrick – Der Notfall-Anruf",
              kicker: "Fall 3 · Enkeltrick",
              body: 'Der Anrufer setzt darauf, dass du in der Aufregung keine Fragen stellst. Er gibt sich als Verwandter aus, klingt gestresst oder ängstlich, und bittet um Bargeld – meist soll ein »Bote« es abholen. Heute nutzen Betrüger zunehmend KI-gestützte Stimmenkopie: Die Stimme klingt wirklich nach dem Menschen, den du liebst.',
              sections: [
                {
                  heading: "Woran du es erkennst",
                  bullets: [
                    "Der Anrufer nennt seinen Namen nicht von sich aus – er wartet, dass du ihn nennst",
                    "Die Geschichte wird immer dramatischer, es geht immer um Bargeld und zwar schnell",
                    "Auch wenn die Stimme vertraut klingt: Das allein ist heute kein sicherer Beweis mehr",
                  ],
                },
                {
                  heading: "Was du tun sollst",
                  bullets: [
                    "Auflegen und dann selbst bei dem Verwandten auf seiner bekannten Nummer anrufen",
                    "Niemals Bargeld an Fremde übergeben",
                    "Tipp: Vereinbare mit deiner Familie im Voraus ein geheimes Codewort",
                  ],
                },
              ],
              mediaType: "audio",
              glossarLinks: ["enkeltrick", "social-engineering", "ki"],
            },
          },
          {
            id: "scam-l1-enkeltrick",
            data: {
              type: "audioAuswahl",
              question: "Welches Warnsignal erkennst du in diesem Anruf?",
              audioLabel: "Telefonanruf – 00:18",
              transcript:
                "»Oma, ich bin's – ich stecke in der Klemme! Ich hatte einen Unfall und muss sofort 2.000 Euro auftreiben. Sag das bitte noch niemandem, ein Bekannter kommt gleich bei dir vorbei.«",
              options: [
                "Der Anrufer nennt seinen Namen nicht – du musst ihn selbst erraten",
                "Der Anrufer klingt aufgeregt und gestresst",
                "Der Anrufer bittet um Hilfe",
                "Der Anrufer kennt deine Telefonnummer",
              ],
              correct: 0,
              explanation:
                "Betrüger nennen ihren Namen bewusst nicht, damit du ihn nennst – und sie die Identität übernehmen können. Das ist das klassische Muster des Enkeltricks.",
              glossarLinks: ["enkeltrick", "social-engineering"],
            },
          },
          {
            id: "scam-l1-schockanruf-exp",
            data: {
              type: "lesson",
              title: "Schockanruf – Der gefälschte Notfall",
              kicker: "Fall 4 · Schockanruf",
              body: "Diese Masche funktioniert wie der Enkeltrick, ist aber noch emotionaler aufgeladen. Jemand gibt sich als Arzt, Polizist oder Anwalt aus und schildert eine dramatische Situation. Das Ziel: dich so aufzuwühlen, dass du nicht mehr klar denkst – und sofort zahlst. Manchmal ist kurz eine weinende Stimme zu hören, die per KI wie ein Familienmitglied klingt.",
              sections: [
                {
                  heading: "Woran du es erkennst",
                  bullets: [
                    "Der Anruf kommt unangekündigt mit einer dramatischen Nachricht",
                    "Es wird sofortiges Handeln und Schweigen gefordert: »Sagen Sie niemandem etwas«",
                    "Echte Behörden und Ärzte fragen nicht per Telefon nach Bargeld",
                  ],
                },
                {
                  heading: "Was du tun sollst",
                  bullets: [
                    "Ruhig bleiben – auch wenn es schwerfällt – und auflegen",
                    "Den Angehörigen direkt auf seiner bekannten Nummer anrufen",
                    "Danach mit jemandem sprechen, dem du vertraust – du musst das nicht alleine verarbeiten",
                  ],
                },
              ],
              mediaType: "audio",
              glossarLinks: ["schockanruf", "social-engineering", "ki"],
            },
          },
          {
            id: "scam-l1-schockanruf",
            data: {
              type: "audioAuswahl",
              question: "Was ist das richtige Vorgehen bei diesem Anruf?",
              audioLabel: "Telefonanruf – 00:27",
              transcript:
                "»Guten Tag, hier ist Dr. Müller vom Klinikum. Ihre Tochter hatte einen schweren Unfall und ist in der Notaufnahme. Die Operation ist dringend – wir brauchen 3.500 Euro bar, ein Bote kommt in 20 Minuten zu Ihnen.«",
              options: [
                "Sofort das Geld bereitstellen, damit der Bote es holen kann",
                "Auflegen und die Tochter direkt auf ihrer eigenen Nummer anrufen",
                "Den Arzt nach seiner Rückrufnummer fragen",
                "Dem Boten das Geld geben und danach nachfragen",
              ],
              correct: 1,
              explanation:
                "Krankenhäuser und Behörden fragen niemals telefonisch nach Bargeld. Auflegen und direkt bei der betroffenen Person anrufen – auf einer Nummer, die du selbst kennst.",
              glossarLinks: ["schockanruf", "social-engineering"],
            },
          },
        ],
      },
      {
        id: "scam-unit2",
        title: "Lektion 2: Noch besser geschützt",
        description: "Vier weitere Maschen: Spoofing, Vishing, Love Scam und Gewinnbetrug – etwas komplexer, aber genauso wichtig.",
        exercises: [
          {
            id: "scam-l2-intro",
            data: {
              type: "lesson",
              title: "Lektion 2 – Noch besser geschützt",
              kicker: "Lektion 2 · Einstieg",
              body: "Du weißt jetzt, wie Phishing, Smishing, der Enkeltrick und der Schockanruf funktionieren. In dieser Lektion kommen vier weitere Maschen dazu – etwas komplexer, aber genauso wichtig. Du lernst, wie Betrüger gefälschte Telefonnummern nutzen, sich als Technik-Support ausgeben, über Wochen Vertrauen aufbauen und mit fingierten Gewinnen locken.",
              mediaType: "text",
              glossarLinks: ["phishing", "spoofing", "vishing", "love-scam", "gewinnbetrug"],
            },
          },
          {
            id: "scam-l2-spoofing-exp",
            data: {
              type: "lesson",
              title: "Spoofing – Die gefälschte Polizeinummer",
              kicker: "Fall 5 · Spoofing",
              body: "Betrüger können technisch jede beliebige Nummer auf deinem Display erscheinen lassen – auch 110 oder die Nummer deiner Bank. Das nennt sich Spoofing. Die echte Polizei ruft nicht unter 110 an – das ist ausschließlich eine Notrufnummer, von der aus keine ausgehenden Anrufe getätigt werden.",
              sections: [
                {
                  heading: "Woran du es erkennst",
                  bullets: [
                    "Die angezeigte Nummer sagt nichts darüber aus, wer wirklich anruft",
                    "Jede Behörde oder Bank, die unaufgefordert anruft und nach Geld oder Daten fragt, ist verdächtig",
                    "Die Polizei fordert am Telefon niemals Bargeld oder Überweisungen",
                  ],
                },
                {
                  heading: "Was du tun sollst",
                  bullets: [
                    "Auflegen und dann die Nummer selbst heraussuchen und zurückrufen",
                    "Vertraue nie allein der angezeigten Nummer auf dem Display",
                  ],
                },
              ],
              mediaType: "text",
              glossarLinks: ["spoofing", "social-engineering"],
            },
          },
          {
            id: "scam-l2-spoofing",
            data: {
              type: "fall",
              question: "Auf deinem Display erscheint »110 – Polizei München«. Was verrät, dass es ein Betrug sein könnte?",
              scenario: {
                type: "chat",
                sender: "110 – Polizei München",
                content:
                  "»Guten Tag, hier spricht Kriminalhauptkommissar Weber von der Polizei München. Auf Ihrem Konto wurden verdächtige Transaktionen festgestellt. Bringen Sie sofort Ihr Bargeld in Sicherheit – ein Kollege wird es bei Ihnen abholen.«",
              },
              options: [
                "Der Anrufer klingt sehr professionell und offiziell",
                "Die echte Polizei ruft nie unter der Notrufnummer 110 an",
                "Der Anrufer nennt seinen Namen und seine Dienststelle",
                "Eine angezeigte Behördennummer ist immer vertrauenswürdig",
              ],
              correct: 1,
              explanation:
                "Die Notrufnummer 110 wird nie für ausgehende Anrufe genutzt. Eine auf dem Display angezeigte Nummer beweist nicht, wer wirklich anruft – das nennt sich Spoofing.",
              glossarLinks: ["spoofing", "social-engineering"],
            },
          },
          {
            id: "scam-l2-vishing-exp",
            data: {
              type: "lesson",
              title: 'Vishing – Der »Microsoft Support«',
              kicker: "Fall 6 · Vishing",
              body: "Vishing steht für Voice-Phishing – Betrug am Telefon. Der Anrufer gibt sich als technischer Support aus und behauptet, dein Computer sei mit einem Virus infiziert oder dein Konto kompromittiert. Er bittet dich, eine Software zu installieren, mit der er dann auf deinen Computer zugreifen kann.",
              sections: [
                {
                  heading: "Woran du es erkennst",
                  bullets: [
                    "Microsoft, Apple oder andere Unternehmen rufen dich nicht unaufgefordert an",
                    "Niemand vom echten Support verlangt Fernzugriff ohne vorherige Anfrage von dir",
                    "Links zu Fernwartungssoftware wie »support-remote-fix.com« sind keine offiziellen Seiten",
                  ],
                },
                {
                  heading: "Was du tun sollst",
                  bullets: [
                    "Sofort auflegen und keine Software installieren",
                    "Falls du bereits Zugriff gewährt hast: Computer sofort vom Internet trennen und echten Support kontaktieren",
                  ],
                },
              ],
              mediaType: "audio",
              glossarLinks: ["vishing", "phishing", "social-engineering", "malware"],
            },
          },
          {
            id: "scam-l2-vishing",
            data: {
              type: "audioAuswahl",
              question: "Hören Sie den Anruf. Worum handelt es sich?",
              audioLabel: "Telefonanruf – 00:23",
              transcript:
                "»Guten Tag, hier spricht der Microsoft Sicherheitsdienst. Wir haben festgestellt, dass Ihr Computer mit einem gefährlichen Virus infiziert ist. Bitte installieren Sie jetzt unser Sicherheitsprogramm, damit wir das Problem beheben können. Öffnen Sie dazu: support-remote-fix.com«",
              options: [
                "Ein hilfreicher Anruf vom echten Microsoft-Support",
                "Vishing – gefälschter Technik-Support will Zugang zu deinem Computer",
                "Eine automatische Sicherheitswarnung des Betriebssystems",
                "Ein seriöser Kundendienst-Anruf",
              ],
              correct: 1,
              explanation:
                "Microsoft und andere Firmen rufen nie unaufgefordert an. Links wie »support-remote-fix.com« sind keine offiziellen Microsoft-Seiten. Sofort auflegen.",
              glossarLinks: ["vishing", "phishing", "social-engineering"],
            },
          },
          {
            id: "scam-l2-lovescam-exp",
            data: {
              type: "lesson",
              title: "Love Scam – Die Online-Bekanntschaft",
              kicker: "Fall 7 · Love Scam",
              body: "Beim Love Scam wird über Wochen und Monate echtes Vertrauen aufgebaut – tägliche Nachrichten, tiefe Gespräche, das Gefühl, jemanden wirklich zu kennen. Dann kommt die Bitte um Geld. Das Profil ist meist gefälscht. Heute erstellen Betrüger per KI völlig neue Gesichter – und Videoanrufe schützen nicht mehr, da KI-Deepfakes ein fremdes Gesicht live überlagern können.",
              sections: [
                {
                  heading: "Woran du es erkennst",
                  bullets: [
                    "Die Person will dich nie persönlich treffen – es gibt immer einen Grund",
                    "Die Beziehung entwickelt sich ungewöhnlich schnell: sehr intensive Gefühle in kurzer Zeit",
                    "Die erste Geldbitte klingt noch klein und plausibel",
                    "Betrüger arbeiten bewusst daran, dich zu isolieren – »Sag niemandem davon«",
                  ],
                },
                {
                  heading: "Was du tun sollst",
                  bullets: [
                    "Kein Geld überweisen, bevor du die Person persönlich getroffen hast",
                    "Mit jemandem sprechen, dem du vertraust, bevor du irgendetwas überweist",
                  ],
                },
              ],
              mediaType: "text",
              glossarLinks: ["love-scam", "social-engineering", "ki", "deepfake"],
            },
          },
          {
            id: "scam-l2-lovescam",
            data: {
              type: "fall",
              question: "Du chattest seit 3 Wochen mit »Thomas«. Heute kommt diese Nachricht. Was ist das Warnsignal?",
              scenario: {
                type: "chat",
                sender: "Thomas W. ❤️",
                content:
                  "Hallo Liebste, ich vermisse dich so sehr. Ich bin gerade hier im Krankenhaus – eine wichtige Operation. Das Krankenhaus verlangt eine Vorauszahlung, aber mein Konto hier im Ausland ist gesperrt. Kannst du mir bitte 800€ schicken? Ich erstatte dir alles sofort zurück. Du bist der einzige Mensch, dem ich vertraue.",
              },
              options: [
                "Thomas klingt wirklich verzweifelt und braucht Hilfe",
                "Geldbitte nach wochenlangem Online-Kontakt ohne persönliches Treffen",
                "Thomas schreibt auf Deutsch",
                "Thomas kennt deinen Namen",
              ],
              correct: 1,
              explanation:
                "Nie persönlich getroffen + erste Geldbitte nach emotionalem Aufbau = klassisches Love-Scam-Muster. Kein Geld überweisen. Erst mit einer Vertrauensperson sprechen.",
              glossarLinks: ["love-scam", "social-engineering"],
            },
          },
          {
            id: "scam-l2-gewinn-exp",
            data: {
              type: "lesson",
              title: "Gewinnbetrug – Der Brief mit 50.000 €",
              kicker: "Fall 8 · Gewinnbetrug",
              body: "Der Brief sieht offiziell aus – Briefkopf, Siegel, Glückwünsche. Um den Gewinn zu erhalten, musst du angeblich eine kleine Bearbeitungsgebühr, Versandkosten oder Steuern vorab zahlen. Den Gewinn gibt es nicht. Wer zahlt, bekommt nichts zurück – und wird oft anschließend mit weiteren Forderungen kontaktiert.",
              sections: [
                {
                  heading: "Woran du es erkennst",
                  bullets: [
                    "Du hast nie an einem Gewinnspiel teilgenommen",
                    "Es wird eine Gebühr verlangt, bevor du etwas erhältst",
                    "Eine Frist soll Druck machen",
                  ],
                },
                {
                  heading: "Was du tun sollst",
                  bullets: [
                    "Den Brief wegwerfen oder bei der Verbraucherzentrale melden",
                    "Niemals vorab zahlen – echte Gewinne kosten dich vorher nichts",
                  ],
                },
              ],
              mediaType: "text",
              glossarLinks: ["gewinnbetrug", "social-engineering", "phishing"],
            },
          },
          {
            id: "scam-l2-gewinn",
            data: {
              type: "fall",
              question: "Was ist das Hauptmerkmal dieses Gewinnbetrugs?",
              scenario: {
                type: "email",
                from: "Europäisches Preiskomitee <gewinn@eu-prize-committee.net>",
                subject: "🏆 Herzlichen Glückwunsch! Sie haben 50.000 € gewonnen!",
                content:
                  "Sehr geehrte Gewinnerin, sehr geehrter Gewinner,\n\nSie wurden als Gewinner unserer Europäischen Jahresverlosung ausgewählt. Ihr Preis: 50.000 €.\n\nUm Ihren Gewinn zu erhalten, überweisen Sie bitte die Bearbeitungsgebühr von 49,90 € auf folgendes Konto: ...\n\nFrist: 3 Tage. Nach Ablauf verfällt Ihr Gewinn.",
              },
              options: [
                "Der Absender hat einen offiziell klingenden Namen",
                "Es wird eine Vorabgebühr verlangt, bevor man den Gewinn erhält",
                "Der Gewinnbetrag ist sehr hoch",
                "Es gibt eine Frist von 3 Tagen",
              ],
              correct: 1,
              explanation:
                "Das Merkmal des Gewinnbetrugs: Erst zahlen, dann (angeblich) erhalten. Echte Gewinne kosten nichts im Voraus. Wer eine Gebühr verlangt, ist ein Betrüger.",
              glossarLinks: ["gewinnbetrug", "social-engineering", "phishing"],
            },
          },
        ],
      },
      {
        id: "scam-unit3",
        title: "Abschluss: Alle 8 Begriffe",
        description: "Ordne alle acht Betrugsmaschen ihren Beispielen zu – das Abschluss-Memory für beide Lektionen.",
        exercises: [
          {
            id: "scam-memory-8",
            data: {
              type: "memory",
              variant: "flip",
              question: "Ordne jeden Betrugstyp dem passenden Beispiel zu:",
              pairs: [
                {
                  term: "Phishing",
                  definition: "Fake-E-Mail führt zu gefälschter Bankseite",
                  info: "Betrüger verschicken gefälschte E-Mails, die täuschend echt wie Nachrichten von Banken, Paketdiensten oder Behörden aussehen. Der enthaltene Link führt auf eine gefälschte Webseite, auf der Zugangsdaten abgefangen werden.",
                },
                {
                  term: "Enkeltrick",
                  definition: "»Oma, ich bin's – ich brauche sofort Geld!«",
                  info: "Ein Anrufer gibt sich als Enkel, Kind oder naher Verwandter aus und behauptet, in einer Notlage zu stecken. Er bittet dringend um Bargeld, das meist von einem »Boten« abgeholt wird.",
                },
                {
                  term: "Schockanruf",
                  definition: "»Ihr Kind hatte einen Unfall – zahlen Sie jetzt!«",
                  info: "Ähnlich wie der Enkeltrick, aber noch emotionaler aufgeladen: Jemand meldet sich als Arzt oder Polizist und berichtet von einem schlimmen Unfall. Das Ziel ist Panik – damit du ohne Nachdenken zahlst.",
                },
                {
                  term: "Smishing",
                  definition: "Fake-SMS von »DHL« mit verdächtigem Link",
                  info: "Das Wort setzt sich aus SMS und Phishing zusammen. Betrüger verschicken täuschend echte Textnachrichten mit einem Link, der auf eine Fake-Seite führt oder Schadsoftware auf das Handy lädt.",
                },
                {
                  term: "Spoofing",
                  definition: "Echte Polizeinummer erscheint – Anrufer ist Betrüger",
                  info: "Betrüger manipulieren technisch die Absenderkennung, sodass auf dem Display eine echte, vertrauenswürdige Telefonnummer erscheint. Allein weil eine Nummer echt aussieht, bedeutet das nicht, dass der Anrufer auch echt ist.",
                },
                {
                  term: "Love Scam",
                  definition: "Online-Bekanntschaft bittet nach Wochen um Geld",
                  info: "Jemand nimmt über Dating-Plattformen oder soziale Netzwerke Kontakt auf, baut über Wochen eine intensive emotionale Beziehung auf – und bittet dann um Geld wegen einer vorgetäuschten Notlage wie Krankheit oder einem Unfall im Ausland.",
                },
                {
                  term: "Vishing",
                  definition: "»Microsoft-Support«: angeblicher Virus auf deinem PC",
                  info: "Voice-Phishing: Betrüger rufen an und geben sich als Microsoft-Mitarbeiter, Bankberater oder Behörde aus. Sie behaupten, es gebe ein dringendes Problem und versuchen, dich zur Herausgabe von Zugangsdaten oder zur Installation von Software zu bewegen.",
                },
                {
                  term: "Gewinnbetrug",
                  definition: "»Sie haben gewonnen!« – aber erst Gebühr zahlen",
                  info: "Du erhältst eine Nachricht, dass du einen großen Preis gewonnen hast – obwohl du nie an einem Gewinnspiel teilgenommen hast. Um den Gewinn zu erhalten, sollst du angeblich eine Gebühr vorab bezahlen. Den Gewinn gibt es nicht.",
                },
              ],
              explanation:
                "Du kennst jetzt alle acht häufigsten Betrugsmaschen. Wer die Muster erkennt, ist deutlich besser geschützt – und kann auch andere warnen.",
              glossarLinks: ["phishing", "smishing", "enkeltrick", "schockanruf", "spoofing", "vishing", "love-scam", "gewinnbetrug", "social-engineering"],
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
              question: "Füllen Sie die Lücken mit den passenden Begriffen.",
              before:
                "Absichtlich verbreitete Falschinformationen, die wie echte Nachrichten wirken, nennt man ",
              after: ".",
              parts: [
                "Absichtlich verbreitete Falschinformationen nennt man ",
                ". Reißerische Überschriften für mehr Klicks heißen ",
                ".",
              ],
              correctAnswers: ["Fake News", "Clickbait"],
              options: ["Clickbait", "Fake News", "Wetterberichte", "Suchbegriffe"],
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
              question: "Füllen Sie die Lücken mit den passenden Begriffen.",
              before: "Ein ",
              after:
                " ist ein KI-generiertes Video, das eine reale Person etwas sagen lässt, was sie nie gesagt hat.",
              parts: [
                "Ein ",
                " kann eine Person täuschend echt zeigen. Eine ",
                " entsteht, wenn man fast nur noch ähnliche Meinungen sieht.",
              ],
              correctAnswers: ["Deepfake", "Filterblase"],
              options: ["Deepfake", "Filterblase", "Selfie", "Livestream"],
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
  // NOTE: "general" (Allgemeines) removed — content folded into "grundlagen"
  /* {
    id: "general",
    title: "Allgemeines",
    subtitle: "Passwörter & Datenschutz",
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
              question: "Füllen Sie die Lücken mit den passenden Schutzbegriffen.",
              before: "Die ",
              after:
                " fügt beim Login einen zweiten Sicherheitsschritt hinzu – z. B. einen Code per SMS.",
              parts: [
                "Die ",
                " fügt beim Login einen zweiten Schritt hinzu. Ein ",
                " sollte lang und schwer zu erraten sein.",
              ],
              correctAnswers: ["Zwei-Faktor-Authentifizierung", "Passwort"],
              options: [
                "Zwei-Faktor-Authentifizierung",
                "Passwort",
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
  }, */
];
