import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dowelJointCalculator: CalculatorDefinition = {
  slug: "dowel-joint-calculator",
  title: "Dowel Joint Calculator",
  description: "Find the right dowel size and spacing for wood joints.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dowel joint","dowel spacing calculator"],
  variants: [{
    id: "standard",
    name: "Dowel Joint",
    description: "Find the right dowel size and spacing for wood joints.",
    fields: [
      { name: "boardThick", label: "Board Thickness (inches)", type: "number", min: 0.25, max: 4, defaultValue: 0.75 },
      { name: "jointLength", label: "Joint Length (inches)", type: "number", min: 1, max: 96, defaultValue: 24 },
      { name: "spacing", label: "Dowel Spacing (inches)", type: "number", min: 1, max: 12, defaultValue: 6 },
    ],
    calculate: (inputs) => {
      const thick = inputs.boardThick as number;
      const jl = inputs.jointLength as number;
      const sp = inputs.spacing as number;
      if (!thick || !jl || !sp) return null;
      const dowelDia = Math.round((thick / 2) * 8) / 8;
      const dowelDepth = Math.round(dowelDia * 3 * 100) / 100;
      const numDowels = Math.floor(jl / sp) + 1;
      return {
        primary: { label: "Recommended Dowel Diameter", value: formatNumber(dowelDia) + " in" },
        details: [
          { label: "Dowel Depth Per Side", value: formatNumber(dowelDepth) + " in" },
          { label: "Number of Dowels", value: formatNumber(numDowels) },
          { label: "Actual Spacing", value: formatNumber(Math.round((jl / (numDowels - 1)) * 100) / 100) + " in" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How do I choose dowel size?", answer: "Use a dowel diameter that is about half the board thickness." },
    { question: "How deep should dowel holes be?", answer: "Drill holes about 3 times the dowel diameter deep on each side." },
  ],
  formula: "Dowel Diameter = Board Thickness / 2; Count = floor(Length / Spacing) + 1",
};
