import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const habitableZoneCalculator: CalculatorDefinition = {
  slug: "habitable-zone-calculator",
  title: "Habitable Zone Calculator",
  description: "Free habitable zone calculator. Calculate the habitable zone boundaries around a star based on its luminosity.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["habitable zone", "goldilocks zone", "circumstellar habitable zone", "star habitable zone"],
  variants: [
    {
      id: "from-luminosity",
      name: "From Star Luminosity",
      description: "HZ = sqrt(L) * zone factor",
      fields: [
        { name: "luminosity", label: "Star Luminosity (Solar Luminosities)", type: "number", placeholder: "e.g. 1", step: 0.01 },
      ],
      calculate: (inputs) => {
        const L = inputs.luminosity as number;
        if (!L || L <= 0) return null;
        const sqrtL = Math.sqrt(L);
        const innerConservative = 0.95 * sqrtL;
        const outerConservative = 1.37 * sqrtL;
        const innerOptimistic = 0.84 * sqrtL;
        const outerOptimistic = 1.67 * sqrtL;
        return {
          primary: { label: "Conservative HZ", value: `${formatNumber(innerConservative, 3)} - ${formatNumber(outerConservative, 3)} AU` },
          details: [
            { label: "Inner Edge (conservative)", value: `${formatNumber(innerConservative, 3)} AU` },
            { label: "Outer Edge (conservative)", value: `${formatNumber(outerConservative, 3)} AU` },
            { label: "Inner Edge (optimistic)", value: `${formatNumber(innerOptimistic, 3)} AU` },
            { label: "Outer Edge (optimistic)", value: `${formatNumber(outerOptimistic, 3)} AU` },
            { label: "Star Luminosity", value: `${formatNumber(L, 4)} L☉` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["star-luminosity-calculator", "kepler-third-law-calculator", "planet-surface-gravity-calculator"],
  faq: [
    { question: "What is the habitable zone?", answer: "The habitable zone is the region around a star where liquid water could exist on a planet surface. For the Sun it is roughly 0.95 to 1.37 AU." },
    { question: "What are conservative vs optimistic estimates?", answer: "Conservative estimates use stricter climate models. Optimistic estimates allow for greenhouse warming and other factors that could extend the zone." },
  ],
  formula: "HZ inner = 0.95 * sqrt(L) AU | HZ outer = 1.37 * sqrt(L) AU",
};
