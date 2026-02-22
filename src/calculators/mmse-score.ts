import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mmseScoreCalculator: CalculatorDefinition = {
  slug: "mmse-score",
  title: "MMSE Score Interpretation",
  description: "Free MMSE score interpretation tool. Evaluate Mini-Mental State Examination results for cognitive impairment screening and dementia assessment.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["mmse score", "mini mental state exam", "cognitive assessment", "dementia screening", "mmse interpretation", "cognitive impairment"],
  variants: [
    {
      id: "mmse-interpret",
      name: "MMSE Score Interpretation",
      fields: [
        { name: "orientation", label: "Orientation (0-10)", type: "number", placeholder: "e.g. 10", min: 0, max: 10 },
        { name: "registration", label: "Registration (0-3)", type: "number", placeholder: "e.g. 3", min: 0, max: 3 },
        { name: "attention", label: "Attention & Calculation (0-5)", type: "number", placeholder: "e.g. 5", min: 0, max: 5 },
        { name: "recall", label: "Recall (0-3)", type: "number", placeholder: "e.g. 3", min: 0, max: 3 },
        { name: "language", label: "Language & Praxis (0-9)", type: "number", placeholder: "e.g. 9", min: 0, max: 9 },
      ],
      calculate: (inputs) => {
        const orientation = inputs.orientation as number;
        const registration = inputs.registration as number;
        const attention = inputs.attention as number;
        const recall = inputs.recall as number;
        const language = inputs.language as number;
        if (orientation === undefined || registration === undefined || attention === undefined || recall === undefined || language === undefined) return null;
        const total = orientation + registration + attention + recall + language;
        let interpretation = "";
        let severity = "";
        if (total >= 27) { interpretation = "Normal cognition"; severity = "No impairment"; }
        else if (total >= 24) { interpretation = "Mild cognitive impairment possible"; severity = "Borderline"; }
        else if (total >= 19) { interpretation = "Mild cognitive impairment"; severity = "Mild dementia"; }
        else if (total >= 10) { interpretation = "Moderate cognitive impairment"; severity = "Moderate dementia"; }
        else { interpretation = "Severe cognitive impairment"; severity = "Severe dementia"; }
        return {
          primary: { label: "MMSE Total Score", value: formatNumber(total, 0) + " / 30" },
          details: [
            { label: "Total Score", value: formatNumber(total, 0) + " / 30" },
            { label: "Interpretation", value: interpretation },
            { label: "Severity", value: severity },
            { label: "Orientation", value: formatNumber(orientation, 0) + " / 10" },
            { label: "Registration", value: formatNumber(registration, 0) + " / 3" },
            { label: "Attention & Calculation", value: formatNumber(attention, 0) + " / 5" },
            { label: "Recall", value: formatNumber(recall, 0) + " / 3" },
            { label: "Language & Praxis", value: formatNumber(language, 0) + " / 9" },
          ],
          note: "MMSE scores are affected by age, education, and cultural factors. Scores 24-30: normal, 19-23: mild impairment, 10-18: moderate, <10: severe. Use as screening only - not diagnostic.",
        };
      },
    },
  ],
  relatedSlugs: ["morse-fall-scale", "braden-scale", "news-score"],
  faq: [
    { question: "What is the MMSE?", answer: "The Mini-Mental State Examination is a 30-point questionnaire that screens for cognitive impairment. It tests orientation, registration, attention, recall, and language." },
    { question: "What MMSE score indicates dementia?", answer: "Scores below 24 suggest cognitive impairment. 19-23: mild, 10-18: moderate, below 10: severe. However, MMSE alone cannot diagnose dementia." },
    { question: "What are MMSE limitations?", answer: "MMSE is influenced by education level, language, and cultural factors. It may miss mild cognitive impairment and is less sensitive to frontal lobe dysfunction." },
  ],
  formula: "MMSE = Orientation (10) + Registration (3) + Attention (5) + Recall (3) + Language (9) = 30 total",
};
