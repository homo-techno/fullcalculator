import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kgToNewton: CalculatorDefinition = {
  slug: "kg-to-newton",
  title: "Kilograms-force to Newtons",
  description: "Free kilograms-force to Newtons converter. Convert force from kgf to Newtons instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["kg to newton", "kgf to N", "kilogram force to newton", "force conversion"],
  variants: [
    {
      id: "kgf-to-newton",
      name: "kgf to Newtons",
      fields: [
        { name: "kgf", label: "Force (kgf)", type: "number", placeholder: "e.g. 1", suffix: "kgf" },
      ],
      calculate: (inputs) => {
        const kgf = inputs.kgf as number;
        if (kgf === undefined) return null;
        const newtons = kgf * 9.80665;
        const lbf = kgf * 2.20462;
        const dynes = newtons * 100000;
        const kN = newtons / 1000;
        return {
          primary: { label: "Newtons", value: formatNumber(newtons, 4), suffix: "N" },
          details: [
            { label: "Kilograms-force", value: `${formatNumber(kgf, 4)} kgf` },
            { label: "Newtons", value: `${formatNumber(newtons, 4)} N` },
            { label: "Pounds-force", value: `${formatNumber(lbf, 4)} lbf` },
            { label: "Dynes", value: `${formatNumber(dynes, 0)} dyn` },
            { label: "Kilonewtons", value: `${formatNumber(kN, 6)} kN` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["newton-to-kg", "force", "unit-converter"],
  faq: [
    { question: "How do I convert kgf to Newtons?", answer: "Multiply the force in kgf by 9.80665. For example, 1 kgf = 9.80665 N." },
    { question: "What is a Newton?", answer: "A Newton (N) is the SI unit of force. It is defined as the force needed to accelerate 1 kilogram of mass at 1 meter per second squared." },
  ],
  formula: "N = kgf × 9.80665",
};
