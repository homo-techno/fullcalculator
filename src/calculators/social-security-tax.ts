import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const socialSecurityTaxCalculator: CalculatorDefinition = {
  slug: "social-security-tax-calculator",
  title: "Social Security Tax Calculator",
  description:
    "Free Social Security tax calculator. Calculate your Social Security (OASDI) tax based on wages, self-employment income, and the wage base limit.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "social security tax",
    "FICA calculator",
    "OASDI tax",
    "social security wage base",
    "social security tax rate",
  ],
  variants: [
    {
      id: "ss-tax",
      name: "Social Security Tax Estimator",
      description:
        "Calculate Social Security tax for employees and self-employed",
      fields: [
        {
          name: "grossWages",
          label: "Gross Annual Wages / SE Income",
          type: "number",
          placeholder: "e.g. 120000",
          prefix: "$",
        },
        {
          name: "employmentType",
          label: "Employment Type",
          type: "select",
          options: [
            { label: "W-2 Employee", value: "employee" },
            { label: "Self-Employed (1099)", value: "self-employed" },
            { label: "Both", value: "both" },
          ],
          defaultValue: "employee",
        },
        {
          name: "w2Wages",
          label: "W-2 Wages (if both)",
          type: "number",
          placeholder: "e.g. 80000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "yearsWorked",
          label: "Years of SS-Covered Earnings",
          type: "number",
          placeholder: "e.g. 25",
          defaultValue: 0,
          min: 0,
          max: 50,
        },
      ],
      calculate: (inputs) => {
        const grossWages = inputs.grossWages as number;
        const empType = inputs.employmentType as string;
        const w2Wages = (inputs.w2Wages as number) || 0;
        const yearsWorked = (inputs.yearsWorked as number) || 0;

        if (!grossWages || grossWages <= 0) return null;

        const wageBase = 168600;
        const employeeRate = 0.062;
        const selfEmployedRate = 0.124;

        let employeeSS = 0;
        let employerSS = 0;
        let seSS = 0;
        let totalSS = 0;

        if (empType === "employee") {
          const taxableWages = Math.min(grossWages, wageBase);
          employeeSS = taxableWages * employeeRate;
          employerSS = taxableWages * employeeRate;
          totalSS = employeeSS;
        } else if (empType === "self-employed") {
          const seNet = grossWages * 0.9235;
          const taxableSE = Math.min(seNet, wageBase);
          seSS = taxableSE * selfEmployedRate;
          totalSS = seSS;
        } else {
          const taxableW2 = Math.min(w2Wages, wageBase);
          employeeSS = taxableW2 * employeeRate;
          employerSS = taxableW2 * employeeRate;
          const remainingBase = Math.max(0, wageBase - w2Wages);
          const seNet = (grossWages - w2Wages) * 0.9235;
          const taxableSE = Math.min(seNet, remainingBase);
          seSS = taxableSE * selfEmployedRate;
          totalSS = employeeSS + seSS;
        }

        const estimatedMonthlyBenefit =
          yearsWorked >= 10
            ? Math.min(3822, (grossWages / 12) * 0.4 * Math.min(yearsWorked / 35, 1))
            : 0;

        return {
          primary: {
            label: "Your Social Security Tax",
            value: `$${formatNumber(totalSS)}`,
          },
          details: [
            {
              label: "SS wage base limit",
              value: `$${formatNumber(wageBase)}`,
            },
            {
              label: "Employee SS tax (6.2%)",
              value: `$${formatNumber(employeeSS)}`,
            },
            {
              label: "Employer SS match (6.2%)",
              value: `$${formatNumber(employerSS)}`,
            },
            {
              label: "Self-employment SS tax (12.4%)",
              value: `$${formatNumber(seSS)}`,
            },
            {
              label: "SE deduction (50% of SE tax)",
              value: `$${formatNumber(seSS / 2)}`,
            },
            {
              label: "Estimated monthly benefit (rough)",
              value:
                yearsWorked >= 10
                  ? `$${formatNumber(estimatedMonthlyBenefit)}`
                  : "Need 10+ years to qualify",
            },
          ],
          note: "Social Security tax applies to the first $168,600 of wages (2024). Self-employed pay both the employee and employer portions (12.4% total) but can deduct half.",
        };
      },
    },
  ],
  relatedSlugs: [
    "medicare-surtax-calculator",
    "paycheck-calculator",
    "payroll-withholding-calculator",
  ],
  faq: [
    {
      question: "What is the Social Security tax rate?",
      answer:
        "Employees pay 6.2% on wages up to the wage base ($168,600 in 2024), matched by the employer for a total of 12.4%. Self-employed individuals pay the full 12.4% but can deduct half.",
    },
    {
      question: "What is the Social Security wage base?",
      answer:
        "The wage base is the maximum amount of earnings subject to Social Security tax. For 2024, it is $168,600. Earnings above this amount are not subject to Social Security tax.",
    },
  ],
  formula:
    "Employee SS Tax = min(wages, $168,600) x 6.2%; Self-Employed = min(net x 92.35%, $168,600) x 12.4%",
};
