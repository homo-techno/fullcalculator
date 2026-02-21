import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babySleepScheduleCalculator: CalculatorDefinition = {
  slug: "baby-sleep-schedule-calculator",
  title: "Baby Sleep Schedule Calculator",
  description:
    "Free baby sleep schedule calculator. Get age-appropriate sleep recommendations including total sleep hours, nap count, wake windows, and bedtime.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby sleep schedule",
    "baby nap schedule",
    "infant sleep calculator",
    "wake windows",
    "baby bedtime calculator",
  ],
  variants: [
    {
      id: "sleep-schedule",
      name: "Sleep Schedule by Age",
      description: "Get recommended sleep schedule for your baby's age",
      fields: [
        {
          name: "ageMonths",
          label: "Baby's Age (months)",
          type: "number",
          placeholder: "e.g. 6",
          min: 0,
          max: 36,
        },
        {
          name: "wakeTime",
          label: "Typical Morning Wake Time",
          type: "select",
          options: [
            { label: "6:00 AM", value: "6" },
            { label: "6:30 AM", value: "6.5" },
            { label: "7:00 AM", value: "7" },
            { label: "7:30 AM", value: "7.5" },
            { label: "8:00 AM", value: "8" },
          ],
          defaultValue: "7",
        },
      ],
      calculate: (inputs) => {
        const ageMonths = inputs.ageMonths as number;
        const wakeTime = parseFloat(inputs.wakeTime as string) || 7;
        if (ageMonths === undefined || ageMonths === null) return null;

        // Sleep recommendations by age (AAP/NSF guidelines)
        let totalSleep: number;
        let nightSleep: number;
        let napCount: number;
        let napHours: number;
        let wakeWindow: string;
        let ageLabel: string;

        if (ageMonths < 1) {
          totalSleep = 16; nightSleep = 8.5; napCount = 5; napHours = 7.5; wakeWindow = "45-60 min"; ageLabel = "Newborn";
        } else if (ageMonths < 3) {
          totalSleep = 15.5; nightSleep = 9; napCount = 4; napHours = 6.5; wakeWindow = "60-90 min"; ageLabel = "1-2 months";
        } else if (ageMonths < 5) {
          totalSleep = 15; nightSleep = 10; napCount = 3; napHours = 5; wakeWindow = "1.5-2 hours"; ageLabel = "3-4 months";
        } else if (ageMonths < 7) {
          totalSleep = 14.5; nightSleep = 11; napCount = 3; napHours = 3.5; wakeWindow = "2-2.5 hours"; ageLabel = "5-6 months";
        } else if (ageMonths < 10) {
          totalSleep = 14; nightSleep = 11; napCount = 2; napHours = 3; wakeWindow = "2.5-3.5 hours"; ageLabel = "7-9 months";
        } else if (ageMonths < 13) {
          totalSleep = 13.5; nightSleep = 11; napCount = 2; napHours = 2.5; wakeWindow = "3-4 hours"; ageLabel = "10-12 months";
        } else if (ageMonths < 18) {
          totalSleep = 13; nightSleep = 11; napCount = 1; napHours = 2; wakeWindow = "4-5 hours"; ageLabel = "13-17 months";
        } else if (ageMonths < 24) {
          totalSleep = 13; nightSleep = 11; napCount = 1; napHours = 2; wakeWindow = "5-6 hours"; ageLabel = "18-23 months";
        } else {
          totalSleep = 12; nightSleep = 11; napCount = 1; napHours = 1; wakeWindow = "5-6 hours"; ageLabel = "2-3 years";
        }

        // Calculate bedtime
        const bedtimeDecimal = wakeTime + (24 - nightSleep);
        const adjustedBedtime = bedtimeDecimal >= 24 ? bedtimeDecimal - 24 : bedtimeDecimal;
        const bedHour = Math.floor(adjustedBedtime);
        const bedMin = Math.round((adjustedBedtime - bedHour) * 60);
        const bedPeriod = bedHour >= 12 ? "PM" : "AM";
        const displayHour = bedHour > 12 ? bedHour - 12 : bedHour === 0 ? 12 : bedHour;
        const bedtimeStr = `${displayHour}:${bedMin.toString().padStart(2, "0")} ${bedPeriod}`;

        const wakeHour = Math.floor(wakeTime);
        const wakeMin = Math.round((wakeTime - wakeHour) * 60);
        const wakePeriod = wakeHour >= 12 ? "PM" : "AM";
        const wakeDisplayHour = wakeHour > 12 ? wakeHour - 12 : wakeHour === 0 ? 12 : wakeHour;
        const wakeTimeStr = `${wakeDisplayHour}:${wakeMin.toString().padStart(2, "0")} ${wakePeriod}`;

        return {
          primary: {
            label: "Total Daily Sleep",
            value: `${formatNumber(totalSleep, 1)} hours`,
          },
          details: [
            { label: "Age Group", value: ageLabel },
            { label: "Nighttime Sleep", value: `${formatNumber(nightSleep, 1)} hours` },
            { label: "Number of Naps", value: `${napCount} nap${napCount > 1 ? "s" : ""}` },
            { label: "Total Nap Time", value: `${formatNumber(napHours, 1)} hours` },
            { label: "Wake Windows", value: wakeWindow },
            { label: "Suggested Wake Time", value: wakeTimeStr },
            { label: "Suggested Bedtime", value: bedtimeStr },
          ],
          note: "Sleep needs vary by child. These are evidence-based guidelines from the AAP and National Sleep Foundation. Wake windows are the time your baby should be awake between sleep periods. Consistent routines improve sleep quality.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-feeding-schedule-calculator", "baby-milestone-calculator", "baby-growth-calculator"],
  faq: [
    {
      question: "What are wake windows?",
      answer:
        "Wake windows are the periods of time your baby is awake between naps. Age-appropriate wake windows help prevent over-tiredness: newborns need just 45-60 minutes awake, 6-month-olds need 2-2.5 hours, and 12-month-olds need 3-4 hours between sleeps.",
    },
    {
      question: "When do babies drop to one nap?",
      answer:
        "Most babies transition from two naps to one between 13-18 months. Signs your baby is ready include: consistently resisting the second nap, taking very long to fall asleep for naps, or sleeping well with just one midday nap. The transition period can take 2-4 weeks.",
    },
    {
      question: "How much sleep does a newborn need?",
      answer:
        "Newborns (0-3 months) need 14-17 hours of sleep per day, split between nighttime and multiple naps. Newborn sleep is irregular - they typically sleep in 2-4 hour stretches around the clock. A predictable schedule usually emerges around 3-4 months.",
    },
  ],
  formula:
    "Sleep needs based on AAP/NSF guidelines by age. Bedtime = Wake Time + (24 - Night Sleep Hours). Wake Windows increase with age from 45 min (newborn) to 5-6 hours (toddler).",
};
