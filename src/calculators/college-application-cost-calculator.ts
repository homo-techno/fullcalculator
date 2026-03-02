import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const collegeApplicationCostCalculator: CalculatorDefinition = {
  slug: "college-application-cost-calculator",
  title: "College Application Cost Calculator",
  description: "Calculate the total cost of applying to multiple colleges.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["college","application","fees","cost","admissions"],
  variants: [{
    id: "standard",
    name: "College Application Cost",
    description: "Calculate the total cost of applying to multiple colleges.",
    fields: [
      { name: "numApplications", label: "Number of Applications", type: "number", min: 1, max: 25, step: 1, defaultValue: 8 },
      { name: "avgAppFee", label: "Average Application Fee ($)", type: "number", min: 25, max: 100, step: 5, defaultValue: 65 },
      { name: "testScoreSends", label: "Test Score Sends ($)", type: "number", min: 0, max: 200, step: 5, defaultValue: 60 },
      { name: "transcriptFees", label: "Transcript Fees ($)", type: "number", min: 0, max: 100, step: 5, defaultValue: 25 },
      { name: "cssProfileFee", label: "CSS Profile Fees ($)", type: "number", min: 0, max: 200, step: 5, defaultValue: 50 },
    ],
    calculate: (inputs) => {
    const numApplications = inputs.numApplications as number;
    const avgAppFee = inputs.avgAppFee as number;
    const testScoreSends = inputs.testScoreSends as number;
    const transcriptFees = inputs.transcriptFees as number;
    const cssProfileFee = inputs.cssProfileFee as number;
    const totalAppFees = numApplications * avgAppFee;
    const grandTotal = totalAppFees + testScoreSends + transcriptFees + cssProfileFee;
    const costPerApp = grandTotal / numApplications;
    return {
      primary: { label: "Total Application Cost", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Application Fees", value: "$" + formatNumber(totalAppFees) },
        { label: "Test Score Sends", value: "$" + formatNumber(testScoreSends) },
        { label: "Transcript Fees", value: "$" + formatNumber(transcriptFees) },
        { label: "Average Cost Per School", value: "$" + formatNumber(costPerApp) }
      ]
    };
  },
  }],
  relatedSlugs: ["graduation-party-calculator","dorm-room-essentials-calculator","sat-score-calculator"],
  faq: [
    { question: "How much do college applications cost?", answer: "College application fees range from $40 to $90 each, averaging about $65 per school." },
    { question: "Can application fees be waived?", answer: "Many schools offer fee waivers for students who demonstrate financial need." },
  ],
  formula: "Total Cost = (Applications x Avg Fee) + Score Sends + Transcripts + CSS Profile",
};
