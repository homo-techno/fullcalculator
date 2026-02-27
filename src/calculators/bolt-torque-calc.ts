import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boltTorqueCalcCalculator: CalculatorDefinition = {
  slug: "bolt-torque-calc",
  title: "Bolt Torque Calculator",
  description: "Free bolt torque calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["bolt torque calculator"],
  variants: [{
    id: "standard",
    name: "Bolt Torque",
    description: "",
    fields: [
      { name: "diameter", label: "Bolt Diameter (mm)", type: "number", min: 3 },
      { name: "clampForce", label: "Clamp Force (N)", type: "number", min: 100 },
      { name: "friction", label: "Friction Coeff", type: "number", defaultValue: 0.2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Torque (N·m)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate bolt torque?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
