import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const yearbookCostCalculator: CalculatorDefinition = {
  slug: "yearbook-cost-calculator",
  title: "Yearbook Cost Calculator",
  description: "Calculate yearbook printing costs and revenue per unit.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["yearbook","printing","cost","school","budget"],
  variants: [{
    id: "standard",
    name: "Yearbook Cost",
    description: "Calculate yearbook printing costs and revenue per unit.",
    fields: [
      { name: "numCopies", label: "Number of Copies", type: "number", min: 50, max: 2000, step: 10, defaultValue: 300 },
      { name: "printCostPerUnit", label: "Print Cost Per Unit ($)", type: "number", min: 5, max: 50, step: 1, defaultValue: 15 },
      { name: "sellingPrice", label: "Selling Price ($)", type: "number", min: 10, max: 100, step: 5, defaultValue: 40 },
      { name: "designCost", label: "Design and Software Cost ($)", type: "number", min: 0, max: 3000, step: 50, defaultValue: 500 },
    ],
    calculate: (inputs) => {
    const numCopies = inputs.numCopies as number;
    const printCostPerUnit = inputs.printCostPerUnit as number;
    const sellingPrice = inputs.sellingPrice as number;
    const designCost = inputs.designCost as number;
    const totalPrintCost = numCopies * printCostPerUnit;
    const totalCost = totalPrintCost + designCost;
    const totalRevenue = numCopies * sellingPrice;
    const profit = totalRevenue - totalCost;
    const costPerUnit = totalCost / numCopies;
    return {
      primary: { label: "Total Profit", value: "$" + formatNumber(profit) },
      details: [
        { label: "Total Revenue", value: "$" + formatNumber(totalRevenue) },
        { label: "Total Cost", value: "$" + formatNumber(totalCost) },
        { label: "Cost Per Unit", value: "$" + formatNumber(costPerUnit) },
        { label: "Profit Per Unit", value: "$" + formatNumber(sellingPrice - costPerUnit) }
      ]
    };
  },
  }],
  relatedSlugs: ["school-fundraiser-calculator","prom-budget-calculator","graduation-party-calculator"],
  faq: [
    { question: "How much does it cost to print a yearbook?", answer: "Yearbook printing costs range from $8 to $25 per copy depending on size and features." },
    { question: "How many yearbooks should a school order?", answer: "Schools typically order enough for 60% to 80% of their student body." },
  ],
  formula: "Profit = (Selling Price x Copies) - (Print Cost x Copies + Design Cost)",
};
