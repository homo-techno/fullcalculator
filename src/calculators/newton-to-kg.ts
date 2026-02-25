import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const newtonToKg: CalculatorDefinition = {
  slug: "newton-to-kg",
  title: "Newtons to Kilograms-force",
  description: "Free Newtons to kilograms-force converter. Convert force from Newtons to kgf instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["newtons to kg", "N to kgf", "newton to kilogram force", "force conversion"],
  variants: [
    {
      id: "newton-to-kgf",
      name: "Newtons to kgf",
      fields: [
        { name: "newtons", label: "Force (N)", type: "number", placeholder: "e.g. 9.81", suffix: "N" },
      ],
      calculate: (inputs) => {
        const newtons = inputs.newtons as number;
        if (newtons === undefined) return null;
        const kgf = newtons / 9.80665;
        const lbf = newtons * 0.224809;
        const dynes = newtons * 100000;
        const kN = newtons / 1000;
        return {
          primary: { label: "Kilograms-force", value: formatNumber(kgf, 4), suffix: "kgf" },
          details: [
            { label: "Newtons", value: `${formatNumber(newtons, 4)} N` },
            { label: "Kilograms-force", value: `${formatNumber(kgf, 4)} kgf` },
            { label: "Pounds-force", value: `${formatNumber(lbf, 4)} lbf` },
            { label: "Dynes", value: `${formatNumber(dynes, 0)} dyn` },
            { label: "Kilonewtons", value: `${formatNumber(kN, 6)} kN` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["kg-to-newton", "force", "unit-converter"],
  faq: [
    { question: "How do I convert Newtons to kgf?", answer: "Divide the force in Newtons by 9.80665 (standard gravity). For example, 9.81 N ≈ 1.0004 kgf." },
    { question: "What is the difference between kg and kgf?", answer: "Kg is a unit of mass, while kgf (kilogram-force) is a unit of force. 1 kgf is the force exerted by 1 kg of mass under standard gravity (9.80665 m/s²)." },
  ],
  formula: "kgf = N ÷ 9.80665",
};
