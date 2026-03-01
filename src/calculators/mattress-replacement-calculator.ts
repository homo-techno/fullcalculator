import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mattressReplacementCalculator: CalculatorDefinition = {
  slug: "mattress-replacement-calculator",
  title: "Mattress Replacement Calculator",
  description: "Determine when to replace your mattress based on age, condition, and sleep quality indicators.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["mattress replacement", "mattress lifespan", "when to replace mattress"],
  variants: [{
    id: "standard",
    name: "Mattress Replacement",
    description: "Determine when to replace your mattress based on age, condition, and sleep quality indicators",
    fields: [
      { name: "mattressAge", label: "Mattress Age", type: "number", suffix: "years", min: 0, max: 30, defaultValue: 7 },
      { name: "mattressType", label: "Mattress Type", type: "select", options: [{value:"innerspring",label:"Innerspring"},{value:"memory-foam",label:"Memory Foam"},{value:"latex",label:"Latex"},{value:"hybrid",label:"Hybrid"}], defaultValue: "memory-foam" },
      { name: "weight", label: "Sleeper Weight", type: "number", suffix: "lbs", min: 80, max: 500, defaultValue: 170 },
      { name: "quality", label: "Sleep Quality (1-10)", type: "number", min: 1, max: 10, defaultValue: 6 },
    ],
    calculate: (inputs) => {
      const age = inputs.mattressAge as number;
      const type = inputs.mattressType as string;
      const weight = inputs.weight as number;
      const quality = inputs.quality as number;
      if (!age && age !== 0) return null;
      const lifespan: Record<string, number> = { innerspring: 7, "memory-foam": 10, latex: 15, hybrid: 8 };
      const maxYears = lifespan[type] || 8;
      const weightFactor = weight > 250 ? 0.75 : weight > 200 ? 0.85 : 1.0;
      const adjustedLife = Math.round(maxYears * weightFactor);
      const remaining = Math.max(0, adjustedLife - age);
      const wearPercent = Math.min(100, Math.round((age / adjustedLife) * 100));
      let recommendation = "Your mattress is in good condition";
      if (wearPercent >= 100 || quality <= 4) recommendation = "Replace your mattress soon";
      else if (wearPercent >= 80 || quality <= 6) recommendation = "Start shopping for a replacement";
      return {
        primary: { label: "Recommendation", value: recommendation },
        details: [
          { label: "Years Remaining", value: remaining + " years" },
          { label: "Wear Level", value: wearPercent + "%" },
          { label: "Expected Lifespan", value: adjustedLife + " years" },
        ],
      };
    },
  }],
  relatedSlugs: ["closet-space-calculator", "air-filter-schedule-calculator"],
  faq: [
    { question: "How often should you replace a mattress?", answer: "Most mattresses should be replaced every 7-10 years. Latex mattresses can last 12-15 years while innerspring models may need replacement after 6-8 years." },
    { question: "What are signs you need a new mattress?", answer: "Visible sagging, waking with pain or stiffness, increased allergies, and poor sleep quality are all signs that your mattress needs replacement." },
  ],
  formula: "Adjusted Lifespan = Base Lifespan x Weight Factor",
};
