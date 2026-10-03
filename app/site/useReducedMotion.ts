"use client";

import { useSyncExternalStore } from "react";

function subscribeReduced(listener: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
const getReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverAnimated = () => false;
const serverStatic = () => true;

export function useReducedMotion(serverSnapshot = false) {
  return useSyncExternalStore(subscribeReduced, getReduced, serverSnapshot ? serverStatic : serverAnimated);
}
