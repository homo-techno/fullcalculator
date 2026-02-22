import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ppmCalculator: CalculatorDefinition = {
  slug: "ppm-calculator",
  title: "PPM Calculator",
  description: "Free PPM (parts per million) calculator. Convert between PPM, percentage, mg/L, and mg/kg. Used in water quality, environmental science, and lab analysis.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["ppm calculator", "parts per million", "concentration", "water quality", "mg/L", "environmental"],
  variants: [
    {
      id: "mass-ppm",
      name: "PPM from Mass",
      fields: [
        { name: "soluteMass", label: "Solute Mass (mg)", type: "number", placeholder: "e.g. 50", min: 0, step: 0.01 },
        { name: "solutionMass", label: "Solution Mass (kg)", type: "number", placeholder: "e.g. 1.0", min: 0.001, step: 0.001 },
      ],
      calculate: (inputs) => {
        const soluteMass = inputs.soluteMass as number;
        const solutionMass = inputs.solutionMass as number;
        if (!soluteMass || !solutionMass || soluteMass < 0 || solutionMass <= 0) return null;
        const ppm = soluteMass / solutionMass;
        const percent = ppm / 10000;
        const ppb = ppm * 1000;
        return {
          primary: { label: "Concentration", value: formatNumber(ppm, 4), suffix: "ppm" },
          details: [
            { label: "Percentage", value: `${formatNumber(percent, 6)}%` },
            { label: "PPB", value: formatNumber(ppb, 2) },
            { label: "mg/kg", value: formatNumber(ppm, 4) },
            { label: "mg/L (approx. for water)", value: formatNumber(ppm, 4) },
          ],
          note: "1 ppm = 1 mg/kg = 1 mg/L (for dilute aqueous solutions). 1 ppm = 0.0001%.",
        };
      },
    },
    {
      id: "percent-to-ppm",
      name: "Percentage to PPM",
      fields: [
        { name: "percent", label: "Percentage (%)", type: "number", placeholder: "e.g. 0.5", min: 0, step: 0.001 },
      ],
      calculate: (inputs) => {
        const percent = inputs.percent as number;
        if (percent === undefined || percent < 0) return null;
        const ppm = percent * 10000;
        const ppb = ppm * 1000;
        return {
          primary: { label: "Concentration", value: formatNumber(ppm, 2), suffix: "ppm" },
          details: [
            { label: "Percentage", value: `${formatNumber(percent, 6)}%` },
            { label: "PPB", value: formatNumber(ppb, 2) },
            { label: "Decimal", value: formatNumber(percent / 100, 8) },
          ],
        };
      },
    },
    {
      id: "ppm-to-molarity",
      name: "PPM to Molarity",
      fields: [
        { name: "ppm", label: "Concentration (ppm or mg/L)", type: "number", placeholder: "e.g. 100", min: 0, step: 0.01 },
        { name: "molarMass", label: "Molar Mass (g/mol)", type: "number", placeholder: "e.g. 58.44 for NaCl", min: 0.001, step: 0.001 },
      ],
      calculate: (inputs) => {
        const ppm = inputs.ppm as number;
        const molarMass = inputs.molarMass as number;
        if (!ppm || !molarMass || ppm < 0 || molarMass <= 0) return null;
        const mgPerL = ppm;
        const gPerL = mgPerL / 1000;
        const molarity = gPerL / molarMass;
        return {
          primary: { label: "Molarity", value: molarity.toExponential(4), suffix: "M" },
          details: [
            { label: "PPM", value: formatNumber(ppm, 4) },
            { label: "mg/L", value: formatNumber(mgPerL, 4) },
            { label: "g/L", value: formatNumber(gPerL, 6) },
            { label: "Molar Mass", value: `${formatNumber(molarMass, 4)} g/mol` },
          ],
          note: "Molarity = (ppm / 1000) / molar mass. Assumes dilute aqueous solution where density ≈ 1 g/mL.",
        };
      },
    },
  ],
  relatedSlugs: ["concentration-calculator", "molarity-calculator", "dilution-calculator"],
  faq: [
    { question: "What does PPM mean?", answer: "PPM stands for parts per million. It represents one unit of solute per million units of solution. For aqueous solutions, 1 ppm ≈ 1 mg/L. It is commonly used for trace concentrations in water quality, pollution, and food science." },
    { question: "How do I convert PPM to percentage?", answer: "Divide PPM by 10,000 to get percentage. For example, 5000 ppm = 0.5%. Conversely, multiply percentage by 10,000 to get PPM." },
  ],
  formula: "ppm = (mass of solute / mass of solution) × 10⁶ | 1 ppm = 1 mg/kg = 1 mg/L (water)",
};
