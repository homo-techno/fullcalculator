import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sleepDebtCalculator: CalculatorDefinition = {
  slug: "sleep-debt-calculator",
  title: "Sleep Debt Calculator",
  description:
    "Free sleep debt calculator. Track your weekly sleep deficit and estimate recovery time based on recommended sleep hours.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "sleep debt",
    "sleep deficit",
    "sleep tracker",
    "sleep calculator",
    "recovery time",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "sleepData",
          label: "Hours Slept Each Night (7 values, comma-separated)",
          type: "text" as "number",
          placeholder: "e.g. 6, 7, 5.5, 6, 7, 8, 6.5",
        },
        {
          name: "recommended",
          label: "Recommended Hours Per Night",
          type: "number",
          placeholder: "e.g. 8",
        },
      ],
      calculate: (inputs) => {
        const raw = (inputs.sleepData as string) || "";
        const recommended = (inputs.recommended as number) || 8;

        const values = raw
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !isNaN(n));

        if (values.length === 0) return null;

        const totalSlept = values.reduce((a, b) => a + b, 0);
        const avgSlept = totalSlept / values.length;
        const totalRecommended = recommended * values.length;
        const totalDebt = Math.max(0, totalRecommended - totalSlept);
        const dailyDebt = totalDebt / values.length;

        // Recovery: takes about 4 nights to recover 1 hour of sleep debt
        const recoveryNights = Math.ceil(totalDebt * 4);

        const minSlept = Math.min(...values);
        const maxSlept = Math.max(...values);

        let sleepQuality = "";
        if (avgSlept >= recommended) sleepQuality = "Excellent - meeting your target";
        else if (avgSlept >= recommended - 0.5)
          sleepQuality = "Good - slightly under target";
        else if (avgSlept >= recommended - 1)
          sleepQuality = "Fair - noticeable deficit";
        else if (avgSlept >= recommended - 2)
          sleepQuality = "Poor - significant deficit";
        else sleepQuality = "Critical - severe sleep deprivation";

        const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const dailyDetails = values.map((v, i) => ({
          label: dayLabels[i] || "Day " + (i + 1),
          value:
            formatNumber(v, 1) +
            " hrs" +
            (v < recommended ? " (-" + formatNumber(recommended - v, 1) + ")" : " OK"),
        }));

        return {
          primary: {
            label: "Total Sleep Debt",
            value: formatNumber(totalDebt, 1) + " hours",
          },
          details: [
            {
              label: "Average Sleep",
              value: formatNumber(avgSlept, 1) + " hrs/night",
            },
            {
              label: "Recommended",
              value: formatNumber(recommended, 0) + " hrs/night",
            },
            {
              label: "Daily Avg Deficit",
              value: formatNumber(dailyDebt, 1) + " hrs",
            },
            {
              label: "Recovery Time",
              value:
                recoveryNights > 0
                  ? formatNumber(recoveryNights, 0) + " nights (at +15 min/night)"
                  : "No recovery needed",
            },
            { label: "Sleep Quality", value: sleepQuality },
            {
              label: "Best Night",
              value: formatNumber(maxSlept, 1) + " hrs",
            },
            {
              label: "Worst Night",
              value: formatNumber(minSlept, 1) + " hrs",
            },
            ...dailyDetails,
          ],
        };
      },
    },
  ],
  relatedSlugs: ["study-time-calculator", "baby-growth-calculator"],
  faq: [
    {
      question: "What is sleep debt?",
      answer:
        "Sleep debt is the cumulative difference between the amount of sleep you need and the amount you actually get. If you need 8 hours but sleep 6, you accumulate 2 hours of sleep debt per night.",
    },
    {
      question: "How long does it take to recover from sleep debt?",
      answer:
        "Research suggests it takes about 4 days to recover from each hour of sleep debt. Recovery should be gradual - adding 15-30 extra minutes per night rather than sleeping excessively on weekends.",
    },
  ],
  formula:
    "Sleep Debt = (Recommended Hours x Number of Nights) - Total Hours Slept. Recovery Time = Sleep Debt x 4 nights per hour. Average Sleep = Total Slept / Number of Nights.",
};
