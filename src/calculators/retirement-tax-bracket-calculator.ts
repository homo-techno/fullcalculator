import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retirementTaxBracketCalculator: CalculatorDefinition = {
  slug: "retirement-tax-bracket-calculator",
  title: "Retirement Tax Bracket Calculator",
  description: "Determine which federal tax bracket you will fall into during retirement based on combined income from Social Security, pensions, withdrawals, and other sources.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["retirement tax bracket","tax bracket in retirement","retirement federal tax","retired tax rate"],
  variants: [{
    id: "standard",
    name: "Retirement Tax Bracket",
    description: "Determine which federal tax bracket you will fall into during retirement based on combined income from Social Security, pensions, withdrawals, and other sources.",
    fields: [
      { name: "socialSecurity", label: "Annual Social Security ($)", type: "number", min: 0, max: 100000, defaultValue: 24000 },
      { name: "pensionIncome", label: "Annual Pension ($)", type: "number", min: 0, max: 200000, defaultValue: 15000 },
      { name: "withdrawals", label: "Annual IRA/401k Withdrawals ($)", type: "number", min: 0, max: 500000, defaultValue: 25000 },
      { name: "otherIncome", label: "Other Taxable Income ($)", type: "number", min: 0, max: 500000, defaultValue: 5000 },
      { name: "filingStatus", label: "Filing Status", type: "select", options: [{ value: "1", label: "Single" }, { value: "2", label: "Married Filing Jointly" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const ss = inputs.socialSecurity as number;
    const pension = inputs.pensionIncome as number;
    const withdrawals = inputs.withdrawals as number;
    const other = inputs.otherIncome as number;
    const status = parseInt(inputs.filingStatus as string);
    const provisionalIncome = ss * 0.5 + pension + withdrawals + other;
    const ssThreshold = status === 2 ? 44000 : 34000;
    const taxableSS = provisionalIncome > ssThreshold ? ss * 0.85 : provisionalIncome > (status === 2 ? 32000 : 25000) ? ss * 0.5 : 0;
    const standardDeduction = status === 2 ? 30000 : 15000;
    const totalIncome = taxableSS + pension + withdrawals + other;
    const taxableIncome = Math.max(0, totalIncome - standardDeduction);
    const brackets = status === 2
      ? [[23200, 0.10], [94300 - 23200, 0.12], [201050 - 94300, 0.22], [383900 - 201050, 0.24], [487450 - 383900, 0.32], [731200 - 487450, 0.35], [Infinity, 0.37]]
      : [[11600, 0.10], [47150 - 11600, 0.12], [100525 - 47150, 0.22], [191950 - 100525, 0.24], [243725 - 191950, 0.32], [609350 - 243725, 0.35], [Infinity, 0.37]];
    let tax = 0;
    let remaining = taxableIncome;
    let topRate = 0;
    for (const [width, rate] of brackets) {
      if (remaining <= 0) break;
      const taxable = Math.min(remaining, width);
      tax += taxable * rate;
      remaining -= taxable;
      topRate = rate;
    }
    const effectiveRate = totalIncome > 0 ? (tax / totalIncome) * 100 : 0;
    return {
      primary: { label: "Marginal Tax Bracket", value: formatNumber(topRate * 100) + "%" },
      details: [
        { label: "Estimated Federal Tax", value: "$" + formatNumber(Math.round(tax)) },
        { label: "Effective Tax Rate", value: formatNumber(Math.round(effectiveRate * 10) / 10) + "%" },
        { label: "Taxable Income", value: "$" + formatNumber(Math.round(taxableIncome)) },
        { label: "Taxable Social Security", value: "$" + formatNumber(Math.round(taxableSS)) },
        { label: "After-Tax Income", value: "$" + formatNumber(Math.round(totalIncome - tax)) }
      ]
    };
  },
  }],
  relatedSlugs: ["retirement-tax-calculator","retirement-income-gap-calculator"],
  faq: [
    { question: "How is Social Security taxed in retirement?", answer: "Up to 85 percent of Social Security benefits may be taxable depending on your provisional income. If provisional income exceeds $25,000 for singles or $32,000 for married couples, a portion of benefits becomes taxable." },
    { question: "What is the standard deduction for retirees?", answer: "Retirees 65 and older receive an additional standard deduction of $1,950 for single filers or $1,550 per spouse for married filers, on top of the regular standard deduction." },
    { question: "Can I reduce my tax bracket in retirement?", answer: "Strategies include Roth conversions in lower-income years, timing IRA withdrawals, managing capital gains, taking advantage of the higher standard deduction for those over 65, and choosing tax-efficient withdrawal sequencing." },
  ],
  formula: "Provisional Income = 50% of SS + Pension + Withdrawals + Other; Taxable Income = Total Income - Standard Deduction; Tax = Sum of (Income in each bracket x bracket rate)",
};
