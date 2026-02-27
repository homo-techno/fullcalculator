import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const patreonIncomeCalculator: CalculatorDefinition = {
  slug: "patreon-income-calculator",
  title: "Patreon Income Calculator",
  description: "Free patreon income calculator. Calculate patreon income quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["patreon calculator"],
  variants: [{
    id: "standard",
    name: "Patreon Income",
    description: "",
    fields: [
      { name: "patrons", label: "Patrons", type: "number", min: 1 },
      { name: "avgPledge", label: "Avg Pledge ($)", type: "number", defaultValue: 5 },
      { name: "platformFee", label: "Platform Fee %", type: "number", defaultValue: 8 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Net Income", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate patreon income?", answer: "Enter values and get instant results." },
    { question: "Why use this patreon income calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
