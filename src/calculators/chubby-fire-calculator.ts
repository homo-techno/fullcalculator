import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chubbyFireCalculator: CalculatorDefinition = {
  slug: "chubby-fire-calculator",
  title: "ChubbyFIRE Calculator",
  description:
    "Calculate ChubbyFIRE number for comfortable middle-class retirement. Target $50-100k annual spending for balanced lifestyle and security.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "ChubbyFIRE calculator",
    "comfortable retirement",
    "middle-class FIRE",
    "moderate lifestyle FIRE",
    "balanced FIRE",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate ChubbyFIRE Number",
      description: "Portfolio for comfortable lifestyle",
      fields: [
        {
          name: "annualSpending",
          label: "Annual Spending ($50-100k range)",
          type: "number",
          placeholder: "e.g. 70000",
          prefix: "$",
        },
        {
          name: "yearsToRetire",
          label: "Years Until Retirement",
          type: "number",
          placeholder: "e.g. 20",
        },
      ],
      calculate: (inputs) => {
        const spending = parseFloat(inputs.annualSpending as string) || 70000;
        const years = parseFloat(inputs.yearsToRetire as string) || 20;

        const chubbyNumber = spending * 25;
        const monthlySavings = (chubbyNumber / years) / 12;

        return {
          primary: { label: "ChubbyFIRE Number", value: `$${formatNumber(chubbyNumber, 0)}` },
          details: [
            { label: "Annual spending", value: `$${formatNumber(spending, 0)}` },
            { label: "Portfolio needed (25x rule)", value: `$${formatNumber(chubbyNumber, 0)}` },
            { label: "Years to goal", value: `${years}` },
            { label: "Monthly savings needed", value: `$${formatNumber(monthlySavings, 0)}` },
            { label: "Annual savings needed", value: `$${formatNumber(monthlySavings * 12, 0)}` },
          ],
          note: "ChubbyFIRE balances ambition with lifestyle. Most achievable for upper-middle-income earners.",
        };
      },
    },
  ],
  relatedSlugs: ["fire-number-calculator", "fatfire-calculator"],
  faq: [
    {
      question: "What's ChubbyFIRE vs FatFIRE?",
      answer:
        "ChubbyFIRE: $50-100k/year (comfortable, middle-class). FatFIRE: $100k+/year (luxury, high-lifestyle). ChubbyFIRE is sweet spot: comfortable without requiring extreme wealth.",
    },
    {
      question: "Is ChubbyFIRE more realistic than FatFIRE?",
      answer:
        "Yes. For $100-150k income, ChubbyFIRE is achievable in 20-25 years with 50% savings rate. FatFIRE requires $200k+ income or exceptional savers.",
    },
  ],
  formula: "ChubbyFIRE Number = Annual Spending × 25",
};
