import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const swimmingPaceCalculator: CalculatorDefinition = {
  slug: "swimming-pace-calculator",
  title: "Swimming Pace Calculator",
  description:
    "Free swimming pace calculator. Calculate pace per 100m or 100yd and estimate times for common race distances.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["swimming pace", "swim time", "pace per 100m", "swim calculator"],
  variants: [
    {
      id: "pacePer100m",
      name: "Pace per 100m",
      fields: [
        {
          name: "minutes",
          label: "Total Time \u2013 Minutes",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "seconds",
          label: "Total Time \u2013 Seconds",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "distance",
          label: "Distance (meters)",
          type: "number",
          placeholder: "e.g. 400",
        },
      ],
      calculate: (inputs) => {
        const minutes = inputs.minutes as number;
        const seconds = (inputs.seconds as number) || 0;
        const distance = inputs.distance as number;
        if (minutes === undefined || !distance) return null;
        if (minutes === 0 && seconds === 0) return null;

        const totalSeconds = minutes * 60 + seconds;
        const pacePer100 = (totalSeconds / distance) * 100;
        const paceMin = Math.floor(pacePer100 / 60);
        const paceSec = pacePer100 % 60;

        const distances = [100, 200, 400, 800, 1500];
        const details = distances.map((d) => {
          const estSeconds = (totalSeconds / distance) * d;
          const estMin = Math.floor(estSeconds / 60);
          const estSec = estSeconds % 60;
          return {
            label: `${d}m Estimate`,
            value: `${estMin}:${estSec < 10 ? "0" : ""}${formatNumber(estSec, 0)}`,
          };
        });

        return {
          primary: {
            label: "Pace per 100m",
            value: `${paceMin}:${paceSec < 10 ? "0" : ""}${formatNumber(paceSec, 0)}`,
          },
          details: [
            {
              label: "Total Time",
              value: `${minutes}:${seconds < 10 ? "0" : ""}${formatNumber(seconds, 0)}`,
            },
            { label: "Distance", value: `${formatNumber(distance, 0)} m` },
            ...details,
          ],
        };
      },
    },
    {
      id: "pacePer100yd",
      name: "Pace per 100yd",
      fields: [
        {
          name: "minutes",
          label: "Total Time \u2013 Minutes",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "seconds",
          label: "Total Time \u2013 Seconds",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "distance",
          label: "Distance (yards)",
          type: "number",
          placeholder: "e.g. 400",
        },
      ],
      calculate: (inputs) => {
        const minutes = inputs.minutes as number;
        const seconds = (inputs.seconds as number) || 0;
        const distance = inputs.distance as number;
        if (minutes === undefined || !distance) return null;
        if (minutes === 0 && seconds === 0) return null;

        const totalSeconds = minutes * 60 + seconds;
        const pacePer100 = (totalSeconds / distance) * 100;
        const paceMin = Math.floor(pacePer100 / 60);
        const paceSec = pacePer100 % 60;

        return {
          primary: {
            label: "Pace per 100yd",
            value: `${paceMin}:${paceSec < 10 ? "0" : ""}${formatNumber(paceSec, 0)}`,
          },
          details: [
            {
              label: "Total Time",
              value: `${minutes}:${seconds < 10 ? "0" : ""}${formatNumber(seconds, 0)}`,
            },
            { label: "Distance", value: `${formatNumber(distance, 0)} yd` },
            {
              label: "Speed",
              value: `${formatNumber((distance / totalSeconds) * 3600 * 0.000568182, 2)} mph`,
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["exercise-calorie-calculator", "marathon-predictor-calculator"],
  faq: [
    {
      question: "How do I calculate my swimming pace?",
      answer:
        "Divide your total swim time (in seconds) by the distance swum, then multiply by 100 to get pace per 100m or 100yd.",
    },
    {
      question: "What is a good pace per 100m for recreational swimmers?",
      answer:
        "Recreational swimmers typically swim between 2:00 and 3:00 per 100m. Competitive swimmers often pace below 1:30 per 100m.",
    },
  ],
  formula: "Pace per 100 = (Total Time in seconds / Distance) \u00D7 100",
};
