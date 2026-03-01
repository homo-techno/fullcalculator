import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const repairVsReplaceCalculator: CalculatorDefinition = {
  slug: "repair-vs-replace-calculator",
  title: "Repair vs Replace Calculator",
  description: "Determine whether it is more cost-effective to repair an existing item or replace it with a new one.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["repair or replace", "fix or buy new", "repair vs replacement cost"],
  variants: [{
    id: "standard",
    name: "Repair vs Replace",
    description: "Determine whether it is more cost-effective to repair an existing item or replace it with a new one",
    fields: [
      { name: "repairCost", label: "Estimated Repair Cost", type: "number", prefix: "$", min: 10, max: 50000, step: 25, defaultValue: 350 },
      { name: "replacementCost", label: "Replacement Cost (New)", type: "number", prefix: "$", min: 50, max: 100000, step: 50, defaultValue: 800 },
      { name: "currentAge", label: "Current Item Age", type: "number", suffix: "years", min: 0, max: 30, defaultValue: 7 },
      { name: "expectedLifespan", label: "Expected Total Lifespan", type: "number", suffix: "years", min: 1, max: 30, defaultValue: 12 },
    ],
    calculate: (inputs) => {
      const repair = inputs.repairCost as number;
      const replace = inputs.replacementCost as number;
      const age = inputs.currentAge as number;
      const lifespan = inputs.expectedLifespan as number;
      if (!repair || !replace || !lifespan || replace <= 0) return null;
      const remainingLife = Math.max(0.5, lifespan - age);
      const repairCostPerYear = repair / (remainingLife * 0.5);
      const replaceCostPerYear = replace / lifespan;
      const fiftyPercentRule = repair > replace * 0.5;
      const recommendation = fiftyPercentRule ? "Replace" : repairCostPerYear > replaceCostPerYear ? "Replace" : "Repair";
      const savings = recommendation === "Repair" ? replace - repair : repair - replace;
      return {
        primary: { label: "Recommendation", value: recommendation },
        details: [
          { label: "Repair Cost Per Remaining Year", value: "$" + formatNumber(Math.round(repairCostPerYear)) },
          { label: "Replacement Cost Per Year (new)", value: "$" + formatNumber(Math.round(replaceCostPerYear)) },
          { label: "Immediate Savings by " + (recommendation === "Repair" ? "Repairing" : "Not Repairing"), value: "$" + formatNumber(Math.abs(Math.round(savings))) },
        ],
      };
    },
  }],
  relatedSlugs: ["appliance-lifespan-calculator", "home-maintenance-budget-calculator"],
  faq: [
    { question: "What is the 50 percent rule for repair vs replace?", answer: "The 50 percent rule suggests that if the repair cost exceeds 50 percent of the replacement cost, it is generally better to replace the item. This rule works well for appliances and vehicles nearing the end of their expected lifespan." },
    { question: "What other factors should I consider besides cost?", answer: "Consider energy efficiency improvements in newer models, warranty coverage on a new purchase, environmental impact, frequency of recent repairs, and whether the item meets current needs and safety standards." },
  ],
  formula: "Repair Cost Per Year = Repair Cost / Remaining Life; Replace Cost Per Year = New Cost / Full Lifespan; 50% Rule check",
};
