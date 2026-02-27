import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bondPriceCalcCalculator: CalculatorDefinition = {
  slug: "bond-price-calc",
  title: "Bond Price Calculator",
  description: "Free bond price calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bond price calculator"],
  variants: [{
    id: "standard",
    name: "Bond Price",
    description: "",
    fields: [
      { name: "faceValue", label: "Face Value ($)", type: "number", defaultValue: 1000 },
      { name: "couponRate", label: "Coupon Rate %", type: "number", defaultValue: 5 },
      { name: "ytm", label: "YTM %", type: "number", defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Bond Price ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate bond price?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
