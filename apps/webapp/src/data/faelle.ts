import type { FallData } from "./courses";

export type FallTopic = "scamming" | "news" | "socialmedia" | "general";

export interface FallStep {
  id: string;
  title: string;
  data: FallData;
}

export interface FallAdventure {
  id: string;
  title: string;
  subtitle: string;
  setting: string;
  theme: "Alltag" | "Online-Shopping" | "Konto" | "Reise";
  topics: FallTopic[];
  steps: FallStep[];
}

export const faelle: FallAdventure[] = [
  {
    id: "tag-in-der-stadt",
    title: "Ein Tag in der Stadt",
    subtitle: "Telefon, Plakat, Messenger und Nachrichtenseite an einem Vormittag.",
    setting: "Sie erledigen Besorgungen, bekommen Nachrichten von der Familie und treffen unterwegs mehrere digitale Stolperstellen.",
    theme: "Alltag",
    topics: ["scamming", "news", "socialmedia", "general"],
    steps: [
      {
        id: "stadt-1-bankanruf",
        title: "Anruf auf dem Weg zur Haltestelle",
        data: {
          type: "fall",
          question: "Was ist hier die sicherste Reaktion?",
          scenario: {
            type: "chat",
            sender: "Sparkasse Sicherheitsabteilung (angeblich)",
            content:
              "Sie stehen an der Haltestelle, als Ihr Telefon klingelt. Eine ruhige Stimme sagt: »Auf Ihrem Konto wurde gerade eine verdächtige Überweisung erkannt. Wenn Sie die Abbuchung stoppen möchten, nennen Sie mir bitte sofort Ihre Online-Banking-PIN und den TAN-Code aus der App.«",
          },
          options: [
            "PIN und TAN nennen, damit die Zahlung gestoppt wird",
            "Auflegen und selbst die offizielle Banknummer wählen",
            "Nur die PIN nennen, aber keine TAN",
            "Den Anrufer bitten, später noch einmal anzurufen",
          ],
          correct: 1,
          explanation:
            "Banken fragen niemals nach PIN oder TAN. Bei Druck am Telefon: Gespräch beenden und über die offizielle Nummer selbst Kontakt aufnehmen.",
          glossarLinks: ["social-engineering", "phishing", "zwei-faktor"],
        },
      },
      {
        id: "stadt-2-scammy-offer",
        title: "Das Angebot am Infostand",
        data: {
          type: "fall",
          question: "Welches Warnsignal ist am stärksten?",
          scenario: {
            type: "web",
            url: "strombonus-sofort.de",
            content:
              "In der Fußgängerzone bekommen Sie einen Flyer: »Nur heute: 300 Euro Energiebonus sichern. QR-Code scannen, Ausweisfoto hochladen, Bankverbindung eintragen.« Auf der Website fehlen Impressum, Anbieteradresse und klare Teilnahmebedingungen.",
          },
          options: [
            "Der Bonus klingt hoch, aber das ist normal",
            "Fehlendes Impressum plus Ausweis- und Bankdaten sind klare Warnzeichen",
            "Ein QR-Code macht das Angebot besonders seriös",
            "Nur Angebote auf Papier sind gefährlich",
          ],
          correct: 1,
          explanation:
            "Wenn eine unbekannte Seite sofort Ausweis- und Bankdaten verlangt und kein Impressum zeigt, sollten Sie abbrechen und nichts hochladen.",
          glossarLinks: ["domain", "phishing", "social-engineering"],
        },
      },
      {
        id: "stadt-3-hi-mom",
        title: "Nachricht von der Tochter",
        data: {
          type: "fall",
          question: "Wie sollten Sie reagieren?",
          scenario: {
            type: "sms",
            sender: "+49 151 40681277",
            content:
              "Hallo Mama, mein Handy ist kaputt. Das ist meine neue Nummer. Ich muss heute noch eine Rechnung bezahlen, aber mein Online-Banking geht nicht. Kannst du bitte 1.480 Euro an diese IBAN überweisen? Ich erkläre alles später. Bitte schnell.",
          },
          options: [
            "Sofort überweisen, weil es dringend klingt",
            "Die alte Nummer oder eine bekannte Kontaktmöglichkeit nutzen und nachfragen",
            "Antworten und nach der IBAN fragen",
            "Die neue Nummer direkt speichern und weiter chatten",
          ],
          correct: 1,
          explanation:
            "Der »Hi Mama/Papa«-Betrug arbeitet mit neuer Nummer, Zeitdruck und Geldforderung. Prüfen Sie über einen bekannten Kanal, bevor Sie reagieren.",
          glossarLinks: ["phishing", "social-engineering"],
        },
      },
      {
        id: "stadt-4-news-post",
        title: "Der geteilte Stadt-Post",
        data: {
          type: "fall",
          question: "Was spricht gegen das sofortige Teilen?",
          scenario: {
            type: "social",
            sender: "CityAlarm24",
            url: "stadt-news-echt.net",
            content:
              "»ACHTUNG!!! Polizei warnt: In der Innenstadt werden Geldautomaten manipuliert. Teile diese Meldung sofort mit allen Freunden!« Der Beitrag nennt keine Quelle, kein Datum und verlinkt auf eine unbekannte Seite ohne Impressum.",
          },
          options: [
            "Warnungen sollte man immer sofort teilen",
            "Fehlende Quelle, fehlendes Datum und Teil-das-sofort-Druck sind Warnsignale",
            "Viele Ausrufezeichen machen die Warnung eindeutiger",
            "Eine unbekannte Domain ist bei Lokalnachrichten normal",
          ],
          correct: 1,
          explanation:
            "Bei Warnmeldungen erst offizielle Quellen prüfen, etwa Polizei, Stadt oder seriöse lokale Medien. Dringlichkeit und fehlende Belege sind typische Fake-News-Muster.",
          glossarLinks: ["fake-news", "clickbait", "domain"],
        },
      },
    ],
  },
  {
    id: "online-einkauf",
    title: "Der Online-Einkauf",
    subtitle: "Ein günstiges Angebot führt von Social Ad bis Paket-SMS.",
    setting: "Sie suchen ein Geschenk im Internet und müssen einschätzen, wann ein Shop, eine Bewertung oder eine Nachricht verdächtig wird.",
    theme: "Online-Shopping",
    topics: ["socialmedia", "news", "scamming", "general"],
    steps: [
      {
        id: "shop-1-social-ad",
        title: "Die Anzeige im Feed",
        data: {
          type: "fall",
          question: "Was macht die Anzeige verdächtig?",
          scenario: {
            type: "social",
            sender: "tech_deals_official",
            url: "mega-elektro-sale.shop",
            content:
              "Ein Reel verspricht: »Nur heute: Marken-Kopfhörer 89% günstiger. Lager wird geschlossen. Jetzt kaufen!« Der Account existiert seit zwei Tagen, hat 34 Follower und kopiert das Logo eines bekannten Händlers.",
          },
          options: [
            "Der Rabatt ist hoch, also ist das Angebot besonders gut",
            "Neuer Account, Logo-Kopie, Zeitdruck und unbekannte Shop-Domain passen zu Betrug",
            "Social-Media-Anzeigen werden immer geprüft",
            "Ein Video ist glaubwürdiger als eine Textanzeige",
          ],
          correct: 1,
          explanation:
            "Gefälschte Online-Shops locken oft mit extremen Rabatten, Zeitdruck und imitierten Markenauftritten. Prüfen Sie Domain, Impressum und Bewertungen außerhalb der Anzeige.",
          glossarLinks: ["social-engineering", "domain", "spam"],
        },
      },
      {
        id: "shop-2-review-check",
        title: "Die Bewertungen",
        data: {
          type: "fall",
          question: "Welche Bewertung wirkt am wenigsten verlässlich?",
          scenario: {
            type: "web",
            url: "mega-elektro-sale.shop/bewertungen",
            content:
              "Die Shopseite zeigt 312 Bewertungen mit fünf Sternen. Viele Texte lauten fast gleich: »Sehr gut Produkt, super Qualität, schnelle Lieferung!!!« Es gibt keine Fotos, keine verifizierten Käufe und keine Bewertung ist älter als drei Tage.",
          },
          options: [
            "Viele fast gleiche Fünf-Sterne-Texte in kurzer Zeit",
            "Dass mehrere Menschen zufrieden sind",
            "Dass die Seite überhaupt Bewertungen zeigt",
            "Dass die Lieferung erwähnt wird",
          ],
          correct: 0,
          explanation:
            "Gekaufte oder automatisch erzeugte Bewertungen ähneln sich oft stark. Prüfen Sie unabhängige Quellen, nicht nur die Shopseite selbst.",
          glossarLinks: ["fake-news", "clickbait"],
        },
      },
      {
        id: "shop-3-checkout",
        title: "Die Bezahlung",
        data: {
          type: "fall",
          question: "Welche Zahlungsart sollten Sie vermeiden?",
          scenario: {
            type: "web",
            url: "mega-elektro-sale.shop/kasse",
            content:
              "Im Warenkorb verschwinden PayPal und Kreditkarte plötzlich. Übrig bleibt nur »Banküberweisung im Voraus«. Im Impressum steht eine private Adresse ohne Unternehmensnamen, die AGB-Seite lädt nicht.",
          },
          options: [
            "Vorkasse per Überweisung an eine unbekannte Stelle",
            "Zahlung mit Käuferschutz bei einem bekannten Anbieter",
            "Kauf abbrechen und Shop weiter prüfen",
            "Eine Rechnung nach Lieferung",
          ],
          correct: 0,
          explanation:
            "Vorkasse an unbekannte Shops ist riskant, weil Geld oft nicht zurückkommt. Käuferschutz, vollständiges Impressum und nachvollziehbare AGB sind wichtige Schutzsignale.",
          glossarLinks: ["phishing", "domain"],
        },
      },
      {
        id: "shop-4-delivery-sms",
        title: "Die Paket-SMS",
        data: {
          type: "fall",
          question: "Was ist die richtige Entscheidung?",
          scenario: {
            type: "sms",
            sender: "PaketInfo",
            content:
              "Ihr Paket wartet. Für die Zustellung ist eine Zollgebühr von 1,99 Euro offen. Zahlen Sie innerhalb von 2 Stunden: dhl-zahlung24.net/track",
          },
          options: [
            "Link öffnen, weil der Betrag klein ist",
            "Über die offizielle Paketdienst-App oder Website prüfen, nicht über den SMS-Link",
            "Die Kreditkarte eintragen und danach beobachten",
            "Die SMS an Freunde weiterleiten",
          ],
          correct: 1,
          explanation:
            "Kleine Beträge sollen die Hemmschwelle senken. Öffnen Sie solche Links nicht, sondern prüfen Sie Sendungen über offizielle Apps oder Websites.",
          glossarLinks: ["phishing", "domain-spoofing"],
        },
      },
    ],
  },
  {
    id: "konto-anlegen",
    title: "Ein neues Konto anlegen",
    subtitle: "Registrierung, Passwort, Bestätigungsmail und Berechtigungen.",
    setting: "Sie melden sich bei einem neuen Dienst an und entscheiden Schritt für Schritt, welche Daten und Einstellungen sinnvoll sind.",
    theme: "Konto",
    topics: ["general", "scamming", "socialmedia", "news"],
    steps: [
      {
        id: "konto-1-register",
        title: "Das Registrierungsformular",
        data: {
          type: "fall",
          question: "Welche Angabe sollten Sie kritisch hinterfragen?",
          scenario: {
            type: "web",
            url: "lernclub-plus.de/register",
            content:
              "Für einen kostenlosen Newsletter werden E-Mail-Adresse, Geburtsdatum, Telefonnummer, Ausweisnummer und Kontoverbindung als Pflichtfelder verlangt. Ein Link zur Datenschutzerklärung fehlt.",
          },
          options: [
            "Die E-Mail-Adresse",
            "Ausweisnummer und Kontoverbindung für einen Newsletter",
            "Ein selbst gewählter Anzeigename",
            "Die Auswahl eines Passworts",
          ],
          correct: 1,
          explanation:
            "Dienste sollten nur Daten verlangen, die für den Zweck nötig sind. Für einen Newsletter sind Ausweisnummer und Bankdaten nicht plausibel.",
          glossarLinks: ["datenschutz", "phishing"],
        },
      },
      {
        id: "konto-2-password",
        title: "Das Passwort",
        data: {
          type: "fall",
          question: "Welche Option ist am sichersten?",
          scenario: {
            type: "chat",
            sender: "Passwort-Manager",
            content:
              "Beim Anlegen des Kontos überlegen Sie, ob Sie ein bekanntes Passwort wiederverwenden oder ein neues speichern. Der Dienst bietet zusätzlich Zwei-Faktor-Authentifizierung per App an.",
          },
          options: [
            "Dasselbe Passwort wie beim E-Mail-Konto nutzen",
            "Ein neues, langes Passwort im Passwort-Manager speichern und 2FA aktivieren",
            "Ein kurzes Passwort wählen, das man gut tippen kann",
            "2FA deaktivieren, damit der Login schneller geht",
          ],
          correct: 1,
          explanation:
            "Ein eigenes starkes Passwort plus Zwei-Faktor-Authentifizierung schützt auch dann, wenn ein anderer Dienst kompromittiert wird.",
          glossarLinks: ["zwei-faktor", "malware"],
        },
      },
      {
        id: "konto-3-confirm-mail",
        title: "Die Bestätigungsmail",
        data: {
          type: "fall",
          question: "Welches Detail prüfen Sie zuerst?",
          scenario: {
            type: "email",
            from: "support@lernclub-plus-login.com",
            subject: "Konto bestätigen und Zahlungsdaten vervollständigen",
            content:
              "Kurz nach der Registrierung kommt eine Mail: »Bestätigen Sie Ihr Konto. Ohne Zahlungsdaten wird Ihr Zugang in 30 Minuten gelöscht.« Der Link führt laut Vorschau zu lernclub-plus-login.com/zahlung.",
          },
          options: [
            "Ob die Absender-Domain wirklich zum Dienst gehört",
            "Ob die Mail höflich formuliert ist",
            "Ob die Frist kurz ist und deshalb wichtig wirkt",
            "Ob ein Button enthalten ist",
          ],
          correct: 0,
          explanation:
            "Ähnliche Domains sind ein klassischer Trick. Öffnen Sie die Website selbst über die bekannte Adresse, statt auf Druck-Links in Mails zu klicken.",
          glossarLinks: ["domain-spoofing", "phishing", "domain"],
        },
      },
      {
        id: "konto-4-permissions",
        title: "Das verknüpfte Profil",
        data: {
          type: "fall",
          question: "Welche Berechtigung ist überzogen?",
          scenario: {
            type: "social",
            sender: "Lernclub Plus App",
            content:
              "Die App möchte Ihr Profilbild anzeigen. Zusätzlich fordert sie Zugriff auf alle Kontakte, private Nachrichten, Standort im Hintergrund und die Erlaubnis, in Ihrem Namen Beiträge zu posten.",
          },
          options: [
            "Profilbild anzeigen",
            "In Ihrem Namen Beiträge posten und private Nachrichten lesen",
            "Benachrichtigungen für Kursupdates",
            "Sprache der App speichern",
          ],
          correct: 1,
          explanation:
            "Berechtigungen sollten zum Zweck passen. Zugriff auf private Nachrichten oder Posten im Namen des Nutzers ist für eine Lern-App nicht nötig.",
          glossarLinks: ["datenschutz", "social-engineering"],
        },
      },
    ],
  },
  {
    id: "reisevorbereitung",
    title: "Die Reisevorbereitung",
    subtitle: "Buchung, QR-Code, Messenger und öffentliche Netze.",
    setting: "Vor einer kurzen Reise prüfen Sie Angebote, Nachrichten und Zugänge, bevor unterwegs etwas schiefgeht.",
    theme: "Reise",
    topics: ["news", "scamming", "socialmedia", "general"],
    steps: [
      {
        id: "reise-1-warning-news",
        title: "Die angebliche Streikmeldung",
        data: {
          type: "fall",
          question: "Was sollten Sie tun, bevor Sie umplanen?",
          scenario: {
            type: "social",
            sender: "TravelBreaking_DE",
            url: "flug-chaos-heute.info",
            content:
              "»EILMELDUNG: Alle Flüge morgen gestrichen! Insider berichten von geheimem Streik. Teile diese Warnung sofort!« Der Post nennt keinen Flughafen, keine Airline, keine Uhrzeit und keine Quelle.",
          },
          options: [
            "Sofort stornieren, weil es eine Eilmeldung ist",
            "Offizielle Seiten von Flughafen, Airline oder Bahn prüfen",
            "Den Post teilen und abwarten",
            "Nur die Kommentare lesen",
          ],
          correct: 1,
          explanation:
            "Reisemeldungen sollten über offizielle Anbieter oder seriöse Medien geprüft werden. Unklare Eilmeldungen ohne Quelle können Falschinformationen sein.",
          glossarLinks: ["fake-news", "clickbait", "filterbubble"],
        },
      },
      {
        id: "reise-2-booking-message",
        title: "Nachricht der Unterkunft",
        data: {
          type: "fall",
          question: "Was ist hier verdächtig?",
          scenario: {
            type: "chat",
            sender: "Unterkunft Hafenblick (angeblich)",
            content:
              "»Ihre Buchung wird storniert, wenn Sie nicht heute außerhalb der Plattform neu zahlen. Nutzen Sie diesen Link und ignorieren Sie Nachrichten in der Buchungs-App: hafenblick-payment.net.«",
          },
          options: [
            "Zahlung außerhalb der Plattform und Druck mit Stornierung",
            "Dass die Unterkunft freundlich schreibt",
            "Dass ein Link enthalten ist, denn Links sind immer verboten",
            "Dass die Nachricht kurz ist",
          ],
          correct: 0,
          explanation:
            "Bei Buchungsplattformen sollten Zahlung und Kommunikation in der offiziellen App bleiben. Externe Links und Zeitdruck sind starke Warnzeichen.",
          glossarLinks: ["phishing", "social-engineering", "domain"],
        },
      },
      {
        id: "reise-3-qr-menu",
        title: "QR-Code im Cafe",
        data: {
          type: "fall",
          question: "Welche Beobachtung ist ein Warnsignal?",
          scenario: {
            type: "web",
            url: "cafe-menu-pay.net/login",
            content:
              "Im Cafe klebt ein QR-Code über einem alten Aufkleber. Nach dem Scannen öffnet sich keine Speisekarte, sondern eine Login-Seite, die E-Mail-Passwort und Kreditkartendaten verlangt, bevor Sie das Menü sehen können.",
          },
          options: [
            "Ein QR-Code führt zu einer Speisekarte",
            "Eine Menüseite verlangt Passwort und Kreditkartendaten",
            "Die Seite ist auf Deutsch",
            "Der QR-Code ist schwarz-weiß",
          ],
          correct: 1,
          explanation:
            "Für eine Speisekarte sind Login- und Zahlungsdaten nicht nötig. Überklebte QR-Codes können auf Phishing-Seiten führen.",
          glossarLinks: ["phishing", "domain", "malware"],
        },
      },
      {
        id: "reise-4-public-wifi",
        title: "WLAN im Hotel",
        data: {
          type: "fall",
          question: "Welche Handlung ist am sichersten?",
          scenario: {
            type: "web",
            url: "Hotel_Free_WiFi",
            content:
              "In der Lobby sehen Sie zwei WLAN-Netze: »Hotel_Hafenblick« laut Rezeption und »Hotel_Free_WiFi_Schnell«. Das zweite Netz öffnet direkt eine Seite, die Ihr E-Mail-Passwort verlangt, um Internet freizuschalten.",
          },
          options: [
            "Das schnellere Netz nutzen und Passwort eingeben",
            "Das von der Rezeption bestätigte Netz verwenden und keine fremden Login-Daten eingeben",
            "Beide Netze ausprobieren",
            "Das Passwort eingeben und danach ändern",
          ],
          correct: 1,
          explanation:
            "Nutzen Sie nur bestätigte Netze und geben Sie keine Konto-Passwörter auf fremden WLAN-Portalen ein. Verdächtige Portale können Zugangsdaten abgreifen.",
          glossarLinks: ["vpn", "phishing", "datenschutz"],
        },
      },
    ],
  },
];
