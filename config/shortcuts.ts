export interface Shortcut {
  id: string;
  label: string;
  /** `mod` is ⌘ on macOS, Ctrl elsewhere. */
  keys: string[];
}

export const SHORTCUTS: Shortcut[] = [
  { id: "search", label: "Recherche globale", keys: ["mod", "K"] },
  { id: "sidebar", label: "Replier la barre latérale", keys: ["mod", "B"] },
  { id: "scheme", label: "Basculer clair / sombre", keys: ["mod", "⇧", "L"] },
  { id: "settings", label: "Réglages", keys: ["mod", ","] },
];
