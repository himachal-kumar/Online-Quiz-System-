import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        exportType: "named",
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: "**/*.svg",
    }),
    react(),
  ],
  optimizeDeps: {
    exclude: [
      "chunk-UKWZSG42",
      "chunk-UMKVLHJC",
      "chunk-XXZLPCMU",
      "chunk-REIBRQ2K",
      "chunk-YZGMKPSK",
      "chunk-FPQUTFUW",
      "chunk-W7BWLVL7",
      "chunk-XKVVF5GA",
      "chunk-6NMVILZ7",
      "chunk-K4ECSOVW"
    ]
  }
});
