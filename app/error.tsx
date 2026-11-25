"use client";

import { useEffect } from "react";
import Link from "next/link";

// without this, an exception in any component swaps the whole app for Next's generic screen
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: report to an error tracker
    console.error(error);
  }, [error]);

  return (
    <div className="bg-canvas flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-xl font-semibold">Quelque chose s&apos;est mal passé</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        L&apos;écran n&apos;a pas pu s&apos;afficher. Vos données restent enregistrées localement
        localement.
      </p>
      {error.digest && (
        <code className="bg-muted text-muted-foreground rounded px-2 py-1 font-mono text-xs">
          {error.digest}
        </code>
      )}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={reset}
          className="bg-primary text-primary-foreground h-9 rounded-lg px-4 text-sm font-medium"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="border-border h-9 rounded-lg border px-4 text-sm leading-9 font-medium"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
