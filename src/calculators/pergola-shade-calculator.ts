import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pergolaShadeCalculator: CalculatorDefinition = {
  slug: "pergola-shade-calculator",
  title: "Pergola Shade Calculator",
  description: "Estimate shade coverage area from a pergola structure.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pergola","shade","coverage","outdoor"],
  variants: [{
    id: "standard",
    name: "Pergola Shade",
    description: "Estimate shade coverage area from a pergola structure.",
    fields: [
      { name: "pergolaLength", label: "Pergola Length (ft)", type: "number", min: 4, max: 40, defaultValue: 12 },
      { name: "pergolaWidth", label: "Pergola Width (ft)", type: "number", min: 4, max: 40, defaultValue: 10 },
      { name: "slatCoverage", label: "Slat Coverage (%)", type: "number", min: 10, max: 100, defaultValue: 60 },
    ],
    calculate: (inputs) => {
    const pergolaLength = inputs.pergolaLength as number;
    const pergolaWidth = inputs.pergolaWidth as number;
    const slatCoverage = inputs.slatCoverage as number;
    const totalArea = pergolaLength * pergolaWidth;
    const shadedArea = totalArea * (slatCoverage / 100);
    return {
      primary: { label: "Shaded Area", value: formatNumber(shadedArea) + " sq ft" },
      details: [
        { label: "Total Pergola Area", value: formatNumber(totalArea) + " sq ft" },
        { label: "Shade Percentage", value: slatCoverage + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["landscape-lighting-calculator","sandbox-sand-calculator"],
  faq: [
    { question: "How much shade does a pergola provide?", answer: "A typical pergola provides 50 to 75 percent shade coverage." },
    { question: "What is the best pergola slat spacing?", answer: "Slats spaced 1 to 2 inches apart provide good shade balance." },
  ],
  formula: "Shaded Area = Length x Width x (Slat Coverage / 100)",
};
