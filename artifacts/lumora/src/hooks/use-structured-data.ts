import { useEffect } from "react";

export function useStructuredData(schema: Record<string, unknown> | Record<string, unknown>[]) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-structured-data", "true");
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [JSON.stringify(schema)]);
}
