import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const phaseChangeCalculator: CalculatorDefinition = {
  slug: "phase-change-calculator",
  title: "Phase Change Energy Calculator",
  description: "Free phase change energy calculator. Compute the energy required for melting, freezing, boiling, or condensation using latent heat formulas.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["phase change", "latent heat", "heat of fusion", "heat of vaporization", "melting energy", "boiling energy"],
  variants: [
    {
      id: "custom",
      name: "Custom Substance",
      description: "Calculate phase change energy with custom latent heat values",
      fields: [
        { name: "mass", label: "Mass (kg)", type: "number", placeholder: "e.g. 2", min: 0.001 },
        { name: "latentHeat", label: "Specific Latent Heat (kJ/kg)", type: "number", placeholder: "e.g. 334", min: 0.001 },
        {
          name: "direction",
          label: "Process Direction",
          type: "select",
          options: [
            { label: "Absorbing heat (melting/boiling)", value: "absorb" },
            { label: "Releasing heat (freezing/condensing)", value: "release" },
          ],
          defaultValue: "absorb",
        },
      ],
      calculate: (inputs) => {
        const mass = parseFloat(inputs.mass as string);
        const L = parseFloat(inputs.latentHeat as string);
        const direction = (inputs.direction as string) || "absorb";
        if (isNaN(mass) || isNaN(L)) return null;
        if (mass <= 0 || L <= 0) return null;

        const energy = mass * L; // kJ
        const energyJ = energy * 1000;
        const energyCal = energyJ / 4.184;
        const energyBTU = energyJ / 1055.06;
        const sign = direction === "absorb" ? "+" : "-";

        return {
          primary: { label: "Energy Required", value: `${sign}${formatNumber(energy, 4)} kJ` },
          details: [
            { label: "Mass", value: `${formatNumber(mass, 4)} kg` },
            { label: "Specific Latent Heat", value: `${formatNumber(L, 4)} kJ/kg` },
            { label: "Energy (kJ)", value: `${sign}${formatNumber(energy, 4)} kJ` },
            { label: "Energy (J)", value: `${sign}${formatNumber(energyJ, 2)} J` },
            { label: "Energy (kcal)", value: `${sign}${formatNumber(energyCal / 1000, 4)} kcal` },
            { label: "Energy (BTU)", value: `${sign}${formatNumber(energyBTU, 4)} BTU` },
          ],
          note: direction === "absorb"
            ? "Energy is absorbed from surroundings (endothermic process)."
            : "Energy is released to surroundings (exothermic process).",
        };
      },
    },
    {
      id: "water",
      name: "Water Phase Changes",
      description: "Calculate energy for water-specific phase transitions",
      fields: [
        { name: "mass", label: "Mass of Water (kg)", type: "number", placeholder: "e.g. 1", min: 0.001 },
        {
          name: "transition",
          label: "Phase Transition",
          type: "select",
          options: [
            { label: "Ice → Water (melting at 0°C)", value: "melt" },
            { label: "Water → Steam (boiling at 100°C)", value: "boil" },
            { label: "Water → Ice (freezing at 0°C)", value: "freeze" },
            { label: "Steam → Water (condensing at 100°C)", value: "condense" },
            { label: "Ice → Steam (sublimation)", value: "sublime" },
          ],
          defaultValue: "melt",
        },
      ],
      calculate: (inputs) => {
        const mass = parseFloat(inputs.mass as string);
        const transition = (inputs.transition as string) || "melt";
        if (isNaN(mass) || mass <= 0) return null;

        const Lf = 334; // kJ/kg (latent heat of fusion for water)
        const Lv = 2260; // kJ/kg (latent heat of vaporization for water)

        let energy: number;
        let description: string;
        let process: string;
        switch (transition) {
          case "melt":
            energy = mass * Lf;
            description = "Ice → Water at 0°C";
            process = "Endothermic (absorbs heat)";
            break;
          case "boil":
            energy = mass * Lv;
            description = "Water → Steam at 100°C";
            process = "Endothermic (absorbs heat)";
            break;
          case "freeze":
            energy = -mass * Lf;
            description = "Water → Ice at 0°C";
            process = "Exothermic (releases heat)";
            break;
          case "condense":
            energy = -mass * Lv;
            description = "Steam → Water at 100°C";
            process = "Exothermic (releases heat)";
            break;
          case "sublime":
            energy = mass * (Lf + Lv);
            description = "Ice → Steam (sublimation)";
            process = "Endothermic (absorbs heat)";
            break;
          default:
            return null;
        }

        return {
          primary: { label: "Energy", value: `${formatNumber(energy, 2)} kJ` },
          details: [
            { label: "Transition", value: description },
            { label: "Mass", value: `${formatNumber(mass, 4)} kg` },
            { label: "Energy", value: `${formatNumber(energy, 2)} kJ` },
            { label: "Energy (J)", value: `${formatNumber(energy * 1000, 2)} J` },
            { label: "Process Type", value: process },
            { label: "L_fusion (water)", value: `${formatNumber(Lf, 0)} kJ/kg` },
            { label: "L_vaporization (water)", value: `${formatNumber(Lv, 0)} kJ/kg` },
          ],
        };
      },
    },
    {
      id: "total-heating",
      name: "Total Heating (with temperature change)",
      description: "Calculate total energy to heat water from one temperature to another, including any phase changes",
      fields: [
        { name: "mass", label: "Mass of Water (kg)", type: "number", placeholder: "e.g. 0.5", min: 0.001 },
        { name: "t1", label: "Initial Temperature (°C)", type: "number", placeholder: "e.g. -20", min: -273 },
        { name: "t2", label: "Final Temperature (°C)", type: "number", placeholder: "e.g. 120", min: -273 },
      ],
      calculate: (inputs) => {
        const mass = parseFloat(inputs.mass as string);
        const T1 = parseFloat(inputs.t1 as string);
        const T2 = parseFloat(inputs.t2 as string);
        if (isNaN(mass) || isNaN(T1) || isNaN(T2)) return null;
        if (mass <= 0 || T1 >= T2) return null;

        const cIce = 2.09; // kJ/(kg·K)
        const cWater = 4.184; // kJ/(kg·K)
        const cSteam = 2.01; // kJ/(kg·K)
        const Lf = 334; // kJ/kg
        const Lv = 2260; // kJ/kg

        let totalEnergy = 0;
        const steps: { label: string; value: string }[] = [];

        // Heating ice to 0°C
        if (T1 < 0) {
          const tEnd = Math.min(T2, 0);
          const q = mass * cIce * (tEnd - T1);
          totalEnergy += q;
          steps.push({ label: `Heat ice ${formatNumber(T1, 1)}°C → ${formatNumber(tEnd, 1)}°C`, value: `${formatNumber(q, 2)} kJ` });
        }

        // Melting at 0°C
        if (T1 < 0 && T2 > 0) {
          const q = mass * Lf;
          totalEnergy += q;
          steps.push({ label: "Melt ice at 0°C", value: `${formatNumber(q, 2)} kJ` });
        }

        // Heating water
        const waterStart = Math.max(T1, 0);
        const waterEnd = Math.min(T2, 100);
        if (waterStart < waterEnd && waterStart < 100) {
          const q = mass * cWater * (waterEnd - waterStart);
          totalEnergy += q;
          steps.push({ label: `Heat water ${formatNumber(waterStart, 1)}°C → ${formatNumber(waterEnd, 1)}°C`, value: `${formatNumber(q, 2)} kJ` });
        }

        // Boiling at 100°C
        if (T1 < 100 && T2 > 100) {
          const q = mass * Lv;
          totalEnergy += q;
          steps.push({ label: "Boil water at 100°C", value: `${formatNumber(q, 2)} kJ` });
        }

        // Heating steam
        if (T2 > 100) {
          const steamStart = Math.max(T1, 100);
          const q = mass * cSteam * (T2 - steamStart);
          totalEnergy += q;
          steps.push({ label: `Heat steam ${formatNumber(steamStart, 1)}°C → ${formatNumber(T2, 1)}°C`, value: `${formatNumber(q, 2)} kJ` });
        }

        return {
          primary: { label: "Total Energy", value: `${formatNumber(totalEnergy, 2)} kJ` },
          details: [
            { label: "Mass", value: `${formatNumber(mass, 4)} kg` },
            { label: "Temperature Range", value: `${formatNumber(T1, 1)}°C → ${formatNumber(T2, 1)}°C` },
            ...steps,
            { label: "Total Energy", value: `${formatNumber(totalEnergy, 2)} kJ` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["carnot-efficiency-calculator", "adiabatic-process-calculator", "energy-calculator"],
  faq: [
    { question: "What is latent heat?", answer: "Latent heat is the energy absorbed or released during a phase change at constant temperature. Latent heat of fusion (L_f) is for solid↔liquid transitions; latent heat of vaporization (L_v) is for liquid↔gas. For water: L_f = 334 kJ/kg, L_v = 2260 kJ/kg." },
    { question: "Why does temperature stay constant during a phase change?", answer: "During a phase change, all supplied energy goes into breaking or forming intermolecular bonds rather than increasing kinetic energy. Temperature only changes once the phase transition is complete. This is why boiling water stays at 100°C until all water has become steam." },
    { question: "What is the formula for phase change energy?", answer: "Q = mL, where Q is energy (Joules), m is mass (kg), and L is the specific latent heat (J/kg). For temperature changes within a phase: Q = mcΔT, where c is the specific heat capacity." },
  ],
  formula: "Q = mL (phase change) | Q = mcΔT (temperature change) | Water: L_f = 334 kJ/kg, L_v = 2260 kJ/kg",
};
