import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const limitingReagentCalculator: CalculatorDefinition = {
  slug: "limiting-reagent-calculator",
  title: "Limiting Reagent Calculator",
  description: "Free limiting reagent calculator. Determine the limiting reactant, excess reagent, and theoretical yield for chemical reactions.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["limiting reagent", "limiting reactant", "excess reagent", "theoretical yield", "stoichiometry"],
  variants: [
    {
      id: "fromMoles",
      name: "From Moles",
      description: "Determine limiting reagent using moles of each reactant",
      fields: [
        { name: "molesA", label: "Moles of Reactant A", type: "number", placeholder: "e.g. 2.0" },
        { name: "coeffA", label: "Stoichiometric Coefficient of A", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
        { name: "molesB", label: "Moles of Reactant B", type: "number", placeholder: "e.g. 3.0" },
        { name: "coeffB", label: "Stoichiometric Coefficient of B", type: "number", placeholder: "e.g. 2", defaultValue: 1, min: 1, step: 1 },
        { name: "coeffProduct", label: "Stoichiometric Coefficient of Product", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const mA = inputs.molesA as number, cA = inputs.coeffA as number;
        const mB = inputs.molesB as number, cB = inputs.coeffB as number;
        const cP = inputs.coeffProduct as number || 1;
        if (!mA || !cA || !mB || !cB || cA <= 0 || cB <= 0) return null;
        const ratioA = mA / cA;
        const ratioB = mB / cB;
        const limiting = ratioA <= ratioB ? "A" : "B";
        const limitingMoles = limiting === "A" ? mA : mB;
        const limitingCoeff = limiting === "A" ? cA : cB;
        const excessMoles = limiting === "A" ? mB : mA;
        const excessCoeff = limiting === "A" ? cB : cA;
        const molesProductFromLimiting = (limitingMoles / limitingCoeff) * cP;
        const molesExcessUsed = (limitingMoles / limitingCoeff) * excessCoeff;
        const molesExcessRemaining = excessMoles - molesExcessUsed;
        return {
          primary: { label: "Limiting Reagent", value: `Reactant ${limiting}` },
          details: [
            { label: "Moles A / Coeff A", value: formatNumber(ratioA, 6) },
            { label: "Moles B / Coeff B", value: formatNumber(ratioB, 6) },
            { label: "Theoretical Yield (mol product)", value: formatNumber(molesProductFromLimiting, 6) },
            { label: `Excess ${limiting === "A" ? "B" : "A"} Remaining`, value: `${formatNumber(molesExcessRemaining, 6)} mol` },
            { label: `Excess ${limiting === "A" ? "B" : "A"} Used`, value: `${formatNumber(molesExcessUsed, 6)} mol` },
          ],
        };
      },
    },
    {
      id: "fromMass",
      name: "From Mass (grams)",
      description: "Determine limiting reagent from masses and molar masses",
      fields: [
        { name: "massA", label: "Mass of Reactant A (g)", type: "number", placeholder: "e.g. 10.0" },
        { name: "mmA", label: "Molar Mass of A (g/mol)", type: "number", placeholder: "e.g. 2.016" },
        { name: "coeffA", label: "Coefficient of A", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
        { name: "massB", label: "Mass of Reactant B (g)", type: "number", placeholder: "e.g. 32.0" },
        { name: "mmB", label: "Molar Mass of B (g/mol)", type: "number", placeholder: "e.g. 32.00" },
        { name: "coeffB", label: "Coefficient of B", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
        { name: "coeffProduct", label: "Coefficient of Product", type: "number", placeholder: "e.g. 2", defaultValue: 1, min: 1, step: 1 },
        { name: "mmProduct", label: "Molar Mass of Product (g/mol)", type: "number", placeholder: "e.g. 18.015" },
      ],
      calculate: (inputs) => {
        const massA = inputs.massA as number, mmA = inputs.mmA as number, cA = inputs.coeffA as number;
        const massB = inputs.massB as number, mmB = inputs.mmB as number, cB = inputs.coeffB as number;
        const cP = inputs.coeffProduct as number || 1, mmP = inputs.mmProduct as number;
        if (!massA || !mmA || !cA || !massB || !mmB || !cB || mmA <= 0 || mmB <= 0) return null;
        const molesA = massA / mmA;
        const molesB = massB / mmB;
        const ratioA = molesA / cA;
        const ratioB = molesB / cB;
        const limiting = ratioA <= ratioB ? "A" : "B";
        const limitingRatio = Math.min(ratioA, ratioB);
        const molesProduct = limitingRatio * cP;
        const massProduct = mmP ? molesProduct * mmP : 0;
        const excessMolesUsed = limiting === "A" ? limitingRatio * cB : limitingRatio * cA;
        const excessMolesRemaining = (limiting === "A" ? molesB : molesA) - excessMolesUsed;
        return {
          primary: { label: "Limiting Reagent", value: `Reactant ${limiting}` },
          details: [
            { label: "Moles A", value: `${formatNumber(molesA, 6)} mol` },
            { label: "Moles B", value: `${formatNumber(molesB, 6)} mol` },
            { label: "Theoretical Yield (mol)", value: `${formatNumber(molesProduct, 6)} mol` },
            ...(massProduct > 0 ? [{ label: "Theoretical Yield (g)", value: `${formatNumber(massProduct, 4)} g` }] : []),
            { label: `Excess ${limiting === "A" ? "B" : "A"} remaining`, value: `${formatNumber(excessMolesRemaining, 6)} mol` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percent-yield-calculator", "molar-mass-calculator", "molarity-calculator"],
  faq: [
    { question: "What is a limiting reagent?", answer: "The limiting reagent is the reactant that is completely consumed first in a chemical reaction, determining the maximum amount of product that can form. The other reactant(s) are in excess." },
    { question: "How do I find the limiting reagent?", answer: "Divide the moles of each reactant by its stoichiometric coefficient. The reactant with the smallest ratio is the limiting reagent. Theoretical yield is calculated from the limiting reagent." },
    { question: "What is theoretical yield?", answer: "Theoretical yield is the maximum amount of product that can be formed from the limiting reagent, assuming 100% conversion. Actual yield is always less due to incomplete reactions, side reactions, and losses." },
  ],
  formula: "Compare moles/coefficient for each reactant | Smallest ratio = limiting reagent | Theoretical yield = (moles of limiting / its coeff) × product coeff",
};
