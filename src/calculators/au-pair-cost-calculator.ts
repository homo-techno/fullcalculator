import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const auPairCostCalculator: CalculatorDefinition = {
  slug: "au-pair-cost-calculator",
  title: "Au Pair Cost Calculator",
  description: "Estimate the annual cost of hosting an au pair including stipend and fees.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["au pair","childcare","annual","cost","nanny"],
  variants: [{
    id: "standard",
    name: "Au Pair Cost",
    description: "Estimate the annual cost of hosting an au pair including stipend and fees.",
    fields: [
      { name: "weeklyStipend", label: "Weekly Stipend ($)", type: "number", min: 100, max: 500, step: 10, defaultValue: 196 },
      { name: "agencyFee", label: "Agency Fee ($)", type: "number", min: 2000, max: 15000, step: 100, defaultValue: 8000 },
      { name: "educationAllowance", label: "Education Allowance ($)", type: "number", min: 0, max: 2000, step: 50, defaultValue: 500 },
      { name: "roomBoardMonthly", label: "Room and Board Monthly ($)", type: "number", min: 200, max: 1500, step: 50, defaultValue: 500 },
    ],
    calculate: (inputs) => {
    const weeklyStipend = inputs.weeklyStipend as number;
    const agencyFee = inputs.agencyFee as number;
    const educationAllowance = inputs.educationAllowance as number;
    const roomBoardMonthly = inputs.roomBoardMonthly as number;
    const annualStipend = weeklyStipend * 52;
    const annualRoomBoard = roomBoardMonthly * 12;
    const totalAnnual = annualStipend + agencyFee + educationAllowance + annualRoomBoard;
    const monthlyCost = totalAnnual / 12;
    return {
      primary: { label: "Annual Cost", value: "$" + formatNumber(totalAnnual) },
      details: [
        { label: "Annual Stipend", value: "$" + formatNumber(annualStipend) },
        { label: "Annual Room and Board", value: "$" + formatNumber(annualRoomBoard) },
        { label: "Agency Fee", value: "$" + formatNumber(agencyFee) },
        { label: "Monthly Cost", value: "$" + formatNumber(monthlyCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["babysitting-rate-calculator","after-school-program-cost-calculator","tutoring-cost-calculator"],
  faq: [
    { question: "How much does an au pair cost per year?", answer: "The total annual cost typically ranges from $18,000 to $30,000 including all fees." },
    { question: "What is the required au pair stipend?", answer: "The U.S. Department of State sets a minimum weekly stipend of $195.75." },
  ],
  formula: "Annual Cost = (Weekly Stipend x 52) + Agency Fee + Education Allowance + (Room and Board x 12)",
};
