import { useState } from "react";
import { ArrowLeft, CheckCircle2, Lock, LogOut, Mail, User } from "lucide-react";
import { loginWithPassword, registerWithPassword, requestPasswordReset, signOut } from "../lib/supabase/auth";
import type { AuthState } from "../lib/supabase/useAuthStatus";
import styles from "./AuthPage.module.css";

interface Props {
  auth: AuthState;
  onBack: () => void;
  onAuthSuccess: () => void;
}

type AuthMode = "login" | "register" | "reset";

export function AuthPage({ auth, onBack, onAuthSuccess }: Props) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    if (mode === "reset") {
      const result = await requestPasswordReset(email.trim());
      if (!result.ok) {
        setStatus("error");
        setMessage(result.message);
        return;
      }
      setStatus("sent");
      setMessage("Wir haben dir eine E-Mail zum Zurücksetzen des Passworts geschickt.");
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setMessage("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }

    if (mode === "register" && password !== passwordRepeat) {
      setStatus("error");
      setMessage("Die Passwörter stimmen nicht überein.");
      return;
    }

    const result = mode === "register"
      ? await registerWithPassword({
          displayName: displayName.trim(),
          email: email.trim(),
          password,
        })
      : await loginWithPassword({
          email: email.trim(),
          password,
        });

    if (!result.ok) {
      setStatus("error");
      setMessage(result.message);
      return;
    }

    if (mode === "register" && result.needsConfirmation) {
      setStatus("sent");
      setMessage("Konto angelegt. Bitte bestätige deine E-Mail-Adresse.");
      return;
    }

    setStatus("sent");
    setMessage(mode === "register" ? "Konto angelegt." : "Angemeldet.");
    onAuthSuccess();
    onBack();
  }

  async function handleSignOut() {
    await signOut();
    onBack();
  }

  if (auth.isRegistered) {
    return (
      <main className={styles.page}>
        <section className={styles.intro}>
          <p className={styles.eyebrow}>Konto</p>
          <h1 className={styles.title}>Angemeldet</h1>
          <p className={styles.copy}>Dein Fortschritt wird gespeichert und bleibt auf anderen Geräten verfügbar.</p>
        </section>

        <section className={styles.panel}>
          <CheckCircle2 className={styles.stateIcon} size={34} strokeWidth={2.2} />
          <p className={styles.panelEyebrow}>Aktive Sitzung</p>
          <h2 className={styles.panelTitle}>{auth.email ?? "Medienkundig Konto"}</h2>
          <div className={styles.actions}>
            <button type="button" className={styles.primaryAction} onClick={onBack}>
              Weiterlernen
            </button>
            <button type="button" className={styles.secondaryAction} onClick={handleSignOut}>
              <LogOut size={18} strokeWidth={2.2} />
              Abmelden
            </button>
          </div>
        </section>
      </main>
    );
  }

  const isRegister = mode === "register";
  const isReset = mode === "reset";

  return (
    <main className={styles.page}>
      <section className={styles.intro}>
        <button type="button" className={styles.backLink} onClick={onBack}>
          <ArrowLeft size={18} strokeWidth={2.2} />
          Zur App
        </button>
        <p className={styles.eyebrow}>{isRegister ? "Registrieren" : isReset ? "Passwort" : "Einloggen"}</p>
        <h1 className={styles.title}>{isRegister ? "Konto erstellen" : isReset ? "Passwort zurücksetzen" : "Willkommen zurück"}</h1>
        <p className={styles.copy}>
          {isReset
            ? "Gib deine E-Mail-Adresse ein. Wir senden dir einen Link zum Zurücksetzen."
            : isRegister
            ? "Lege ein Konto mit E-Mail und Passwort an. Nach der Bestätigung wird dein Fortschritt synchronisiert."
            : "Melde dich mit E-Mail und Passwort an, um mit deinem gespeicherten Fortschritt weiterzulernen."}
        </p>
      </section>

      <section className={styles.panel}>
        <div className={styles.modeSwitch} role="tablist" aria-label="Kontoaktion">
          <button
            type="button"
            className={`${styles.modeButton} ${mode === "login" ? styles.modeButtonActive : ""}`}
            onClick={() => setMode("login")}
            role="tab"
            aria-selected={mode === "login"}
          >
            Einloggen
          </button>
          <button
            type="button"
            className={`${styles.modeButton} ${mode === "register" ? styles.modeButtonActive : ""}`}
            onClick={() => setMode("register")}
            role="tab"
            aria-selected={mode === "register"}
          >
            Registrieren
          </button>
        </div>

        <p className={styles.panelEyebrow}>Konto</p>
        <h2 className={styles.panelTitle}>{isReset ? "Reset-Link anfordern" : isRegister ? "Neue Zugangsdaten" : "Zugangsdaten"}</h2>

        <form className={styles.form} onSubmit={submit}>
          {isRegister && (
            <label className={styles.field}>
              <span className={styles.label}>Anzeigename</span>
              <span className={styles.inputWrap}>
                <User size={18} strokeWidth={2.2} className={styles.inputIcon} />
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="name"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Dein Name"
                  required
                />
              </span>
            </label>
          )}

          <label className={styles.field}>
            <span className={styles.label}>E-Mail-Adresse</span>
            <span className={styles.inputWrap}>
              <Mail size={18} strokeWidth={2.2} className={styles.inputIcon} />
              <input
                className={styles.input}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                required
              />
            </span>
          </label>

          {!isReset && (
          <label className={styles.field}>
            <span className={styles.label}>Passwort</span>
            <span className={styles.inputWrap}>
              <Lock size={18} strokeWidth={2.2} className={styles.inputIcon} />
              <input
                className={styles.input}
                type="password"
                autoComplete={isRegister ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </span>
          </label>
          )}

          {isRegister && !isReset && (
            <label className={styles.field}>
              <span className={styles.label}>Passwort wiederholen</span>
              <span className={styles.inputWrap}>
                <Lock size={18} strokeWidth={2.2} className={styles.inputIcon} />
                <input
                  className={styles.input}
                  type="password"
                  autoComplete="new-password"
                  value={passwordRepeat}
                  onChange={(event) => setPasswordRepeat(event.target.value)}
                  minLength={8}
                  required
                />
              </span>
            </label>
          )}

          {message && (
            <p className={status === "error" ? styles.error : styles.success}>{message}</p>
          )}

          <button type="submit" className={styles.primaryAction} disabled={status === "sending"}>
            {status === "sending" ? "Prüfen ..." : isReset ? "Reset-Link senden" : isRegister ? "Konto erstellen" : "Einloggen"}
          </button>
        </form>

        {!isRegister && (
          <button type="button" className={styles.textAction} onClick={() => setMode(isReset ? "login" : "reset")}>
            {isReset ? "Zurück zum Login" : "Passwort vergessen?"}
          </button>
        )}

        <p className={styles.note}>
          Nach der Registrierung musst du deine E-Mail-Adresse bestätigen.
        </p>
      </section>
    </main>
  );
}
