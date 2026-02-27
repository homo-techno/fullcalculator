import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const breastPumpScheduleCalculator: CalculatorDefinition = {
  slug: "breast-pump-schedule-calculator",
  title: "Breast Pump Schedule Calculator",
  description: "Free breast pump schedule calculator. Calculate breast pump schedule quickly and accurately.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["pumping schedule"],
  variants: [{
    id: "standard",
    name: "Breast Pump Schedule",
    description: "",
    fields: [
      { name: "sessions", label: "Sessions/Day", type: "number", min: 1 },
      { name: "minutes", label: "Min/Session", type: "number", defaultValue: 15 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Daily Pump Time", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate breast pump schedule?", answer: "Enter values and get instant results." },
    { question: "Why use this breast pump schedule calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
