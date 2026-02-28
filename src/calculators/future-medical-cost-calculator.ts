import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const futureMedicalCostCalculator: CalculatorDefinition = {
  slug: "future-medical-cost-calculator",
  title: "Future Medical Cost Projector",
  description: "Free future medical expense calculator. Project lifetime medical costs with inflation adjustment for injury claims and planning.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["future medical cost calculator", "medical cost projector", "lifetime medical expense calculator"],
  variants: [{
    id: "standard",
    name: "Future Medical Cost Projector",
    description: "Free future medical expense calculator",
    fields: [
      { name: "annualCost", label: "Annual Medical Cost", type: "number", prefix: "$", min: 0 },
      { name: "years", label: "Years of Treatment", type: "number", min: 1, max: 50, defaultValue: 10 },
      { name: "inflation", label: "Medical Inflation Rate", type: "number", suffix: "%", min: 0, max: 15, defaultValue: 5 },
      { name: "discount", label: "Discount Rate (present value)", type: "number", suffix: "%", min: 0, max: 10, defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const annual = inputs.annualCost as number;
      const years = inputs.years as number;
      const inflation = (inputs.inflation as number) / 100;
      const discount = (inputs.discount as number) / 100;
      if (!annual || !years || annual <= 0) return null;
      let totalFuture = 0, totalPV = 0;
      for (let y = 1; y <= years; y++) {
        const cost = annual * Math.pow(1 + inflation, y);
        totalFuture += cost;
        totalPV += cost / Math.pow(1 + discount, y);
      }
      return {
        primary: { label: "Present Value", value: "$" + formatNumber(totalPV) },
        details: [
          { label: "Total future costs (nominal)", value: "$" + formatNumber(totalFuture) },
          { label: "Annual cost year 1", value: "$" + formatNumber(annual * (1 + inflation)) },
          { label: "Annual cost year " + years, value: "$" + formatNumber(annual * Math.pow(1 + inflation, years)) },
          { label: "Treatment duration", value: years + " years" },
        ],
        note: "Medical inflation averages 5-7% annually. Present value discounted at " + (discount * 100) + "% to calculate lump sum settlement value.",
      };
    },
  }],
  relatedSlugs: ["personal-injury-calculator", "medical-malpractice-calculator"],
  faq: [
    { question: "Why use present value for future medical costs?", answer: "Lump-sum settlements are paid today but cover future expenses. Present value converts future costs to todays equivalent using a discount rate." },
    { question: "What is medical inflation?", answer: "Healthcare costs rise 5-7% annually on average, faster than general inflation (~3%). This significantly increases long-term care costs." },
  ],
  formula: "PV = Σ (Annual Cost × (1+inflation)^y) / (1+discount)^y",
};
