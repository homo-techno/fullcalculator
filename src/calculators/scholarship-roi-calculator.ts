import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const scholarshipRoiCalculator: CalculatorDefinition = {
  slug: "scholarship-roi-calculator",
  title: "Scholarship ROI Calculator",
  description: "Compare scholarship value against out-of-pocket college costs",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["scholarship ROI","scholarship value","college cost comparison"],
  variants: [{
    id: "standard",
    name: "Scholarship ROI",
    description: "Compare scholarship value against out-of-pocket college costs",
    fields: [
      { name: "annualTuition", label: "Annual Tuition ($)", type: "number", defaultValue: 30000, min: 0, step: 1000 },
      { name: "scholarshipAmount", label: "Annual Scholarship ($)", type: "number", defaultValue: 10000, min: 0, step: 500 },
      { name: "yearsOfStudy", label: "Years of Study", type: "number", defaultValue: 4, min: 1, max: 8, step: 1 },
      { name: "livingExpenses", label: "Annual Living Expenses ($)", type: "number", defaultValue: 12000, min: 0, step: 500 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const tuition = inputs.annualTuition as number || 30000;
      const scholarship = inputs.scholarshipAmount as number || 10000;
      const years = inputs.yearsOfStudy as number || 4;
      const living = inputs.livingExpenses as number || 12000;
      const totalCost = (tuition + living) * years;
      const totalScholarship = scholarship * years;
      const outOfPocket = totalCost - totalScholarship;
      const coveragePercent = (totalScholarship / totalCost) * 100;
      return {
        primary: { label: "Out-of-Pocket Cost", value: "$" + formatNumber(Math.round(outOfPocket)) },
        details: [
          { label: "Total Education Cost", value: "$" + formatNumber(Math.round(totalCost)) },
          { label: "Total Scholarship Value", value: "$" + formatNumber(Math.round(totalScholarship)) },
          { label: "Scholarship Coverage", value: formatNumber(Math.round(coveragePercent * 10) / 10) + "%" },
          { label: "Annual Out-of-Pocket", value: "$" + formatNumber(Math.round(outOfPocket / years)) }
        ]
      };
    },
  }],
  relatedSlugs: ["college-savings-gap-calculator"],
  faq: [
    { question: "What costs does this include?", answer: "This includes tuition and living expenses. It does not include books, fees, or transportation." },
    { question: "How is scholarship coverage calculated?", answer: "Coverage is the total scholarship divided by total education cost expressed as a percentage." },
  ],
  formula: "Out-of-Pocket = (Tuition + Living) x Years - (Scholarship x Years)",
};
