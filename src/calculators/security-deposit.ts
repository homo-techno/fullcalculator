import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const securityDepositCalculator: CalculatorDefinition = {
  slug: "security-deposit-calculator",
  title: "Security Deposit Calculator",
  description:
    "Free security deposit calculator. Estimate your security deposit amount, calculate interest earned on deposits, and understand move-in costs for renters.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "security deposit calculator",
    "rental deposit calculator",
    "move in cost calculator",
    "security deposit interest",
    "apartment deposit calculator",
  ],
  variants: [
    {
      id: "move-in",
      name: "Move-In Cost Estimate",
      description: "Calculate total upfront move-in costs",
      fields: [
        { name: "monthlyRent", label: "Monthly Rent", type: "number", placeholder: "e.g. 1800", prefix: "$", min: 0 },
        {
          name: "depositMultiple",
          label: "Security Deposit Amount",
          type: "select",
          options: [
            { label: "1 month's rent", value: "1" },
            { label: "1.5 months' rent", value: "1.5" },
            { label: "2 months' rent", value: "2" },
            { label: "3 months' rent", value: "3" },
          ],
          defaultValue: "1",
        },
        {
          name: "firstLast",
          label: "First/Last Month Required",
          type: "select",
          options: [
            { label: "First month only", value: "first" },
            { label: "First and last month", value: "both" },
          ],
          defaultValue: "first",
        },
        { name: "otherFees", label: "Other Move-In Fees (pet, application, etc.)", type: "number", placeholder: "e.g. 300", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const rent = inputs.monthlyRent as number;
        const multiple = parseFloat(inputs.depositMultiple as string) || 1;
        const firstLast = inputs.firstLast as string;
        const fees = (inputs.otherFees as number) || 0;
        if (!rent) return null;

        const deposit = rent * multiple;
        const rentDue = firstLast === "both" ? rent * 2 : rent;
        const total = deposit + rentDue + fees;

        return {
          primary: { label: "Total Move-In Cost", value: `$${formatNumber(total)}` },
          details: [
            { label: "Security deposit", value: `$${formatNumber(deposit)}` },
            { label: "Rent due at signing", value: `$${formatNumber(rentDue)}` },
            { label: "Other fees", value: `$${formatNumber(fees)}` },
            { label: "Monthly rent", value: `$${formatNumber(rent)}` },
          ],
          note: `Security deposit = ${multiple}× monthly rent. Check local laws for maximum deposit limits.`,
        };
      },
    },
    {
      id: "deposit-interest",
      name: "Deposit Interest",
      description: "Calculate interest owed on a security deposit (required in some states)",
      fields: [
        { name: "depositAmount", label: "Security Deposit Amount", type: "number", placeholder: "e.g. 1800", prefix: "$", min: 0 },
        { name: "interestRate", label: "Annual Interest Rate", type: "number", placeholder: "e.g. 1.5", suffix: "%", min: 0, max: 10, step: 0.01 },
        { name: "months", label: "Months Held", type: "number", placeholder: "e.g. 24", suffix: "months", min: 1, max: 360, step: 1 },
      ],
      calculate: (inputs) => {
        const deposit = inputs.depositAmount as number;
        const rate = inputs.interestRate as number;
        const months = inputs.months as number;
        if (!deposit || rate === undefined || !months) return null;

        const monthlyRate = rate / 100 / 12;
        const interest = deposit * monthlyRate * months;
        const totalReturn = deposit + interest;

        return {
          primary: { label: "Interest Owed to Tenant", value: `$${formatNumber(interest)}` },
          details: [
            { label: "Original deposit", value: `$${formatNumber(deposit)}` },
            { label: "Total return to tenant", value: `$${formatNumber(totalReturn)}` },
            { label: "Period held", value: `${months} months` },
            { label: "Annual interest rate", value: `${formatNumber(rate, 2)}%` },
          ],
          note: "Some states and cities require landlords to pay interest on security deposits and hold them in separate accounts.",
        };
      },
    },
  ],
  relatedSlugs: ["rent-affordability-calculator", "rent-increase-calculator", "moving-estimate-calculator"],
  faq: [
    {
      question: "How much is a typical security deposit?",
      answer:
        "A typical security deposit is 1-2 months' rent, though it varies by state law. Many states cap deposits: California limits it to 1 month for unfurnished units, while other states may allow up to 3 months.",
    },
    {
      question: "Do landlords have to pay interest on security deposits?",
      answer:
        "In some states and cities, yes. For example, Illinois, Maryland, and New York City require landlords to hold deposits in interest-bearing accounts and pay tenants the earned interest. Check your local laws.",
    },
    {
      question: "When do I get my security deposit back?",
      answer:
        "Most states require landlords to return the deposit within 14-60 days after move-out. Deductions for damages beyond normal wear and tear must be itemized. Cleaning fees are generally not deductible from deposits unless the unit was left excessively dirty.",
    },
  ],
  formula:
    "Total Move-In = Security Deposit + First/Last Month Rent + Fees | Deposit Interest = Deposit × (Annual Rate / 12) × Months",
};
