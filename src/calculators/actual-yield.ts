import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const actualYieldCalculator: CalculatorDefinition = {
  slug: "actual-yield-calculator",
  title: "Actual Yield Calculator",
  description: "Free actual yield calculator. Calculate actual yield from percent yield and theoretical yield, or determine percent yield from actual and theoretical yields.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["actual yield", "percent yield", "theoretical yield", "chemistry lab", "reaction efficiency"],
  variants: [
    {
      id: "actual-from-percent",
      name: "Actual Yield from % Yield",
      fields: [
        { name: "theoreticalYield", label: "Theoretical Yield (g)", type: "number", placeholder: "e.g. 50", min: 0, step: 0.01 },
        { name: "percentYield", label: "Percent Yield (%)", type: "number", placeholder: "e.g. 85", min: 0, max: 100, step: 0.1 },
      ],
      calculate: (inputs) => {
        const theoretical = inputs.theoreticalYield as number;
        const percent = inputs.percentYield as number;
        if (!theoretical || percent === undefined || theoretical < 0 || percent < 0 || percent > 100) return null;
        const actual = theoretical * (percent / 100);
        const lost = theoretical - actual;
        return {
          primary: { label: "Actual Yield", value: formatNumber(actual, 4), suffix: "g" },
          details: [
            { label: "Theoretical Yield", value: `${formatNumber(theoretical, 4)} g` },
            { label: "Percent Yield", value: `${formatNumber(percent, 2)}%` },
            { label: "Mass Lost / Unreacted", value: `${formatNumber(lost, 4)} g` },
          ],
          note: "Actual yield = theoretical yield × (percent yield / 100). A typical good lab yield is 70-90%.",
        };
      },
    },
    {
      id: "percent-yield",
      name: "Percent Yield",
      fields: [
        { name: "actualYield", label: "Actual Yield (g)", type: "number", placeholder: "e.g. 42.5", min: 0, step: 0.01 },
        { name: "theoreticalYield", label: "Theoretical Yield (g)", type: "number", placeholder: "e.g. 50", min: 0.001, step: 0.01 },
      ],
      calculate: (inputs) => {
        const actual = inputs.actualYield as number;
        const theoretical = inputs.theoreticalYield as number;
        if (actual === undefined || !theoretical || actual < 0 || theoretical <= 0) return null;
        const percent = (actual / theoretical) * 100;
        const lost = theoretical - actual;
        let rating = "Excellent (>90%)";
        if (percent < 50) rating = "Poor (<50%)";
        else if (percent < 70) rating = "Fair (50-70%)";
        else if (percent < 90) rating = "Good (70-90%)";
        return {
          primary: { label: "Percent Yield", value: formatNumber(percent, 2), suffix: "%" },
          details: [
            { label: "Actual Yield", value: `${formatNumber(actual, 4)} g` },
            { label: "Theoretical Yield", value: `${formatNumber(theoretical, 4)} g` },
            { label: "Mass Lost / Unreacted", value: `${formatNumber(lost, 4)} g` },
            { label: "Rating", value: rating },
          ],
        };
      },
    },
    {
      id: "theoretical-from-actual",
      name: "Theoretical Yield from Actual",
      fields: [
        { name: "actualYield", label: "Actual Yield (g)", type: "number", placeholder: "e.g. 42.5", min: 0, step: 0.01 },
        { name: "percentYield", label: "Percent Yield (%)", type: "number", placeholder: "e.g. 85", min: 0.001, max: 100, step: 0.1 },
      ],
      calculate: (inputs) => {
        const actual = inputs.actualYield as number;
        const percent = inputs.percentYield as number;
        if (!actual || !percent || actual < 0 || percent <= 0 || percent > 100) return null;
        const theoretical = actual / (percent / 100);
        return {
          primary: { label: "Theoretical Yield", value: formatNumber(theoretical, 4), suffix: "g" },
          details: [
            { label: "Actual Yield", value: `${formatNumber(actual, 4)} g` },
            { label: "Percent Yield", value: `${formatNumber(percent, 2)}%` },
            { label: "Mass Lost / Unreacted", value: `${formatNumber(theoretical - actual, 4)} g` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["theoretical-yield-calculator", "percent-yield-calculator", "limiting-reagent-calculator"],
  faq: [
    { question: "What is actual yield?", answer: "Actual yield is the amount of product actually obtained from a chemical reaction in the lab. It is always less than or equal to the theoretical yield due to losses, side reactions, and incomplete reactions." },
    { question: "What is a good percent yield?", answer: "In academic labs, 70-90% is considered good. In industrial synthesis, yields above 90% are often required for economic viability. Multistep syntheses may have lower overall yields." },
  ],
  formula: "Actual Yield = Theoretical Yield × (% Yield / 100) | % Yield = (Actual / Theoretical) × 100",
};
