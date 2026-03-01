import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mechanicLaborRateCalculator: CalculatorDefinition = {
  slug: "mechanic-labor-rate-calculator",
  title: "Mechanic Labor Rate Calculator",
  description: "Calculate auto repair costs based on labor hours, parts, and shop rates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mechanic labor rate", "auto repair cost", "car repair estimate"],
  variants: [{
    id: "standard",
    name: "Mechanic Labor Rate",
    description: "Calculate auto repair costs based on labor hours, parts, and shop rates",
    fields: [
      { name: "laborHours", label: "Labor Hours", type: "number", suffix: "hours", min: 0.5, max: 40, step: 0.5, defaultValue: 2 },
      { name: "shopRate", label: "Shop Labor Rate", type: "number", prefix: "$", suffix: "/hr", min: 50, max: 250, defaultValue: 120 },
      { name: "partsCost", label: "Parts Cost", type: "number", prefix: "$", min: 0, max: 10000, defaultValue: 250 },
      { name: "shopType", label: "Shop Type", type: "select", options: [{value:"independent",label:"Independent Shop"},{value:"dealer",label:"Dealership"},{value:"chain",label:"Chain Shop"}], defaultValue: "independent" },
    ],
    calculate: (inputs) => {
      const hours = inputs.laborHours as number;
      const rate = inputs.shopRate as number;
      const parts = inputs.partsCost as number;
      const shopType = inputs.shopType as string;
      if (!hours || !rate) return null;
      const shopMod: Record<string, number> = { independent: 1.0, dealer: 1.3, chain: 0.9 };
      const laborCost = hours * rate * (shopMod[shopType] || 1.0);
      const shopFees = laborCost * 0.08;
      const total = laborCost + parts + shopFees;
      return {
        primary: { label: "Total Repair Estimate", value: "$" + formatNumber(Math.round(total * 100) / 100) },
        details: [
          { label: "Labor Cost", value: "$" + formatNumber(Math.round(laborCost * 100) / 100) },
          { label: "Parts", value: "$" + formatNumber(Math.round(parts * 100) / 100) },
          { label: "Shop Fees and Supplies", value: "$" + formatNumber(Math.round(shopFees * 100) / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["electrician-rate-calculator", "contractor-markup-calculator"],
  faq: [
    { question: "What is a typical mechanic labor rate?", answer: "Mechanic labor rates range from $80 to $150 per hour at independent shops and $120 to $200 per hour at dealerships, depending on location and specialization." },
    { question: "Is a dealership more expensive than an independent mechanic?", answer: "Dealerships typically charge 20 to 40 percent more than independent shops. However, they may be better for warranty work and specialized brand-specific repairs." },
  ],
  formula: "Total = (Labor Hours x Shop Rate x Shop Modifier) + Parts + Shop Fees",
};
