import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ebookRoyaltyCalculator: CalculatorDefinition = {
  slug: "ebook-royalty-calculator",
  title: "Ebook Royalty Calculator",
  description: "Free ebook royalty calculator. Calculate ebook royalty quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ebook royalty calculator"],
  variants: [{
    id: "standard",
    name: "Ebook Royalty",
    description: "",
    fields: [
      { name: "price", label: "Book Price ($)", type: "number", min: 0.99 },
      { name: "royaltyRate", label: "Royalty Rate %", type: "number", defaultValue: 70 },
      { name: "sales", label: "Monthly Sales", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Monthly Royalty", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate ebook royalty?", answer: "Enter values and get instant results." },
    { question: "Why use this ebook royalty calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
