import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const solutionPreparationCalculator: CalculatorDefinition = {
  slug: "solution-preparation-calculator",
  title: "Solution Preparation Calculator",
  description: "Calculate the mass of solute needed to prepare a solution of a desired molar concentration and volume in the laboratory.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["solution preparation","molar solution","reagent mass","lab solution making","prepare molar solution"],
  variants: [{
    id: "standard",
    name: "Solution Preparation",
    description: "Calculate the mass of solute needed to prepare a solution of a desired molar concentration and volume in the laboratory.",
    fields: [
      { name: "concentration", label: "Desired Concentration (M)", type: "number", min: 0.0001, max: 20, defaultValue: 0.5 },
      { name: "volume", label: "Final Volume (mL)", type: "number", min: 1, max: 100000, defaultValue: 500 },
      { name: "molarMass", label: "Molar Mass of Solute (g/mol)", type: "number", min: 1, max: 2000, defaultValue: 58.44 },
      { name: "purity", label: "Reagent Purity (%)", type: "number", min: 1, max: 100, defaultValue: 99 },
    ],
    calculate: (inputs) => {
    const concentration = inputs.concentration as number;
    const volume = inputs.volume as number;
    const molarMass = inputs.molarMass as number;
    const purity = inputs.purity as number;
    const volumeL = volume / 1000;
    const molesNeeded = concentration * volumeL;
    const massIdeal = molesNeeded * molarMass;
    const massActual = massIdeal / (purity / 100);
    return {
      primary: { label: "Mass of Solute Needed", value: formatNumber(Math.round(massActual * 1000) / 1000) + " g" },
      details: [
        { label: "Ideal Mass (100% pure)", value: formatNumber(Math.round(massIdeal * 1000) / 1000) + " g" },
        { label: "Moles Required", value: formatNumber(Math.round(molesNeeded * 10000) / 10000) + " mol" },
        { label: "Volume in Liters", value: formatNumber(volumeL) + " L" },
        { label: "Purity Correction Factor", value: formatNumber(Math.round(100 / purity * 10000) / 10000) }
      ]
    };
  },
  }],
  relatedSlugs: ["molarity-calculator","dilution-calculator","molar-mass-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Mass = (Concentration x Volume(L) x Molar Mass) / (Purity/100)
Moles = Concentration x Volume(L)",
};
