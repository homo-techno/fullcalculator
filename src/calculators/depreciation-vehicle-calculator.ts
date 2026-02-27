import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const depreciationVehicleCalculator: CalculatorDefinition = {
  slug: "depreciation-vehicle-calculator",
  title: "Vehicle Depreciation Calculator",
  description: "Free vehicle depreciation calculator. Calculate vehicle depreciation quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["car depreciation"],
  variants: [{
    id: "standard",
    name: "Vehicle Depreciation",
    description: "",
    fields: [
      { name: "purchase", label: "Purchase Price ($)", type: "number", min: 1 },
      { name: "years", label: "Years Owned", type: "number", min: 1 },
      { name: "rate", label: "Annual Depreciation %", type: "number", defaultValue: 15 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Current Value", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate vehicle depreciation?", answer: "Enter values and get instant results." },
    { question: "Why use this vehicle depreciation calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
