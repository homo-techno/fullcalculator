import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gradSchoolRoiCalculator: CalculatorDefinition = {
  slug: "grad-school-roi-calculator",
  title: "Grad School ROI Calculator",
  description: "Calculate the return on investment for pursuing a graduate degree",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["grad school ROI","masters degree value","graduate education return"],
  variants: [{
    id: "standard",
    name: "Grad School ROI",
    description: "Calculate the return on investment for pursuing a graduate degree",
    fields: [
      { name: "totalTuition", label: "Total Program Tuition ($)", type: "number", defaultValue: 60000, min: 0, step: 5000 },
      { name: "currentSalary", label: "Current Salary ($)", type: "number", defaultValue: 50000, min: 0, step: 5000 },
      { name: "expectedSalary", label: "Expected Post-Grad Salary ($)", type: "number", defaultValue: 75000, min: 0, step: 5000 },
      { name: "programYears", label: "Program Length (years)", type: "number", defaultValue: 2, min: 1, max: 6, step: 1 },
      { name: "opportunityCostRate", label: "Work During School (%)", type: "number", defaultValue: 50, min: 0, max: 100, step: 10 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const tuition = inputs.totalTuition as number || 60000;
      const current = inputs.currentSalary as number || 50000;
      const expected = inputs.expectedSalary as number || 75000;
      const years = inputs.programYears as number || 2;
      const workPct = (inputs.opportunityCostRate as number || 50) / 100;
      const lostIncome = current * years * (1 - workPct);
      const totalInvestment = tuition + lostIncome;
      const annualGain = expected - current;
      const paybackYears = annualGain > 0 ? totalInvestment / annualGain : 0;
      const tenYearReturn = annualGain * 10 - totalInvestment;
      const roi = totalInvestment > 0 ? (tenYearReturn / totalInvestment) * 100 : 0;
      return {
        primary: { label: "Payback Period", value: formatNumber(Math.round(paybackYears * 10) / 10) + " years" },
        details: [
          { label: "Total Investment", value: "$" + formatNumber(Math.round(totalInvestment)) },
          { label: "Annual Salary Increase", value: "$" + formatNumber(Math.round(annualGain)) },
          { label: "10-Year Net Return", value: "$" + formatNumber(Math.round(tenYearReturn)) },
          { label: "10-Year ROI", value: formatNumber(Math.round(roi)) + "%" }
        ]
      };
    },
  }],
  relatedSlugs: ["scholarship-roi-calculator"],
  faq: [
    { question: "What is included in the total investment?", answer: "Total investment includes tuition costs plus lost income during the program based on work percentage." },
    { question: "How is payback period calculated?", answer: "Payback period is total investment divided by the annual salary increase after graduation." },
  ],
  formula: "Payback = (Tuition + Lost Income) / (Post-Grad Salary - Current Salary)",
};
