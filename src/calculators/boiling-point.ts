import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boilingPointCalculator: CalculatorDefinition = {
  slug: "boiling-point-calculator",
  title: "Boiling Point Elevation Calculator",
  description: "Free boiling point elevation calculator. Calculate the increase in boiling point when a solute is dissolved in a solvent using ΔTb = i·Kb·m.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["boiling point elevation", "ebullioscopy", "colligative property", "Kb", "boiling point"],
  variants: [
    {
      id: "elevation",
      name: "Calculate Boiling Point Elevation",
      fields: [
        { name: "kb", label: "Ebullioscopic Constant Kb (°C·kg/mol)", type: "number", placeholder: "e.g. 0.512 for water" },
        { name: "molality", label: "Molality (m, mol/kg)", type: "number", placeholder: "e.g. 0.5" },
        { name: "i", label: "van't Hoff Factor (i)", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
        { name: "solvent", label: "Solvent", type: "select", options: [
          { label: "Water (Kb = 0.512, BP = 100°C)", value: "water:0.512:100" },
          { label: "Benzene (Kb = 2.53, BP = 80.1°C)", value: "benzene:2.53:80.1" },
          { label: "Acetic Acid (Kb = 3.07, BP = 118.1°C)", value: "acetic:3.07:118.1" },
          { label: "Chloroform (Kb = 3.63, BP = 61.2°C)", value: "chloroform:3.63:61.2" },
          { label: "Ethanol (Kb = 1.22, BP = 78.4°C)", value: "ethanol:1.22:78.4" },
          { label: "Custom (use Kb field)", value: "custom:0:0" },
        ] },
      ],
      calculate: (inputs) => {
        const m = inputs.molality as number, i = inputs.i as number || 1;
        const solvent = inputs.solvent as string;
        let kb = inputs.kb as number;
        let normalBP = 0;

        if (solvent && solvent !== "custom:0:0") {
          const parts = solvent.split(":");
          kb = parseFloat(parts[1]);
          normalBP = parseFloat(parts[2]);
        }

        if (!kb || !m || kb <= 0 || m <= 0) return null;
        const deltaTb = i * kb * m;
        const newBP = normalBP + deltaTb;
        return {
          primary: { label: "ΔTb (Elevation)", value: `${formatNumber(deltaTb, 4)}°C` },
          details: [
            { label: "New Boiling Point", value: `${formatNumber(newBP, 4)}°C` },
            { label: "Normal Boiling Point", value: `${formatNumber(normalBP, 2)}°C` },
            { label: "Kb", value: `${formatNumber(kb, 3)} °C·kg/mol` },
            { label: "Molality", value: `${formatNumber(m, 4)} mol/kg` },
            { label: "van't Hoff Factor", value: `${i}` },
          ],
        };
      },
    },
    {
      id: "findMolality",
      name: "Find Molality from Elevation",
      fields: [
        { name: "deltaTb", label: "Boiling Point Elevation (°C)", type: "number", placeholder: "e.g. 0.512" },
        { name: "kb", label: "Kb (°C·kg/mol)", type: "number", placeholder: "e.g. 0.512 for water" },
        { name: "i", label: "van't Hoff Factor (i)", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const dT = inputs.deltaTb as number, kb = inputs.kb as number, i = inputs.i as number || 1;
        if (!dT || !kb || dT <= 0 || kb <= 0 || i <= 0) return null;
        const m = dT / (i * kb);
        return {
          primary: { label: "Molality", value: `${formatNumber(m, 6)} mol/kg` },
          details: [
            { label: "ΔTb", value: `${formatNumber(dT, 4)}°C` },
            { label: "Kb", value: `${formatNumber(kb, 3)} °C·kg/mol` },
            { label: "Effective molality (i×m)", value: `${formatNumber(i * m, 6)} mol/kg` },
          ],
        };
      },
    },
    {
      id: "molarMassBP",
      name: "Molar Mass from Boiling Point",
      description: "Determine molar mass of unknown solute from BP elevation",
      fields: [
        { name: "deltaTb", label: "Boiling Point Elevation (°C)", type: "number", placeholder: "e.g. 0.26" },
        { name: "kb", label: "Kb (°C·kg/mol)", type: "number", placeholder: "e.g. 0.512 for water" },
        { name: "massSolute", label: "Mass of Solute (g)", type: "number", placeholder: "e.g. 5.0" },
        { name: "massSolvent", label: "Mass of Solvent (g)", type: "number", placeholder: "e.g. 100" },
        { name: "i", label: "van't Hoff Factor (i)", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const dT = inputs.deltaTb as number, kb = inputs.kb as number;
        const mSolute = inputs.massSolute as number, mSolvent = inputs.massSolvent as number;
        const i = inputs.i as number || 1;
        if (!dT || !kb || !mSolute || !mSolvent || dT <= 0 || kb <= 0 || mSolute <= 0 || mSolvent <= 0) return null;
        const molality = dT / (i * kb);
        const kgSolvent = mSolvent / 1000;
        const moles = molality * kgSolvent;
        const molarMass = mSolute / moles;
        return {
          primary: { label: "Molar Mass", value: `${formatNumber(molarMass, 2)} g/mol` },
          details: [
            { label: "Molality", value: `${formatNumber(molality, 6)} mol/kg` },
            { label: "Moles of Solute", value: formatNumber(moles, 6) },
            { label: "ΔTb", value: `${formatNumber(dT, 4)}°C` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["freezing-point-calculator", "molality-calculator", "osmotic-pressure-calculator"],
  faq: [
    { question: "What is boiling point elevation?", answer: "Boiling point elevation is the increase in boiling point when a non-volatile solute is added to a solvent. ΔTb = i·Kb·m, where Kb is the ebullioscopic constant, m is molality, and i is the van't Hoff factor. It is a colligative property." },
    { question: "Why does adding salt raise the boiling point of water?", answer: "Salt (NaCl, i=2) dissolves and reduces the solvent's vapor pressure (Raoult's Law). A higher temperature is needed to reach the atmospheric pressure and boil. For 1 m NaCl in water: ΔTb = 2 × 0.512 × 1 = 1.024°C." },
    { question: "What is the ebullioscopic constant?", answer: "Kb is specific to each solvent: Water = 0.512°C·kg/mol, Benzene = 2.53, Chloroform = 3.63. It depends on the solvent's molar mass, boiling point, and enthalpy of vaporization." },
  ],
  formula: "ΔTb = i × Kb × m | New BP = Normal BP + ΔTb | Kb(water) = 0.512 °C·kg/mol",
};
