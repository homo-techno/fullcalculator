import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const annulusCalculator: CalculatorDefinition = {
  slug: "annulus-calculator",
  title: "Annulus Calculator",
  description: "Free annulus calculator. Get instant results with our easy-to-use calculator.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["annulus calculator", "geometry calculator", "area calculator", "math tool"],
  variants: [
    {
      id: "standard",
      name: "Annulus",
      description: "Calculate annulus",
      fields: [
        {
          name: "side",
          label: "Side Length / Radius",
          type: "number",
          placeholder: "e.g. 10",
          min: 0.001,
          step: 0.01,
        },
        {
          name: "height",
          label: "Height (if applicable)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const s = inputs.side as number;
        const h = inputs.height as number || s;
        if (!s) return null;
        const area = Math.PI * s * s;
        const perimeter = 2 * Math.PI * s;
        const volume = (4/3) * Math.PI * s * s * s;
        return {
          primary: { label: "Area", value: formatNumber(area) + " sq units" },
          details: [
            { label: "Perimeter/Circumference", value: formatNumber(perimeter) + " units" },
            { label: "Volume (3D)", value: formatNumber(volume) + " cubic units" },
            { label: "Diagonal", value: formatNumber(s * Math.sqrt(2)) + " units" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "fraction-calculator"],
  faq: [
    { question: "How does the annulus calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
