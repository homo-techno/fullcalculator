import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const freezingPointCalculator: CalculatorDefinition = {
  slug: "freezing-point-calculator",
  title: "Freezing Point Depression Calculator",
  description: "Free freezing point depression calculator. Calculate the freezing point change when a solute is dissolved in a solvent using ΔTf = i·Kf·m.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["freezing point depression", "cryoscopy", "colligative property", "Kf", "antifreeze"],
  variants: [
    {
      id: "depression",
      name: "Calculate Freezing Point Depression",
      fields: [
        { name: "kf", label: "Cryoscopic Constant Kf (°C·kg/mol)", type: "number", placeholder: "e.g. 1.86 for water" },
        { name: "molality", label: "Molality (m, mol/kg)", type: "number", placeholder: "e.g. 0.5" },
        { name: "i", label: "van't Hoff Factor (i)", type: "number", placeholder: "e.g. 1 for non-electrolyte", defaultValue: 1, min: 1, step: 1 },
        { name: "solvent", label: "Solvent", type: "select", options: [
          { label: "Water (Kf = 1.86, FP = 0°C)", value: "water:1.86:0" },
          { label: "Benzene (Kf = 5.12, FP = 5.5°C)", value: "benzene:5.12:5.5" },
          { label: "Acetic Acid (Kf = 3.90, FP = 16.6°C)", value: "acetic:3.90:16.6" },
          { label: "Cyclohexane (Kf = 20.0, FP = 6.5°C)", value: "cyclohexane:20.0:6.5" },
          { label: "Camphor (Kf = 40.0, FP = 178.4°C)", value: "camphor:40.0:178.4" },
          { label: "Custom (use Kf field)", value: "custom:0:0" },
        ] },
      ],
      calculate: (inputs) => {
        const m = inputs.molality as number, i = inputs.i as number || 1;
        const solvent = inputs.solvent as string;
        let kf = inputs.kf as number;
        let normalFP = 0;

        if (solvent && solvent !== "custom:0:0") {
          const parts = solvent.split(":");
          kf = parseFloat(parts[1]);
          normalFP = parseFloat(parts[2]);
        }

        if (!kf || !m || kf <= 0 || m <= 0) return null;
        const deltaTf = i * kf * m;
        const newFP = normalFP - deltaTf;
        return {
          primary: { label: "ΔTf (Depression)", value: `${formatNumber(deltaTf, 4)}°C` },
          details: [
            { label: "New Freezing Point", value: `${formatNumber(newFP, 4)}°C` },
            { label: "Normal Freezing Point", value: `${formatNumber(normalFP, 2)}°C` },
            { label: "Kf", value: `${formatNumber(kf, 3)} °C·kg/mol` },
            { label: "Molality", value: `${formatNumber(m, 4)} mol/kg` },
            { label: "van't Hoff Factor", value: `${i}` },
          ],
        };
      },
    },
    {
      id: "findMolality",
      name: "Find Molality from Depression",
      fields: [
        { name: "deltaTf", label: "Freezing Point Depression (°C)", type: "number", placeholder: "e.g. 1.86" },
        { name: "kf", label: "Kf (°C·kg/mol)", type: "number", placeholder: "e.g. 1.86 for water" },
        { name: "i", label: "van't Hoff Factor (i)", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const dT = inputs.deltaTf as number, kf = inputs.kf as number, i = inputs.i as number || 1;
        if (!dT || !kf || dT <= 0 || kf <= 0 || i <= 0) return null;
        const m = dT / (i * kf);
        return {
          primary: { label: "Molality", value: `${formatNumber(m, 6)} mol/kg` },
          details: [
            { label: "ΔTf", value: `${formatNumber(dT, 4)}°C` },
            { label: "Kf", value: `${formatNumber(kf, 3)} °C·kg/mol` },
            { label: "Effective molality (i×m)", value: `${formatNumber(i * m, 6)} mol/kg` },
          ],
        };
      },
    },
    {
      id: "molarMassFP",
      name: "Molar Mass from Freezing Point",
      description: "Determine molar mass of unknown solute from FP depression",
      fields: [
        { name: "deltaTf", label: "Freezing Point Depression (°C)", type: "number", placeholder: "e.g. 0.93" },
        { name: "kf", label: "Kf (°C·kg/mol)", type: "number", placeholder: "e.g. 1.86 for water" },
        { name: "massSolute", label: "Mass of Solute (g)", type: "number", placeholder: "e.g. 10.0" },
        { name: "massSolvent", label: "Mass of Solvent (g)", type: "number", placeholder: "e.g. 500" },
        { name: "i", label: "van't Hoff Factor (i)", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const dT = inputs.deltaTf as number, kf = inputs.kf as number;
        const mSolute = inputs.massSolute as number, mSolvent = inputs.massSolvent as number;
        const i = inputs.i as number || 1;
        if (!dT || !kf || !mSolute || !mSolvent || dT <= 0 || kf <= 0 || mSolute <= 0 || mSolvent <= 0) return null;
        const molality = dT / (i * kf);
        const kgSolvent = mSolvent / 1000;
        const moles = molality * kgSolvent;
        const molarMass = mSolute / moles;
        return {
          primary: { label: "Molar Mass", value: `${formatNumber(molarMass, 2)} g/mol` },
          details: [
            { label: "Molality", value: `${formatNumber(molality, 6)} mol/kg` },
            { label: "Moles of Solute", value: formatNumber(moles, 6) },
            { label: "ΔTf", value: `${formatNumber(dT, 4)}°C` },
          ],
          note: "Freezing point depression is commonly used to determine molar masses of unknown compounds and to assess electrolyte dissociation.",
        };
      },
    },
  ],
  relatedSlugs: ["boiling-point-calculator", "molality-calculator", "osmotic-pressure-calculator"],
  faq: [
    { question: "What is freezing point depression?", answer: "Freezing point depression is the decrease in freezing point when a solute is added to a solvent. ΔTf = i·Kf·m, where Kf is the cryoscopic constant, m is molality, and i is the van't Hoff factor. It is a colligative property (depends on number of particles, not identity)." },
    { question: "Why does salt lower the freezing point of water?", answer: "NaCl dissociates into Na⁺ and Cl⁻ (i=2), disrupting the crystal lattice formation. This lowers the freezing point by ΔTf = 2 × 1.86 × m. At saturation (~6.1 m), road salt can lower water's FP to about -21°C." },
    { question: "What is the cryoscopic constant?", answer: "Kf is a property of the solvent: Water = 1.86°C·kg/mol, Benzene = 5.12, Camphor = 40.0 (useful for molar mass determination due to large Kf). Higher Kf means greater sensitivity." },
  ],
  formula: "ΔTf = i × Kf × m | New FP = Normal FP - ΔTf | Kf(water) = 1.86 °C·kg/mol",
};
