import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const leanfireCalculator: CalculatorDefinition = {
  slug: "leanfire-calculator",
  title: "LeanFIRE Calculator",
  description:
    "Calculate LeanFIRE number for minimal expense early retirement. Target under $25k annually for fastest path to financial independence.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "LeanFIRE calculator",
    "minimal spending FIRE",
    "frugal retirement",
    "low cost FIRE",
    "minimal FIRE",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate LeanFIRE Number",
      description: "Plan for minimal-expense retirement",
      fields: [
        {
          name: "annualSpending",
          label: "Annual Spending Target",
          type: "number",
          placeholder: "e.g. 20000",
          prefix: "$",
          suffix: "/year",
        },
        {
          name: "yearsToFire",
          label: "Years Until LeanFIRE",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const spending = parseFloat(inputs.annualSpending as string) || 20000;
        const years = parseFloat(inputs.yearsToFire as string) || 10;

        const leanfireNumber = spending * 25; // 4% rule
        const monthlySavings = (leanfireNumber / years) / 12;

        return {
          primary: { label: "LeanFIRE Number", value: `$${formatNumber(leanfireNumber, 0)}` },
          details: [
            { label: "Annual spending", value: `$${formatNumber(spending, 0)}` },
            { label: "Portfolio needed (25x rule)", value: `$${formatNumber(leanfireNumber, 0)}` },
            { label: "Time to LeanFIRE", value: `${years} years` },
            { label: "Monthly savings needed", value: `$${formatNumber(monthlySavings, 0)}` },
            { label: "Annual income withdrawal", value: `$${formatNumber(spending, 0)}` },
          ],
          note: "LeanFIRE is fastest path to FI. Trade lifestyle flexibility for speed.",
        };
      },
    },
  ],
  relatedSlugs: ["fire-number-calculator", "coastfire-calculator"],
  faq: [
    {
      question: "What spending is realistic for LeanFIRE?",
      answer:
        "$15-25k/year in low cost-of-living areas (SE Asia, Mexico, Central America). In US: challenging without roommates. Most LeanFIRE practitioners live abroad or with family.",
    },
    {
      question: "How fast can I achieve LeanFIRE?",
      answer:
        "With 50%+ savings rate: 10-15 years. With 60%+ savings rate: 7-10 years. Higher savings rates = faster FI.",
    },
  ],
  formula: "LeanFIRE Number = Annual Spending × 25",
};
