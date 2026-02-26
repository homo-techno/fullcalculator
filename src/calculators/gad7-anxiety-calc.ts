import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gad7AnxietyCalculator: CalculatorDefinition = {
  slug: "gad7-anxiety-calculator",
  title: "GAD-7 Anxiety Screening Calculator",
  description:
    "Calculate your GAD-7 anxiety screening score. This validated questionnaire assesses the severity of generalized anxiety disorder symptoms over the past two weeks.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "GAD-7 calculator",
    "anxiety screening",
    "anxiety score",
    "GAD7 questionnaire",
    "generalized anxiety disorder",
    "anxiety assessment",
    "mental health screening",
  ],
  variants: [
    {
      id: "gad7-full",
      name: "GAD-7 Anxiety Screening",
      description: "Complete GAD-7 questionnaire — rate each item for the past 2 weeks",
      fields: [
        {
          name: "q1",
          label: "1. Feeling nervous, anxious, or on edge",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "q2",
          label: "2. Not being able to stop or control worrying",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "q3",
          label: "3. Worrying too much about different things",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "q4",
          label: "4. Trouble relaxing",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "q5",
          label: "5. Being so restless that it is hard to sit still",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "q6",
          label: "6. Becoming easily annoyed or irritable",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "q7",
          label: "7. Feeling afraid, as if something awful might happen",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
      ],
      calculate: (inputs) => {
        const scores = [
          parseFloat(inputs.q1 as string),
          parseFloat(inputs.q2 as string),
          parseFloat(inputs.q3 as string),
          parseFloat(inputs.q4 as string),
          parseFloat(inputs.q5 as string),
          parseFloat(inputs.q6 as string),
          parseFloat(inputs.q7 as string),
        ];

        if (scores.some(isNaN)) return null;

        const total = scores.reduce((sum, s) => sum + s, 0);

        let severity: string;
        let action: string;
        if (total <= 4) {
          severity = "Minimal Anxiety (0-4)";
          action = "No treatment typically needed. Monitor symptoms.";
        } else if (total <= 9) {
          severity = "Mild Anxiety (5-9)";
          action = "Watchful waiting. Consider self-help strategies, relaxation techniques, or counseling.";
        } else if (total <= 14) {
          severity = "Moderate Anxiety (10-14)";
          action = "Treatment likely warranted. Consider cognitive behavioral therapy (CBT) and/or medication.";
        } else {
          severity = "Severe Anxiety (15-21)";
          action = "Active treatment recommended. Consider CBT plus pharmacotherapy (SSRI/SNRI). Specialist referral may be appropriate.";
        }

        // GAD-2 sub-score (first 2 questions)
        const gad2 = scores[0] + scores[1];
        const gad2Screen = gad2 >= 3 ? "Positive (score >= 3) — further evaluation warranted" : "Negative (score < 3)";

        // Identify most problematic symptoms
        const symptomLabels = [
          "Nervousness", "Uncontrollable worry", "Excessive worry",
          "Trouble relaxing", "Restlessness", "Irritability", "Fearfulness",
        ];
        const highSymptoms = scores
          .map((s, i) => ({ score: s, label: symptomLabels[i] }))
          .filter(item => item.score >= 2)
          .map(item => item.label);

        return {
          primary: { label: "GAD-7 Score", value: `${formatNumber(total, 0)} / 21` },
          details: [
            { label: "Total Score", value: `${formatNumber(total, 0)} out of 21` },
            { label: "Severity", value: severity },
            { label: "GAD-2 Sub-Score", value: `${formatNumber(gad2, 0)} / 6 — ${gad2Screen}` },
            { label: "Prominent Symptoms", value: highSymptoms.length > 0 ? highSymptoms.join(", ") : "None at significant level" },
            { label: "Recommended Action", value: action },
          ],
          note: "The GAD-7 is a screening tool, NOT a diagnostic instrument. It screens primarily for Generalized Anxiety Disorder but also identifies panic, social anxiety, and PTSD symptoms. A clinical evaluation by a qualified provider is needed for diagnosis. If in crisis, call 988.",
        };
      },
    },
  ],
  relatedSlugs: ["phq9-depression-calculator", "concussion-assessment-calculator", "blood-oxygen-calculator"],
  faq: [
    {
      question: "What is the GAD-7?",
      answer:
        "The GAD-7 (Generalized Anxiety Disorder 7-item scale) is a validated self-report questionnaire used to screen for anxiety and monitor its severity. Each item is scored 0-3 for a total range of 0-21. It was developed by Drs. Spitzer, Kroenke, Williams, and Lowe.",
    },
    {
      question: "What GAD-7 score indicates anxiety disorder?",
      answer:
        "A score of 10 or higher suggests clinically significant anxiety warranting further evaluation and possible treatment. Using a cutoff of 10, the GAD-7 has 89% sensitivity and 82% specificity for generalized anxiety disorder. Scores of 5, 10, and 15 represent mild, moderate, and severe anxiety.",
    },
    {
      question: "What is the difference between GAD-7 and PHQ-9?",
      answer:
        "The GAD-7 screens for anxiety disorders (especially generalized anxiety), while the PHQ-9 screens for depression. They are often used together since anxiety and depression frequently co-occur. Both use the same 0-3 scoring for symptoms over the past 2 weeks.",
    },
  ],
  formula:
    "GAD-7 Total = Sum of 7 items (each scored 0-3) | Range: 0-21 | Minimal: 0-4 | Mild: 5-9 | Moderate: 10-14 | Severe: 15-21 | GAD-2 = Items 1 + 2 (positive if >= 3)",
};
