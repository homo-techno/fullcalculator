import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const correctedQtcCalculator: CalculatorDefinition = {
  slug: "corrected-qtc",
  title: "Corrected QTc Calculator",
  description: "Free corrected qtc calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["qtc calculator"],
  variants: [{
    id: "standard",
    name: "Corrected QTc",
    description: "",
    fields: [
      { name: "qt", label: "QT Interval (ms)", type: "number", min: 100 },
      { name: "rr", label: "RR Interval (ms)", type: "number", min: 200 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "QTc (ms)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate corrected qtc?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "QTc = QT / √(RR/1000)",
};
