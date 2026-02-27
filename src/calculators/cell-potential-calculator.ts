import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cellPotentialCalculator: CalculatorDefinition = {
  slug: "cell-potential-calculator",
  title: "Cell Potential Calculator",
  description: "Free cell potential calculator. Get instant results with our easy-to-use calculator.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["cell potential calculator", "chemistry calculator", "science tool"],
  variants: [
    {
      id: "standard",
      name: "Cell Potential",
      description: "Calculate cell potential",
      fields: [
        {
          name: "mass",
          label: "Mass / Amount",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "g",
          min: 0,
          step: 0.01,
        },
        {
          name: "molarMass",
          label: "Molar Mass",
          type: "number",
          placeholder: "e.g. 18.015",
          suffix: "g/mol",
          min: 0.1,
          step: 0.001,
        },
        {
          name: "volume",
          label: "Volume (optional)",
          type: "number",
          placeholder: "e.g. 1",
          suffix: "L",
          min: 0,
          step: 0.001,
        }
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number;
        const mm = inputs.molarMass as number;
        const vol = inputs.volume as number || 1;
        if (!mass || !mm) return null;
        const moles = mass / mm;
        const molarity = moles / vol;
        const molecules = moles * 6.022e23;
        return {
          primary: { label: "Moles", value: formatNumber(moles) + " mol" },
          details: [
            { label: "Molarity", value: formatNumber(molarity) + " M" },
            { label: "Molecules", value: molecules.toExponential(3) },
            { label: "Mass", value: formatNumber(mass) + " g" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the cell potential calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
