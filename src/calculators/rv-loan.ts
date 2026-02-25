import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rvLoanCalculator: CalculatorDefinition = {
  slug: "rv-loan-calculator",
  title: "RV Loan Calculator",
  description:
    "Free RV loan calculator. Estimate monthly payments, total interest, and total cost for financing a recreational vehicle with various loan terms and down payments.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "rv loan calculator",
    "rv financing calculator",
    "recreational vehicle loan",
    "motorhome loan calculator",
    "camper loan calculator",
    "rv payment calculator",
  ],
  variants: [
    {
      id: "rv-loan-payment",
      name: "RV Loan Payment",
      description: "Calculate monthly payments for an RV loan",
      fields: [
        {
          name: "rvPrice",
          label: "RV Purchase Price",
          type: "number",
          placeholder: "e.g. 75000",
          prefix: "$",
          min: 0,
        },
        {
          name: "downPayment",
          label: "Down Payment",
          type: "number",
          placeholder: "e.g. 15000",
          prefix: "$",
          min: 0,
        },
        {
          name: "interestRate",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g. 7.0",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "term",
          label: "Loan Term",
          type: "select",
          options: [
            { label: "5 years", value: "5" },
            { label: "7 years", value: "7" },
            { label: "10 years", value: "10" },
            { label: "12 years", value: "12" },
            { label: "15 years", value: "15" },
            { label: "20 years", value: "20" },
          ],
          defaultValue: "10",
        },
        {
          name: "rvType",
          label: "RV Type",
          type: "select",
          options: [
            { label: "Class A Motorhome", value: "classA" },
            { label: "Class B Van", value: "classB" },
            { label: "Class C Motorhome", value: "classC" },
            { label: "Travel Trailer", value: "trailer" },
            { label: "Fifth Wheel", value: "fifthwheel" },
          ],
          defaultValue: "classC",
        },
      ],
      calculate: (inputs) => {
        const price = inputs.rvPrice as number;
        const down = (inputs.downPayment as number) || 0;
        const rate = inputs.interestRate as number;
        const years = parseInt(inputs.term as string) || 10;
        if (!price || !rate) return null;

        const loanAmount = price - down;
        if (loanAmount <= 0) return null;

        const mr = rate / 100 / 12;
        const n = years * 12;
        const monthly =
          (loanAmount * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);
        const totalPaid = monthly * n;
        const totalInterest = totalPaid - loanAmount;
        const downPct = (down / price) * 100;

        return {
          primary: {
            label: "Monthly Payment",
            value: `$${formatNumber(monthly)}`,
          },
          details: [
            { label: "Loan amount", value: `$${formatNumber(loanAmount)}` },
            { label: "Down payment percentage", value: `${formatNumber(downPct)}%` },
            { label: "Total interest paid", value: `$${formatNumber(totalInterest)}` },
            { label: "Total loan repayment", value: `$${formatNumber(totalPaid)}` },
            { label: "Total cost", value: `$${formatNumber(totalPaid + down)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["boat-loan-calculator", "personal-loan-calculator"],
  faq: [
    {
      question: "What credit score do I need for an RV loan?",
      answer:
        "Most RV lenders prefer a credit score of 660 or higher for the best rates. Some lenders work with scores as low as 550, but expect higher rates. Scores above 700 typically get the most competitive terms.",
    },
    {
      question: "How long can you finance an RV?",
      answer:
        "RV loans can range from 5 to 20 years depending on the loan amount and RV type. Loans over $50,000 for newer RVs may qualify for terms up to 20 years. Longer terms mean lower payments but more interest.",
    },
    {
      question: "Is RV loan interest tax deductible?",
      answer:
        "If your RV has sleeping, cooking, and bathroom facilities, it may qualify as a second home, making the loan interest potentially tax deductible. Consult a tax professional for your specific situation.",
    },
  ],
  formula: "Monthly = L[r(1+r)^n]/[(1+r)^n - 1] where L = RV Price - Down Payment",
};
