import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const internshipValueCalculator: CalculatorDefinition = {
  slug: "internship-value-calculator",
  title: "Internship Value Calculator",
  description:
    "Free internship value calculator. Estimate the total financial and career value of an internship including pay, experience, and future earning potential.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "internship value calculator",
    "internship pay calculator",
    "internship worth it",
    "internship salary estimate",
    "paid vs unpaid internship",
  ],
  variants: [
    {
      id: "financial",
      name: "Financial Value",
      description: "Calculate the financial value of a paid or unpaid internship",
      fields: [
        { name: "hourlyRate", label: "Hourly Pay ($)", type: "number", placeholder: "e.g. 20 (0 for unpaid)", min: 0, step: 0.5 },
        { name: "hoursPerWeek", label: "Hours per Week", type: "number", placeholder: "e.g. 40", min: 1, max: 60 },
        { name: "durationWeeks", label: "Duration (weeks)", type: "number", placeholder: "e.g. 12", min: 1, max: 52 },
        { name: "housingCost", label: "Additional Housing Cost ($)", type: "number", placeholder: "e.g. 1500 (0 if provided)", min: 0 },
        { name: "commuteCost", label: "Monthly Commute Cost ($)", type: "number", placeholder: "e.g. 100", min: 0 },
      ],
      calculate: (inputs) => {
        const rate = (inputs.hourlyRate as number) || 0;
        const hoursPerWeek = inputs.hoursPerWeek as number;
        const weeks = inputs.durationWeeks as number;
        const housing = (inputs.housingCost as number) || 0;
        const commute = (inputs.commuteCost as number) || 0;
        if (!hoursPerWeek || !weeks) return null;

        const grossPay = rate * hoursPerWeek * weeks;
        const months = weeks / 4.33;
        const totalCosts = housing + commute * months;
        const netEarnings = grossPay - totalCosts;
        const effectiveHourlyRate = netEarnings / (hoursPerWeek * weeks);

        return {
          primary: { label: "Net Earnings", value: `$${formatNumber(netEarnings, 2)}` },
          details: [
            { label: "Gross pay", value: `$${formatNumber(grossPay, 2)}` },
            { label: "Total additional costs", value: `$${formatNumber(totalCosts, 2)}` },
            { label: "Effective hourly rate", value: `$${formatNumber(effectiveHourlyRate, 2)}` },
            { label: "Total hours worked", value: formatNumber(hoursPerWeek * weeks, 0) },
          ],
        };
      },
    },
    {
      id: "career",
      name: "Career Value Estimate",
      description: "Estimate the long-term career value based on salary boost from internship experience",
      fields: [
        { name: "expectedSalaryWithout", label: "Expected Starting Salary Without Internship ($)", type: "number", placeholder: "e.g. 50000", min: 0 },
        { name: "salaryBoostPercent", label: "Expected Salary Boost (%)", type: "number", placeholder: "e.g. 10", min: 0, max: 50, defaultValue: 10 },
        { name: "yearsToMeasure", label: "Years to Measure Impact", type: "number", placeholder: "e.g. 5", min: 1, max: 20, defaultValue: 5 },
        { name: "annualRaise", label: "Annual Raise (%)", type: "number", placeholder: "e.g. 3", min: 0, max: 15, step: 0.5, defaultValue: 3 },
      ],
      calculate: (inputs) => {
        const baseSalary = inputs.expectedSalaryWithout as number;
        const boost = ((inputs.salaryBoostPercent as number) || 10) / 100;
        const years = (inputs.yearsToMeasure as number) || 5;
        const raise = ((inputs.annualRaise as number) || 3) / 100;
        if (!baseSalary) return null;

        let withoutTotal = 0;
        let withTotal = 0;
        let withoutSalary = baseSalary;
        let withSalary = baseSalary * (1 + boost);

        for (let y = 0; y < years; y++) {
          withoutTotal += withoutSalary;
          withTotal += withSalary;
          withoutSalary *= 1 + raise;
          withSalary *= 1 + raise;
        }

        const careerValue = withTotal - withoutTotal;
        const firstYearDiff = baseSalary * boost;

        return {
          primary: { label: `${years}-Year Career Value`, value: `$${formatNumber(careerValue, 0)}` },
          details: [
            { label: "First year salary difference", value: `$${formatNumber(firstYearDiff, 0)}` },
            { label: "Earnings without internship", value: `$${formatNumber(withoutTotal, 0)}` },
            { label: "Earnings with internship", value: `$${formatNumber(withTotal, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "student-loan-calculator"],
  faq: [
    {
      question: "Are unpaid internships worth it?",
      answer:
        "Unpaid internships can be worth it if they provide strong networking, skill development, and lead to job offers. Research shows paid internships lead to better outcomes - 72% of paid interns receive job offers vs. 44% of unpaid.",
    },
    {
      question: "How much do interns typically earn?",
      answer:
        "The average internship pays $15-$25/hour. Tech and finance internships often pay $25-$50+/hour, while non-profit and media internships may pay less or be unpaid.",
    },
  ],
  formula: "Net Value = (Hourly Rate x Hours x Weeks) - Additional Costs",
};
