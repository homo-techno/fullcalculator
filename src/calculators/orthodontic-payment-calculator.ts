import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const orthodonticPaymentCalculator: CalculatorDefinition = {
  slug: "orthodontic-payment-calculator",
  title: "Orthodontic Payment Calculator",
  description: "Calculate monthly payment plans for braces or clear aligners.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["braces monthly payment","orthodontic cost plan","aligner payment calculator"],
  variants: [{
    id: "standard",
    name: "Orthodontic Payment",
    description: "Calculate monthly payment plans for braces or clear aligners.",
    fields: [
      { name: "totalCost", label: "Total Treatment Cost ($)", type: "number", min: 1000, max: 15000, defaultValue: 5000 },
      { name: "downPayment", label: "Down Payment ($)", type: "number", min: 0, max: 10000, defaultValue: 500 },
      { name: "months", label: "Payment Months", type: "number", min: 6, max: 60, defaultValue: 24 },
      { name: "insurance", label: "Insurance Benefit ($)", type: "number", min: 0, max: 5000, defaultValue: 1500 },
    ],
    calculate: (inputs) => {
    const totalCost = inputs.totalCost as number;
    const downPayment = inputs.downPayment as number;
    const months = inputs.months as number;
    const insurance = inputs.insurance as number;
    const remaining = totalCost - downPayment - insurance;
    const monthlyPayment = remaining > 0 ? remaining / months : 0;
    return {
      primary: { label: "Monthly Payment", value: "$" + formatNumber(monthlyPayment) },
      details: [
        { label: "Total Treatment Cost", value: "$" + formatNumber(totalCost) },
        { label: "Down Payment", value: "$" + formatNumber(downPayment) },
        { label: "Insurance Benefit", value: "$" + formatNumber(insurance) },
        { label: "Remaining Balance", value: "$" + formatNumber(remaining > 0 ? remaining : 0) },
        { label: "Payment Duration", value: months + " months" }
      ]
    };
  },
  }],
  relatedSlugs: ["dental-crown-cost-calculator","dental-bridge-cost-calculator","dental-veneer-cost-calculator"],
  faq: [
    { question: "How much do braces cost on average?", answer: "Traditional metal braces cost between $3000 and $7000 depending on complexity." },
    { question: "Do orthodontists offer payment plans?", answer: "Most orthodontists offer in-house payment plans with little or no interest." },
    { question: "Does insurance cover braces?", answer: "Many dental plans cover $1000 to $2000 for orthodontic treatment, especially for minors." },
  ],
  formula: "Monthly Payment = (Total Cost - Down Payment - Insurance) / Months",
};
