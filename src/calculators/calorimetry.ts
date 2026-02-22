import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const calorimetryCalculator: CalculatorDefinition = {
  slug: "calorimetry-calculator",
  title: "Calorimetry Calculator",
  description: "Free calorimetry calculator. Calculate heat exchange using q = mcΔT for coffee cup and bomb calorimetry experiments. Determine enthalpy changes from calorimeter data.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["calorimetry", "q=mcΔT", "coffee cup calorimeter", "bomb calorimeter", "heat exchange", "enthalpy"],
  variants: [
    {
      id: "coffee-cup",
      name: "Coffee Cup Calorimeter",
      fields: [
        { name: "massWater", label: "Mass of Water (g)", type: "number", placeholder: "e.g. 100", min: 0, step: 0.01 },
        { name: "tempInitial", label: "Initial Temperature (°C)", type: "number", placeholder: "e.g. 22.0", step: 0.01 },
        { name: "tempFinal", label: "Final Temperature (°C)", type: "number", placeholder: "e.g. 28.5", step: 0.01 },
      ],
      calculate: (inputs) => {
        const m = inputs.massWater as number;
        const Ti = inputs.tempInitial as number;
        const Tf = inputs.tempFinal as number;
        if (!m || Ti === undefined || Tf === undefined || m <= 0) return null;
        const cWater = 4.184;
        const dT = Tf - Ti;
        const qWater = m * cWater * dT;
        const qRxn = -qWater;
        return {
          primary: { label: "Heat of Reaction (q_rxn)", value: formatNumber(qRxn, 2), suffix: "J" },
          details: [
            { label: "q_water", value: `${formatNumber(qWater, 2)} J` },
            { label: "q_rxn (kJ)", value: `${formatNumber(qRxn / 1000, 4)} kJ` },
            { label: "ΔT", value: `${formatNumber(dT, 2)} °C` },
            { label: "Type", value: qRxn < 0 ? "Exothermic" : qRxn > 0 ? "Endothermic" : "No heat change" },
          ],
          note: "q_rxn = -q_water = -(m × c × ΔT). Assumes no heat loss to surroundings and constant pressure.",
        };
      },
    },
    {
      id: "bomb-calorimeter",
      name: "Bomb Calorimeter",
      fields: [
        { name: "cCalorimeter", label: "Calorimeter Heat Capacity (kJ/°C)", type: "number", placeholder: "e.g. 10.5", min: 0, step: 0.01 },
        { name: "tempInitial", label: "Initial Temperature (°C)", type: "number", placeholder: "e.g. 22.0", step: 0.01 },
        { name: "tempFinal", label: "Final Temperature (°C)", type: "number", placeholder: "e.g. 25.3", step: 0.01 },
        { name: "massSample", label: "Mass of Sample (g)", type: "number", placeholder: "e.g. 1.5", min: 0, step: 0.001 },
        { name: "molarMass", label: "Molar Mass of Sample (g/mol)", type: "number", placeholder: "e.g. 180.16", min: 0.001, step: 0.001 },
      ],
      calculate: (inputs) => {
        const C = inputs.cCalorimeter as number;
        const Ti = inputs.tempInitial as number;
        const Tf = inputs.tempFinal as number;
        const massSample = inputs.massSample as number;
        const mm = inputs.molarMass as number;
        if (!C || Ti === undefined || Tf === undefined || !massSample || !mm || C <= 0 || massSample <= 0 || mm <= 0) return null;
        const dT = Tf - Ti;
        const qCalorimeter = C * dT;
        const qRxn = -qCalorimeter;
        const moles = massSample / mm;
        const qPerMol = qRxn / moles;
        return {
          primary: { label: "ΔE (internal energy change)", value: formatNumber(qPerMol, 2), suffix: "kJ/mol" },
          details: [
            { label: "q_calorimeter", value: `${formatNumber(qCalorimeter, 4)} kJ` },
            { label: "q_rxn (total)", value: `${formatNumber(qRxn, 4)} kJ` },
            { label: "ΔT", value: `${formatNumber(dT, 2)} °C` },
            { label: "Moles of Sample", value: formatNumber(moles, 6) },
            { label: "Type", value: qRxn < 0 ? "Exothermic" : "Endothermic" },
          ],
          note: "Bomb calorimetry measures ΔE (constant volume). For ΔH at constant pressure, use ΔH = ΔE + ΔnRT where Δn = moles of gas products - reactants.",
        };
      },
    },
    {
      id: "enthalpy-per-mole",
      name: "Enthalpy per Mole from q",
      fields: [
        { name: "qTotal", label: "Total Heat (q) in kJ", type: "number", placeholder: "e.g. -15.5", step: 0.01 },
        { name: "massSolute", label: "Mass of Solute (g)", type: "number", placeholder: "e.g. 5.0", min: 0, step: 0.01 },
        { name: "molarMass", label: "Molar Mass (g/mol)", type: "number", placeholder: "e.g. 40.0", min: 0.001, step: 0.001 },
      ],
      calculate: (inputs) => {
        const q = inputs.qTotal as number;
        const mass = inputs.massSolute as number;
        const mm = inputs.molarMass as number;
        if (q === undefined || !mass || !mm || mass <= 0 || mm <= 0) return null;
        const moles = mass / mm;
        const qPerMol = q / moles;
        return {
          primary: { label: "Molar Enthalpy Change", value: formatNumber(qPerMol, 2), suffix: "kJ/mol" },
          details: [
            { label: "Total Heat (q)", value: `${formatNumber(q, 4)} kJ` },
            { label: "Moles", value: formatNumber(moles, 6) },
            { label: "Mass", value: `${formatNumber(mass, 4)} g` },
            { label: "Type", value: q < 0 ? "Exothermic" : q > 0 ? "Endothermic" : "No heat change" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["specific-heat-capacity-calculator", "enthalpy-calculator", "heat-of-combustion-calculator"],
  faq: [
    { question: "What is calorimetry?", answer: "Calorimetry is the science of measuring heat changes in chemical or physical processes. A calorimeter isolates a reaction to measure temperature change, which is then converted to heat using q = mcΔT or q = CΔT." },
    { question: "What is the difference between a coffee cup and bomb calorimeter?", answer: "A coffee cup calorimeter operates at constant pressure (measures ΔH), uses a simple insulated container with water, and is suitable for solution reactions. A bomb calorimeter operates at constant volume (measures ΔE), uses a sealed steel vessel, and is used for combustion reactions." },
  ],
  formula: "q_rxn = -q_water = -(m × c × ΔT) | q_bomb = -C_cal × ΔT | ΔH = q / n",
};
