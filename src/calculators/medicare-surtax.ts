import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const medicareSurtaxCalculator: CalculatorDefinition = {
  slug: "medicare-surtax-calculator",
  title: "Medicare Surtax Calculator",
  description:
    "Free Medicare surtax calculator. Calculate your regular Medicare tax and the Additional Medicare Tax (0.9% surtax) on high incomes, plus the Net Investment Income Tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Medicare surtax",
    "additional Medicare tax",
    "NIIT calculator",
    "net investment income tax",
    "Medicare 0.9%",
  ],
  variants: [
    {
      id: "medicare-surtax",
      name: "Medicare & NIIT Surtax Estimator",
      description:
        "Calculate regular Medicare tax, Additional Medicare Tax, and Net Investment Income Tax",
      fields: [
        {
          name: "wagesIncome",
          label: "Wages / Self-Employment Income",
          type: "number",
          placeholder: "e.g. 250000",
          prefix: "$",
        },
        {
          name: "investmentIncome",
          label: "Net Investment Income",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
            { label: "Married Filing Separately", value: "mfs" },
          ],
          defaultValue: "single",
        },
        {
          name: "selfEmployed",
          label: "Self-Employed?",
          type: "select",
          options: [
            { label: "No (W-2 Employee)", value: "no" },
            { label: "Yes", value: "yes" },
          ],
          defaultValue: "no",
        },
      ],
      calculate: (inputs) => {
        const wages = inputs.wagesIncome as number;
        const investmentIncome = (inputs.investmentIncome as number) || 0;
        const status = inputs.filingStatus as string;
        const selfEmployed = inputs.selfEmployed === "yes";

        if (!wages || wages <= 0) return null;

        const medicareThreshold =
          status === "married"
            ? 250000
            : status === "mfs"
              ? 125000
              : 200000;

        const niitThreshold = medicareThreshold;

        // Regular Medicare
        const regularMedicareRate = selfEmployed ? 0.029 : 0.0145;
        const taxableWages = selfEmployed ? wages * 0.9235 : wages;
        const regularMedicare = taxableWages * regularMedicareRate;

        // Additional Medicare Tax (0.9% on wages above threshold)
        const excessWages = Math.max(0, wages - medicareThreshold);
        const additionalMedicare = excessWages * 0.009;

        // Net Investment Income Tax (3.8%)
        const magi = wages + investmentIncome;
        const niitBase = Math.min(
          investmentIncome,
          Math.max(0, magi - niitThreshold)
        );
        const niit = niitBase * 0.038;

        const totalMedicare = regularMedicare + additionalMedicare;
        const totalSurtaxes = additionalMedicare + niit;
        const totalAll = totalMedicare + niit;

        return {
          primary: {
            label: "Total Medicare & Surtaxes",
            value: `$${formatNumber(totalAll)}`,
          },
          details: [
            {
              label: "Regular Medicare tax",
              value: `$${formatNumber(regularMedicare)}`,
            },
            {
              label: "Additional Medicare Tax (0.9%)",
              value: `$${formatNumber(additionalMedicare)}`,
            },
            {
              label: "Net Investment Income Tax (3.8%)",
              value: `$${formatNumber(niit)}`,
            },
            {
              label: "Total surtaxes above regular",
              value: `$${formatNumber(totalSurtaxes)}`,
            },
            {
              label: "Surtax threshold",
              value: `$${formatNumber(medicareThreshold)}`,
            },
            {
              label: "Wages above threshold",
              value: `$${formatNumber(excessWages)}`,
            },
          ],
          note: "The Additional Medicare Tax (0.9%) applies to wages above the threshold. The NIIT (3.8%) applies to the lesser of net investment income or MAGI above the threshold. These are in addition to regular Medicare tax.",
        };
      },
    },
  ],
  relatedSlugs: [
    "social-security-tax-calculator",
    "tax-calculator",
    "paycheck-calculator",
  ],
  faq: [
    {
      question: "What is the Additional Medicare Tax?",
      answer:
        "The Additional Medicare Tax is a 0.9% surtax on wages exceeding $200,000 (single) or $250,000 (married filing jointly). Unlike regular Medicare tax, there is no employer match for this surtax.",
    },
    {
      question: "What is the Net Investment Income Tax (NIIT)?",
      answer:
        "The NIIT is a 3.8% tax on the lesser of your net investment income or the amount your MAGI exceeds the threshold ($200,000 single / $250,000 married). Investment income includes capital gains, dividends, interest, rents, and royalties.",
    },
  ],
  formula:
    "Additional Medicare = 0.9% x (wages - threshold); NIIT = 3.8% x min(investment income, MAGI - threshold)",
};
