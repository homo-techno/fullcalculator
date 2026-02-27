import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const passwordEntropyCalculator: CalculatorDefinition = {
  slug: "password-entropy",
  title: "Password Entropy Calculator",
  description: "Free password entropy calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["password strength calculator"],
  variants: [{
    id: "standard",
    name: "Password Entropy",
    description: "",
    fields: [
      { name: "length", label: "Length", type: "number", min: 1 },
      { name: "charsetSize", label: "Character Set Size", type: "number", defaultValue: 95 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Entropy (bits)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate password entropy?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "H = L × log2(N)",
};
