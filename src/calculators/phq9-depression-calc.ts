import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const phq9DepressionCalculator: CalculatorDefinition = {
  slug: "phq9-depression-calculator",
  title: "PHQ-9 Depression Screening Calculator",
  description:
    "Calculate your PHQ-9 depression screening score. This validated questionnaire helps assess the severity of depressive symptoms over the past two weeks.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "PHQ-9 calculator",
    "depression screening",
    "depression score",
    "PHQ9 questionnaire",
    "mental health screening",
    "depression assessment",
    "depression severity",
  ],
  variants: [
    {
      id: "phq9-full",
      name: "PHQ-9 Depression Screening",
      description: "Complete PHQ-9 questionnaire — rate each item for the past 2 weeks",
      fields: [
        {
          name: "q1",
          label: "1. Little interest or pleasure in doing things",
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
          label: "2. Feeling down, depressed, or hopeless",
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
          label: "3. Trouble falling/staying asleep, or sleeping too much",
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
          label: "4. Feeling tired or having little energy",
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
          label: "5. Poor appetite or overeating",
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
          label: "6. Feeling bad about yourself or that you are a failure",
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
          label: "7. Trouble concentrating on things",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "q8",
          label: "8. Moving/speaking slowly or being fidgety/restless",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "q9",
          label: "9. Thoughts of self-harm or being better off dead",
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
          parseFloat(inputs.q8 as string),
          parseFloat(inputs.q9 as string),
        ];

        if (scores.some(isNaN)) return null;

        const total = scores.reduce((sum, s) => sum + s, 0);
        const q9Score = scores[8];

        let severity: string;
        let action: string;
        if (total <= 4) {
          severity = "Minimal Depression (0-4)";
          action = "May not require treatment. Monitor and rescreen as needed.";
        } else if (total <= 9) {
          severity = "Mild Depression (5-9)";
          action = "Watchful waiting. Repeat PHQ-9 at follow-up. Consider counseling.";
        } else if (total <= 14) {
          severity = "Moderate Depression (10-14)";
          action = "Treatment plan recommended — counseling and/or medication. Consider referral.";
        } else if (total <= 19) {
          severity = "Moderately Severe Depression (15-19)";
          action = "Active treatment recommended — antidepressant and/or psychotherapy.";
        } else {
          severity = "Severe Depression (20-27)";
          action = "Immediate treatment recommended — antidepressant with psychotherapy. Consider specialist referral.";
        }

        let safetyAlert = "";
        if (q9Score > 0) {
          safetyAlert = "IMPORTANT: You indicated thoughts of self-harm. If you are in crisis, call 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line) immediately.";
        }

        // PHQ-2 sub-score (first 2 questions)
        const phq2 = scores[0] + scores[1];
        const phq2Screen = phq2 >= 3 ? "Positive (score >= 3) — further evaluation warranted" : "Negative (score < 3)";

        return {
          primary: { label: "PHQ-9 Score", value: `${formatNumber(total, 0)} / 27` },
          details: [
            { label: "Total Score", value: `${formatNumber(total, 0)} out of 27` },
            { label: "Severity", value: severity },
            { label: "PHQ-2 Sub-Score", value: `${formatNumber(phq2, 0)} / 6 — ${phq2Screen}` },
            { label: "Recommended Action", value: action },
            ...(safetyAlert ? [{ label: "Safety Alert", value: safetyAlert }] : []),
          ],
          note: "The PHQ-9 is a validated screening tool, NOT a diagnostic instrument. A diagnosis of depression requires clinical evaluation by a qualified healthcare provider. If you or someone you know is in crisis, call 988 (Suicide & Crisis Lifeline).",
        };
      },
    },
  ],
  relatedSlugs: ["gad7-anxiety-calculator", "concussion-assessment-calculator", "blood-oxygen-calculator"],
  faq: [
    {
      question: "What is the PHQ-9?",
      answer:
        "The PHQ-9 (Patient Health Questionnaire-9) is a validated 9-item self-report tool used to screen for depression and monitor severity. Each item is scored 0-3, giving a total range of 0-27. It is widely used in primary care and research settings.",
    },
    {
      question: "What PHQ-9 score indicates depression?",
      answer:
        "A score of 10 or higher suggests clinically significant depression warranting treatment. Scores of 5-9 indicate mild symptoms, 10-14 moderate, 15-19 moderately severe, and 20-27 severe depression. A score of 10+ has 88% sensitivity and 88% specificity for major depression.",
    },
    {
      question: "How often should I take the PHQ-9?",
      answer:
        "In clinical settings, the PHQ-9 is typically administered at initial screening and then at follow-up visits (every 2-4 weeks) during treatment to monitor response. A decrease of 5 or more points is considered a clinically meaningful improvement.",
    },
  ],
  formula:
    "PHQ-9 Total = Sum of 9 items (each scored 0-3) | Range: 0-27 | Minimal: 0-4 | Mild: 5-9 | Moderate: 10-14 | Moderately Severe: 15-19 | Severe: 20-27 | PHQ-2 = Items 1 + 2 (positive if >= 3)",
};
