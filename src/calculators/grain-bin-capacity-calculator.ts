import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const grainBinCapacityCalculator: CalculatorDefinition = {
  slug: "grain-bin-capacity-calculator",
  title: "Grain Bin Capacity Calculator",
  description: "Calculate grain storage capacity of a cylindrical bin.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["grain bin","grain storage calculator"],
  variants: [{
    id: "standard",
    name: "Grain Bin Capacity",
    description: "Calculate grain storage capacity of a cylindrical bin.",
    fields: [
      { name: "diameter", label: "Bin Diameter (feet)", type: "number", min: 6, max: 120, defaultValue: 30 },
      { name: "eaveHeight", label: "Eave Height (feet)", type: "number", min: 5, max: 60, defaultValue: 20 },
      { name: "peakHeight", label: "Peak Height Above Eave (feet)", type: "number", min: 0, max: 20, defaultValue: 5 },
      { name: "bushelsPerCuFt", label: "Bushels Per Cubic Foot", type: "number", min: 0.5, max: 1.5, defaultValue: 0.8 },
    ],
    calculate: (inputs) => {
      const d = inputs.diameter as number;
      const eh = inputs.eaveHeight as number;
      const pk = inputs.peakHeight as number;
      const bpf = inputs.bushelsPerCuFt as number;
      if (!d || !eh || !bpf) return null;
      const r = d / 2;
      const cylVol = Math.PI * r * r * eh;
      const coneVol = (1 / 3) * Math.PI * r * r * pk;
      const totalVol = cylVol + coneVol;
      var bushels = Math.round(totalVol * bpf);
      var tons = Math.round(bushels * 56 / 2000 * 10) / 10;
      return {
        primary: { label: "Capacity", value: formatNumber(bushels) + " bushels" },
        details: [
          { label: "Total Volume", value: formatNumber(Math.round(totalVol)) + " cu ft" },
          { label: "Approximate Tons (corn)", value: formatNumber(tons) },
          { label: "Bin Floor Area", value: formatNumber(Math.round(Math.PI * r * r)) + " sq ft" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How do I convert bushels to tons?", answer: "For corn, multiply bushels by 56 and divide by 2000 to get short tons." },
    { question: "What is the standard bushel conversion?", answer: "One bushel equals 1.2445 cubic feet, or about 0.8 bushels per cubic foot." },
  ],
  formula: "Bushels = (Cylinder Vol + Cone Vol) x Bushels Per Cu Ft",
};
