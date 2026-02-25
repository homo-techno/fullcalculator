import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const landLoanCalculator: CalculatorDefinition = {
  slug: "land-loan-calculator",
  title: "Land Loan Calculator",
  description:
    "Free land loan calculator. Estimate monthly payments for raw land, unimproved, or improved lot purchases with typical land loan rates and terms.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "land loan calculator",
    "lot loan calculator",
    "land purchase loan",
    "raw land financing",
    "land mortgage calculator",
  ],
  variants: [
    {
      id: "land-payment",
      name: "Land Loan Payment",
      description: "Calculate monthly payment for a land loan",
      fields: [
        {
          name: "landPrice",
          label: "Land Purchase Price",
          type: "number",
          placeholder: "e.g. 150000",
          prefix: "$",
          min: 0,
        },
        {
          name: "downPayment",
          label: "Down Payment",
          type: "number",
          placeholder: "e.g. 30000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g. 7.5",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "landType",
          label: "Land Type",
          type: "select",
          options: [
            { label: "Improved lot (utilities available)", value: "improved" },
            { label: "Unimproved land", value: "unimproved" },
            { label: "Raw land", value: "raw" },
          ],
          defaultValue: "improved",
        },
        {
          name: "term",
          label: "Loan Term",
          type: "select",
          options: [
            { label: "5 years", value: "5" },
            { label: "10 years", value: "10" },
            { label: "15 years", value: "15" },
            { label: "20 years", value: "20" },
          ],
          defaultValue: "15",
        },
      ],
      calculate: (inputs) => {
        const price = inputs.landPrice as number;
        const down = (inputs.downPayment as number) || 0;
        const rate = inputs.rate as number;
        const landType = inputs.landType as string;
        const years = parseInt(inputs.term as string) || 15;
        if (!price || !rate) return null;

        const loan = price - down;
        const downPct = (down / price) * 100;
        const monthlyRate = rate / 100 / 12;
        const payments = years * 12;
        const monthly =
          (loan * (monthlyRate * Math.pow(1 + monthlyRate, payments))) /
          (Math.pow(1 + monthlyRate, payments) - 1);
        const totalPaid = monthly * payments;
        const totalInterest = totalPaid - loan;
        const typicalDown = landType === "raw" ? "50%" : landType === "unimproved" ? "30-50%" : "20-30%";

        return {
          primary: {
            label: "Monthly Payment",
            value: `$${formatNumber(monthly)}`,
          },
          details: [
            { label: "Loan amount", value: `$${formatNumber(loan)}` },
            { label: "Down payment", value: `${formatNumber(downPct)}` + "%" },
            { label: "Typical down for this type", value: typicalDown },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total paid", value: `$${formatNumber(totalPaid)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["construction-loan-calculator", "mortgage-calculator"],
  faq: [
    {
      question: "How are land loans different from mortgages?",
      answer:
        "Land loans typically have higher interest rates (1-3% more), shorter terms (5-20 years vs 30), and require larger down payments (20-50%) because undeveloped land is considered higher risk by lenders.",
    },
    {
      question: "What types of land loans exist?",
      answer:
        "Raw land loans (no utilities/roads, hardest to get), unimproved land loans (some infrastructure), and improved lot loans (utilities available, easiest to finance). Each has different requirements.",
    },
    {
      question: "Can I use a land loan to build?",
      answer:
        "A land loan only covers the purchase. To build, you would need a separate construction loan or a land-and-construction combo loan that covers both the purchase and building costs.",
    },
  ],
  formula: "M = P[r(1+r)^n] / [(1+r)^n - 1]",
};
