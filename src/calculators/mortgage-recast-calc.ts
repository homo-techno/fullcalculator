import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mortgageRecastCalculator: CalculatorDefinition = {
  slug: "mortgage-recast-calculator",
  title: "Mortgage Recast Calculator",
  description:
    "Free mortgage recast calculator. See how a lump-sum payment can lower your monthly mortgage payment while keeping the same interest rate and term.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "mortgage recast calculator",
    "loan recast",
    "reamortization calculator",
    "lump sum mortgage payment",
    "lower mortgage payment",
  ],
  variants: [
    {
      id: "standard",
      name: "Mortgage Recast Calculator",
      description:
        "Calculate new monthly payment after a lump-sum principal payment",
      fields: [
        {
          name: "currentBalance",
          label: "Current Loan Balance",
          type: "number",
          placeholder: "e.g. 300000",
          prefix: "$",
        },
        {
          name: "interestRate",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g. 6.5",
          suffix: "%",
        },
        {
          name: "remainingMonths",
          label: "Remaining Months on Loan",
          type: "number",
          placeholder: "e.g. 300",
          suffix: "months",
        },
        {
          name: "lumpSum",
          label: "Lump Sum Payment",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
        },
        {
          name: "recastFee",
          label: "Recast Fee",
          type: "number",
          placeholder: "e.g. 250",
          prefix: "$",
          defaultValue: 250,
        },
      ],
      calculate: (inputs) => {
        const balance = parseFloat(inputs.currentBalance as string);
        const rate = parseFloat(inputs.interestRate as string);
        const months = parseFloat(inputs.remainingMonths as string);
        const lumpSum = parseFloat(inputs.lumpSum as string);
        const fee = parseFloat(inputs.recastFee as string) || 0;

        if (!balance || balance <= 0 || !rate || !months || months <= 0 || !lumpSum || lumpSum <= 0)
          return null;

        if (lumpSum >= balance) return null;

        const monthlyRate = rate / 100 / 12;

        const currentPayment =
          (balance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

        const newBalance = balance - lumpSum;
        const newPayment =
          (newBalance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

        const monthlySavings = currentPayment - newPayment;
        const totalSavingsOverLife = monthlySavings * months;
        const currentTotalCost = currentPayment * months;
        const newTotalCost = newPayment * months + lumpSum + fee;
        const netSavings = currentTotalCost - newTotalCost;

        return {
          primary: { label: "New Monthly Payment", value: `$${formatNumber(newPayment)}` },
          details: [
            { label: "Current monthly payment", value: `$${formatNumber(currentPayment)}` },
            { label: "Monthly savings", value: `$${formatNumber(monthlySavings)}` },
            { label: "New loan balance", value: `$${formatNumber(newBalance)}` },
            { label: "Total interest saved", value: `$${formatNumber(netSavings)}` },
            { label: "Recast fee", value: `$${formatNumber(fee)}` },
            { label: "Payment reduction", value: `${formatNumber((monthlySavings / currentPayment) * 100)}%` },
          ],
          note: "A mortgage recast reamortizes your loan with the same rate and remaining term but a lower balance. Most lenders require a minimum lump sum of $5,000-$10,000. Unlike refinancing, there is no credit check or appraisal.",
        };
      },
    },
    {
      id: "comparison",
      name: "Recast vs Extra Payment",
      description:
        "Compare recasting to simply making extra principal payments",
      fields: [
        {
          name: "currentBalance",
          label: "Current Loan Balance",
          type: "number",
          placeholder: "e.g. 300000",
          prefix: "$",
        },
        {
          name: "interestRate",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g. 6.5",
          suffix: "%",
        },
        {
          name: "remainingMonths",
          label: "Remaining Months on Loan",
          type: "number",
          placeholder: "e.g. 300",
          suffix: "months",
        },
        {
          name: "lumpSum",
          label: "Lump Sum Amount",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
        },
      ],
      calculate: (inputs) => {
        const balance = parseFloat(inputs.currentBalance as string);
        const rate = parseFloat(inputs.interestRate as string);
        const months = parseFloat(inputs.remainingMonths as string);
        const lumpSum = parseFloat(inputs.lumpSum as string);

        if (!balance || balance <= 0 || !rate || !months || !lumpSum || lumpSum <= 0) return null;

        const monthlyRate = rate / 100 / 12;
        const currentPayment = (balance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

        // Recast scenario
        const recastBalance = balance - lumpSum;
        const recastPayment = (recastBalance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
        const recastTotalInterest = recastPayment * months - recastBalance;

        // Extra payment scenario (same monthly payment, shorter term)
        let extraBal = balance - lumpSum;
        let extraMonths = 0;
        let extraTotalInterest = 0;
        while (extraBal > 0 && extraMonths < months) {
          const interest = extraBal * monthlyRate;
          extraTotalInterest += interest;
          const principal = currentPayment - interest;
          extraBal -= principal;
          extraMonths++;
        }

        const monthsSaved = months - extraMonths;

        return {
          primary: { label: "Recast Monthly Payment", value: `$${formatNumber(recastPayment)}` },
          details: [
            { label: "Current payment (kept with extra pay)", value: `$${formatNumber(currentPayment)}` },
            { label: "Recast total interest", value: `$${formatNumber(recastTotalInterest)}` },
            { label: "Extra payment total interest", value: `$${formatNumber(extraTotalInterest)}` },
            { label: "Extra payment months saved", value: `${formatNumber(monthsSaved)} months` },
            { label: "Interest saved with extra payment", value: `$${formatNumber(recastTotalInterest - extraTotalInterest)}` },
          ],
          note: "Recasting lowers your monthly payment but you pay more total interest. Extra payments keep payments the same but you pay off the loan sooner and save more on interest.",
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "loan-calculator", "down-payment-calculator"],
  faq: [
    {
      question: "What is a mortgage recast?",
      answer:
        "A mortgage recast (reamortization) is when you make a lump-sum payment toward your principal and your lender recalculates your monthly payment based on the new lower balance, keeping the same interest rate and remaining term.",
    },
    {
      question: "How is a recast different from refinancing?",
      answer:
        "A recast keeps your existing loan terms (rate, remaining term) and simply lowers the payment after a lump-sum. Refinancing replaces your entire loan with new terms. Recasting costs ~$150-$500 vs thousands for refinancing, requires no credit check or appraisal.",
    },
  ],
  formula:
    "New Payment = (Balance - Lump Sum) x r / (1 - (1 + r)^(-n)), where r = monthly rate, n = remaining months",
};
