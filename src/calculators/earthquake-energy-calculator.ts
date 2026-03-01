import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const earthquakeEnergyCalculator: CalculatorDefinition = {
  slug: "earthquake-energy-calculator",
  title: "Earthquake Energy Calculator",
  description: "Calculate the energy released by an earthquake from its Richter magnitude.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["earthquake energy", "richter scale energy", "seismic energy calculator"],
  variants: [{
    id: "standard",
    name: "Earthquake Energy",
    description: "Calculate the energy released by an earthquake from its Richter magnitude",
    fields: [
      { name: "magnitude", label: "Richter Magnitude", type: "number", suffix: "", min: 0, max: 10, defaultValue: 5 },
      { name: "compareMag", label: "Compare With Magnitude", type: "number", suffix: "", min: 0, max: 10, defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const mag = inputs.magnitude as number;
      const cmpMag = inputs.compareMag as number;
      if (mag === undefined || mag < 0) return null;
      const energy = Math.pow(10, 1.5 * mag + 4.8);
      const cmpEnergy = Math.pow(10, 1.5 * (cmpMag || 0) + 4.8);
      const ratio = energy / cmpEnergy;
      const tntTons = energy / 4.184e9;
      const label = mag < 3 ? "Minor" : mag < 5 ? "Light to Moderate" : mag < 7 ? "Strong" : "Major to Great";
      return {
        primary: { label: "Energy Released", value: energy.toExponential(2) + " Joules" },
        details: [
          { label: "TNT Equivalent", value: formatNumber(Math.round(tntTons * 100) / 100) + " tons" },
          { label: "Times Stronger Than M" + (cmpMag || 0), value: formatNumber(Math.round(ratio * 100) / 100) + "x" },
          { label: "Classification", value: label },
        ],
      };
    },
  }],
  relatedSlugs: ["terminal-velocity-calculator", "escape-velocity-calculator"],
  faq: [
    { question: "How much energy does a magnitude 5 earthquake release?", answer: "A magnitude 5 earthquake releases approximately 2 x 10^12 Joules of energy, equivalent to about 500 tons of TNT." },
    { question: "How much stronger is each magnitude increase?", answer: "Each whole number increase in magnitude represents roughly 31.6 times more energy released." },
  ],
  formula: "Energy (Joules) = 10^(1.5 x Magnitude + 4.8)",
};
