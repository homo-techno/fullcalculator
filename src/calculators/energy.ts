import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const energyCalculator: CalculatorDefinition = {
  slug: "energy-calculator",
  title: "Energy Calculator",
  description: "Free energy calculator. Calculate kinetic energy, potential energy, and work done. Convert between energy units (joules, calories, kWh).",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["energy calculator", "kinetic energy calculator", "potential energy calculator", "joules calculator", "work energy calculator"],
  variants: [
    {
      id: "kinetic",
      name: "Kinetic Energy",
      description: "KE = ½mv²",
      fields: [
        { name: "mass", label: "Mass (kg)", type: "number", placeholder: "e.g. 10" },
        { name: "velocity", label: "Velocity (m/s)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const m = inputs.mass as number;
        const v = inputs.velocity as number;
        if (!m || v === undefined) return null;
        const ke = 0.5 * m * v * v;
        return {
          primary: { label: "Kinetic Energy", value: `${formatNumber(ke, 4)} J` },
          details: [
            { label: "Joules", value: formatNumber(ke, 4) },
            { label: "Kilojoules", value: formatNumber(ke / 1000, 6) },
            { label: "Calories", value: formatNumber(ke / 4.184, 4) },
            { label: "kWh", value: formatNumber(ke / 3600000, 8) },
          ],
        };
      },
    },
    {
      id: "potential",
      name: "Potential Energy",
      description: "PE = mgh",
      fields: [
        { name: "mass", label: "Mass (kg)", type: "number", placeholder: "e.g. 10" },
        { name: "height", label: "Height (m)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const m = inputs.mass as number;
        const h = inputs.height as number;
        if (!m || h === undefined) return null;
        const pe = m * 9.81 * h;
        return {
          primary: { label: "Potential Energy", value: `${formatNumber(pe, 4)} J` },
          details: [
            { label: "Joules", value: formatNumber(pe, 4) },
            { label: "Kilojoules", value: formatNumber(pe / 1000, 6) },
            { label: "g used", value: "9.81 m/s²" },
          ],
        };
      },
    },
    {
      id: "convert",
      name: "Energy Converter",
      description: "Convert between energy units",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 1000" },
        { name: "from", label: "From", type: "select", options: [
          { label: "Joules (J)", value: "1" },
          { label: "Kilojoules (kJ)", value: "1000" },
          { label: "Calories (cal)", value: "4.184" },
          { label: "Kilocalories (kcal)", value: "4184" },
          { label: "Watt-hours (Wh)", value: "3600" },
          { label: "Kilowatt-hours (kWh)", value: "3600000" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const factor = parseFloat(inputs.from as string) || 1;
        if (!value) return null;
        const joules = value * factor;
        return {
          primary: { label: "Energy", value: `${formatNumber(joules)} J` },
          details: [
            { label: "Joules", value: formatNumber(joules) },
            { label: "Kilojoules", value: formatNumber(joules / 1000, 6) },
            { label: "Calories", value: formatNumber(joules / 4.184) },
            { label: "Kilocalories", value: formatNumber(joules / 4184, 6) },
            { label: "Watt-hours", value: formatNumber(joules / 3600, 6) },
            { label: "kWh", value: formatNumber(joules / 3600000, 8) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["force-calculator", "speed-distance-time-calculator", "electricity-cost-calculator"],
  faq: [
    { question: "What is energy?", answer: "Energy is the ability to do work, measured in Joules (J). Kinetic energy is energy of motion (½mv²). Potential energy is stored energy due to position (mgh). Energy is conserved — it transforms but is never created or destroyed." },
  ],
  formula: "KE = ½mv² | PE = mgh | 1 cal = 4.184 J | 1 kWh = 3,600,000 J",
};
