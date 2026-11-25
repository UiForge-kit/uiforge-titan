import type { FontFamily } from "@/types/settings";

// `data-font` on <html> overrides --ui-family
export interface FontOption {
  id: FontFamily;
  label: string;
  hint: string;
  variable: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: "auto",
    label: "Automatique",
    hint: "Suit la police du thème actif",
    variable: "var(--ui-family)",
  },
  {
    id: "sans",
    label: "Inter",
    hint: "Sans-serif neutre, très lisible en petit corps",
    variable: "var(--font-inter)",
  },
  {
    id: "display",
    label: "Space Grotesk",
    hint: "Grotesque géométrique, plus de caractère dans les titres",
    variable: "var(--font-space-grotesk)",
  },
  {
    id: "serif",
    label: "Lora",
    hint: "Serif de lecture, confortable sur les réponses longues",
    variable: "var(--font-lora)",
  },
  {
    id: "mono",
    label: "Geist Mono",
    hint: "Chasse fixe, aligne le code et les chiffres",
    variable: "var(--font-geist-mono)",
  },
];
