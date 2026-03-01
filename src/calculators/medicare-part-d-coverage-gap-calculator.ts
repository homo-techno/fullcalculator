import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const medicarePartDCoverageGapCalculator: CalculatorDefinition = {
  slug: "medicare-part-d-coverage-gap-calculator",
  title: "Medicare Part D Coverage Gap Calculator",
  description: "Estimate your Medicare Part D out-of-pocket costs including the coverage gap.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["medicare part d", "donut hole calculator", "prescription coverage gap"],
  variants: [{
    id: "standard",
    name: "Medicare Part D Coverage Gap",
    description: "Estimate your Medicare Part D out-of-pocket costs including the coverage gap",
    fields: [
      { name: "annualDrugCosts", label: "Annual Drug Costs", type: "number", prefix: "$", min: 0, max: 500000, defaultValue: 8000 },
      { name: "deductible", label: "Plan Deductible", type: "number", prefix: "$", min: 0, max: 1000, defaultValue: 545 },
      { name: "coveragePct", label: "Plan Coverage Percentage", type: "number", suffix: "%", min: 50, max: 100, defaultValue: 75 },
    ],
    calculate: (inputs) => {
      const totalCosts = inputs.annualDrugCosts as number;
      const deductible = inputs.deductible as number;
      const covPct = (inputs.coveragePct as number) / 100;
      if (!totalCosts || totalCosts <= 0) return null;
      const initialLimit = 5030;
      const catastrophicThreshold = 8000;
      let outOfPocket = 0;
      if (totalCosts <= deductible) {
        outOfPocket = totalCosts;
      } else if (totalCosts <= initialLimit) {
        outOfPocket = deductible + (totalCosts - deductible) * (1 - covPct);
      } else if (totalCosts <= initialLimit + (catastrophicThreshold - deductible - (initialLimit - deductible) * (1 - covPct))) {
        const initialOOP = deductible + (initialLimit - deductible) * (1 - covPct);
        const gapCosts = totalCosts - initialLimit;
        outOfPocket = initialOOP + gapCosts * 0.25;
      } else {
        outOfPocket = catastrophicThreshold;
      }
      const planPays = totalCosts - outOfPocket;
      return {
        primary: { label: "Estimated Out-of-Pocket", value: "$" + formatNumber(Math.round(outOfPocket)) },
        details: [
          { label: "Total Drug Costs", value: "$" + formatNumber(totalCosts) },
          { label: "Plan Pays", value: "$" + formatNumber(Math.round(planPays)) },
          { label: "Your Share", value: ((outOfPocket / totalCosts) * 100).toFixed(1) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["medicare-part-b-premium-calculator", "medigap-plan-comparison-calculator"],
  faq: [
    { question: "What is the Medicare Part D coverage gap?", answer: "The coverage gap (donut hole) begins after you and your plan have spent a combined amount on drugs, and you pay 25% of costs until reaching the catastrophic threshold." },
    { question: "When does catastrophic coverage begin?", answer: "Catastrophic coverage starts after your true out-of-pocket spending reaches approximately $8,000, after which you pay minimal costs." },
  ],
  formula: "Out-of-Pocket = Deductible + Copays in Initial Period + 25% in Gap + 5% in Catastrophic",
};
