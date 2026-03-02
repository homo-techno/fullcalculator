import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const schoolSupplyListCalculator: CalculatorDefinition = {
  slug: "school-supply-list-calculator",
  title: "School Supply List Calculator",
  description: "Calculate the total budget for back to school supplies.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["school supplies","budget","back to school","cost","list"],
  variants: [{
    id: "standard",
    name: "School Supply List",
    description: "Calculate the total budget for back to school supplies.",
    fields: [
      { name: "notebooks", label: "Notebooks and Paper ($)", type: "number", min: 0, max: 100, step: 1, defaultValue: 25 },
      { name: "writingTools", label: "Pens and Pencils ($)", type: "number", min: 0, max: 50, step: 1, defaultValue: 15 },
      { name: "backpack", label: "Backpack ($)", type: "number", min: 0, max: 200, step: 5, defaultValue: 40 },
      { name: "techItems", label: "Technology Items ($)", type: "number", min: 0, max: 1000, step: 25, defaultValue: 100 },
      { name: "otherSupplies", label: "Other Supplies ($)", type: "number", min: 0, max: 300, step: 5, defaultValue: 30 },
    ],
    calculate: (inputs) => {
    const notebooks = inputs.notebooks as number;
    const writingTools = inputs.writingTools as number;
    const backpack = inputs.backpack as number;
    const techItems = inputs.techItems as number;
    const otherSupplies = inputs.otherSupplies as number;
    const totalBudget = notebooks + writingTools + backpack + techItems + otherSupplies;
    const taxEstimate = totalBudget * 0.07;
    const grandTotal = totalBudget + taxEstimate;
    return {
      primary: { label: "Total Budget", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Subtotal", value: "$" + formatNumber(totalBudget) },
        { label: "Estimated Tax (7%)", value: "$" + formatNumber(taxEstimate) },
        { label: "Notebooks and Paper", value: "$" + formatNumber(notebooks) },
        { label: "Technology Items", value: "$" + formatNumber(techItems) }
      ]
    };
  },
  }],
  relatedSlugs: ["homeschool-curriculum-cost-calculator","school-lunch-cost-calculator","dorm-room-essentials-calculator"],
  faq: [
    { question: "How much should I budget for school supplies?", answer: "The average family spends $100 to $300 per child on back to school supplies." },
    { question: "When is the best time to buy school supplies?", answer: "Late July and August offer the best sales, especially during tax-free weekends." },
  ],
  formula: "Total Budget = (Notebooks + Pens + Backpack + Tech + Other) x 1.07",
};
