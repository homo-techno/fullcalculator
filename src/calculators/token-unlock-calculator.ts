import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tokenUnlockCalculator: CalculatorDefinition = {
  slug: "token-unlock-calculator",
  title: "Token Unlock Schedule Calculator",
  description: "Free token unlock schedule calculator. Calculate token unlock schedule quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["token unlock calculator"],
  variants: [{
    id: "standard",
    name: "Token Unlock Schedule",
    description: "",
    fields: [
      { name: "total", label: "Total Tokens", type: "number", min: 1 },
      { name: "cliff", label: "Cliff (months)", type: "number", defaultValue: 6 },
      { name: "vesting", label: "Vesting (months)", type: "number", defaultValue: 24 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Monthly Unlock", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate token unlock schedule?", answer: "Enter values and get instant results." },
    { question: "Why use this token unlock schedule calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
