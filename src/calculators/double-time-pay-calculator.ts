import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const doubleTimePayCalculator: CalculatorDefinition = {
  slug: "double-time-pay-calculator",
  title: "Double Time Pay Calculator",
  description: "Calculate double time pay for holidays or extended overtime hours.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["double time pay", "holiday pay calculator", "2x pay rate"],
  variants: [{
    id: "standard",
    name: "Double Time Pay",
    description: "Calculate double time pay for holidays or extended overtime hours",
    fields: [
      { name: "hourlyRate", label: "Regular Hourly Rate", type: "number", prefix: "$", min: 1, max: 1000, defaultValue: 25 },
      { name: "regularHours", label: "Regular Hours", type: "number", min: 0, max: 80, defaultValue: 40 },
      { name: "doubleTimeHours", label: "Double Time Hours", type: "number", min: 0, max: 40, defaultValue: 8 },
    ],
    calculate: (inputs) => {
      const rate = inputs.hourlyRate as number;
      const regular = inputs.regularHours as number;
      const dt = inputs.doubleTimeHours as number;
      if (!rate || rate <= 0) return null;
      const dtRate = rate * 2;
      const regularPay = rate * regular;
      const dtPay = dtRate * dt;
      const totalPay = regularPay + dtPay;
      return {
        primary: { label: "Total Pay", value: "$" + formatNumber(totalPay) },
        details: [
          { label: "Double Time Rate", value: "$" + formatNumber(dtRate) + "/hr" },
          { label: "Regular Pay", value: "$" + formatNumber(regularPay) },
          { label: "Double Time Pay", value: "$" + formatNumber(dtPay) },
        ],
      };
    },
  }],
  relatedSlugs: ["time-and-a-half-calculator", "back-pay-calculator"],
  faq: [
    { question: "When do employees get double time?", answer: "Double time is not federally mandated but some states like California require it after 12 hours in a day or on the 7th consecutive workday." },
    { question: "Is holiday pay always double time?", answer: "There is no federal requirement for holiday pay. Double time on holidays is typically an employer policy or union agreement." },
  ],
  formula: "Double Time Pay = Hourly Rate x 2 x Double Time Hours; Total = Regular + Double Time",
};
