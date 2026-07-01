import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";
import { projects } from "./src/data/projects";

function sitemapPlugin(): Plugin {
  return {
    name: "generate-sitemap",
    closeBundle() {
      const host = "lumoradesign.uk";
      const base = `https://${host}`;
      const outDir = path.resolve(import.meta.dirname, "dist/public");

      fs.mkdirSync(outDir, { recursive: true });

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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
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

function buildHomeBodyHtml(origin: string): string {
  const featuredProjects = projects.filter((p) => p.featured);
  const projectLinks = projects
    .map((p) => `<li><a href="${origin}/portfolio/${p.slug}">${escapeHtml(p.title)}</a> — ${escapeHtml(p.shortDescription)}</li>`)
    .join("\n        ");
  const featuredCards = featuredProjects
    .map(
      (p) =>
        `<article>
          <h3><a href="${origin}/portfolio/${p.slug}">${escapeHtml(p.title)}</a></h3>
          <p>${escapeHtml(p.category)} · ${escapeHtml(p.industry)}</p>
          <p>${escapeHtml(p.shortDescription)}</p>
        </article>`
    )
    .join("\n        ");

  return `<div id="root"><header>
      <nav>
        <a href="${origin}/">Lumora</a>
        <a href="${origin}/portfolio">Portfolio</a>
      </nav>
    </header>
    <main>
      <section>
        <h1>We Build Websites That Convert.</h1>
        <p>A boutique digital agency crafting premium, high-performance web experiences for ambitious brands who refuse to settle for ordinary.</p>
      </section>
      <section>
        <h2>Selected Work</h2>
        ${featuredCards}
        <p><a href="${origin}/portfolio">View all projects</a></p>
      </section>
      <section>
        <h2>All Projects</h2>
        <ul>
        ${projectLinks}
        </ul>
      </section>
    </main></div>`;
}

function buildPortfolioBodyHtml(origin: string): string {
  const projectCards = projects
    .map(
      (p) =>
        `<article>
          <h2><a href="${origin}/portfolio/${p.slug}">${escapeHtml(p.title)}</a></h2>
          <p>${escapeHtml(p.category)} · ${escapeHtml(p.industry)}</p>
          <p>${escapeHtml(p.shortDescription)}</p>
          <a href="${origin}/portfolio/${p.slug}">View Case Study</a>
        </article>`
    )
    .join("\n      ");

  return `<div id="root"><header>
      <nav>
        <a href="${origin}/">Home</a>
        <a href="${origin}/portfolio">Portfolio</a>
      </nav>
    </header>
    <main>
      <h1>Portfolio — Lumora Agency</h1>
      <p>Browse our portfolio of premium web design and development projects.</p>
      <section>
      ${projectCards}
      </section>
    </main></div>`;
}

function buildCaseStudyBodyHtml(p: (typeof projects)[number], origin: string): string {
  const resultItems = p.results
    .map((r) => `<li><strong>${escapeHtml(r.value)}</strong> ${escapeHtml(r.label)}</li>`)
    .join("\n        ");
  const featureItems = p.keyFeatures
    .map((f) => `<li>${escapeHtml(f)}</li>`)
    .join("\n        ");
  const techItems = p.technologies
    .map((t) => `<li>${escapeHtml(t)}</li>`)
    .join("\n        ");

  return `<div id="root"><header>
      <nav>
        <a href="${origin}/">Home</a>
        <a href="${origin}/portfolio">Portfolio</a>
        <a href="${origin}/portfolio/${p.slug}">${escapeHtml(p.title)}</a>
      </nav>
    </header>
    <main>
      <article>
        <header>
          <h1>${escapeHtml(p.title)}</h1>
          <p>${escapeHtml(p.shortDescription)}</p>
        </header>
        <section><h2>Results</h2><ul>${resultItems}</ul></section>
        <section><h2>Key Features</h2><ul>${featureItems}</ul></section>
        <section><h2>Technologies</h2><ul>${techItems}</ul></section>
        <footer><a href="${origin}/portfolio">View all projects</a></footer>
      </article>
    </main></div>`;
}

function injectBodyHtml(html: string, bodyContent: string): string {
  const wrapped = bodyContent
    .replace(/^<div id="root">/, '<div id="root"><div data-prerender-fallback>')
    .replace(/<\/div>$/, "</div></div>");
  return html.replace(/<div id="root"><\/div>/, wrapped);
}

function prerenderMetaPlugin(): Plugin {
  const origin = "https://lumoradesign.uk";

  return {
    name: "prerender-meta",
    apply: "build",
    closeBundle() {
      const outDir = path.resolve(import.meta.dirname, "dist/public");
      const templatePath = path.join(outDir, "index.html");
      if (!fs.existsSync(templatePath)) return;

      const template = fs.readFileSync(templatePath, "utf8");
      const ogImage = `${origin}/opengraph.jpg`;

      const orgSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Lumora",
        "description": "A boutique digital agency crafting premium, high-performance web experiences for ambitious brands.",
        "email": "hello@lumoradesign.uk",
        "url": origin,
        "serviceType": ["Web Design", "Web Development", "UI/UX Design", "Brand Identity", "SEO Optimization"],
      };

      const routes: Array<{ routePath: string; outPath: string; meta: RouteMeta }> = [
        {
          routePath: "/",
          outPath: "index.html",
          meta: {
            title: "Lumora — Premium Web Design & Development Agency",
            description: "Lumora is a boutique digital agency crafting premium, high-performance web experiences for ambitious brands.",
            schemas: [orgSchema],
          },
        },
        {
          routePath: "/portfolio",
          outPath: "portfolio/index.html",
          meta: {
            title: "Portfolio — Lumora Agency",
            description: "Browse Lumora's portfolio of premium web design and development projects.",
            schemas: [],
          },
        },
        ...projects.map((p) => ({
          routePath: `/portfolio/${p.slug}`,
          outPath: `portfolio/${p.slug}/index.html`,
          meta: {
            title: `${p.title} — Lumora Portfolio`,
            description: p.shortDescription,
            schemas: [],
          },
        })),
      ];

      for (const route of routes) {
        const canonical = `${origin}${route.routePath}`;
        let html = injectHeadMeta(template, {
          ...route.meta,
          canonical,
          ogUrl: canonical,
          ogImageUrl: ogImage,
        });
        if (route.meta.schemas && route.meta.schemas.length > 0) {
          html = injectJsonLd(html, route.meta.schemas);
        }
        if (route.routePath === "/") {
          html = injectBodyHtml(html, buildHomeBodyHtml(origin));
        } else if (route.routePath === "/portfolio") {
          html = injectBodyHtml(html, buildPortfolioBodyHtml(origin));
        } else if (route.routePath.startsWith("/portfolio/")) {
          const slug = route.routePath.replace("/portfolio/", "");
          const project = projects.find((p) => p.slug === slug);
          if (project) html = injectBodyHtml(html, buildCaseStudyBodyHtml(project, origin));
        }
        const outFilePath = path.join(outDir, route.outPath);
        fs.mkdirSync(path.dirname(outFilePath), { recursive: true });
        fs.writeFileSync(outFilePath, html);
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemapPlugin(),
    prerenderMetaPlugin(),
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
    port: 3000,
    host: "0.0.0.0",
  },
});
