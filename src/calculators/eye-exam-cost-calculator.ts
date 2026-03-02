import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eyeExamCostCalculator: CalculatorDefinition = {
  slug: "eye-exam-cost-calculator",
  title: "Eye Exam Cost Calculator",
  description: "Estimate eye exam costs based on exam type and insurance coverage.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["eye exam cost","vision exam price","optometrist visit cost"],
  variants: [{
    id: "standard",
    name: "Eye Exam Cost",
    description: "Estimate eye exam costs based on exam type and insurance coverage.",
    fields: [
      { name: "examType", label: "Exam Type", type: "select", options: [{ value: "1", label: "Routine Vision" }, { value: "2", label: "Contact Lens Fitting" }, { value: "3", label: "Comprehensive Medical" }] },
      { name: "insurance", label: "Vision Insurance", type: "select", options: [{ value: "0", label: "No Insurance" }, { value: "1", label: "Vision Plan" }, { value: "2", label: "Medical Insurance" }] },
      { name: "additionalTests", label: "Additional Tests", type: "select", options: [{ value: "0", label: "None" }, { value: "1", label: "Retinal Imaging ($40)" }, { value: "2", label: "Visual Field Test ($50)" }, { value: "3", label: "Both ($90)" }] },
    ],
    calculate: (inputs) => {
    const examType = inputs.examType as string;
    const insurance = inputs.insurance as string;
    const additionalTests = inputs.additionalTests as string;
    const examPrices: Record<string, number> = { "1": 100, "2": 150, "3": 250 };
    const examNames: Record<string, string> = { "1": "Routine Vision", "2": "Contact Lens Fitting", "3": "Comprehensive Medical" };
    const testCosts: Record<string, number> = { "0": 0, "1": 40, "2": 50, "3": 90 };
    const baseCost = examPrices[examType] || 100;
    const testCost = testCosts[additionalTests] || 0;
    let copay = 0;
    let coverageDesc = "No Insurance";
    if (insurance === "1") { copay = baseCost - 15; coverageDesc = "Vision Plan"; }
    else if (insurance === "2") { copay = baseCost - 35; coverageDesc = "Medical Insurance"; }
    const oop = (baseCost - copay) + testCost;
    return {
      primary: { label: "Your Cost", value: "$" + formatNumber(oop) },
      details: [
        { label: "Exam Type", value: examNames[examType] || "Routine" },
        { label: "Base Exam Price", value: "$" + formatNumber(baseCost) },
        { label: "Additional Tests", value: "$" + formatNumber(testCost) },
        { label: "Coverage", value: coverageDesc },
        { label: "Insurance Covers", value: "$" + formatNumber(copay) }
      ]
    };
  },
  }],
  relatedSlugs: ["contact-lens-cost-calculator","eyeglass-prescription-calculator","pupillary-distance-calculator"],
  faq: [
    { question: "How much does an eye exam cost without insurance?", answer: "A routine eye exam typically costs $75 to $200 without insurance coverage." },
    { question: "How often should I get an eye exam?", answer: "Adults should get a comprehensive eye exam every 1 to 2 years." },
    { question: "Does vision insurance cover contact lens fittings?", answer: "Many vision plans cover part of the contact lens fitting fee but may not cover it fully." },
  ],
  formula: "Your Cost = (Base Price - Insurance Coverage) + Additional Test Costs",
};
