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

interface RouteMeta {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  schemas?: unknown[];
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function injectJsonLd(html: string, schemas: unknown[]): string {
  const blocks = schemas
    .map((s) => `  <script type="application/ld+json">\n  ${JSON.stringify(s, null, 2).replace(/\n/g, "\n  ")}\n  </script>`)
    .join("\n");
  return html.replace("</head>", `${blocks}\n</head>`);
}

function injectHeadMeta(
  html: string,
  meta: RouteMeta & { canonical: string; ogUrl: string; ogImageUrl: string }
): string {
  const ogTitle = escapeAttr(meta.ogTitle ?? meta.title);
  const ogDesc = escapeAttr(meta.ogDescription ?? meta.description);
  const title = escapeAttr(meta.title);
  const desc = escapeAttr(meta.description);

  return html
    .replace(/<title>[^<]+<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/,  `$1${desc}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/,  `$1${ogTitle}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/,  `$1${ogDesc}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/,  `$1${escapeAttr(meta.ogUrl)}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/,  `$1${escapeAttr(meta.ogImageUrl)}$2`)
    .replace(/(<meta property="og:image:alt" content=")[^"]*(")/,  `$1${ogTitle}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/,  `$1${ogTitle}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/,  `$1${ogDesc}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/,  `$1${escapeAttr(meta.ogImageUrl)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/,  `$1${escapeAttr(meta.canonical)}$2`);
}

function prerenderMetaPlugin(): Plugin {
  return {
    name: "prerender-meta",
    apply: "build",
    closeBundle() {
      const rawDomains = process.env.REPLIT_DOMAINS ?? "";
      const host = rawDomains.split(",")[0]?.trim();
      const baseUrl = host ? `https://${host}` : "";
      const outDir = path.resolve(import.meta.dirname, "dist/public");
      const templatePath = path.join(outDir, "index.html");

      if (!fs.existsSync(templatePath)) return;

      const template = fs.readFileSync(templatePath, "utf8");
      const ogImage = baseUrl ? `${baseUrl}/opengraph.jpg` : "/opengraph.jpg";

      const origin = baseUrl || "";

      const orgSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Lumora",
        "description": "A boutique digital agency crafting premium, high-performance web experiences for ambitious brands.",
        "email": "hello.lumoradesign@gmail.com",
        "telephone": "+44 7366 130603",
        "url": origin || undefined,
        "sameAs": ["https://www.instagram.com/lumora_ig/"],
        "serviceType": ["Web Design", "Web Development", "UI/UX Design", "Brand Identity", "SEO Optimization", "Conversion Optimization"],
      };

      const routes: Array<{ routePath: string; outPath: string; meta: RouteMeta }> = [
        {
          routePath: "/",
          outPath: "index.html",
          meta: {
            title: "Lumora — Premium Web Design & Development Agency",
            description:
              "Lumora is a boutique digital agency crafting premium, high-performance web experiences for ambitious brands. Expert web design, development, and SEO.",
            ogTitle: "Lumora — Premium Web Design & Development Agency",
            ogDescription:
              "A boutique digital agency crafting premium, high-performance web experiences for ambitious brands who refuse to settle for ordinary.",
            schemas: [
              orgSchema,
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Lumora",
                "url": origin || undefined,
              },
            ],
          },
        },
        {
          routePath: "/portfolio",
          outPath: "portfolio/index.html",
          meta: {
            title: "Portfolio — Lumora Agency",
            description:
              "Browse Lumora's portfolio of premium web design and development projects across business, e-commerce, healthcare, trades, and restaurants.",
            ogTitle: "Portfolio — Lumora Agency",
            ogDescription:
              "Explore our portfolio of premium web experiences — from gym membership portals to luxury e-commerce storefronts and local trade websites.",
            schemas: [
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": `${origin}/` },
                  { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": `${origin}/portfolio` },
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "Portfolio — Lumora Agency",
                "description": "Browse Lumora's portfolio of premium web design and development projects across business, e-commerce, healthcare, trades, and restaurants.",
                "url": `${origin}/portfolio`,
              },
            ],
          },
        },
        ...projects.map((p) => ({
          routePath: `/portfolio/${p.slug}`,
          outPath: `portfolio/${p.slug}/index.html`,
          meta: {
            title: `${p.title} — Lumora Portfolio`,
            description: p.shortDescription,
            ogTitle: `${p.title} — Case Study | Lumora`,
            ogDescription: p.shortDescription,
            schemas: [
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": `${origin}/` },
                  { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": `${origin}/portfolio` },
                  { "@type": "ListItem", "position": 3, "name": p.title, "item": `${origin}/portfolio/${p.slug}` },
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": p.title,
                "description": p.shortDescription,
                "url": `${origin}/portfolio/${p.slug}`,
                "author": { "@type": "Organization", "name": "Lumora" },
                "publisher": { "@type": "Organization", "name": "Lumora" },
                "about": { "@type": "Thing", "name": p.industry },
              },
            ],
          },
        })),
      ];

      for (const route of routes) {
        const canonical = baseUrl ? `${baseUrl}${route.routePath}` : route.routePath;
        let html = injectHeadMeta(template, {
          ...route.meta,
          canonical,
          ogUrl: canonical,
          ogImageUrl: ogImage,
        });
        if (route.meta.schemas && route.meta.schemas.length > 0) {
          html = injectJsonLd(html, route.meta.schemas);
        }

        const outFilePath = path.join(outDir, route.outPath);
        fs.mkdirSync(path.dirname(outFilePath), { recursive: true });
        fs.writeFileSync(outFilePath, html);
      }
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
    prerenderMetaPlugin(),
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
