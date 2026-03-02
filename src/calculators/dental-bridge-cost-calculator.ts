import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dentalBridgeCostCalculator: CalculatorDefinition = {
  slug: "dental-bridge-cost-calculator",
  title: "Dental Bridge Cost Calculator",
  description: "Calculate dental bridge cost based on the number of units and material.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dental bridge cost","bridge units price","tooth replacement cost"],
  variants: [{
    id: "standard",
    name: "Dental Bridge Cost",
    description: "Calculate dental bridge cost based on the number of units and material.",
    fields: [
      { name: "units", label: "Number of Bridge Units", type: "number", min: 3, max: 14, defaultValue: 3 },
      { name: "material", label: "Material Type", type: "select", options: [{ value: "1", label: "Porcelain" }, { value: "2", label: "Zirconia" }, { value: "3", label: "Metal" }] },
      { name: "insurance", label: "Insurance Coverage (%)", type: "number", min: 0, max: 100, defaultValue: 50 },
    ],
    calculate: (inputs) => {
    const units = inputs.units as number;
    const material = inputs.material as string;
    const insurance = inputs.insurance as number;
    const prices: Record<string, number> = { "1": 900, "2": 1100, "3": 700 };
    const names: Record<string, string> = { "1": "Porcelain", "2": "Zirconia", "3": "Metal" };
    const perUnit = prices[material] || 900;
    const total = perUnit * units;
    const covered = total * (insurance / 100);
    const oop = total - covered;
    return {
      primary: { label: "Out-of-Pocket Cost", value: "$" + formatNumber(oop) },
      details: [
        { label: "Material", value: names[material] || "Porcelain" },
        { label: "Cost per Unit", value: "$" + formatNumber(perUnit) },
        { label: "Total Cost", value: "$" + formatNumber(total) },
        { label: "Insurance Covers", value: "$" + formatNumber(covered) }
      ]
    };
  },
  }],
  relatedSlugs: ["dental-crown-cost-calculator","dental-veneer-cost-calculator","root-canal-cost-calculator"],
  faq: [
    { question: "How many units are in a typical dental bridge?", answer: "A standard bridge has 3 units: two crowns on anchor teeth and one pontic." },
    { question: "How long does a dental bridge last?", answer: "Dental bridges typically last 5 to 15 years with good oral hygiene." },
    { question: "Is a bridge cheaper than an implant?", answer: "Bridges generally cost less upfront, but implants may be more cost-effective long term." },
  ],
  formula: "Out-of-Pocket = (Cost per Unit x Units) x (1 - Insurance% / 100)",
};
