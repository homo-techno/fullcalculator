import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coastfireCalculator: CalculatorDefinition = {
  slug: "coastfire-calculator",
  title: "CoastFIRE Calculator",
  description:
    "Calculate CoastFIRE number: how much to save now to let compound growth reach your FIRE number, then coast without additional contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "CoastFIRE calculator",
    "coast to retirement",
    "financial independence coasting",
    "compound growth FIRE",
    "stop saving FIRE",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate CoastFIRE Amount",
      description: "How much to save now to coast to FIRE",
      fields: [
        {
          name: "fireNumber",
          label: "Your FIRE Number Goal",
          type: "number",
          placeholder: "e.g. 1000000",
          prefix: "$",
        },
        {
          name: "yearsToCoast",
          label: "Years Until Full Retirement Age",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "investmentReturn",
          label: "Expected Annual Return",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "%",
        },
      ],
      calculate: (inputs) => {
        const fireNumber = parseFloat(inputs.fireNumber as string) || 1000000;
        const years = parseFloat(inputs.yearsToCoast as string) || 30;
        const returnRate = parseFloat(inputs.investmentReturn as string) || 7;

        const coastAmount = fireNumber / Math.pow(1 + returnRate / 100, years);
        const yearsToSaveFor = years / 2; // Typical: save half time, coast half time
        const monthlyNeeded = coastAmount / (yearsToSaveFor * 12);

        return {
          primary: { label: "CoastFIRE Amount to Save Now", value: `$${formatNumber(coastAmount, 0)}` },
          details: [
            { label: "FIRE number target", value: `$${formatNumber(fireNumber, 0)}` },
            { label: "Years until retirement age", value: `${years}` },
            { label: "Expected annual return", value: `${returnRate}%` },
            { label: "Amount to save today", value: `$${formatNumber(coastAmount, 0)}` },
            { label: "Monthly savings (typical)", value: `$${formatNumber(monthlyNeeded, 0)}` },
            { label: "After saving, you can stop working!", value: "Compound growth handles the rest" },
          ],
          note: "Once you've saved the CoastFIRE amount, you can work part-time, take a sabbatical, or reduce work stress.",
        };
      },
    },
  ],
  relatedSlugs: ["fire-number-calculator", "barista-fire-calculator"],
  faq: [
    {
      question: "What's the benefit of CoastFIRE?",
      answer:
        "Reach your FIRE number by a specific age (e.g., 65) while stopping work contributions at a younger age. Allows for burnout recovery, sabbaticals, or low-stress work.",
    },
    {
      question: "Can I coast partway to FIRE?",
      answer:
        "Yes! Work longer to accumulate more capital, then coast for some years. Many people use CoastFIRE as a bridge to BaristaFIRE (part-time work) before full retirement.",
    },
  ],
  formula: "CoastFIRE Amount = FIRE Number ÷ (1 + Return Rate)^Years",
};
