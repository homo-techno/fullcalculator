import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dueDateIvfCalculator: CalculatorDefinition = {
  slug: "due-date-ivf-calculator",
  title: "IVF Due Date Calculator",
  description: "Free ivf due date calculator. Calculate ivf due date quickly and accurately.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["ivf due date"],
  variants: [{
    id: "standard",
    name: "IVF Due Date",
    description: "",
    fields: [
      { name: "transferDay", label: "Transfer Day (day of month)", type: "number", min: 1 },
      { name: "embryoAge", label: "Embryo Age (days)", type: "number", defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Due Date Day", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate ivf due date?", answer: "Enter values and get instant results." },
    { question: "Why use this ivf due date calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
