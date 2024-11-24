import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  resolve: {
    alias: {
      "face-api.js": "face-api.js/dist/face-api.js", // सुनिश्चित करें कि सही पथ है
    },
  },
  plugins: [react()],
});
