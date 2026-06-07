import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@supabase")) return "supabase";
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    allowedHosts: ["medienkundig.local", "app.medienkundig.local", "localhost", "app.localhost"],
  },
});
