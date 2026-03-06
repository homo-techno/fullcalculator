import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sailingDistanceCalculator: CalculatorDefinition = {
  slug: "sailing-distance-calculator",
  title: "Sailing Distance Calculator",
  description: "Calculate sailing time and distance between waypoints based on boat speed, wind conditions, and current.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sailing distance","nautical distance","sailing time","boat trip planner"],
  variants: [{
    id: "standard",
    name: "Sailing Distance",
    description: "Calculate sailing time and distance between waypoints based on boat speed, wind conditions, and current.",
    fields: [
      { name: "distance", label: "Distance (nautical miles)", type: "number", min: 1, max: 5000, defaultValue: 120 },
      { name: "boatSpeed", label: "Hull Speed / Avg Speed (knots)", type: "number", min: 1, max: 30, defaultValue: 6 },
      { name: "currentKnots", label: "Current (knots, negative=against)", type: "number", min: -5, max: 5, defaultValue: 0.5 },
      { name: "windEffect", label: "Wind Effect on Speed (%)", type: "number", min: -50, max: 50, defaultValue: 10 },
      { name: "hoursPerDay", label: "Sailing Hours Per Day", type: "number", min: 4, max: 24, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const distance = inputs.distance as number;
    const boatSpeed = inputs.boatSpeed as number;
    const currentKnots = inputs.currentKnots as number;
    const windEffect = inputs.windEffect as number;
    const hoursPerDay = inputs.hoursPerDay as number;
    const effectiveSpeed = Math.max((boatSpeed * (1 + windEffect / 100)) + currentKnots, 0.5);
    const totalHours = distance / effectiveSpeed;
    const sailingDays = totalHours / hoursPerDay;
    const distStatute = distance * 1.15078;
    const distKm = distance * 1.852;
    return {
      primary: { label: "Total Sailing Time", value: formatNumber(Math.round(totalHours * 10) / 10) + " hours" },
      details: [
        { label: "Sailing Days", value: formatNumber(Math.round(sailingDays * 10) / 10) + " days" },
        { label: "Effective Speed", value: formatNumber(Math.round(effectiveSpeed * 10) / 10) + " knots" },
        { label: "Distance (statute miles)", value: formatNumber(Math.round(distStatute * 10) / 10) },
        { label: "Distance (km)", value: formatNumber(Math.round(distKm * 10) / 10) }
      ]
    };
  },
  }],
  relatedSlugs: ["boat-fuel-consumption-calculator","hull-speed-calculator","anchor-rode-calculator"],
  faq: [
    { question: "How fast does a sailboat travel?", answer: "Cruising sailboats average 5 to 8 knots. Racing sailboats can exceed 15 knots. A boat's hull speed in knots is approximately 1.34 times the square root of waterline length in feet." },
    { question: "How far can a sailboat travel in a day?", answer: "A typical cruising sailboat covers 100 to 150 nautical miles per day in favorable conditions, sailing for 20 to 24 hours." },
    { question: "How does current affect sailing time?", answer: "Favorable currents of 1 to 2 knots can significantly reduce travel time, while adverse currents can add hours or days to a passage." },
  ],
  formula: "Effective Speed = (Boat Speed x (1 + Wind Effect%)) + Current; Sailing Time = Distance / Effective Speed; Sailing Days = Total Hours / Hours Per Day",
};
