import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const expertWitnessFeeCalculator: CalculatorDefinition = {
  slug: "expert-witness-fee-calculator",
  title: "Expert Witness Fee Calculator",
  description: "Estimate expert witness costs including review, report, deposition, and trial testimony.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["expert witness fee","expert witness cost","expert testimony","litigation expert"],
  variants: [{
    id: "standard",
    name: "Expert Witness Fee",
    description: "Estimate expert witness costs including review, report, deposition, and trial testimony.",
    fields: [
      { name: "specialty", label: "Expert Specialty", type: "select", options: [{ value: "1", label: "Medical" }, { value: "2", label: "Engineering" }, { value: "3", label: "Financial/Accounting" }, { value: "4", label: "Vocational/Economic" }, { value: "5", label: "Technology/Computer" }], defaultValue: "1" },
      { name: "reviewHours", label: "Document Review Hours", type: "number", min: 1, max: 200, defaultValue: 20 },
      { name: "depositionHours", label: "Deposition Hours", type: "number", min: 0, max: 20, defaultValue: 4 },
      { name: "trialDays", label: "Trial Testimony Days", type: "number", min: 0, max: 10, defaultValue: 1 },
      { name: "reportNeeded", label: "Written Report Needed", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const specialty = parseInt(inputs.specialty as string);
    const reviewHours = inputs.reviewHours as number;
    const depositionHours = inputs.depositionHours as number;
    const trialDays = inputs.trialDays as number;
    const reportNeeded = parseInt(inputs.reportNeeded as string);
    const specialtyNames = ["", "Medical", "Engineering", "Financial/Accounting", "Vocational/Economic", "Technology/Computer"];
    const hourlyRates = [0, 500, 350, 400, 300, 450];
    const rate = hourlyRates[specialty] || 400;
    const reviewCost = reviewHours * rate;
    const depositionCost = depositionHours * rate * 1.25;
    const trialCost = trialDays * 8 * rate * 1.5;
    const reportCost = reportNeeded === 1 ? 3500 : 0;
    const travelExpenses = trialDays > 0 ? trialDays * 600 : 0;
    const totalCost = reviewCost + depositionCost + trialCost + reportCost + travelExpenses;
    return {
      primary: { label: "Estimated Expert Witness Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Specialty", value: specialtyNames[specialty] || "General" },
        { label: "Hourly Rate", value: "$" + formatNumber(rate) },
        { label: "Review Cost", value: "$" + formatNumber(reviewCost) },
        { label: "Deposition Cost", value: "$" + formatNumber(depositionCost) },
        { label: "Trial Testimony Cost", value: "$" + formatNumber(trialCost) },
        { label: "Report & Travel", value: "$" + formatNumber(reportCost + travelExpenses) }
      ]
    };
  },
  }],
  relatedSlugs: ["deposition-cost-calculator","legal-fee-estimator-calculator","settlement-value-estimator-calculator"],
  faq: [
    { question: "How much does an expert witness charge?", answer: "Expert witness fees typically range from $200 to $1,000+ per hour depending on specialty. Medical experts and PhDs tend to charge the highest rates." },
    { question: "Who pays for expert witness fees?", answer: "Each party pays for their own expert witnesses. In some cases, the losing party may be ordered to pay the winner's expert costs." },
    { question: "Can expert witness fees be recovered?", answer: "Federal courts allow recovery of limited expert witness fees (currently $40/day) as costs. Some state courts and fee-shifting statutes allow full recovery." },
  ],
  formula: "Total = Review Hours x Rate + Deposition x 1.25 Rate + Trial Days x 8 x 1.5 Rate + Report + Travel",
};
