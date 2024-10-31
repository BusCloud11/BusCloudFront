import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000, // 포트를 3000으로 설정
  },
  plugins: [react()],
});
