import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const contentCreatorRevenueCalculator: CalculatorDefinition = {
  slug: "content-creator-revenue-calculator",
  title: "Content Creator Revenue Calculator",
  description: "Free content creator revenue calculator. Calculate content creator revenue quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["creator earnings"],
  variants: [{
    id: "standard",
    name: "Content Creator Revenue",
    description: "",
    fields: [
      { name: "views", label: "Monthly Views", type: "number", min: 100 },
      { name: "rpm", label: "RPM ($)", type: "number", defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Monthly Revenue", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate content creator revenue?", answer: "Enter values and get instant results." },
    { question: "Why use this content creator revenue calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
