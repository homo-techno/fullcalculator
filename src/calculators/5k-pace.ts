import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fiveKPaceCalculator: CalculatorDefinition = {
  slug: "5k-pace",
  title: "5K Pace Calculator",
  description: "Free online 5K pace and time calculator. Calculate the pace per mile or kilometer needed to finish a 5K in your goal time, with race projections.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["5k pace", "5k time", "5k calculator", "couch to 5k", "5k race pace", "running 5k"],
  variants: [
    {
      id: "5k-pace",
      name: "Calculate 5K Pace",
      fields: [
        { name: "minutes", label: "Goal Time - Minutes", type: "number", placeholder: "e.g. 25" },
        { name: "seconds", label: "Goal Time - Seconds", type: "number", placeholder: "e.g. 0" },
      ],
      calculate: (inputs) => {
        const minutes = parseFloat(inputs.minutes as string) || 0;
        const seconds = parseFloat(inputs.seconds as string) || 0;

        const totalSeconds = minutes * 60 + seconds;
        const distanceMiles = 3.10686;
        const distanceKm = 5.0;

        const pacePerMileSec = totalSeconds / distanceMiles;
        const pacePerKmSec = totalSeconds / distanceKm;

        const mileMin = Math.floor(pacePerMileSec / 60);
        const mileSec = Math.round(pacePerMileSec % 60);
        const kmMin = Math.floor(pacePerKmSec / 60);
        const kmSec = Math.round(pacePerKmSec % 60);

        const speedMph = distanceMiles / (totalSeconds / 3600);
        const speedKph = distanceKm / (totalSeconds / 3600);

        const projected10kSec = totalSeconds * 2.08;
        const p10kMin = Math.floor(projected10kSec / 60);
        const p10kSec = Math.round(projected10kSec % 60);

        const projectedHalfSec = totalSeconds * 4.65;
        const pHalfHr = Math.floor(projectedHalfSec / 3600);
        const pHalfMin = Math.floor((projectedHalfSec % 3600) / 60);
        const pHalfSec = Math.round(projectedHalfSec % 60);

        return {
          primary: { label: "Pace per Mile", value: `${formatNumber(mileMin)}:${mileSec.toString().padStart(2, "0")}` },
          details: [
            { label: "Pace per Kilometer", value: `${formatNumber(kmMin)}:${kmSec.toString().padStart(2, "0")}` },
            { label: "Average Speed (mph)", value: formatNumber(speedMph) },
            { label: "Average Speed (kph)", value: formatNumber(speedKph) },
            { label: "Projected 10K Time", value: `${p10kMin}:${p10kSec.toString().padStart(2, "0")}` },
            { label: "Projected Half Marathon", value: `${pHalfHr}:${pHalfMin.toString().padStart(2, "0")}:${pHalfSec.toString().padStart(2, "0")}` },
            { label: "Total Time (seconds)", value: formatNumber(totalSeconds) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["marathon-pace", "half-marathon-pace", "steps-to-miles", "heart-rate-zone"],
  faq: [
    {
      question: "What is a good 5K time?",
      answer: "The average 5K finish time is about 30-35 minutes. A sub-25 minute 5K (8:02/mile) is a good goal for regular runners. Competitive runners aim for sub-20 (6:26/mile). Elite runners finish in 13-15 minutes.",
    },
    {
      question: "How can I improve my 5K time?",
      answer: "Incorporate interval training (speed work), tempo runs, and easy long runs into your weekly schedule. Run 3-4 times per week, gradually increase mileage, and include one quality workout per week. Most runners can improve by 1-2 minutes over 8-12 weeks of structured training.",
    },
    {
      question: "How do I predict longer race times from a 5K?",
      answer: "Multiply your 5K time by approximately 2.08 for a 10K projection, 4.65 for a half marathon, and 9.8 for a marathon projection. These factors account for the natural slowdown over longer distances.",
    },
  ],
  formula: "Pace per Mile = Total Time / 3.10686; Pace per Km = Total Time / 5; Projected 10K = 5K Time x 2.08; Projected Half = 5K Time x 4.65",
};
