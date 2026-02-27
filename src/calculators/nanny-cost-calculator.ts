import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nannyCostCalculator: CalculatorDefinition = {
  slug: "nanny-cost-calculator",
  title: "Nanny Cost Calculator",
  description: "Free nanny cost calculator. Quickly calculate and plan your nanny cost needs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["nanny cost calculator", "calculator", "planning tool"],
  variants: [
    {
      id: "standard",
      name: "Nanny Cost",
      description: "Free nanny cost calculator. Quickly calculate and plan your nanny cost needs.",
      fields: [
        {
          name: "unitCost",
          label: "Unit Cost",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "quantity",
          label: "Quantity / Frequency",
          type: "number",
          placeholder: "e.g. 4",
          min: 0,
          step: 0.1,
        },
        {
          name: "period",
          label: "Time Period",
          type: "select",
          defaultValue: "12",
          options: [{ label: "Per Week", value: "52" }, { label: "Per Month", value: "12" }, { label: "Per Year", value: "1" }],
        }
      ],
      calculate: (inputs) => {
        const cost = inputs.unitCost as number;
        const qty = inputs.quantity as number;
        const timesPerYear = parseFloat(inputs.period as string) || 12;
        if (!cost || !qty) return null;
        const perPeriod = cost * qty;
        const annual = perPeriod * timesPerYear;
        const monthly = annual / 12;
        return {
          primary: { label: "Annual Cost", value: "$" + formatNumber(annual) },
          details: [
            { label: "Monthly cost", value: "$" + formatNumber(monthly) },
            { label: "Per occurrence", value: "$" + formatNumber(perPeriod) },
            { label: "5-year total", value: "$" + formatNumber(annual * 5) },
            { label: "10-year total", value: "$" + formatNumber(annual * 10) },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    {
      question: "How does the nanny cost work?",
      answer: "Enter your values and the calculator instantly shows you the results with a detailed breakdown.",
    },
    {
      question: "Can I customize the inputs?",
      answer: "Yes, adjust any input field to see how changes affect the result. All calculations update in real-time.",
    }
  ],
  formula: "Based on input values and standard formulas",
};
