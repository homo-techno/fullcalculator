import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bonusTaxCalculator: CalculatorDefinition = {
  slug: "bonus-tax-calculator",
  title: "Bonus Tax Calculator",
  description:
    "Free bonus tax calculator. Calculate how much of your bonus is withheld for taxes using the federal flat supplemental rate (22%) or aggregate method. See your net bonus.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "bonus tax calculator",
    "bonus withholding calculator",
    "how much tax on bonus",
    "bonus tax rate",
    "supplemental wage tax",
  ],
  variants: [
    {
      id: "flat-rate",
      name: "Flat Rate Method",
      description: "Calculate bonus withholding using the flat supplemental rate",
      fields: [
        {
          name: "bonusAmount",
          label: "Bonus Amount",
          type: "number",
          placeholder: "e.g. 10000",
          prefix: "$",
          min: 0,
        },
        {
          name: "stateRate",
          label: "State Tax Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          min: 0,
          max: 15,
          step: 0.1,
          defaultValue: 5,
        },
      ],
      calculate: (inputs) => {
        const bonus = inputs.bonusAmount as number;
        const stateRate = (inputs.stateRate as number) ?? 5;
        if (!bonus) return null;

        // Federal flat supplemental rate
        let federalRate: number;
        let federalTax: number;
        if (bonus <= 1000000) {
          federalRate = 0.22;
          federalTax = bonus * 0.22;
        } else {
          // 22% on first $1M, 37% on amount over $1M
          federalTax = 1000000 * 0.22 + (bonus - 1000000) * 0.37;
          federalRate = federalTax / bonus;
        }

        // FICA on bonus
        const socialSecurity = Math.min(bonus, 168600) * 0.062;
        const medicare = bonus * 0.0145;
        const fica = socialSecurity + medicare;

        // State tax
        const stateTax = bonus * (stateRate / 100);

        const totalWithheld = federalTax + fica + stateTax;
        const netBonus = bonus - totalWithheld;
        const effectiveRate = (totalWithheld / bonus) * 100;

        return {
          primary: {
            label: "Net Bonus (After Withholding)",
            value: `$${formatNumber(netBonus)}`,
          },
          details: [
            { label: "Gross bonus", value: `$${formatNumber(bonus)}` },
            { label: "Federal withholding (22%)", value: `$${formatNumber(federalTax)}` },
            { label: "Social Security (6.2%)", value: `$${formatNumber(socialSecurity)}` },
            { label: "Medicare (1.45%)", value: `$${formatNumber(medicare)}` },
            { label: "State tax", value: `$${formatNumber(stateTax)}` },
            { label: "Total withheld", value: `$${formatNumber(totalWithheld)}` },
            { label: "Effective withholding rate", value: `${formatNumber(effectiveRate, 1)}%` },
          ],
          note: "The flat 22% rate applies to bonuses up to $1 million. Amounts over $1M are withheld at 37%. Actual tax owed may differ; reconciled at filing.",
        };
      },
    },
    {
      id: "aggregate",
      name: "Aggregate Method Estimate",
      description: "Estimate withholding if your employer uses the aggregate method",
      fields: [
        {
          name: "bonusAmount",
          label: "Bonus Amount",
          type: "number",
          placeholder: "e.g. 10000",
          prefix: "$",
          min: 0,
        },
        {
          name: "annualSalary",
          label: "Annual Base Salary",
          type: "number",
          placeholder: "e.g. 75000",
          prefix: "$",
          min: 0,
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
          ],
          defaultValue: "single",
        },
      ],
      calculate: (inputs) => {
        const bonus = inputs.bonusAmount as number;
        const salary = inputs.annualSalary as number;
        const status = inputs.filingStatus as string;
        if (!bonus || !salary) return null;

        // Simplified aggregate method: calculate marginal rate on salary + bonus
        const brackets: Record<string, { limit: number; rate: number }[]> = {
          single: [
            { limit: 11600, rate: 0.10 }, { limit: 47150, rate: 0.12 },
            { limit: 100525, rate: 0.22 }, { limit: 191950, rate: 0.24 },
            { limit: 243725, rate: 0.32 }, { limit: 609350, rate: 0.35 },
            { limit: Infinity, rate: 0.37 },
          ],
          married: [
            { limit: 23200, rate: 0.10 }, { limit: 94300, rate: 0.12 },
            { limit: 201050, rate: 0.22 }, { limit: 383900, rate: 0.24 },
            { limit: 487450, rate: 0.32 }, { limit: 731200, rate: 0.35 },
            { limit: Infinity, rate: 0.37 },
          ],
        };

        const deduction = status === "married" ? 29200 : 14600;
        const taxableSalary = Math.max(0, salary - deduction);
        const taxableWithBonus = Math.max(0, salary + bonus - deduction);

        const calcTax = (income: number) => {
          let tax = 0;
          let remaining = income;
          let prevLimit = 0;
          for (const b of brackets[status] || brackets.single) {
            const taxable = Math.min(remaining, b.limit - prevLimit);
            if (taxable <= 0) break;
            tax += taxable * b.rate;
            remaining -= taxable;
            prevLimit = b.limit;
          }
          return tax;
        };

        const taxWithoutBonus = calcTax(taxableSalary);
        const taxWithBonus = calcTax(taxableWithBonus);
        const marginalTaxOnBonus = taxWithBonus - taxWithoutBonus;
        const marginalRate = (marginalTaxOnBonus / bonus) * 100;

        // Compare to flat rate
        const flatRateTax = bonus * 0.22;
        const difference = marginalTaxOnBonus - flatRateTax;

        return {
          primary: {
            label: "Estimated Tax on Bonus (Aggregate)",
            value: `$${formatNumber(marginalTaxOnBonus)}`,
          },
          details: [
            { label: "Bonus amount", value: `$${formatNumber(bonus)}` },
            { label: "Effective marginal rate", value: `${formatNumber(marginalRate, 1)}%` },
            { label: "Flat method (22%) would be", value: `$${formatNumber(flatRateTax)}` },
            { label: "Difference", value: `$${formatNumber(Math.abs(difference))} ${difference > 0 ? "more" : "less"}` },
            { label: "Tax on salary alone", value: `$${formatNumber(taxWithoutBonus)}` },
            { label: "Tax on salary + bonus", value: `$${formatNumber(taxWithBonus)}` },
          ],
          note: "The aggregate method treats the bonus as regular income for the pay period. Withholding may be higher or lower than the flat 22% method. Any difference is reconciled when filing your tax return.",
        };
      },
    },
  ],
  relatedSlugs: ["tax-calculator", "take-home-pay-calculator", "salary-calculator"],
  faq: [
    {
      question: "Are bonuses taxed at 22%?",
      answer:
        "Bonuses are withheld at a flat 22% for federal income tax if your employer uses the percentage method (most common for separate bonus checks). However, the actual tax owed depends on your total annual income and tax bracket. Any over- or under-withholding is reconciled on your tax return.",
    },
    {
      question: "What is the difference between flat rate and aggregate bonus tax?",
      answer:
        "The flat rate method withholds 22% of the bonus (simple). The aggregate method combines the bonus with your regular paycheck and calculates withholding on the total, which can result in higher withholding if it temporarily pushes you into a higher bracket.",
    },
    {
      question: "How are bonuses over $1 million taxed?",
      answer:
        "For bonuses exceeding $1 million, the first $1 million is withheld at 22% and the amount above $1 million is withheld at 37% (the top federal rate). This is just withholding; actual tax owed depends on your total income.",
    },
  ],
  formula:
    "Flat Method: Federal Withholding = Bonus × 22% (up to $1M), 37% above $1M. FICA = 6.2% SS + 1.45% Medicare. Net Bonus = Gross - All Withholdings.",
};
