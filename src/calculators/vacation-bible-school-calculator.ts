import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vacationBibleSchoolCalculator: CalculatorDefinition = {
  slug: "vacation-bible-school-calculator",
  title: "Vacation Bible School Calculator",
  description: "Estimate supply needs and costs for VBS programs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["VBS","vacation bible school","supplies","church"],
  variants: [{
    id: "standard",
    name: "Vacation Bible School",
    description: "Estimate supply needs and costs for VBS programs.",
    fields: [
      { name: "children", label: "Expected Children", type: "number", min: 10, max: 500, defaultValue: 75 },
      { name: "days", label: "Number of Days", type: "number", min: 1, max: 10, defaultValue: 5 },
      { name: "supplyPerChild", label: "Supply Cost Per Child ($)", type: "number", min: 2, max: 50, defaultValue: 12 },
      { name: "snackPerChild", label: "Snack Cost Per Child/Day ($)", type: "number", min: 0.5, max: 10, defaultValue: 2 },
    ],
    calculate: (inputs) => {
    const children = inputs.children as number;
    const days = inputs.days as number;
    const supplyPerChild = inputs.supplyPerChild as number;
    const snackPerChild = inputs.snackPerChild as number;
    const supplyCost = children * supplyPerChild;
    const snackCost = children * days * snackPerChild;
    const decorations = days * 30;
    const totalCost = supplyCost + snackCost + decorations;
    const volunteersNeeded = Math.ceil(children / 5);
    const costPerChild = totalCost / children;
    return { primary: { label: "Total VBS Budget", value: "$" + formatNumber(totalCost) }, details: [{ label: "Supply Cost", value: "$" + formatNumber(supplyCost) }, { label: "Snack Cost", value: "$" + formatNumber(snackCost) }, { label: "Decorations", value: "$" + formatNumber(decorations) }, { label: "Volunteers Needed", value: formatNumber(volunteersNeeded) }, { label: "Cost Per Child", value: "$" + formatNumber(costPerChild) }] };
  },
  }],
  relatedSlugs: ["potluck-food-calculator","church-budget-calculator","mission-trip-cost-calculator"],
  faq: [
    { question: "How much does VBS cost per child?", answer: "Typical VBS programs spend $10 to $25 per child on supplies and snacks." },
    { question: "How many volunteers does VBS need?", answer: "Plan for about 1 volunteer for every 5 children attending." },
    { question: "What supplies are needed for VBS?", answer: "Craft kits, curriculum materials, snacks, decorations, and name tags." },
  ],
  formula: "TotalCost = SupplyCost + SnackCost + Decorations; Volunteers = Children / 5",
};
