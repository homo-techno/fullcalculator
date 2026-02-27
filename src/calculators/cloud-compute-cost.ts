import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cloudComputeCostCalculator: CalculatorDefinition = {
  slug: "cloud-compute-cost",
  title: "Cloud Compute Cost Calculator",
  description: "Free cloud compute cost calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cloud compute calculator"],
  variants: [{
    id: "standard",
    name: "Cloud Compute Cost",
    description: "",
    fields: [
      { name: "instances", label: "Instances", type: "number", min: 1 },
      { name: "costPerHr", label: "Cost/Hr ($)", type: "number", defaultValue: 0.05 },
      { name: "hours", label: "Hours/Month", type: "number", defaultValue: 720 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Monthly Cost ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate cloud compute cost?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
