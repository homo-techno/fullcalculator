import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const speedCalculator: CalculatorDefinition = {
  slug: "speed-distance-time-calculator",
  title: "Speed Distance Time Calculator",
  description: "Free speed, distance, time calculator. Solve for any variable given the other two. Supports mph, km/h, and m/s.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["speed calculator", "distance calculator", "time calculator", "speed distance time", "velocity calculator"],
  variants: [
    {
      id: "speed",
      name: "Calculate Speed",
      fields: [
        { name: "distance", label: "Distance", type: "number", placeholder: "e.g. 150" },
        { name: "distUnit", label: "Distance Unit", type: "select", options: [{ label: "km", value: "km" }, { label: "miles", value: "mi" }, { label: "meters", value: "m" }], defaultValue: "km" },
        { name: "hours", label: "Hours", type: "number", placeholder: "e.g. 2", min: 0 },
        { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const d = inputs.distance as number;
        const h = (inputs.hours as number) || 0;
        const m = (inputs.minutes as number) || 0;
        const unit = inputs.distUnit as string;
        if (!d) return null;
        const totalHours = h + m / 60;
        if (totalHours <= 0) return null;
        const speed = d / totalHours;
        return {
          primary: { label: "Speed", value: formatNumber(speed, 1), suffix: `${unit}/h` },
          details: [{ label: "Distance", value: `${formatNumber(d)} ${unit}` }, { label: "Time", value: `${h}h ${m}m` }],
        };
      },
    },
    {
      id: "distance",
      name: "Calculate Distance",
      fields: [
        { name: "speed", label: "Speed", type: "number", placeholder: "e.g. 60" },
        { name: "speedUnit", label: "Speed Unit", type: "select", options: [{ label: "km/h", value: "km" }, { label: "mph", value: "mi" }], defaultValue: "km" },
        { name: "hours", label: "Hours", type: "number", placeholder: "e.g. 3", min: 0 },
        { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 15", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const s = inputs.speed as number;
        const h = (inputs.hours as number) || 0;
        const m = (inputs.minutes as number) || 0;
        const unit = inputs.speedUnit as string;
        if (!s) return null;
        const totalHours = h + m / 60;
        if (totalHours <= 0) return null;
        const distance = s * totalHours;
        return {
          primary: { label: "Distance", value: formatNumber(distance, 1), suffix: unit },
          details: [{ label: "Speed", value: `${formatNumber(s)} ${unit}/h` }, { label: "Time", value: `${h}h ${m}m` }],
        };
      },
    },
    {
      id: "time",
      name: "Calculate Time",
      fields: [
        { name: "distance", label: "Distance", type: "number", placeholder: "e.g. 200" },
        { name: "speed", label: "Speed", type: "number", placeholder: "e.g. 80" },
        { name: "unit", label: "Unit", type: "select", options: [{ label: "km / km/h", value: "km" }, { label: "miles / mph", value: "mi" }], defaultValue: "km" },
      ],
      calculate: (inputs) => {
        const d = inputs.distance as number;
        const s = inputs.speed as number;
        if (!d || !s) return null;
        const totalHours = d / s;
        const h = Math.floor(totalHours);
        const m = Math.round((totalHours - h) * 60);
        return {
          primary: { label: "Travel Time", value: `${h}h ${m}m` },
          details: [{ label: "Decimal hours", value: formatNumber(totalHours, 2) }],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "fuel-cost-calculator"],
  faq: [
    { question: "How do I calculate speed?", answer: "Speed = Distance / Time. For example, 150 km in 2.5 hours = 60 km/h." },
    { question: "How do I convert mph to km/h?", answer: "Multiply mph by 1.60934. For example, 60 mph = 96.6 km/h." },
  ],
  formula: "Speed = Distance / Time | Distance = Speed x Time | Time = Distance / Speed",
};
