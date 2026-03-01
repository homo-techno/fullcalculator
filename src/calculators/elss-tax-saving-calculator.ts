import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const elssTaxSavingCalculator: CalculatorDefinition = {
  slug: "elss-tax-saving-calculator",
  title: "ELSS Tax Saving Calculator",
  description: "Calculate tax savings and projected returns from investing in ELSS mutual funds under Section 80C of the Indian Income Tax Act.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["elss calculator", "elss tax saving", "tax saving mutual fund calculator"],
  variants: [{
    id: "standard",
    name: "ELSS Tax Saving",
    description: "Calculate tax savings and projected returns from investing in ELSS mutual funds under Section 80C of the Indian Income Tax Act",
    fields: [
      { name: "annualInvestment", label: "Annual ELSS Investment", type: "number", prefix: "Rs.", min: 500, max: 150000, step: 500, defaultValue: 150000 },
      { name: "taxBracket", label: "Tax Bracket", type: "select", options: [{value:"5",label:"5% (up to 5 lakh)"},{value:"20",label:"20% (5-10 lakh)"},{value:"30",label:"30% (above 10 lakh)"}], defaultValue: "30" },
      { name: "years", label: "Investment Period", type: "number", suffix: "years", min: 3, max: 30, defaultValue: 10 },
      { name: "expectedReturn", label: "Expected Annual Return", type: "number", suffix: "%", min: 1, max: 25, step: 0.5, defaultValue: 14 },
    ],
    calculate: (inputs) => {
      const annual = inputs.annualInvestment as number;
      const taxRate = parseFloat(inputs.taxBracket as string) || 30;
      const years = inputs.years as number;
      const ret = inputs.expectedReturn as number;
      if (!annual || !years || !ret || annual <= 0) return null;
      const taxSavedPerYear = Math.min(annual, 150000) * (taxRate / 100);
      const totalTaxSaved = taxSavedPerYear * years;
      const monthlyRate = ret / 100 / 12;
      const monthlySIP = annual / 12;
      let futureValue = 0;
      for (let m = 0; m < years * 12; m++) {
        futureValue = (futureValue + monthlySIP) * (1 + monthlyRate);
      }
      const totalInvested = annual * years;
      const gains = futureValue - totalInvested;
      return {
        primary: { label: "Total Future Value", value: "Rs. " + formatNumber(Math.round(futureValue)) },
        details: [
          { label: "Tax Saved Per Year", value: "Rs. " + formatNumber(Math.round(taxSavedPerYear)) },
          { label: "Total Tax Saved Over Period", value: "Rs. " + formatNumber(Math.round(totalTaxSaved)) },
          { label: "Total Investment Gains", value: "Rs. " + formatNumber(Math.round(gains)) },
        ],
      };
    },
  }],
  relatedSlugs: ["section-80c-deduction-calculator", "mutual-fund-returns-calculator-india"],
  faq: [
    { question: "What is the lock-in period for ELSS?", answer: "ELSS mutual funds have a mandatory lock-in period of 3 years, which is the shortest among all Section 80C investment options. After 3 years, units can be redeemed or held for additional growth." },
    { question: "How much tax can be saved with ELSS?", answer: "Under Section 80C, investments up to Rs. 1.5 lakh per year qualify for a deduction. At the 30 percent tax bracket, this translates to a maximum annual tax saving of Rs. 46,800 including cess." },
  ],
  formula: "Tax Saved = Min(Investment, 150000) x Tax Rate; Future Value = Monthly SIP compounded at expected return rate",
};
