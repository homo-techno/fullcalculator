import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const visionCorrectionCostCalculator: CalculatorDefinition = {
  slug: "vision-correction-cost-calculator",
  title: "Vision Correction Cost Calculator",
  description: "Compare costs of LASIK vs contacts vs glasses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["vision correction cost","lasik cost","glasses vs contacts"],
  variants: [{
    id: "standard",
    name: "Vision Correction Cost",
    description: "Compare costs of LASIK vs contacts vs glasses.",
    fields: [
      { name: "lasikCost", label: "LASIK Cost (both eyes) ($)", type: "number", min: 1000, max: 10000, defaultValue: 4000 },
      { name: "glassesCost", label: "Glasses Cost per Year ($)", type: "number", min: 50, max: 1000, defaultValue: 300 },
      { name: "contactsCost", label: "Contacts Cost per Year ($)", type: "number", min: 100, max: 2000, defaultValue: 500 },
      { name: "years", label: "Years to Compare", type: "number", min: 1, max: 30, defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const lasik = inputs.lasikCost as number;
      const glasses = inputs.glassesCost as number;
      const contacts = inputs.contactsCost as number;
      const years = inputs.years as number;
      if (!years) return null;
      const glassesTotal = glasses * years;
      const contactsTotal = contacts * years;
      const cheapest = Math.min(lasik, glassesTotal, contactsTotal);
      const best = cheapest === lasik ? "LASIK" : cheapest === glassesTotal ? "Glasses" : "Contacts";
      return {
        primary: { label: "Best Value (" + years + " yr)", value: best },
        details: [
          { label: "LASIK Total", value: "$" + formatNumber(lasik) },
          { label: "Glasses Total", value: "$" + formatNumber(glassesTotal) },
          { label: "Contacts Total", value: "$" + formatNumber(contactsTotal) },
        ],
      };
  },
  }],
  relatedSlugs: ["hearing-aid-cost-calculator","dental-implant-cost-calculator"],
  faq: [
    { question: "Is LASIK worth the cost?", answer: "LASIK often pays for itself within 5 to 8 years vs contacts." },
    { question: "How much do contacts cost per year?", answer: "Annual contact lens costs average $200 to $600." },
  ],
  formula: "Compare: LASIK one-time vs Glasses x Years vs Contacts x Years",
};
