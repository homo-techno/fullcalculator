import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const halfMarathonPaceCalculator: CalculatorDefinition = {
  slug: "half-marathon-pace",
  title: "Half Marathon Pace Calculator",
  description: "Free online half marathon pace calculator. Calculate the pace per mile or kilometer needed to finish a half marathon in your goal time.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["half marathon pace", "13.1 pace", "half marathon time", "half marathon calculator", "running pace half"],
  variants: [
    {
      id: "half-marathon-pace",
      name: "Calculate Half Marathon Pace",
      fields: [
        { name: "hours", label: "Goal Time - Hours", type: "number", placeholder: "e.g. 1" },
        { name: "minutes", label: "Goal Time - Minutes", type: "number", placeholder: "e.g. 45" },
        { name: "seconds", label: "Goal Time - Seconds", type: "number", placeholder: "e.g. 0" },
      ],
      calculate: (inputs) => {
        const hours = parseFloat(inputs.hours as string) || 0;
        const minutes = parseFloat(inputs.minutes as string) || 0;
        const seconds = parseFloat(inputs.seconds as string) || 0;

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        const halfMarathonMiles = 13.1094;
        const halfMarathonKm = 21.0975;

        const pacePerMileSec = totalSeconds / halfMarathonMiles;
        const pacePerKmSec = totalSeconds / halfMarathonKm;

        const mileMin = Math.floor(pacePerMileSec / 60);
        const mileSec = Math.round(pacePerMileSec % 60);
        const kmMin = Math.floor(pacePerKmSec / 60);
        const kmSec = Math.round(pacePerKmSec % 60);

        const speedMph = halfMarathonMiles / (totalSeconds / 3600);
        const speedKph = halfMarathonKm / (totalSeconds / 3600);

        const projectedMarathonSec = totalSeconds * 2.1;
        const marHr = Math.floor(projectedMarathonSec / 3600);
        const marMin = Math.floor((projectedMarathonSec % 3600) / 60);
        const marSec = Math.round(projectedMarathonSec % 60);

        const fiveKSec = pacePerKmSec * 5;
        const fiveKMin = Math.floor(fiveKSec / 60);
        const fiveKSecRem = Math.round(fiveKSec % 60);

        return {
          primary: { label: "Pace per Mile", value: `${formatNumber(mileMin)}:${mileSec.toString().padStart(2, "0")}` },
          details: [
            { label: "Pace per Kilometer", value: `${formatNumber(kmMin)}:${kmSec.toString().padStart(2, "0")}` },
            { label: "Average Speed (mph)", value: formatNumber(speedMph) },
            { label: "Average Speed (kph)", value: formatNumber(speedKph) },
            { label: "Projected Marathon Time", value: `${marHr}:${marMin.toString().padStart(2, "0")}:${marSec.toString().padStart(2, "0")}` },
            { label: "Projected 5K Split", value: `${fiveKMin}:${fiveKSecRem.toString().padStart(2, "0")}` },
            { label: "Total Time (seconds)", value: formatNumber(totalSeconds) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["marathon-pace", "5k-pace", "steps-to-miles", "heart-rate-zone"],
  faq: [
    {
      question: "What is a good half marathon time?",
      answer: "The average half marathon finish time is about 2:00-2:05. A sub-2-hour half marathon (9:09/mile) is a popular goal. Competitive runners aim for sub-1:30 (6:52/mile). Elite runners finish in 58-65 minutes.",
    },
    {
      question: "How do I predict my marathon time from a half marathon?",
      answer: "A common method is to double your half marathon time and add 10-20 minutes. The factor is roughly 2.1x your half marathon time. For example, a 1:45 half marathon projects to approximately a 3:40-3:45 marathon.",
    },
    {
      question: "How should I pace my half marathon?",
      answer: "Start at or slightly slower than your target pace for the first 3 miles. Settle into your goal pace for miles 4-10. Save energy for a strong finish in the final 5K. Avoid going out too fast in the excitement of race day.",
    },
  ],
  formula: "Pace per Mile = Total Time / 13.1094; Pace per Km = Total Time / 21.0975; Projected Marathon = Half Time x 2.1",
};
