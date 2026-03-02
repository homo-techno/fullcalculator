import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const atticVentilationCalculator: CalculatorDefinition = {
  slug: "attic-ventilation-calculator",
  title: "Attic Ventilation Calculator",
  description: "Calculate the net free vent area needed for your attic.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["attic ventilation","attic vent area","roof ventilation"],
  variants: [{
    id: "standard",
    name: "Attic Ventilation",
    description: "Calculate the net free vent area needed for your attic.",
    fields: [
      { name: "atticSqFt", label: "Attic Floor Area (sq ft)", type: "number", min: 100, max: 10000, defaultValue: 1500 },
      { name: "vaporBarrier", label: "Vapor Barrier Installed", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
      const area = inputs.atticSqFt as number;
      const barrier = inputs.vaporBarrier as string;
      if (!area) return null;
      const ratio = barrier === "1" ? 300 : 150;
      const nfaSqFt = area / ratio;
      const nfaSqIn = nfaSqFt * 144;
      const intakeArea = nfaSqIn / 2;
      const exhaustArea = nfaSqIn / 2;
      return {
        primary: { label: "Total NFA Required", value: formatNumber(Math.round(nfaSqIn)) + " sq in" },
        details: [
          { label: "Ventilation Ratio", value: "1:" + formatNumber(ratio) },
          { label: "Intake Area Needed", value: formatNumber(Math.round(intakeArea)) + " sq in" },
          { label: "Exhaust Area Needed", value: formatNumber(Math.round(exhaustArea)) + " sq in" },
          { label: "NFA in Sq Ft", value: formatNumber(Math.round(nfaSqFt * 100) / 100) },
        ],
      };
  },
  }],
  relatedSlugs: ["insulation-calculator","roofing-calculator"],
  faq: [
    { question: "What is the 1/150 ventilation rule?", answer: "It means 1 sq ft of vent area per 150 sq ft of attic without a vapor barrier." },
    { question: "Should intake and exhaust be balanced?", answer: "Yes, split vent area evenly between soffit intake and ridge exhaust." },
  ],
  formula: "NFA = Attic Area / Ventilation Ratio (150 or 300)",
};
