import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mmeCalculator: CalculatorDefinition = {
  slug: "mme-calculator",
  title: "Morphine Milligram Equivalents (MME) Calculator",
  description: "Free MME calculator. Convert opioid doses to morphine milligram equivalents to assess overdose risk using CDC conversion factors.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["mme calculator", "morphine milligram equivalents calculator", "opioid conversion calculator"],
  variants: [{
    id: "standard",
    name: "Morphine Milligram Equivalents (MME)",
    description: "Free MME calculator",
    fields: [
      { name: "opioid", label: "Opioid Medication", type: "select", options: [{ label: "Morphine", value: "1" }, { label: "Oxycodone", value: "1.5" }, { label: "Hydrocodone", value: "1" }, { label: "Hydromorphone (Dilaudid)", value: "4" }, { label: "Fentanyl patch (mcg/hr)", value: "2.4" }, { label: "Methadone (1-20mg/d)", value: "4" }, { label: "Codeine", value: "0.15" }, { label: "Tramadol", value: "0.1" }], defaultValue: "1.5" },
      { name: "dailyDose", label: "Total Daily Dose (mg)", type: "number", suffix: "mg", min: 0 },
    ],
    calculate: (inputs) => {
      const factor = parseFloat(inputs.opioid as string);
      const dose = inputs.dailyDose as number;
      if (!dose || dose <= 0) return null;
      const mme = dose * factor;
      let risk;
      if (mme < 50) risk = "Standard risk";
      else if (mme < 90) risk = "Increased risk — reassess need";
      else risk = "HIGH RISK — ≥90 MME/day significantly increases overdose risk";
      return {
        primary: { label: "Daily MME", value: formatNumber(mme) + " MME/day" },
        details: [
          { label: "Conversion factor", value: String(factor) },
          { label: "Daily dose", value: dose + " mg" },
          { label: "Risk level", value: risk },
          { label: "CDC threshold", value: mme >= 90 ? "EXCEEDS 90 MME/day" : mme >= 50 ? "Above 50 MME caution level" : "Below 50 MME" },
        ],
        note: "CDC guideline: avoid ≥90 MME/day or carefully justify. ≥50 MME/day: implement safeguards. Methadone conversion varies by total daily dose — this uses simplified factors.",
      };
    },
  }],
  relatedSlugs: ["drug-half-life", "bmi-calculator"],
  faq: [
    { question: "What is MME?", answer: "Morphine Milligram Equivalents standardize opioid potency. 1 mg oxycodone = 1.5 MME. CDC recommends caution above 50 MME/day and avoiding ≥90 MME/day." },
    { question: "Why is 90 MME the threshold?", answer: "Research shows overdose risk increases substantially at ≥90 MME/day. The 2022 CDC guideline recommends careful reassessment and documentation above this level." },
  ],
  formula: "MME = Daily Dose × Conversion Factor. CDC threshold: 50 MME (caution), 90 MME (high risk)",
};
