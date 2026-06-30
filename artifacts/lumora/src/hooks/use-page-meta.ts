import { useEffect } from "react";

interface PageMeta {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  canonical?: string;
}

function setMetaContent(selector: string, attrName: string, attrValue: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function usePageMeta({ title, description, ogTitle, ogDescription, ogUrl, canonical }: PageMeta) {
  useEffect(() => {
    const resolvedOgTitle = ogTitle ?? title;
    const resolvedOgDesc = ogDescription ?? description;

    document.title = title;

    setMetaContent('meta[name="description"]', "name", "description", description);
    setMetaContent('meta[property="og:title"]', "property", "og:title", resolvedOgTitle);
    setMetaContent('meta[property="og:description"]', "property", "og:description", resolvedOgDesc);
    setMetaContent('meta[name="twitter:title"]', "name", "twitter:title", resolvedOgTitle);
    setMetaContent('meta[name="twitter:description"]', "name", "twitter:description", resolvedOgDesc);

    setMetaContent('meta[property="og:site_name"]', "property", "og:site_name", "Lumora");
    setMetaContent('meta[property="og:locale"]', "property", "og:locale", "en_GB");

    if (ogUrl) {
      setMetaContent('meta[property="og:url"]', "property", "og:url", ogUrl);
    }

    const resolvedCanonical = canonical ?? (typeof window !== "undefined" ? window.location.pathname : "/");
    setCanonical(resolvedCanonical);
  }, [title, description, ogTitle, ogDescription, ogUrl, canonical]);
}
