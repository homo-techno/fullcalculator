import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wrongfulTerminationCalculator: CalculatorDefinition = {
  slug: "wrongful-termination",
  title: "Wrongful Termination Settlement Calculator",
  description: "Free online wrongful termination settlement estimator. Estimate potential damages from unlawful termination including back pay, front pay, and emotional distress.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["wrongful termination", "wrongful dismissal", "fired illegally", "employment law", "back pay", "front pay", "discrimination"],
  variants: [
    {
      id: "settlement-estimate",
      name: "Estimate Settlement",
      fields: [
        {
          name: "annualSalary",
          label: "Annual Salary at Termination ($)",
          type: "number",
          placeholder: "e.g. 75000",
          min: 0,
        },
        {
          name: "monthsUnemployed",
          label: "Months Unemployed After Termination",
          type: "number",
          placeholder: "e.g. 6",
          min: 0,
        },
        {
          name: "expectedMonthsToReemploy",
          label: "Expected Additional Months to Find Work",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
        },
        {
          name: "annualBenefitsValue",
          label: "Annual Benefits Value (health, 401k, etc.) ($)",
          type: "number",
          placeholder: "e.g. 15000",
          min: 0,
        },
        {
          name: "terminationType",
          label: "Type of Wrongful Termination",
          type: "select",
          options: [
            { label: "Breach of Contract", value: "breach" },
            { label: "Discrimination (race, gender, age)", value: "discrimination" },
            { label: "Retaliation (whistleblower)", value: "retaliation" },
            { label: "FMLA / Medical Leave Violation", value: "fmla" },
            { label: "Constructive Dismissal", value: "constructive" },
          ],
        },
        {
          name: "mitigationIncome",
          label: "Income Earned During Unemployment ($)",
          type: "number",
          placeholder: "e.g. 10000",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const annualSalary = parseFloat(inputs.annualSalary as string) || 0;
        const monthsUnemployed = parseFloat(inputs.monthsUnemployed as string) || 0;
        const expectedMonths = parseFloat(inputs.expectedMonthsToReemploy as string) || 0;
        const benefitsValue = parseFloat(inputs.annualBenefitsValue as string) || 0;
        const terminationType = inputs.terminationType as string;
        const mitigationIncome = parseFloat(inputs.mitigationIncome as string) || 0;

        const monthlySalary = annualSalary / 12;
        const monthlyBenefits = benefitsValue / 12;

        const backPay = (monthlySalary * monthsUnemployed) - mitigationIncome;
        const frontPay = monthlySalary * expectedMonths;
        const lostBenefits = monthlyBenefits * (monthsUnemployed + expectedMonths);

        const emotionalDistressMultipliers: Record<string, number> = {
          breach: 0.5,
          discrimination: 1.5,
          retaliation: 1.25,
          fmla: 0.75,
          constructive: 0.6,
        };
        const edMultiplier = emotionalDistressMultipliers[terminationType] || 0.5;
        const emotionalDistress = annualSalary * edMultiplier;

        const punitiveMultipliers: Record<string, number> = {
          breach: 0,
          discrimination: 1.0,
          retaliation: 1.5,
          fmla: 0.5,
          constructive: 0.25,
        };
        const punitiveMult = punitiveMultipliers[terminationType] || 0;
        const punitiveDamages = annualSalary * punitiveMult;

        const totalEstimate = Math.max(0, backPay) + frontPay + lostBenefits + emotionalDistress + punitiveDamages;

        return {
          primary: { label: "Estimated Settlement Value", value: "$" + formatNumber(totalEstimate) },
          details: [
            { label: "Back Pay (net of mitigation)", value: "$" + formatNumber(Math.max(0, backPay)) },
            { label: "Front Pay", value: "$" + formatNumber(frontPay) },
            { label: "Lost Benefits", value: "$" + formatNumber(lostBenefits) },
            { label: "Emotional Distress Damages", value: "$" + formatNumber(emotionalDistress) },
            { label: "Punitive Damages (est.)", value: "$" + formatNumber(punitiveDamages) },
            { label: "Attorney Fees (33%)", value: "$" + formatNumber(totalEstimate * 0.33) },
            { label: "Net After Attorney", value: "$" + formatNumber(totalEstimate * 0.67) },
          ],
          note: "This is a rough estimate. Actual settlements vary significantly based on evidence, jurisdiction, employer size, and negotiation.",
        };
      },
    },
  ],
  relatedSlugs: ["personal-injury-settlement", "legal-fee-calc", "overtime-pay-calc"],
  faq: [
    {
      question: "What qualifies as wrongful termination?",
      answer: "Wrongful termination occurs when an employer fires an employee in violation of the law or an employment contract. This includes discrimination, retaliation for whistleblowing, FMLA violations, and breach of employment contracts.",
    },
    {
      question: "What is back pay vs front pay?",
      answer: "Back pay is the wages you lost from the date of termination to the settlement. Front pay is compensation for future lost earnings if reinstatement is not feasible. Both are reduced by any income you earned during unemployment (mitigation).",
    },
    {
      question: "Are punitive damages always available?",
      answer: "No. Punitive damages are typically only available in cases involving intentional misconduct such as discrimination or retaliation. They are meant to punish the employer. Federal caps on punitive damages range from $50,000 to $300,000 depending on employer size.",
    },
  ],
  formula: "Settlement = Back Pay + Front Pay + Lost Benefits + Emotional Distress + Punitive Damages",
};
