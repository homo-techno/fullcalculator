import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retirementWithdrawalSequencingCalculator: CalculatorDefinition = {
  slug: "retirement-withdrawal-sequencing-calculator",
  title: "Retirement Withdrawal Sequencing Calculator",
  description: "Optimize the order of withdrawals from taxable, tax-deferred, and tax-free retirement accounts to minimize lifetime taxes paid.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["withdrawal sequencing","retirement withdrawal order","tax-efficient withdrawal","account withdrawal strategy"],
  variants: [{
    id: "standard",
    name: "Retirement Withdrawal Sequencing",
    description: "Optimize the order of withdrawals from taxable, tax-deferred, and tax-free retirement accounts to minimize lifetime taxes paid.",
    fields: [
      { name: "taxableBalance", label: "Taxable Account Balance ($)", type: "number", min: 0, max: 20000000, defaultValue: 200000 },
      { name: "traditionalBalance", label: "Traditional IRA/401k Balance ($)", type: "number", min: 0, max: 20000000, defaultValue: 500000 },
      { name: "rothBalance", label: "Roth IRA Balance ($)", type: "number", min: 0, max: 20000000, defaultValue: 150000 },
      { name: "annualNeed", label: "Annual Withdrawal Need ($)", type: "number", min: 10000, max: 500000, defaultValue: 60000 },
      { name: "taxRate", label: "Current Marginal Tax Rate (%)", type: "number", min: 10, max: 40, defaultValue: 22 },
      { name: "capitalGainsRate", label: "Capital Gains Tax Rate (%)", type: "number", min: 0, max: 25, defaultValue: 15 },
    ],
    calculate: (inputs) => {
    const taxable = inputs.taxableBalance as number;
    const traditional = inputs.traditionalBalance as number;
    const roth = inputs.rothBalance as number;
    const need = inputs.annualNeed as number;
    const taxRate = inputs.taxRate as number / 100;
    const cgRate = inputs.capitalGainsRate as number / 100;
    const totalAssets = taxable + traditional + roth;
    const taxFromTaxable = need * cgRate * 0.5;
    const taxFromTraditional = need * taxRate;
    const taxFromRoth = 0;
    const conventionalTax = taxFromTaxable;
    const taxableFirst = Math.min(need, taxable);
    const traditionalNext = Math.min(need - taxableFirst, traditional);
    const rothLast = Math.min(need - taxableFirst - traditionalNext, roth);
    const optimizedTax = taxableFirst * cgRate * 0.5 + traditionalNext * taxRate;
    const yearsOfWithdrawals = need > 0 ? Math.floor(totalAssets / need) : 0;
    return {
      primary: { label: "Tax on Optimal Withdrawal", value: "$" + formatNumber(Math.round(optimizedTax)) },
      details: [
        { label: "From Taxable Account", value: "$" + formatNumber(Math.round(taxableFirst)) + " (tax: $" + formatNumber(Math.round(taxableFirst * cgRate * 0.5)) + ")" },
        { label: "From Traditional IRA/401k", value: "$" + formatNumber(Math.round(traditionalNext)) + " (tax: $" + formatNumber(Math.round(traditionalNext * taxRate)) + ")" },
        { label: "From Roth IRA", value: "$" + formatNumber(Math.round(rothLast)) + " (tax: $0)" },
        { label: "If All From Traditional", value: "Tax: $" + formatNumber(Math.round(taxFromTraditional)) },
        { label: "Total Assets / Years Coverage", value: "$" + formatNumber(Math.round(totalAssets)) + " / " + formatNumber(yearsOfWithdrawals) + " years" }
      ]
    };
  },
  }],
  relatedSlugs: ["roth-conversion-ladder-calculator","retirement-tax-bracket-calculator"],
  faq: [
    { question: "What is the optimal withdrawal order in retirement?", answer: "The conventional approach is to withdraw from taxable accounts first, then tax-deferred accounts, and finally Roth accounts. This allows tax-free Roth assets to grow the longest. However, the optimal order depends on your specific tax situation and may vary year to year." },
    { question: "Why should I consider Roth withdrawals last?", answer: "Roth withdrawals are tax-free and do not count as income for Social Security taxation or Medicare IRMAA purposes. By letting your Roth grow tax-free as long as possible, you maximize the compounding benefit and preserve a tax-free resource for higher-income years." },
    { question: "When might I deviate from the standard withdrawal order?", answer: "Deviating may make sense when you have a low-income year where traditional withdrawals would be taxed at low rates, when you need to manage your tax bracket for IRMAA or Social Security purposes, or when you want to perform partial Roth conversions." },
  ],
  formula: "Conventional Order: Taxable first, then Traditional, then Roth
Tax on Taxable = Withdrawal x Capital Gains Rate x Gain Portion
Tax on Traditional = Withdrawal x Marginal Tax Rate
Tax on Roth = $0",
};
