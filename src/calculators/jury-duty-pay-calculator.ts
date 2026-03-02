import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const juryDutyPayCalculator: CalculatorDefinition = {
  slug: "jury-duty-pay-calculator",
  title: "Jury Duty Pay Calculator",
  description: "Calculate jury duty compensation and estimate lost wages.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["jury duty pay","juror compensation","jury service pay","jury duty wages"],
  variants: [{
    id: "standard",
    name: "Jury Duty Pay",
    description: "Calculate jury duty compensation and estimate lost wages.",
    fields: [
      { name: "days", label: "Days of Jury Service", type: "number", min: 1, max: 180, defaultValue: 5 },
      { name: "courtType", label: "Court Type", type: "select", options: [{ value: "1", label: "Federal Court ($50/day)" }, { value: "2", label: "State Court ($15-40/day)" }], defaultValue: "1" },
      { name: "dailyWage", label: "Your Daily Wage ($)", type: "number", min: 0, max: 5000, defaultValue: 250 },
      { name: "employerPays", label: "Employer Pays During Service?", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes, Full Pay" }, { value: "2", label: "Yes, Partial (50%)" }], defaultValue: "0" },
      { name: "mileage", label: "Round-Trip Miles to Court", type: "number", min: 0, max: 200, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const days = inputs.days as number;
    const courtType = parseInt(inputs.courtType as string);
    const dailyWage = inputs.dailyWage as number;
    const employerPays = parseInt(inputs.employerPays as string);
    const mileage = inputs.mileage as number;
    const juryPay = courtType === 1 ? 50 : 25;
    const totalJuryPay = juryPay * days;
    const mileageReimbursement = mileage * 0.655 * days;
    const employerPay = employerPays === 1 ? dailyWage * days : (employerPays === 2 ? dailyWage * 0.5 * days : 0);
    const normalEarnings = dailyWage * days;
    const totalCompensation = totalJuryPay + mileageReimbursement + employerPay;
    const lostWages = Math.max(normalEarnings - totalCompensation, 0);
    return {
      primary: { label: "Total Compensation", value: "$" + formatNumber(totalCompensation) },
      details: [
        { label: "Jury Pay", value: "$" + formatNumber(totalJuryPay) + " ($" + formatNumber(juryPay) + "/day)" },
        { label: "Mileage Reimbursement", value: "$" + formatNumber(mileageReimbursement) },
        { label: "Employer Pay", value: "$" + formatNumber(employerPay) },
        { label: "Normal Earnings", value: "$" + formatNumber(normalEarnings) },
        { label: "Estimated Lost Wages", value: "$" + formatNumber(lostWages) }
      ]
    };
  },
  }],
  relatedSlugs: ["legal-fee-estimator-calculator","court-filing-fee-calculator","case-timeline-estimator-calculator"],
  faq: [
    { question: "How much does jury duty pay?", answer: "Federal courts pay $50 per day ($60 after 10 days). State courts vary widely from $5 to $50 per day, with some paying nothing for the first few days." },
    { question: "Can my employer fire me for jury duty?", answer: "Federal law and most state laws prohibit employers from firing, threatening, or penalizing employees for serving on a jury." },
    { question: "How long does jury duty last?", answer: "Most jury service lasts 1 to 2 weeks for trial juries. Grand jury duty can last several months. Many people are dismissed after one day of selection." },
  ],
  formula: "Total Compensation = (Jury Pay x Days) + Mileage + Employer Pay",
};
