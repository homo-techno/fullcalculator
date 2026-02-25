import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rothConversionCalculator: CalculatorDefinition = {
  slug: "roth-conversion-calculator",
  title: "Roth Conversion Calculator",
  description:
    "Free Roth conversion calculator. Analyze the tax cost and long-term benefit of converting a traditional IRA to a Roth IRA.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Roth conversion calculator",
    "IRA conversion tax",
    "traditional to Roth",
    "Roth conversion analysis",
    "convert IRA to Roth",
  ],
  variants: [
    {
      id: "roth-conversion",
      name: "Roth Conversion Analysis",
      description:
        "Calculate the tax cost and break-even for converting traditional IRA to Roth",
      fields: [
        {
          name: "conversionAmount",
          label: "Conversion Amount",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
        },
        {
          name: "currentIncome",
          label: "Current Taxable Income (before conversion)",
          type: "number",
          placeholder: "e.g. 80000",
          prefix: "$",
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
            { label: "Head of Household", value: "hoh" },
          ],
          defaultValue: "single",
        },
        {
          name: "yearsUntilRetirement",
          label: "Years Until Retirement",
          type: "number",
          placeholder: "e.g. 20",
          min: 1,
          max: 50,
        },
        {
          name: "expectedReturn",
          label: "Expected Annual Return",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "%",
          defaultValue: 7,
        },
        {
          name: "retirementTaxRate",
          label: "Expected Retirement Tax Rate",
          type: "select",
          options: [
            { label: "10%", value: "10" },
            { label: "12%", value: "12" },
            { label: "22%", value: "22" },
            { label: "24%", value: "24" },
            { label: "32%", value: "32" },
          ],
          defaultValue: "22",
        },
      ],
      calculate: (inputs) => {
        const conversion = inputs.conversionAmount as number;
        const currentIncome = (inputs.currentIncome as number) || 0;
        const status = inputs.filingStatus as string;
        const years = inputs.yearsUntilRetirement as number;
        const returnRate = ((inputs.expectedReturn as number) || 7) / 100;
        const retirementRate =
          (parseInt(inputs.retirementTaxRate as string) || 22) / 100;

        if (!conversion || conversion <= 0 || !years) return null;

        const brackets =
          status === "married"
            ? [
                { limit: 23200, rate: 0.1 },
                { limit: 94300, rate: 0.12 },
                { limit: 201050, rate: 0.22 },
                { limit: 383900, rate: 0.24 },
                { limit: 487450, rate: 0.32 },
                { limit: 731200, rate: 0.35 },
                { limit: Infinity, rate: 0.37 },
              ]
            : [
                { limit: 11600, rate: 0.1 },
                { limit: 47150, rate: 0.12 },
                { limit: 100525, rate: 0.22 },
                { limit: 191950, rate: 0.24 },
                { limit: 243725, rate: 0.32 },
                { limit: 609350, rate: 0.35 },
                { limit: Infinity, rate: 0.37 },
              ];

        const calcTax = (taxableIncome: number) => {
          let tax = 0;
          let rem = taxableIncome;
          let prev = 0;
          for (const b of brackets) {
            const t = Math.min(rem, b.limit - prev);
            if (t <= 0) break;
            tax += t * b.rate;
            rem -= t;
            prev = b.limit;
          }
          return tax;
        };

        const standardDeduction = status === "married" ? 30000 : 15000;
        const taxableWithout = Math.max(0, currentIncome - standardDeduction);
        const taxableWith = Math.max(
          0,
          currentIncome + conversion - standardDeduction
        );

        const taxWithout = calcTax(taxableWithout);
        const taxWith = calcTax(taxableWith);
        const conversionTax = taxWith - taxWithout;
        const effectiveConversionRate = (conversionTax / conversion) * 100;

        // Future value comparison
        const futureValue = conversion * Math.pow(1 + returnRate, years);
        const rothValue = futureValue; // Tax-free in retirement
        const traditionalAfterTax = futureValue * (1 - retirementRate);
        const rothAdvantage = rothValue - traditionalAfterTax - conversionTax;

        // Break-even
        const breakEvenYears =
          retirementRate > effectiveConversionRate / 100
            ? Math.log(conversionTax / (conversion * (retirementRate - effectiveConversionRate / 100))) / Math.log(1 + returnRate)
            : Infinity;

        return {
          primary: {
            label: "Tax Cost of Conversion",
            value: `$${formatNumber(conversionTax)}`,
          },
          details: [
            {
              label: "Effective conversion tax rate",
              value: `${formatNumber(effectiveConversionRate)}%`,
            },
            {
              label: `Roth value in ${years} years (tax-free)`,
              value: `$${formatNumber(rothValue)}`,
            },
            {
              label: `Traditional value (after ${(retirementRate * 100).toFixed(0)}% tax)`,
              value: `$${formatNumber(traditionalAfterTax)}`,
            },
            {
              label: "Net Roth advantage",
              value: `$${formatNumber(rothAdvantage)}`,
            },
            {
              label: "Break-even period",
              value:
                breakEvenYears === Infinity || breakEvenYears < 0
                  ? "Immediate benefit"
                  : `~${Math.ceil(breakEvenYears)} years`,
            },
            {
              label: "Conversion recommended",
              value: rothAdvantage > 0 ? "Yes" : "Likely not at these rates",
            },
          ],
          note: "Roth conversions are most beneficial when your current tax rate is lower than your expected retirement rate, or when you have a long time horizon. The conversion amount is added to your taxable income in the year of conversion.",
        };
      },
    },
  ],
  relatedSlugs: [
    "backdoor-roth-calculator",
    "inherited-ira-rmd-calculator",
    "retirement-calculator",
  ],
  faq: [
    {
      question: "Should I convert my traditional IRA to a Roth?",
      answer:
        "A Roth conversion makes sense if you expect your tax rate to be higher in retirement, have a long time horizon, can pay the conversion tax from non-IRA funds, or want to eliminate RMDs. It generally does not make sense if you will be in a lower bracket in retirement.",
    },
    {
      question: "Can I undo a Roth conversion?",
      answer:
        "No. Since 2018 (Tax Cuts and Jobs Act), Roth conversions are irrevocable. Previously you could recharacterize a conversion, but this is no longer allowed. Plan carefully before converting.",
    },
  ],
  formula:
    "Conversion Tax = Tax(income + conversion) - Tax(income); Roth Advantage = Future Value - Traditional After-Tax Value - Conversion Tax",
};
