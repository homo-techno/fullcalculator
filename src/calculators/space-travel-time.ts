import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const spaceTravelTimeCalculator: CalculatorDefinition = {
  slug: "space-travel-time-calculator",
  title: "Space Travel Time Calculator",
  description: "Free space travel time calculator. Estimate how long it takes to travel between celestial bodies at a given speed.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["space travel time", "travel to mars", "interstellar travel", "space mission time"],
  variants: [
    {
      id: "travel-time",
      name: "Calculate Travel Time",
      fields: [
        { name: "distance", label: "Distance", type: "number", placeholder: "e.g. 225" },
        { name: "distUnit", label: "Distance Unit", type: "select", options: [
          { label: "Million km", value: "mkm" },
          { label: "AU", value: "au" },
          { label: "Light Years", value: "ly" },
        ] },
        { name: "speed", label: "Speed (km/s)", type: "number", placeholder: "e.g. 30" },
      ],
      calculate: (inputs) => {
        const dist = inputs.distance as number;
        const dU = inputs.distUnit as string;
        const speed = inputs.speed as number;
        if (!dist || !speed) return null;
        const toKm: Record<string, number> = { mkm: 1e6, au: 1.496e8, ly: 9.461e12 };
        const km = dist * (toKm[dU] || 1e6);
        const secs = km / speed;
        const hours = secs / 3600;
        const days = secs / 86400;
        const years = secs / 31557600;
        let display = "";
        if (years >= 1) display = `${formatNumber(years, 2)} years`;
        else if (days >= 1) display = `${formatNumber(days, 2)} days`;
        else display = `${formatNumber(hours, 2)} hours`;
        const cFraction = speed / 299792.458;
        return {
          primary: { label: "Travel Time", value: display },
          details: [
            { label: "Hours", value: formatNumber(hours, 2) },
            { label: "Days", value: formatNumber(days, 2) },
            { label: "Years", value: formatNumber(years, 4) },
            { label: "Speed (fraction of c)", value: formatNumber(cFraction, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["light-travel-calculator", "delta-v-calculator", "satellite-velocity-calculator"],
  faq: [
    { question: "How long to travel to Mars?", answer: "At 30 km/s it takes about 87 days to cover 225 million km (average Mars distance). Actual missions take 7-9 months due to orbital mechanics." },
    { question: "How long to reach the nearest star?", answer: "Proxima Centauri is 4.24 light years away. At 30 km/s it would take about 42,000 years." },
  ],
  formula: "time = distance / speed",
};
