import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const menstrualCycleLengthCalculator: CalculatorDefinition = {
  slug: "menstrual-cycle-length-calculator",
  title: "Menstrual Cycle Length Calculator",
  description:
    "Track and predict your menstrual cycle length, next period date, and fertile window. Analyze cycle regularity and identify patterns.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "menstrual cycle calculator",
    "period calculator",
    "next period predictor",
    "cycle length calculator",
    "period tracker",
    "fertile window calculator",
  ],
  variants: [
    {
      id: "predict",
      name: "Next Period Predictor",
      description: "Predict next period and fertile window from cycle data",
      fields: [
        {
          name: "cycleLength",
          label: "Average Cycle Length",
          type: "number",
          placeholder: "e.g. 28",
          suffix: "days",
          min: 20,
          max: 45,
          defaultValue: 28,
        },
        {
          name: "periodLength",
          label: "Average Period Duration",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "days",
          min: 1,
          max: 10,
          defaultValue: 5,
        },
        {
          name: "daysSinceLastPeriod",
          label: "Days Since Last Period Started",
          type: "number",
          placeholder: "e.g. 14",
          suffix: "days",
          min: 0,
          max: 90,
        },
      ],
      calculate: (inputs) => {
        const cycleLength = parseFloat(inputs.cycleLength as string);
        const periodLength = parseFloat(inputs.periodLength as string);
        const daysSince = parseFloat(inputs.daysSinceLastPeriod as string);
        if (!cycleLength || !periodLength || isNaN(daysSince)) return null;

        const daysUntilNext = cycleLength - daysSince;
        const currentDay = daysSince + 1;

        // Ovulation typically occurs 14 days before next period
        const ovulationDay = cycleLength - 14;
        const fertileWindowStart = ovulationDay - 5;
        const fertileWindowEnd = ovulationDay + 1;

        // Determine current phase
        let currentPhase: string;
        if (currentDay <= periodLength) {
          currentPhase = "Menstrual (period)";
        } else if (currentDay <= fertileWindowStart) {
          currentPhase = "Follicular";
        } else if (currentDay <= fertileWindowEnd) {
          currentPhase = "Fertile window / Ovulation";
        } else {
          currentPhase = "Luteal";
        }

        const isInFertileWindow = currentDay >= fertileWindowStart && currentDay <= fertileWindowEnd;

        return {
          primary: { label: "Days Until Next Period", value: daysUntilNext > 0 ? formatNumber(daysUntilNext, 0) : "Overdue / Today" },
          details: [
            { label: "Current Cycle Day", value: `Day ${formatNumber(currentDay, 0)}` },
            { label: "Current Phase", value: currentPhase },
            { label: "Estimated Ovulation", value: `Day ${formatNumber(ovulationDay, 0)}` },
            { label: "Fertile Window", value: `Day ${formatNumber(fertileWindowStart, 0)} - ${formatNumber(fertileWindowEnd, 0)}` },
            { label: "In Fertile Window", value: isInFertileWindow ? "Yes" : "No" },
            { label: "Cycle Length", value: `${formatNumber(cycleLength, 0)} days` },
          ],
          note: "Predictions are based on average cycle length and may vary. Ovulation timing can be affected by stress, illness, travel, and other factors. This is not a reliable method for contraception or fertility planning. Consult a healthcare provider for family planning.",
        };
      },
    },
    {
      id: "regularity",
      name: "Cycle Regularity Check",
      description: "Assess cycle regularity from recent cycle lengths",
      fields: [
        {
          name: "cycle1",
          label: "Most Recent Cycle (days)",
          type: "number",
          placeholder: "e.g. 28",
          suffix: "days",
          min: 15,
          max: 60,
        },
        {
          name: "cycle2",
          label: "Previous Cycle (days)",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "days",
          min: 15,
          max: 60,
        },
        {
          name: "cycle3",
          label: "Cycle Before That (days)",
          type: "number",
          placeholder: "e.g. 27",
          suffix: "days",
          min: 15,
          max: 60,
        },
      ],
      calculate: (inputs) => {
        const c1 = parseFloat(inputs.cycle1 as string);
        const c2 = parseFloat(inputs.cycle2 as string);
        const c3 = parseFloat(inputs.cycle3 as string);
        if (!c1 || !c2 || !c3) return null;

        const cycles = [c1, c2, c3];
        const avg = cycles.reduce((a, b) => a + b, 0) / cycles.length;
        const shortest = Math.min(...cycles);
        const longest = Math.max(...cycles);
        const range = longest - shortest;

        // Standard deviation
        const variance = cycles.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / cycles.length;
        const stdDev = Math.sqrt(variance);

        let regularity: string;
        if (range <= 2) regularity = "Very regular";
        else if (range <= 5) regularity = "Regular";
        else if (range <= 8) regularity = "Somewhat irregular";
        else regularity = "Irregular -- consider consulting a doctor";

        const isNormalRange = avg >= 24 && avg <= 38;

        return {
          primary: { label: "Average Cycle Length", value: `${formatNumber(avg, 1)} days` },
          details: [
            { label: "Regularity", value: regularity },
            { label: "Cycle Range", value: `${formatNumber(shortest, 0)} - ${formatNumber(longest, 0)} days` },
            { label: "Variation", value: `${formatNumber(range, 0)} days` },
            { label: "Standard Deviation", value: `${formatNumber(stdDev, 1)} days` },
            { label: "Normal Range (24-38 days)", value: isNormalRange ? "Yes" : "Outside normal -- consult doctor" },
          ],
          note: "Normal menstrual cycles range from 24-38 days. Variation of up to 7-9 days between cycles is common, especially during perimenopause and adolescence. Persistent irregularity may indicate hormonal issues and should be discussed with a gynecologist.",
        };
      },
    },
  ],
  relatedSlugs: ["ovulation-calculator", "pregnancy-calculator", "postpartum-calorie-calculator"],
  faq: [
    {
      question: "What is a normal menstrual cycle length?",
      answer:
        "Normal cycles range from 24 to 38 days, with 28 days being the average. Cycles are measured from the first day of one period to the first day of the next. Some variation (up to 7-9 days) between cycles is normal. Consistently short (<24 days) or long (>38 days) cycles should be evaluated.",
    },
    {
      question: "When is the fertile window in a menstrual cycle?",
      answer:
        "The fertile window spans approximately 6 days: the 5 days before ovulation and the day of ovulation itself. Ovulation typically occurs about 14 days before the next period starts. For a 28-day cycle, this means around day 14. Sperm can survive up to 5 days in the reproductive tract.",
    },
    {
      question: "What causes irregular periods?",
      answer:
        "Common causes include stress, significant weight change, excessive exercise, PCOS, thyroid disorders, perimenopause, new birth control, breastfeeding, and certain medications. Occasional irregularity is normal. Persistent irregularity lasting 3+ months should be evaluated by a healthcare provider.",
    },
  ],
  formula:
    "Days Until Next Period = Cycle Length - Days Since Last Period | Ovulation Day = Cycle Length - 14 | Fertile Window = Ovulation Day - 5 to Ovulation Day + 1",
};
