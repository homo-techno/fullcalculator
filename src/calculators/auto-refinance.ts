import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const autoRefinanceCalculator: CalculatorDefinition = {
  slug: "auto-refinance-calculator",
  title: "Auto Refinance Calculator",
  description:
    "Free auto refinance calculator. See how much you can save by refinancing your car loan with a lower interest rate, shorter term, or both.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "auto refinance calculator",
    "car refinance calculator",
    "refinance car loan",
    "auto loan refinance savings",
    "vehicle refinance",
    "lower car payment",
  ],
  variants: [
    {
      id: "auto-refinance-savings",
      name: "Auto Refinance Savings",
      description: "Compare your current auto loan with refinance options",
      fields: [
        {
          name: "currentBalance",
          label: "Current Loan Balance",
          type: "number",
          placeholder: "e.g. 22000",
          prefix: "$",
          min: 0,
        },
        {
          name: "currentRate",
          label: "Current Interest Rate",
          type: "number",
          placeholder: "e.g. 8.5",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "currentRemainingMonths",
          label: "Months Remaining on Current Loan",
          type: "number",
          placeholder: "e.g. 48",
          min: 1,
          max: 84,
        },
        {
          name: "newRate",
          label: "New Refinance Rate",
          type: "number",
          placeholder: "e.g. 5.5",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "newTerm",
          label: "New Loan Term",
          type: "select",
          options: [
            { label: "24 months", value: "24" },
            { label: "36 months", value: "36" },
            { label: "48 months", value: "48" },
            { label: "60 months", value: "60" },
            { label: "72 months", value: "72" },
          ],
          defaultValue: "48",
        },
        {
          name: "refinanceFees",
          label: "Refinance Fees",
          type: "select",
          options: [
            { label: "None", value: "0" },
            { label: "$100", value: "100" },
            { label: "$200", value: "200" },
            { label: "$500", value: "500" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const balance = inputs.currentBalance as number;
        const currentRate = inputs.currentRate as number;
        const currentMonths = inputs.currentRemainingMonths as number;
        const newRate = inputs.newRate as number;
        const newMonths = parseInt(inputs.newTerm as string) || 48;
        const fees = parseFloat(inputs.refinanceFees as string) || 0;
        if (!balance || !currentRate || !currentMonths || !newRate) return null;

        const calcMonthly = (l: number, r: number, n: number) => {
          const mr = r / 100 / 12;
          return (l * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);
        };

        const currentMonthly = calcMonthly(balance, currentRate, currentMonths);
        const newMonthly = calcMonthly(balance, newRate, newMonths);

        const currentTotal = currentMonthly * currentMonths;
        const newTotal = newMonthly * newMonths + fees;

        const currentInterest = currentTotal - balance;
        const newInterest = newTotal - balance;

        const monthlySavings = currentMonthly - newMonthly;
        const totalSavings = currentTotal - newTotal;

        return {
          primary: {
            label: "New Monthly Payment",
            value: `$${formatNumber(newMonthly)}`,
          },
          details: [
            { label: "Current monthly payment", value: `$${formatNumber(currentMonthly)}` },
            { label: "Monthly savings", value: `$${formatNumber(Math.max(0, monthlySavings))}` },
            { label: "Current remaining interest", value: `$${formatNumber(currentInterest)}` },
            { label: "New total interest", value: `$${formatNumber(newInterest)}` },
            { label: "Refinance fees", value: `$${formatNumber(fees)}` },
            { label: "Net total savings", value: `$${formatNumber(totalSavings)}` },
            { label: "Break-even months", value: monthlySavings > 0 ? `${Math.ceil(fees / monthlySavings)} months` : "N/A" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["personal-loan-calculator", "consolidation-loan-calculator"],
  faq: [
    {
      question: "When should I refinance my car loan?",
      answer:
        "Refinancing makes sense when interest rates have dropped, your credit score has improved significantly, or you want to change your loan term. Typically, a rate reduction of 1-2% or more justifies refinancing.",
    },
    {
      question: "Are there fees to refinance a car?",
      answer:
        "Some lenders charge no fees, while others may have application fees, title transfer fees, or state re-registration fees. These are typically $0-$500. Factor these into your savings calculation.",
    },
    {
      question: "Can I refinance if I owe more than my car is worth?",
      answer:
        "Being 'upside down' or 'underwater' makes refinancing difficult but not impossible. Some lenders offer negative equity refinancing, though rates may be higher. Consider whether it still saves you money.",
    },
  ],
  formula:
    "Monthly = L[r(1+r)^n]/[(1+r)^n - 1]. Savings = Current Total - New Total - Fees.",
};
