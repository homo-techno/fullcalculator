import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bondYtmCalcCalculator: CalculatorDefinition = {
  slug: "bond-ytm-calc",
  title: "Bond Yield to Maturity Calculator",
  description: "Free bond yield to maturity calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bond ytm calculator"],
  variants: [{
    id: "standard",
    name: "Bond Yield to Maturity",
    description: "",
    fields: [
      { name: "price", label: "Bond Price ($)", type: "number", min: 1 },
      { name: "faceValue", label: "Face Value ($)", type: "number", defaultValue: 1000 },
      { name: "coupon", label: "Annual Coupon ($)", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "YTM %", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate bond yield to maturity?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
