import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const percentYieldCalculator: CalculatorDefinition = {
  slug: "percent-yield-calculator",
  title: "Percent Yield Calculator",
  description: "Free percent yield calculator. Calculate percent yield, actual yield, or theoretical yield for chemical reactions.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["percent yield", "actual yield", "theoretical yield", "reaction efficiency", "chemistry yield"],
  variants: [
    {
      id: "percentYield",
      name: "Calculate Percent Yield",
      fields: [
        { name: "actual", label: "Actual Yield (g)", type: "number", placeholder: "e.g. 8.5" },
        { name: "theoretical", label: "Theoretical Yield (g)", type: "number", placeholder: "e.g. 10.0" },
      ],
      calculate: (inputs) => {
        const actual = inputs.actual as number, theoretical = inputs.theoretical as number;
        if (!actual || !theoretical || theoretical <= 0) return null;
        const pctYield = (actual / theoretical) * 100;
        const loss = theoretical - actual;
        return {
          primary: { label: "Percent Yield", value: `${formatNumber(pctYield, 2)}%` },
          details: [
            { label: "Actual Yield", value: `${formatNumber(actual, 4)} g` },
            { label: "Theoretical Yield", value: `${formatNumber(theoretical, 4)} g` },
            { label: "Mass Lost/Unreacted", value: `${formatNumber(loss, 4)} g` },
            { label: "Efficiency Rating", value: pctYield >= 90 ? "Excellent" : pctYield >= 70 ? "Good" : pctYield >= 50 ? "Moderate" : "Low" },
          ],
        };
      },
    },
    {
      id: "actualYield",
      name: "Calculate Actual Yield",
      fields: [
        { name: "theoretical", label: "Theoretical Yield (g)", type: "number", placeholder: "e.g. 10.0" },
        { name: "percentYield", label: "Percent Yield (%)", type: "number", placeholder: "e.g. 85", min: 0, max: 100 },
      ],
      calculate: (inputs) => {
        const theoretical = inputs.theoretical as number, pct = inputs.percentYield as number;
        if (!theoretical || !pct || theoretical <= 0) return null;
        const actual = theoretical * (pct / 100);
        return {
          primary: { label: "Actual Yield", value: `${formatNumber(actual, 4)} g` },
          details: [
            { label: "Theoretical Yield", value: `${formatNumber(theoretical, 4)} g` },
            { label: "Percent Yield", value: `${formatNumber(pct, 2)}%` },
            { label: "Expected Loss", value: `${formatNumber(theoretical - actual, 4)} g` },
          ],
        };
      },
    },
    {
      id: "theoreticalYield",
      name: "Calculate Theoretical Yield",
      description: "From limiting reagent mass and stoichiometry",
      fields: [
        { name: "massReactant", label: "Mass of Limiting Reagent (g)", type: "number", placeholder: "e.g. 10.0" },
        { name: "mmReactant", label: "Molar Mass of Limiting Reagent (g/mol)", type: "number", placeholder: "e.g. 36.46" },
        { name: "coeffReactant", label: "Coefficient of Limiting Reagent", type: "number", placeholder: "e.g. 2", defaultValue: 1, min: 1, step: 1 },
        { name: "coeffProduct", label: "Coefficient of Product", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
        { name: "mmProduct", label: "Molar Mass of Product (g/mol)", type: "number", placeholder: "e.g. 58.44" },
      ],
      calculate: (inputs) => {
        const massR = inputs.massReactant as number, mmR = inputs.mmReactant as number;
        const cR = inputs.coeffReactant as number || 1, cP = inputs.coeffProduct as number || 1;
        const mmP = inputs.mmProduct as number;
        if (!massR || !mmR || !mmP || mmR <= 0 || mmP <= 0) return null;
        const molesReactant = massR / mmR;
        const molesProduct = (molesReactant / cR) * cP;
        const massProduct = molesProduct * mmP;
        return {
          primary: { label: "Theoretical Yield", value: `${formatNumber(massProduct, 4)} g` },
          details: [
            { label: "Moles of Limiting Reagent", value: `${formatNumber(molesReactant, 6)} mol` },
            { label: "Moles of Product", value: `${formatNumber(molesProduct, 6)} mol` },
            { label: "Stoichiometric Ratio", value: `${cR} : ${cP}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["limiting-reagent-calculator", "molar-mass-calculator", "molarity-calculator"],
  faq: [
    { question: "What is percent yield?", answer: "Percent yield = (actual yield / theoretical yield) × 100. It measures the efficiency of a chemical reaction. A 100% yield means all reactants converted to product. Typical lab yields range from 50-90%." },
    { question: "Why is percent yield less than 100%?", answer: "Reasons include: incomplete reactions (equilibrium), side reactions forming byproducts, loss during purification/transfer, impure reagents, and measurement errors." },
    { question: "Can percent yield exceed 100%?", answer: "A percent yield over 100% indicates error: impure product (contains solvent or byproducts), measurement mistake, or incomplete drying. True yields cannot exceed 100%." },
  ],
  formula: "% Yield = (actual yield / theoretical yield) × 100 | Theoretical yield = (mol limiting / coeff) × coeff product × MM product",
};
