import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lightTravelCalculator: CalculatorDefinition = {
  slug: "light-travel-calculator",
  title: "Light Travel Time Calculator",
  description: "Free light travel time calculator. Calculate how long it takes light to travel a given distance.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["light travel time", "speed of light", "light distance", "light delay"],
  variants: [
    {
      id: "time",
      name: "Calculate Light Travel Time",
      fields: [
        { name: "distance", label: "Distance", type: "number", placeholder: "e.g. 150" },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Kilometers", value: "km" },
          { label: "AU", value: "au" },
          { label: "Light Years", value: "ly" },
          { label: "Parsecs", value: "pc" },
          { label: "Megaparsecs", value: "mpc" },
        ] },
      ],
      calculate: (inputs) => {
        const dist = inputs.distance as number;
        const unit = inputs.unit as string;
        if (!dist) return null;
        const toKm: Record<string, number> = { km: 1, au: 1.496e8, ly: 9.461e12, pc: 3.0857e13, mpc: 3.0857e19 };
        const km = dist * (toKm[unit] || 1);
        const c = 299792.458;
        const secs = km / c;
        const mins = secs / 60;
        const hrs = secs / 3600;
        const days = secs / 86400;
        const years = secs / 31557600;
        let display = "";
        if (years >= 1) display = `${formatNumber(years, 4)} years`;
        else if (days >= 1) display = `${formatNumber(days, 4)} days`;
        else if (hrs >= 1) display = `${formatNumber(hrs, 4)} hours`;
        else if (mins >= 1) display = `${formatNumber(mins, 4)} minutes`;
        else display = `${formatNumber(secs, 4)} seconds`;
        return {
          primary: { label: "Light Travel Time", value: display },
          details: [
            { label: "Seconds", value: formatNumber(secs, 4) },
            { label: "Minutes", value: formatNumber(mins, 4) },
            { label: "Hours", value: formatNumber(hrs, 4) },
            { label: "Years", value: formatNumber(years, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["parsec-converter-calculator", "space-travel-time-calculator", "cosmic-distance-calculator"],
  faq: [
    { question: "How fast does light travel?", answer: "Light travels at 299,792.458 km/s in vacuum. It takes about 8.3 minutes to reach Earth from the Sun." },
    { question: "How long does light take from the nearest star?", answer: "Proxima Centauri is 4.24 light years away, so its light takes 4.24 years to reach us." },
  ],
  formula: "time = distance / speed_of_light",
};
