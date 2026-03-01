import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rothIraIncomeLimitCalculator: CalculatorDefinition = {
  slug: "roth-ira-income-limit-calculator",
  title: "Roth IRA Income Limit Calculator",
  description: "Determine your Roth IRA contribution limit based on modified adjusted gross income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["Roth IRA income limit", "Roth IRA eligibility", "Roth IRA phaseout"],
  variants: [{
    id: "standard",
    name: "Roth IRA Income Limit",
    description: "Determine your Roth IRA contribution limit based on modified adjusted gross income",
    fields: [
      { name: "magi", label: "Modified Adjusted Gross Income", type: "number", prefix: "$", min: 0, max: 10000000, defaultValue: 150000 },
      { name: "filingStatus", label: "Filing Status", type: "select", options: [{value:"single",label:"Single / Head of Household"},{value:"married",label:"Married Filing Jointly"},{value:"separate",label:"Married Filing Separately"}], defaultValue: "single" },
      { name: "age", label: "Age", type: "select", options: [{value:"under50",label:"Under 50"},{value:"50plus",label:"50 or Older"}], defaultValue: "under50" },
    ],
    calculate: (inputs) => {
      const magi = inputs.magi as number;
      const status = inputs.filingStatus as string;
      const ageGroup = inputs.age as string;
      if (!magi || magi < 0) return null;
      const maxContrib = ageGroup === "50plus" ? 8000 : 7000;
      let lower, upper;
      if (status === "married") { lower = 230000; upper = 240000; }
      else if (status === "separate") { lower = 0; upper = 10000; }
      else { lower = 146000; upper = 161000; }
      let allowed;
      if (magi <= lower) { allowed = maxContrib; }
      else if (magi >= upper) { allowed = 0; }
      else {
        const ratio = (upper - magi) / (upper - lower);
        allowed = Math.round(maxContrib * ratio / 10) * 10;
        allowed = Math.max(allowed, 200);
      }
      const backdoorOption = allowed === 0 ? "Yes - consider backdoor Roth" : "Not needed";
      return {
        primary: { label: "Roth IRA Contribution Limit", value: "$" + formatNumber(allowed) },
        details: [
          { label: "Maximum Possible", value: "$" + formatNumber(maxContrib) },
          { label: "Phaseout Range", value: "$" + formatNumber(lower) + " - $" + formatNumber(upper) },
          { label: "Your MAGI", value: "$" + formatNumber(magi) },
          { label: "Backdoor Roth", value: backdoorOption },
        ],
      };
    },
  }],
  relatedSlugs: ["ira-contribution-calculator", "catch-up-contribution-calculator"],
  faq: [
    { question: "What is the Roth IRA income limit?", answer: "For 2024, single filers phase out between $146,000 and $161,000, and married filing jointly phase out between $230,000 and $240,000." },
    { question: "What is a backdoor Roth IRA?", answer: "A backdoor Roth involves contributing to a traditional IRA and then converting it to a Roth, which is a strategy for high earners above the income limit." },
  ],
  formula: "Contribution = Max Limit x ((Upper Threshold - MAGI) / Phaseout Range)",
};
