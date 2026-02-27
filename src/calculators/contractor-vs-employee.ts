import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const contractorVsEmployeeCalculator: CalculatorDefinition = {
  slug: "contractor-vs-employee",
  title: "W-2 vs 1099 Compensation Comparison",
  description:
    "Compare total compensation between a W-2 employee and 1099 contractor to determine equivalent pay rates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "W-2",
    "1099",
    "contractor",
    "employee",
    "compensation",
    "benefits",
    "comparison",
  ],
  variants: [
    {
      slug: "contractor-vs-employee",
      title: "W-2 vs 1099 Total Compensation",
      description:
        "Find out what 1099 rate equals your W-2 salary after accounting for taxes and benefits.",
      fields: [
        {
          name: "w2Salary",
          label: "W-2 Annual Salary ($)",
          type: "number",
          defaultValue: "80000",
        },
        {
          name: "employerHealthInsurance",
          label: "Employer Health Insurance Value ($)",
          type: "number",
          defaultValue: "7200",
        },
        {
          name: "employer401kMatch",
          label: "Employer 401k Match ($)",
          type: "number",
          defaultValue: "4000",
        },
        {
          name: "paidTimeOffDays",
          label: "Paid Time Off Days",
          type: "number",
          defaultValue: "15",
        },
        {
          name: "paidHolidays",
          label: "Paid Holidays",
          type: "number",
          defaultValue: "10",
        },
        {
          name: "otherBenefits",
          label: "Other Benefits (Life Ins, etc.) ($)",
          type: "number",
          defaultValue: "2000",
        },
        {
          name: "contractorRate",
          label: "Proposed 1099 Hourly Rate ($)",
          type: "number",
          defaultValue: "60",
        },
        {
          name: "billableHoursPerWeek",
          label: "Billable Hours Per Week",
          type: "number",
          defaultValue: "40",
        },
      ],
      calculate(inputs) {
        const salary = parseFloat(inputs.w2Salary as string);
        const healthIns = parseFloat(inputs.employerHealthInsurance as string);
        const match401k = parseFloat(inputs.employer401kMatch as string);
        const ptoDays = parseFloat(inputs.paidTimeOffDays as string);
        const holidays = parseFloat(inputs.paidHolidays as string);
        const otherBenefits = parseFloat(inputs.otherBenefits as string);
        const contractRate = parseFloat(inputs.contractorRate as string);
        const billableHrs = parseFloat(inputs.billableHoursPerWeek as string);

        const dailyRate = salary / 260;
        const ptoValue = ptoDays * dailyRate;
        const holidayValue = holidays * dailyRate;
        const employerFica = salary * 0.0765;
        const totalW2Value =
          salary + healthIns + match401k + ptoValue + holidayValue + otherBenefits + employerFica;

        const workWeeks = 52 - (ptoDays + holidays) / 5;
        const contractorAnnual = contractRate * billableHrs * 52;
        const selfHealthIns = 7200;
        const selfRetirement = 5000;
        const seTax = contractorAnnual * 0.9235 * 0.153;
        const contractorExpenses = selfHealthIns + selfRetirement + seTax;
        const contractorNetValue = contractorAnnual - contractorExpenses;

        const equivalentRate = totalW2Value / (52 * billableHrs);
        const difference = contractorAnnual - totalW2Value;

        return {
          "W-2 Base Salary": `$${formatNumber(salary)}`,
          "Health Insurance Value": `$${formatNumber(healthIns)}`,
          "401k Match Value": `$${formatNumber(match401k)}`,
          "PTO Value": `$${formatNumber(ptoValue)}`,
          "Holiday Value": `$${formatNumber(holidayValue)}`,
          "Employer FICA (7.65%)": `$${formatNumber(employerFica)}`,
          "Total W-2 Compensation": `$${formatNumber(totalW2Value)}`,
          "1099 Annual Gross": `$${formatNumber(contractorAnnual)}`,
          "1099 Self-Employment Tax": `$${formatNumber(seTax)}`,
          "1099 Net After Expenses": `$${formatNumber(contractorNetValue)}`,
          "Equivalent 1099 Hourly Rate": `$${formatNumber(equivalentRate)}`,
          "Annual Difference": `$${formatNumber(difference)}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "1099-deduction",
    "gig-tax-calculator",
    "freelance-project-bid",
  ],
  faq: [
    {
      question: "What 1099 rate equals my W-2 salary?",
      answer:
        "A common rule of thumb is to multiply your W-2 hourly equivalent by 1.3-1.5x to get an equivalent 1099 rate. This accounts for self-employment tax, health insurance, retirement, PTO, and other benefits you lose as a contractor.",
    },
    {
      question:
        "What benefits do I lose when switching from W-2 to 1099?",
      answer:
        "As a 1099 contractor, you lose employer-paid health insurance, 401k matching, paid time off, paid holidays, workers compensation, unemployment insurance, employer FICA (7.65%), and other benefits like life/disability insurance.",
    },
    {
      question: "Is it better to be a W-2 or 1099 worker?",
      answer:
        "It depends on your situation. 1099 offers more flexibility, tax deduction opportunities, and potentially higher gross pay. W-2 provides stability, benefits, and lower tax complexity. Compare total compensation, not just the headline rate.",
    },
  ],
  formula:
    "Total W-2 Value = Salary + Health Ins + 401k Match + PTO Value + Holiday Value + Employer FICA + Other Benefits. Equivalent 1099 Rate = Total W-2 Value / (52 x Weekly Hours).",
};
