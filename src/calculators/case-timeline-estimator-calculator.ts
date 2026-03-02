import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const caseTimelineEstimatorCalculator: CalculatorDefinition = {
  slug: "case-timeline-estimator-calculator",
  title: "Case Timeline Estimator Calculator",
  description: "Estimate how long a legal case will take from filing to resolution.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["case timeline","lawsuit duration","case length","legal case timeline"],
  variants: [{
    id: "standard",
    name: "Case Timeline Estimator",
    description: "Estimate how long a legal case will take from filing to resolution.",
    fields: [
      { name: "caseType", label: "Case Type", type: "select", options: [{ value: "1", label: "Small Claims" }, { value: "2", label: "Personal Injury" }, { value: "3", label: "Divorce/Family" }, { value: "4", label: "Contract Dispute" }, { value: "5", label: "Criminal" }, { value: "6", label: "Medical Malpractice" }], defaultValue: "2" },
      { name: "complexity", label: "Case Complexity", type: "select", options: [{ value: "1", label: "Simple" }, { value: "2", label: "Moderate" }, { value: "3", label: "Complex" }], defaultValue: "2" },
      { name: "goToTrial", label: "Likely Outcome", type: "select", options: [{ value: "1", label: "Settlement" }, { value: "2", label: "Mediation" }, { value: "3", label: "Trial" }], defaultValue: "1" },
      { name: "courtBacklog", label: "Court Backlog", type: "select", options: [{ value: "1", label: "Light" }, { value: "2", label: "Moderate" }, { value: "3", label: "Heavy" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const caseType = parseInt(inputs.caseType as string);
    const complexity = parseInt(inputs.complexity as string);
    const goToTrial = parseInt(inputs.goToTrial as string);
    const courtBacklog = parseInt(inputs.courtBacklog as string);
    const caseNames = ["", "Small Claims", "Personal Injury", "Divorce/Family", "Contract Dispute", "Criminal", "Medical Malpractice"];
    const baseMonths = [0, 3, 12, 8, 10, 6, 18];
    const complexMultiplier = [1, 1.5, 2.5][complexity - 1] || 1.5;
    const trialMultiplier = [0.6, 0.8, 1.5][goToTrial - 1] || 1;
    const backlogMultiplier = [0.8, 1, 1.4][courtBacklog - 1] || 1;
    const totalMonths = Math.round((baseMonths[caseType] || 10) * complexMultiplier * trialMultiplier * backlogMultiplier);
    const discoveryPhase = Math.round(totalMonths * 0.4);
    const pretrial = Math.round(totalMonths * 0.25);
    const resolution = totalMonths - discoveryPhase - pretrial;
    return {
      primary: { label: "Estimated Case Duration", value: formatNumber(totalMonths) + " months" },
      details: [
        { label: "Case Type", value: caseNames[caseType] || "General" },
        { label: "Discovery Phase", value: formatNumber(discoveryPhase) + " months" },
        { label: "Pre-Trial Phase", value: formatNumber(pretrial) + " months" },
        { label: "Resolution Phase", value: formatNumber(resolution) + " months" }
      ]
    };
  },
  }],
  relatedSlugs: ["court-filing-fee-calculator","legal-fee-estimator-calculator","settlement-value-estimator-calculator"],
  faq: [
    { question: "How long does a typical lawsuit take?", answer: "Most civil lawsuits take 12 to 24 months. Simple cases may resolve in 3 to 6 months, while complex litigation can take 3 to 5 years." },
    { question: "What is the discovery phase?", answer: "Discovery is the pre-trial phase where both sides exchange evidence, take depositions, and gather information. It typically takes the longest portion of a case." },
    { question: "Does settling save time?", answer: "Yes, settlements typically resolve cases 40 to 60 percent faster than going to trial, and avoid the uncertainty of a jury verdict." },
  ],
  formula: "Duration = Base Months x Complexity x Trial Factor x Court Backlog Factor",
};
