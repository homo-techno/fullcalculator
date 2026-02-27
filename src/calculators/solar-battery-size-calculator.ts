import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const solarBatterySizeCalculator: CalculatorDefinition = {
  slug: "solar-battery-size-calculator",
  title: "Solar Battery Size Calculator",
  description: "Free solar battery size calculator. Get instant results.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["solar battery calculator"],
  variants: [{
    id: "standard",
    name: "Solar Battery Size",
    description: "",
    fields: [
      { name: "dailyUsage", label: "Daily Usage (kWh)", type: "number", min: 1 },
      { name: "backupDays", label: "Backup Days", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Battery Size (kWh)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate solar battery size?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};
