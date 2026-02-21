import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const xpCalculator: CalculatorDefinition = {
  slug: "xp-calculator",
  title: "XP Calculator",
  description:
    "Free XP and level calculator for gaming. Calculate experience points needed, time to level up, and XP rates for RPGs and MMOs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "XP calculator",
    "experience points",
    "level calculator",
    "leveling calculator",
    "RPG XP",
    "MMO leveling",
    "grind calculator",
  ],
  variants: [
    {
      id: "xp-to-level",
      name: "XP to Next Level",
      description: "Calculate XP remaining and time to level up",
      fields: [
        {
          name: "currentXp",
          label: "Current XP",
          type: "number",
          placeholder: "e.g. 45000",
          min: 0,
        },
        {
          name: "xpNeeded",
          label: "XP Needed for Next Level",
          type: "number",
          placeholder: "e.g. 100000",
          min: 1,
        },
        {
          name: "xpPerHour",
          label: "XP per Hour (your rate)",
          type: "number",
          placeholder: "e.g. 15000",
          min: 1,
        },
        {
          name: "hoursPerDay",
          label: "Hours Played per Day",
          type: "number",
          placeholder: "e.g. 3",
          min: 0.5,
          max: 24,
          step: 0.5,
          defaultValue: 3,
        },
      ],
      calculate: (inputs) => {
        const currentXp = inputs.currentXp as number;
        const xpNeeded = inputs.xpNeeded as number;
        const xpPerHour = inputs.xpPerHour as number;
        const hoursPerDay = (inputs.hoursPerDay as number) || 3;

        if (currentXp === undefined || !xpNeeded || !xpPerHour) return null;

        const xpRemaining = Math.max(0, xpNeeded - currentXp);
        const hoursToLevel = xpRemaining / xpPerHour;
        const daysToLevel = hoursToLevel / hoursPerDay;
        const progressPercent = (currentXp / xpNeeded) * 100;
        const xpPerMinute = xpPerHour / 60;

        return {
          primary: { label: "XP Remaining", value: formatNumber(xpRemaining, 0) },
          details: [
            { label: "Progress", value: formatNumber(Math.min(progressPercent, 100), 1) + "%" },
            { label: "Current XP", value: formatNumber(currentXp, 0) },
            { label: "Target XP", value: formatNumber(xpNeeded, 0) },
            { label: "XP per Hour", value: formatNumber(xpPerHour, 0) },
            { label: "XP per Minute", value: formatNumber(xpPerMinute, 1) },
            { label: "Hours to Level Up", value: formatNumber(hoursToLevel, 1) },
            { label: "Days to Level Up", value: formatNumber(daysToLevel, 1) + ` (at ${hoursPerDay} hrs/day)` },
          ],
        };
      },
    },
    {
      id: "xp-curve",
      name: "XP Curve / Level Table",
      description: "Generate an XP requirements table using common leveling formulas",
      fields: [
        {
          name: "currentLevel",
          label: "Current Level",
          type: "number",
          placeholder: "e.g. 25",
          min: 1,
          max: 200,
        },
        {
          name: "targetLevel",
          label: "Target Level",
          type: "number",
          placeholder: "e.g. 50",
          min: 2,
          max: 200,
        },
        {
          name: "formula",
          label: "XP Curve Formula",
          type: "select",
          options: [
            { label: "Quadratic (100 x Level^2) - typical RPG", value: "quadratic" },
            { label: "Cubic (50 x Level^3) - steep curve", value: "cubic" },
            { label: "Linear (1000 x Level) - flat progression", value: "linear" },
            { label: "Exponential (100 x 1.1^Level) - MMO-style", value: "exponential" },
          ],
          defaultValue: "quadratic",
        },
        {
          name: "xpPerHour",
          label: "XP per Hour",
          type: "number",
          placeholder: "e.g. 10000",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const currentLevel = inputs.currentLevel as number;
        const targetLevel = inputs.targetLevel as number;
        const formula = inputs.formula as string;
        const xpPerHour = inputs.xpPerHour as number;
        if (!currentLevel || !targetLevel || targetLevel <= currentLevel || !xpPerHour) return null;

        const calcXpForLevel = (level: number): number => {
          switch (formula) {
            case "cubic": return 50 * Math.pow(level, 3);
            case "linear": return 1000 * level;
            case "exponential": return Math.round(100 * Math.pow(1.1, level));
            default: return 100 * Math.pow(level, 2); // quadratic
          }
        };

        let totalXpNeeded = 0;
        const details: { label: string; value: string }[] = [];

        // Show XP for each level in range (limit to 10 entries for display)
        const step = Math.max(1, Math.floor((targetLevel - currentLevel) / 10));
        for (let lvl = currentLevel; lvl < targetLevel; lvl++) {
          totalXpNeeded += calcXpForLevel(lvl + 1);
          if ((lvl - currentLevel) % step === 0 || lvl === targetLevel - 1) {
            details.push({
              label: `Level ${lvl} -> ${lvl + 1}`,
              value: formatNumber(calcXpForLevel(lvl + 1), 0) + " XP",
            });
          }
        }

        const totalHours = totalXpNeeded / xpPerHour;

        details.push({ label: "Total XP Needed", value: formatNumber(totalXpNeeded, 0) });
        details.push({ label: "Total Hours", value: formatNumber(totalHours, 1) });
        details.push({ label: "Total Days (8h/day)", value: formatNumber(totalHours / 8, 1) });

        return {
          primary: { label: "Total XP to Target", value: formatNumber(totalXpNeeded, 0) },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["d-and-d-dice-calculator", "video-game-fps-calculator", "board-game-score-calculator"],
  faq: [
    {
      question: "How do XP curves work in games?",
      answer:
        "Most games use non-linear XP curves where each level requires more XP than the last. Common formulas include quadratic (level^2), cubic (level^3), or exponential (1.1^level). This makes early levels fast and later levels progressively harder.",
    },
    {
      question: "How can I calculate my XP per hour?",
      answer:
        "Record your starting XP, play for a set time (30-60 minutes), then record your ending XP. XP per hour = (End XP - Start XP) / Hours played. Some games have built-in XP/hour displays.",
    },
    {
      question: "What does 'grinding' mean in gaming?",
      answer:
        "Grinding refers to repetitively performing the same activity (killing monsters, running dungeons, completing quests) to accumulate XP and level up. This calculator helps estimate how long a grind will take based on your XP rate.",
    },
  ],
  formula:
    "XP Remaining = Target - Current | Hours to Level = XP Remaining / XP per Hour | Quadratic XP = 100 x Level^2 | Exponential XP = 100 x 1.1^Level",
};
