import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pensionCalculator: CalculatorDefinition = {
  slug: "pension-calculator",
  title: "Pension Calculator",
  description:
    "Free pension calculator. Estimate your pension benefit based on final salary, years of service, and pension multiplier. See monthly and annual pension income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "pension calculator",
    "pension benefit calculator",
    "retirement pension calculator",
    "defined benefit calculator",
    "pension estimate",
  ],
  variants: [
    {
      id: "pension",
      name: "Pension Benefit Estimate",
      description: "Calculate your estimated pension based on salary and years of service",
      fields: [
        {
          name: "finalSalary",
          label: "Final Average Salary",
          type: "number",
          placeholder: "e.g. 85000",
          prefix: "$",
          min: 0,
        },
        {
          name: "yearsOfService",
          label: "Years of Service",
          type: "number",
          placeholder: "e.g. 25",
          min: 0,
          max: 50,
          step: 1,
        },
        {
          name: "multiplier",
          label: "Pension Multiplier",
          type: "number",
          placeholder: "e.g. 2.0",
          suffix: "%",
          min: 0.5,
          max: 5,
          step: 0.1,
          defaultValue: 2.0,
        },
        {
          name: "survivorBenefit",
          label: "Survivor Benefit Option",
          type: "select",
          options: [
            { label: "Single life (100%)", value: "100" },
            { label: "50% survivor", value: "95" },
            { label: "75% survivor", value: "90" },
            { label: "100% survivor", value: "85" },
          ],
          defaultValue: "100",
        },
      ],
      calculate: (inputs) => {
        const salary = inputs.finalSalary as number;
        const years = inputs.yearsOfService as number;
        const multiplier = (inputs.multiplier as number) || 2.0;
        const survivorPct = parseInt(inputs.survivorBenefit as string) || 100;
        if (!salary || !years) return null;

        // Pension = Final Salary × Years of Service × Multiplier%
        const fullAnnualPension = salary * years * (multiplier / 100);
        const adjustedAnnualPension = fullAnnualPension * (survivorPct / 100);
        const monthlyPension = adjustedAnnualPension / 12;
        const replacementRatio = (adjustedAnnualPension / salary) * 100;

        // Show comparison at different years of service
        const details = [
          { label: "Final average salary", value: `$${formatNumber(salary)}` },
          { label: "Years of service", value: `${years}` },
          { label: "Multiplier", value: `${formatNumber(multiplier, 1)}%` },
          { label: "Full annual pension", value: `$${formatNumber(fullAnnualPension)}` },
          { label: "Survivor adjustment", value: `${survivorPct}%` },
          { label: "Adjusted annual pension", value: `$${formatNumber(adjustedAnnualPension)}` },
          { label: "Monthly pension", value: `$${formatNumber(monthlyPension)}` },
          { label: "Income replacement ratio", value: `${formatNumber(replacementRatio, 1)}%` },
        ];

        // Show what-if for different years
        const whatIfYears = [20, 25, 30, 35].filter((y) => y !== years);
        for (const y of whatIfYears) {
          const alt = salary * y * (multiplier / 100) * (survivorPct / 100);
          details.push({ label: `Pension at ${y} years`, value: `$${formatNumber(alt / 12)}/mo` });
        }

        return {
          primary: {
            label: "Monthly Pension",
            value: `$${formatNumber(monthlyPension)}`,
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["retirement-calculator", "social-security-calculator", "roth-ira-calculator"],
  faq: [
    {
      question: "How is a pension calculated?",
      answer:
        "Most defined benefit pensions use: Annual Pension = Final Average Salary × Years of Service × Multiplier. Common multipliers range from 1.5% to 2.5%. For example, $80,000 salary × 25 years × 2% = $40,000/year pension.",
    },
    {
      question: "What is a good pension multiplier?",
      answer:
        "Pension multipliers typically range from 1.5% to 2.5%. Government and public sector pensions often offer 2-2.5%. With a 2% multiplier and 30 years of service, you would receive 60% of your final salary as a pension.",
    },
    {
      question: "What is the survivor benefit option?",
      answer:
        "A survivor benefit ensures your spouse or beneficiary continues receiving pension payments after you pass away. Choosing a survivor benefit reduces your monthly pension (typically 5-15% reduction) in exchange for ongoing payments to your beneficiary.",
    },
  ],
  formula:
    "Annual Pension = Final Salary × Years of Service × Multiplier%. Monthly Pension = Annual Pension / 12. Replacement Ratio = Annual Pension / Final Salary × 100.",
};
