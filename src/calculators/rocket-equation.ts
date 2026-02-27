import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rocketEquationCalculator: CalculatorDefinition = {
  slug: "rocket-equation",
  title: "Tsiolkovsky Rocket Equation Calculator",
  description: "Free tsiolkovsky rocket equation calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["rocket equation calculator"],
  variants: [{
    id: "standard",
    name: "Tsiolkovsky Rocket Equation",
    description: "",
    fields: [
      { name: "isp", label: "Specific Impulse (s)", type: "number", min: 1 },
      { name: "wetMass", label: "Wet Mass (kg)", type: "number", min: 1 },
      { name: "dryMass", label: "Dry Mass (kg)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Delta-V (m/s)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate tsiolkovsky rocket equation?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Δv = Isp×g×ln(m0/mf)",
};
