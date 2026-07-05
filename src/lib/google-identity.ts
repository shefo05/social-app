// Minimal ambient types for the bits of Google Identity Services (GSI)
// this app actually uses - there's no official @types package for it.
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              shape?: "rectangular" | "pill" | "circle" | "square";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              logo_alignment?: "left" | "center";
              locale?: string;
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

const SCRIPT_BASE = "https://accounts.google.com/gsi/client";

// GSI's button/prompt language comes from the `hl` query param on the
// script itself (renderButton's own `locale` option is unreliable in
// practice) - keyed by locale so switching languages loads a fresh
// script tag instead of being stuck with whichever loaded first.
const scriptPromises = new Map<string, Promise<void>>();

/** Idempotent per locale - safe to call from every mounted GoogleButton. */
export function loadGoogleIdentityScript(locale: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const existingPromise = scriptPromises.get(locale);
  if (existingPromise) return existingPromise;

  const src = `${SCRIPT_BASE}?hl=${encodeURIComponent(locale)}`;
  const promise = new Promise<void>((resolve, reject) => {
    const existingTag = document.querySelector(`script[src="${src}"]`);
    if (existingTag) {
      existingTag.addEventListener("load", () => resolve());
      existingTag.addEventListener("error", () => reject(new Error("Failed to load Google Identity Services")));
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(script);
  });

  scriptPromises.set(locale, promise);
  return promise;
}
