import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const beaufortData = [
  { force: 0, name: "Calm", mphMin: 0, mphMax: 1, sea: "Flat, mirror-like", land: "Smoke rises vertically" },
  { force: 1, name: "Light Air", mphMin: 1, mphMax: 3, sea: "Ripples without crests", land: "Smoke drifts slowly" },
  { force: 2, name: "Light Breeze", mphMin: 4, mphMax: 7, sea: "Small wavelets, crests don't break", land: "Wind felt on face, leaves rustle" },
  { force: 3, name: "Gentle Breeze", mphMin: 8, mphMax: 12, sea: "Large wavelets, crests begin to break", land: "Leaves and small twigs in constant motion" },
  { force: 4, name: "Moderate Breeze", mphMin: 13, mphMax: 18, sea: "Small waves with frequent whitecaps", land: "Dust and loose paper raised, small branches move" },
  { force: 5, name: "Fresh Breeze", mphMin: 19, mphMax: 24, sea: "Moderate waves, many whitecaps", land: "Small trees begin to sway" },
  { force: 6, name: "Strong Breeze", mphMin: 25, mphMax: 31, sea: "Large waves, whitecaps everywhere, spray", land: "Large branches in motion, whistling in wires" },
  { force: 7, name: "Near Gale", mphMin: 32, mphMax: 38, sea: "Sea heaps up, white foam streaks", land: "Whole trees in motion, inconvenience walking" },
  { force: 8, name: "Gale", mphMin: 39, mphMax: 46, sea: "Moderately high waves, foam blown in streaks", land: "Twigs break off trees, difficulty walking" },
  { force: 9, name: "Strong Gale", mphMin: 47, mphMax: 54, sea: "High waves, dense foam, spray reduces visibility", land: "Slight structural damage, chimney pots removed" },
  { force: 10, name: "Storm", mphMin: 55, mphMax: 63, sea: "Very high waves with overhanging crests", land: "Trees uprooted, considerable structural damage" },
  { force: 11, name: "Violent Storm", mphMin: 64, mphMax: 72, sea: "Exceptionally high waves, sea covered with foam", land: "Widespread damage" },
  { force: 12, name: "Hurricane Force", mphMin: 73, mphMax: 999, sea: "Air filled with foam and spray, sea white", land: "Devastating damage" },
];

export const beaufortScaleCalculator: CalculatorDefinition = {
  slug: "beaufort-scale-calculator",
  title: "Beaufort Scale Calculator",
  description: "Free Beaufort wind scale calculator. Convert wind speed to Beaufort force number with sea and land condition descriptions.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["beaufort scale calculator", "beaufort wind scale", "wind speed scale", "wind force calculator", "beaufort number"],
  variants: [
    {
      id: "calc",
      name: "Wind Speed to Beaufort",
      fields: [
        { name: "speed", label: "Wind Speed", type: "number", placeholder: "e.g. 25", step: 0.1 },
        { name: "unit", label: "Speed Unit", type: "select", options: [
          { label: "mph", value: "mph" },
          { label: "km/h", value: "kmh" },
          { label: "knots", value: "knots" },
          { label: "m/s", value: "ms" },
        ], defaultValue: "mph" },
      ],
      calculate: (inputs) => {
        const speed = inputs.speed as number;
        const unit = inputs.unit as string;
        if (speed === undefined || speed === null || speed < 0) return null;

        // Convert to mph
        let mph: number;
        if (unit === "mph") mph = speed;
        else if (unit === "kmh") mph = speed * 0.621371;
        else if (unit === "knots") mph = speed * 1.15078;
        else mph = speed * 2.23694; // m/s

        // Find Beaufort force
        let entry = beaufortData[0];
        for (const b of beaufortData) {
          if (mph >= b.mphMin) entry = b;
        }

        const kmh = mph * 1.60934;
        const knots = mph * 0.868976;
        const ms = mph * 0.44704;

        return {
          primary: { label: "Beaufort Force", value: `${entry.force} — ${entry.name}` },
          details: [
            { label: "Wind Speed (mph)", value: formatNumber(mph, 1) },
            { label: "Wind Speed (km/h)", value: formatNumber(kmh, 1) },
            { label: "Wind Speed (knots)", value: formatNumber(knots, 1) },
            { label: "Wind Speed (m/s)", value: formatNumber(ms, 1) },
            { label: "Sea Conditions", value: entry.sea },
            { label: "Land Conditions", value: entry.land },
            { label: "Speed Range (mph)", value: entry.force < 12 ? `${entry.mphMin}–${entry.mphMax} mph` : `${entry.mphMin}+ mph` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["speed-converter", "uv-index-calculator", "humidity-calculator"],
  faq: [
    { question: "What is the Beaufort scale?", answer: "The Beaufort scale is an empirical measure relating wind speed to observed conditions at sea and on land. It ranges from 0 (calm) to 12 (hurricane force). It was developed by Sir Francis Beaufort in 1805." },
    { question: "What Beaufort force is dangerous?", answer: "Force 7 (near gale, 32–38 mph) and above is generally dangerous for small craft. Force 10+ (storm, 55+ mph) is dangerous for all vessels and can cause significant structural damage on land." },
    { question: "How do you convert between wind speed units?", answer: "1 knot = 1.151 mph = 1.852 km/h = 0.514 m/s. 1 mph = 0.869 knots = 1.609 km/h = 0.447 m/s." },
  ],
  formula: "Beaufort Force 0–12 mapped to wind speed ranges in mph, km/h, knots, or m/s",
};
