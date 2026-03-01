import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const structuredSettlementPayoutCalculator: CalculatorDefinition = {
  slug: "structured-settlement-payout-calculator",
  title: "Structured Settlement Payout Calculator",
  description: "Calculate the present value and total payout of a structured settlement.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["structured settlement payout", "annuity payout calculator", "settlement annuity value"],
  variants: [{
    id: "standard",
    name: "Structured Settlement Payout",
    description: "Calculate the present value and total payout of a structured settlement",
    fields: [
      { name: "monthlyPayment", label: "Monthly Payment", type: "number", prefix: "$", min: 100, max: 500000, defaultValue: 3000 },
      { name: "years", label: "Payment Duration", type: "number", suffix: "years", min: 1, max: 50, defaultValue: 20 },
      { name: "discountRate", label: "Discount Rate", type: "number", suffix: "%", min: 1, max: 15, step: 0.1, defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const pmt = inputs.monthlyPayment as number;
      const years = inputs.years as number;
      const rate = (inputs.discountRate as number) / 100 / 12;
      if (!pmt || pmt <= 0 || !years || !rate) return null;
      const n = years * 12;
      const totalPayout = pmt * n;
      const presentValue = pmt * (1 - Math.pow(1 + rate, -n)) / rate;
      const interestComponent = totalPayout - presentValue;
      return {
        primary: { label: "Total Payout", value: "$" + formatNumber(Math.round(totalPayout)) },
        details: [
          { label: "Present Value", value: "$" + formatNumber(Math.round(presentValue)) },
          { label: "Time Value Difference", value: "$" + formatNumber(Math.round(interestComponent)) },
          { label: "Monthly Payment", value: "$" + formatNumber(pmt) },
          { label: "Total Payments", value: formatNumber(n) },
        ],
      };
    },
  }],
  relatedSlugs: ["attorney-contingency-fee-calculator", "pain-and-suffering-multiplier-calculator"],
  faq: [
    { question: "What is a structured settlement?", answer: "A structured settlement pays damages over time through periodic payments instead of a single lump sum." },
    { question: "Can you sell a structured settlement?", answer: "Yes, you can sell future payments to a factoring company for a lump sum, but you will typically receive less than the total value." },
  ],
  formula: "Present Value = Payment x (1 - (1 + r)^-n) / r; Total = Payment x n",
};
