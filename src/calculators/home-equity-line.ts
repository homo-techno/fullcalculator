import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeEquityLineCalculator: CalculatorDefinition = {
  slug: "home-equity-line-calculator",
  title: "Home Equity Line Calculator",
  description:
    "Free HELOC calculator. Estimate your available credit line, monthly interest payments, and total cost during the draw and repayment periods of a home equity line of credit.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "heloc calculator",
    "home equity line of credit",
    "heloc payment calculator",
    "equity line calculator",
    "heloc interest",
    "home equity credit line",
  ],
  variants: [
    {
      id: "heloc-payment",
      name: "HELOC Payment Estimate",
      description: "Estimate HELOC draw period and repayment payments",
      fields: [
        {
          name: "homeValue",
          label: "Current Home Value",
          type: "number",
          placeholder: "e.g. 500000",
          prefix: "$",
          min: 0,
        },
        {
          name: "mortgageBalance",
          label: "Current Mortgage Balance",
          type: "number",
          placeholder: "e.g. 300000",
          prefix: "$",
          min: 0,
        },
        {
          name: "ltvLimit",
          label: "Max Combined LTV",
          type: "select",
          options: [
            { label: "80%", value: "80" },
            { label: "85%", value: "85" },
            { label: "90%", value: "90" },
          ],
          defaultValue: "80",
        },
        {
          name: "drawAmount",
          label: "Amount You Want to Draw",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          min: 0,
        },
        {
          name: "helocRate",
          label: "HELOC Interest Rate",
          type: "number",
          placeholder: "e.g. 8.5",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "repaymentPeriod",
          label: "Repayment Period",
          type: "select",
          options: [
            { label: "10 years", value: "10" },
            { label: "15 years", value: "15" },
            { label: "20 years", value: "20" },
          ],
          defaultValue: "15",
        },
      ],
      calculate: (inputs) => {
        const homeValue = inputs.homeValue as number;
        const mortgageBalance = (inputs.mortgageBalance as number) || 0;
        const ltvLimit = parseFloat(inputs.ltvLimit as string) || 80;
        const drawAmount = inputs.drawAmount as number;
        const rate = inputs.helocRate as number;
        const repayYears = parseInt(inputs.repaymentPeriod as string) || 15;
        if (!homeValue || !drawAmount || !rate) return null;

        const maxCredit = homeValue * (ltvLimit / 100) - mortgageBalance;
        const availableCredit = Math.max(0, maxCredit);
        const actualDraw = Math.min(drawAmount, availableCredit);

        const monthlyRate = rate / 100 / 12;
        const interestOnlyPayment = actualDraw * monthlyRate;

        const n = repayYears * 12;
        const repaymentPayment =
          (actualDraw * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
          (Math.pow(1 + monthlyRate, n) - 1);
        const totalRepaid = repaymentPayment * n;
        const totalInterest = totalRepaid - actualDraw;

        return {
          primary: {
            label: "Interest-Only Draw Payment",
            value: `$${formatNumber(interestOnlyPayment)}`,
          },
          details: [
            { label: "Maximum available credit line", value: `$${formatNumber(availableCredit)}` },
            { label: "Actual draw amount", value: `$${formatNumber(actualDraw)}` },
            { label: "Full repayment monthly payment", value: `$${formatNumber(repaymentPayment)}` },
            { label: "Total interest over repayment", value: `$${formatNumber(totalInterest)}` },
            { label: "Total amount repaid", value: `$${formatNumber(totalRepaid)}` },
            { label: "Home equity remaining", value: `$${formatNumber(homeValue - mortgageBalance - actualDraw)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-equity-loan-calculator", "mortgage-calculator"],
  faq: [
    {
      question: "What is the difference between a HELOC and a home equity loan?",
      answer:
        "A HELOC is a revolving credit line you can draw from as needed, similar to a credit card, with variable rates. A home equity loan is a lump-sum loan with fixed monthly payments and a fixed rate.",
    },
    {
      question: "How much can I borrow with a HELOC?",
      answer:
        "Most lenders allow a combined loan-to-value ratio of 80-90%. Your HELOC limit equals (Home Value x LTV%) minus your mortgage balance. For a $500K home with $300K owed at 80% LTV, that's $100K.",
    },
    {
      question: "What are the draw and repayment periods?",
      answer:
        "A typical HELOC has a 10-year draw period where you make interest-only payments, followed by a 10-20 year repayment period where you pay principal and interest. Some HELOCs allow renewal.",
    },
  ],
  formula:
    "Max Credit = (Home Value x LTV%) - Mortgage Balance. Interest-only payment = Balance x Monthly Rate. Repayment = standard amortization formula.",
};
