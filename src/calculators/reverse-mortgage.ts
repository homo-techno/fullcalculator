import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const reverseMortgageCalculator: CalculatorDefinition = {
  slug: "reverse-mortgage-calculator",
  title: "Reverse Mortgage Calculator",
  description:
    "Free reverse mortgage calculator. Estimate how much you can borrow with a reverse mortgage (HECM), monthly payments, and how your loan balance grows over time.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "reverse mortgage calculator",
    "HECM calculator",
    "reverse mortgage estimator",
    "how much reverse mortgage can I get",
    "reverse mortgage amount",
  ],
  variants: [
    {
      id: "estimate",
      name: "Reverse Mortgage Estimate",
      description: "Estimate available reverse mortgage proceeds",
      fields: [
        { name: "homeValue", label: "Home Value", type: "number", placeholder: "e.g. 400000", prefix: "$", min: 0 },
        { name: "mortgageBalance", label: "Current Mortgage Balance", type: "number", placeholder: "e.g. 50000", prefix: "$", min: 0 },
        {
          name: "age",
          label: "Youngest Borrower Age",
          type: "select",
          options: [
            { label: "62 years", value: "62" },
            { label: "65 years", value: "65" },
            { label: "70 years", value: "70" },
            { label: "75 years", value: "75" },
            { label: "80 years", value: "80" },
            { label: "85 years", value: "85" },
            { label: "90 years", value: "90" },
          ],
          defaultValue: "70",
        },
        { name: "rate", label: "Expected Interest Rate", type: "number", placeholder: "e.g. 6.5", suffix: "%", min: 0, max: 15, step: 0.01 },
      ],
      calculate: (inputs) => {
        const homeValue = inputs.homeValue as number;
        const balance = (inputs.mortgageBalance as number) || 0;
        const age = parseInt(inputs.age as string) || 70;
        const rate = inputs.rate as number;
        if (!homeValue || !rate) return null;

        // HECM lending limit
        const maxClaimAmount = Math.min(homeValue, 1149825); // 2024 FHA limit

        // Principal limit factor (PLF) - simplified approximation based on age and rate
        // PLFs increase with age and decrease with rate. These are rough estimates.
        const basePLF = 0.30 + (age - 62) * 0.012;
        const rateAdj = Math.max(0, (6 - rate) * 0.03);
        const plf = Math.min(0.75, Math.max(0.20, basePLF + rateAdj));

        const grossProceeds = maxClaimAmount * plf;
        const originationFee = Math.min(6000, Math.max(2500, maxClaimAmount * 0.02));
        const closingCosts = originationFee + 3000; // origination + other closing costs
        const upfrontMIP = maxClaimAmount * 0.02; // 2% upfront mortgage insurance
        const netProceeds = grossProceeds - closingCosts - upfrontMIP - balance;

        return {
          primary: { label: "Estimated Net Proceeds", value: `$${formatNumber(Math.max(0, netProceeds))}` },
          details: [
            { label: "Home value", value: `$${formatNumber(homeValue)}` },
            { label: "Max claim amount", value: `$${formatNumber(maxClaimAmount)}` },
            { label: "Principal limit factor", value: `${formatNumber(plf * 100, 1)}%` },
            { label: "Gross available", value: `$${formatNumber(grossProceeds)}` },
            { label: "Less closing costs", value: `−$${formatNumber(closingCosts)}` },
            { label: "Less upfront MIP (2%)", value: `−$${formatNumber(upfrontMIP)}` },
            { label: "Less existing mortgage", value: `−$${formatNumber(balance)}` },
          ],
          note: age < 62 ? "You must be at least 62 years old to qualify for a reverse mortgage (HECM)." : netProceeds < 0 ? "Existing mortgage balance is too high. You may not qualify or proceeds would only pay off the existing loan." : undefined,
        };
      },
    },
    {
      id: "balance-growth",
      name: "Loan Balance Over Time",
      description: "See how a reverse mortgage balance grows over time",
      fields: [
        { name: "initialBalance", label: "Initial Loan Balance / Draw", type: "number", placeholder: "e.g. 150000", prefix: "$", min: 0 },
        { name: "monthlyDraw", label: "Monthly Draw (if taking payments)", type: "number", placeholder: "e.g. 1000", prefix: "$", min: 0 },
        { name: "rate", label: "Interest Rate", type: "number", placeholder: "e.g. 6.5", suffix: "%", min: 0, max: 15, step: 0.01 },
        {
          name: "years",
          label: "Projection Period",
          type: "select",
          options: [
            { label: "5 years", value: "5" },
            { label: "10 years", value: "10" },
            { label: "15 years", value: "15" },
            { label: "20 years", value: "20" },
            { label: "25 years", value: "25" },
          ],
          defaultValue: "10",
        },
      ],
      calculate: (inputs) => {
        const initial = inputs.initialBalance as number;
        const monthly = (inputs.monthlyDraw as number) || 0;
        const rate = inputs.rate as number;
        const years = parseInt(inputs.years as string) || 10;
        if (!initial || !rate) return null;

        const monthlyRate = rate / 100 / 12;
        const mipRate = 0.005 / 12; // 0.5% annual MIP
        const effectiveRate = monthlyRate + mipRate;
        const months = years * 12;

        let balance = initial;
        for (let i = 0; i < months; i++) {
          balance = balance * (1 + effectiveRate) + monthly;
        }

        const totalDrawn = initial + monthly * months;
        const totalInterestAndMIP = balance - totalDrawn;

        return {
          primary: { label: `Loan Balance After ${years} Years`, value: `$${formatNumber(balance)}` },
          details: [
            { label: "Initial balance", value: `$${formatNumber(initial)}` },
            { label: "Total monthly draws", value: `$${formatNumber(monthly * months)}` },
            { label: "Total cash received", value: `$${formatNumber(totalDrawn)}` },
            { label: "Accrued interest + MIP", value: `$${formatNumber(totalInterestAndMIP)}` },
            { label: "Interest rate + MIP", value: `${formatNumber(rate + 0.5, 2)}%` },
            { label: "Balance doubled in", value: `~${formatNumber(72 / (rate + 0.5), 1)} years (Rule of 72)` },
          ],
          note: "With a reverse mortgage you never owe more than the home's value (non-recourse). The balance is repaid when you sell, move out, or pass away.",
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "home-equity-calculator", "home-value-calculator"],
  faq: [
    {
      question: "What is a reverse mortgage?",
      answer:
        "A reverse mortgage (HECM - Home Equity Conversion Mortgage) allows homeowners 62+ to convert home equity into cash without monthly payments. You can receive a lump sum, monthly payments, or a line of credit. The loan is repaid when you sell, permanently move out, or pass away.",
    },
    {
      question: "How much can I get from a reverse mortgage?",
      answer:
        "The amount depends on your age, home value, interest rates, and current mortgage balance. Generally, you can access 40-75% of your home's value. Older borrowers and those with lower interest rates receive more. The FHA lending limit caps the home value used in calculations.",
    },
    {
      question: "Do I still own my home with a reverse mortgage?",
      answer:
        "Yes, you retain ownership and title. You must continue to pay property taxes, homeowner's insurance, and maintain the home. You can never owe more than the home is worth (non-recourse). Your heirs can keep the home by paying off the loan balance or 95% of the appraised value.",
    },
  ],
  formula:
    "Net Proceeds = (Home Value × PLF) − Closing Costs − MIP − Existing Mortgage | Balance Growth: B(t) = B(t-1) × (1 + r/12 + MIP/12) + Monthly Draw",
};
