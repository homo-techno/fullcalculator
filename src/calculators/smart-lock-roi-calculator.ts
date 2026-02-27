import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const smartLockRoiCalculator: CalculatorDefinition = {
  slug: "smart-lock-roi-calculator",
  title: "Smart Lock ROI Calculator",
  description: "Free smart lock roi calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["smart lock calculator"],
  variants: [{
    id: "standard",
    name: "Smart Lock ROI",
    description: "",
    fields: [
      { name: "lockCost", label: "Lock Cost ($)", type: "number", defaultValue: 200 },
      { name: "keysCut", label: "Keys Cut/Year ($)", type: "number", defaultValue: 25 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Payback Months", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate smart lock roi?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};
