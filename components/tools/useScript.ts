import { useState, useEffect } from "react";

export function useScript(src: string): "loading" | "ready" | "error" {
  const [status, setStatus] = useState<"loading" | "ready" | "error">(() => {
    if (typeof window === "undefined") return "loading";
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      const dataStatus = existing.getAttribute("data-status");
      return (dataStatus as "ready" | "error") || "ready";
    }
    return "loading";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute("data-status", "loading");
      document.body.appendChild(script);

      const setAttributeFromEvent = (event: Event) => {
        script.setAttribute(
          "data-status",
          event.type === "load" ? "ready" : "error"
        );
      };

      script.addEventListener("load", setAttributeFromEvent);
      script.addEventListener("error", setAttributeFromEvent);
    }

    const setStateFromEvent = (event: Event) => {
      setStatus(event.type === "load" ? "ready" : "error");
    };

    script.addEventListener("load", setStateFromEvent);
    script.addEventListener("error", setStateFromEvent);

    return () => {
      if (script) {
        script.removeEventListener("load", setStateFromEvent);
        script.removeEventListener("error", setStateFromEvent);
      }
    };
  }, [src]);

  return status;
}
