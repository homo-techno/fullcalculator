import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fatfireCalculator: CalculatorDefinition = {
  slug: "fatfire-calculator",
  title: "FatFIRE Calculator",
  description:
    "Calculate FatFIRE number for high-lifestyle early retirement. For those who want $100k+ annual spending in retirement.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "FatFIRE calculator",
    "high lifestyle retirement",
    "luxury FIRE",
    "affluent retirement",
    "high spending FIRE",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate FatFIRE Number",
      description: "Plan for high-income retirement lifestyle",
      fields: [
        {
          name: "annualSpending",
          label: "Desired Annual Spending",
          type: "number",
          placeholder: "e.g. 100000",
          prefix: "$",
          suffix: "/year",
        },
        {
          name: "yearsToRetirement",
          label: "Years Until Retirement",
          type: "number",
          placeholder: "e.g. 15",
        },
        {
          name: "inflationRate",
          label: "Inflation Rate",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "%",
        },
      ],
      calculate: (inputs) => {
        const spending = parseFloat(inputs.annualSpending as string) || 100000;
        const years = parseFloat(inputs.yearsToRetirement as string) || 15;
        const inflation = parseFloat(inputs.inflationRate as string) || 3;

        const futureSpending = spending * Math.pow(1 + inflation / 100, years);
        const fatfireNumber = futureSpending / 0.04;
        const monthlyNeeded = (fatfireNumber / years) / 12;

        return {
          primary: { label: "FatFIRE Number", value: `$${formatNumber(fatfireNumber, 0)}` },
          details: [
            { label: "Current annual spending", value: `$${formatNumber(spending, 0)}` },
            { label: "Future annual spending (year " + years + ")", value: `$${formatNumber(futureSpending, 0)}` },
            { label: "Portfolio needed (4% rule)", value: `$${formatNumber(fatfireNumber, 0)}` },
            { label: "Monthly savings needed", value: `$${formatNumber(monthlyNeeded, 0)}` },
            { label: "Annual savings needed", value: `$${formatNumber(monthlyNeeded * 12, 0)}` },
          ],
          note: "FatFIRE targets high spending ($100k+/year). Adjust withdrawal rate based on portfolio composition.",
        };
      },
    },
  ],
  relatedSlugs: ["fire-number-calculator", "leanfire-calculator"],
  faq: [
    {
      question: "What's the difference between FIRE and FatFIRE?",
      answer:
        "FIRE typically targets $30-50k/year spending. FatFIRE targets $100k-300k+/year. FatFIRE requires 2-5x larger portfolio but offers more lifestyle flexibility.",
    },
    {
      question: "Is FatFIRE realistic?",
      answer:
        "Yes, many millionaires pursue FatFIRE. Requires income $150k+/year for 10-20 years, or significant inheritance/windfalls. Takes 15-25 years typical.",
    },
  ],
  formula: "FatFIRE Number = (Annual Spending × (1 + Inflation)^Years) ÷ 0.04",
};
