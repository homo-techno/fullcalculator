import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const catchUpContributionCalculator: CalculatorDefinition = {
  slug: "catch-up-contribution-calculator",
  title: "Catch-Up Contribution Calculator",
  description: "Calculate additional retirement savings from catch-up contributions for those 50 and older.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["catch-up contribution", "401k catch-up", "IRA catch-up over 50"],
  variants: [{
    id: "standard",
    name: "Catch-Up Contribution",
    description: "Calculate additional retirement savings from catch-up contributions for those 50 and older",
    fields: [
      { name: "accountType", label: "Account Type", type: "select", options: [{value:"401k",label:"401(k)"},{value:"ira",label:"IRA"},{value:"403b",label:"403(b)"}], defaultValue: "401k" },
      { name: "currentAge", label: "Current Age", type: "number", min: 50, max: 80, defaultValue: 55 },
      { name: "retirementAge", label: "Retirement Age", type: "number", min: 55, max: 80, defaultValue: 67 },
      { name: "expectedReturn", label: "Expected Annual Return", type: "number", suffix: "%", min: 1, max: 15, defaultValue: 7 },
    ],
    calculate: (inputs) => {
      const type = inputs.accountType as string;
      const age = inputs.currentAge as number;
      const retAge = inputs.retirementAge as number;
      const ret = (inputs.expectedReturn as number) / 100;
      if (!age || !retAge || retAge <= age) return null;
      const catchUpAmounts: Record<string, number> = { "401k": 7500, ira: 1000, "403b": 7500 };
      const regularLimits: Record<string, number> = { "401k": 23000, ira: 7000, "403b": 23000 };
      const catchUp = catchUpAmounts[type] || 7500;
      const regular = regularLimits[type] || 23000;
      const total = regular + catchUp;
      const years = retAge - age;
      const catchUpFV = catchUp * ((Math.pow(1 + ret, years) - 1) / ret);
      const totalFV = total * ((Math.pow(1 + ret, years) - 1) / ret);
      return {
        primary: { label: "Total Annual Limit (with Catch-Up)", value: "$" + formatNumber(total) },
        details: [
          { label: "Regular Limit", value: "$" + formatNumber(regular) },
          { label: "Catch-Up Amount", value: "$" + formatNumber(catchUp) },
          { label: "Catch-Up FV at Retirement", value: "$" + formatNumber(Math.round(catchUpFV)) },
          { label: "Total FV at Retirement", value: "$" + formatNumber(Math.round(totalFV)) },
        ],
      };
    },
  }],
  relatedSlugs: ["ira-contribution-calculator", "solo-401k-calculator"],
  faq: [
    { question: "What are catch-up contributions?", answer: "Catch-up contributions allow workers age 50 and older to contribute extra to retirement accounts beyond the standard limit." },
    { question: "How much is the 401(k) catch-up contribution?", answer: "The 401(k) catch-up contribution is $7,500 for 2024, bringing the total limit to $30,500 for those 50 and older." },
  ],
  formula: "Total Limit = Regular Limit + Catch-Up Amount; FV = Annual x ((1+r)^n - 1) / r",
};
