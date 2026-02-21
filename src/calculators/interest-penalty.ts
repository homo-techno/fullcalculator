import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const interestPenaltyCalculator: CalculatorDefinition = {
  slug: "interest-penalty-calculator",
  title: "Interest Penalty Calculator",
  description: "Free interest penalty calculator. Calculate interest charges on overdue payments, tax underpayments, and past-due balances with daily or monthly compounding.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["interest penalty calculator", "underpayment interest", "irs interest penalty", "overdue interest calculator", "penalty interest rate"],
  variants: [
    {
      id: "interest-penalty",
      name: "Interest Penalty Calculator",
      description: "Calculate interest accrued on overdue or underpaid amounts",
      fields: [
        { name: "principal", label: "Amount Owed / Underpaid", type: "number", placeholder: "e.g. 10000", prefix: "$" },
        { name: "annualRate", label: "Annual Interest Rate", type: "number", placeholder: "e.g. 8", suffix: "%" },
        { name: "daysOverdue", label: "Days Overdue", type: "number", placeholder: "e.g. 90", min: 1 },
        { name: "compounding", label: "Compounding Method", type: "select", options: [
          { label: "Daily", value: "daily" },
          { label: "Monthly", value: "monthly" },
          { label: "Simple (no compounding)", value: "simple" },
        ], defaultValue: "daily" },
      ],
      calculate: (inputs) => {
        const principal = inputs.principal as number;
        const annualRate = inputs.annualRate as number;
        const daysOverdue = inputs.daysOverdue as number;
        const compounding = inputs.compounding as string;

        if (!principal || !annualRate || !daysOverdue) return null;

        const rate = annualRate / 100;
        let totalOwed: number;

        if (compounding === "daily") {
          const dailyRate = rate / 365;
          totalOwed = principal * Math.pow(1 + dailyRate, daysOverdue);
        } else if (compounding === "monthly") {
          const months = daysOverdue / 30.44;
          const monthlyRate = rate / 12;
          totalOwed = principal * Math.pow(1 + monthlyRate, months);
        } else {
          totalOwed = principal * (1 + rate * (daysOverdue / 365));
        }

        const interestCharged = totalOwed - principal;
        const effectiveRate = (interestCharged / principal) * 100;
        const dailyInterest = interestCharged / daysOverdue;

        return {
          primary: { label: "Total Amount Due", value: `$${formatNumber(totalOwed)}` },
          details: [
            { label: "Original amount owed", value: `$${formatNumber(principal)}` },
            { label: "Interest penalty", value: `$${formatNumber(interestCharged)}` },
            { label: "Annual interest rate", value: `${annualRate}%` },
            { label: "Days overdue", value: `${daysOverdue}` },
            { label: "Average daily interest", value: `$${formatNumber(dailyInterest)}` },
            { label: "Effective penalty rate", value: `${formatNumber(effectiveRate)}%` },
            { label: "Compounding method", value: compounding === "daily" ? "Daily" : compounding === "monthly" ? "Monthly" : "Simple" },
          ],
          note: "The IRS currently charges interest at the federal short-term rate plus 3% (compounded daily) for tax underpayments. State rates vary. This calculator provides a general estimate.",
        };
      },
    },
  ],
  relatedSlugs: ["late-fee-calculator", "tax-calculator", "simple-interest-calculator"],
  faq: [
    { question: "What is the IRS interest rate on underpayments?", answer: "The IRS charges interest on underpayments at the federal short-term rate plus 3 percentage points, compounded daily. This rate is updated quarterly. As of recent quarters, it has been around 7-8% annually." },
    { question: "How is penalty interest different from regular interest?", answer: "Penalty interest is charged as a consequence of late payment, underpayment, or default. It is typically higher than market interest rates and is meant to incentivize timely payment. Unlike regular interest, penalty interest may also include additional flat fees or surcharges." },
    { question: "Can penalty interest be waived?", answer: "In some cases, yes. The IRS may waive penalties (but not interest) for reasonable cause. For private debts, creditors may negotiate interest reductions. Late tax penalties can sometimes be waived under the first-time penalty abatement policy." },
  ],
  formula: "Simple: Total = Principal × (1 + Rate × Days/365). Daily Compound: Total = Principal × (1 + Rate/365)^Days. Monthly Compound: Total = Principal × (1 + Rate/12)^Months.",
};
