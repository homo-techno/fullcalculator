import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const freelanceHourlyRateCalculator: CalculatorDefinition = {
  slug: "freelance-hourly-rate-calculator",
  title: "Freelance Hourly Rate Calculator",
  description: "Free freelance hourly rate calculator. Calculate freelance hourly rate quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["freelance rate calculator"],
  variants: [{
    id: "standard",
    name: "Freelance Hourly Rate",
    description: "",
    fields: [
      { name: "annualTarget", label: "Annual Target ($)", type: "number", min: 1 },
      { name: "billableHours", label: "Billable Hours/Year", type: "number", defaultValue: 1500 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Hourly Rate", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate freelance hourly rate?", answer: "Enter values and get instant results." },
    { question: "Why use this freelance hourly rate calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
