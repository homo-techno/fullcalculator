import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tractorPtoCalculator: CalculatorDefinition = {
  slug: "tractor-pto-calculator",
  title: "Tractor PTO Calculator",
  description: "Estimate PTO horsepower needs for implements.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["tractor PTO","PTO horsepower calculator"],
  variants: [{
    id: "standard",
    name: "Tractor PTO",
    description: "Estimate PTO horsepower needs for implements.",
    fields: [
      { name: "implementHP", label: "Implement PTO Requirement (HP)", type: "number", min: 5, max: 500, defaultValue: 45 },
      { name: "ptoEfficiency", label: "PTO Efficiency (%)", type: "number", min: 70, max: 100, defaultValue: 86 },
      { name: "altitude", label: "Altitude (feet)", type: "number", min: 0, max: 10000, defaultValue: 500 },
      { name: "safetyMargin", label: "Safety Margin (%)", type: "number", min: 0, max: 50, defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const ihp = inputs.implementHP as number;
      const eff = inputs.ptoEfficiency as number;
      const alt = inputs.altitude as number;
      const margin = inputs.safetyMargin as number;
      if (!ihp || !eff) return null;
      var altDerate = 1 - (alt / 1000) * 0.035;
      if (altDerate < 0.5) altDerate = 0.5;
      var engineHP = ihp / (eff / 100);
      var adjustedHP = engineHP / altDerate;
      var recommended = Math.ceil(adjustedHP * (1 + margin / 100));
      return {
        primary: { label: "Recommended Engine HP", value: formatNumber(recommended) + " HP" },
        details: [
          { label: "Engine HP at Sea Level", value: formatNumber(Math.round(engineHP * 10) / 10) + " HP" },
          { label: "Altitude Derating", value: formatNumber(Math.round((1 - altDerate) * 100)) + "%" },
          { label: "Safety Margin", value: margin + "%" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is PTO efficiency?", answer: "PTO efficiency is the percentage of engine power that reaches the PTO shaft, typically 83 to 87%." },
    { question: "How does altitude affect tractor power?", answer: "Engines lose about 3.5 percent of power for every 1000 feet of altitude." },
  ],
  formula: "Engine HP = (Implement HP / PTO Efficiency) / Altitude Factor x (1 + Margin)",
};
