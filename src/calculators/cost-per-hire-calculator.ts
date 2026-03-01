import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const costPerHireCalculator: CalculatorDefinition = {
  slug: "cost-per-hire-calculator",
  title: "Cost Per Hire Calculator",
  description: "Calculate the total cost of hiring a new employee including recruitment, onboarding, and training expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cost per hire", "recruitment cost", "hiring cost calculator"],
  variants: [{
    id: "standard",
    name: "Cost Per Hire",
    description: "Calculate the total cost of hiring a new employee including recruitment, onboarding, and training expenses",
    fields: [
      { name: "recruitingCosts", label: "Recruiting Costs (ads, agency fees)", type: "number", prefix: "$", min: 0, max: 100000, step: 500, defaultValue: 5000 },
      { name: "interviewCosts", label: "Interview Costs (staff time, travel)", type: "number", prefix: "$", min: 0, max: 50000, step: 250, defaultValue: 2500 },
      { name: "onboardingCosts", label: "Onboarding and Training Costs", type: "number", prefix: "$", min: 0, max: 50000, step: 500, defaultValue: 3000 },
      { name: "positionSalary", label: "Annual Salary of Position", type: "number", prefix: "$", min: 20000, max: 500000, step: 1000, defaultValue: 70000 },
    ],
    calculate: (inputs) => {
      const recruiting = inputs.recruitingCosts as number;
      const interview = inputs.interviewCosts as number;
      const onboarding = inputs.onboardingCosts as number;
      const salary = inputs.positionSalary as number;
      if (!salary || salary <= 0) return null;
      const totalCost = (recruiting || 0) + (interview || 0) + (onboarding || 0);
      const costAsPercentOfSalary = (totalCost / salary) * 100;
      const productivityLoss = salary * 0.25;
      const totalWithProductivity = totalCost + productivityLoss;
      return {
        primary: { label: "Total Cost Per Hire", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Cost as Percent of Salary", value: formatNumber(Math.round(costAsPercentOfSalary)) + "%" },
          { label: "Estimated Productivity Loss (first 3 months)", value: "$" + formatNumber(Math.round(productivityLoss)) },
          { label: "Total Cost Including Ramp-Up", value: "$" + formatNumber(Math.round(totalWithProductivity)) },
        ],
      };
    },
  }],
  relatedSlugs: ["employee-turnover-cost-calculator", "employer-payroll-tax-calculator"],
  faq: [
    { question: "What is the average cost per hire?", answer: "According to SHRM, the average cost per hire is approximately $4,700. However, for executive and specialized positions, the cost can reach 50 to 100 percent of the annual salary when all expenses are included." },
    { question: "How can I reduce cost per hire?", answer: "Reduce hiring costs by building an employee referral program, maintaining a talent pipeline, using social media recruiting, improving employer branding, and reducing time-to-fill through streamlined interview processes." },
  ],
  formula: "Cost Per Hire = Recruiting Costs + Interview Costs + Onboarding Costs; Total = Cost Per Hire + Productivity Loss",
};
