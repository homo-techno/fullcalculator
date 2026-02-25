import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const apScorePredictCalculator: CalculatorDefinition = {
  slug: "ap-score-predict-calculator",
  title: "AP Score Predictor",
  description:
    "Free AP score predictor calculator. Estimate your AP exam score based on practice test results, study hours, and class performance.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "ap score predictor",
    "ap exam score calculator",
    "predict ap score",
    "ap test score estimate",
    "ap exam preparation",
  ],
  variants: [
    {
      id: "practice",
      name: "From Practice Tests",
      description: "Predict your AP score from practice exam results (as percentage correct)",
      fields: [
        { name: "multipleChoice", label: "Multiple Choice Score (%)", type: "number", placeholder: "e.g. 75", min: 0, max: 100, step: 0.1 },
        { name: "mcWeight", label: "MC Section Weight (%)", type: "number", placeholder: "e.g. 50", min: 0, max: 100, defaultValue: 50 },
        { name: "freeResponse", label: "Free Response Score (%)", type: "number", placeholder: "e.g. 65", min: 0, max: 100, step: 0.1 },
        { name: "frWeight", label: "FR Section Weight (%)", type: "number", placeholder: "e.g. 50", min: 0, max: 100, defaultValue: 50 },
      ],
      calculate: (inputs) => {
        const mc = inputs.multipleChoice as number;
        const mcWeight = (inputs.mcWeight as number) || 50;
        const fr = inputs.freeResponse as number;
        const frWeight = (inputs.frWeight as number) || 50;
        if (mc === undefined || fr === undefined) return null;

        const totalWeight = mcWeight + frWeight;
        const composite = (mc * mcWeight + fr * frWeight) / totalWeight;

        let predictedScore: number;
        let confidence: string;
        if (composite >= 80) { predictedScore = 5; confidence = "High"; }
        else if (composite >= 65) { predictedScore = 4; confidence = "High"; }
        else if (composite >= 50) { predictedScore = 3; confidence = "Moderate"; }
        else if (composite >= 35) { predictedScore = 2; confidence = "Moderate"; }
        else { predictedScore = 1; confidence = "Moderate"; }

        // Edge cases near boundaries reduce confidence
        const boundaries = [35, 50, 65, 80];
        for (const b of boundaries) {
          if (Math.abs(composite - b) < 5) confidence = "Low (near boundary)";
        }

        const creditLikely = predictedScore >= 3 ? "Yes (score 3+)" : "Unlikely (below 3)";

        return {
          primary: { label: "Predicted AP Score", value: `${predictedScore} / 5` },
          details: [
            { label: "Composite percentage", value: `${formatNumber(composite, 1)}%` },
            { label: "Prediction confidence", value: confidence },
            { label: "College credit likely?", value: creditLikely },
            { label: "MC / FR scores", value: `${formatNumber(mc, 0)}% / ${formatNumber(fr, 0)}%` },
          ],
        };
      },
    },
    {
      id: "class-performance",
      name: "From Class Performance",
      description: "Estimate AP score from your class grade and study habits",
      fields: [
        { name: "classGrade", label: "Current Class Grade (%)", type: "number", placeholder: "e.g. 88", min: 0, max: 100, step: 0.1 },
        { name: "studyHours", label: "Weekly AP Study Hours", type: "number", placeholder: "e.g. 5", min: 0, max: 40 },
        { name: "practiceExams", label: "Practice Exams Completed", type: "number", placeholder: "e.g. 3", min: 0, max: 20 },
        { name: "teacherRating", label: "Teacher Quality (1-5)", type: "number", placeholder: "e.g. 4", min: 1, max: 5 },
      ],
      calculate: (inputs) => {
        const grade = inputs.classGrade as number;
        const study = (inputs.studyHours as number) || 0;
        const practice = (inputs.practiceExams as number) || 0;
        const teacher = (inputs.teacherRating as number) || 3;
        if (grade === undefined) return null;

        // Weighted score model
        const gradeScore = grade / 20; // max 5
        const studyBonus = Math.min(0.5, study * 0.05);
        const practiceBonus = Math.min(0.5, practice * 0.1);
        const teacherBonus = (teacher - 3) * 0.15;

        const rawScore = gradeScore + studyBonus + practiceBonus + teacherBonus;
        const predicted = Math.max(1, Math.min(5, Math.round(rawScore)));

        return {
          primary: { label: "Predicted AP Score", value: `${predicted} / 5` },
          details: [
            { label: "Raw composite score", value: formatNumber(rawScore, 2) },
            { label: "Grade contribution", value: formatNumber(gradeScore, 2) },
            { label: "Study & practice bonus", value: `+${formatNumber(studyBonus + practiceBonus, 2)}` },
            { label: "College credit likely?", value: predicted >= 3 ? "Yes" : "Study more to reach 3+" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sat-score-calculator", "college-acceptance-calculator"],
  faq: [
    {
      question: "What AP score do I need for college credit?",
      answer:
        "Most colleges award credit for scores of 3 or higher, though selective schools may require a 4 or 5. Check each college's AP credit policy as they vary significantly.",
    },
    {
      question: "How accurate are AP score predictions?",
      answer:
        "Practice test scores are the best predictor, usually within 1 point of the actual score. Class grades and study habits provide a rougher estimate. Actual AP exam scoring curves change yearly.",
    },
  ],
  formula: "Composite = (MC% x MC Weight + FR% x FR Weight) / Total Weight",
};
