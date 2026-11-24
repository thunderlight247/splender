"use client";

import { useEffect, useState } from "react";

/**
 * True once the component has mounted in the browser.
 * Used so cart values read from localStorage don't cause hydration mismatches.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
