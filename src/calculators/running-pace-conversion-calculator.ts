import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const runningPaceConversionCalculator: CalculatorDefinition = {
  slug: "running-pace-conversion-calculator",
  title: "Running Pace Conversion Calculator",
  description: "Convert running pace between min/km and min/mile formats",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["running pace","pace converter","min per mile to min per km"],
  variants: [{
    id: "standard",
    name: "Running Pace Conversion",
    description: "Convert running pace between min/km and min/mile formats",
    fields: [
      { name: "paceMinutes", label: "Pace Minutes", type: "number", defaultValue: 8, min: 3, max: 20, step: 1 },
      { name: "paceSeconds", label: "Pace Seconds", type: "number", defaultValue: 30, min: 0, max: 59, step: 1 },
      { name: "inputUnit", label: "Input Unit (1=min/mile, 2=min/km)", type: "number", defaultValue: 1, min: 1, max: 2, step: 1 },
      { name: "raceDistance", label: "Race Distance (miles)", type: "number", defaultValue: 13.1, min: 0.1, max: 100, step: 0.1 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const mins = inputs.paceMinutes as number || 8;
      const secs = inputs.paceSeconds as number || 30;
      const unit = inputs.inputUnit as number || 1;
      const distance = inputs.raceDistance as number || 13.1;
      const totalSecs = mins * 60 + secs;
      let perMileSecs: number, perKmSecs: number;
      if (unit === 1) {
        perMileSecs = totalSecs;
        perKmSecs = Math.round(totalSecs / 1.60934);
      } else {
        perKmSecs = totalSecs;
        perMileSecs = Math.round(totalSecs * 1.60934);
      }
      const mileMin = Math.floor(perMileSecs / 60);
      const mileSec = perMileSecs % 60;
      const kmMin = Math.floor(perKmSecs / 60);
      const kmSec = perKmSecs % 60;
      const totalTimeSecs = perMileSecs * distance;
      const raceHrs = Math.floor(totalTimeSecs / 3600);
      const raceMins = Math.floor((totalTimeSecs % 3600) / 60);
      const raceSecs = Math.round(totalTimeSecs % 60);
      const speedMph = 3600 / perMileSecs;
      const padSec = (s: number) => s < 10 ? "0" + s : String(s);
      return {
        primary: { label: "Pace (min/mile)", value: mileMin + ":" + padSec(mileSec) },
        details: [
          { label: "Pace (min/km)", value: kmMin + ":" + padSec(kmSec) },
          { label: "Speed", value: formatNumber(Math.round(speedMph * 100) / 100) + " mph" },
          { label: "Race Time (" + distance + " mi)", value: raceHrs + ":" + padSec(raceMins) + ":" + padSec(raceSecs) },
          { label: "Distance in km", value: formatNumber(Math.round(distance * 1.60934 * 10) / 10) + " km" }
        ]
      };
    },
  }],
  relatedSlugs: ["vo2-max-calculator"],
  faq: [
    { question: "How do I convert min/mile to min/km?", answer: "Divide your min/mile pace by 1.60934 to get min/km. For example, 8:00/mile is about 4:58/km." },
    { question: "What is a good running pace?", answer: "For recreational runners, 9-12 min/mile is common. Competitive runners aim for 6-8 min/mile." },
  ],
  formula: "min/km = min/mile / 1.60934. Race Time = Pace x Distance.",
};
