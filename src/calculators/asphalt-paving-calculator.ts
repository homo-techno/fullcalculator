import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const asphaltPavingCalculator: CalculatorDefinition = {
  slug: "asphalt-paving-calculator",
  title: "Asphalt Paving Calculator",
  description: "Calculate tons of asphalt needed for driveways and parking lots.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["asphalt tons","asphalt paving","driveway asphalt"],
  variants: [{
    id: "standard",
    name: "Asphalt Paving",
    description: "Calculate tons of asphalt needed for driveways and parking lots.",
    fields: [
      { name: "length", label: "Length (ft)", type: "number", min: 1, max: 1000, defaultValue: 50 },
      { name: "width", label: "Width (ft)", type: "number", min: 1, max: 500, defaultValue: 20 },
      { name: "thickness", label: "Thickness (in)", type: "number", min: 1, max: 12, defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const l = inputs.length as number;
      const w = inputs.width as number;
      const t = inputs.thickness as number;
      if (!l || !w || !t) return null;
      const cubicFt = l * w * (t / 12);
      const tons = cubicFt * 145 / 2000;
      return {
        primary: { label: "Asphalt Needed", value: formatNumber(Math.round(tons * 10) / 10) + " tons" },
        details: [
          { label: "Area", value: formatNumber(Math.round(l * w)) + " sq ft" },
          { label: "Cubic Feet", value: formatNumber(Math.round(cubicFt)) },
          { label: "Estimated Cost", value: "$" + formatNumber(Math.round(tons * 100)) },
        ],
      };
  },
  }],
  relatedSlugs: ["gravel-calculator","concrete-calculator"],
  faq: [
    { question: "How thick should an asphalt driveway be?", answer: "A residential driveway typically needs 2 to 3 inches of asphalt." },
    { question: "How much does asphalt cost per ton?", answer: "Asphalt costs about $80 to $150 per ton depending on the region." },
  ],
  formula: "Tons = (Length x Width x Thickness / 12) x 145 / 2000",
};
