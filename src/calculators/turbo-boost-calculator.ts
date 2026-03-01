import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const turboBoostCalculator: CalculatorDefinition = {
  slug: "turbo-boost-calculator",
  title: "Turbo Boost Calculator",
  description: "Calculate turbo pressure ratio and estimated power gain from forced induction.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["turbo boost", "turbo pressure ratio", "forced induction calculator"],
  variants: [{
    id: "standard",
    name: "Turbo Boost",
    description: "Calculate turbo pressure ratio and estimated power gain from forced induction",
    fields: [
      { name: "boostPSI", label: "Boost Pressure", type: "number", suffix: "psi", min: 1, max: 50, defaultValue: 12 },
      { name: "baseHP", label: "Naturally Aspirated HP", type: "number", suffix: "hp", min: 50, max: 1000, defaultValue: 200 },
      { name: "efficiency", label: "Turbo Efficiency", type: "number", suffix: "%", min: 40, max: 90, defaultValue: 70 },
    ],
    calculate: (inputs) => {
      const boost = inputs.boostPSI as number;
      const baseHP = inputs.baseHP as number;
      const eff = inputs.efficiency as number;
      if (!boost || !baseHP || !eff) return null;
      const atm = 14.7;
      const pressureRatio = (atm + boost) / atm;
      const theoreticalGain = baseHP * (pressureRatio - 1);
      const actualGain = theoreticalGain * (eff / 100);
      const totalHP = baseHP + actualGain;
      return {
        primary: { label: "Estimated Total HP", value: formatNumber(Math.round(totalHP)) + " hp" },
        details: [
          { label: "Pressure Ratio", value: pressureRatio.toFixed(2) + ":1" },
          { label: "Theoretical Gain", value: formatNumber(Math.round(theoreticalGain)) + " hp" },
          { label: "Actual Gain (with efficiency)", value: formatNumber(Math.round(actualGain)) + " hp" },
          { label: "Power Increase", value: ((actualGain / baseHP) * 100).toFixed(1) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["engine-displacement-calculator", "fuel-injector-calculator"],
  faq: [
    { question: "How much power does a turbo add?", answer: "A turbo typically adds 30-50% more power depending on boost pressure, intercooling, and engine tuning." },
    { question: "What is pressure ratio?", answer: "Pressure ratio is the total absolute pressure (atmospheric plus boost) divided by atmospheric pressure. A ratio of 1.8:1 means 80% more air density." },
  ],
  formula: "Total HP = Base HP + (Base HP x (Pressure Ratio - 1) x Efficiency)",
};
