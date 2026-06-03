import type { FallData } from "./courses";

export interface Fall {
  id: string;
  categoryId: string;
  title: string;
  data: FallData;
}

export const faelle: Fall[] = [
  {
    id: "fall-extra-scam-1",
    categoryId: "scamming",
    title: "Der gefälschte Microsoft-Support",
    data: {
      type: "fall",
      question: "Was beschreibt diese Situation am besten, und was sollten Sie tun?",
      scenario: {
        type: "chat",
        sender: "Microsoft Support (angeblich)",
        content:
          "»Guten Tag, hier ist der Microsoft Sicherheitsdienst. Ihr Computer sendet kritische Fehlermeldungen an unsere Server. Wir müssen sofort auf Ihren Computer zugreifen, um eine Infektion zu verhindern. Bitte installieren Sie TeamViewer und geben Sie mir den Code.«",
      },
      options: [
        "Ein legitimer Microsoft-Support-Anruf – ich sollte helfen",
        "Vishing: Microsoft ruft niemals unaufgefordert an – ich lege auf",
        "Ein netter Hinweis, den ich befolgen sollte",
        "Eine veraltete Warnung, die ich ignorieren kann",
      ],
      correct: 1,
      explanation:
        "Microsoft ruft NIEMALS unaufgefordert an. Diese Methode nennt sich Vishing (Voice Phishing). Legen Sie sofort auf und installieren Sie keine Fernzugriffssoftware.",
      glossarLinks: ["social-engineering", "phishing"],
    },
  },
  {
    id: "fall-extra-news-1",
    categoryId: "news",
    title: "Die dubiose Nachrichtenwebsite",
    data: {
      type: "fall",
      question: "Welche Merkmale fehlen bei einer seriösen Nachrichtenquelle?",
      scenario: {
        type: "web",
        url: "gesundheit-aktuell24.net/impf-chip-enthuellung",
        content:
          "Kein Impressum · Kein Autor · Kein Datum\n\n»ENTHÜLLUNG: Was die Pharmaindustrie Ihnen verschweigt! Exklusives Insider-Dokument beweist: Impfstoffe enthalten Nano-Chips zur Überwachung. Teilen Sie diesen Artikel, bevor er zensiert wird!«",
      },
      options: [
        "Impressum, Autor und Datum fehlen – klare Warnsignale",
        "Die URL klingt seriös und medizinisch",
        "Exklusive Inhalte sind immer besonders glaubwürdig",
        "Ein Aufruf zum Teilen zeigt Vertrauen in den Inhalt",
      ],
      correct: 0,
      explanation:
        "Fehlende Quellenangaben (kein Impressum, kein Autor, kein Datum), unbekannte Domains und Sharing-Appelle sind klassische Merkmale von Fake News.",
      glossarLinks: ["fake-news", "clickbait", "domain"],
    },
  },
  {
    id: "fall-extra-sm-1",
    categoryId: "socialmedia",
    title: "Das verdächtige Gewinnspiel",
    data: {
      type: "fall",
      question: "Warum ist dieses Gewinnspiel höchstwahrscheinlich ein Betrug?",
      scenario: {
        type: "social",
        sender: "apple.official.germany",
        content:
          "🎉🎉 RIESIGES GEWINNSPIEL! 🎉🎉\nWir verlosen 5x iPhone 15 Pro Max!\n✅ Folge diesem Account\n✅ Teile diesen Post\n✅ Kommentiere deinen Wunsch\nGewinner werden in 24h bekannt gegeben!\n[Konto erstellt vor 3 Tagen · 47 Follower · 2 Posts]",
      },
      options: [
        "Echte Apple-Gewinnspiele laufen immer so ab",
        "Das Konto ist neu, hat kaum Follower und ist kein verifiziertes Apple-Konto",
        "Die Teilnahmebedingungen klingen fair",
        "Große Preise werden immer über Social Media verlost",
      ],
      correct: 1,
      explanation:
        "Apple und andere Marken haben verifizierte Konten mit Millionen Followern. Frisch erstellte Fake-Accounts imitieren bekannte Marken, um Follower und Daten zu sammeln.",
      glossarLinks: ["social-engineering", "spam"],
    },
  },
  {
    id: "fall-extra-gen-1",
    categoryId: "general",
    title: "Die Passwortanfrage per Chat",
    data: {
      type: "fall",
      question: "Was ist an dieser Anfrage problematisch, und was sollten Sie tun?",
      scenario: {
        type: "chat",
        sender: "IT-Support [intern]",
        content:
          "»Hi! Wir führen heute ein dringendes Sicherheits-Update durch. Könntest du mir kurz dein aktuelles Passwort und deinen Benutzernamen schicken? Wir müssen das Update sofort durchführen. Danke!«",
      },
      options: [
        "Ich schicke die Daten, da es ein interner IT-Mitarbeiter ist",
        "Legitimer IT-Support fragt niemals nach Passwörtern – ich verweigere und melde es",
        "Ich schicke nur den Benutzernamen, aber nicht das Passwort",
        "Ich warte ab, ob noch eine Erinnerung kommt",
      ],
      correct: 1,
      explanation:
        "Kein seriöser IT-Support fragt jemals nach Ihrem Passwort – per Chat, E-Mail oder Telefon. Das ist ein klassisches Social-Engineering-Angriffsmuster.",
      glossarLinks: ["social-engineering", "phishing", "zwei-faktor"],
    },
  },
];
