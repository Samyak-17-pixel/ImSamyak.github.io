import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.join(root, "src") },
  },
  base: "./",
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Function form so shared deps (react-dom/client, scheduler, babel helpers)
        // don't end up in the three chunk and force it onto the first page load.
        manualChunks(id) {
          if (id.includes("vite/preload-helper")) return "vendor";
          if (!id.includes("node_modules")) return undefined;
          if (/node_modules\/(three|@react-three|three-stdlib|troika|@monogrid|camera-controls|maath|meshline|stats|suspend-react|its-fine|react-use-measure|react-reconciler)/.test(id)) return "three";
          if (/node_modules\/(gsap|lenis|framer-motion|motion-dom|motion-utils)/.test(id)) return "motion";
          return "vendor";
        },
      },
    },
  },
});
