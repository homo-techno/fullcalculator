import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heatOfCombustionCalculator: CalculatorDefinition = {
  slug: "heat-of-combustion-calculator",
  title: "Heat of Combustion Calculator",
  description: "Free heat of combustion calculator. Calculate the energy released during complete combustion of fuels and organic compounds. Compare energy densities.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["heat of combustion", "enthalpy of combustion", "fuel energy", "calorific value", "energy density"],
  variants: [
    {
      id: "from-mass",
      name: "Heat Released from Mass",
      fields: [
        { name: "mass", label: "Mass of Fuel (grams)", type: "number", placeholder: "e.g. 100", min: 0, step: 0.01 },
        {
          name: "fuel",
          label: "Fuel Type",
          type: "select",
          options: [
            { label: "Methane (CH₄) - 890 kJ/mol", value: "890,16.04" },
            { label: "Ethanol (C₂H₅OH) - 1367 kJ/mol", value: "1367,46.07" },
            { label: "Propane (C₃H₈) - 2220 kJ/mol", value: "2220,44.10" },
            { label: "Butane (C₄H₁₀) - 2878 kJ/mol", value: "2878,58.12" },
            { label: "Octane (C₈H₁₈) - 5471 kJ/mol", value: "5471,114.23" },
            { label: "Glucose (C₆H₁₂O₆) - 2803 kJ/mol", value: "2803,180.16" },
            { label: "Hydrogen (H₂) - 286 kJ/mol", value: "286,2.016" },
            { label: "Carbon (C) - 394 kJ/mol", value: "394,12.011" },
          ],
        },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number;
        const fuelStr = inputs.fuel as string;
        if (!mass || !fuelStr || mass < 0) return null;
        const parts = fuelStr.split(",");
        const heatPerMol = parseFloat(parts[0]);
        const molarMass = parseFloat(parts[1]);
        const moles = mass / molarMass;
        const totalHeat = moles * heatPerMol;
        const heatPerGram = heatPerMol / molarMass;
        return {
          primary: { label: "Heat Released", value: formatNumber(totalHeat, 2), suffix: "kJ" },
          details: [
            { label: "Moles Burned", value: formatNumber(moles, 4) },
            { label: "Heat per Mole", value: `${formatNumber(heatPerMol, 1)} kJ/mol` },
            { label: "Heat per Gram", value: `${formatNumber(heatPerGram, 2)} kJ/g` },
            { label: "Calories Released", value: `${formatNumber(totalHeat / 4.184, 2)} kcal` },
            { label: "BTU", value: formatNumber(totalHeat * 0.9478, 2) },
          ],
          note: "Values are standard enthalpies of combustion (ΔH°comb) at 25°C and 1 atm. Negative sign (exothermic) is implied.",
        };
      },
    },
    {
      id: "custom",
      name: "Custom Combustion Heat",
      fields: [
        { name: "mass", label: "Mass of Substance (g)", type: "number", placeholder: "e.g. 50", min: 0, step: 0.01 },
        { name: "molarMass", label: "Molar Mass (g/mol)", type: "number", placeholder: "e.g. 46.07", min: 0.001, step: 0.001 },
        { name: "heatPerMol", label: "ΔH combustion (kJ/mol)", type: "number", placeholder: "e.g. 1367", min: 0, step: 0.1 },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number;
        const molarMass = inputs.molarMass as number;
        const heatPerMol = inputs.heatPerMol as number;
        if (!mass || !molarMass || !heatPerMol || mass < 0 || molarMass <= 0 || heatPerMol <= 0) return null;
        const moles = mass / molarMass;
        const totalHeat = moles * heatPerMol;
        const heatPerGram = heatPerMol / molarMass;
        return {
          primary: { label: "Heat Released", value: formatNumber(totalHeat, 2), suffix: "kJ" },
          details: [
            { label: "Moles Burned", value: formatNumber(moles, 4) },
            { label: "Heat per Gram", value: `${formatNumber(heatPerGram, 2)} kJ/g` },
            { label: "Heat per Mole", value: `${formatNumber(heatPerMol, 1)} kJ/mol` },
            { label: "Calories", value: `${formatNumber(totalHeat / 4.184, 2)} kcal` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["calorimetry-calculator", "enthalpy-calculator", "specific-heat-capacity-calculator"],
  faq: [
    { question: "What is heat of combustion?", answer: "Heat of combustion (ΔH_comb) is the energy released when one mole of a substance undergoes complete combustion with oxygen under standard conditions. It is always exothermic (negative ΔH), meaning energy is released." },
    { question: "Why is hydrogen considered a clean fuel?", answer: "Hydrogen combustion produces only water (2H₂ + O₂ → 2H₂O), releasing 142 kJ/g — the highest energy per gram of any common fuel. It produces no CO₂ emissions, though its production method matters." },
  ],
  formula: "q = n × ΔH_comb | n = mass / molar_mass | Energy density = ΔH_comb / molar_mass",
};
