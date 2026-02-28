import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chinaSocialInsuranceCalculator: CalculatorDefinition = {
  slug: "china-social-insurance-calculator",
  title: "China Social Insurance Calculator",
  description: "Free China social insurance (五险一金) calculator. Calculate employee and employer contributions for pension, medical, unemployment, and housing fund.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["china social insurance calculator", "wuxian yijin calculator", "china five insurances one fund"],
  variants: [{
    id: "standard",
    name: "China Social Insurance",
    description: "Free China social insurance (五险一金) calculator",
    fields: [
      { name: "salary", label: "Monthly Salary", type: "number", prefix: "¥", min: 0 },
      { name: "housingRate", label: "Housing Fund Rate", type: "number", suffix: "%", defaultValue: 12, min: 5, max: 12 },
    ],
    calculate: (inputs) => {
      const salary = inputs.salary as number;
      const housingRate = (inputs.housingRate as number) / 100;
      if (!salary) return null;
      const empPension = salary * 0.08;
      const empMedical = salary * 0.02 + 3;
      const empUnemploy = salary * 0.005;
      const empHousing = salary * housingRate;
      const totalEmp = empPension + empMedical + empUnemploy + empHousing;
      const erPension = salary * 0.16;
      const erMedical = salary * 0.098;
      const erUnemploy = salary * 0.005;
      const erInjury = salary * 0.004;
      const erMaternity = salary * 0.008;
      const erHousing = salary * housingRate;
      const totalEr = erPension + erMedical + erUnemploy + erInjury + erMaternity + erHousing;
      return {
        primary: { label: "Your Monthly Deductions", value: "¥" + formatNumber(totalEmp) },
        details: [
          { label: "Pension (8%)", value: "¥" + formatNumber(empPension) },
          { label: "Medical (2%+¥3)", value: "¥" + formatNumber(empMedical) },
          { label: "Unemployment (0.5%)", value: "¥" + formatNumber(empUnemploy) },
          { label: "Housing fund (" + (housingRate*100) + "%)", value: "¥" + formatNumber(empHousing) },
          { label: "Employer total cost", value: "¥" + formatNumber(totalEr) },
          { label: "Net before tax", value: "¥" + formatNumber(salary - totalEmp) },
        ],
        note: "Rates shown are typical for Beijing/Shanghai. Actual rates vary by city.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is five insurances one fund in China?", answer: "Five insurances (五险): pension (16%+8%), medical (~10%+2%), unemployment (0.5%+0.5%), work injury (~0.4%), maternity (~0.8%). One fund (一金): housing fund (5-12% each side)." },
    { question: "How much do employees pay for social insurance?", answer: "Employees typically pay about 10.5% (pension 8%, medical 2%+¥3, unemployment 0.5%) plus 5-12% for housing fund." },
  ],
  formula: "Employee deductions = Pension 8% + Medical 2% + Unemployment 0.5% + Housing Fund 5-12%",
};
