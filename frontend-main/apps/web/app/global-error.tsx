"use client";

import { useEffect } from "react";
import { reportError } from "@/src/lib/error-reporter";

// Replaces the root layout when it fails to render, so it must
// provide its own <html>/<body> and stay dependency-free.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, "web:global-error-boundary");
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Something went wrong</h1>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>
              A critical error occurred. Please try reloading the application.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: "0.5rem",
                border: "none",
                background: "#1e3a5f",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reload
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
