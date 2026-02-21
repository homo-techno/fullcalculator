import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rowingPaceCalculator: CalculatorDefinition = {
  slug: "rowing-pace-calculator",
  title: "Rowing Pace Calculator",
  description:
    "Free rowing pace and split calculator. Calculate your 500m split time, total time, watts, and calories for indoor rowing (erg) workouts.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "rowing pace calculator",
    "rowing split calculator",
    "erg calculator",
    "concept2 calculator",
    "rowing watts",
  ],
  variants: [
    {
      id: "split",
      name: "Calculate Split Time",
      description: "Find your 500m split from distance and total time",
      fields: [
        { name: "distance", label: "Distance (meters)", type: "number", placeholder: "e.g. 2000", min: 1 },
        { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 7", min: 0 },
        { name: "seconds", label: "Seconds", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const distance = inputs.distance as number;
        const mins = (inputs.minutes as number) || 0;
        const secs = (inputs.seconds as number) || 0;
        if (!distance || distance <= 0) return null;

        const totalSec = mins * 60 + secs;
        if (totalSec <= 0) return null;

        const splitSec = (totalSec / distance) * 500;
        const splitMin = Math.floor(splitSec / 60);
        const splitRemSec = splitSec % 60;

        const pace = totalSec / distance;
        const watts = 2.8 / Math.pow(pace, 3);
        const calPerHour = (watts * 4 + 300) * (totalSec / 3600);

        return {
          primary: {
            label: "500m Split",
            value: `${splitMin}:${formatNumber(splitRemSec, 1).padStart(4, "0")}`,
            suffix: "/500m",
          },
          details: [
            { label: "Average Watts", value: formatNumber(watts, 0) },
            { label: "Meters/Second", value: formatNumber(distance / totalSec, 2) },
            { label: "Est. Calories", value: formatNumber(calPerHour, 0) },
            { label: "Stroke Rate Est.", value: `${formatNumber(distance / totalSec * 3, 0)} spm` },
          ],
        };
      },
    },
    {
      id: "watts-to-split",
      name: "Watts to Split",
      description: "Convert watts to 500m split time",
      fields: [
        { name: "watts", label: "Watts", type: "number", placeholder: "e.g. 200", min: 1 },
      ],
      calculate: (inputs) => {
        const watts = inputs.watts as number;
        if (!watts || watts <= 0) return null;

        const pace = Math.pow(2.8 / watts, 1 / 3);
        const splitSec = pace * 500;
        const splitMin = Math.floor(splitSec / 60);
        const splitRemSec = splitSec % 60;

        const calPerHour = watts * 4 + 300;
        const twoKTime = pace * 2000;
        const twoKMin = Math.floor(twoKTime / 60);
        const twoKSec = twoKTime % 60;

        return {
          primary: {
            label: "500m Split",
            value: `${splitMin}:${formatNumber(splitRemSec, 1).padStart(4, "0")}`,
            suffix: "/500m",
          },
          details: [
            { label: "Watts", value: formatNumber(watts, 0) },
            { label: "Calories/Hour", value: formatNumber(calPerHour, 0) },
            { label: "Est. 2K Time", value: `${twoKMin}:${formatNumber(twoKSec, 1).padStart(4, "0")}` },
            { label: "Meters/Second", value: formatNumber(1 / pace, 2) },
          ],
        };
      },
    },
    {
      id: "split-to-watts",
      name: "Split to Watts",
      description: "Convert 500m split time to watts",
      fields: [
        { name: "splitMin", label: "Split Minutes", type: "number", placeholder: "e.g. 1", min: 0 },
        { name: "splitSec", label: "Split Seconds", type: "number", placeholder: "e.g. 50", min: 0, max: 59, step: 0.1 },
      ],
      calculate: (inputs) => {
        const splitMin = (inputs.splitMin as number) || 0;
        const splitSec = (inputs.splitSec as number) || 0;
        const totalSplitSec = splitMin * 60 + splitSec;
        if (totalSplitSec <= 0) return null;

        const pace = totalSplitSec / 500;
        const watts = 2.8 / Math.pow(pace, 3);
        const calPerHour = watts * 4 + 300;

        return {
          primary: { label: "Watts", value: formatNumber(watts, 0) },
          details: [
            { label: "500m Split", value: `${splitMin}:${formatNumber(splitSec, 1).padStart(4, "0")} /500m` },
            { label: "Calories/Hour", value: formatNumber(calPerHour, 0) },
            { label: "Meters/Second", value: formatNumber(1 / pace, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pace-calculator", "exercise-calorie-calculator", "calorie-calculator"],
  faq: [
    {
      question: "What is a good 500m split time for rowing?",
      answer:
        "Beginner: 2:15-2:30 /500m. Intermediate: 1:55-2:10 /500m. Advanced: 1:40-1:55 /500m. Elite: under 1:35 /500m. These vary significantly by weight, age, and gender.",
    },
    {
      question: "How are rowing watts calculated?",
      answer:
        "The Concept2 formula is: Watts = 2.80 / pace^3, where pace is in seconds per meter. This is the standard used by most rowing ergometers worldwide.",
    },
    {
      question: "What is a good 2K erg time?",
      answer:
        "For males: beginner 8:00+, intermediate 7:00-7:30, competitive 6:20-6:50, elite under 6:00. For females: beginner 9:00+, intermediate 7:45-8:15, competitive 7:00-7:30, elite under 6:45.",
    },
  ],
  formula: "Watts = 2.80 / pace³ (pace in sec/meter) | Split = (Total Time / Distance) × 500",
};
