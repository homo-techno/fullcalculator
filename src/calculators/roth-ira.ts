import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rothIraCalculator: CalculatorDefinition = {
  slug: "roth-ira-calculator",
  title: "Roth IRA Calculator",
  description:
    "Free Roth IRA calculator. Estimate tax-free retirement growth with annual contributions up to the $7,000 limit.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["roth ira", "ira", "tax-free", "retirement", "contribution limit"],
  variants: [
    {
      id: "growth",
      name: "Roth IRA Growth",
      fields: [
        { name: "currentBalance", label: "Current Balance ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "annualContribution", label: "Annual Contribution ($)", type: "number", placeholder: "e.g. 7000" },
        { name: "years", label: "Years to Grow", type: "number", placeholder: "e.g. 30" },
        { name: "returnRate", label: "Expected Annual Return (%)", type: "number", placeholder: "e.g. 7" },
      ],
      calculate: (inputs) => {
        const currentBalance = inputs.currentBalance as number || 0;
        const annualContribution = inputs.annualContribution as number;
        const years = inputs.years as number;
        const returnRate = inputs.returnRate as number;

        if (!annualContribution || !years || !returnRate) return null;

        const maxContribution = 7000;
        const effectiveContribution = Math.min(annualContribution, maxContribution);
        const r = returnRate / 100;

        let balance = currentBalance;
        for (let i = 0; i < years; i++) {
          balance = (balance + effectiveContribution) * (1 + r);
        }

        const totalContributions = effectiveContribution * years + currentBalance;
        const taxFreeGrowth = balance - totalContributions;

        return {
          primary: { label: "Future Value (Tax-Free)", value: `$${formatNumber(balance, 2)}` },
          details: [
            { label: "Total Contributions", value: `$${formatNumber(totalContributions, 2)}` },
            { label: "Tax-Free Growth", value: `$${formatNumber(taxFreeGrowth, 2)}` },
            { label: "Effective Annual Contribution", value: `$${formatNumber(effectiveContribution, 2)}` },
            { label: "Contribution Capped", value: annualContribution > maxContribution ? "Yes (max $7,000/year)" : "No" },
          ],
        };
      },
    },
    {
      id: "comparison",
      name: "Roth vs Traditional",
      fields: [
        { name: "annualContribution", label: "Annual Contribution ($)", type: "number", placeholder: "e.g. 7000" },
        { name: "years", label: "Years to Grow", type: "number", placeholder: "e.g. 30" },
        { name: "returnRate", label: "Expected Annual Return (%)", type: "number", placeholder: "e.g. 7" },
        { name: "currentTaxRate", label: "Current Tax Rate (%)", type: "number", placeholder: "e.g. 24" },
        { name: "retirementTaxRate", label: "Retirement Tax Rate (%)", type: "number", placeholder: "e.g. 22" },
      ],
      calculate: (inputs) => {
        const annualContribution = inputs.annualContribution as number;
        const years = inputs.years as number;
        const returnRate = inputs.returnRate as number;
        const currentTaxRate = inputs.currentTaxRate as number;
        const retirementTaxRate = inputs.retirementTaxRate as number;

        if (!annualContribution || !years || !returnRate || !currentTaxRate || !retirementTaxRate) return null;

        const r = returnRate / 100;
        const effectiveContribution = Math.min(annualContribution, 7000);

        // Roth: contribute after-tax, withdraw tax-free
        let rothBalance = 0;
        for (let i = 0; i < years; i++) {
          rothBalance = (rothBalance + effectiveContribution) * (1 + r);
        }
        const rothAfterTax = rothBalance;

        // Traditional: contribute pre-tax (more upfront), pay tax on withdrawal
        const traditionalContribution = effectiveContribution / (1 - currentTaxRate / 100);
        const cappedTraditional = Math.min(traditionalContribution, effectiveContribution);
        let traditionalBalance = 0;
        for (let i = 0; i < years; i++) {
          traditionalBalance = (traditionalBalance + effectiveContribution) * (1 + r);
        }
        const traditionalAfterTax = traditionalBalance * (1 - retirementTaxRate / 100);

        return {
          primary: { label: "Roth IRA (after tax)", value: `$${formatNumber(rothAfterTax, 2)}` },
          details: [
            { label: "Traditional IRA (before tax)", value: `$${formatNumber(traditionalBalance, 2)}` },
            { label: "Traditional IRA (after tax)", value: `$${formatNumber(traditionalAfterTax, 2)}` },
            { label: "Roth Advantage", value: `$${formatNumber(rothAfterTax - traditionalAfterTax, 2)}` },
            { label: "Recommendation", value: rothAfterTax > traditionalAfterTax ? "Roth IRA is better" : "Traditional IRA is better" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["401k-calculator", "tax-bracket-calculator", "future-value-calculator"],
  faq: [
    { question: "What is the Roth IRA contribution limit?", answer: "For 2024, the Roth IRA contribution limit is $7,000 per year ($8,000 if age 50+). Income limits may reduce or eliminate your ability to contribute." },
    { question: "Why is a Roth IRA tax-free?", answer: "Roth IRA contributions are made with after-tax dollars, so qualified withdrawals in retirement are completely tax-free, including all investment gains." },
  ],
  formula: "FV = Σ (Balance + Annual Contribution) × (1 + r) for each year. Growth is tax-free.",
};
