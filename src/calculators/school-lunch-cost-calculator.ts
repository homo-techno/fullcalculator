import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const schoolLunchCostCalculator: CalculatorDefinition = {
  slug: "school-lunch-cost-calculator",
  title: "School Lunch Cost Calculator",
  description: "Compare the cost of school cafeteria lunches versus packed lunches over the school year.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["school lunch cost", "packed lunch vs buying", "lunch cost comparison"],
  variants: [{
    id: "standard",
    name: "School Lunch Cost",
    description: "Compare the cost of school cafeteria lunches versus packed lunches over the school year",
    fields: [
      { name: "schoolLunchPrice", label: "School Lunch Price", type: "number", prefix: "$", min: 1, max: 15, defaultValue: 3.50 },
      { name: "packedLunchCost", label: "Packed Lunch Cost", type: "number", prefix: "$", min: 0.50, max: 10, defaultValue: 2.00 },
      { name: "schoolDays", label: "School Days per Year", type: "number", suffix: "days", min: 100, max: 200, defaultValue: 180 },
      { name: "children", label: "Number of Children", type: "number", min: 1, max: 10, defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const schoolPrice = inputs.schoolLunchPrice as number;
      const packedCost = inputs.packedLunchCost as number;
      const days = inputs.schoolDays as number;
      const children = inputs.children as number;
      if (!schoolPrice || !days || !children) return null;
      const schoolTotal = schoolPrice * days * children;
      const packedTotal = packedCost * days * children;
      const savings = schoolTotal - packedTotal;
      const dailySavings = (schoolPrice - packedCost) * children;
      return {
        primary: { label: "Annual Savings (Packed)", value: "$" + formatNumber(Math.round(savings)) },
        details: [
          { label: "School Lunch Total", value: "$" + formatNumber(Math.round(schoolTotal)) },
          { label: "Packed Lunch Total", value: "$" + formatNumber(Math.round(packedTotal)) },
          { label: "Daily Savings", value: "$" + dailySavings.toFixed(2) },
          { label: "Monthly Savings", value: "$" + formatNumber(Math.round(savings / 10)) },
        ],
      };
    },
  }],
  relatedSlugs: ["allowance-calculator", "private-school-cost-calculator"],
  faq: [
    { question: "How much does school lunch cost per year?", answer: "At $3-$4 per day over 180 school days, one child spends $540-$720 per year on school lunches." },
    { question: "Is packing lunch cheaper than buying?", answer: "Typically yes. A packed lunch costs $1.50-$3.00 versus $3-$5 for school lunch, saving $200-$400 per child per year." },
  ],
  formula: "Annual Savings = (School Lunch Price - Packed Lunch Cost) x School Days x Children",
};
