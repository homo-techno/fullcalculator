import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const theoreticalYieldCalculator: CalculatorDefinition = {
  slug: "theoretical-yield-calculator",
  title: "Theoretical Yield Calculator",
  description: "Free theoretical yield calculator. Calculate the maximum possible product from a chemical reaction using stoichiometry. Determine theoretical yield from reactant amounts.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["theoretical yield", "stoichiometry", "product yield", "chemical reaction", "limiting reagent"],
  variants: [
    {
      id: "from-moles",
      name: "From Moles of Reactant",
      fields: [
        { name: "molesReactant", label: "Moles of Limiting Reactant", type: "number", placeholder: "e.g. 0.5", min: 0, step: 0.001 },
        { name: "stoichReactant", label: "Stoich. Coefficient of Reactant", type: "number", placeholder: "e.g. 1", min: 1, step: 1 },
        { name: "stoichProduct", label: "Stoich. Coefficient of Product", type: "number", placeholder: "e.g. 2", min: 1, step: 1 },
        { name: "molarMassProduct", label: "Molar Mass of Product (g/mol)", type: "number", placeholder: "e.g. 18.015", min: 0.001, step: 0.001 },
      ],
      calculate: (inputs) => {
        const molesR = inputs.molesReactant as number;
        const stoichR = inputs.stoichReactant as number;
        const stoichP = inputs.stoichProduct as number;
        const mmProduct = inputs.molarMassProduct as number;
        if (!molesR || !stoichR || !stoichP || !mmProduct || molesR < 0 || stoichR < 1 || stoichP < 1 || mmProduct <= 0) return null;
        const molesProduct = molesR * (stoichP / stoichR);
        const massProduct = molesProduct * mmProduct;
        return {
          primary: { label: "Theoretical Yield", value: formatNumber(massProduct, 4), suffix: "g" },
          details: [
            { label: "Moles of Product", value: formatNumber(molesProduct, 6) },
            { label: "Moles of Reactant", value: formatNumber(molesR, 6) },
            { label: "Molar Ratio (product:reactant)", value: `${stoichP}:${stoichR}` },
            { label: "Product Molar Mass", value: `${formatNumber(mmProduct, 4)} g/mol` },
          ],
          note: "Theoretical yield assumes 100% conversion with no side reactions or losses. Actual yield is always less than or equal to theoretical yield.",
        };
      },
    },
    {
      id: "from-mass",
      name: "From Mass of Reactant",
      fields: [
        { name: "massReactant", label: "Mass of Limiting Reactant (g)", type: "number", placeholder: "e.g. 10", min: 0, step: 0.01 },
        { name: "molarMassReactant", label: "Molar Mass of Reactant (g/mol)", type: "number", placeholder: "e.g. 40", min: 0.001, step: 0.001 },
        { name: "stoichReactant", label: "Stoich. Coefficient of Reactant", type: "number", placeholder: "e.g. 1", min: 1, step: 1 },
        { name: "stoichProduct", label: "Stoich. Coefficient of Product", type: "number", placeholder: "e.g. 1", min: 1, step: 1 },
        { name: "molarMassProduct", label: "Molar Mass of Product (g/mol)", type: "number", placeholder: "e.g. 58.44", min: 0.001, step: 0.001 },
      ],
      calculate: (inputs) => {
        const massR = inputs.massReactant as number;
        const mmR = inputs.molarMassReactant as number;
        const stoichR = inputs.stoichReactant as number;
        const stoichP = inputs.stoichProduct as number;
        const mmP = inputs.molarMassProduct as number;
        if (!massR || !mmR || !stoichR || !stoichP || !mmP || massR < 0 || mmR <= 0 || stoichR < 1 || stoichP < 1 || mmP <= 0) return null;
        const molesR = massR / mmR;
        const molesP = molesR * (stoichP / stoichR);
        const massP = molesP * mmP;
        return {
          primary: { label: "Theoretical Yield", value: formatNumber(massP, 4), suffix: "g" },
          details: [
            { label: "Moles of Reactant", value: formatNumber(molesR, 6) },
            { label: "Moles of Product", value: formatNumber(molesP, 6) },
            { label: "Mass of Reactant", value: `${formatNumber(massR, 4)} g` },
            { label: "Molar Ratio (product:reactant)", value: `${stoichP}:${stoichR}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["actual-yield-calculator", "percent-yield-calculator", "limiting-reagent-calculator"],
  faq: [
    { question: "What is theoretical yield?", answer: "Theoretical yield is the maximum amount of product that can be formed from given amounts of reactants, assuming complete reaction with no losses. It is calculated using stoichiometry from the balanced chemical equation." },
    { question: "Why is actual yield less than theoretical yield?", answer: "Actual yield is less due to incomplete reactions, side reactions, loss during transfer or purification, impure reagents, and equilibrium limitations." },
  ],
  formula: "Theoretical Yield = (moles_reactant × stoich_product / stoich_reactant) × molar_mass_product",
};
