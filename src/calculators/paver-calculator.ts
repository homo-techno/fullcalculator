import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paverCalculator: CalculatorDefinition = {
  slug: "paver-calculator",
  title: "Paver Calculator",
  description: "Calculate the number of pavers needed for a patio or walkway.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["paver count","patio pavers","paver estimate"],
  variants: [{
    id: "standard",
    name: "Paver",
    description: "Calculate the number of pavers needed for a patio or walkway.",
    fields: [
      { name: "areaLength", label: "Area Length (ft)", type: "number", min: 1, max: 500, defaultValue: 15 },
      { name: "areaWidth", label: "Area Width (ft)", type: "number", min: 1, max: 200, defaultValue: 12 },
      { name: "paverLength", label: "Paver Length (in)", type: "number", min: 2, max: 24, defaultValue: 8 },
      { name: "paverWidth", label: "Paver Width (in)", type: "number", min: 2, max: 24, defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const al = inputs.areaLength as number;
      const aw = inputs.areaWidth as number;
      const pl = inputs.paverLength as number;
      const pw = inputs.paverWidth as number;
      if (!al || !aw || !pl || !pw) return null;
      const areaSqFt = al * aw;
      const paverSqFt = (pl * pw) / 144;
      const count = Math.ceil((areaSqFt / paverSqFt) * 1.1);
      return {
        primary: { label: "Pavers Needed", value: formatNumber(count) + " pavers" },
        details: [
          { label: "Total Area", value: formatNumber(Math.round(areaSqFt)) + " sq ft" },
          { label: "Paver Area", value: formatNumber(Math.round(paverSqFt * 100) / 100) + " sq ft each" },
          { label: "Includes 10% Waste", value: "Yes" },
        ],
      };
  },
  }],
  relatedSlugs: ["gravel-calculator","concrete-calculator"],
  faq: [
    { question: "How many pavers per square foot?", answer: "For 4x8 inch pavers you need about 4.5 pavers per square foot." },
    { question: "Should I add extra pavers for waste?", answer: "Yes, order 10 percent extra for cuts, breakage, and future repairs." },
  ],
  formula: "Pavers = (Area / Paver Area) x 1.10",
};
