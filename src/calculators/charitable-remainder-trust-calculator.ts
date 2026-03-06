import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const charitableRemainderTrustCalculator: CalculatorDefinition = {
  slug: "charitable-remainder-trust-calculator",
  title: "Charitable Remainder Trust Calculator",
  description: "Calculate the income stream, tax deduction, and remainder value of a charitable remainder trust (CRT) to plan your philanthropic and tax strategy.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["charitable remainder trust","CRT calculator","charitable trust income","planned giving calculator"],
  variants: [{
    id: "standard",
    name: "Charitable Remainder Trust",
    description: "Calculate the income stream, tax deduction, and remainder value of a charitable remainder trust (CRT) to plan your philanthropic and tax strategy.",
    fields: [
      { name: "assetValue", label: "Asset Value Donated ($)", type: "number", min: 50000, max: 50000000, defaultValue: 500000 },
      { name: "payoutRate", label: "Annual Payout Rate (%)", type: "number", min: 5, max: 50, defaultValue: 7 },
      { name: "trustTerm", label: "Trust Term (Years)", type: "number", min: 5, max: 30, defaultValue: 20 },
      { name: "investmentReturn", label: "Expected Investment Return (%)", type: "number", min: 2, max: 15, defaultValue: 7 },
      { name: "taxRate", label: "Your Marginal Tax Rate (%)", type: "number", min: 10, max: 50, defaultValue: 32 },
    ],
    calculate: (inputs) => {
    const assetVal = inputs.assetValue as number;
    const payoutRate = inputs.payoutRate as number / 100;
    const term = inputs.trustTerm as number;
    const investReturn = inputs.investmentReturn as number / 100;
    const taxRate = inputs.taxRate as number / 100;
    const annualPayout = assetVal * payoutRate;
    const totalPayouts = annualPayout * term;
    let trustBalance = assetVal;
    for (let y = 0; y < term; y++) {
      trustBalance = trustBalance * (1 + investReturn) - annualPayout;
      if (trustBalance < 0) { trustBalance = 0; break; }
    }
    const remainderValue = Math.max(0, trustBalance);
    const remainderPct = assetVal > 0 ? (remainderValue / assetVal) * 100 : 0;
    const estimatedDeduction = assetVal * Math.max(0.10, 1 - payoutRate * term * 0.04);
    const taxSavings = estimatedDeduction * taxRate;
    return {
      primary: { label: "Annual Income from Trust", value: "$" + formatNumber(Math.round(annualPayout)) },
      details: [
        { label: "Monthly Income", value: "$" + formatNumber(Math.round(annualPayout / 12)) },
        { label: "Total Income Over Term", value: "$" + formatNumber(Math.round(totalPayouts)) },
        { label: "Estimated Charitable Remainder", value: "$" + formatNumber(Math.round(remainderValue)) },
        { label: "Estimated Tax Deduction", value: "$" + formatNumber(Math.round(estimatedDeduction)) },
        { label: "Estimated Tax Savings", value: "$" + formatNumber(Math.round(taxSavings)) }
      ]
    };
  },
  }],
  relatedSlugs: ["retirement-tax-bracket-calculator","retirement-income-gap-calculator"],
  faq: [
    { question: "What is a charitable remainder trust?", answer: "A CRT is an irrevocable trust that provides income to you or other beneficiaries for a period of years or for life, after which the remaining assets go to a designated charity. You receive an income tax deduction in the year the trust is established." },
    { question: "What are the tax benefits of a CRT?", answer: "You receive a partial income tax deduction for the present value of the future charitable gift. You avoid capital gains tax on appreciated assets donated to the trust. The trust itself is tax-exempt, allowing assets to grow without annual taxation." },
    { question: "What is the minimum payout rate for a CRT?", answer: "The IRS requires a minimum annual payout rate of 5 percent and a maximum of 50 percent. Additionally, the present value of the remainder interest must be at least 10 percent of the initial contribution value." },
  ],
  formula: "Annual Payout = Asset Value x Payout Rate; Trust Growth: Balance = Previous x (1 + Return) - Payout each year; Remainder = Trust balance after term expires; Tax Deduction = Present value of future charitable remainder",
};
