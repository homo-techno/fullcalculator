import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rothConversionLadderCalculator: CalculatorDefinition = {
  slug: "roth-conversion-ladder-calculator",
  title: "Roth Conversion Ladder Calculator",
  description: "Plan a multi-year Roth conversion ladder strategy to move traditional IRA or 401k funds into a Roth IRA while minimizing total taxes paid over time.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["Roth conversion ladder","Roth conversion strategy","IRA to Roth conversion plan","multi-year Roth conversion"],
  variants: [{
    id: "standard",
    name: "Roth Conversion Ladder",
    description: "Plan a multi-year Roth conversion ladder strategy to move traditional IRA or 401k funds into a Roth IRA while minimizing total taxes paid over time.",
    fields: [
      { name: "traditionalBalance", label: "Traditional IRA/401k Balance ($)", type: "number", min: 10000, max: 10000000, defaultValue: 500000 },
      { name: "annualConversion", label: "Annual Conversion Amount ($)", type: "number", min: 1000, max: 1000000, defaultValue: 50000 },
      { name: "currentTaxRate", label: "Current Marginal Tax Rate (%)", type: "number", min: 0, max: 50, defaultValue: 22 },
      { name: "futureTaxRate", label: "Expected Future Tax Rate (%)", type: "number", min: 0, max: 50, defaultValue: 24 },
      { name: "yearsToConvert", label: "Years to Complete Conversions", type: "number", min: 1, max: 30, defaultValue: 10 },
      { name: "growthRate", label: "Expected Growth Rate (%)", type: "number", min: 0, max: 15, defaultValue: 7 },
    ],
    calculate: (inputs) => {
    const balance = inputs.traditionalBalance as number;
    const annualConv = inputs.annualConversion as number;
    const currentRate = inputs.currentTaxRate as number / 100;
    const futureRate = inputs.futureTaxRate as number / 100;
    const years = inputs.yearsToConvert as number;
    const growth = inputs.growthRate as number / 100;
    const totalConverted = Math.min(annualConv * years, balance);
    const taxOnConversions = totalConverted * currentRate;
    const taxIfWithdrawnLater = totalConverted * Math.pow(1 + growth, years) * futureRate;
    const taxSavings = taxIfWithdrawnLater - taxOnConversions;
    const rothValueAfter = totalConverted * Math.pow(1 + growth, years);
    const monthlyTaxCost = taxOnConversions / (years * 12);
    return {
      primary: { label: "Potential Tax Savings", value: "$" + formatNumber(Math.round(taxSavings)) },
      details: [
        { label: "Total Amount Converted", value: "$" + formatNumber(Math.round(totalConverted)) },
        { label: "Total Tax on Conversions", value: "$" + formatNumber(Math.round(taxOnConversions)) },
        { label: "Tax if Withdrawn Later (Traditional)", value: "$" + formatNumber(Math.round(taxIfWithdrawnLater)) },
        { label: "Roth Value After Growth", value: "$" + formatNumber(Math.round(rothValueAfter)) },
        { label: "Monthly Tax Cost", value: "$" + formatNumber(Math.round(monthlyTaxCost)) }
      ]
    };
  },
  }],
  relatedSlugs: ["retirement-tax-bracket-calculator","retirement-tax-calculator"],
  faq: [
    { question: "What is a Roth conversion ladder?", answer: "A Roth conversion ladder is a strategy of converting a portion of traditional IRA or 401k funds to a Roth IRA each year over multiple years. This spreads the tax hit, potentially keeping you in lower tax brackets each year rather than converting everything at once." },
    { question: "When does a Roth conversion ladder make sense?", answer: "It is most beneficial during years when your income is lower than usual, such as between early retirement and when Social Security or RMDs begin. Converting during low-income years means paying taxes at a lower rate than you would later." },
    { question: "How long do I have to wait to withdraw Roth conversions?", answer: "Each Roth conversion has its own 5-year holding period before the converted amount can be withdrawn tax and penalty free. After age 59 and a half, earnings can also be withdrawn tax-free once the 5-year rule is met." },
  ],
  formula: "Total Converted = Annual Conversion x Years (up to balance); Tax on Conversions = Total Converted x Current Tax Rate; Future Tax Avoided = Total Converted x (1 + Growth)^Years x Future Rate; Savings = Future Tax Avoided - Tax on Conversions",
};
