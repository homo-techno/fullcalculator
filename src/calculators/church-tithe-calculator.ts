import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const churchTitheCalculator: CalculatorDefinition = {
  slug: "church-tithe-calculator",
  title: "Church Tithe Calculator",
  description: "Calculate the tithe amount based on income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["tithe","church","giving","income"],
  variants: [{
    id: "standard",
    name: "Church Tithe",
    description: "Calculate the tithe amount based on income.",
    fields: [
      { name: "grossIncome", label: "Gross Annual Income ($)", type: "number", min: 1000, max: 1000000, defaultValue: 60000 },
      { name: "tithePct", label: "Tithe Percentage (%)", type: "number", min: 1, max: 30, defaultValue: 10 },
      { name: "frequency", label: "Giving Frequency", type: "select", options: [{ value: "52", label: "Weekly" }, { value: "26", label: "Biweekly" }, { value: "12", label: "Monthly" }] },
    ],
    calculate: (inputs) => {
    const grossIncome = inputs.grossIncome as number;
    const tithePct = inputs.tithePct as number;
    const frequency = inputs.frequency as number;
    const annualTithe = grossIncome * (tithePct / 100);
    const perPeriod = annualTithe / frequency;
    const monthlyTithe = annualTithe / 12;
    const weeklyTithe = annualTithe / 52;
    return { primary: { label: "Annual Tithe", value: "$" + formatNumber(annualTithe) }, details: [{ label: "Per Giving Period", value: "$" + formatNumber(perPeriod) }, { label: "Monthly Amount", value: "$" + formatNumber(monthlyTithe) }, { label: "Weekly Amount", value: "$" + formatNumber(weeklyTithe) }] };
  },
  }],
  relatedSlugs: ["church-budget-calculator","mission-trip-cost-calculator","donor-retention-calculator"],
  faq: [
    { question: "What is a tithe?", answer: "A tithe is traditionally 10% of income given to a church or ministry." },
    { question: "Should I tithe on gross or net income?", answer: "This is a personal decision; many choose gross for a full 10% tithe." },
    { question: "Is tithing tax deductible?", answer: "Yes, donations to qualified churches are deductible if you itemize." },
  ],
  formula: "AnnualTithe = GrossIncome * (TithePct / 100); PerPeriod = AnnualTithe / Frequency",
};
