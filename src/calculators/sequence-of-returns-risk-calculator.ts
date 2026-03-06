import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sequenceOfReturnsRiskCalculator: CalculatorDefinition = {
  slug: "sequence-of-returns-risk-calculator",
  title: "Sequence of Returns Risk Calculator",
  description: "Visualize how the order of investment returns impacts your retirement portfolio by comparing a good-first versus bad-first return sequence over your retirement.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["sequence of returns risk","retirement sequence risk","return order risk","early retirement risk"],
  variants: [{
    id: "standard",
    name: "Sequence of Returns Risk",
    description: "Visualize how the order of investment returns impacts your retirement portfolio by comparing a good-first versus bad-first return sequence over your retirement.",
    fields: [
      { name: "startingBalance", label: "Starting Balance ($)", type: "number", min: 50000, max: 20000000, defaultValue: 1000000 },
      { name: "annualWithdrawal", label: "Annual Withdrawal ($)", type: "number", min: 5000, max: 500000, defaultValue: 40000 },
      { name: "goodReturn", label: "Good Year Return (%)", type: "number", min: 5, max: 30, defaultValue: 15 },
      { name: "badReturn", label: "Bad Year Return (%)", type: "number", min: -50, max: 0, defaultValue: -15 },
      { name: "periodYears", label: "Analysis Period (Years)", type: "number", min: 5, max: 40, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const start = inputs.startingBalance as number;
    const withdrawal = inputs.annualWithdrawal as number;
    const good = inputs.goodReturn as number / 100;
    const bad = inputs.badReturn as number / 100;
    const years = inputs.periodYears as number;
    const halfYears = Math.floor(years / 2);
    let goodFirst = start;
    let badFirst = start;
    for (let y = 0; y < years; y++) {
      const gfReturn = y < halfYears ? good : bad;
      const bfReturn = y < halfYears ? bad : good;
      goodFirst = Math.max(0, goodFirst * (1 + gfReturn) - withdrawal);
      badFirst = Math.max(0, badFirst * (1 + bfReturn) - withdrawal);
    }
    const avgReturn = (good + bad) / 2;
    let avgScenario = start;
    for (let y = 0; y < years; y++) {
      avgScenario = Math.max(0, avgScenario * (1 + avgReturn) - withdrawal);
    }
    const difference = goodFirst - badFirst;
    return {
      primary: { label: "Sequence Impact (Difference)", value: "$" + formatNumber(Math.round(Math.abs(difference))) },
      details: [
        { label: "Good Returns First - Ending", value: "$" + formatNumber(Math.round(goodFirst)) },
        { label: "Bad Returns First - Ending", value: "$" + formatNumber(Math.round(badFirst)) },
        { label: "Average Return Scenario", value: "$" + formatNumber(Math.round(avgScenario)) },
        { label: "Average Annual Return", value: formatNumber(Math.round(avgReturn * 1000) / 10) + "%" },
        { label: "Analysis Period", value: formatNumber(years) + " years" }
      ]
    };
  },
  }],
  relatedSlugs: ["retirement-portfolio-withdrawal-calculator","retirement-income-gap-calculator"],
  faq: [
    { question: "What is sequence of returns risk?", answer: "Sequence of returns risk is the danger that poor investment returns early in retirement can permanently impair your portfolio, even if average returns over the full period are acceptable. Withdrawing from a declining portfolio locks in losses." },
    { question: "How can I mitigate sequence of returns risk?", answer: "Strategies include maintaining a cash reserve covering 1 to 2 years of expenses, using a bucket strategy, reducing withdrawals during market downturns, having flexible spending, and keeping a moderate allocation rather than being overly aggressive." },
    { question: "Why is the order of returns so important?", answer: "When you are withdrawing from a portfolio, negative returns early reduce the base that must grow to sustain future withdrawals. The same average return produces vastly different outcomes depending on when the losses occur." },
  ],
  formula: "Good First Scenario: Apply good returns for first half, bad returns for second half; Bad First Scenario: Apply bad returns for first half, good returns for second half; Each Year: Balance = Previous x (1 + Return) - Withdrawal; Sequence Impact = Good First Ending - Bad First Ending",
};
