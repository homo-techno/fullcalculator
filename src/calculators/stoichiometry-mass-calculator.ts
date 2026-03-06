import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stoichiometryMassCalculator: CalculatorDefinition = {
  slug: "stoichiometry-mass-calculator",
  title: "Stoichiometry Mass-to-Mass Calculator",
  description: "Calculate the mass of product formed or reactant needed using stoichiometric ratios and molar masses for balanced chemical equations.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["stoichiometry calculator","mass to mass conversion","chemical equation calculator","mole ratio","theoretical yield mass"],
  variants: [{
    id: "standard",
    name: "Stoichiometry Mass-to-Mass",
    description: "Calculate the mass of product formed or reactant needed using stoichiometric ratios and molar masses for balanced chemical equations.",
    fields: [
      { name: "massReactant", label: "Mass of Known Substance (g)", type: "number", min: 0.001, max: 100000, defaultValue: 10 },
      { name: "molarMassReactant", label: "Molar Mass of Known (g/mol)", type: "number", min: 1, max: 1000, defaultValue: 36.46 },
      { name: "molarMassProduct", label: "Molar Mass of Unknown (g/mol)", type: "number", min: 1, max: 1000, defaultValue: 58.44 },
      { name: "coeffReactant", label: "Coefficient of Known", type: "number", min: 1, max: 20, defaultValue: 1 },
      { name: "coeffProduct", label: "Coefficient of Unknown", type: "number", min: 1, max: 20, defaultValue: 1 },
      { name: "percentYield", label: "Expected Percent Yield (%)", type: "number", min: 1, max: 100, defaultValue: 100 },
    ],
    calculate: (inputs) => {
    const massReactant = inputs.massReactant as number;
    const molarMassReactant = inputs.molarMassReactant as number;
    const molarMassProduct = inputs.molarMassProduct as number;
    const coeffReactant = inputs.coeffReactant as number;
    const coeffProduct = inputs.coeffProduct as number;
    const percentYield = inputs.percentYield as number;
    const molesReactant = massReactant / molarMassReactant;
    const molesProduct = molesReactant * (coeffProduct / coeffReactant);
    const theoreticalMass = molesProduct * molarMassProduct;
    const actualMass = theoreticalMass * (percentYield / 100);
    return {
      primary: { label: "Mass of Unknown", value: formatNumber(Math.round(actualMass * 1000) / 1000) + " g" },
      details: [
        { label: "Theoretical Mass (100%)", value: formatNumber(Math.round(theoreticalMass * 1000) / 1000) + " g" },
        { label: "Moles of Known", value: formatNumber(Math.round(molesReactant * 10000) / 10000) + " mol" },
        { label: "Moles of Unknown", value: formatNumber(Math.round(molesProduct * 10000) / 10000) + " mol" },
        { label: "Mole Ratio", value: formatNumber(coeffReactant) + ":" + formatNumber(coeffProduct) }
      ]
    };
  },
  }],
  relatedSlugs: ["percent-yield-calculator","limiting-reagent-calculator","molar-mass-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Moles(known) = Mass / Molar Mass; Moles(unknown) = Moles(known) x (Coeff unknown / Coeff known); Theoretical Mass = Moles(unknown) x Molar Mass(unknown); Actual Mass = Theoretical x Yield%",
};
