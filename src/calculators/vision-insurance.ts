import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const visionInsuranceCalculator: CalculatorDefinition = {
  slug: "vision-insurance-savings-calculator",
  title: "Vision Insurance Savings Calculator",
  description:
    "Calculate whether vision insurance saves you money compared to paying out of pocket for eye exams, glasses, and contacts.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["vision insurance", "eye care costs", "glasses cost", "contacts cost", "vision savings"],
  variants: [
    {
      id: "savingsAnalysis",
      name: "Savings Analysis",
      fields: [
        { name: "monthlyPremium", label: "Monthly Premium ($)", type: "number", placeholder: "e.g. 15" },
        { name: "examCopay", label: "Eye Exam Copay ($)", type: "number", placeholder: "e.g. 10" },
        { name: "examRetailCost", label: "Eye Exam Retail Cost ($)", type: "number", placeholder: "e.g. 200" },
        { name: "glassesAllowance", label: "Glasses/Contacts Allowance ($)", type: "number", placeholder: "e.g. 150" },
        { name: "expectedGlassesCost", label: "Expected Glasses/Contacts Cost ($)", type: "number", placeholder: "e.g. 300" },
        { name: "examsPerYear", label: "Eye Exams Per Year", type: "number", placeholder: "e.g. 1" },
      ],
      calculate: (inputs) => {
        const monthlyPremium = inputs.monthlyPremium as number;
        const examCopay = inputs.examCopay as number || 0;
        const examRetailCost = inputs.examRetailCost as number;
        const glassesAllowance = inputs.glassesAllowance as number || 0;
        const expectedGlassesCost = inputs.expectedGlassesCost as number || 0;
        const examsPerYear = inputs.examsPerYear as number || 1;

        if (!monthlyPremium || !examRetailCost) return null;

        const annualPremium = monthlyPremium * 12;
        const examSavings = (examRetailCost - examCopay) * examsPerYear;
        const glassesSavings = Math.min(glassesAllowance, expectedGlassesCost);
        const totalSavings = examSavings + glassesSavings;
        const netSavings = totalSavings - annualPremium;
        const costWithInsurance = annualPremium + examCopay * examsPerYear + Math.max(expectedGlassesCost - glassesAllowance, 0);
        const costWithout = examRetailCost * examsPerYear + expectedGlassesCost;

        return {
          primary: { label: "Net Annual Savings", value: `$${formatNumber(netSavings, 2)}` },
          details: [
            { label: "Annual Premium", value: `$${formatNumber(annualPremium, 2)}` },
            { label: "Exam Savings", value: `$${formatNumber(examSavings, 2)}` },
            { label: "Glasses/Contacts Savings", value: `$${formatNumber(glassesSavings, 2)}` },
            { label: "Total Cost WITH Insurance", value: `$${formatNumber(costWithInsurance, 2)}` },
            { label: "Total Cost WITHOUT Insurance", value: `$${formatNumber(costWithout, 2)}` },
            { label: "Recommendation", value: netSavings > 0 ? "Insurance saves money" : "Paying out of pocket is cheaper" },
          ],
        };
      },
    },
    {
      id: "familyComparison",
      name: "Family Plan Comparison",
      fields: [
        { name: "monthlyPremiumIndividual", label: "Individual Monthly Premium ($)", type: "number", placeholder: "e.g. 15" },
        { name: "monthlyPremiumFamily", label: "Family Monthly Premium ($)", type: "number", placeholder: "e.g. 35" },
        { name: "familyMembers", label: "Number of Family Members", type: "number", placeholder: "e.g. 4" },
        { name: "avgExamCost", label: "Average Exam Cost per Person ($)", type: "number", placeholder: "e.g. 200" },
        { name: "avgGlassesCost", label: "Average Glasses Cost per Person ($)", type: "number", placeholder: "e.g. 250" },
        { name: "allowancePerPerson", label: "Allowance per Person ($)", type: "number", placeholder: "e.g. 150" },
      ],
      calculate: (inputs) => {
        const monthlyPremiumIndividual = inputs.monthlyPremiumIndividual as number;
        const monthlyPremiumFamily = inputs.monthlyPremiumFamily as number;
        const familyMembers = inputs.familyMembers as number;
        const avgExamCost = inputs.avgExamCost as number;
        const avgGlassesCost = inputs.avgGlassesCost as number;
        const allowancePerPerson = inputs.allowancePerPerson as number || 0;

        if (!monthlyPremiumFamily || !familyMembers || !avgExamCost) return null;

        const annualFamilyPremium = monthlyPremiumFamily * 12;
        const annualIndividualTotal = monthlyPremiumIndividual * 12 * familyMembers;
        const totalRetailCost = (avgExamCost + avgGlassesCost) * familyMembers;
        const totalAllowance = allowancePerPerson * familyMembers;
        const familyNetSavings = (totalRetailCost - annualFamilyPremium) - (totalRetailCost - totalAllowance - totalRetailCost);
        const savingsVsNone = totalRetailCost - annualFamilyPremium;

        return {
          primary: { label: "Family Plan Annual Savings vs No Insurance", value: `$${formatNumber(savingsVsNone, 2)}` },
          details: [
            { label: "Family Plan Annual Cost", value: `$${formatNumber(annualFamilyPremium, 2)}` },
            { label: "Individual Plans Total Cost", value: `$${formatNumber(annualIndividualTotal, 2)}` },
            { label: "Family Plan vs Individual Plans Savings", value: `$${formatNumber(annualIndividualTotal - annualFamilyPremium, 2)}` },
            { label: "Total Retail Cost (no insurance)", value: `$${formatNumber(totalRetailCost, 2)}` },
            { label: "Cost per Family Member (family plan)", value: `$${formatNumber(annualFamilyPremium / familyMembers, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dental-insurance-savings-calculator", "health-insurance-cost-calculator", "health-insurance-subsidy-calculator"],
  faq: [
    { question: "Is vision insurance worth it?", answer: "Vision insurance can save money if you regularly need eye exams, glasses, or contacts. For those with good vision who rarely need eye care, paying out of pocket may be more economical." },
    { question: "What does vision insurance typically cover?", answer: "Most vision plans cover one annual eye exam with a small copay, and provide an allowance (typically $100-$200) toward frames or contact lenses. Some plans also offer discounts on LASIK surgery." },
  ],
  formula: "Net Savings = (Exam Savings + Glasses Allowance) − Annual Premium",
};
