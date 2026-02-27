import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ciCdTimeCalculator: CalculatorDefinition = {
  slug: "ci-cd-time-calculator",
  title: "Ci Cd Time Calculator",
  description: "Free ci cd time calculator. Quickly calculate and plan your ci cd time needs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ci cd time calculator", "calculator", "planning tool"],
  variants: [
    {
      id: "standard",
      name: "Ci Cd Time",
      description: "Free ci cd time calculator. Quickly calculate and plan your ci cd time needs.",
      fields: [
        {
          name: "duration",
          label: "Duration per Session",
          type: "number",
          placeholder: "e.g. 45",
          suffix: "minutes",
          min: 1,
        },
        {
          name: "frequency",
          label: "Sessions per Week",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 50,
        }
      ],
      calculate: (inputs) => {
        const duration = inputs.duration as number;
        const freq = inputs.frequency as number;
        if (!duration || !freq) return null;
        const weeklyMin = duration * freq;
        const weeklyHrs = weeklyMin / 60;
        const yearlyHrs = weeklyHrs * 52;
        return {
          primary: { label: "Weekly Time", value: formatNumber(weeklyHrs) + " hours" },
          details: [
            { label: "Daily average", value: formatNumber(weeklyMin / 7) + " min" },
            { label: "Monthly", value: formatNumber(weeklyHrs * 4.33) + " hours" },
            { label: "Yearly", value: formatNumber(yearlyHrs) + " hours" },
            { label: "Yearly (days)", value: formatNumber(yearlyHrs / 24) + " days" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    {
      question: "How does the ci cd time work?",
      answer: "Enter your values and the calculator instantly shows you the results with a detailed breakdown.",
    },
    {
      question: "Can I customize the inputs?",
      answer: "Yes, adjust any input field to see how changes affect the result. All calculations update in real-time.",
    }
  ],
  formula: "Based on input values and standard formulas",
};
