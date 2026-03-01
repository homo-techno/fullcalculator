import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ringSizeConverterCalculator: CalculatorDefinition = {
  slug: "ring-size-converter",
  title: "Ring Size Converter",
  description: "Convert ring sizes between US, UK, and EU sizing standards with circumference.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["ring size converter", "ring size chart", "finger size converter"],
  variants: [{
    id: "standard",
    name: "Ring Size",
    description: "Convert ring sizes between US, UK, and EU sizing standards with circumference",
    fields: [
      { name: "size", label: "Ring Size (US)", type: "number", suffix: "", min: 3, max: 15, defaultValue: 7 },
    ],
    calculate: (inputs) => {
      const usSize = inputs.size as number;
      if (!usSize || usSize < 3 || usSize > 15) return null;
      const circumMm = 36.5 + (usSize - 1) * 2.55;
      const diameterMm = circumMm / Math.PI;
      const ukBase = "A".charCodeAt(0);
      const ukIndex = Math.round((usSize - 0.5) * 2);
      const ukLetter = String.fromCharCode(Math.min(ukBase + ukIndex, 90));
      const euSize = Math.round(circumMm);
      return {
        primary: { label: "Ring Size Conversions", value: "US " + usSize + " = EU " + euSize },
        details: [
          { label: "US Size", value: formatNumber(usSize) },
          { label: "EU Size", value: formatNumber(euSize) },
          { label: "Circumference", value: formatNumber(Math.round(circumMm * 10) / 10) + " mm" },
          { label: "Inner Diameter", value: formatNumber(Math.round(diameterMm * 10) / 10) + " mm" },
        ],
      };
    },
  }],
  relatedSlugs: ["shoe-size-converter", "bra-size-converter"],
  faq: [
    { question: "How are ring sizes measured?", answer: "Ring sizes are based on the inner circumference or diameter of the ring. US sizes use a numerical scale, while UK sizes use letters and EU sizes use millimeters of circumference." },
    { question: "How do I find my ring size?", answer: "Wrap a strip of paper around your finger, mark where it overlaps, and measure the length in millimeters. This gives you the circumference to match against a size chart." },
  ],
  formula: "Circumference (mm) = 36.5 + (US Size - 1) x 2.55; EU Size = circumference rounded",
};
