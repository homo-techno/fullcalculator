import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const earlyRetirementFireNumberCalculator: CalculatorDefinition = {
  slug: "early-retirement-fire-number-calculator",
  title: "Early Retirement FIRE Number Calculator",
  description: "Calculate your Financial Independence Retire Early (FIRE) number, the total investment portfolio needed to cover annual expenses indefinitely using the safe withdrawal rate.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["FIRE number","financial independence calculator","early retirement number","FIRE calculator retirement"],
  variants: [{
    id: "standard",
    name: "Early Retirement FIRE Number",
    description: "Calculate your Financial Independence Retire Early (FIRE) number, the total investment portfolio needed to cover annual expenses indefinitely using the safe withdrawal rate.",
    fields: [
      { name: "annualExpenses", label: "Annual Living Expenses ($)", type: "number", min: 10000, max: 500000, defaultValue: 50000 },
      { name: "withdrawalRate", label: "Safe Withdrawal Rate (%)", type: "number", min: 2, max: 6, defaultValue: 4 },
      { name: "currentSavings", label: "Current Investment Portfolio ($)", type: "number", min: 0, max: 20000000, defaultValue: 300000 },
      { name: "annualSavings", label: "Annual Savings ($)", type: "number", min: 0, max: 500000, defaultValue: 40000 },
      { name: "expectedReturn", label: "Expected Annual Return (%)", type: "number", min: 2, max: 15, defaultValue: 7 },
    ],
    calculate: (inputs) => {
    const expenses = inputs.annualExpenses as number;
    const wr = inputs.withdrawalRate as number / 100;
    const current = inputs.currentSavings as number;
    const savings = inputs.annualSavings as number;
    const returnRate = inputs.expectedReturn as number / 100;
    const fireNumber = wr > 0 ? expenses / wr : expenses * 25;
    const gap = Math.max(0, fireNumber - current);
    let yearsToFire = 0;
    let balance = current;
    if (savings > 0) {
      while (balance < fireNumber && yearsToFire < 100) {
        balance = balance * (1 + returnRate) + savings;
        yearsToFire++;
      }
    }
    const progressPct = fireNumber > 0 ? (current / fireNumber) * 100 : 0;
    const coastFireAge = returnRate > 0 ? Math.ceil(Math.log(fireNumber / Math.max(current, 1)) / Math.log(1 + returnRate)) : 0;
    return {
      primary: { label: "Your FIRE Number", value: "$" + formatNumber(Math.round(fireNumber)) },
      details: [
        { label: "Current Progress", value: formatNumber(Math.round(progressPct * 10) / 10) + "% ($" + formatNumber(Math.round(current)) + ")" },
        { label: "Remaining Gap", value: "$" + formatNumber(Math.round(gap)) },
        { label: "Years to FIRE", value: savings > 0 && yearsToFire < 100 ? formatNumber(yearsToFire) + " years" : "N/A" },
        { label: "Coast FIRE (years, no more saving)", value: formatNumber(coastFireAge) + " years" },
        { label: "Monthly Expense Budget", value: "$" + formatNumber(Math.round(expenses / 12)) }
      ]
    };
  },
  }],
  relatedSlugs: ["retirement-portfolio-withdrawal-calculator","required-savings-rate-calculator"],
  faq: [
    { question: "What is the FIRE number?", answer: "Your FIRE number is the total investment portfolio needed to cover your annual expenses indefinitely using a safe withdrawal rate. With the traditional 4 percent rule, your FIRE number is 25 times your annual expenses." },
    { question: "What is Coast FIRE?", answer: "Coast FIRE means you have saved enough that your portfolio will grow to your FIRE number by traditional retirement age without any additional contributions. You still need to earn enough to cover current expenses but no longer need to save." },
    { question: "Is the 4 percent rule reliable for early retirees?", answer: "The 4 percent rule was originally designed for a 30-year retirement. Early retirees with 40 to 50 year horizons may want to use a lower withdrawal rate of 3 to 3.5 percent, or plan for flexible spending that adjusts based on portfolio performance." },
  ],
  formula: "FIRE Number = Annual Expenses / Withdrawal Rate
Years to FIRE: Compound growth of (Current + Annual Savings) until reaching FIRE Number
Coast FIRE Years = ln(FIRE Number / Current Savings) / ln(1 + Return Rate)",
};
