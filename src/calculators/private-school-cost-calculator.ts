import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const privateSchoolCostCalculator: CalculatorDefinition = {
  slug: "private-school-cost-calculator",
  title: "Private School Cost Calculator",
  description: "Calculate the total cost of private K-12 education including tuition, fees, and extras over multiple years.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["private school cost", "private school tuition", "k-12 private school"],
  variants: [{
    id: "standard",
    name: "Private School Cost",
    description: "Calculate the total cost of private K-12 education including tuition, fees, and extras over multiple years",
    fields: [
      { name: "annualTuition", label: "Annual Tuition", type: "number", prefix: "$", min: 1000, max: 60000, defaultValue: 15000 },
      { name: "years", label: "Years of Enrollment", type: "number", suffix: "years", min: 1, max: 13, defaultValue: 6 },
      { name: "annualFees", label: "Annual Fees and Extras", type: "number", prefix: "$", min: 0, max: 10000, defaultValue: 2000 },
      { name: "inflationRate", label: "Annual Tuition Increase", type: "number", suffix: "%", min: 0, max: 10, defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const tuition = inputs.annualTuition as number;
      const years = inputs.years as number;
      const fees = inputs.annualFees as number;
      const inflation = inputs.inflationRate as number;
      if (!tuition || !years) return null;
      let total = 0;
      let yearCost = tuition + fees;
      for (let i = 0; i < years; i++) {
        total += yearCost;
        yearCost *= (1 + inflation / 100);
      }
      const avgAnnual = total / years;
      const monthlyAvg = avgAnnual / 12;
      return {
        primary: { label: "Total Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Average Annual Cost", value: "$" + formatNumber(Math.round(avgAnnual)) },
          { label: "Monthly Average", value: "$" + formatNumber(Math.round(monthlyAvg)) },
          { label: "Final Year Cost", value: "$" + formatNumber(Math.round(yearCost / (1 + inflation / 100))) },
        ],
      };
    },
  }],
  relatedSlugs: ["college-comparison-calculator", "extracurricular-cost-calculator"],
  faq: [
    { question: "How much does private school cost?", answer: "Private school tuition averages $12,000-$15,000 per year nationally, but ranges from $5,000 to over $50,000 depending on location and type." },
    { question: "Does private school tuition increase every year?", answer: "Yes. Most private schools raise tuition 3-5% annually, so costs compound significantly over multiple years." },
  ],
  formula: "Total = Sum of (Tuition + Fees) x (1 + Inflation Rate) ^ Year for each year",
};
