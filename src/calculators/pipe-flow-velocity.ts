import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pipeFlowVelocityCalculator: CalculatorDefinition = {
  slug: "pipe-flow-velocity",
  title: "Pipe Flow Velocity Calculator",
  description: "Free pipe flow velocity calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["pipe flow calculator"],
  variants: [{
    id: "standard",
    name: "Pipe Flow Velocity",
    description: "",
    fields: [
      { name: "flow", label: "Flow Rate (m³/s)", type: "number", min: 0.001 },
      { name: "diameter", label: "Pipe Diameter (m)", type: "number", min: 0.01 },
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
    { question: "How to calculate pipe flow velocity?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
