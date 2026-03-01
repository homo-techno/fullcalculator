import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tuitionInflationCalculator: CalculatorDefinition = {
  slug: "tuition-inflation-calculator",
  title: "Tuition Inflation Calculator",
  description: "Project future tuition costs based on historical inflation rates",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["tuition inflation","future college cost","education inflation"],
  variants: [{
    id: "standard",
    name: "Tuition Inflation",
    description: "Project future tuition costs based on historical inflation rates",
    fields: [
      { name: "currentTuition", label: "Current Annual Tuition ($)", type: "number", defaultValue: 20000, min: 0, step: 1000 },
      { name: "yearsUntilEnrollment", label: "Years Until Enrollment", type: "number", defaultValue: 10, min: 1, max: 25, step: 1 },
      { name: "inflationRate", label: "Tuition Inflation Rate (%)", type: "number", defaultValue: 5, min: 0, max: 15, step: 0.5 },
      { name: "yearsInSchool", label: "Years in School", type: "number", defaultValue: 4, min: 1, max: 8, step: 1 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const current = inputs.currentTuition as number || 20000;
      const yearsUntil = inputs.yearsUntilEnrollment as number || 10;
      const inflation = (inputs.inflationRate as number || 5) / 100;
      const schoolYears = inputs.yearsInSchool as number || 4;
      const firstYearTuition = current * Math.pow(1 + inflation, yearsUntil);
      let totalCost = 0;
      for (let i = 0; i < schoolYears; i++) {
        totalCost += current * Math.pow(1 + inflation, yearsUntil + i);
      }
      const totalIncrease = totalCost - (current * schoolYears);
      const increasePercent = (firstYearTuition / current - 1) * 100;
      return {
        primary: { label: "Projected Total Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "First Year Tuition", value: "$" + formatNumber(Math.round(firstYearTuition)) },
          { label: "Current Total (4yr)", value: "$" + formatNumber(Math.round(current * schoolYears)) },
          { label: "Additional Due to Inflation", value: "$" + formatNumber(Math.round(totalIncrease)) },
          { label: "Tuition Increase", value: formatNumber(Math.round(increasePercent)) + "%" }
        ]
      };
    },
  }],
  relatedSlugs: ["college-savings-gap-calculator"],
  faq: [
    { question: "What is the average tuition inflation rate?", answer: "Historically, college tuition has increased about 5-8% per year, outpacing general inflation." },
    { question: "Does this include room and board?", answer: "No, this calculator only projects tuition costs. Room and board should be budgeted separately." },
  ],
  formula: "Future Tuition = Current x (1 + Inflation Rate)^Years",
};
