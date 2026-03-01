import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carInsuranceComparisonCalculator: CalculatorDefinition = {
  slug: "car-insurance-comparison-calculator",
  title: "Car Insurance Comparison Calculator",
  description: "Compare insurance quotes by coverage level and deductible",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["car insurance comparison","auto insurance quotes","insurance cost"],
  variants: [{
    id: "standard",
    name: "Car Insurance Comparison",
    description: "Compare insurance quotes by coverage level and deductible",
    fields: [
      { name: "premium1", label: "Quote 1 Annual Premium ($)", type: "number", defaultValue: 1200, min: 0, step: 50 },
      { name: "deductible1", label: "Quote 1 Deductible ($)", type: "number", defaultValue: 500, min: 0, step: 100 },
      { name: "premium2", label: "Quote 2 Annual Premium ($)", type: "number", defaultValue: 900, min: 0, step: 50 },
      { name: "deductible2", label: "Quote 2 Deductible ($)", type: "number", defaultValue: 1000, min: 0, step: 100 },
      { name: "claimsPerYear", label: "Expected Claims Per Year", type: "number", defaultValue: 0.2, min: 0, max: 3, step: 0.1 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const p1 = inputs.premium1 as number || 1200;
      const d1 = inputs.deductible1 as number || 500;
      const p2 = inputs.premium2 as number || 900;
      const d2 = inputs.deductible2 as number || 1000;
      const claims = inputs.claimsPerYear as number || 0.2;
      const totalCost1 = p1 + (d1 * claims);
      const totalCost2 = p2 + (d2 * claims);
      const savings = Math.abs(totalCost1 - totalCost2);
      const better = totalCost1 < totalCost2 ? "Quote 1" : "Quote 2";
      const fiveYear1 = totalCost1 * 5;
      const fiveYear2 = totalCost2 * 5;
      return {
        primary: { label: "Better Value", value: better + " saves $" + formatNumber(Math.round(savings)) + "/yr" },
        details: [
          { label: "Quote 1 Effective Cost", value: "$" + formatNumber(Math.round(totalCost1)) + "/yr" },
          { label: "Quote 2 Effective Cost", value: "$" + formatNumber(Math.round(totalCost2)) + "/yr" },
          { label: "5-Year Cost (Quote 1)", value: "$" + formatNumber(Math.round(fiveYear1)) },
          { label: "5-Year Cost (Quote 2)", value: "$" + formatNumber(Math.round(fiveYear2)) }
        ]
      };
    },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How is effective cost calculated?", answer: "Effective cost is the annual premium plus expected out-of-pocket deductible costs based on claim frequency." },
    { question: "Should I choose the lowest premium?", answer: "Not always. A lower premium with a high deductible can cost more if you file claims frequently." },
  ],
  formula: "Effective Cost = Annual Premium + (Deductible x Expected Claims Per Year)",
};
