import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sprintSpeedCalculator: CalculatorDefinition = {
  slug: "sprint-speed",
  title: "Sprint Speed Calculator",
  description: "Free sprint speed calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["sprint speed calculator"],
  variants: [{
    id: "standard",
    name: "Sprint Speed",
    description: "",
    fields: [
      { name: "distance", label: "Distance (m)", type: "number", min: 10 },
      { name: "time", label: "Time (s)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Speed (m/s)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate sprint speed?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
