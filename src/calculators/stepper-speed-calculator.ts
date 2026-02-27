import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stepperSpeedCalculator: CalculatorDefinition = {
  slug: "stepper-speed-calculator",
  title: "Stepper Motor Speed Calculator",
  description: "Calculate stepper motor speed with our free online calculator. Get instant results.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["stepper motor calculator"],
  variants: [{
    id: "standard",
    name: "Stepper Motor Speed",
    description: "",
    fields: [
      { name: "stepsPerRev", label: "Steps/Rev", type: "number", defaultValue: 200 },
      { name: "microstepping", label: "Microstep Divider", type: "number", defaultValue: 16 },
      { name: "rpm", label: "Target RPM", type: "number", defaultValue: 60 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Steps/Sec", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate stepper motor speed?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good stepper motor speed?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
