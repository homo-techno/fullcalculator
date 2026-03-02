import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sheetMetalBendCalculator: CalculatorDefinition = {
  slug: "sheet-metal-bend-calculator",
  title: "Sheet Metal Bend Calculator",
  description: "Calculate bend allowance and deduction for sheet metal.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["bend allowance","sheet metal calculator"],
  variants: [{
    id: "standard",
    name: "Sheet Metal Bend",
    description: "Calculate bend allowance and deduction for sheet metal.",
    fields: [
      { name: "angle", label: "Bend Angle (degrees)", type: "number", min: 1, max: 180, defaultValue: 90 },
      { name: "radius", label: "Inside Bend Radius (inches)", type: "number", min: 0.01, max: 10, defaultValue: 0.125 },
      { name: "thickness", label: "Material Thickness (inches)", type: "number", min: 0.005, max: 2, defaultValue: 0.06 },
      { name: "kFactor", label: "K-Factor", type: "number", min: 0.1, max: 0.5, defaultValue: 0.33 },
    ],
    calculate: (inputs) => {
      const ang = inputs.angle as number;
      const r = inputs.radius as number;
      const t = inputs.thickness as number;
      const k = inputs.kFactor as number;
      if (!ang || !r || !t || !k) return null;
      const radians = ang * Math.PI / 180;
      const ba = radians * (r + k * t);
      const ossb = (r + t) * Math.tan((ang / 2) * Math.PI / 180);
      const bd = 2 * ossb - ba;
      return {
        primary: { label: "Bend Allowance", value: formatNumber(Math.round(ba * 10000) / 10000) + " in" },
        details: [
          { label: "Bend Deduction", value: formatNumber(Math.round(bd * 10000) / 10000) + " in" },
          { label: "Outside Setback", value: formatNumber(Math.round(ossb * 10000) / 10000) + " in" },
          { label: "K-Factor", value: formatNumber(k) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is the K-factor?", answer: "The K-factor is the ratio of the neutral axis location to the material thickness." },
    { question: "What K-factor should I use for mild steel?", answer: "Use 0.33 for air bending and 0.42 for bottom bending mild steel." },
  ],
  formula: "BA = (PI/180) x Angle x (Radius + K x Thickness)",
};
