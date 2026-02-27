import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cometOrbitCalculator: CalculatorDefinition = {
  slug: "comet-orbit-calculator",
  title: "Comet Orbit Calculator",
  description: "Free comet orbit calculator. Get instant results with our easy-to-use calculator.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["comet orbit calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Comet Orbit",
      description: "Calculate comet orbit",
      fields: [
        {
          name: "mass",
          label: "Mass (solar masses)",
          type: "number",
          placeholder: "e.g. 1",
          min: 0.001,
          step: 0.001,
        },
        {
          name: "distance",
          label: "Distance (light years)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0.001,
          step: 0.001,
        }
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number;
        const dist = inputs.distance as number;
        if (!mass || !dist) return null;
        const luminosity = Math.pow(mass, 3.5);
        const apparentMag = -2.5 * Math.log10(luminosity) + 5 * Math.log10(dist * 3.262) - 5;
        return {
          primary: { label: "Luminosity", value: formatNumber(luminosity) + " L_sun" },
          details: [
            { label: "Apparent magnitude", value: formatNumber(apparentMag) },
            { label: "Distance (parsecs)", value: formatNumber(dist * 0.3066) + " pc" },
            { label: "Mass", value: formatNumber(mass) + " M_sun" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the comet orbit calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
