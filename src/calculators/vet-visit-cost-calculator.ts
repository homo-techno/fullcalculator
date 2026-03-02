import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vetVisitCostCalculator: CalculatorDefinition = {
  slug: "vet-visit-cost-calculator",
  title: "Vet Visit Cost Calculator",
  description: "Estimate veterinary visit costs based on visit type and pet size.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["vet visit cost","veterinary exam price","animal clinic cost"],
  variants: [{
    id: "standard",
    name: "Vet Visit Cost",
    description: "Estimate veterinary visit costs based on visit type and pet size.",
    fields: [
      { name: "visitType", label: "Visit Type", type: "select", options: [{ value: "1", label: "Routine Checkup" }, { value: "2", label: "Sick Visit" }, { value: "3", label: "Emergency" }] },
      { name: "petSize", label: "Pet Size", type: "select", options: [{ value: "1", label: "Small (under 20 lbs)" }, { value: "2", label: "Medium (20-50 lbs)" }, { value: "3", label: "Large (over 50 lbs)" }] },
      { name: "labWork", label: "Lab Work Needed", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }] },
    ],
    calculate: (inputs) => {
    const visitType = inputs.visitType as string;
    const petSize = inputs.petSize as string;
    const labWork = inputs.labWork as string;
    const visitCosts: Record<string, number> = { "1": 55, "2": 100, "3": 250 };
    const sizeMultiplier: Record<string, number> = { "1": 1.0, "2": 1.15, "3": 1.3 };
    const visitNames: Record<string, string> = { "1": "Routine Checkup", "2": "Sick Visit", "3": "Emergency" };
    const baseCost = visitCosts[visitType] || 55;
    const multiplier = sizeMultiplier[petSize] || 1.0;
    const examCost = Math.round(baseCost * multiplier);
    const labCost = labWork === "1" ? 150 : 0;
    const total = examCost + labCost;
    return {
      primary: { label: "Estimated Total", value: "$" + formatNumber(total) },
      details: [
        { label: "Visit Type", value: visitNames[visitType] || "Routine" },
        { label: "Exam Fee", value: "$" + formatNumber(examCost) },
        { label: "Lab Work", value: "$" + formatNumber(labCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["pet-vaccination-schedule-calculator","pet-dental-cost-calculator","pet-spay-neuter-cost-calculator"],
  faq: [
    { question: "How much does a routine vet visit cost?", answer: "A routine vet checkup typically costs $50 to $100 without additional tests." },
    { question: "Why do emergency vet visits cost more?", answer: "Emergency visits include after-hours staffing and urgent diagnostic equipment use." },
    { question: "Does pet size affect vet costs?", answer: "Larger pets may cost more for medications, anesthesia, and some procedures." },
  ],
  formula: "Total = (Base Visit Cost x Size Multiplier) + Lab Work Cost",
};
