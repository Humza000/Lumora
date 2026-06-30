import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { projects } from "./src/data/projects";

function sitemapPlugin(): Plugin {
  return {
    name: "generate-sitemap",
    closeBundle() {
      const rawDomains = process.env.REPLIT_DOMAINS ?? "";
      const host = rawDomains.split(",")[0]?.trim();
      if (!host) return;
      const base = `https://${host}`;
      const outDir = path.resolve(import.meta.dirname, "dist/public");

      const staticPaths = ["/", "/portfolio"];
      const slugPaths = projects.map((p) => `/portfolio/${p.slug}`);
      const allPaths = [...staticPaths, ...slugPaths];

      const today = new Date().toISOString().split("T")[0];
      const xml = [
        `<?xml version="1.0" encoding="UTF-8"?>`,
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
        ...allPaths.map(
          (p) =>
            `  <url><loc>${base}${p}</loc><lastmod>${today}</lastmod></url>`
        ),
        `</urlset>`,
      ].join("\n");

      fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml);

      const robotsPath = path.join(outDir, "robots.txt");
      let robots = fs.existsSync(robotsPath)
        ? fs.readFileSync(robotsPath, "utf8")
        : "User-agent: *\nAllow: /\n";
      if (!robots.includes("Sitemap:")) {
        robots = robots.trimEnd() + `\nSitemap: ${base}/sitemap.xml\n`;
      }
      fs.writeFileSync(robotsPath, robots);
    },
  };
}

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    sitemapPlugin(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
