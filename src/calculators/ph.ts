import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const phCalculator: CalculatorDefinition = {
  slug: "ph-calculator",
  title: "pH Calculator",
  description: "Free pH calculator. Calculate pH from hydrogen ion concentration, convert between pH and pOH, and determine acidity or alkalinity.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["ph calculator", "hydrogen ion concentration", "pOH calculator", "acid base calculator", "pH scale"],
  variants: [
    {
      id: "ph",
      name: "pH from H⁺ Concentration",
      fields: [
        { name: "concentration", label: "H⁺ Concentration (mol/L)", type: "number", placeholder: "e.g. 0.001", step: 0.0001 },
      ],
      calculate: (inputs) => {
        const h = inputs.concentration as number;
        if (!h || h <= 0) return null;
        const pH = -Math.log10(h);
        const pOH = 14 - pH;
        const ohConc = Math.pow(10, -pOH);
        let nature = "Neutral";
        if (pH < 6.5) nature = "Acidic";
        else if (pH > 7.5) nature = "Basic (Alkaline)";
        return {
          primary: { label: "pH", value: formatNumber(pH, 4) },
          details: [
            { label: "pOH", value: formatNumber(pOH, 4) },
            { label: "[H⁺]", value: h.toExponential(4) },
            { label: "[OH⁻]", value: ohConc.toExponential(4) },
            { label: "Nature", value: nature },
          ],
        };
      },
    },
    {
      id: "fromph",
      name: "H⁺ from pH Value",
      fields: [
        { name: "ph", label: "pH Value", type: "number", placeholder: "e.g. 7", min: 0, max: 14, step: 0.1 },
      ],
      calculate: (inputs) => {
        const pH = inputs.ph as number;
        if (pH === undefined) return null;
        const h = Math.pow(10, -pH);
        const pOH = 14 - pH;
        const oh = Math.pow(10, -pOH);
        let nature = "Neutral";
        if (pH < 6.5) nature = "Acidic";
        else if (pH > 7.5) nature = "Basic (Alkaline)";
        return {
          primary: { label: "[H⁺] Concentration", value: `${h.toExponential(4)} mol/L` },
          details: [
            { label: "pH", value: formatNumber(pH, 2) },
            { label: "pOH", value: formatNumber(pOH, 2) },
            { label: "[OH⁻]", value: `${oh.toExponential(4)} mol/L` },
            { label: "Nature", value: nature },
          ],
          note: "pH scale: 0-6 acidic, 7 neutral, 8-14 basic. Common: lemon juice ~2, coffee ~5, water 7, baking soda ~8.3, bleach ~12.5",
        };
      },
    },
  ],
  relatedSlugs: ["scientific-calculator", "density-calculator", "unit-converter"],
  faq: [
    { question: "What is pH?", answer: "pH = -log₁₀[H⁺]. It measures how acidic or basic a solution is on a scale of 0-14. pH 7 is neutral (pure water). Below 7 is acidic, above 7 is basic. Each whole pH unit = 10× difference in H⁺ concentration." },
  ],
  formula: "pH = -log₁₀[H⁺] | pOH = 14 - pH | [H⁺] = 10^(-pH)",
};
