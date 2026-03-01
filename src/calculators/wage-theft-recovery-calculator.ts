import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wageTheftRecoveryCalculator: CalculatorDefinition = {
  slug: "wage-theft-recovery-calculator",
  title: "Wage Theft Recovery Calculator",
  description: "Estimate the amount recoverable in a wage theft claim including penalties.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["wage theft recovery", "unpaid wages claim", "wage theft calculator"],
  variants: [{
    id: "standard",
    name: "Wage Theft Recovery",
    description: "Estimate the amount recoverable in a wage theft claim including penalties",
    fields: [
      { name: "unpaidAmount", label: "Unpaid Wages", type: "number", prefix: "$", min: 0, max: 500000, defaultValue: 5000 },
      { name: "weeksUnpaid", label: "Weeks of Underpayment", type: "number", min: 1, max: 156, defaultValue: 26 },
      { name: "willful", label: "Willful Violation?", type: "select", options: [{value:"yes",label:"Yes - Willful"},{value:"no",label:"No - Unintentional"}], defaultValue: "no" },
    ],
    calculate: (inputs) => {
      const unpaid = inputs.unpaidAmount as number;
      const weeks = inputs.weeksUnpaid as number;
      const willful = inputs.willful as string;
      if (!unpaid || unpaid <= 0) return null;
      const liquidatedDamages = willful === "yes" ? unpaid : unpaid * 0.5;
      const interestRate = 0.06;
      const interest = unpaid * interestRate * (weeks / 52);
      const totalRecovery = unpaid + liquidatedDamages + interest;
      const attorneyFees = totalRecovery * 0.33;
      return {
        primary: { label: "Total Estimated Recovery", value: "$" + formatNumber(Math.round(totalRecovery)) },
        details: [
          { label: "Unpaid Wages", value: "$" + formatNumber(unpaid) },
          { label: "Liquidated Damages", value: "$" + formatNumber(Math.round(liquidatedDamages)) },
          { label: "Interest", value: "$" + formatNumber(Math.round(interest)) },
          { label: "Net After Attorney (33%)", value: "$" + formatNumber(Math.round(totalRecovery - attorneyFees)) },
        ],
      };
    },
  }],
  relatedSlugs: ["back-pay-calculator", "time-and-a-half-calculator"],
  faq: [
    { question: "What is wage theft?", answer: "Wage theft includes unpaid overtime, minimum wage violations, tip theft, misclassification, and failure to pay for all hours worked." },
    { question: "Can I recover more than just unpaid wages?", answer: "Yes, you may recover liquidated damages (often equal to unpaid wages), interest, and attorney fees in addition to the owed wages." },
  ],
  formula: "Recovery = Unpaid Wages + Liquidated Damages + Interest",
};
