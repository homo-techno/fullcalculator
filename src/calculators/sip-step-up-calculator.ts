import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sipStepUpCalculator: CalculatorDefinition = {
  slug: "sip-step-up-calculator",
  title: "SIP Step-Up Calculator",
  description: "Calculate the future value of a Systematic Investment Plan with annual step-up increases in monthly contribution.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["sip step up", "sip top up calculator", "increasing sip returns"],
  variants: [{
    id: "standard",
    name: "SIP Step-Up",
    description: "Calculate the future value of a Systematic Investment Plan with annual step-up increases in monthly contribution",
    fields: [
      { name: "monthlySIP", label: "Starting Monthly SIP", type: "number", prefix: "Rs.", min: 500, max: 1000000, step: 500, defaultValue: 10000 },
      { name: "annualStepUp", label: "Annual Step-Up Rate", type: "number", suffix: "%", min: 0, max: 50, step: 1, defaultValue: 10 },
      { name: "years", label: "Investment Period", type: "number", suffix: "years", min: 1, max: 40, defaultValue: 15 },
      { name: "expectedReturn", label: "Expected Annual Return", type: "number", suffix: "%", min: 1, max: 30, step: 0.5, defaultValue: 12 },
    ],
    calculate: (inputs) => {
      const monthly = inputs.monthlySIP as number;
      const stepUp = inputs.annualStepUp as number;
      const years = inputs.years as number;
      const annualReturn = inputs.expectedReturn as number;
      if (!monthly || !years || !annualReturn || monthly <= 0) return null;
      const monthlyRate = annualReturn / 100 / 12;
      let totalInvested = 0;
      let futureValue = 0;
      let currentSIP = monthly;
      for (let y = 0; y < years; y++) {
        for (let m = 0; m < 12; m++) {
          totalInvested += currentSIP;
          futureValue = (futureValue + currentSIP) * (1 + monthlyRate);
        }
        currentSIP = currentSIP * (1 + stepUp / 100);
      }
      const totalGains = futureValue - totalInvested;
      return {
        primary: { label: "Future Value", value: "Rs. " + formatNumber(Math.round(futureValue)) },
        details: [
          { label: "Total Invested", value: "Rs. " + formatNumber(Math.round(totalInvested)) },
          { label: "Total Gains", value: "Rs. " + formatNumber(Math.round(totalGains)) },
          { label: "Final Monthly SIP", value: "Rs. " + formatNumber(Math.round(currentSIP / (1 + stepUp / 100))) },
        ],
      };
    },
  }],
  relatedSlugs: ["lump-sum-investment-calculator", "mutual-fund-returns-calculator-india"],
  faq: [
    { question: "What is a SIP step-up?", answer: "A SIP step-up means increasing the monthly investment amount by a fixed percentage every year. For example, a 10 percent step-up on a Rs. 10,000 SIP would increase it to Rs. 11,000 in the second year." },
    { question: "How much difference does a step-up make over time?", answer: "A step-up can significantly boost long-term wealth. A Rs. 10,000 SIP with a 10 percent annual step-up over 20 years at 12 percent returns can accumulate nearly double compared to a flat SIP." },
  ],
  formula: "Future Value = Sum of each monthly SIP compounded at monthly rate, with SIP amount increasing annually by step-up percentage",
};
