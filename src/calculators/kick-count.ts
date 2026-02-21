import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kickCountCalculator: CalculatorDefinition = {
  slug: "kick-count-calculator",
  title: "Baby Kick Count Calculator",
  description:
    "Free baby kick count calculator. Track fetal movements during pregnancy and check if your baby's kick count is within the normal range.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "kick count",
    "fetal movement counter",
    "baby kick tracker",
    "fetal kick count",
    "count to ten kicks",
  ],
  variants: [
    {
      id: "kick-count",
      name: "Kick Count Analysis",
      description: "Analyze your baby's kick count",
      fields: [
        {
          name: "kicks",
          label: "Number of Movements Counted",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
          max: 100,
        },
        {
          name: "timeMinutes",
          label: "Time Period (minutes)",
          type: "number",
          placeholder: "e.g. 30",
          min: 1,
          max: 180,
        },
        {
          name: "weeksPregnant",
          label: "Weeks Pregnant",
          type: "number",
          placeholder: "e.g. 32",
          min: 24,
          max: 42,
        },
        {
          name: "timeOfDay",
          label: "Time of Day",
          type: "select",
          options: [
            { label: "Morning", value: "morning" },
            { label: "Afternoon", value: "afternoon" },
            { label: "Evening", value: "evening" },
            { label: "Night", value: "night" },
          ],
          defaultValue: "evening",
        },
      ],
      calculate: (inputs) => {
        const kicks = inputs.kicks as number;
        const timeMinutes = inputs.timeMinutes as number;
        const weeksPregnant = inputs.weeksPregnant as number;
        const timeOfDay = inputs.timeOfDay as string;
        if (kicks === undefined || kicks === null) return null;
        if (!timeMinutes || !weeksPregnant) return null;

        const kicksPerHour = (kicks / timeMinutes) * 60;
        const timeToTenKicks = kicks >= 10 ? (10 / kicks) * timeMinutes : null;

        // Assessment based on "count to 10" method
        let assessment: string;
        let action: string;

        if (kicks >= 10 && timeMinutes <= 120) {
          assessment = "Normal - Reassuring kick count";
          action = "Your baby's movement pattern is within the expected range. Continue daily kick counts.";
        } else if (kicks >= 10 && timeMinutes > 120) {
          assessment = "Acceptable but slower than typical";
          action = "10 movements reached but took longer than 2 hours. Monitor closely and try counting again after a snack. Contact your provider if concerned.";
        } else if (kicks >= 6 && timeMinutes <= 120) {
          assessment = "Below target - Keep counting";
          action = "Try drinking cold water or juice, eating a snack, then lie on your left side and count for another hour. If you still don't reach 10, contact your provider.";
        } else if (kicks < 6 && timeMinutes >= 60) {
          assessment = "Low movement - Contact provider";
          action = "Fewer than 6 movements in an hour is below expected. Try a snack and cold drink, then count again. If still low, contact your healthcare provider promptly.";
        } else {
          assessment = "Counting in progress";
          action = "Continue counting. The goal is 10 movements within 2 hours. Most babies achieve this in under 30 minutes.";
        }

        const timeLabel = timeOfDay === "morning" ? "Morning" : timeOfDay === "afternoon" ? "Afternoon" : timeOfDay === "evening" ? "Evening" : "Night";

        return {
          primary: {
            label: "Kick Count Result",
            value: `${kicks} movements in ${timeMinutes} minutes`,
          },
          details: [
            { label: "Assessment", value: assessment },
            { label: "Recommended Action", value: action },
            { label: "Rate", value: `${formatNumber(kicksPerHour, 1)} movements per hour` },
            { label: "Time to 10 Kicks", value: timeToTenKicks !== null ? `~${formatNumber(timeToTenKicks, 0)} minutes` : "Not yet reached 10" },
            { label: "Gestational Age", value: `${weeksPregnant} weeks` },
            { label: "Time of Day", value: `${timeLabel} (babies are often most active in the evening)` },
          ],
          note: "The 'count to 10' method: count any movement (kicks, rolls, jabs) as 1 movement. You should feel 10 movements within 2 hours. Most babies achieve this in 15-30 minutes. Start daily kick counts at 28 weeks. Always contact your provider if you notice a significant decrease in movement.",
        };
      },
    },
  ],
  relatedSlugs: ["pregnancy-calculator", "contraction-timer-calculator", "pregnancy-weight-gain-calculator"],
  faq: [
    {
      question: "When should I start doing kick counts?",
      answer:
        "Most healthcare providers recommend starting daily kick counts around 28 weeks (third trimester). Choose a time when your baby is usually active (often after meals or in the evening). Count at approximately the same time each day to establish a pattern.",
    },
    {
      question: "How many kicks should I feel per hour?",
      answer:
        "Using the 'count to 10' method, you should feel 10 movements (kicks, rolls, jabs, hiccups count too) within 2 hours. Most babies will reach 10 movements in 15-30 minutes. If it consistently takes longer than 2 hours, or you notice a significant change in pattern, contact your provider.",
    },
    {
      question: "When should I be worried about decreased movement?",
      answer:
        "Contact your healthcare provider if: you cannot feel 10 movements in 2 hours, there is a sudden or significant decrease from your baby's normal pattern, the baby seems much less active than usual, or you cannot feel any movement. Do not wait until the next day - call your provider right away.",
    },
  ],
  formula:
    "Count to 10 Method: Count all fetal movements in a 2-hour window. Goal: 10+ movements in 2 hours. Rate = (movements / minutes) × 60 per hour. Fewer than 10 movements in 2 hours warrants further evaluation.",
};
