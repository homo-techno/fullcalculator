import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const collegeSavingsGapCalculator: CalculatorDefinition = {
  slug: "college-savings-gap-calculator",
  title: "College Savings Gap Calculator",
  description: "Find the gap between current savings and projected college costs",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["college savings gap","education savings","tuition planning"],
  variants: [{
    id: "standard",
    name: "College Savings Gap",
    description: "Find the gap between current savings and projected college costs",
    fields: [
      { name: "currentSavings", label: "Current Savings ($)", type: "number", defaultValue: 10000, min: 0, step: 1000 },
      { name: "yearsUntilCollege", label: "Years Until College", type: "number", defaultValue: 10, min: 1, max: 25, step: 1 },
      { name: "annualTuition", label: "Annual Tuition ($)", type: "number", defaultValue: 25000, min: 0, step: 1000 },
      { name: "yearsInCollege", label: "Years in College", type: "number", defaultValue: 4, min: 1, max: 8, step: 1 },
      { name: "returnRate", label: "Annual Return (%)", type: "number", defaultValue: 6, min: 0, max: 15, step: 0.5 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const savings = inputs.currentSavings as number || 10000;
      const years = inputs.yearsUntilCollege as number || 10;
      const tuition = inputs.annualTuition as number || 25000;
      const collegeYears = inputs.yearsInCollege as number || 4;
      const rate = (inputs.returnRate as number || 6) / 100;
      const inflationRate = 0.05;
      const futureTuition = tuition * Math.pow(1 + inflationRate, years);
      const totalCost = futureTuition * collegeYears;
      const futureValue = savings * Math.pow(1 + rate, years);
      const gap = Math.max(0, totalCost - futureValue);
      const monthlyNeeded = gap > 0 ? (gap * (rate / 12)) / (Math.pow(1 + rate / 12, years * 12) - 1) : 0;
      return {
        primary: { label: "Savings Gap", value: "$" + formatNumber(Math.round(gap)) },
        details: [
          { label: "Projected Total Cost", value: "$" + formatNumber(Math.round(totalCost)) },
          { label: "Savings Future Value", value: "$" + formatNumber(Math.round(futureValue)) },
          { label: "Monthly Savings Needed", value: "$" + formatNumber(Math.round(monthlyNeeded)) },
          { label: "Projected Annual Tuition", value: "$" + formatNumber(Math.round(futureTuition)) }
        ]
      };
    },
  }],
  relatedSlugs: ["529-contribution-calculator"],
  faq: [
    { question: "What inflation rate is used for tuition?", answer: "This calculator uses a 5% annual tuition inflation rate based on historical averages." },
    { question: "How is the savings gap calculated?", answer: "The gap is the difference between projected total college cost and the future value of current savings." },
  ],
  formula: "Gap = (Annual Tuition x (1 + 0.05)^Years x College Years) - (Savings x (1 + Return)^Years)",
};
