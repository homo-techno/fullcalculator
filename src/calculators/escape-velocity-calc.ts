import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const escapeVelocityCalcCalculator: CalculatorDefinition = {
  slug: "escape-velocity-calc",
  title: "Escape Velocity Calculator",
  description: "Free escape velocity calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["escape velocity calculator"],
  variants: [{
    id: "standard",
    name: "Escape Velocity",
    description: "",
    fields: [
      { name: "mass", label: "Planet Mass (kg)", type: "number", defaultValue: 5.972e+24 },
      { name: "radius", label: "Planet Radius (m)", type: "number", defaultValue: 6371000 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Velocity (m/s)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate escape velocity?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "v = √(2GM/r)",
};
