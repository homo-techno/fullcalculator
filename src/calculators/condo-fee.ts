import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const condoFeeCalculator: CalculatorDefinition = {
  slug: "condo-fee-calculator",
  title: "Condo Fee Calculator",
  description:
    "Free condo fee calculator. Analyze HOA/condo fees, understand what they cover, and calculate the true cost impact on your housing budget.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "condo fee calculator",
    "HOA fee calculator",
    "condo association fees",
    "homeowner association cost",
    "condo maintenance fee",
  ],
  variants: [
    {
      id: "total-cost",
      name: "True Housing Cost with Condo Fees",
      description: "Calculate total monthly housing cost including condo fees",
      fields: [
        {
          name: "monthlyMortgage",
          label: "Monthly Mortgage Payment",
          type: "number",
          placeholder: "e.g. 1500",
          prefix: "$",
          min: 0,
        },
        {
          name: "condoFee",
          label: "Monthly Condo/HOA Fee",
          type: "number",
          placeholder: "e.g. 400",
          prefix: "$",
          min: 0,
        },
        {
          name: "propertyTax",
          label: "Monthly Property Tax",
          type: "number",
          placeholder: "e.g. 300",
          prefix: "$",
          min: 0,
        },
        {
          name: "insurance",
          label: "Monthly Insurance (unit owner)",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
          min: 0,
        },
        {
          name: "specialAssessment",
          label: "Expected Special Assessment (annual)",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          min: 0,
        },
        {
          name: "feeIncreaseRate",
          label: "Expected Annual Fee Increase",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "%",
          min: 0,
          max: 20,
          step: 0.1,
          defaultValue: 3,
        },
      ],
      calculate: (inputs) => {
        const mortgage = (inputs.monthlyMortgage as number) || 0;
        const condoFee = inputs.condoFee as number;
        const tax = (inputs.propertyTax as number) || 0;
        const insurance = (inputs.insurance as number) || 0;
        const specialAssessment = (inputs.specialAssessment as number) || 0;
        const increaseRate = (inputs.feeIncreaseRate as number) || 3;
        if (!condoFee) return null;

        const totalMonthly = mortgage + condoFee + tax + insurance + (specialAssessment / 12);
        const annualCondoFees = condoFee * 12;
        const feeIn5Years = condoFee * Math.pow(1 + increaseRate / 100, 5);
        const feeIn10Years = condoFee * Math.pow(1 + increaseRate / 100, 10);
        const totalFeesOver10Years = Array.from({ length: 10 }, (_, i) =>
          condoFee * Math.pow(1 + increaseRate / 100, i) * 12
        ).reduce((a, b) => a + b, 0);

        return {
          primary: {
            label: "Total Monthly Housing Cost",
            value: `$${formatNumber(totalMonthly)}`,
          },
          details: [
            { label: "Monthly condo/HOA fee", value: `$${formatNumber(condoFee)}` },
            { label: "Annual condo fees", value: `$${formatNumber(annualCondoFees)}` },
            { label: "Condo fee % of housing cost", value: `${formatNumber((condoFee / totalMonthly) * 100)}%` },
            { label: "Estimated fee in 5 years", value: `$${formatNumber(feeIn5Years)}/mo` },
            { label: "Estimated fee in 10 years", value: `$${formatNumber(feeIn10Years)}/mo` },
            { label: "Total fees over 10 years", value: `$${formatNumber(totalFeesOver10Years)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "escrow-calculator", "property-management-fee-calculator"],
  faq: [
    {
      question: "What is a typical condo fee?",
      answer:
        "Condo fees typically range from $200-$800 per month depending on the building amenities, age, location, and unit size. Luxury condos with extensive amenities (pool, gym, concierge) can exceed $1,000/month. Fees tend to increase 3-5% annually.",
    },
    {
      question: "What do condo fees cover?",
      answer:
        "Condo fees typically cover building insurance, common area maintenance, landscaping, snow removal, water/sewer, trash, reserve fund contributions, and shared amenities (pool, gym, lobby). They usually do not cover your mortgage, unit insurance, or property taxes.",
    },
    {
      question: "What is a special assessment?",
      answer:
        "A special assessment is an additional one-time charge to condo owners for major unexpected expenses or capital improvements not covered by the reserve fund. Examples include roof replacement, elevator repair, or facade work. They can range from hundreds to tens of thousands of dollars.",
    },
  ],
  formula: "Total Housing Cost = Mortgage + Condo Fee + Property Tax + Insurance + Special Assessment/12",
};
