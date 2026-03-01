import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const printResolutionCalculator: CalculatorDefinition = {
  slug: "print-resolution-calculator",
  title: "Print Resolution Calculator",
  description: "Calculate maximum print size from pixel dimensions and DPI.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["print resolution","pixels to print size"],
  variants: [{
    id: "standard",
    name: "Print Resolution",
    description: "Calculate maximum print size from pixel dimensions and DPI.",
    fields: [
      { name: "widthPx", label: "Image Width (px)", type: "number", min: 1, max: 50000, defaultValue: 4000 },
      { name: "heightPx", label: "Image Height (px)", type: "number", min: 1, max: 50000, defaultValue: 3000 },
      { name: "dpi", label: "Print DPI", type: "number", min: 72, max: 1200, defaultValue: 300 },
    ],
    calculate: (inputs) => {
      const wPx = inputs.widthPx as number;
      const hPx = inputs.heightPx as number;
      const dpi = inputs.dpi as number;
      if (!wPx || !hPx || !dpi) return null;
      const wIn = wPx / dpi;
      const hIn = hPx / dpi;
      const wCm = wIn * 2.54;
      const hCm = hIn * 2.54;
      const megapixels = (wPx * hPx) / 1000000;
      return {
        primary: { label: "Print Size", value: formatNumber(Math.round(wIn * 10) / 10) + " x " + formatNumber(Math.round(hIn * 10) / 10) + " in" },
        details: [
          { label: "Size (cm)", value: formatNumber(Math.round(wCm * 10) / 10) + " x " + formatNumber(Math.round(hCm * 10) / 10) },
          { label: "Megapixels", value: formatNumber(Math.round(megapixels * 10) / 10) + " MP" },
          { label: "Total Pixels", value: formatNumber(wPx * hPx) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What DPI is best for printing?", answer: "300 DPI is the standard for high-quality photo prints." },
    { question: "Can I print at 150 DPI?", answer: "150 DPI is acceptable for large prints viewed from a distance." },
  ],
  formula: "Print Size = Pixels / DPI",
};
