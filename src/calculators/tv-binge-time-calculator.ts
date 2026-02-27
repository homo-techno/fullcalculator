import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tvBingeTimeCalculator: CalculatorDefinition = {
  slug: "tv-binge-time-calculator",
  title: "Tv Binge Time Calculator",
  description: "Free tv binge time calculator. Quickly calculate and plan your tv binge time needs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tv binge time calculator", "calculator", "planning tool"],
  variants: [
    {
      id: "standard",
      name: "Tv Binge Time",
      description: "Free tv binge time calculator. Quickly calculate and plan your tv binge time nee",
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
      question: "How does the tv binge time work?",
      answer: "Enter your values and the calculator instantly shows you the results with a detailed breakdown.",
    },
    {
      question: "Can I customize the inputs?",
      answer: "Yes, adjust any input field to see how changes affect the result. All calculations update in real-time.",
    }
  ],
  formula: "Based on input values and standard formulas",
};
