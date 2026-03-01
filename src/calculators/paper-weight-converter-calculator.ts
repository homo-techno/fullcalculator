import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paperWeightConverterCalculator: CalculatorDefinition = {
  slug: "paper-weight-converter-calculator",
  title: "Paper Weight Converter Calculator",
  description: "Convert paper weight from GSM to US bond weight.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["gsm to bond","paper weight conversion"],
  variants: [{
    id: "standard",
    name: "Paper Weight Converter",
    description: "Convert paper weight from GSM to US bond weight.",
    fields: [
      { name: "gsm", label: "GSM (g/m²)", type: "number", min: 1, max: 600, defaultValue: 80 },
    ],
    calculate: (inputs) => {
      const gsm = inputs.gsm as number;
      if (!gsm) return null;
      const bond = Math.round(gsm * 0.2661 * 100) / 100;
      const cover = Math.round(gsm * 0.3697 * 100) / 100;
      const category = gsm <= 90 ? "Light / Copy paper" : gsm <= 170 ? "Medium / Brochure" : "Heavy / Card stock";
      return {
        primary: { label: "US Bond Weight", value: bond.toFixed(1) + " lb" },
        details: [
          { label: "Cover Weight", value: cover.toFixed(1) + " lb" },
          { label: "Category", value: category },
          { label: "GSM", value: formatNumber(gsm) + " g/m²" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is GSM?", answer: "GSM is grams per square meter, the international paper weight standard." },
    { question: "What GSM is standard copy paper?", answer: "Standard copy paper is typically 75 to 80 GSM." },
  ],
  formula: "Bond Weight = GSM x 0.2661",
};
