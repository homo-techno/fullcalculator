import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dentalVeneerCostCalculator: CalculatorDefinition = {
  slug: "dental-veneer-cost-calculator",
  title: "Dental Veneer Cost Calculator",
  description: "Estimate the cost of dental veneers per tooth by material type.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dental veneer cost","porcelain veneer price","cosmetic dentistry cost"],
  variants: [{
    id: "standard",
    name: "Dental Veneer Cost",
    description: "Estimate the cost of dental veneers per tooth by material type.",
    fields: [
      { name: "teeth", label: "Number of Teeth", type: "number", min: 1, max: 20, defaultValue: 4 },
      { name: "veneerType", label: "Veneer Type", type: "select", options: [{ value: "1", label: "Porcelain" }, { value: "2", label: "Composite" }, { value: "3", label: "Lumineers" }] },
      { name: "insurance", label: "Insurance Coverage (%)", type: "number", min: 0, max: 100, defaultValue: 0 },
    ],
    calculate: (inputs) => {
    const teeth = inputs.teeth as number;
    const veneerType = inputs.veneerType as string;
    const insurance = inputs.insurance as number;
    const prices: Record<string, number> = { "1": 1500, "2": 600, "3": 1200 };
    const names: Record<string, string> = { "1": "Porcelain", "2": "Composite", "3": "Lumineers" };
    const perTooth = prices[veneerType] || 1500;
    const total = perTooth * teeth;
    const covered = total * (insurance / 100);
    const oop = total - covered;
    return {
      primary: { label: "Total Cost", value: "$" + formatNumber(oop) },
      details: [
        { label: "Veneer Type", value: names[veneerType] || "Porcelain" },
        { label: "Cost per Tooth", value: "$" + formatNumber(perTooth) },
        { label: "Subtotal", value: "$" + formatNumber(total) },
        { label: "Insurance Covers", value: "$" + formatNumber(covered) }
      ]
    };
  },
  }],
  relatedSlugs: ["dental-crown-cost-calculator","dental-bridge-cost-calculator","teeth-whitening-cost-calculator"],
  faq: [
    { question: "Are dental veneers covered by insurance?", answer: "Veneers are usually considered cosmetic and not covered by dental insurance." },
    { question: "How long do porcelain veneers last?", answer: "Porcelain veneers typically last 10 to 15 years with proper care." },
    { question: "What is the difference between veneers and lumineers?", answer: "Lumineers are thinner and require less tooth preparation than traditional veneers." },
  ],
  formula: "Total Cost = (Cost per Tooth x Number of Teeth) x (1 - Insurance% / 100)",
};
