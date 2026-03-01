import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const adoptionTaxCreditCalculator: CalculatorDefinition = {
  slug: "adoption-tax-credit-calculator",
  title: "Adoption Tax Credit Calculator",
  description: "Calculate the federal adoption tax credit based on qualified adoption expenses and income limits.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["adoption tax credit", "adoption credit calculator", "adoption expense credit"],
  variants: [{
    id: "standard",
    name: "Adoption Tax Credit",
    description: "Calculate the federal adoption tax credit based on qualified adoption expenses and income limits",
    fields: [
      { name: "qualifiedExpenses", label: "Qualified Adoption Expenses", type: "number", prefix: "$", min: 0, max: 100000, step: 500, defaultValue: 20000 },
      { name: "adoptionType", label: "Adoption Type", type: "select", options: [{value:"domestic",label:"Domestic Private"},{value:"foster",label:"Foster Care / Special Needs"},{value:"international",label:"International"}], defaultValue: "domestic" },
      { name: "modifiedAGI", label: "Modified Adjusted Gross Income", type: "number", prefix: "$", min: 0, max: 500000, step: 1000, defaultValue: 150000 },
    ],
    calculate: (inputs) => {
      const expenses = inputs.qualifiedExpenses as number;
      const type = inputs.adoptionType as string;
      const magi = inputs.modifiedAGI as number;
      if (!magi && magi !== 0) return null;
      const maxCredit = 16810;
      let credit;
      if (type === "foster") {
        credit = maxCredit;
      } else {
        credit = Math.min(expenses || 0, maxCredit);
      }
      const phaseoutStart = 252150;
      const phaseoutEnd = 292150;
      if (magi > phaseoutStart && magi < phaseoutEnd) {
        const reduction = (magi - phaseoutStart) / (phaseoutEnd - phaseoutStart);
        credit = credit * (1 - reduction);
      } else if (magi >= phaseoutEnd) {
        credit = 0;
      }
      credit = Math.max(0, Math.round(credit));
      const effectiveSavings = expenses > 0 ? (credit / expenses) * 100 : 0;
      return {
        primary: { label: "Adoption Tax Credit", value: "$" + formatNumber(credit) },
        details: [
          { label: "Maximum Credit Allowed", value: "$" + formatNumber(maxCredit) },
          { label: "Income Phase-out Status", value: magi >= phaseoutEnd ? "Fully phased out" : magi > phaseoutStart ? "Partially phased out" : "Full credit available" },
          { label: "Effective Coverage", value: formatNumber(Math.round(effectiveSavings)) + "% of expenses" },
        ],
      };
    },
  }],
  relatedSlugs: ["energy-tax-credit-calculator", "tax-refund-calculator"],
  faq: [
    { question: "What is the maximum adoption tax credit?", answer: "The maximum adoption tax credit is $16,810 per child for 2024. For special needs adoptions from foster care, the full credit amount is available regardless of actual expenses incurred." },
    { question: "Is the adoption tax credit refundable?", answer: "The adoption tax credit is not refundable, meaning it can only reduce your tax liability to zero. However, unused credit can be carried forward for up to five additional tax years." },
  ],
  formula: "Credit = Min(Qualified Expenses, $16,810) x Phase-out Factor based on MAGI; Foster Care = Full $16,810",
};
