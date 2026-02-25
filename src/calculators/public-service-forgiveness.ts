import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const publicServiceForgivenessCalculator: CalculatorDefinition = {
  slug: "public-service-forgiveness-calculator",
  title: "Public Service Loan Forgiveness Calculator",
  description:
    "Free PSLF calculator. Estimate how much student loan debt will be forgiven through Public Service Loan Forgiveness after 120 qualifying monthly payments.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "pslf calculator",
    "public service loan forgiveness",
    "loan forgiveness calculator",
    "student loan forgiveness",
    "pslf eligibility",
    "government loan forgiveness",
  ],
  variants: [
    {
      id: "pslf-estimate",
      name: "PSLF Forgiveness Estimate",
      description: "Estimate your potential PSLF forgiveness amount",
      fields: [
        {
          name: "loanBalance",
          label: "Current Federal Loan Balance",
          type: "number",
          placeholder: "e.g. 80000",
          prefix: "$",
          min: 0,
        },
        {
          name: "interestRate",
          label: "Weighted Avg Interest Rate",
          type: "number",
          placeholder: "e.g. 6.0",
          suffix: "%",
          min: 0,
          max: 10,
          step: 0.01,
        },
        {
          name: "annualIncome",
          label: "Annual Gross Income",
          type: "number",
          placeholder: "e.g. 55000",
          prefix: "$",
          min: 0,
        },
        {
          name: "familySize",
          label: "Family Size",
          type: "select",
          options: [
            { label: "1 (just me)", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
            { label: "5", value: "5" },
          ],
          defaultValue: "1",
        },
        {
          name: "paymentsMade",
          label: "Qualifying Payments Already Made",
          type: "number",
          placeholder: "e.g. 24",
          min: 0,
          max: 120,
        },
        {
          name: "incomeGrowth",
          label: "Expected Annual Income Growth",
          type: "select",
          options: [
            { label: "0% (flat)", value: "0" },
            { label: "2% per year", value: "2" },
            { label: "3% per year", value: "3" },
            { label: "5% per year", value: "5" },
          ],
          defaultValue: "3",
        },
      ],
      calculate: (inputs) => {
        const balance = inputs.loanBalance as number;
        const rate = inputs.interestRate as number;
        const income = inputs.annualIncome as number;
        const familySize = parseInt(inputs.familySize as string) || 1;
        const paymentsMade = (inputs.paymentsMade as number) || 0;
        const incomeGrowth = parseFloat(inputs.incomeGrowth as string) || 3;
        if (!balance || !rate || !income) return null;

        const povertyBase = 15060;
        const povertyPerPerson = 5380;
        const povertyLevel = povertyBase + povertyPerPerson * (familySize - 1);
        const threshold = povertyLevel * 1.5;

        const remainingPayments = 120 - paymentsMade;
        const mr = rate / 100 / 12;

        let currentBalance = balance;
        let totalPaid = 0;
        let currentIncome = income;

        for (let month = 0; month < remainingPayments; month++) {
          if (month > 0 && month % 12 === 0) {
            currentIncome *= 1 + incomeGrowth / 100;
          }
          const discretionary = Math.max(0, currentIncome - threshold);
          const monthlyIDR = (discretionary * 0.10) / 12;
          const interest = currentBalance * mr;
          currentBalance = currentBalance + interest - monthlyIDR;
          totalPaid += monthlyIDR;
        }

        const forgivenAmount = Math.max(0, currentBalance);
        const yearsRemaining = Math.ceil(remainingPayments / 12);

        // Compare with standard repayment
        const n10 = 120;
        const standardMonthly =
          (balance * (mr * Math.pow(1 + mr, n10))) / (Math.pow(1 + mr, n10) - 1);
        const standardTotal = standardMonthly * n10;
        const totalSavings = standardTotal - totalPaid;

        return {
          primary: {
            label: "Estimated Forgiveness Amount",
            value: `$${formatNumber(forgivenAmount)}`,
          },
          details: [
            { label: "Qualifying payments remaining", value: `${remainingPayments} payments` },
            { label: "Years until forgiveness", value: `${yearsRemaining} years` },
            { label: "Total you will pay", value: `$${formatNumber(totalPaid)}` },
            { label: "Standard repayment total", value: `$${formatNumber(standardTotal)}` },
            { label: "Total savings vs standard", value: `$${formatNumber(Math.max(0, totalSavings))}` },
            { label: "Forgiveness is tax-free", value: "Yes (PSLF)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["income-driven-repayment-calculator", "student-loan-refinance-calculator"],
  faq: [
    {
      question: "What is Public Service Loan Forgiveness?",
      answer:
        "PSLF forgives the remaining balance on Direct Loans after 120 qualifying monthly payments (10 years) while working full-time for a qualifying employer such as government agencies, nonprofits, or certain public service organizations.",
    },
    {
      question: "Who qualifies for PSLF?",
      answer:
        "You must have Direct Loans (or consolidate into Direct Loans), be on an income-driven repayment plan, work full-time for a qualifying public service employer, and make 120 qualifying monthly payments.",
    },
    {
      question: "Is PSLF forgiveness taxable?",
      answer:
        "No. Unlike IDR forgiveness, PSLF forgiveness is always tax-free under current law. This makes PSLF especially valuable for borrowers with large balances who work in public service.",
    },
  ],
  formula:
    "Simulate 120 payments under IDR (10% discretionary income). Forgiveness = Remaining balance after 120 payments.",
};
