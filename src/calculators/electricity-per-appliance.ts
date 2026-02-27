import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electricityPerApplianceCalculator: CalculatorDefinition = {
  slug: "electricity-per-appliance",
  title: "Appliance Electricity Cost Calculator",
  description: "Free appliance electricity cost calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["appliance electricity cost"],
  variants: [{
    id: "standard",
    name: "Appliance Electricity Cost",
    description: "",
    fields: [
      { name: "watts", label: "Watts", type: "number", min: 1 },
      { name: "hours", label: "Hours/Day", type: "number", min: 0.1 },
      { name: "rate", label: "Rate ($/kWh)", type: "number", defaultValue: 0.13 },
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
    { question: "How to calculate appliance electricity cost?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
