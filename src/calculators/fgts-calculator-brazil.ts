import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fgtsCalculatorBrazilCalculator: CalculatorDefinition = {
  slug: "fgts-calculator-brazil",
  title: "FGTS Calculator Brazil",
  description: "Calculate the FGTS (Fundo de Garantia) balance accumulation based on monthly salary and employment duration.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["fgts calculator", "fundo de garantia", "fgts balance calculator"],
  variants: [{
    id: "standard",
    name: "FGTS Brazil",
    description: "Calculate the FGTS (Fundo de Garantia) balance accumulation based on monthly salary and employment duration",
    fields: [
      { name: "monthlySalary", label: "Monthly Gross Salary", type: "number", prefix: "R$", min: 1000, max: 200000, step: 500, defaultValue: 5000 },
      { name: "monthsEmployed", label: "Months Employed", type: "number", suffix: "months", min: 1, max: 480, defaultValue: 36 },
      { name: "annualRate", label: "FGTS Annual Yield", type: "number", suffix: "%", min: 0, max: 10, step: 0.1, defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const salary = inputs.monthlySalary as number;
      const months = inputs.monthsEmployed as number;
      const annualYield = inputs.annualRate as number;
      if (!salary || !months || salary <= 0) return null;
      const monthlyDeposit = salary * 0.08;
      const monthlyRate = (annualYield || 3) / 100 / 12;
      let balance = 0;
      for (let m = 0; m < months; m++) {
        balance = (balance + monthlyDeposit) * (1 + monthlyRate);
      }
      const totalDeposited = monthlyDeposit * months;
      const interestEarned = balance - totalDeposited;
      return {
        primary: { label: "Estimated FGTS Balance", value: "R$ " + formatNumber(Math.round(balance * 100) / 100) },
        details: [
          { label: "Monthly Deposit (8%)", value: "R$ " + formatNumber(Math.round(monthlyDeposit * 100) / 100) },
          { label: "Total Deposited", value: "R$ " + formatNumber(Math.round(totalDeposited)) },
          { label: "Interest Earned", value: "R$ " + formatNumber(Math.round(interestEarned * 100) / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["rescisao-calculator-brazil", "clt-vs-pj-calculator-brazil"],
  faq: [
    { question: "What is FGTS in Brazil?", answer: "FGTS (Fundo de Garantia do Tempo de Servico) is a mandatory severance fund where employers deposit 8 percent of an employee monthly salary. The fund can be withdrawn upon termination without cause, home purchase, or retirement." },
    { question: "What is the interest rate on FGTS?", answer: "FGTS earns a fixed rate of 3 percent per year plus TR (Taxa Referencial). In practice, this rate is below inflation, meaning the purchasing power of FGTS balances decreases over time." },
  ],
  formula: "Monthly Deposit = Salary x 8%; Balance = Cumulative deposits compounded at annual yield rate",
};
