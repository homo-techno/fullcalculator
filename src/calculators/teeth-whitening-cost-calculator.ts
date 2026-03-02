import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const teethWhiteningCostCalculator: CalculatorDefinition = {
  slug: "teeth-whitening-cost-calculator",
  title: "Teeth Whitening Cost Calculator",
  description: "Compare teeth whitening costs across different methods.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["teeth whitening cost","dental whitening price","bleaching treatment cost"],
  variants: [{
    id: "standard",
    name: "Teeth Whitening Cost",
    description: "Compare teeth whitening costs across different methods.",
    fields: [
      { name: "method", label: "Whitening Method", type: "select", options: [{ value: "1", label: "In-Office Professional" }, { value: "2", label: "Take-Home Trays" }, { value: "3", label: "Over-the-Counter Strips" }, { value: "4", label: "Whitening Toothpaste" }] },
      { name: "sessions", label: "Number of Sessions or Boxes", type: "number", min: 1, max: 12, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const method = inputs.method as string;
    const sessions = inputs.sessions as number;
    const prices: Record<string, number> = { "1": 650, "2": 300, "3": 45, "4": 8 };
    const names: Record<string, string> = { "1": "In-Office Professional", "2": "Take-Home Trays", "3": "OTC Strips", "4": "Whitening Toothpaste" };
    const perSession = prices[method] || 650;
    const total = perSession * sessions;
    return {
      primary: { label: "Total Cost", value: "$" + formatNumber(total) },
      details: [
        { label: "Method", value: names[method] || "In-Office" },
        { label: "Cost per Session/Box", value: "$" + formatNumber(perSession) },
        { label: "Quantity", value: formatNumber(sessions) }
      ]
    };
  },
  }],
  relatedSlugs: ["dental-veneer-cost-calculator","dental-cleaning-frequency-calculator","dental-crown-cost-calculator"],
  faq: [
    { question: "How much does professional teeth whitening cost?", answer: "In-office professional whitening typically costs $500 to $1000 per session." },
    { question: "Is teeth whitening covered by insurance?", answer: "Teeth whitening is cosmetic and not covered by dental insurance plans." },
    { question: "How long do whitening results last?", answer: "Professional whitening results can last 6 months to 2 years depending on habits." },
  ],
  formula: "Total Cost = Cost per Session x Number of Sessions",
};
