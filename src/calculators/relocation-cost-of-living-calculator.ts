import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const relocationCostOfLivingCalculator: CalculatorDefinition = {
  slug: "relocation-cost-of-living-calculator",
  title: "Relocation Cost of Living Calculator",
  description: "Compare cost of living between two locations.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["relocation","cost of living","comparison","salary"],
  variants: [{
    id: "standard",
    name: "Relocation Cost of Living",
    description: "Compare cost of living between two locations.",
    fields: [
      { name: "currentSalary", label: "Current Salary ($)", type: "number", min: 20000, max: 500000, defaultValue: 60000 },
      { name: "currentIndex", label: "Current City Index", type: "number", min: 50, max: 200, defaultValue: 100 },
      { name: "newIndex", label: "New City Index", type: "number", min: 50, max: 200, defaultValue: 120 },
    ],
    calculate: (inputs) => {
    const currentSalary = inputs.currentSalary as number;
    const currentIndex = inputs.currentIndex as number;
    const newIndex = inputs.newIndex as number;
    const ratio = newIndex / currentIndex;
    const equivalentSalary = currentSalary * ratio;
    const difference = equivalentSalary - currentSalary;
    const percentChange = ((ratio - 1) * 100);
    return { primary: { label: "Equivalent Salary Needed", value: "$" + formatNumber(equivalentSalary) }, details: [{ label: "Cost of Living Ratio", value: ratio.toFixed(2) }, { label: "Salary Difference", value: "$" + formatNumber(difference) }, { label: "Percent Change", value: percentChange.toFixed(1) + "%" }] };
  },
  }],
  relatedSlugs: ["moving-cost-calculator","commute-comparison-calculator","neighborhood-affordability-calculator"],
  faq: [
    { question: "What is a cost of living index?", answer: "A score comparing living costs; 100 is the national average." },
    { question: "How do I find my city index?", answer: "Use BLS data or cost of living comparison websites." },
    { question: "Should I negotiate salary for a higher cost area?", answer: "Yes, request a salary that matches the cost ratio." },
  ],
  formula: "EquivalentSalary = CurrentSalary * (NewIndex / CurrentIndex)",
};
