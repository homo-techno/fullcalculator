import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dormRoomEssentialsCalculator: CalculatorDefinition = {
  slug: "dorm-room-essentials-calculator",
  title: "Dorm Room Essentials Calculator",
  description: "Calculate the total cost of setting up a college dorm room.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dorm","college","essentials","setup","cost"],
  variants: [{
    id: "standard",
    name: "Dorm Room Essentials",
    description: "Calculate the total cost of setting up a college dorm room.",
    fields: [
      { name: "bedding", label: "Bedding and Linens ($)", type: "number", min: 30, max: 500, step: 10, defaultValue: 120 },
      { name: "storage", label: "Storage and Organization ($)", type: "number", min: 0, max: 300, step: 10, defaultValue: 75 },
      { name: "electronics", label: "Electronics ($)", type: "number", min: 0, max: 1000, step: 25, defaultValue: 200 },
      { name: "decor", label: "Decor and Lighting ($)", type: "number", min: 0, max: 300, step: 10, defaultValue: 60 },
      { name: "cleaning", label: "Cleaning Supplies ($)", type: "number", min: 0, max: 100, step: 5, defaultValue: 35 },
    ],
    calculate: (inputs) => {
    const bedding = inputs.bedding as number;
    const storage = inputs.storage as number;
    const electronics = inputs.electronics as number;
    const decor = inputs.decor as number;
    const cleaning = inputs.cleaning as number;
    const totalCost = bedding + storage + electronics + decor + cleaning;
    const taxEstimate = totalCost * 0.07;
    const grandTotal = totalCost + taxEstimate;
    return {
      primary: { label: "Total Setup Cost", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Subtotal", value: "$" + formatNumber(totalCost) },
        { label: "Estimated Tax (7%)", value: "$" + formatNumber(taxEstimate) },
        { label: "Bedding and Linens", value: "$" + formatNumber(bedding) },
        { label: "Electronics", value: "$" + formatNumber(electronics) }
      ]
    };
  },
  }],
  relatedSlugs: ["college-application-cost-calculator","meal-plan-comparison-calculator","school-supply-list-calculator"],
  faq: [
    { question: "How much does it cost to furnish a dorm room?", answer: "Most students spend $500 to $1,500 on dorm room essentials for their first year." },
    { question: "What are the most important dorm essentials?", answer: "Bedding, storage bins, a desk lamp, power strips, and cleaning supplies are the top priorities." },
  ],
  formula: "Total Cost = (Bedding + Storage + Electronics + Decor + Cleaning) x 1.07",
};
