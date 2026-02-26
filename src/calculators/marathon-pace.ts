import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const marathonPaceCalculator: CalculatorDefinition = {
  slug: "marathon-pace",
  title: "Marathon Pace Calculator",
  description: "Free online marathon pace calculator. Calculate your required pace per mile or kilometer to finish a marathon in your goal time, with split projections.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["marathon pace", "marathon calculator", "26.2 pace", "marathon time", "marathon splits", "running pace"],
  variants: [
    {
      id: "marathon-pace",
      name: "Calculate Marathon Pace",
      fields: [
        { name: "hours", label: "Goal Time - Hours", type: "number", placeholder: "e.g. 3" },
        { name: "minutes", label: "Goal Time - Minutes", type: "number", placeholder: "e.g. 45" },
        { name: "seconds", label: "Goal Time - Seconds", type: "number", placeholder: "e.g. 0" },
      ],
      calculate: (inputs) => {
        const hours = parseFloat(inputs.hours as string) || 0;
        const minutes = parseFloat(inputs.minutes as string) || 0;
        const seconds = parseFloat(inputs.seconds as string) || 0;

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        const marathonMiles = 26.2188;
        const marathonKm = 42.195;

        const pacePerMileSec = totalSeconds / marathonMiles;
        const pacePerKmSec = totalSeconds / marathonKm;

        const mileMin = Math.floor(pacePerMileSec / 60);
        const mileSec = Math.round(pacePerMileSec % 60);
        const kmMin = Math.floor(pacePerKmSec / 60);
        const kmSec = Math.round(pacePerKmSec % 60);

        const speedMph = marathonMiles / (totalSeconds / 3600);
        const speedKph = marathonKm / (totalSeconds / 3600);

        const halfSplit = totalSeconds / 2;
        const halfHr = Math.floor(halfSplit / 3600);
        const halfMin = Math.floor((halfSplit % 3600) / 60);
        const halfSecRem = Math.round(halfSplit % 60);

        const tenKSec = pacePerKmSec * 10;
        const tenKMin = Math.floor(tenKSec / 60);
        const tenKSecRem = Math.round(tenKSec % 60);

        return {
          primary: { label: "Pace per Mile", value: `${formatNumber(mileMin)}:${mileSec.toString().padStart(2, "0")}` },
          details: [
            { label: "Pace per Kilometer", value: `${formatNumber(kmMin)}:${kmSec.toString().padStart(2, "0")}` },
            { label: "Average Speed (mph)", value: formatNumber(speedMph) },
            { label: "Average Speed (kph)", value: formatNumber(speedKph) },
            { label: "Half Marathon Split", value: `${halfHr}:${halfMin.toString().padStart(2, "0")}:${halfSecRem.toString().padStart(2, "0")}` },
            { label: "10K Split", value: `${tenKMin}:${tenKSecRem.toString().padStart(2, "0")}` },
            { label: "Total Time (seconds)", value: formatNumber(totalSeconds) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["half-marathon-pace", "5k-pace", "steps-to-miles", "heart-rate-zone"],
  faq: [
    {
      question: "What is a good marathon pace?",
      answer: "The average marathon finish time is about 4:30 (10:17/mile). A sub-4-hour marathon (9:09/mile) is a common goal. Elite runners finish in about 2:00-2:10 (4:35-4:58/mile). A sub-3-hour marathon (6:52/mile) puts you in the top 5% of finishers.",
    },
    {
      question: "Should I run even splits or negative splits?",
      answer: "Negative splits (running the second half slightly faster) are generally considered ideal for marathon pacing. This means starting conservatively and finishing strong. Even splits work well too. Avoid positive splits (starting too fast) as this often leads to hitting the wall.",
    },
    {
      question: "How does pace per mile translate to finish time?",
      answer: "A marathon is 26.2 miles. At 8:00/mile, you finish in about 3:29:45. At 9:00/mile, about 3:55:58. At 10:00/mile, about 4:22:11. At 11:00/mile, about 4:48:24. Even small pace changes of 10-15 seconds per mile add up significantly.",
    },
  ],
  formula: "Pace per Mile = Total Time / 26.2188; Pace per Km = Total Time / 42.195; Speed (mph) = 26.2188 / Time (hours)",
};
