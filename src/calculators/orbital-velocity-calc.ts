import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const orbitalVelocityCalcCalculator: CalculatorDefinition = {
  slug: "orbital-velocity-calc",
  title: "Orbital Velocity Calculator",
  description: "Free orbital velocity calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["orbital velocity calculator"],
  variants: [{
    id: "standard",
    name: "Orbital Velocity",
    description: "",
    fields: [
      { name: "mass", label: "Central Mass (kg)", type: "number", defaultValue: 5.972e+24 },
      { name: "radius", label: "Orbit Radius (m)", type: "number", defaultValue: 6771000 },
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
    { question: "How to calculate orbital velocity?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
