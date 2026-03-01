import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timeAndAHalfCalculator: CalculatorDefinition = {
  slug: "time-and-a-half-calculator",
  title: "Time and a Half Calculator",
  description: "Calculate overtime pay at 1.5 times your regular hourly rate.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["time and a half", "overtime pay calculator", "1.5x pay"],
  variants: [{
    id: "standard",
    name: "Time and a Half",
    description: "Calculate overtime pay at 1",
    fields: [
      { name: "hourlyRate", label: "Regular Hourly Rate", type: "number", prefix: "$", min: 1, max: 1000, defaultValue: 25 },
      { name: "regularHours", label: "Regular Hours Worked", type: "number", min: 0, max: 80, defaultValue: 40 },
      { name: "overtimeHours", label: "Overtime Hours", type: "number", min: 0, max: 80, defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const rate = inputs.hourlyRate as number;
      const regular = inputs.regularHours as number;
      const ot = inputs.overtimeHours as number;
      if (!rate || rate <= 0) return null;
      const otRate = rate * 1.5;
      const regularPay = rate * regular;
      const otPay = otRate * ot;
      const totalPay = regularPay + otPay;
      return {
        primary: { label: "Total Weekly Pay", value: "$" + formatNumber(totalPay) },
        details: [
          { label: "Overtime Rate", value: "$" + formatNumber(otRate) + "/hr" },
          { label: "Regular Pay", value: "$" + formatNumber(regularPay) },
          { label: "Overtime Pay", value: "$" + formatNumber(otPay) },
        ],
      };
    },
  }],
  relatedSlugs: ["double-time-pay-calculator", "back-pay-calculator"],
  faq: [
    { question: "When do I get time and a half?", answer: "Under federal law, non-exempt employees earn 1.5x their regular rate for hours worked beyond 40 in a workweek." },
    { question: "Is overtime pay mandatory?", answer: "Yes, the Fair Labor Standards Act requires employers to pay overtime to non-exempt employees. Some salaried positions are exempt." },
  ],
  formula: "Overtime Pay = Hourly Rate x 1.5 x Overtime Hours; Total = Regular Pay + Overtime Pay",
};
