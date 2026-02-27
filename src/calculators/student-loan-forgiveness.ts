import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const studentLoanForgivenessCalculator: CalculatorDefinition = {
  slug: "student-loan-forgiveness",
  title: "Student Loan Forgiveness Eligibility Calculator",
  description:
    "Evaluate your eligibility for student loan forgiveness programs including PSLF, IDR forgiveness, and teacher loan forgiveness. Estimate potential savings.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "student loan",
    "forgiveness",
    "PSLF",
    "IDR",
    "income-driven repayment",
    "teacher forgiveness",
    "public service",
    "loan discharge",
    "federal loans",
  ],
  variants: [
    {
      slug: "pslf-estimate",
      title: "PSLF Forgiveness Estimate",
      fields: [
        {
          name: "loanBalance",
          label: "Current Loan Balance ($)",
          type: "number",
        },
        {
          name: "monthlyPayment",
          label: "Current Monthly IDR Payment ($)",
          type: "number",
        },
        {
          name: "qualifyingPayments",
          label: "Qualifying Payments Made So Far",
          type: "number",
        },
        {
          name: "interestRate",
          label: "Average Interest Rate (%)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const balance = parseFloat(inputs.loanBalance as string);
        const payment = parseFloat(inputs.monthlyPayment as string);
        const paymentsMade = parseFloat(inputs.qualifyingPayments as string);
        const rate = parseFloat(inputs.interestRate as string);
        if (isNaN(balance) || isNaN(payment) || isNaN(paymentsMade) || isNaN(rate))
          return { error: "Please enter all values." };

        const remainingPayments = Math.max(0, 120 - paymentsMade);
        const remainingYears = remainingPayments / 12;
        const totalPaidRemaining = payment * remainingPayments;
        const totalPaidSoFar = payment * paymentsMade;

        const monthlyRate = rate / 100 / 12;
        let projectedBalance = balance;
        for (let i = 0; i < remainingPayments; i++) {
          const interest = projectedBalance * monthlyRate;
          projectedBalance = projectedBalance + interest - payment;
        }
        projectedBalance = Math.max(0, projectedBalance);

        const totalWithoutForgiveness = balance * (1 + (rate / 100) * 0.5);
        const estimatedSavings = projectedBalance;

        return {
          results: [
            { label: "Qualifying Payments Made", value: formatNumber(paymentsMade) },
            { label: "Remaining Payments Needed", value: formatNumber(remainingPayments) },
            { label: "Years Until Forgiveness", value: formatNumber(remainingYears) },
            { label: "Total Remaining Payments", value: `$${formatNumber(totalPaidRemaining)}` },
            { label: "Projected Balance at Forgiveness", value: `$${formatNumber(projectedBalance)}` },
            { label: "Estimated Amount Forgiven", value: `$${formatNumber(projectedBalance)}` },
            { label: "Total You Will Pay", value: `$${formatNumber(totalPaidSoFar + totalPaidRemaining)}` },
          ],
        };
      },
    },
    {
      slug: "idr-forgiveness",
      title: "IDR Forgiveness Estimate (20/25 Year)",
      fields: [
        {
          name: "loanBalance",
          label: "Current Loan Balance ($)",
          type: "number",
        },
        {
          name: "monthlyPayment",
          label: "Monthly IDR Payment ($)",
          type: "number",
        },
        {
          name: "interestRate",
          label: "Average Interest Rate (%)",
          type: "number",
        },
        {
          name: "repaymentPlan",
          label: "IDR Plan",
          type: "select",
          options: [
            { label: "SAVE/REPAYE (20 yrs undergrad, 25 grad)", value: "20" },
            { label: "IBR (20 years for new borrowers)", value: "20" },
            { label: "ICR / Old IBR (25 years)", value: "25" },
          ],
        },
      ],
      calculate(inputs) {
        const balance = parseFloat(inputs.loanBalance as string);
        const payment = parseFloat(inputs.monthlyPayment as string);
        const rate = parseFloat(inputs.interestRate as string);
        const years = parseFloat(inputs.repaymentPlan as string);
        if (isNaN(balance) || isNaN(payment) || isNaN(rate) || isNaN(years))
          return { error: "Please enter all values." };

        const totalPayments = years * 12;
        const totalPaid = payment * totalPayments;
        const monthlyRate = rate / 100 / 12;

        let projectedBalance = balance;
        for (let i = 0; i < totalPayments; i++) {
          const interest = projectedBalance * monthlyRate;
          projectedBalance = projectedBalance + interest - payment;
        }
        projectedBalance = Math.max(0, projectedBalance);

        const forgivenAmount = projectedBalance;
        const taxBomb = forgivenAmount * 0.22;
        const totalCost = totalPaid + taxBomb;
        const percentForgiven = balance > 0 ? (forgivenAmount / (balance + balance * (rate / 100) * years * 0.3)) * 100 : 0;

        return {
          results: [
            { label: "Repayment Period", value: `${formatNumber(years)} years` },
            { label: "Total Payments Made", value: `$${formatNumber(totalPaid)}` },
            { label: "Balance at Forgiveness", value: `$${formatNumber(projectedBalance)}` },
            { label: "Amount Forgiven", value: `$${formatNumber(forgivenAmount)}` },
            { label: "Potential Tax on Forgiven Amount (22%)", value: `$${formatNumber(taxBomb)}` },
            { label: "Total Cost (Payments + Tax)", value: `$${formatNumber(totalCost)}` },
          ],
        };
      },
    },
    {
      slug: "teacher-forgiveness",
      title: "Teacher Loan Forgiveness",
      fields: [
        {
          name: "loanBalance",
          label: "Eligible Loan Balance ($)",
          type: "number",
        },
        {
          name: "yearsTeaching",
          label: "Years Teaching at Qualifying School",
          type: "number",
        },
        {
          name: "subjectArea",
          label: "Teaching Subject Area",
          type: "select",
          options: [
            { label: "Math or Science (up to $17,500)", value: "17500" },
            { label: "Special Education (up to $17,500)", value: "17500" },
            { label: "Other Subject (up to $5,000)", value: "5000" },
          ],
        },
      ],
      calculate(inputs) {
        const balance = parseFloat(inputs.loanBalance as string);
        const years = parseFloat(inputs.yearsTeaching as string);
        const maxForgiveness = parseFloat(inputs.subjectArea as string);
        if (isNaN(balance) || isNaN(years) || isNaN(maxForgiveness))
          return { error: "Please enter all values." };

        const eligible = years >= 5;
        const forgivenAmount = eligible ? Math.min(balance, maxForgiveness) : 0;
        const remainingBalance = balance - forgivenAmount;
        const yearsRemaining = Math.max(0, 5 - years);

        return {
          results: [
            { label: "Eligible?", value: eligible ? "Yes - 5+ years of qualifying service" : `No - need ${formatNumber(yearsRemaining)} more years` },
            { label: "Maximum Forgiveness", value: `$${formatNumber(maxForgiveness)}` },
            { label: "Amount Forgiven", value: `$${formatNumber(forgivenAmount)}` },
            { label: "Remaining Balance", value: `$${formatNumber(remainingBalance)}` },
            { label: "Years of Service", value: formatNumber(years) },
            { label: "Note", value: "Can also pursue PSLF for remaining balance" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rent-to-income", "global-entry-roi", "home-appraisal-value"],
  faq: [
    {
      question: "What is PSLF and who qualifies?",
      answer:
        "Public Service Loan Forgiveness (PSLF) forgives remaining federal Direct Loan balances after 120 qualifying monthly payments (10 years) while working full-time for a qualifying public service employer (government, 501(c)(3) nonprofits, etc.) and enrolled in an income-driven repayment plan.",
    },
    {
      question: "Is forgiven student loan debt taxable?",
      answer:
        "PSLF forgiveness is tax-free at the federal level. IDR forgiveness (after 20-25 years) was historically taxable as income, but is tax-free through 2025 under the American Rescue Plan. After 2025, IDR forgiveness may again be taxable - the 'tax bomb' can be significant.",
    },
    {
      question: "Can I combine teacher forgiveness with PSLF?",
      answer:
        "Yes, but the same payments cannot count toward both programs. A common strategy is to use 5 years for teacher forgiveness (forgiving up to $17,500), then continue with PSLF for the remaining balance. Your 5 teaching years do not count toward the 120 PSLF payments.",
    },
  ],
  formula:
    "PSLF: 120 qualifying payments then remaining balance forgiven (tax-free) | IDR: 20-25 years of payments then balance forgiven (may be taxable) | Teacher: 5 years qualifying service = up to $17,500 forgiven | Projected Balance = Balance x (1 + rate)^months - Payment x sum of payments",
};
