import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const courtFilingFeeCalculator: CalculatorDefinition = {
  slug: "court-filing-fee-calculator",
  title: "Court Filing Fee Calculator",
  description: "Estimate court filing fees based on case type, court level, and jurisdiction.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["court filing fee","court costs","filing fees","lawsuit cost"],
  variants: [{
    id: "standard",
    name: "Court Filing Fee",
    description: "Estimate court filing fees based on case type, court level, and jurisdiction.",
    fields: [
      { name: "caseType", label: "Case Type", type: "select", options: [{ value: "1", label: "Small Claims" }, { value: "2", label: "Civil (under $25k)" }, { value: "3", label: "Civil ($25k-$100k)" }, { value: "4", label: "Civil (over $100k)" }, { value: "5", label: "Family/Divorce" }, { value: "6", label: "Criminal" }], defaultValue: "2" },
      { name: "courtLevel", label: "Court Level", type: "select", options: [{ value: "1", label: "Municipal/Local" }, { value: "2", label: "State/Superior" }, { value: "3", label: "Federal District" }, { value: "4", label: "Appellate" }], defaultValue: "2" },
      { name: "additionalMotions", label: "Additional Motions", type: "number", min: 0, max: 20, defaultValue: 0 },
      { name: "eFilingDiscount", label: "E-Filing", type: "select", options: [{ value: "0", label: "Paper Filing" }, { value: "1", label: "E-Filing" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const caseType = parseInt(inputs.caseType as string);
    const courtLevel = parseInt(inputs.courtLevel as string);
    const additionalMotions = inputs.additionalMotions as number;
    const eFiling = parseInt(inputs.eFilingDiscount as string);
    const baseFees = [75, 200, 350, 500, 300, 150];
    const courtMultipliers = [0.8, 1, 1.5, 2];
    const baseFee = (baseFees[caseType - 1] || 200) * (courtMultipliers[courtLevel - 1] || 1);
    const motionFee = additionalMotions * 60;
    const subtotal = baseFee + motionFee;
    const eDiscount = eFiling === 1 ? subtotal * 0.1 : 0;
    const total = subtotal - eDiscount;
    return {
      primary: { label: "Estimated Filing Fees", value: "$" + formatNumber(total) },
      details: [
        { label: "Base Filing Fee", value: "$" + formatNumber(baseFee) },
        { label: "Motion Fees", value: "$" + formatNumber(motionFee) },
        { label: "E-Filing Savings", value: "$" + formatNumber(eDiscount) },
        { label: "Subtotal Before Discount", value: "$" + formatNumber(subtotal) }
      ]
    };
  },
  }],
  relatedSlugs: ["legal-fee-estimator-calculator","settlement-value-estimator-calculator","case-timeline-estimator-calculator"],
  faq: [
    { question: "How much does it cost to file a lawsuit?", answer: "Filing fees vary widely from $30 for small claims to $400+ for federal civil cases depending on jurisdiction and case type." },
    { question: "Can court filing fees be waived?", answer: "Yes, courts offer fee waivers (in forma pauperis) for individuals who cannot afford the fees, typically requiring proof of income." },
    { question: "Are filing fees refundable?", answer: "Generally, court filing fees are non-refundable once the case has been filed, even if the case is dismissed or settled." },
  ],
  formula: "Total Fees = (Base Fee x Court Multiplier) + (Motion Count x Motion Fee) - E-Filing Discount",
};
