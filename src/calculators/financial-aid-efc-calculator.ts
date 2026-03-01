import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const financialAidEfcCalculator: CalculatorDefinition = {
  slug: "financial-aid-efc-calculator",
  title: "Financial Aid EFC Calculator",
  description: "Estimate your Expected Family Contribution for FAFSA financial aid",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["EFC calculator","FAFSA","financial aid estimate"],
  variants: [{
    id: "standard",
    name: "Financial Aid EFC",
    description: "Estimate your Expected Family Contribution for FAFSA financial aid",
    fields: [
      { name: "parentIncome", label: "Parent Annual Income ($)", type: "number", defaultValue: 75000, min: 0, step: 5000 },
      { name: "parentAssets", label: "Parent Assets ($)", type: "number", defaultValue: 50000, min: 0, step: 5000 },
      { name: "studentIncome", label: "Student Annual Income ($)", type: "number", defaultValue: 5000, min: 0, step: 1000 },
      { name: "familySize", label: "Family Size", type: "number", defaultValue: 4, min: 1, max: 12, step: 1 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const parentInc = inputs.parentIncome as number || 75000;
      const parentAst = inputs.parentAssets as number || 50000;
      const studentInc = inputs.studentIncome as number || 5000;
      const famSize = inputs.familySize as number || 4;
      const incomeProtection = famSize * 6500;
      const availableIncome = Math.max(0, parentInc - incomeProtection);
      const parentContrib = availableIncome * 0.22 + parentAst * 0.05;
      const studentContrib = Math.max(0, studentInc - 7040) * 0.50;
      const efc = Math.round(parentContrib + studentContrib);
      const avgCost = 25000;
      const estimatedNeed = Math.max(0, avgCost - efc);
      return {
        primary: { label: "Estimated EFC", value: "$" + formatNumber(efc) },
        details: [
          { label: "Parent Contribution", value: "$" + formatNumber(Math.round(parentContrib)) },
          { label: "Student Contribution", value: "$" + formatNumber(Math.round(studentContrib)) },
          { label: "Income Protection Allowance", value: "$" + formatNumber(incomeProtection) },
          { label: "Estimated Financial Need", value: "$" + formatNumber(estimatedNeed) }
        ]
      };
    },
  }],
  relatedSlugs: ["scholarship-roi-calculator"],
  faq: [
    { question: "What is the Expected Family Contribution?", answer: "EFC is a number used by schools to determine how much financial aid you are eligible to receive." },
    { question: "Is this the exact FAFSA EFC?", answer: "This is a simplified estimate. The actual FAFSA calculation considers many additional factors." },
  ],
  formula: "EFC = (Income - Protection) x 0.22 + Assets x 0.05 + Student Contribution",
};
