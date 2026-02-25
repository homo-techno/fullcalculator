import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const balanceTransferCalculator: CalculatorDefinition = {
  slug: "balance-transfer-calculator",
  title: "Balance Transfer Calculator",
  description:
    "Free balance transfer calculator. See how much you can save by transferring credit card balances to a 0% APR card, including transfer fees and post-promo interest.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "balance transfer calculator",
    "0 apr calculator",
    "credit card transfer",
    "balance transfer savings",
    "balance transfer fee calculator",
    "credit card balance transfer",
  ],
  variants: [
    {
      id: "balance-transfer-savings",
      name: "Balance Transfer Savings",
      description: "Calculate savings from a balance transfer",
      fields: [
        {
          name: "currentBalance",
          label: "Current Credit Card Balance",
          type: "number",
          placeholder: "e.g. 10000",
          prefix: "$",
          min: 0,
        },
        {
          name: "currentAPR",
          label: "Current APR",
          type: "number",
          placeholder: "e.g. 24.99",
          suffix: "%",
          min: 0,
          max: 40,
          step: 0.01,
        },
        {
          name: "transferFee",
          label: "Balance Transfer Fee",
          type: "select",
          options: [
            { label: "0%", value: "0" },
            { label: "3%", value: "3" },
            { label: "4%", value: "4" },
            { label: "5%", value: "5" },
          ],
          defaultValue: "3",
        },
        {
          name: "promoPeriod",
          label: "0% APR Promo Period",
          type: "select",
          options: [
            { label: "6 months", value: "6" },
            { label: "12 months", value: "12" },
            { label: "15 months", value: "15" },
            { label: "18 months", value: "18" },
            { label: "21 months", value: "21" },
          ],
          defaultValue: "15",
        },
        {
          name: "monthlyPayment",
          label: "Monthly Payment You Can Make",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          min: 0,
        },
        {
          name: "postPromoAPR",
          label: "Post-Promo APR",
          type: "number",
          placeholder: "e.g. 22.99",
          suffix: "%",
          min: 0,
          max: 40,
          step: 0.01,
        },
      ],
      calculate: (inputs) => {
        const balance = inputs.currentBalance as number;
        const currentAPR = inputs.currentAPR as number;
        const transferFeePct = parseFloat(inputs.transferFee as string) || 3;
        const promoMonths = parseInt(inputs.promoPeriod as string) || 15;
        const payment = inputs.monthlyPayment as number;
        const postAPR = inputs.postPromoAPR as number;
        if (!balance || !currentAPR || !payment || !postAPR) return null;

        const transferFee = balance * (transferFeePct / 100);
        const newBalance = balance + transferFee;

        // Scenario 1: Keep current card
        const currentMR = currentAPR / 100 / 12;
        let bal1 = balance;
        let months1 = 0;
        let interest1 = 0;
        while (bal1 > 0 && months1 < 600) {
          const int = bal1 * currentMR;
          interest1 += int;
          bal1 = bal1 + int - payment;
          months1++;
          if (bal1 < 0) bal1 = 0;
        }

        // Scenario 2: Balance transfer
        let bal2 = newBalance;
        let months2 = 0;
        let interest2 = 0;
        const postMR = postAPR / 100 / 12;
        while (bal2 > 0 && months2 < 600) {
          const int = months2 < promoMonths ? 0 : bal2 * postMR;
          interest2 += int;
          bal2 = bal2 + int - payment;
          months2++;
          if (bal2 < 0) bal2 = 0;
        }

        const totalCost1 = balance + interest1;
        const totalCost2 = newBalance + interest2;
        const savings = totalCost1 - totalCost2;
        const paidOffDuringPromo = months2 <= promoMonths;

        return {
          primary: {
            label: "Total Interest Savings",
            value: `$${formatNumber(Math.max(0, savings))}`,
          },
          details: [
            { label: "Balance transfer fee", value: `$${formatNumber(transferFee)}` },
            { label: "Current card total interest", value: `$${formatNumber(interest1)}` },
            { label: "Transfer card total interest", value: `$${formatNumber(interest2)}` },
            { label: "Current card payoff time", value: `${months1} months` },
            { label: "Transfer card payoff time", value: `${months2} months` },
            { label: "Paid off during promo?", value: paidOffDuringPromo ? "Yes" : "No" },
            { label: "Net savings after transfer fee", value: `$${formatNumber(Math.max(0, savings))}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["credit-card-payoff-calculator", "consolidation-loan-calculator"],
  faq: [
    {
      question: "How does a balance transfer work?",
      answer:
        "A balance transfer moves your credit card debt to a new card with a 0% introductory APR, typically for 12-21 months. You pay a transfer fee (usually 3-5%) but save on interest during the promotional period.",
    },
    {
      question: "Should I do a balance transfer?",
      answer:
        "A balance transfer makes sense if you can pay off most or all of the balance during the 0% promo period and the transfer fee is less than the interest you'd otherwise pay. Avoid accumulating new debt on either card.",
    },
    {
      question: "What happens after the promotional period?",
      answer:
        "After the promotional period ends, the remaining balance accrues interest at the card's regular APR (often 20-25%). Any balance you haven't paid off will start generating interest charges immediately.",
    },
  ],
  formula:
    "Iterative: simulate monthly payments at 0% during promo, then at regular APR. Compare total interest vs. keeping current card.",
};
