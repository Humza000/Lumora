import { useEffect } from "react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [location] = useLocation();

  useEffect(() => {
    const existing = document.querySelector('meta[name="robots"][data-dynamic]');
    if (existing) existing.remove();
    const meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex, nofollow");
    meta.setAttribute("data-dynamic", "true");
    document.head.appendChild(meta);
    return () => meta.remove();
  }, [location]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 font-sans">
      <div className="text-center px-6">
        <p className="text-7xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-block bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
