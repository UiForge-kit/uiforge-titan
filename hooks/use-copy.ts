"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useCopy(delay = 1600) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // insecure context or permission denied: the field stays selectable by hand
        return;
      }
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), delay);
    },
    [delay],
  );

  return { copied, copy };
}
