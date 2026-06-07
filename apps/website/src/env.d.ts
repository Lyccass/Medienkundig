/// <reference path="../.astro/types.d.ts" />

interface Window {
  __lightbox?: {
    open: (src: string, alt?: string) => void;
    close: () => void;
  };
  __glossar?: {
    open: (id: string) => void;
    close: () => void;
  };
}
