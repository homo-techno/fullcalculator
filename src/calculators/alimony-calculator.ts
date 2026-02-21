import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const alimonyCalculator: CalculatorDefinition = {
  slug: "alimony-calculator",
  title: "Alimony Calculator",
  description: "Free alimony/spousal support calculator. Estimate alimony payments based on income, marriage duration, and state guidelines. Actual amounts vary by jurisdiction.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["alimony calculator", "spousal support calculator", "alimony estimator", "divorce alimony", "spousal maintenance calculator"],
  variants: [
    {
      id: "alimony-estimate",
      name: "Alimony Estimator",
      description: "Estimate alimony using a common formula (income differential method)",
      fields: [
        { name: "payerIncome", label: "Higher Earner Gross Annual Income", type: "number", placeholder: "e.g. 120000", prefix: "$" },
        { name: "recipientIncome", label: "Lower Earner Gross Annual Income", type: "number", placeholder: "e.g. 40000", prefix: "$" },
        { name: "marriageYears", label: "Years of Marriage", type: "number", placeholder: "e.g. 15", min: 0 },
        { name: "method", label: "Estimation Method", type: "select", options: [
          { label: "One-Third Rule (common)", value: "one-third" },
          { label: "AAML Formula (40/50)", value: "aaml" },
          { label: "California Guideline", value: "california" },
        ], defaultValue: "one-third" },
      ],
      calculate: (inputs) => {
        const payerIncome = inputs.payerIncome as number;
        const recipientIncome = inputs.recipientIncome as number;
        const marriageYears = inputs.marriageYears as number;
        const method = inputs.method as string;

        if (!payerIncome || recipientIncome === undefined || !marriageYears) return null;

        let monthlyAlimony = 0;
        let methodDesc = "";

        if (method === "one-third") {
          monthlyAlimony = (payerIncome - recipientIncome) / 3 / 12;
          methodDesc = "One-Third of Income Difference";
        } else if (method === "aaml") {
          const amount = (payerIncome * 0.3) - (recipientIncome * 0.2);
          monthlyAlimony = Math.max(0, amount / 12);
          methodDesc = "AAML: 30% payer - 20% recipient";
        } else {
          monthlyAlimony = Math.max(0, (payerIncome * 0.4 - recipientIncome * 0.5) / 12);
          methodDesc = "California: 40% payer - 50% recipient";
        }

        monthlyAlimony = Math.max(0, monthlyAlimony);

        let durationFactor: number;
        if (marriageYears < 5) durationFactor = 0.3;
        else if (marriageYears < 10) durationFactor = 0.5;
        else if (marriageYears < 20) durationFactor = 0.75;
        else durationFactor = 1.0;

        const estimatedDurationYears = marriageYears * durationFactor;
        const annualAlimony = monthlyAlimony * 12;
        const totalAlimony = annualAlimony * estimatedDurationYears;

        return {
          primary: { label: "Estimated Monthly Alimony", value: `$${formatNumber(monthlyAlimony)}` },
          details: [
            { label: "Calculation method", value: methodDesc },
            { label: "Annual alimony", value: `$${formatNumber(annualAlimony)}` },
            { label: "Estimated duration", value: `${formatNumber(estimatedDurationYears, 1)} years` },
            { label: "Total estimated alimony", value: `$${formatNumber(totalAlimony)}` },
            { label: "Payer monthly after alimony", value: `$${formatNumber(payerIncome / 12 - monthlyAlimony)}` },
            { label: "Recipient monthly with alimony", value: `$${formatNumber(recipientIncome / 12 + monthlyAlimony)}` },
          ],
          note: "Alimony calculations vary dramatically by state and are often at the judge's discretion. This is a rough estimate only. Consult a family law attorney for guidance specific to your jurisdiction.",
        };
      },
    },
  ],
  relatedSlugs: ["child-support-calculator", "tax-calculator", "paycheck-calculator"],
  faq: [
    { question: "How is alimony calculated?", answer: "There is no single national formula. Common methods include the one-third rule (1/3 of the income difference), the AAML formula (30% of payer's income minus 20% of recipient's), and various state-specific guidelines. Judges consider factors like marriage length, standard of living, age, health, and earning capacity." },
    { question: "How long does alimony last?", answer: "Duration typically depends on the length of the marriage. Short marriages (under 5 years) may have alimony lasting 30% of the marriage length. Long marriages (20+ years) may result in permanent alimony. Most states cap alimony duration at half to equal the length of the marriage." },
    { question: "Is alimony tax-deductible?", answer: "For divorces finalized after December 31, 2018, alimony is no longer tax-deductible for the payer or taxable income for the recipient under the Tax Cuts and Jobs Act. For pre-2019 divorces, the old rules may still apply unless the agreement is modified." },
  ],
  formula: "One-Third Rule: Alimony = (Payer Income - Recipient Income) / 3. AAML: Alimony = 30% × Payer Income - 20% × Recipient Income. Duration typically = Marriage Years × Duration Factor (0.3 to 1.0).",
};
