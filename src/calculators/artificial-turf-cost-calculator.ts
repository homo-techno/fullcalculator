import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const artificialTurfCostCalculator: CalculatorDefinition = {
  slug: "artificial-turf-cost-calculator",
  title: "Artificial Turf Cost Calculator",
  description: "Estimate the cost of installing artificial grass including materials, base prep, and labor.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["artificial turf cost", "fake grass cost", "synthetic lawn cost"],
  variants: [{
    id: "standard",
    name: "Artificial Turf Cost",
    description: "Estimate the cost of installing artificial grass including materials, base prep, and labor",
    fields: [
      { name: "sqft", label: "Area", type: "number", suffix: "sq ft", min: 50, max: 5000, defaultValue: 500 },
      { name: "grade", label: "Turf Grade", type: "select", options: [{value:"economy",label:"Economy"},{value:"mid",label:"Mid-Range"},{value:"premium",label:"Premium"}], defaultValue: "mid" },
      { name: "base", label: "Base Prep Needed", type: "select", options: [{value:"minimal",label:"Minimal (flat area)"},{value:"standard",label:"Standard"},{value:"heavy",label:"Heavy (grading needed)"}], defaultValue: "standard" },
    ],
    calculate: (inputs) => {
      const sqft = inputs.sqft as number;
      const grade = inputs.grade as string;
      const base = inputs.base as string;
      if (!sqft || sqft <= 0) return null;
      const turfRate: Record<string, number> = { economy: 3, mid: 6, premium: 10 };
      const baseRate: Record<string, number> = { minimal: 2, standard: 4, heavy: 7 };
      const turfCost = sqft * (turfRate[grade] || 6);
      const baseCost = sqft * (baseRate[base] || 4);
      const labor = sqft * 4;
      const infill = sqft * 0.75;
      const total = turfCost + baseCost + labor + infill;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Turf material", value: "$" + formatNumber(turfCost) },
          { label: "Base preparation", value: "$" + formatNumber(baseCost) },
          { label: "Installation labor", value: "$" + formatNumber(labor) },
          { label: "Infill", value: "$" + formatNumber(infill) },
          { label: "Cost per sq ft", value: "$" + formatNumber(total / sqft) },
        ],
      };
    },
  }],
  relatedSlugs: ["sod-cost-calculator", "lawn-care-cost-calculator"],
  faq: [
    { question: "How much does artificial turf cost?", answer: "Installed artificial turf costs $8-18 per sq ft depending on quality and base preparation needed." },
    { question: "How long does artificial turf last?", answer: "Quality artificial turf lasts 15-25 years with proper maintenance." },
  ],
  formula: "Total = Turf Material + Base Prep + Labor + Infill",
};
