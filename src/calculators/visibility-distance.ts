import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const visibilityDistanceCalculator: CalculatorDefinition = {
  slug: "visibility-distance-calculator",
  title: "Visibility Distance Calculator",
  description: "Free visibility and horizon distance calculator. Calculate how far you can see based on elevation, Earth's curvature, and atmospheric conditions.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["visibility distance calculator", "horizon distance calculator", "how far can I see", "line of sight calculator", "horizon calculator"],
  variants: [
    {
      id: "horizon",
      name: "Distance to Horizon",
      description: "Calculate how far you can see from a given height",
      fields: [
        { name: "height", label: "Observer Height Above Sea Level (feet)", type: "number", placeholder: "e.g. 6" },
        { name: "unit", label: "Height Unit", type: "select", options: [
          { label: "Feet", value: "feet" },
          { label: "Meters", value: "meters" },
        ], defaultValue: "feet" },
      ],
      calculate: (inputs) => {
        const height = inputs.height as number;
        const unit = inputs.unit as string;
        if (!height) return null;
        const heightFt = unit === "meters" ? height * 3.281 : height;
        const heightM = unit === "meters" ? height : height * 0.3048;
        // Distance to horizon: d (miles) = sqrt(1.5 × h (ft)) approximately
        // More precise: d = sqrt(2 × R × h + h²), R = 3959 miles
        const R = 3959; // Earth radius in miles
        const hMiles = heightFt / 5280;
        const distMiles = Math.sqrt(2 * R * hMiles + hMiles * hMiles);
        const distKm = distMiles * 1.609;
        const distNM = distMiles * 0.869;
        // Refraction correction (standard atmosphere, ~8% increase)
        const distMilesRefracted = distMiles * 1.08;
        return {
          primary: { label: "Distance to Horizon", value: `${formatNumber(distMiles, 1)} miles` },
          details: [
            { label: "With atmospheric refraction", value: `${formatNumber(distMilesRefracted, 1)} miles` },
            { label: "Kilometers", value: formatNumber(distKm, 1) },
            { label: "Nautical miles", value: formatNumber(distNM, 1) },
            { label: "Observer height", value: `${formatNumber(heightFt, 0)} ft (${formatNumber(heightM, 1)} m)` },
          ],
          note: "Standard atmospheric refraction extends visibility about 8% beyond the geometric horizon. Actual visibility also depends on weather, haze, and air quality.",
        };
      },
    },
    {
      id: "two-objects",
      name: "Line of Sight (Two Heights)",
      description: "Can two elevated points see each other?",
      fields: [
        { name: "height1", label: "Observer Height (feet)", type: "number", placeholder: "e.g. 6" },
        { name: "height2", label: "Target Height (feet)", type: "number", placeholder: "e.g. 100" },
        { name: "distance", label: "Distance Between (miles)", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const h1 = inputs.height1 as number;
        const h2 = inputs.height2 as number;
        const dist = inputs.distance as number;
        if (!h1 || !h2 || !dist) return null;
        const R = 3959;
        const h1miles = h1 / 5280;
        const h2miles = h2 / 5280;
        const d1 = Math.sqrt(2 * R * h1miles);
        const d2 = Math.sqrt(2 * R * h2miles);
        const maxDist = d1 + d2;
        const maxDistRefracted = maxDist * 1.08;
        const canSee = dist <= maxDistRefracted;
        const margin = maxDistRefracted - dist;
        return {
          primary: { label: "Line of Sight", value: canSee ? "Yes - Visible" : "No - Below Horizon" },
          details: [
            { label: "Maximum sight distance", value: `${formatNumber(maxDistRefracted, 1)} miles` },
            { label: "Actual distance", value: `${formatNumber(dist, 1)} miles` },
            { label: "Margin", value: canSee ? `${formatNumber(margin, 1)} miles to spare` : `${formatNumber(-margin, 1)} miles below horizon` },
            { label: "Observer horizon", value: `${formatNumber(d1 * 1.08, 1)} miles` },
            { label: "Target horizon", value: `${formatNumber(d2 * 1.08, 1)} miles` },
          ],
          note: "This calculation assumes flat terrain between points. Mountains, buildings, and trees can block line of sight even if curvature allows it.",
        };
      },
    },
    {
      id: "common-heights",
      name: "Common Viewpoints",
      description: "Horizon distance from common elevations",
      fields: [
        { name: "viewpoint", label: "Viewpoint", type: "select", options: [
          { label: "Standing at beach (6 ft)", value: "6" },
          { label: "2nd floor window (20 ft)", value: "20" },
          { label: "Ship bridge (50 ft)", value: "50" },
          { label: "Lighthouse (100 ft)", value: "100" },
          { label: "Hill/Bluff (500 ft)", value: "500" },
          { label: "Mountain summit (5,000 ft)", value: "5000" },
          { label: "High mountain (14,000 ft)", value: "14000" },
          { label: "Commercial airplane (35,000 ft)", value: "35000" },
        ] },
      ],
      calculate: (inputs) => {
        const heightStr = inputs.viewpoint as string;
        if (!heightStr) return null;
        const heightFt = parseFloat(heightStr);
        const R = 3959;
        const hMiles = heightFt / 5280;
        const distMiles = Math.sqrt(2 * R * hMiles) * 1.08;
        const distKm = distMiles * 1.609;
        const areaSqMiles = Math.PI * distMiles * distMiles;
        return {
          primary: { label: "Distance to Horizon", value: `${formatNumber(distMiles, 1)} miles (${formatNumber(distKm, 0)} km)` },
          details: [
            { label: "Height", value: `${formatNumber(heightFt, 0)} feet` },
            { label: "Visible area", value: `${formatNumber(areaSqMiles, 0)} sq miles` },
            { label: "Earth % visible", value: `${formatNumber(areaSqMiles / (4 * Math.PI * R * R) * 100, 4)}%` },
          ],
          note: "From standing height at the beach, the horizon is about 3 miles away. From a commercial airplane, you can see about 230 miles in every direction.",
        };
      },
    },
  ],
  relatedSlugs: ["elevation-gain-calculator", "trail-distance-calculator", "tree-height-calculator"],
  faq: [
    { question: "How far can you see from sea level?", answer: "Standing at the beach with your eyes about 6 feet above sea level, the geometric horizon is about 3 miles away. With atmospheric refraction, it extends to about 3.2 miles. From a ship's bridge at 50 feet, you can see about 8.6 miles." },
    { question: "How far can you see from a mountain?", answer: "From a 5,000-foot summit, you can see about 86 miles to the horizon. From a 14,000-foot peak (like Colorado 14ers), the horizon is about 145 miles. From Mt. Everest (29,032 ft), the theoretical horizon is about 210 miles." },
    { question: "What affects actual visibility?", answer: "Besides Earth's curvature, visibility is limited by: atmospheric haze and humidity (typical clear day visibility is 20-40 miles), air pollution, rain/fog, dust, and the contrast/size of the target. Mountain peaks can sometimes be spotted beyond 200 miles in exceptionally clear conditions." },
  ],
  formula: "d (miles) = √(2Rh) × 1.08 refraction correction | R = 3,959 miles (Earth radius) | h in miles = feet / 5,280",
};
