import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { glossarTerms } from "@medienkundig/ui";
import type { GlossarTerm } from "@medienkundig/ui";

interface GlossarCtx {
  open: (id: string) => void;
  close: () => void;
  activeTerm: GlossarTerm | null;
}

const Ctx = createContext<GlossarCtx | null>(null);

export function GlossarProvider({ children }: { children: ReactNode }) {
  const [activeTerm, setActiveTerm] = useState<GlossarTerm | null>(null);

  const open = useCallback((id: string) => {
    const term = glossarTerms.find((t) => t.id === id) ?? null;
    setActiveTerm(term);
  }, []);

  const close = useCallback(() => setActiveTerm(null), []);

  return (
    <Ctx.Provider value={{ open, close, activeTerm }}>
      {children}
    </Ctx.Provider>
  );
}

export function useGlossar() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGlossar must be used inside GlossarProvider");
  return ctx;
}
