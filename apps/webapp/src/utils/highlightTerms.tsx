import React from "react";
import { glossarTerms } from "@medienkundig/ui";
import { GlossarTerm } from "../glossar/GlossarTerm";

export function HighlightTerms({
  text,
  ids,
}: {
  text: string;
  ids?: string[];
}): React.ReactElement {
  if (!ids?.length) return <>{text}</>;

  const terms = ids
    .map((id) => glossarTerms.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => !!t)
    .sort((a, b) => b.term.length - a.term.length); // longest match first

  if (!terms.length) return <>{text}</>;

  const pattern = terms
    .map((t) => t.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const match = terms.find((t) => t.term.toLowerCase() === part.toLowerCase());
        if (match) {
          return (
            <GlossarTerm key={i} id={match.id}>
              {part}
            </GlossarTerm>
          );
        }
        return part || null;
      })}
    </>
  );
}
