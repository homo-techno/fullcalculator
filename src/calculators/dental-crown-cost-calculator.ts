import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dentalCrownCostCalculator: CalculatorDefinition = {
  slug: "dental-crown-cost-calculator",
  title: "Dental Crown Cost Calculator",
  description: "Estimate dental crown cost based on material type and location factors.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dental crown cost","crown material price","dental restoration cost"],
  variants: [{
    id: "standard",
    name: "Dental Crown Cost",
    description: "Estimate dental crown cost based on material type and location factors.",
    fields: [
      { name: "material", label: "Crown Material", type: "select", options: [{ value: "1", label: "Porcelain" }, { value: "2", label: "Ceramic" }, { value: "3", label: "Gold" }, { value: "4", label: "Porcelain-Fused-Metal" }] },
      { name: "crowns", label: "Number of Crowns", type: "number", min: 1, max: 20, defaultValue: 1 },
      { name: "insurance", label: "Insurance Coverage (%)", type: "number", min: 0, max: 100, defaultValue: 50 },
    ],
    calculate: (inputs) => {
    const material = inputs.material as string;
    const crowns = inputs.crowns as number;
    const insurance = inputs.insurance as number;
    const prices: Record<string, number> = { "1": 1200, "2": 1400, "3": 1800, "4": 1000 };
    const names: Record<string, string> = { "1": "Porcelain", "2": "Ceramic", "3": "Gold", "4": "Porcelain-Fused-Metal" };
    const unitCost = prices[material] || 1200;
    const totalBefore = unitCost * crowns;
    const covered = totalBefore * (insurance / 100);
    const outOfPocket = totalBefore - covered;
    return {
      primary: { label: "Out-of-Pocket Cost", value: "$" + formatNumber(outOfPocket) },
      details: [
        { label: "Material", value: names[material] || "Porcelain" },
        { label: "Cost per Crown", value: "$" + formatNumber(unitCost) },
        { label: "Total Before Insurance", value: "$" + formatNumber(totalBefore) },
        { label: "Insurance Covers", value: "$" + formatNumber(covered) }
      ]
    };
  },
  }],
  relatedSlugs: ["dental-bridge-cost-calculator","dental-veneer-cost-calculator","root-canal-cost-calculator"],
  faq: [
    { question: "How much does a dental crown cost without insurance?", answer: "A dental crown typically costs $800 to $1800 depending on the material chosen." },
    { question: "Which crown material lasts the longest?", answer: "Gold crowns tend to last the longest, often 20 years or more with proper care." },
    { question: "Does insurance cover dental crowns?", answer: "Most dental plans cover 50% of crown costs after the deductible is met." },
  ],
  formula: "Out-of-Pocket = (Cost per Crown x Number of Crowns) x (1 - Insurance% / 100)",
};
