import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const servoTorqueCalculator: CalculatorDefinition = {
  slug: "servo-torque-calculator",
  title: "Servo Torque Calculator",
  description: "Calculate servo torque with our free online calculator. Get instant results.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["servo calculator"],
  variants: [{
    id: "standard",
    name: "Servo Torque",
    description: "",
    fields: [
      { name: "torque", label: "Torque (kg-cm)", type: "number", min: 0.1 },
      { name: "armLength", label: "Arm Length (cm)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Force (kg)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate servo torque?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good servo torque?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
