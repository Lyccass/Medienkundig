import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://medienkundig.local",
  output: "static",
  server: {
    port: 4321,
    host: true,
  },
  vite: {
    ssr: {
      noExternal: ["@medienkundig/ui"],
    },
  },
});
