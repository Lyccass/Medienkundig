import type { Exercise } from "./courses";

export type KnowledgeLevel = "starter" | "basis" | "sicher";

export interface OnboardingAnswer {
  questionId: string;
  optionId: string;
}

export interface OnboardingResult {
  level: KnowledgeLevel;
  title: string;
  description: string;
  recommendedCategoryId: string;
  recommendedLabel: string;
  correctCount: number;
  totalCount: number;
}

export const onboardingExercises: Exercise[] = [
  {
    id: "assessment-domain-1",
    data: {
      type: "urlTrainer",
      question: "Welche Adresse gehört wirklich zu PayPal?",
      instruction: "Achte auf die eigentliche Domain.",
      options: [
        { url: "paypal.com", note: "Das ist die echte Domain." },
        { url: "paypal.com.sicherheit-login.net", note: "Die eigentliche Domain ist sicherheit-login.net." },
        { url: "paypaI.com", note: "Hier steht ein großes I statt eines kleinen l." },
        { url: "paypal-konto-pruefen.de", note: "Zusatzwörter sind ein Warnzeichen." },
      ],
      correct: 0,
      explanation: "Bei Domains zählt der Teil direkt vor der Endung. paypal.com ist kurz und eindeutig.",
      glossarLinks: ["domain", "link"],
    },
  },
  {
    id: "assessment-domain-2",
    data: {
      type: "multipleChoice",
      question: "Wo liegt bei login.bank.de.sicher-konto.net die eigentliche Domain?",
      options: ["bank.de", "login.bank.de", "sicher-konto.net", "konto.net/login"],
      correct: 2,
      explanation: "Die eigentliche Domain steht direkt vor der Endung: sicher-konto.net.",
      glossarLinks: ["domain"],
    },
  },
  {
    id: "assessment-email-1",
    data: {
      type: "fall",
      question: "Was ist hier das stärkste Warnzeichen?",
      scenario: {
        type: "email",
        from: "INFO <info@dpd-paket-service.jp>",
        subject: "Zustellbenachrichtigung für Sendung DPD_883221",
        content: "Wir konnten Ihr Paket nicht zustellen. Planen Sie innerhalb von 24 Stunden eine neue Zustellung.",
      },
      options: [
        "Die Absender-Domain passt nicht zu DPD.",
        "Die Nachricht ist kurz.",
        "Das Wort Paket kommt vor.",
        "Die E-Mail hat einen Betreff.",
      ],
      correct: 0,
      explanation: "Die Domain nach dem @ ist hier der wichtigste Hinweis.",
      glossarLinks: ["phishing", "domain"],
    },
  },
  {
    id: "assessment-email-2",
    data: {
      type: "multipleChoice",
      question: "Eine E-Mail droht mit Kontosperrung in 2 Stunden. Was bedeutet dieser Druck?",
      options: [
        "Das ist normal bei Banken.",
        "Das ist ein Warnzeichen.",
        "Das beweist, dass die Mail echt ist.",
        "Das ist nur wichtig, wenn ein Logo fehlt.",
      ],
      correct: 1,
      explanation: "Zeitdruck soll verhindern, dass du prüfst.",
      glossarLinks: ["phishing"],
    },
  },
  {
    id: "assessment-next-step-1",
    data: {
      type: "nextStep",
      question: "Eine Bank-SMS fordert dich zum Login über einen Link auf. Was ist am sichersten?",
      scenario: {
        type: "sms",
        sender: "BankInfo",
        content: "Ihr Konto wurde eingeschränkt. Bitte bestätigen Sie sofort: bank-login24.net",
      },
      options: [
        "Link öffnen und Daten prüfen",
        "SMS beantworten",
        "Bank über die offizielle Nummer kontaktieren",
        "An Freunde weiterleiten",
      ],
      correct: 2,
      explanation: "Nutze die offizielle Nummer oder App, nicht den Link aus der Nachricht.",
      glossarLinks: ["smishing", "link"],
    },
  },
  {
    id: "assessment-next-step-2",
    data: {
      type: "nextStep",
      question: "Ein angeblicher Enkel bittet per Chat dringend um Geld. Was machst du zuerst?",
      scenario: {
        type: "chat",
        sender: "Neue Nummer",
        content: "Oma, mein Handy ist kaputt. Bitte überweise sofort 890 Euro, ich erkläre später alles.",
      },
      options: [
        "Sofort überweisen",
        "Auf bekanntem Weg zurückrufen",
        "Nach der IBAN fragen",
        "Die neue Nummer speichern",
      ],
      correct: 1,
      explanation: "Kontaktiere die Person über eine bekannte Nummer oder einen anderen sicheren Weg.",
      glossarLinks: ["enkeltrick"],
    },
  },
  {
    id: "assessment-password-1",
    data: {
      type: "multipleChoice",
      question: "Welches Passwort ist am stärksten?",
      options: ["Sommer2026", "Medien123", "Kaffee!7", "zug-glas-wolke-92!"],
      correct: 3,
      explanation: "Länge ist entscheidend. Mehrere zufällige Wörter mit Zeichen sind deutlich stärker.",
      glossarLinks: ["passwort"],
    },
  },
  {
    id: "assessment-2fa-1",
    data: {
      type: "multipleChoice",
      question: "Wofür ist Zwei-Faktor-Authentifizierung gut?",
      options: [
        "Sie ersetzt jedes Passwort.",
        "Sie macht eine zweite Prüfung beim Login.",
        "Sie löscht verdächtige E-Mails.",
        "Sie zeigt alle Fake-Shops an.",
      ],
      correct: 1,
      explanation: "Ein zweiter Faktor schützt dein Konto, wenn ein Passwort bekannt wird.",
      glossarLinks: ["2fa"],
    },
  },
  {
    id: "assessment-shop-1",
    data: {
      type: "fall",
      question: "Was spricht bei diesem Shop gegen Vertrauen?",
      scenario: {
        type: "web",
        url: "super-marken-outlet24.net",
        content: "Alle Smartphones 80 Prozent günstiger. Nur heute. Zahlung nur per Vorkasse.",
      },
      options: [
        "Der Rabatt ist sehr hoch und es gibt nur Vorkasse.",
        "Der Shop verkauft Smartphones.",
        "Die Seite hat Text.",
        "Die Domain endet auf .net.",
      ],
      correct: 0,
      explanation: "Extremer Rabatt, Zeitdruck und Vorkasse sind zusammen ein starkes Warnsignal.",
      glossarLinks: ["fakeshop"],
    },
  },
  {
    id: "assessment-shop-2",
    data: {
      type: "multipleChoice",
      question: "Welche Zahlungsart ist bei unbekannten Shops besonders riskant?",
      options: ["Kreditkarte mit Käuferschutz", "Rechnung", "Vorkasse per Überweisung", "Abholung vor Ort"],
      correct: 2,
      explanation: "Bei Vorkasse ist das Geld oft weg, bevor du Ware oder Sicherheit hast.",
      glossarLinks: ["fakeshop"],
    },
  },
  {
    id: "assessment-news-1",
    data: {
      type: "multipleChoice",
      question: "Ein Post behauptet: „Schock-Studie beweist alles!“ Was prüfst du zuerst?",
      options: [
        "Quelle, Datum und Originalstudie",
        "Anzahl der Emojis",
        "Ob viele Kommentare darunter stehen",
        "Ob der Titel wütend macht",
      ],
      correct: 0,
      explanation: "Quelle, Datum und Original sind wichtiger als Reaktionen.",
      glossarLinks: ["quelle"],
    },
  },
  {
    id: "assessment-news-2",
    data: {
      type: "fall",
      question: "Welche Reaktion ist am sinnvollsten?",
      scenario: {
        type: "social",
        sender: "NachrichtenHeute",
        content: "Teile das sofort! Die Medien verschweigen diese Wahrheit. Quelle: Screenshot ohne Link.",
      },
      options: [
        "Sofort teilen",
        "Erst Quelle und Kontext prüfen",
        "Nur in Familiengruppen teilen",
        "Kommentieren, ohne zu lesen",
      ],
      correct: 1,
      explanation: "Aufforderungen zum sofortigen Teilen sind ein Signal, langsamer zu prüfen.",
      glossarLinks: ["fake-news", "quelle"],
    },
  },
  {
    id: "assessment-ai-1",
    data: {
      type: "multipleChoice",
      question: "Woran erkennst du sicher, dass ein Bild KI-generiert ist?",
      options: [
        "An einem einzelnen Detail immer sicher",
        "Gar nicht immer sicher; Kontext und Quelle mitprüfen",
        "An kräftigen Farben",
        "Wenn es auf Social Media steht",
      ],
      correct: 1,
      explanation: "KI-Bilder können echt wirken. Quelle, Kontext und Rückwärtssuche helfen.",
      glossarLinks: ["ki", "deepfake"],
    },
  },
  {
    id: "assessment-deepfake-1",
    data: {
      type: "nextStep",
      question: "Ein Video einer bekannten Person fordert dich zu einer Investition auf. Was ist der sichere Schritt?",
      scenario: {
        type: "social",
        sender: "FinanzTipp",
        content: "Prominenter empfiehlt neue Plattform. Nur heute Startbonus sichern.",
      },
      options: [
        "Link öffnen",
        "Offizielle Kanäle und unabhängige Quellen prüfen",
        "Sofort kleinen Betrag einzahlen",
        "Video herunterladen",
      ],
      correct: 1,
      explanation: "Prominente werden häufig für Betrug mit Fake-Videos missbraucht.",
      glossarLinks: ["deepfake", "ki"],
    },
  },
  {
    id: "assessment-social-1",
    data: {
      type: "multipleChoice",
      question: "Eine fremde Person schreibt dir und will direkt auf einen privaten Messenger wechseln. Was ist das?",
      options: [
        "Immer harmlos",
        "Ein mögliches Warnzeichen",
        "Ein Beweis für Echtheit",
        "Nur bei jungen Menschen relevant",
      ],
      correct: 1,
      explanation: "Betrüger versuchen oft, Gespräche aus geschützten Plattformen herauszuziehen.",
      glossarLinks: ["love-scam"],
    },
  },
  {
    id: "assessment-social-2",
    data: {
      type: "nextStep",
      question: "Jemand bittet dich nach kurzer Online-Bekanntschaft um Geld. Was ist sicher?",
      scenario: {
        type: "chat",
        sender: "Online-Bekanntschaft",
        content: "Ich brauche dringend Geld für den Flug zu dir. Bitte überweise heute.",
      },
      options: [
        "Überweisen, wenn die Geschichte traurig ist",
        "Erst persönlich treffen und mit Vertrauensperson sprechen",
        "Mehr Fotos verlangen",
        "Nur die Hälfte überweisen",
      ],
      correct: 1,
      explanation: "Geldforderungen vor einem echten Treffen sind ein klares Warnzeichen.",
      glossarLinks: ["love-scam"],
    },
  },
  {
    id: "assessment-device-1",
    data: {
      type: "multipleChoice",
      question: "Ein Pop-up sagt: „Ihr Gerät ist infiziert. Jetzt anrufen.“ Was ist richtig?",
      options: [
        "Nummer anrufen",
        "Pop-up schließen und keine Daten eingeben",
        "Fernzugriff erlauben",
        "Bankdaten bereithalten",
      ],
      correct: 1,
      explanation: "Solche Pop-ups sind häufig Betrugsversuche mit falschem Support.",
      glossarLinks: ["scam"],
    },
  },
  {
    id: "assessment-data-1",
    data: {
      type: "multipleChoice",
      question: "Welche Information solltest du nie über einen Link aus einer verdächtigen Nachricht eingeben?",
      options: ["Lieblingsfarbe", "IBAN, Passwort oder TAN", "Wetter", "Vorname einer bekannten Person"],
      correct: 1,
      explanation: "Passwörter, TANs und Zahlungsdaten gehören nie in verdächtige Links.",
      glossarLinks: ["phishing", "passwort"],
    },
  },
  {
    id: "assessment-url-3",
    data: {
      type: "urlTrainer",
      question: "Welche Adresse gehört wirklich zur Sparkasse?",
      instruction: "Prüfe die echte Domain.",
      options: [
        { url: "sparkasse.de", note: "Kurze echte Domain." },
        { url: "sparkasse.de.konto-check.com", note: "Die echte Domain ist konto-check.com." },
        { url: "sparkasse-sicher-login.net", note: "Fremde Domain mit Zusatzwörtern." },
        { url: "sрarkasse.de", note: "Der erste Buchstabe kann ein ähnlich aussehendes Zeichen sein." },
      ],
      correct: 0,
      explanation: "sparkasse.de ist die klare Domain. Zusätze dahinter oder fremde Domains sind riskant.",
      glossarLinks: ["domain"],
    },
  },
  {
    id: "assessment-final-1",
    data: {
      type: "fall",
      question: "Was ist die beste Gesamteinschätzung?",
      scenario: {
        type: "email",
        from: "Sicherheitsabteilung <konto@service-login-bank.net>",
        subject: "Letzte Warnung: Zugang endet heute",
        content: "Bestätigen Sie Passwort und TAN über den Link, sonst wird Ihr Konto gesperrt.",
      },
      options: [
        "Echt, weil es um Sicherheit geht",
        "Verdächtig: fremde Domain, Druck, Passwort und TAN",
        "Unklar, aber man sollte klicken",
        "Harmlos, wenn kein Anhang dabei ist",
      ],
      correct: 1,
      explanation: "Mehrere Warnzeichen treten zusammen auf: Domain, Druck und sensible Daten.",
      glossarLinks: ["phishing", "domain", "tan"],
    },
  },
];

export function getOnboardingResult(correctCount: number, totalCount = onboardingExercises.length): OnboardingResult {
  const ratio = totalCount === 0 ? 0 : correctCount / totalCount;

  if (ratio < 0.45) {
    return {
      level: "starter",
      title: "Grundlagen zuerst",
      description: "Starte mit Links, Domains, Passwörtern und sicheren nächsten Schritten.",
      recommendedCategoryId: "grundlagen",
      recommendedLabel: "Grundlagen starten",
      correctCount,
      totalCount,
    };
  }

  if (ratio < 0.75) {
    return {
      level: "basis",
      title: "Muster trainieren",
      description: "Du erkennst einzelne Warnzeichen. Als Nächstes helfen realistische Betrugsfälle.",
      recommendedCategoryId: "scamming",
      recommendedLabel: "Betrugsfälle starten",
      correctCount,
      totalCount,
    };
  }

  return {
    level: "sicher",
    title: "Direkt in die Fälle",
    description: "Du kannst mit gemischten Fällen und Wiederholungen weiterarbeiten.",
    recommendedCategoryId: "scamming",
    recommendedLabel: "Fälle starten",
    correctCount,
    totalCount,
  };
}
