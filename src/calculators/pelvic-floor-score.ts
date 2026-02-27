import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pelvicFloorScoreCalculator: CalculatorDefinition = {
  slug: "pelvic-floor-score-calculator",
  title: "Pelvic Floor Health Assessment",
  description:
    "Assess your pelvic floor health with a symptom-based scoring tool. Identify risk factors and get personalized exercise recommendations for pelvic floor strength.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "pelvic floor assessment",
    "pelvic floor score",
    "kegel calculator",
    "pelvic floor health",
    "pelvic floor exercise",
    "incontinence assessment",
  ],
  variants: [
    {
      id: "assessment",
      name: "Symptom Assessment",
      description: "Score your pelvic floor health based on symptoms",
      fields: [
        {
          name: "leakageCough",
          label: "Leakage When Coughing/Sneezing/Laughing",
          type: "select",
          options: [
            { label: "Never", value: "0" },
            { label: "Rarely (less than once a month)", value: "1" },
            { label: "Sometimes (weekly)", value: "2" },
            { label: "Often (most days)", value: "3" },
            { label: "Always", value: "4" },
          ],
          defaultValue: "0",
        },
        {
          name: "urgency",
          label: "Sudden Urgency to Urinate",
          type: "select",
          options: [
            { label: "Never", value: "0" },
            { label: "Rarely", value: "1" },
            { label: "Sometimes", value: "2" },
            { label: "Often", value: "3" },
            { label: "Always", value: "4" },
          ],
          defaultValue: "0",
        },
        {
          name: "frequency",
          label: "Urinary Frequency (more than 8x/day)",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Occasionally", value: "1" },
            { label: "Frequently", value: "2" },
            { label: "Always", value: "3" },
          ],
          defaultValue: "0",
        },
        {
          name: "heaviness",
          label: "Pelvic Heaviness/Pressure/Bulging",
          type: "select",
          options: [
            { label: "None", value: "0" },
            { label: "Mild (aware of it sometimes)", value: "1" },
            { label: "Moderate (uncomfortable)", value: "2" },
            { label: "Severe (significant discomfort)", value: "3" },
          ],
          defaultValue: "0",
        },
        {
          name: "nighttime",
          label: "Waking to Urinate at Night (nocturia)",
          type: "select",
          options: [
            { label: "0-1 times", value: "0" },
            { label: "2 times", value: "1" },
            { label: "3+ times", value: "2" },
          ],
          defaultValue: "0",
        },
        {
          name: "riskFactors",
          label: "Risk Factor History",
          type: "select",
          options: [
            { label: "None of the below", value: "0" },
            { label: "Vaginal delivery (1-2 births)", value: "1" },
            { label: "Multiple vaginal deliveries (3+)", value: "2" },
            { label: "Menopause / hormonal changes", value: "2" },
            { label: "Chronic constipation / heavy lifting", value: "1" },
            { label: "Pelvic surgery history", value: "2" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const leakage = parseFloat(inputs.leakageCough as string);
        const urgency = parseFloat(inputs.urgency as string);
        const frequency = parseFloat(inputs.frequency as string);
        const heaviness = parseFloat(inputs.heaviness as string);
        const nighttime = parseFloat(inputs.nighttime as string);
        const riskFactors = parseFloat(inputs.riskFactors as string);

        const totalScore = leakage + urgency + frequency + heaviness + nighttime + riskFactors;
        const maxScore = 18;
        const percentage = (totalScore / maxScore) * 100;

        let severity: string;
        let recommendation: string;
        if (totalScore <= 2) {
          severity = "Minimal concerns";
          recommendation = "Maintain pelvic floor health with regular Kegel exercises";
        } else if (totalScore <= 6) {
          severity = "Mild symptoms";
          recommendation = "Start daily Kegel exercises (3 sets of 10). Consider pelvic floor PT";
        } else if (totalScore <= 11) {
          severity = "Moderate symptoms";
          recommendation = "Consult pelvic floor physical therapist. Daily exercises recommended";
        } else {
          severity = "Significant symptoms";
          recommendation = "See a urogynecologist or pelvic floor specialist promptly";
        }

        // Kegel exercise recommendation
        const holdTime = totalScore <= 4 ? 5 : totalScore <= 8 ? 3 : 2;
        const reps = 10;
        const sets = 3;

        return {
          primary: { label: "Pelvic Floor Score", value: `${formatNumber(totalScore, 0)} / ${formatNumber(maxScore, 0)}` },
          details: [
            { label: "Severity", value: severity },
            { label: "Score Percentage", value: `${formatNumber(percentage, 0)}%` },
            { label: "Recommendation", value: recommendation },
            { label: "Kegel Rx", value: `${sets} sets x ${reps} reps, ${holdTime}-sec holds, daily` },
            { label: "Stress Incontinence Score", value: formatNumber(leakage, 0) },
            { label: "Urge Incontinence Score", value: formatNumber(urgency, 0) },
          ],
          note: "This is a screening tool, not a diagnosis. Pelvic floor dysfunction is very common and treatable. Pelvic floor physical therapy is highly effective for most symptoms. Do not be embarrassed to seek help -- these are medical conditions with proven treatments.",
        };
      },
    },
    {
      id: "exercise",
      name: "Kegel Exercise Program",
      description: "Get a personalized pelvic floor exercise plan",
      fields: [
        {
          name: "currentLevel",
          label: "Current Fitness Level",
          type: "select",
          options: [
            { label: "Beginner (never done Kegels)", value: "beginner" },
            { label: "Intermediate (some experience)", value: "intermediate" },
            { label: "Advanced (regular practice)", value: "advanced" },
          ],
          defaultValue: "beginner",
        },
        {
          name: "goal",
          label: "Primary Goal",
          type: "select",
          options: [
            { label: "Prevent incontinence", value: "prevent" },
            { label: "Reduce stress incontinence", value: "stress" },
            { label: "Postpartum recovery", value: "postpartum" },
            { label: "Pre-surgery preparation", value: "presurgery" },
            { label: "General pelvic floor strength", value: "general" },
          ],
          defaultValue: "general",
        },
        {
          name: "weeksAvailable",
          label: "Weeks to Commit",
          type: "number",
          placeholder: "e.g. 12",
          suffix: "weeks",
          min: 4,
          max: 52,
          defaultValue: 12,
        },
      ],
      calculate: (inputs) => {
        const level = inputs.currentLevel as string;
        const goal = inputs.goal as string;
        const weeks = parseFloat(inputs.weeksAvailable as string) || 12;

        const programs: Record<string, { holdSec: number; reps: number; sets: number; quickFlicks: number }> = {
          beginner: { holdSec: 3, reps: 8, sets: 3, quickFlicks: 5 },
          intermediate: { holdSec: 5, reps: 10, sets: 3, quickFlicks: 10 },
          advanced: { holdSec: 10, reps: 12, sets: 3, quickFlicks: 15 },
        };

        const program = programs[level] || programs.beginner;
        const totalHoldsPerDay = program.reps * program.sets;
        const totalMinutesPerDay = ((program.holdSec * program.reps * program.sets) + (program.quickFlicks * program.sets)) / 60;

        // Progressive overload
        const progressionWeeks = Math.floor(weeks / 4);
        const finalHoldSec = Math.min(10, program.holdSec + progressionWeeks);

        // Expected results timeline
        const resultsWeeks = goal === "postpartum" ? 6 : 8;

        return {
          primary: { label: "Daily Exercise Time", value: `${formatNumber(totalMinutesPerDay, 1)} min` },
          details: [
            { label: "Hold Duration", value: `${formatNumber(program.holdSec, 0)} sec (progress to ${formatNumber(finalHoldSec, 0)}s)` },
            { label: "Reps per Set", value: formatNumber(program.reps, 0) },
            { label: "Sets per Day", value: formatNumber(program.sets, 0) },
            { label: "Quick Flicks per Set", value: formatNumber(program.quickFlicks, 0) },
            { label: "Total Holds/Day", value: formatNumber(totalHoldsPerDay, 0) },
            { label: "Expected First Results", value: `~${formatNumber(resultsWeeks, 0)} weeks` },
            { label: "Full Program", value: `${formatNumber(weeks, 0)} weeks` },
          ],
          note: "Technique matters more than volume. Contract (squeeze and lift) for the hold, then fully relax. Quick flicks train fast-twitch fibers for cough/sneeze protection. If you cannot feel the contraction, a pelvic floor PT can teach proper technique. Improvement typically begins at 6-8 weeks.",
        };
      },
    },
  ],
  relatedSlugs: ["postpartum-calorie-calculator", "menstrual-cycle-length-calculator", "prenatal-vitamin-calculator"],
  faq: [
    {
      question: "What are symptoms of a weak pelvic floor?",
      answer:
        "Common symptoms include urinary leakage during coughing, sneezing, or exercise (stress incontinence), sudden strong urges to urinate (urge incontinence), frequent urination, pelvic heaviness or pressure, lower back pain, and pain during intercourse. These symptoms are common and treatable.",
    },
    {
      question: "How long does it take for Kegel exercises to work?",
      answer:
        "Most people notice improvement within 6-12 weeks of consistent daily practice. Some studies show significant improvement as early as 4 weeks. Full benefit typically takes 3-6 months. Consistency is key -- doing Kegels correctly 3 times daily is more effective than occasional longer sessions.",
    },
    {
      question: "Who should see a pelvic floor physical therapist?",
      answer:
        "Consider pelvic floor PT if you have persistent incontinence, pelvic pain, pain during intercourse, postpartum recovery needs, pre/post pelvic surgery, or if Kegel exercises are not improving symptoms after 8 weeks. PT is covered by most insurance and is the first-line treatment recommended by urologists.",
    },
  ],
  formula:
    "Pelvic Floor Score = Sum of (Leakage + Urgency + Frequency + Heaviness + Nocturia + Risk Factors) out of 18",
};
