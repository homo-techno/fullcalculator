import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mesotheliomaSettlementCalculator: CalculatorDefinition = {
  slug: "mesothelioma-settlement-calculator",
  title: "Mesothelioma Settlement Calculator",
  description: "Estimate the potential settlement range for a mesothelioma or asbestos exposure claim based on key factors.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mesothelioma settlement", "asbestos settlement calculator", "mesothelioma claim value"],
  variants: [{
    id: "standard",
    name: "Mesothelioma Settlement",
    description: "Estimate the potential settlement range for a mesothelioma or asbestos exposure claim based on key factors",
    fields: [
      { name: "diagnosisStage", label: "Diagnosis Stage", type: "select", options: [{value:"1",label:"Stage 1"},{value:"2",label:"Stage 2"},{value:"3",label:"Stage 3"},{value:"4",label:"Stage 4"}], defaultValue: "2" },
      { name: "exposureYears", label: "Years of Asbestos Exposure", type: "number", suffix: "years", min: 1, max: 50, defaultValue: 15 },
      { name: "age", label: "Age at Diagnosis", type: "number", suffix: "years", min: 30, max: 90, defaultValue: 65 },
      { name: "claimType", label: "Claim Type", type: "select", options: [{value:"lawsuit",label:"Personal Injury Lawsuit"},{value:"trust",label:"Asbestos Trust Fund"},{value:"va",label:"VA Claim"},{value:"wrongfulDeath",label:"Wrongful Death"}], defaultValue: "lawsuit" },
    ],
    calculate: (inputs) => {
      const stage = parseInt(inputs.diagnosisStage as string);
      const exposureYears = inputs.exposureYears as number;
      const age = inputs.age as number;
      const claimType = inputs.claimType as string;
      if (!stage || !exposureYears) return null;
      const stageMultiplier: Record<number, number> = { 1: 0.6, 2: 1.0, 3: 1.4, 4: 1.8 };
      const claimBase: Record<string, number> = { lawsuit: 1000000, trust: 300000, va: 200000, wrongfulDeath: 1200000 };
      const base = claimBase[claimType] || 1000000;
      const stageMod = stageMultiplier[stage] || 1.0;
      const exposureMod = Math.min(exposureYears * 0.05, 1.0) + 0.5;
      const lowEstimate = base * stageMod * exposureMod * 0.5;
      const highEstimate = base * stageMod * exposureMod * 1.5;
      const avgSettlement = (lowEstimate + highEstimate) / 2;
      return {
        primary: { label: "Estimated Settlement Range", value: "$" + formatNumber(Math.round(lowEstimate)) + " - $" + formatNumber(Math.round(highEstimate)) },
        details: [
          { label: "Average Estimated Value", value: "$" + formatNumber(Math.round(avgSettlement)) },
          { label: "Claim Type", value: claimType === "wrongfulDeath" ? "Wrongful Death" : claimType === "va" ? "VA Claim" : claimType === "trust" ? "Trust Fund" : "Lawsuit" },
          { label: "Exposure Duration Factor", value: formatNumber(Math.round(exposureMod * 100) / 100) + "x" },
        ],
      };
    },
  }],
  relatedSlugs: ["workers-comp-calculator", "medical-debt-calculator"],
  faq: [
    { question: "What is the average mesothelioma settlement?", answer: "Mesothelioma settlements typically range from $1 million to $2.4 million, with trial verdicts sometimes exceeding $5 million. The amount depends on the stage of disease, exposure history, and responsible parties." },
    { question: "What are asbestos trust funds?", answer: "Asbestos trust funds were established by companies that filed for bankruptcy due to asbestos liabilities. These trusts hold billions of dollars to compensate victims and typically pay claims faster than lawsuits." },
  ],
  formula: "Settlement Range = Base Value x Stage Multiplier x Exposure Modifier",
};
