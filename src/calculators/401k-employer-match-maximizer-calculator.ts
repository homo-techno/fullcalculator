import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const n401kEmployerMatchMaximizerCalculator: CalculatorDefinition = {
  slug: "401k-employer-match-maximizer-calculator",
  title: "401k Employer Match Maximizer Calculator",
  description: "Determine the optimal 401k contribution rate to fully capture your employer match and calculate how much free money you may be leaving on the table.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["401k employer match","401k match maximizer","employer match calculator","maximize 401k match"],
  variants: [{
    id: "standard",
    name: "401k Employer Match Maximizer",
    description: "Determine the optimal 401k contribution rate to fully capture your employer match and calculate how much free money you may be leaving on the table.",
    fields: [
      { name: "annualSalary", label: "Annual Salary ($)", type: "number", min: 10000, max: 1000000, defaultValue: 75000 },
      { name: "currentContribPct", label: "Your Current Contribution (%)", type: "number", min: 0, max: 100, defaultValue: 6 },
      { name: "matchPct", label: "Employer Match Rate (%)", type: "number", min: 0, max: 200, defaultValue: 50 },
      { name: "matchCapPct", label: "Match Cap (% of Salary)", type: "number", min: 0, max: 100, defaultValue: 6 },
      { name: "annualLimit", label: "Annual 401k Limit ($)", type: "number", min: 1000, max: 100000, defaultValue: 23500 },
    ],
    calculate: (inputs) => {
    const salary = inputs.annualSalary as number;
    const contribPct = inputs.currentContribPct as number;
    const matchPct = inputs.matchPct as number;
    const matchCapPct = inputs.matchCapPct as number;
    const limit = inputs.annualLimit as number;
    const yourContrib = Math.min(salary * (contribPct / 100), limit);
    const eligibleForMatch = Math.min(salary * (contribPct / 100), salary * (matchCapPct / 100));
    const employerMatch = eligibleForMatch * (matchPct / 100);
    const optimalContribPct = matchCapPct;
    const optimalContrib = Math.min(salary * (optimalContribPct / 100), limit);
    const maxMatch = salary * (matchCapPct / 100) * (matchPct / 100);
    const missedMatch = Math.max(0, maxMatch - employerMatch);
    const totalAnnual = yourContrib + employerMatch;
    return {
      primary: { label: "Employer Match You Receive", value: "$" + formatNumber(Math.round(employerMatch)) },
      details: [
        { label: "Your Annual Contribution", value: "$" + formatNumber(Math.round(yourContrib)) },
        { label: "Maximum Possible Match", value: "$" + formatNumber(Math.round(maxMatch)) },
        { label: "Match Left on Table", value: "$" + formatNumber(Math.round(missedMatch)) },
        { label: "Total Annual (You + Employer)", value: "$" + formatNumber(Math.round(totalAnnual)) },
        { label: "Contribute at Least", value: formatNumber(optimalContribPct) + "% to max match" }
      ]
    };
  },
  }],
  relatedSlugs: ["retirement-income-gap-calculator","pension-benefit-estimator-calculator"],
  faq: [
    { question: "How does a 401k employer match work?", answer: "An employer match is free money your company contributes to your 401k based on your own contributions. For example, a 50 percent match on the first 6 percent of salary means if you contribute 6 percent, your employer adds an additional 3 percent." },
    { question: "What does it mean to leave match money on the table?", answer: "If you contribute less than the amount needed to get the full employer match, you are forfeiting free money. For example, if your employer matches up to 6 percent of salary but you only contribute 3 percent, you are missing half the potential match." },
    { question: "What is the 2024 401k contribution limit?", answer: "For 2024, the employee contribution limit is $23,000 for those under 50 and $30,500 for those 50 and older (with the $7,500 catch-up). The combined employer plus employee limit is $69,000 or $76,500 with catch-up contributions." },
  ],
  formula: "Employer Match = min(Your Contribution, Salary x Match Cap %) x Match Rate %; Match Left on Table = Maximum Match - Actual Match; Optimal Contribution = Match Cap % of Salary",
};
