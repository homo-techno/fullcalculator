import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const philippinesSssCalculator: CalculatorDefinition = {
  slug: "philippines-sss-calculator",
  title: "Philippines SSS Contribution Calculator",
  description: "Free SSS contribution calculator for Philippines 2025. Calculate employee and employer Social Security System contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["sss contribution calculator", "sss contribution table 2025", "philippines sss calculator"],
  variants: [{
    id: "standard",
    name: "Philippines SSS Contribution",
    description: "Free SSS contribution calculator for Philippines 2025",
    fields: [
      { name: "salary", label: "Monthly Salary", type: "number", prefix: "₱", min: 0 },
    ],
    calculate: (inputs) => {
      const salary = inputs.salary as number;
      if (!salary || salary <= 0) return null;
      const msc = Math.max(5000, Math.min(35000, Math.ceil(salary / 500) * 500));
      const employeeShare = msc * 0.05;
      const employerShare = msc * 0.10;
      const ec = msc <= 15000 ? 10 : 30;
      return {
        primary: { label: "Employee SSS", value: "₱" + formatNumber(employeeShare) },
        details: [
          { label: "Monthly Salary Credit", value: "₱" + formatNumber(msc) },
          { label: "Employer share (10%)", value: "₱" + formatNumber(employerShare) },
          { label: "EC (employer)", value: "₱" + formatNumber(ec) },
          { label: "Total contribution", value: "₱" + formatNumber(employeeShare + employerShare + ec) },
        ],
        note: "SSS rate: 15% total (5% employee, 10% employer). MSC range: ₱5,000-₱35,000.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much is SSS contribution in 2025?", answer: "Total rate is 15% of Monthly Salary Credit (MSC): 5% employee, 10% employer. MSC ranges from ₱5,000 to ₱35,000." },
    { question: "What is Monthly Salary Credit?", answer: "MSC is the salary bracket used to compute SSS contributions. It ranges from ₱5,000 (for salaries ≤₱5,249.99) to ₱35,000 (for salaries ≥₱34,750)." },
  ],
  formula: "Employee SSS = Monthly Salary Credit × 5%. Employer = MSC × 10%.",
};
