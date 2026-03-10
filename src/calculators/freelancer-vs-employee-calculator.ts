import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const freelancerVsEmployeeCalculator: CalculatorDefinition = {
  slug: "freelancer-vs-employee-calculator",
  title: "Freelancer vs Employee Salary Calculator",
  description:
    "Compare true take-home pay as a freelancer vs salaried employee. Account for taxes, benefits, expenses, and time off to find break-even rate.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "freelancer vs employee calculator",
    "should I freelance or get a job",
    "freelance hourly rate vs salary",
    "self-employed vs employed income",
    "freelance break-even rate",
  ],
  variants: [
    {
      id: "compare",
      name: "Freelance vs Salary Comparison",
      description: "Compare true income as freelancer vs employee",
      fields: [
        {
          name: "employeeSalary",
          label: "Comparable Employee Salary",
          type: "number",
          placeholder: "e.g. 80000",
          prefix: "$",
          suffix: "/year",
        },
        {
          name: "freelanceHourlyRate",
          label: "Your Freelance Hourly Rate",
          type: "number",
          placeholder: "e.g. 75",
          prefix: "$",
          suffix: "/hr",
        },
        {
          name: "billableHoursPerYear",
          label: "Billable Hours per Year",
          type: "number",
          placeholder: "e.g. 1500",
          suffix: "hours",
          defaultValue: 1500,
        },
        {
          name: "healthInsurance",
          label: "Annual Health Insurance Cost (freelance)",
          type: "number",
          placeholder: "e.g. 6000",
          prefix: "$",
          defaultValue: 5000,
        },
      ],
      calculate: (inputs) => {
        const salary = parseFloat(inputs.employeeSalary as string) || 0;
        const freelanceRate = parseFloat(inputs.freelanceHourlyRate as string) || 0;
        const billableHours = parseFloat(inputs.billableHoursPerYear as string) || 1500;
        const healthInsurance = parseFloat(inputs.healthInsurance as string) || 5000;

        // Employee net (after ~25% total tax burden)
        const employeeTaxRate = 0.28;
        const employerBenefitsValue = salary * 0.20; // benefits worth ~20% of salary
        const employeeNetSalary = salary * (1 - employeeTaxRate);

        // Freelance net
        const freelanceGross = freelanceRate * billableHours;
        // Self-employment tax = 15.3%, income tax ~22% on net after SE deduction
        const seTax = freelanceGross * 0.153;
        const seDeduction = seTax * 0.5; // deduct half SE tax
        const taxableIncome = freelanceGross - seDeduction - healthInsurance;
        const incomeTax = taxableIncome * 0.22;
        const freelanceBusinessExpenses = 5000; // tools, software, office, etc.
        const freelanceNet = freelanceGross - seTax - incomeTax - healthInsurance - freelanceBusinessExpenses;

        const breakEvenHourlyRate = salary > 0
          ? (employeeNetSalary + healthInsurance + freelanceBusinessExpenses + seTax) / billableHours / (1 - 0.22)
          : 0;

        return {
          primary: { label: "Freelance Net Income", value: `$${formatNumber(freelanceNet, 0)}/yr` },
          details: [
            { label: "Employee salary (gross)", value: `$${formatNumber(salary, 0)}` },
            { label: "Employee net take-home", value: `$${formatNumber(employeeNetSalary, 0)}` },
            { label: "Employer benefits value", value: `~$${formatNumber(employerBenefitsValue, 0)}` },
            { label: "Freelance gross revenue", value: `$${formatNumber(freelanceGross, 0)}` },
            { label: "Self-employment tax (15.3%)", value: `-$${formatNumber(seTax, 0)}` },
            { label: "Health insurance", value: `-$${formatNumber(healthInsurance, 0)}` },
            { label: "Income tax (~22%)", value: `-$${formatNumber(incomeTax, 0)}` },
            { label: "Freelance net income", value: `$${formatNumber(freelanceNet, 0)}` },
            { label: "Break-even hourly rate", value: `$${formatNumber(breakEvenHourlyRate, 2)}/hr` },
          ],
          note: "Freelancers also give up paid vacation (2 weeks = $3,000+ for $80k salary). Add that to your break-even calculation.",
        };
      },
    },
  ],
  relatedSlugs: ["upwork-fee-calculator", "fiverr-seller-calculator", "gig-worker-quarterly-tax-calculator"],
  faq: [
    {
      question: "How much more should a freelancer charge vs an employee salary?",
      answer:
        "A freelancer needs roughly 1.5–2x the equivalent salary to match total compensation. At $80k employee salary, you need $120k–$160k freelance gross revenue to break even (accounting for self-employment tax, health insurance, no paid leave, and business expenses).",
    },
    {
      question: "What taxes do freelancers pay?",
      answer:
        "Freelancers pay self-employment tax (15.3% on net income up to Social Security limit), federal income tax (10–37% brackets), and state income tax. Total effective tax burden is typically 30–40% for freelancers earning $50k–$200k.",
    },
    {
      question: "Is freelancing worth it financially?",
      answer:
        "Freelancing can be very profitable if you bill 1,500+ hours/year at competitive rates, keep expenses low, and maximize business deductions. The key risk is income volatility — the feast-or-famine cycle. Many freelancers earn 30–100% more than comparable employees.",
    },
  ],
  formula: "Freelance Net = Gross Revenue − SE Tax (15.3%) − Income Tax − Health Insurance − Business Expenses",
};
