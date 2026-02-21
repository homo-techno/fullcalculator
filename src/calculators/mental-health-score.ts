import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mentalHealthScoreCalculator: CalculatorDefinition = {
  slug: "mental-health-score-calculator",
  title: "Mental Health Assessment Score Calculator",
  description:
    "Free mental health assessment score calculator. Screen for depression and anxiety using validated questionnaire formats (PHQ-9 and GAD-7 inspired). Track your mental wellness over time.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "mental health score",
    "depression screening",
    "anxiety assessment",
    "PHQ-9",
    "GAD-7",
    "mental wellness",
    "mental health calculator",
    "depression score",
    "anxiety score",
  ],
  variants: [
    {
      id: "depression",
      name: "Depression Screening (PHQ-9 Format)",
      description: "Screen for depression severity using the PHQ-9 questionnaire format",
      fields: [
        {
          name: "interest",
          label: "Little interest or pleasure in doing things",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "mood",
          label: "Feeling down, depressed, or hopeless",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "sleep",
          label: "Trouble falling/staying asleep, or sleeping too much",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "energy",
          label: "Feeling tired or having little energy",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "appetite",
          label: "Poor appetite or overeating",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "selfImage",
          label: "Feeling bad about yourself or that you're a failure",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "concentration",
          label: "Trouble concentrating on things",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "psychomotor",
          label: "Moving/speaking slowly, or being restless/fidgety",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "selfHarm",
          label: "Thoughts that you would be better off dead or of hurting yourself",
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
          parseInt(inputs.interest as string) || 0,
          parseInt(inputs.mood as string) || 0,
          parseInt(inputs.sleep as string) || 0,
          parseInt(inputs.energy as string) || 0,
          parseInt(inputs.appetite as string) || 0,
          parseInt(inputs.selfImage as string) || 0,
          parseInt(inputs.concentration as string) || 0,
          parseInt(inputs.psychomotor as string) || 0,
          parseInt(inputs.selfHarm as string) || 0,
        ];

        const total = scores.reduce((a, b) => a + b, 0);
        const selfHarmScore = scores[8];

        let severity: string;
        let recommendation: string;
        if (total <= 4) {
          severity = "Minimal depression";
          recommendation = "Monitor; may not require treatment";
        } else if (total <= 9) {
          severity = "Mild depression";
          recommendation = "Watchful waiting; consider counseling if persistent";
        } else if (total <= 14) {
          severity = "Moderate depression";
          recommendation = "Consider counseling and/or medication; consult a provider";
        } else if (total <= 19) {
          severity = "Moderately severe depression";
          recommendation = "Active treatment recommended (therapy and/or medication)";
        } else {
          severity = "Severe depression";
          recommendation = "Immediate treatment with combined therapy and medication strongly recommended";
        }

        const urgentNote = selfHarmScore > 0
          ? "IMPORTANT: You indicated thoughts of self-harm. Please reach out to a mental health professional, call 988 (Suicide & Crisis Lifeline), or go to your nearest emergency room."
          : "";

        return {
          primary: { label: "PHQ-9 Score", value: `${total}/27 — ${severity}` },
          details: [
            { label: "Total score", value: `${total} / 27` },
            { label: "Severity", value: severity },
            { label: "Recommendation", value: recommendation },
            ...(urgentNote ? [{ label: "URGENT", value: urgentNote }] : []),
            { label: "Score ranges", value: "0-4: Minimal, 5-9: Mild, 10-14: Moderate, 15-19: Moderately Severe, 20-27: Severe" },
          ],
          note: "This screening tool is based on the PHQ-9 questionnaire format. A score of 10 or higher suggests clinically significant depression warranting further evaluation. THIS IS A SCREENING TOOL, NOT A DIAGNOSIS. Only a qualified mental health professional can diagnose depression. If you are in crisis, call 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line).",
        };
      },
    },
    {
      id: "anxiety",
      name: "Anxiety Screening (GAD-7 Format)",
      description: "Screen for anxiety severity using the GAD-7 questionnaire format",
      fields: [
        {
          name: "nervous",
          label: "Feeling nervous, anxious, or on edge",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "controlWorry",
          label: "Not being able to stop or control worrying",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "excessiveWorry",
          label: "Worrying too much about different things",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "relaxing",
          label: "Trouble relaxing",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "restless",
          label: "Being so restless that it's hard to sit still",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "irritable",
          label: "Becoming easily annoyed or irritable",
          type: "select",
          options: [
            { label: "Not at all (0)", value: "0" },
            { label: "Several days (1)", value: "1" },
            { label: "More than half the days (2)", value: "2" },
            { label: "Nearly every day (3)", value: "3" },
          ],
        },
        {
          name: "afraid",
          label: "Feeling afraid as if something awful might happen",
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
          parseInt(inputs.nervous as string) || 0,
          parseInt(inputs.controlWorry as string) || 0,
          parseInt(inputs.excessiveWorry as string) || 0,
          parseInt(inputs.relaxing as string) || 0,
          parseInt(inputs.restless as string) || 0,
          parseInt(inputs.irritable as string) || 0,
          parseInt(inputs.afraid as string) || 0,
        ];

        const total = scores.reduce((a, b) => a + b, 0);

        let severity: string;
        let recommendation: string;
        if (total <= 4) {
          severity = "Minimal anxiety";
          recommendation = "Monitor; may not require treatment";
        } else if (total <= 9) {
          severity = "Mild anxiety";
          recommendation = "Watchful waiting; consider self-help strategies and counseling if persistent";
        } else if (total <= 14) {
          severity = "Moderate anxiety";
          recommendation = "Consider counseling (CBT) and/or medication; consult a provider";
        } else {
          severity = "Severe anxiety";
          recommendation = "Active treatment strongly recommended (CBT and/or medication)";
        }

        return {
          primary: { label: "GAD-7 Score", value: `${total}/21 — ${severity}` },
          details: [
            { label: "Total score", value: `${total} / 21` },
            { label: "Severity", value: severity },
            { label: "Recommendation", value: recommendation },
            { label: "Score ranges", value: "0-4: Minimal, 5-9: Mild, 10-14: Moderate, 15-21: Severe" },
            { label: "Evidence-based treatments", value: "Cognitive Behavioral Therapy (CBT), medication (SSRIs/SNRIs), mindfulness, exercise, and relaxation techniques" },
          ],
          note: "This screening tool is based on the GAD-7 questionnaire format. A score of 10 or higher suggests clinically significant anxiety warranting further evaluation. THIS IS A SCREENING TOOL, NOT A DIAGNOSIS. Only a qualified mental health professional can diagnose anxiety disorders. If you are in crisis, call 988 (Suicide & Crisis Lifeline) or visit your nearest emergency room.",
        };
      },
    },
    {
      id: "wellness",
      name: "General Mental Wellness Check",
      description: "Quick general mental wellness assessment",
      fields: [
        {
          name: "overallMood",
          label: "Overall Mood (past 2 weeks)",
          type: "select",
          options: [
            { label: "Excellent — mostly positive", value: "5" },
            { label: "Good — generally positive", value: "4" },
            { label: "Fair — mixed", value: "3" },
            { label: "Poor — mostly negative", value: "2" },
            { label: "Very poor — overwhelmingly negative", value: "1" },
          ],
        },
        {
          name: "coping",
          label: "Ability to Cope with Daily Stress",
          type: "select",
          options: [
            { label: "Very well — managing easily", value: "5" },
            { label: "Well — handling most things", value: "4" },
            { label: "Sometimes struggling", value: "3" },
            { label: "Often struggling", value: "2" },
            { label: "Not coping at all", value: "1" },
          ],
        },
        {
          name: "relationships",
          label: "Satisfaction with Relationships",
          type: "select",
          options: [
            { label: "Very satisfied", value: "5" },
            { label: "Satisfied", value: "4" },
            { label: "Neutral", value: "3" },
            { label: "Dissatisfied", value: "2" },
            { label: "Very dissatisfied", value: "1" },
          ],
        },
        {
          name: "purpose",
          label: "Sense of Purpose or Meaning",
          type: "select",
          options: [
            { label: "Strong sense of purpose", value: "5" },
            { label: "Generally purposeful", value: "4" },
            { label: "Uncertain", value: "3" },
            { label: "Lacking purpose", value: "2" },
            { label: "No sense of purpose", value: "1" },
          ],
        },
        {
          name: "selfCare",
          label: "Self-Care Practices (exercise, hobbies, rest)",
          type: "select",
          options: [
            { label: "Consistent self-care routine", value: "5" },
            { label: "Regular but could improve", value: "4" },
            { label: "Inconsistent", value: "3" },
            { label: "Minimal self-care", value: "2" },
            { label: "No self-care", value: "1" },
          ],
        },
      ],
      calculate: (inputs) => {
        const scores = [
          parseInt(inputs.overallMood as string) || 3,
          parseInt(inputs.coping as string) || 3,
          parseInt(inputs.relationships as string) || 3,
          parseInt(inputs.purpose as string) || 3,
          parseInt(inputs.selfCare as string) || 3,
        ];

        const total = scores.reduce((a, b) => a + b, 0);
        const average = total / 5;
        const maxScore = 25;
        const percentage = (total / maxScore) * 100;

        let wellness: string;
        let suggestion: string;
        if (total >= 22) { wellness = "Thriving"; suggestion = "Maintain your positive habits and continue supporting your mental health"; }
        else if (total >= 18) { wellness = "Good"; suggestion = "You're doing well. Consider strengthening areas with lower scores"; }
        else if (total >= 14) { wellness = "Fair"; suggestion = "Some areas may benefit from attention. Consider talking to someone you trust or a counselor"; }
        else if (total >= 10) { wellness = "Struggling"; suggestion = "Consider reaching out to a mental health professional for support"; }
        else { wellness = "In distress"; suggestion = "Please reach out for professional help. You deserve support. Call 988 for the Suicide & Crisis Lifeline."; }

        const weakest = ["Mood", "Coping", "Relationships", "Purpose", "Self-care"]
          .map((label, i) => ({ label, score: scores[i] }))
          .sort((a, b) => a.score - b.score)
          .slice(0, 2)
          .map(s => s.label);

        return {
          primary: { label: "Wellness Score", value: `${total}/${maxScore} — ${wellness}` },
          details: [
            { label: "Total score", value: `${total} / ${maxScore} (${formatNumber(percentage, 0)}%)` },
            { label: "Average", value: `${formatNumber(average, 1)} / 5` },
            { label: "Wellness level", value: wellness },
            { label: "Areas to focus on", value: weakest.join(", ") },
            { label: "Suggestion", value: suggestion },
          ],
          note: "This is a brief wellness check, not a clinical assessment tool. It helps you reflect on your overall mental wellbeing. If you are struggling, please reach out to a mental health professional. In a crisis, call 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line).",
        };
      },
    },
  ],
  relatedSlugs: ["pain-scale-calculator", "sleep-cycle-calculator", "biological-age-calculator"],
  faq: [
    {
      question: "What is the PHQ-9?",
      answer:
        "The PHQ-9 (Patient Health Questionnaire-9) is a validated 9-item screening tool for depression severity. It is widely used in primary care. Scores range from 0-27: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe depression.",
    },
    {
      question: "What is the GAD-7?",
      answer:
        "The GAD-7 (Generalized Anxiety Disorder-7) is a validated 7-item screening tool for anxiety. Scores range from 0-21: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-21 severe anxiety. A score of 10+ warrants further clinical evaluation.",
    },
    {
      question: "When should I seek professional help?",
      answer:
        "Seek help if: symptoms persist for more than 2 weeks, they interfere with daily functioning, you have thoughts of self-harm, you're using substances to cope, or you feel overwhelmed. There is no wrong time to ask for help.",
    },
    {
      question: "Is this a diagnosis?",
      answer:
        "No. This is a screening tool only. A proper diagnosis requires a comprehensive evaluation by a qualified mental health professional (psychiatrist, psychologist, or licensed therapist). Screening tools help identify people who may benefit from further assessment.",
    },
  ],
  formula:
    "PHQ-9: Sum of 9 items (each 0-3), total 0-27 | GAD-7: Sum of 7 items (each 0-3), total 0-21 | Wellness: Sum of 5 domains (each 1-5), total 5-25 | Higher PHQ-9/GAD-7 = worse symptoms | Higher wellness = better mental health",
};
