import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "VITE_");
  // Only expose VITE_ prefixed env vars to the client. Backend keys like GEMINI_API_KEY
  // should not be injected here.
  const defineEnv: Record<string, string> = {};
  for (const [k, v] of Object.entries(env)) {
    defineEnv[`process.env.${k}`] = JSON.stringify(v);
  }
  return {
    define: defineEnv,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      port: Number(process.env.VITE_PORT || 5173),
      proxy: {
        // Proxy API requests during development to the backend server
        "/api": {
          target: `http://localhost:${process.env.BACKEND_PORT || 3001}`,
          changeOrigin: true,
          secure: false,
          // Ensure cookies set by backend are available to the browser
          cookieDomainRewrite: "localhost",
        },
      },
    },
  };
});
