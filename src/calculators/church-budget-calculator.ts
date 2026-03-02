import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const churchBudgetCalculator: CalculatorDefinition = {
  slug: "church-budget-calculator",
  title: "Church Budget Calculator",
  description: "Allocate a church budget across ministry categories.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["church","budget","ministry","allocation"],
  variants: [{
    id: "standard",
    name: "Church Budget",
    description: "Allocate a church budget across ministry categories.",
    fields: [
      { name: "totalBudget", label: "Total Annual Budget ($)", type: "number", min: 10000, max: 10000000, defaultValue: 250000 },
      { name: "staffPct", label: "Staff & Salaries (%)", type: "number", min: 10, max: 70, defaultValue: 45 },
      { name: "facilitiesPct", label: "Facilities & Utilities (%)", type: "number", min: 5, max: 40, defaultValue: 20 },
      { name: "missionsPct", label: "Missions & Outreach (%)", type: "number", min: 0, max: 30, defaultValue: 15 },
    ],
    calculate: (inputs) => {
    const totalBudget = inputs.totalBudget as number;
    const staffPct = inputs.staffPct as number;
    const facilitiesPct = inputs.facilitiesPct as number;
    const missionsPct = inputs.missionsPct as number;
    const otherPct = 100 - staffPct - facilitiesPct - missionsPct;
    const staffAmt = totalBudget * (staffPct / 100);
    const facilitiesAmt = totalBudget * (facilitiesPct / 100);
    const missionsAmt = totalBudget * (missionsPct / 100);
    const otherAmt = totalBudget * (otherPct / 100);
    return { primary: { label: "Staff Budget", value: "$" + formatNumber(staffAmt) }, details: [{ label: "Facilities Budget", value: "$" + formatNumber(facilitiesAmt) }, { label: "Missions Budget", value: "$" + formatNumber(missionsAmt) }, { label: "Other Ministries", value: "$" + formatNumber(otherAmt) }, { label: "Other Percentage", value: formatNumber(otherPct) + "%" }] };
  },
  }],
  relatedSlugs: ["church-tithe-calculator","mission-trip-cost-calculator","nonprofit-overhead-rate-calculator"],
  faq: [
    { question: "What percentage should churches spend on staff?", answer: "Most churches allocate 40% to 55% of the budget to staff and salaries." },
    { question: "How much should go to missions?", answer: "A common guideline is 10% to 20% of the total budget for missions." },
    { question: "What falls under facilities costs?", answer: "Mortgage, utilities, maintenance, insurance, and capital improvements." },
  ],
  formula: "StaffBudget = TotalBudget * StaffPct/100; Other = TotalBudget * RemainingPct/100",
};
