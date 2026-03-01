import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const invoiceLateFeeCalculator: CalculatorDefinition = {
  slug: "invoice-late-fee-calculator",
  title: "Invoice Late Fee Calculator",
  description: "Calculate late payment penalties and interest charges on overdue invoices based on terms and days past due.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["late fee calculator","invoice penalty","overdue invoice interest"],
  variants: [{
    id: "standard",
    name: "Invoice Late Fee",
    description: "Calculate late payment penalties and interest charges on overdue invoices based on terms and days past due.",
    fields: [
      { name: "invoiceAmount", label: "Invoice Amount", type: "number", prefix: "$", min: 1, max: 10000000, defaultValue: 5000 },
      { name: "annualRate", label: "Annual Interest Rate", type: "number", suffix: "%", min: 0, max: 36, defaultValue: 18 },
      { name: "daysOverdue", label: "Days Overdue", type: "number", min: 1, max: 365, defaultValue: 30 },
      { name: "flatFee", label: "Flat Late Fee", type: "number", prefix: "$", min: 0, max: 10000, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const amount = inputs.invoiceAmount as number;
      const rate = (inputs.annualRate as number) / 100;
      const days = inputs.daysOverdue as number;
      const flat = inputs.flatFee as number;
      if (!amount || !days) return null;
      const dailyRate = rate / 365;
      const interestCharge = amount * dailyRate * days;
      const totalPenalty = interestCharge + flat;
      const totalDue = amount + totalPenalty;
      return {
        primary: { label: "Total Amount Due", value: "$" + formatNumber(Math.round(totalDue * 100) / 100) },
        details: [
          { label: "Interest Charge", value: "$" + formatNumber(Math.round(interestCharge * 100) / 100) },
          { label: "Flat Late Fee", value: "$" + formatNumber(Math.round(flat * 100) / 100) },
          { label: "Total Penalty", value: "$" + formatNumber(Math.round(totalPenalty * 100) / 100) },
          { label: "Daily Interest Rate", value: formatNumber(Math.round(dailyRate * 100000) / 1000) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["freelance-rate-calculator","break-even-analysis-calculator"],
  faq: [
    { question: "What is a typical late fee for invoices?", answer: "Common late fees range from 1% to 2% per month (12-24% annually). Some businesses also charge a flat fee of $25 to $50 in addition to interest. Always check local regulations for maximum allowed rates." },
    { question: "When should late fees begin?", answer: "Late fees typically begin after the payment terms expire, such as Net 30 or Net 60. Clearly stating late fee terms on the original invoice is essential for enforceability." },
  ],
  formula: "Interest Charge = Invoice Amount x (Annual Rate / 365) x Days Overdue; Total Due = Invoice Amount + Interest Charge + Flat Fee",
};
