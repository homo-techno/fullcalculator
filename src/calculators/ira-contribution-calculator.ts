import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const iraContributionCalculator: CalculatorDefinition = {
  slug: "ira-contribution-calculator",
  title: "IRA Contribution Calculator",
  description: "Calculate the tax benefit of traditional IRA contributions and compare to Roth IRA.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["IRA contribution calculator", "traditional IRA tax benefit", "IRA deduction"],
  variants: [{
    id: "standard",
    name: "IRA Contribution",
    description: "Calculate the tax benefit of traditional IRA contributions and compare to Roth IRA",
    fields: [
      { name: "contribution", label: "Annual Contribution", type: "number", prefix: "$", min: 0, max: 8000, defaultValue: 7000 },
      { name: "taxBracket", label: "Current Tax Bracket", type: "select", options: [{value:"0.12",label:"12%"},{value:"0.22",label:"22%"},{value:"0.24",label:"24%"},{value:"0.32",label:"32%"},{value:"0.35",label:"35%"}], defaultValue: "0.22" },
      { name: "yearsToRetirement", label: "Years to Retirement", type: "number", min: 1, max: 50, defaultValue: 25 },
      { name: "expectedReturn", label: "Expected Annual Return", type: "number", suffix: "%", min: 1, max: 15, defaultValue: 7 },
    ],
    calculate: (inputs) => {
      const contrib = inputs.contribution as number;
      const bracket = parseFloat(inputs.taxBracket as string);
      const years = inputs.yearsToRetirement as number;
      const ret = (inputs.expectedReturn as number) / 100;
      if (!contrib || contrib <= 0 || !years) return null;
      const maxContrib = 7000;
      const actualContrib = Math.min(contrib, maxContrib);
      const taxSavings = actualContrib * bracket;
      const futureValue = actualContrib * Math.pow(1 + ret, years);
      const totalContributions = actualContrib * years;
      const totalFV = actualContrib * ((Math.pow(1 + ret, years) - 1) / ret);
      return {
        primary: { label: "Annual Tax Savings", value: "$" + formatNumber(Math.round(taxSavings)) },
        details: [
          { label: "Contribution (max $7,000)", value: "$" + formatNumber(actualContrib) },
          { label: "Future Value (this year)", value: "$" + formatNumber(Math.round(futureValue)) },
          { label: "Total if Contributed Yearly", value: "$" + formatNumber(Math.round(totalFV)) },
          { label: "Total Contributions", value: "$" + formatNumber(totalContributions) },
        ],
      };
    },
  }],
  relatedSlugs: ["catch-up-contribution-calculator", "roth-ira-income-limit-calculator"],
  faq: [
    { question: "What is the IRA contribution limit?", answer: "The annual IRA contribution limit is $7,000 for 2024, or $8,000 if you are age 50 or older with the catch-up contribution." },
    { question: "Should I choose traditional or Roth IRA?", answer: "Choose traditional if you expect a lower tax bracket in retirement. Choose Roth if you expect the same or higher bracket." },
  ],
  formula: "Tax Savings = Contribution x Tax Bracket; Future Value = Contribution x (1 + Return)^Years",
};
