import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nonprofitOverheadRateCalculator: CalculatorDefinition = {
  slug: "nonprofit-overhead-rate-calculator",
  title: "Nonprofit Overhead Rate Calculator",
  description: "Calculate the overhead ratio for a nonprofit organization.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["nonprofit","overhead","ratio","admin cost"],
  variants: [{
    id: "standard",
    name: "Nonprofit Overhead Rate",
    description: "Calculate the overhead ratio for a nonprofit organization.",
    fields: [
      { name: "totalExpenses", label: "Total Expenses ($)", type: "number", min: 1000, max: 50000000, defaultValue: 500000 },
      { name: "programExpenses", label: "Program Expenses ($)", type: "number", min: 1000, max: 50000000, defaultValue: 375000 },
      { name: "fundraisingExpenses", label: "Fundraising Expenses ($)", type: "number", min: 0, max: 5000000, defaultValue: 50000 },
    ],
    calculate: (inputs) => {
    const totalExpenses = inputs.totalExpenses as number;
    const programExpenses = inputs.programExpenses as number;
    const fundraisingExpenses = inputs.fundraisingExpenses as number;
    const adminExpenses = totalExpenses - programExpenses - fundraisingExpenses;
    const overheadRate = ((totalExpenses - programExpenses) / totalExpenses) * 100;
    const programRatio = (programExpenses / totalExpenses) * 100;
    const fundraisingRatio = (fundraisingExpenses / totalExpenses) * 100;
    const adminRatio = (adminExpenses / totalExpenses) * 100;
    return { primary: { label: "Overhead Rate", value: formatNumber(overheadRate) + "%" }, details: [{ label: "Program Ratio", value: formatNumber(programRatio) + "%" }, { label: "Admin Ratio", value: formatNumber(adminRatio) + "%" }, { label: "Fundraising Ratio", value: formatNumber(fundraisingRatio) + "%" }, { label: "Admin Expenses", value: "$" + formatNumber(adminExpenses) }] };
  },
  }],
  relatedSlugs: ["fundraising-roi-calculator","donor-retention-calculator","program-cost-per-outcome-calculator"],
  faq: [
    { question: "What is a good nonprofit overhead rate?", answer: "Most efficient nonprofits keep overhead between 15% and 25%." },
    { question: "What counts as overhead?", answer: "Administrative costs and fundraising expenses not tied to programs." },
    { question: "Does low overhead mean a better nonprofit?", answer: "Not always; adequate overhead supports sustainability and growth." },
  ],
  formula: "OverheadRate = ((TotalExpenses - ProgramExpenses) / TotalExpenses) * 100",
};
