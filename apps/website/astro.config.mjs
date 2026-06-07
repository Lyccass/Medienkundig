import { defineConfig } from "astro/config";

export default defineConfig({
  site: "http://medienkundig.local",
  output: "static",
  server: {
    port: 4321,
    host: true,
  },
  vite: {
    server: {
      allowedHosts: ["medienkundig.local", "app.medienkundig.local", "localhost", "app.localhost"],
    },
    ssr: {
      noExternal: ["@medienkundig/ui"],
    },
  },
});
