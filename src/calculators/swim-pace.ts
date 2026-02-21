import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const swimPaceCalculator: CalculatorDefinition = {
  slug: "swim-pace-calculator",
  title: "Swimming Pace Calculator",
  description:
    "Free swimming pace calculator. Calculate your pace per 100m/100yd, estimate swim times for different distances, and convert between pool and open water pacing.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "swim pace calculator",
    "swimming pace per 100m",
    "swim time calculator",
    "pool pace calculator",
    "swim split calculator",
  ],
  variants: [
    {
      id: "pace",
      name: "Calculate Swim Pace",
      description: "Find your pace per 100m from total distance and time",
      fields: [
        { name: "distance", label: "Distance", type: "number", placeholder: "e.g. 1500", min: 1 },
        {
          name: "unit",
          label: "Distance Unit",
          type: "select",
          options: [
            { label: "Meters", value: "m" },
            { label: "Yards", value: "yd" },
          ],
          defaultValue: "m",
        },
        { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 25", min: 0 },
        { name: "seconds", label: "Seconds", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const distance = inputs.distance as number;
        const unit = inputs.unit as string;
        const mins = (inputs.minutes as number) || 0;
        const secs = (inputs.seconds as number) || 0;
        if (!distance) return null;

        const totalSec = mins * 60 + secs;
        if (totalSec <= 0) return null;

        const pacePer100 = (totalSec / distance) * 100;
        const paceMin = Math.floor(pacePer100 / 60);
        const paceSec = pacePer100 % 60;

        const distMeters = unit === "yd" ? distance * 0.9144 : distance;
        const speedMph = (distMeters / totalSec) * 2.23694;
        const speedKph = (distMeters / totalSec) * 3.6;

        // Convert between meters and yards
        const paceOther = unit === "m" ? pacePer100 * 0.9144 : pacePer100 / 0.9144;
        const otherMin = Math.floor(paceOther / 60);
        const otherSec = paceOther % 60;
        const otherUnit = unit === "m" ? "100yd" : "100m";

        // SWOLF estimate (strokes per length + time)
        const per25 = pacePer100 / 4;

        return {
          primary: {
            label: `Pace per 100${unit}`,
            value: `${paceMin}:${formatNumber(paceSec, 0).padStart(2, "0")}`,
            suffix: `/ 100${unit}`,
          },
          details: [
            { label: `Pace per ${otherUnit}`, value: `${otherMin}:${formatNumber(otherSec, 0).padStart(2, "0")}` },
            { label: "Speed", value: `${formatNumber(speedKph, 2)} kph (${formatNumber(speedMph, 2)} mph)` },
            { label: "Per 25m Split", value: `${formatNumber(per25, 1)}s` },
            { label: "Per Lap (50m)", value: `${formatNumber(pacePer100 / 2, 1)}s` },
          ],
        };
      },
    },
    {
      id: "predict",
      name: "Predict Swim Time",
      description: "Estimate time for different swim distances from your pace",
      fields: [
        { name: "paceMin", label: "Pace (minutes per 100m)", type: "number", placeholder: "e.g. 1", min: 0 },
        { name: "paceSec", label: "Pace (seconds per 100m)", type: "number", placeholder: "e.g. 45", min: 0, max: 59 },
        {
          name: "targetDistance",
          label: "Target Distance",
          type: "select",
          options: [
            { label: "200m", value: "200" },
            { label: "400m", value: "400" },
            { label: "800m", value: "800" },
            { label: "1500m (Olympic)", value: "1500" },
            { label: "1900m (Half IM)", value: "1900" },
            { label: "3800m (Ironman)", value: "3800" },
          ],
          defaultValue: "1500",
        },
      ],
      calculate: (inputs) => {
        const pMin = (inputs.paceMin as number) || 0;
        const pSec = (inputs.paceSec as number) || 0;
        const targetDist = parseFloat(inputs.targetDistance as string);
        if (!targetDist) return null;

        const pacePer100 = pMin * 60 + pSec;
        if (pacePer100 <= 0) return null;

        const totalSec = (pacePer100 / 100) * targetDist;
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = Math.round(totalSec % 60);

        const timeStr = h > 0
          ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
          : `${m}:${s.toString().padStart(2, "0")}`;

        return {
          primary: { label: `${targetDist}m Time`, value: timeStr },
          details: [
            { label: "Pace", value: `${pMin}:${pSec.toString().padStart(2, "0")} /100m` },
            { label: "Distance", value: `${formatNumber(targetDist, 0)}m` },
            { label: "Total Seconds", value: formatNumber(totalSec, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["swimming-pace-calculator", "triathlon-time-calculator", "pace-calculator"],
  faq: [
    {
      question: "What is a good swim pace per 100m?",
      answer:
        "For recreational swimmers, 2:00-2:30 per 100m is typical. Intermediate lap swimmers average 1:30-2:00 per 100m. Competitive swimmers range from 1:00-1:30. Elite swimmers are under 1:00 per 100m for freestyle.",
    },
    {
      question: "How do I convert swim pace from yards to meters?",
      answer:
        "Multiply your pace per 100 yards by 1.0936 to get your approximate pace per 100 meters. For example, 1:30 per 100yd is approximately 1:38 per 100m.",
    },
    {
      question: "What is SWOLF in swimming?",
      answer:
        "SWOLF (Swimming Golf) is the sum of your stroke count and time for one length of the pool. A lower SWOLF score indicates better swimming efficiency. For a 25m pool, a SWOLF of 35-45 is good for recreational swimmers.",
    },
  ],
  formula: "Pace per 100 = (Total Time / Distance) × 100 | Yards to Meters: pace/100m = pace/100yd × 1.0936",
};
