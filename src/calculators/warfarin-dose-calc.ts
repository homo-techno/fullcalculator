import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const warfarinDoseCalcCalculator: CalculatorDefinition = {
  slug: "warfarin-dose-calc",
  title: "Warfarin Dosing Calculator",
  description: "Free warfarin dosing calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["warfarin calculator"],
  variants: [{
    id: "standard",
    name: "Warfarin Dosing",
    description: "",
    fields: [
      { name: "targetInr", label: "Target INR", type: "number", defaultValue: 2.5 },
      { name: "currentInr", label: "Current INR", type: "number", min: 0.5 },
      { name: "currentDose", label: "Current Dose (mg)", type: "number", min: 0.5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Adjusted Dose (mg)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate warfarin dosing?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
