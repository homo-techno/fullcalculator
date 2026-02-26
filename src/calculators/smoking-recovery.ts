import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const smokingRecoveryCalculator: CalculatorDefinition = {
  slug: "smoking-recovery",
  title: "Smoking Cessation Recovery Timeline",
  description:
    "Free online smoking cessation recovery timeline calculator showing health benefits after quitting.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "quit smoking",
    "smoking cessation",
    "recovery",
    "health benefits",
    "tobacco",
    "nicotine withdrawal",
    "lung recovery",
  ],
  variants: [
    {
      id: "recovery-timeline",
      name: "Recovery Timeline",
      description:
        "See what health milestones you have reached or will reach after quitting smoking.",
      fields: [
        {
          name: "quitDays",
          label: "Days Since You Quit",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "days",
        },
        {
          name: "cigarettesPerDay",
          label: "Cigarettes per Day (when smoking)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "costPerPack",
          label: "Cost per Pack",
          type: "number",
          placeholder: "e.g. 8",
          prefix: "$",
        },
        {
          name: "yearsSmoked",
          label: "Years You Smoked",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "years",
        },
      ],
      calculate: (inputs) => {
        const days = parseFloat(inputs.quitDays as string) || 0;
        const cigsPerDay = parseFloat(inputs.cigarettesPerDay as string) || 0;
        const costPerPack = parseFloat(inputs.costPerPack as string) || 0;
        const yearsSmoked = parseFloat(inputs.yearsSmoked as string) || 0;

        if (days < 0) return null;

        const hours = days * 24;
        const weeks = days / 7;
        const months = days / 30.44;
        const years = days / 365.25;

        // Milestones achieved
        const milestones: string[] = [];
        if (hours >= 0.33)
          milestones.push("20 min: Heart rate and blood pressure begin to drop");
        if (hours >= 8)
          milestones.push("8 hrs: Carbon monoxide level in blood drops to normal");
        if (hours >= 24)
          milestones.push("24 hrs: Risk of heart attack begins to decrease");
        if (hours >= 48)
          milestones.push("48 hrs: Nerve endings begin to regrow, taste and smell improve");
        if (hours >= 72)
          milestones.push("72 hrs: Bronchial tubes relax, breathing becomes easier");
        if (weeks >= 2)
          milestones.push("2 weeks: Circulation improves, lung function increases up to 30%");
        if (months >= 1)
          milestones.push("1 month: Coughing, sinus congestion, fatigue decrease");
        if (months >= 3)
          milestones.push("3 months: Cilia regrow in lungs, reducing infection risk");
        if (months >= 9)
          milestones.push("9 months: Lungs significantly healed, less shortness of breath");
        if (years >= 1)
          milestones.push("1 year: Risk of coronary heart disease halved vs. smoker");
        if (years >= 5)
          milestones.push("5 years: Stroke risk reduced to that of a non-smoker");
        if (years >= 10)
          milestones.push("10 years: Lung cancer death risk halved vs. continuing smoker");
        if (years >= 15)
          milestones.push("15 years: Risk of coronary heart disease same as non-smoker");

        // Next milestone
        let nextMilestone = "Congratulations! You have passed all major milestones.";
        const thresholdDays = [0.014, 0.33, 1, 2, 3, 14, 30, 90, 270, 365, 1826, 3652, 5479];
        const thresholdLabels = [
          "20 minutes: Heart rate normalizes",
          "8 hours: CO levels normalize",
          "24 hours: Heart attack risk decreases",
          "48 hours: Taste and smell improve",
          "72 hours: Breathing easier",
          "2 weeks: Circulation improves",
          "1 month: Less coughing/fatigue",
          "3 months: Cilia regrow",
          "9 months: Lungs significantly healed",
          "1 year: Heart disease risk halved",
          "5 years: Stroke risk normalized",
          "10 years: Lung cancer risk halved",
          "15 years: Heart disease risk normalized",
        ];
        for (let i = 0; i < thresholdDays.length; i++) {
          if (days < thresholdDays[i]) {
            const daysUntil = thresholdDays[i] - days;
            nextMilestone = thresholdLabels[i] + ` (in ${formatNumber(Math.max(0.1, daysUntil))} days)`;
            break;
          }
        }

        // Financial savings
        const packsPerDay = cigsPerDay / 20;
        const moneySaved = packsPerDay * costPerPack * days;
        const cigarettesNotSmoked = cigsPerDay * days;

        // Life regained estimate (each cigarette ~11 minutes off life)
        const minutesRegained = cigarettesNotSmoked * 11;
        const daysRegained = minutesRegained / 1440;

        const completedCount = milestones.length;
        const latestMilestone = milestones.length > 0 ? milestones[milestones.length - 1] : "Keep going!";

        return {
          primary: {
            label: "Days Smoke-Free",
            value: formatNumber(days),
            suffix: "days",
          },
          details: [
            { label: "Latest Milestone Reached", value: latestMilestone },
            { label: "Next Milestone", value: nextMilestone },
            { label: "Milestones Completed", value: formatNumber(completedCount) + " / 13" },
            { label: "Cigarettes Not Smoked", value: formatNumber(cigarettesNotSmoked) },
            { label: "Money Saved", value: "$" + formatNumber(moneySaved) },
            { label: "Life Regained (est.)", value: formatNumber(daysRegained) + " days" },
            { label: "Years Smoked", value: formatNumber(yearsSmoked) },
          ],
          note: "Health improvements begin within minutes of quitting. Every day smoke-free is a step toward better health.",
        };
      },
    },
  ],
  relatedSlugs: ["pack-year-calc", "life-expectancy-calc", "ascvd-risk"],
  faq: [
    {
      question: "How soon do health benefits start after quitting smoking?",
      answer:
        "Health benefits begin almost immediately: within 20 minutes, heart rate drops; within 8 hours, carbon monoxide levels normalize; within 24 hours, heart attack risk begins to decrease. Significant improvements in lung function occur within 2-12 weeks.",
    },
    {
      question: "Do lungs fully recover after quitting?",
      answer:
        "Lungs can significantly heal after quitting, especially within the first 9 months as cilia regrow. However, permanent structural damage from long-term smoking (such as emphysema) may not fully reverse. The earlier you quit, the more recovery is possible.",
    },
    {
      question: "How much money can you save by quitting?",
      answer:
        "At $8 per pack and one pack per day, quitting saves $2,920 per year. Over 10 years, that is $29,200 in direct cigarette costs alone, not counting reduced healthcare expenses, insurance premiums, and lost productivity.",
    },
  ],
  formula:
    "Money Saved = (Cigarettes/day / 20) × Cost_per_pack × Days_quit. Life Regained ≈ Cigarettes_not_smoked × 11 minutes. Recovery milestones based on published ACS/AHA cessation timelines.",
};
