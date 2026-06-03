import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration for the bulk email sender dashboard
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
});
