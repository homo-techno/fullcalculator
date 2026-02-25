import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const marriageTaxPenaltyCalculator: CalculatorDefinition = {
  slug: "marriage-tax-penalty-calculator",
  title: "Marriage Tax Penalty Calculator",
  description:
    "Free marriage tax penalty calculator. Compare your tax as a married couple vs two single filers to see if marriage creates a tax penalty or bonus.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "marriage tax penalty",
    "marriage penalty calculator",
    "marriage tax bonus",
    "married vs single tax",
    "wedding tax impact",
  ],
  variants: [
    {
      id: "marriage-penalty",
      name: "Marriage Tax Penalty / Bonus",
      description:
        "Compare tax liability as married filing jointly vs two single filers",
      fields: [
        {
          name: "income1",
          label: "Spouse 1 Income",
          type: "number",
          placeholder: "e.g. 85000",
          prefix: "$",
        },
        {
          name: "income2",
          label: "Spouse 2 Income",
          type: "number",
          placeholder: "e.g. 75000",
          prefix: "$",
        },
        {
          name: "deductions1",
          label: "Spouse 1 Itemized Deductions (0 = standard)",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "deductions2",
          label: "Spouse 2 Itemized Deductions (0 = standard)",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const income1 = inputs.income1 as number;
        const income2 = (inputs.income2 as number) || 0;
        const ded1 = (inputs.deductions1 as number) || 0;
        const ded2 = (inputs.deductions2 as number) || 0;

        if (!income1 || income1 <= 0) return null;

        const singleStd = 15000;
        const marriedStd = 30000;

        const calcTax = (
          income: number,
          brackets: { limit: number; rate: number }[]
        ) => {
          let tax = 0;
          let remaining = income;
          let prevLimit = 0;
          for (const bracket of brackets) {
            const taxable = Math.min(remaining, bracket.limit - prevLimit);
            if (taxable <= 0) break;
            tax += taxable * bracket.rate;
            remaining -= taxable;
            prevLimit = bracket.limit;
          }
          return tax;
        };

        const singleBrackets = [
          { limit: 11600, rate: 0.1 },
          { limit: 47150, rate: 0.12 },
          { limit: 100525, rate: 0.22 },
          { limit: 191950, rate: 0.24 },
          { limit: 243725, rate: 0.32 },
          { limit: 609350, rate: 0.35 },
          { limit: Infinity, rate: 0.37 },
        ];

        const marriedBrackets = [
          { limit: 23200, rate: 0.1 },
          { limit: 94300, rate: 0.12 },
          { limit: 201050, rate: 0.22 },
          { limit: 383900, rate: 0.24 },
          { limit: 487450, rate: 0.32 },
          { limit: 731200, rate: 0.35 },
          { limit: Infinity, rate: 0.37 },
        ];

        const taxable1 = Math.max(0, income1 - Math.max(ded1, singleStd));
        const taxable2 = Math.max(0, income2 - Math.max(ded2, singleStd));
        const singleTax1 = calcTax(taxable1, singleBrackets);
        const singleTax2 = calcTax(taxable2, singleBrackets);
        const totalSingleTax = singleTax1 + singleTax2;

        const combinedIncome = income1 + income2;
        const marriedDeductions = Math.max(ded1 + ded2, marriedStd);
        const marriedTaxable = Math.max(0, combinedIncome - marriedDeductions);
        const marriedTax = calcTax(marriedTaxable, marriedBrackets);

        const difference = marriedTax - totalSingleTax;
        const isPenalty = difference > 0;

        return {
          primary: {
            label: isPenalty ? "Marriage Tax Penalty" : "Marriage Tax Bonus",
            value: `$${formatNumber(Math.abs(difference))}`,
          },
          details: [
            {
              label: "Tax as two single filers",
              value: `$${formatNumber(totalSingleTax)}`,
            },
            {
              label: "Tax as married filing jointly",
              value: `$${formatNumber(marriedTax)}`,
            },
            {
              label: "Difference",
              value: `${isPenalty ? "+$" : "-$"}${formatNumber(Math.abs(difference))}`,
            },
            {
              label: "Spouse 1 single tax",
              value: `$${formatNumber(singleTax1)}`,
            },
            {
              label: "Spouse 2 single tax",
              value: `$${formatNumber(singleTax2)}`,
            },
            {
              label: "Combined income",
              value: `$${formatNumber(combinedIncome)}`,
            },
          ],
          note: isPenalty
            ? "You have a marriage penalty. This commonly occurs when both spouses have similar incomes. Consider consulting a tax professional about strategies like filing separately."
            : "You have a marriage bonus! This commonly occurs when one spouse earns significantly more than the other, as the higher earner benefits from wider married brackets.",
        };
      },
    },
  ],
  relatedSlugs: [
    "tax-calculator",
    "paycheck-calculator",
    "standard-vs-itemized-calculator",
  ],
  faq: [
    {
      question: "What is the marriage tax penalty?",
      answer:
        "The marriage tax penalty occurs when a married couple pays more in taxes filing jointly than they would as two single filers. This typically happens when both spouses have similar incomes because the married brackets are not exactly double the single brackets at higher levels.",
    },
    {
      question: "When does a marriage tax bonus occur?",
      answer:
        "A marriage tax bonus occurs when one spouse earns significantly more than the other. The higher earner benefits from the wider married brackets, resulting in lower combined taxes than filing as two singles.",
    },
  ],
  formula:
    "Marriage Penalty/Bonus = Married Joint Tax - (Single Tax Spouse 1 + Single Tax Spouse 2)",
};
