import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paceCalculator: CalculatorDefinition = {
  slug: "pace-calculator",
  title: "Pace Calculator",
  description: "Free running pace calculator. Calculate pace, speed, finish time, or distance for running, cycling, and walking.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["pace calculator", "running pace", "race pace calculator", "speed calculator running", "marathon pace"],
  variants: [
    {
      id: "pace",
      name: "Calculate Pace",
      description: "Find your pace from distance and time",
      fields: [
        { name: "distance", label: "Distance", type: "number", placeholder: "e.g. 5", step: 0.01 },
        { name: "unit", label: "Unit", type: "select", options: [{ label: "Kilometers", value: "km" }, { label: "Miles", value: "mi" }], defaultValue: "km" },
        { name: "hours", label: "Hours", type: "number", placeholder: "0", min: 0 },
        { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 25", min: 0, max: 59 },
        { name: "seconds", label: "Seconds", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const dist = inputs.distance as number;
        const hours = (inputs.hours as number) || 0;
        const mins = (inputs.minutes as number) || 0;
        const secs = (inputs.seconds as number) || 0;
        if (!dist) return null;
        const totalSeconds = hours * 3600 + mins * 60 + secs;
        if (totalSeconds <= 0) return null;

        const paceSeconds = totalSeconds / dist;
        const paceMin = Math.floor(paceSeconds / 60);
        const paceSec = Math.round(paceSeconds % 60);
        const speedKmh = (dist / totalSeconds) * 3600 * (inputs.unit === "mi" ? 1.60934 : 1);

        return {
          primary: { label: "Pace", value: `${paceMin}:${paceSec.toString().padStart(2, "0")}`, suffix: `per ${inputs.unit}` },
          details: [
            { label: "Speed", value: `${formatNumber(speedKmh, 1)} km/h` },
            { label: "Total time", value: `${hours}h ${mins}m ${secs}s` },
          ],
        };
      },
    },
    {
      id: "finish-time",
      name: "Race Finish Time",
      description: "Estimate finish time from pace and distance",
      fields: [
        { name: "race", label: "Race Distance", type: "select", options: [
          { label: "5K", value: "5" }, { label: "10K", value: "10" }, { label: "Half Marathon (21.1K)", value: "21.0975" },
          { label: "Marathon (42.2K)", value: "42.195" },
        ], defaultValue: "5" },
        { name: "paceMin", label: "Pace (minutes)", type: "number", placeholder: "e.g. 5", min: 1 },
        { name: "paceSec", label: "Pace (seconds)", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const dist = parseFloat(inputs.race as string);
        const pm = inputs.paceMin as number;
        const ps = (inputs.paceSec as number) || 0;
        if (!dist || !pm) return null;
        const totalSec = dist * (pm * 60 + ps);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = Math.round(totalSec % 60);
        return {
          primary: { label: "Finish Time", value: `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}` },
          details: [{ label: "Distance", value: `${dist} km` }, { label: "Pace", value: `${pm}:${ps.toString().padStart(2, "0")} /km` }],
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "calorie-calculator"],
  faq: [
    { question: "What is a good running pace?", answer: "Beginner: 7-8 min/km. Intermediate: 5-6 min/km. Advanced: 4-5 min/km. Elite marathon: ~3:00 min/km." },
  ],
  formula: "Pace = Time / Distance | Finish Time = Pace x Distance",
};
