import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const colorContrastRatioCalculator: CalculatorDefinition = {
  slug: "color-contrast-ratio-calculator",
  title: "Color Contrast Ratio Calculator",
  description: "Calculate WCAG color contrast ratio from luminance.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["wcag contrast","color contrast ratio"],
  variants: [{
    id: "standard",
    name: "Color Contrast Ratio",
    description: "Calculate WCAG color contrast ratio from luminance.",
    fields: [
      { name: "fgLuminance", label: "Foreground Luminance (0-1)", type: "number", min: 0, max: 1, defaultValue: 0.05 },
      { name: "bgLuminance", label: "Background Luminance (0-1)", type: "number", min: 0, max: 1, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const fg = inputs.fgLuminance as number;
      const bg = inputs.bgLuminance as number;
      if (fg === undefined || bg === undefined) return null;
      const lighter = Math.max(fg, bg);
      const darker = Math.min(fg, bg);
      const ratio = Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
      const aaLarge = ratio >= 3 ? "Pass" : "Fail";
      const aaNormal = ratio >= 4.5 ? "Pass" : "Fail";
      const aaaNormal = ratio >= 7 ? "Pass" : "Fail";
      return {
        primary: { label: "Contrast Ratio", value: ratio + ":1" },
        details: [
          { label: "WCAG AA (normal text)", value: aaNormal },
          { label: "WCAG AA (large text)", value: aaLarge },
          { label: "WCAG AAA (normal text)", value: aaaNormal },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What contrast ratio is needed for WCAG AA?", answer: "4.5:1 for normal text and 3:1 for large text." },
    { question: "What is relative luminance?", answer: "A measure of light intensity from 0 (black) to 1 (white)." },
  ],
  formula: "Ratio = (L1 + 0.05) / (L2 + 0.05)",
};
