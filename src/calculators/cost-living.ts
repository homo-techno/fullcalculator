import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const costOfLivingCalculator: CalculatorDefinition = {
  slug: "cost-of-living-calculator",
  title: "Cost of Living Calculator",
  description: "Free cost of living comparison calculator. Compare how far your salary goes in different cities by adjusting for cost of living differences.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cost of living calculator", "salary comparison by city", "cost of living comparison", "equivalent salary calculator", "city cost comparison"],
  variants: [
    {
      id: "compare",
      name: "Salary Equivalent",
      description: "What salary do you need in the target city to maintain the same standard of living?",
      fields: [
        { name: "salary", label: "Current Salary", type: "number", placeholder: "e.g. 75000", prefix: "$" },
        { name: "currentIndex", label: "Current City Cost Index", type: "number", placeholder: "e.g. 100", defaultValue: 100 },
        { name: "targetIndex", label: "Target City Cost Index", type: "number", placeholder: "e.g. 130" },
      ],
      calculate: (inputs) => {
        const salary = inputs.salary as number;
        const current = (inputs.currentIndex as number) || 100;
        const target = inputs.targetIndex as number;
        if (!salary || !target) return null;
        const equivalent = salary * (target / current);
        const difference = equivalent - salary;
        const pctChange = ((target - current) / current) * 100;
        return {
          primary: { label: "Equivalent Salary", value: `$${formatNumber(equivalent)}` },
          details: [
            { label: "Salary difference", value: `${difference >= 0 ? "+" : ""}$${formatNumber(difference)}` },
            { label: "Cost difference", value: `${pctChange >= 0 ? "+" : ""}${formatNumber(pctChange, 1)}%` },
            { label: "Current city index", value: `${current}` },
            { label: "Target city index", value: `${target}` },
          ],
          note: "Use cost of living index values: US average = 100. NYC ≈ 187, SF ≈ 179, Austin ≈ 103, Midwest cities ≈ 85-95. Find indices on numbeo.com or bestplaces.net.",
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "inflation-calculator", "paycheck-calculator"],
  faq: [
    { question: "What is a cost of living index?", answer: "A cost of living index compares the relative cost of goods and services between locations. The US average is typically set to 100. A city at 130 is 30% more expensive than average; 85 is 15% cheaper." },
    { question: "What factors affect cost of living?", answer: "Housing (largest factor, 30-40%), groceries, transportation, healthcare, utilities, and taxes. Housing varies the most between cities — rent in SF can be 3-4× that of a Midwest city." },
  ],
  formula: "Equivalent Salary = Current Salary × (Target Index / Current Index)",
};
