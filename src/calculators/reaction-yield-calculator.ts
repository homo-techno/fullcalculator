import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const reactionYieldCalculator: CalculatorDefinition = {
  slug: "reaction-yield-calculator",
  title: "Reaction Yield Calculator",
  description: "Calculate the percent yield of a chemical reaction by comparing actual product to theoretical yield.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["percent yield", "reaction yield calculator", "theoretical yield"],
  variants: [{
    id: "standard",
    name: "Reaction Yield",
    description: "Calculate the percent yield of a chemical reaction by comparing actual product to theoretical yield",
    fields: [
      { name: "theoreticalYield", label: "Theoretical Yield", type: "number", suffix: "g", min: 0.001, max: 100000, step: 0.01, defaultValue: 50 },
      { name: "actualYield", label: "Actual Yield", type: "number", suffix: "g", min: 0.001, max: 100000, step: 0.01, defaultValue: 38 },
      { name: "reactantMass", label: "Starting Reactant Mass", type: "number", suffix: "g", min: 0.001, max: 100000, step: 0.01, defaultValue: 60 },
    ],
    calculate: (inputs) => {
      const theoretical = inputs.theoreticalYield as number;
      const actual = inputs.actualYield as number;
      const reactant = inputs.reactantMass as number;
      if (!theoretical || !actual || theoretical <= 0 || actual <= 0) return null;
      const percentYield = (actual / theoretical) * 100;
      const massLost = theoretical - actual;
      const atomEconomy = (theoretical / reactant) * 100;
      const rating = percentYield >= 90 ? "Excellent" : percentYield >= 70 ? "Good" : percentYield >= 50 ? "Fair" : "Poor";
      return {
        primary: { label: "Percent Yield", value: formatNumber(Math.round(percentYield * 10) / 10) + "%" },
        details: [
          { label: "Mass Lost", value: formatNumber(Math.round(massLost * 100) / 100) + " g" },
          { label: "Atom Economy", value: formatNumber(Math.round(atomEconomy * 10) / 10) + "%" },
          { label: "Yield Rating", value: rating },
        ],
      };
    },
  }],
  relatedSlugs: ["molar-mass-calculator", "titration-calculator"],
  faq: [
    { question: "What is percent yield?", answer: "Percent yield is the ratio of the actual product obtained to the theoretical maximum product possible, expressed as a percentage. It measures the efficiency of a chemical reaction." },
    { question: "Why is percent yield usually less than 100?", answer: "Percent yield is typically less than 100 due to incomplete reactions, side reactions, loss of product during purification, and measurement errors. Yields above 100 percent indicate impurities." },
  ],
  formula: "Percent Yield = (Actual Yield / Theoretical Yield) x 100",
};
