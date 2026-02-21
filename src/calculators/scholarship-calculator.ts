import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const scholarshipCalculator: CalculatorDefinition = {
  slug: "scholarship-calculator",
  title: "Scholarship Savings Calculator",
  description:
    "Free scholarship savings calculator. Estimate how much scholarships reduce your college costs and total student debt.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "scholarship calculator",
    "scholarship savings",
    "college scholarship estimator",
    "financial aid calculator",
    "scholarship value calculator",
  ],
  variants: [
    {
      id: "impact",
      name: "Scholarship Impact",
      description: "Calculate how a scholarship reduces your total college costs and debt",
      fields: [
        { name: "totalCost", label: "Total College Cost (4 years, $)", type: "number", placeholder: "e.g. 120000" },
        { name: "scholarshipPerYear", label: "Scholarship Amount (per year, $)", type: "number", placeholder: "e.g. 10000" },
        { name: "years", label: "Years of Coverage", type: "number", placeholder: "e.g. 4", min: 1, max: 6 },
        { name: "loanRate", label: "Expected Loan Interest Rate (%)", type: "number", placeholder: "e.g. 5.5" },
        { name: "loanTerm", label: "Loan Repayment Term (years)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const totalCost = inputs.totalCost as number;
        const scholarshipPerYear = inputs.scholarshipPerYear as number;
        const years = inputs.years as number;
        const loanRate = inputs.loanRate as number;
        const loanTerm = inputs.loanTerm as number;
        if (!totalCost || !scholarshipPerYear || !years || !loanRate || !loanTerm) return null;

        const totalScholarship = scholarshipPerYear * years;
        const remainingCost = Math.max(0, totalCost - totalScholarship);
        const percentCovered = (totalScholarship / totalCost) * 100;

        // Calculate loan payments without scholarship
        const monthlyRate = (loanRate / 100) / 12;
        const totalMonths = loanTerm * 12;

        const paymentWithout = totalCost * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);
        const totalWithout = paymentWithout * totalMonths;

        let paymentWith = 0;
        let totalWith = 0;
        if (remainingCost > 0) {
          paymentWith = remainingCost * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1);
          totalWith = paymentWith * totalMonths;
        }

        const totalSaved = totalWithout - totalWith;

        return {
          primary: { label: "Total Scholarship Value", value: `$${formatNumber(totalScholarship, 0)}` },
          details: [
            { label: "College cost covered", value: `${formatNumber(percentCovered, 1)}%` },
            { label: "Remaining cost to finance", value: `$${formatNumber(remainingCost, 0)}` },
            { label: "Monthly payment without scholarship", value: `$${formatNumber(paymentWithout, 2)}` },
            { label: "Monthly payment with scholarship", value: `$${formatNumber(paymentWith, 2)}` },
            { label: "Monthly savings", value: `$${formatNumber(paymentWithout - paymentWith, 2)}` },
            { label: "Total lifetime savings (incl. interest)", value: `$${formatNumber(totalSaved, 0)}` },
          ],
        };
      },
    },
    {
      id: "multiple",
      name: "Combine Multiple Scholarships",
      description: "Add up multiple scholarship awards to see total impact",
      fields: [
        { name: "scholarship1", label: "Scholarship 1 (per year, $)", type: "number", placeholder: "e.g. 5000" },
        { name: "scholarship2", label: "Scholarship 2 (per year, $)", type: "number", placeholder: "e.g. 3000" },
        { name: "scholarship3", label: "Scholarship 3 (per year, $)", type: "number", placeholder: "e.g. 2000" },
        { name: "scholarship4", label: "Scholarship 4 (per year, $)", type: "number", placeholder: "optional" },
        { name: "years", label: "Years of Coverage", type: "number", placeholder: "e.g. 4", min: 1, max: 6 },
        { name: "annualTuition", label: "Annual Tuition & Fees ($)", type: "number", placeholder: "e.g. 35000" },
      ],
      calculate: (inputs) => {
        const years = inputs.years as number;
        const annualTuition = inputs.annualTuition as number;
        if (!years || !annualTuition) return null;

        let totalPerYear = 0;
        let count = 0;
        for (let i = 1; i <= 4; i++) {
          const amt = inputs[`scholarship${i}`] as number;
          if (amt && amt > 0) {
            totalPerYear += amt;
            count++;
          }
        }

        if (count === 0) return null;

        const totalScholarships = totalPerYear * years;
        const totalTuition = annualTuition * years;
        const remaining = Math.max(0, totalTuition - totalScholarships);
        const coveragePct = Math.min(100, (totalPerYear / annualTuition) * 100);

        return {
          primary: { label: "Total Scholarships Per Year", value: `$${formatNumber(totalPerYear, 0)}` },
          details: [
            { label: "Scholarships combined", value: `${count}` },
            { label: "Total over all years", value: `$${formatNumber(totalScholarships, 0)}` },
            { label: "Annual tuition covered", value: `${formatNumber(coveragePct, 1)}%` },
            { label: "Remaining annual cost", value: `$${formatNumber(Math.max(0, annualTuition - totalPerYear), 0)}` },
            { label: "Total remaining cost", value: `$${formatNumber(remaining, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["college-savings-calculator", "student-loan-calculator", "tuition-cost-calculator"],
  faq: [
    {
      question: "How do scholarships save money beyond tuition?",
      answer:
        "Scholarships reduce the amount you need to borrow, which means you also avoid paying interest on that money. A $10,000 scholarship can save over $13,000 when you factor in 10 years of loan interest at 5.5%.",
    },
    {
      question: "Can I stack multiple scholarships?",
      answer:
        "Yes, in most cases you can combine multiple scholarships. However, some schools may reduce institutional aid if external scholarships push your total aid above the cost of attendance. Check with your financial aid office.",
    },
    {
      question: "Are scholarships taxable?",
      answer:
        "Scholarship money used for tuition and required fees is generally tax-free. However, amounts used for room, board, or other expenses may be taxable. Consult a tax professional for your specific situation.",
    },
  ],
  formula: "Total Savings = Scholarship Amount x Years + Avoided Interest on Loan",
};
