import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const incomeDrivenRepaymentCalculator: CalculatorDefinition = {
  slug: "income-driven-repayment-calculator",
  title: "Income-Driven Repayment Calculator",
  description:
    "Free income-driven repayment (IDR) calculator. Estimate monthly payments under SAVE, IBR, PAYE, and ICR plans based on your income, family size, and loan balance.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "income driven repayment calculator",
    "idr calculator",
    "save plan calculator",
    "ibr calculator",
    "paye calculator",
    "student loan repayment plan",
  ],
  variants: [
    {
      id: "idr-estimate",
      name: "IDR Payment Estimate",
      description: "Estimate payments under income-driven repayment plans",
      fields: [
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
            { label: "6", value: "6" },
          ],
          defaultValue: "1",
        },
        {
          name: "loanBalance",
          label: "Total Federal Loan Balance",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          min: 0,
        },
        {
          name: "loanRate",
          label: "Weighted Avg Interest Rate",
          type: "number",
          placeholder: "e.g. 5.5",
          suffix: "%",
          min: 0,
          max: 10,
          step: 0.01,
        },
        {
          name: "plan",
          label: "IDR Plan",
          type: "select",
          options: [
            { label: "SAVE (5-10% discretionary)", value: "save" },
            { label: "IBR (10-15% discretionary)", value: "ibr" },
            { label: "PAYE (10% discretionary)", value: "paye" },
            { label: "ICR (20% discretionary)", value: "icr" },
          ],
          defaultValue: "save",
        },
      ],
      calculate: (inputs) => {
        const income = inputs.annualIncome as number;
        const familySize = parseInt(inputs.familySize as string) || 1;
        const balance = inputs.loanBalance as number;
        const rate = inputs.loanRate as number;
        const plan = inputs.plan as string;
        if (!income || !balance || !rate) return null;

        // 2024 poverty guidelines (approximate, 150% used for IDR)
        const povertyBase = 15060;
        const povertyPerPerson = 5380;
        const povertyLevel = povertyBase + povertyPerPerson * (familySize - 1);
        const threshold = povertyLevel * 1.5;

        const discretionaryIncome = Math.max(0, income - threshold);

        let paymentPct: number;
        let forgivenessYears: number;
        switch (plan) {
          case "save":
            paymentPct = balance <= 12000 ? 0.05 : 0.10;
            forgivenessYears = balance <= 12000 ? 10 : 20;
            break;
          case "ibr":
            paymentPct = 0.10; // new borrower rate
            forgivenessYears = 20;
            break;
          case "paye":
            paymentPct = 0.10;
            forgivenessYears = 20;
            break;
          case "icr":
            paymentPct = 0.20;
            forgivenessYears = 25;
            break;
          default:
            paymentPct = 0.10;
            forgivenessYears = 20;
        }

        const annualPayment = discretionaryIncome * paymentPct;
        const monthlyIDR = annualPayment / 12;

        // Standard 10-year payment for comparison
        const mr = rate / 100 / 12;
        const n10 = 120;
        const standardMonthly =
          (balance * (mr * Math.pow(1 + mr, n10))) / (Math.pow(1 + mr, n10) - 1);

        const totalIDR = monthlyIDR * forgivenessYears * 12;
        const totalStandard = standardMonthly * 120;
        const estimatedForgiveness = Math.max(0, balance + (balance * rate / 100 * forgivenessYears * 0.5) - totalIDR);

        return {
          primary: {
            label: "Estimated Monthly IDR Payment",
            value: `$${formatNumber(monthlyIDR)}`,
          },
          details: [
            { label: "Standard 10-year payment", value: `$${formatNumber(standardMonthly)}` },
            { label: "Monthly savings vs standard", value: `$${formatNumber(Math.max(0, standardMonthly - monthlyIDR))}` },
            { label: "Discretionary income", value: `$${formatNumber(discretionaryIncome)}` },
            { label: "150% poverty guideline", value: `$${formatNumber(threshold)}` },
            { label: "Forgiveness timeline", value: `${forgivenessYears} years` },
            { label: "Estimated total paid", value: `$${formatNumber(totalIDR)}` },
            { label: "Potential forgiveness amount", value: `$${formatNumber(estimatedForgiveness)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["public-service-forgiveness-calculator", "student-loan-refinance-calculator"],
  faq: [
    {
      question: "What is income-driven repayment?",
      answer:
        "Income-driven repayment (IDR) plans cap your federal student loan payments at a percentage of your discretionary income (income above 150% of poverty level). After 20-25 years of payments, any remaining balance is forgiven.",
    },
    {
      question: "Which IDR plan is best?",
      answer:
        "The SAVE plan generally offers the lowest payments (5-10% of discretionary income) and the shortest forgiveness timeline for smaller balances. PAYE and IBR are similar at 10%. ICR has the highest payments at 20%.",
    },
    {
      question: "Is forgiven debt taxable?",
      answer:
        "Under current law through 2025, forgiven student loan debt is not taxable. After 2025, forgiveness under IDR plans may be treated as taxable income unless Congress extends the exclusion. PSLF forgiveness is always tax-free.",
    },
  ],
  formula:
    "Monthly IDR = (Income - 150% x Poverty Level) x Payment% / 12. Forgiveness after 20-25 years depending on plan.",
};
