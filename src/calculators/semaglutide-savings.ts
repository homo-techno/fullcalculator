import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const semaglutideSavingsCalculator: CalculatorDefinition = {
  slug: "semaglutide-savings-calculator",
  title: "Semaglutide Savings Calculator",
  description:
    "Compare the cost of brand-name semaglutide (Wegovy/Ozempic) vs compounded semaglutide. Calculate potential savings over time.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "compounded semaglutide cost",
    "semaglutide savings",
    "brand vs compounded semaglutide",
    "ozempic vs compounded",
    "semaglutide price comparison",
  ],
  variants: [
    {
      id: "comparison",
      name: "Brand vs Compounded",
      description: "Side-by-side cost comparison of brand and compounded semaglutide",
      fields: [
        {
          name: "brandCost",
          label: "Brand Monthly Cost",
          type: "number",
          placeholder: "e.g. 1349",
          prefix: "$",
          min: 0,
          max: 5000,
          defaultValue: 1349,
        },
        {
          name: "compoundedCost",
          label: "Compounded Monthly Cost",
          type: "number",
          placeholder: "e.g. 300",
          prefix: "$",
          min: 0,
          max: 2000,
          defaultValue: 300,
        },
        {
          name: "months",
          label: "Treatment Duration",
          type: "number",
          placeholder: "e.g. 12",
          suffix: "months",
          min: 1,
          max: 60,
        },
        {
          name: "dose",
          label: "Weekly Dose",
          type: "select",
          options: [
            { label: "0.25 mg (starting)", value: "0.25" },
            { label: "0.5 mg", value: "0.5" },
            { label: "1.0 mg", value: "1.0" },
            { label: "1.7 mg", value: "1.7" },
            { label: "2.4 mg (maintenance)", value: "2.4" },
          ],
          defaultValue: "2.4",
        },
      ],
      calculate: (inputs) => {
        const brandCost = parseFloat(inputs.brandCost as string);
        const compoundedCost = parseFloat(inputs.compoundedCost as string);
        const months = parseFloat(inputs.months as string);
        const dose = parseFloat(inputs.dose as string);
        if (isNaN(brandCost) || isNaN(compoundedCost) || !months) return null;

        const brandTotal = brandCost * months;
        const compoundedTotal = compoundedCost * months;
        const totalSavings = brandTotal - compoundedTotal;
        const monthlySavings = brandCost - compoundedCost;
        const savingsPercent = brandCost > 0 ? (monthlySavings / brandCost) * 100 : 0;

        return {
          primary: { label: "Total Savings", value: `$${formatNumber(totalSavings, 2)}` },
          details: [
            { label: "Monthly Savings", value: `$${formatNumber(monthlySavings, 2)}` },
            { label: "Savings Percentage", value: `${formatNumber(savingsPercent, 1)}%` },
            { label: "Brand Total Cost", value: `$${formatNumber(brandTotal, 2)}` },
            { label: "Compounded Total Cost", value: `$${formatNumber(compoundedTotal, 2)}` },
            { label: "Weekly Dose", value: `${formatNumber(dose, 2)} mg` },
          ],
          note: "Compounded semaglutide availability and legality may change based on FDA shortage status. Compounded medications are not FDA-approved and quality varies by pharmacy. Always use a licensed 503A or 503B compounding pharmacy.",
        };
      },
    },
    {
      id: "breakeven",
      name: "Insurance Break-Even",
      description: "Calculate when insurance brand cost equals compounded cost",
      fields: [
        {
          name: "insuranceCopay",
          label: "Brand Copay (with insurance)",
          type: "number",
          placeholder: "e.g. 150",
          prefix: "$",
          min: 0,
          max: 2000,
        },
        {
          name: "deductible",
          label: "Annual Deductible Remaining",
          type: "number",
          placeholder: "e.g. 2000",
          prefix: "$",
          min: 0,
          max: 15000,
          defaultValue: 0,
        },
        {
          name: "compoundedCost",
          label: "Compounded Monthly Cost",
          type: "number",
          placeholder: "e.g. 300",
          prefix: "$",
          min: 0,
          max: 2000,
          defaultValue: 300,
        },
      ],
      calculate: (inputs) => {
        const copay = parseFloat(inputs.insuranceCopay as string);
        const deductible = parseFloat(inputs.deductible as string) || 0;
        const compounded = parseFloat(inputs.compoundedCost as string);
        if (isNaN(copay) || isNaN(compounded)) return null;

        const brandPrice = 1349.02;
        // Months to clear deductible paying brand price
        const monthsToDeductible = deductible > 0 ? Math.ceil(deductible / brandPrice) : 0;
        const deductiblePhaseCost = Math.min(deductible, brandPrice * monthsToDeductible);

        // After deductible, pay copay
        const annualBrandCost = deductiblePhaseCost + copay * (12 - monthsToDeductible);
        const annualCompoundedCost = compounded * 12;
        const annualSavings = annualCompoundedCost - annualBrandCost;

        const brandMonthly = annualBrandCost / 12;
        const recommendation = annualBrandCost < annualCompoundedCost ? "Brand (with insurance)" : "Compounded";

        return {
          primary: { label: "Better Value", value: recommendation },
          details: [
            { label: "Annual Brand Cost (insured)", value: `$${formatNumber(annualBrandCost, 2)}` },
            { label: "Annual Compounded Cost", value: `$${formatNumber(annualCompoundedCost, 2)}` },
            { label: "Effective Monthly (brand)", value: `$${formatNumber(brandMonthly, 2)}` },
            { label: "Monthly (compounded)", value: `$${formatNumber(compounded, 2)}` },
            { label: "Annual Difference", value: `$${formatNumber(Math.abs(annualSavings), 2)}` },
          ],
          note: "This analysis accounts for deductible phase costs. Brand insurance costs may count toward out-of-pocket maximum. Compounded costs do not apply to insurance deductibles or OOP max.",
        };
      },
    },
  ],
  relatedSlugs: ["wegovy-cost-calculator", "glp1-weight-loss-calculator", "mounjaro-dosage-calculator"],
  faq: [
    {
      question: "What is compounded semaglutide?",
      answer:
        "Compounded semaglutide is a version made by compounding pharmacies during FDA-declared drug shortages. It contains the same active ingredient but is not FDA-approved as a finished product. It is typically much cheaper than brand-name Wegovy or Ozempic.",
    },
    {
      question: "Is compounded semaglutide safe?",
      answer:
        "When sourced from licensed 503A or 503B compounding pharmacies, compounded semaglutide undergoes quality testing. However, it lacks the full FDA approval process of brand medications. The FDA has warned about risks from unregulated sources. Always verify your pharmacy's credentials.",
    },
  ],
  formula:
    "Total Savings = (Brand Monthly - Compounded Monthly) x Months | Savings % = (Brand - Compounded) / Brand x 100",
};
