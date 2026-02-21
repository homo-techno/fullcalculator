import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const enthalpyCalculator: CalculatorDefinition = {
  slug: "enthalpy-calculator",
  title: "Enthalpy Calculator",
  description: "Free enthalpy calculator. Calculate heat of reaction (ΔH) using Hess's Law, standard enthalpies of formation, and bond energies.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["enthalpy", "heat of reaction", "ΔH", "Hess's law", "endothermic", "exothermic"],
  variants: [
    {
      id: "fromFormation",
      name: "From Enthalpies of Formation",
      description: "ΔH°rxn = ΣΔHf°(products) - ΣΔHf°(reactants)",
      fields: [
        { name: "hfProducts", label: "ΣΔHf° of Products (kJ/mol)", type: "number", placeholder: "e.g. -393.5" },
        { name: "hfReactants", label: "ΣΔHf° of Reactants (kJ/mol)", type: "number", placeholder: "e.g. 0" },
      ],
      calculate: (inputs) => {
        const hP = inputs.hfProducts as number, hR = inputs.hfReactants as number;
        if (hP === undefined || hR === undefined) return null;
        const deltaH = hP - hR;
        return {
          primary: { label: "ΔH°rxn", value: `${formatNumber(deltaH, 4)} kJ/mol` },
          details: [
            { label: "ΣΔHf° products", value: `${formatNumber(hP, 4)} kJ/mol` },
            { label: "ΣΔHf° reactants", value: `${formatNumber(hR, 4)} kJ/mol` },
            { label: "Type", value: deltaH < 0 ? "Exothermic (releases heat)" : deltaH > 0 ? "Endothermic (absorbs heat)" : "Thermoneutral" },
            { label: "ΔH in kcal/mol", value: formatNumber(deltaH / 4.184, 4) },
          ],
        };
      },
    },
    {
      id: "fromBondEnergies",
      name: "From Bond Energies",
      description: "ΔH = Σ(bonds broken) - Σ(bonds formed)",
      fields: [
        { name: "bondsBroken", label: "Σ Bond Energies Broken (kJ/mol)", type: "number", placeholder: "e.g. 2648" },
        { name: "bondsFormed", label: "Σ Bond Energies Formed (kJ/mol)", type: "number", placeholder: "e.g. 3466" },
      ],
      calculate: (inputs) => {
        const broken = inputs.bondsBroken as number, formed = inputs.bondsFormed as number;
        if (broken === undefined || formed === undefined || broken < 0 || formed < 0) return null;
        const deltaH = broken - formed;
        return {
          primary: { label: "ΔH°rxn (estimated)", value: `${formatNumber(deltaH, 4)} kJ/mol` },
          details: [
            { label: "Bonds Broken (energy in)", value: `+${formatNumber(broken, 2)} kJ/mol` },
            { label: "Bonds Formed (energy out)", value: `-${formatNumber(formed, 2)} kJ/mol` },
            { label: "Type", value: deltaH < 0 ? "Exothermic" : deltaH > 0 ? "Endothermic" : "Thermoneutral" },
          ],
          note: "Bond energy calculations give approximate ΔH values because they use average bond energies, not exact values for specific molecular environments.",
        };
      },
    },
    {
      id: "calorimetry",
      name: "Calorimetry (q = mcΔT)",
      description: "Calculate heat from calorimeter data",
      fields: [
        { name: "mass", label: "Mass of Solution (g)", type: "number", placeholder: "e.g. 100" },
        { name: "specificHeat", label: "Specific Heat Capacity (J/g·°C)", type: "number", placeholder: "e.g. 4.184 for water", defaultValue: 4.184 },
        { name: "deltaT", label: "Temperature Change ΔT (°C)", type: "number", placeholder: "e.g. 5.0" },
        { name: "molesReacted", label: "Moles of Reactant", type: "number", placeholder: "e.g. 0.01" },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number, c = inputs.specificHeat as number || 4.184;
        const dT = inputs.deltaT as number, moles = inputs.molesReacted as number;
        if (!mass || !dT || !moles || mass <= 0 || moles <= 0) return null;
        const q = mass * c * dT; // J (positive = endothermic from solution perspective)
        const qPerMole = -q / moles; // negative because q_rxn = -q_solution
        return {
          primary: { label: "ΔH per mole", value: `${formatNumber(qPerMole / 1000, 4)} kJ/mol` },
          details: [
            { label: "Heat absorbed by solution (q)", value: `${formatNumber(q, 2)} J` },
            { label: "q in kJ", value: `${formatNumber(q / 1000, 4)} kJ` },
            { label: "ΔH_rxn = -q/moles", value: `${formatNumber(qPerMole, 2)} J/mol` },
            { label: "Type", value: qPerMole < 0 ? "Exothermic (solution warmed)" : "Endothermic (solution cooled)" },
          ],
          note: "When the solution temperature rises (ΔT > 0), the reaction is exothermic (ΔH < 0). q_rxn = -q_solution.",
        };
      },
    },
    {
      id: "hessLaw",
      name: "Hess's Law (Two Steps)",
      description: "ΔH_total = ΔH₁ + ΔH₂",
      fields: [
        { name: "dh1", label: "ΔH₁ (kJ/mol)", type: "number", placeholder: "e.g. -285.8" },
        { name: "mult1", label: "Multiplier for Step 1", type: "number", placeholder: "e.g. 1 or -1 to reverse", step: 0.5, defaultValue: 1 },
        { name: "dh2", label: "ΔH₂ (kJ/mol)", type: "number", placeholder: "e.g. -393.5" },
        { name: "mult2", label: "Multiplier for Step 2", type: "number", placeholder: "e.g. 1 or -1 to reverse", step: 0.5, defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const dh1 = inputs.dh1 as number, m1 = inputs.mult1 as number || 1;
        const dh2 = inputs.dh2 as number, m2 = inputs.mult2 as number || 1;
        if (dh1 === undefined || dh2 === undefined) return null;
        const step1 = dh1 * m1;
        const step2 = dh2 * m2;
        const total = step1 + step2;
        return {
          primary: { label: "ΔH_total", value: `${formatNumber(total, 4)} kJ/mol` },
          details: [
            { label: "Step 1: ΔH₁ × mult", value: `${formatNumber(dh1, 2)} × ${m1} = ${formatNumber(step1, 4)} kJ/mol` },
            { label: "Step 2: ΔH₂ × mult", value: `${formatNumber(dh2, 2)} × ${m2} = ${formatNumber(step2, 4)} kJ/mol` },
            { label: "Type", value: total < 0 ? "Exothermic overall" : "Endothermic overall" },
          ],
          note: "Hess's Law: enthalpy is a state function, so ΔH is path-independent. Reverse a reaction = change sign. Multiply = multiply ΔH by same factor.",
        };
      },
    },
  ],
  relatedSlugs: ["entropy-calculator", "gibbs-free-energy-calculator", "specific-heat-calculator"],
  faq: [
    { question: "What is enthalpy?", answer: "Enthalpy (H) is the total heat content of a system at constant pressure. ΔH < 0 means exothermic (releases heat), ΔH > 0 means endothermic (absorbs heat). Standard conditions: 25°C, 1 atm." },
    { question: "What is Hess's Law?", answer: "Hess's Law states that the total enthalpy change of a reaction is the same regardless of the path taken. You can add, reverse, or multiply known reactions and their ΔH values to find unknown ΔH values." },
    { question: "What is the difference between ΔH and q?", answer: "At constant pressure, ΔH = q (heat). In calorimetry, q_solution = mcΔT measures heat gained by the solution. q_reaction = -q_solution (opposite sign). ΔH per mole = q_reaction / moles." },
  ],
  formula: "ΔH°rxn = ΣΔHf°(products) - ΣΔHf°(reactants) | ΔH = Σ(bonds broken) - Σ(bonds formed) | q = mcΔT",
};
