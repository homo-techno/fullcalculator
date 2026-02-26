import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const earnedIncomeCreditCalculator: CalculatorDefinition = {
  slug: "earned-income-credit-calculator",
  title: "Earned Income Tax Credit (EITC) Calculator",
  description:
    "Free EITC calculator. Estimate your Earned Income Tax Credit based on your filing status, earned income, and number of qualifying children.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "eitc calculator",
    "earned income tax credit",
    "earned income credit",
    "eic calculator",
    "eitc 2024",
  ],
  variants: [
    {
      id: "standard",
      name: "EITC Estimator",
      description:
        "Estimate your Earned Income Tax Credit based on income and family size",
      fields: [
        {
          name: "earnedIncome",
          label: "Earned Income",
          type: "number",
          placeholder: "e.g. 35000",
          prefix: "$",
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single / Head of Household", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
          ],
          defaultValue: "single",
        },
        {
          name: "numChildren",
          label: "Number of Qualifying Children",
          type: "select",
          options: [
            { label: "0 Children", value: "0" },
            { label: "1 Child", value: "1" },
            { label: "2 Children", value: "2" },
            { label: "3 or More Children", value: "3" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const income = parseFloat(inputs.earnedIncome as string);
        const status = inputs.filingStatus as string;
        const children = parseInt(inputs.numChildren as string, 10);
        if (!income || income <= 0) return null;

        const params: Record<string, { rate: number; maxIncome: number; plateauStart: number; phaseOutRate: number; phaseOutStartSingle: number; phaseOutStartMarried: number; maxCredit: number }> = {
          "0": { rate: 0.0765, maxIncome: 7840, plateauStart: 7840, phaseOutRate: 0.0765, phaseOutStartSingle: 9800, phaseOutStartMarried: 16370, maxCredit: 600 },
          "1": { rate: 0.34, maxIncome: 11750, plateauStart: 11750, phaseOutRate: 0.1598, phaseOutStartSingle: 20600, phaseOutStartMarried: 27380, maxCredit: 3995 },
          "2": { rate: 0.40, maxIncome: 16510, plateauStart: 16510, phaseOutRate: 0.2106, phaseOutStartSingle: 20600, phaseOutStartMarried: 27380, maxCredit: 6604 },
          "3": { rate: 0.45, maxIncome: 16510, plateauStart: 16510, phaseOutRate: 0.2106, phaseOutStartSingle: 20600, phaseOutStartMarried: 27380, maxCredit: 7430 },
        };

        const p = params[String(children)] || params["0"];
        const phaseOutStart = status === "married" ? p.phaseOutStartMarried : p.phaseOutStartSingle;

        let credit: number;
        if (income <= p.maxIncome) {
          credit = Math.min(income * p.rate, p.maxCredit);
        } else if (income <= phaseOutStart) {
          credit = p.maxCredit;
        } else {
          credit = Math.max(0, p.maxCredit - (income - phaseOutStart) * p.phaseOutRate);
        }

        credit = Math.round(credit);

        const incomeLimit =
          status === "married"
            ? children === 3 ? 63398 : children === 2 ? 61555 : children === 1 ? 52533 : 23885
            : children === 3 ? 56838 : children === 2 ? 55768 : children === 1 ? 46560 : 17640;

        return {
          primary: { label: "Estimated EITC", value: `$${formatNumber(credit)}` },
          details: [
            { label: "Earned income", value: `$${formatNumber(income)}` },
            { label: "Maximum credit for your situation", value: `$${formatNumber(p.maxCredit)}` },
            { label: "Phase-out begins at", value: `$${formatNumber(phaseOutStart)}` },
            { label: "Income limit for any credit", value: `$${formatNumber(incomeLimit)}` },
            { label: "Credit rate", value: `${formatNumber(p.rate * 100)}%` },
          ],
          note: "The EITC is a fully refundable credit. Investment income must be $11,600 or less. You must file a tax return to claim it even if you owe no tax.",
        };
      },
    },
  ],
  relatedSlugs: ["tax-calculator", "child-tax-credit-calculator", "agi-calculator"],
  faq: [
    {
      question: "What is the Earned Income Tax Credit?",
      answer:
        "The EITC is a refundable federal tax credit for low-to-moderate income workers. The credit amount depends on your earned income, filing status, and number of qualifying children. For 2024, the maximum credit ranges from $600 (no children) to $7,430 (3+ children).",
    },
    {
      question: "Who qualifies for the EITC?",
      answer:
        "You must have earned income (wages, self-employment), meet income limits, have a valid SSN, be a U.S. citizen or resident alien, not file as married filing separately, and have investment income of $11,600 or less. Age requirements apply if you have no qualifying children (25-64).",
    },
    {
      question: "Is the EITC refundable?",
      answer:
        "Yes, the EITC is fully refundable. If the credit exceeds your tax liability, you receive the difference as a refund. You must file a tax return to claim it, even if you have no filing requirement.",
    },
  ],
  formula:
    "EITC = min(earned income x credit rate, max credit) during phase-in; max credit on plateau; max(0, max credit - (income - phase-out start) x phase-out rate) during phase-out",
};
