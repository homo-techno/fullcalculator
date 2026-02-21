import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const elevationGainCalculator: CalculatorDefinition = {
  slug: "elevation-gain-calculator",
  title: "Elevation Gain Calculator",
  description: "Free elevation gain calculator. Calculate total elevation gain, grade percentage, and equivalent flat distance for hiking, running, and cycling.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["elevation gain calculator", "grade calculator", "slope calculator hiking", "elevation change calculator", "incline calculator"],
  variants: [
    {
      id: "grade",
      name: "Grade / Slope",
      description: "Calculate grade percentage from elevation and distance",
      fields: [
        { name: "elevationGain", label: "Elevation Gain (feet)", type: "number", placeholder: "e.g. 1500" },
        { name: "horizontalDistance", label: "Horizontal Distance (miles)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const gain = inputs.elevationGain as number;
        const dist = inputs.horizontalDistance as number;
        if (!gain || !dist) return null;
        const distFt = dist * 5280;
        const gradePct = (gain / distFt) * 100;
        const angle = Math.atan(gain / distFt) * (180 / Math.PI);
        const trailDist = Math.sqrt(distFt * distFt + gain * gain);
        const trailMiles = trailDist / 5280;
        const gainMeters = gain * 0.3048;
        const distKm = dist * 1.609;
        // Naismith's rule: equivalent flat distance adds 1 mile per 2,000 ft gain
        const equivalentFlat = dist + (gain / 2000);
        return {
          primary: { label: "Average Grade", value: `${formatNumber(gradePct, 1)}%` },
          details: [
            { label: "Slope angle", value: `${formatNumber(angle, 1)}°` },
            { label: "Actual trail distance", value: `${formatNumber(trailMiles, 2)} miles` },
            { label: "Equivalent flat distance", value: `${formatNumber(equivalentFlat, 1)} miles` },
            { label: "Elevation gain", value: `${formatNumber(gain, 0)} ft (${formatNumber(gainMeters, 0)} m)` },
            { label: "Horizontal distance", value: `${formatNumber(dist, 2)} mi (${formatNumber(distKm, 1)} km)` },
          ],
          note: "Grades: 1-3% gentle, 5-8% moderate, 10-15% steep, 20%+ very steep. Naismith's rule: add 1 hour per 2,000 ft of climbing.",
        };
      },
    },
    {
      id: "calories",
      name: "Calories & Difficulty",
      description: "Estimate calories burned with elevation gain",
      fields: [
        { name: "distance", label: "Trail Distance (miles)", type: "number", placeholder: "e.g. 6" },
        { name: "elevationGain", label: "Total Elevation Gain (feet)", type: "number", placeholder: "e.g. 2000" },
        { name: "weight", label: "Your Weight (lbs)", type: "number", placeholder: "e.g. 170" },
        { name: "packWeight", label: "Pack Weight (lbs)", type: "number", placeholder: "e.g. 15", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const dist = inputs.distance as number;
        const gain = inputs.elevationGain as number;
        const weight = inputs.weight as number;
        const pack = (inputs.packWeight as number) || 0;
        if (!dist || !gain || !weight) return null;
        const totalWeight = weight + pack;
        const totalWeightKg = totalWeight * 0.4536;
        // Base: ~100 cal/mile for 150lb person flat + extra for elevation
        const baseCals = dist * (totalWeight / 150) * 100;
        const climbCals = (gain / 1000) * totalWeightKg * 7; // ~7 cal/kg per 1000 ft gain
        const totalCals = baseCals + climbCals;
        const gainPerMile = gain / dist;
        let difficulty = "Easy";
        if (gainPerMile > 1000) difficulty = "Very Strenuous";
        else if (gainPerMile > 500) difficulty = "Strenuous";
        else if (gainPerMile > 250) difficulty = "Moderate";
        else if (gainPerMile > 100) difficulty = "Easy-Moderate";
        // Estimated time using Naismith's rule
        const timeHours = (dist / 3) + (gain / 2000);
        return {
          primary: { label: "Estimated Calories Burned", value: `${formatNumber(totalCals, 0)} cal` },
          details: [
            { label: "Difficulty rating", value: difficulty },
            { label: "Gain per mile", value: `${formatNumber(gainPerMile, 0)} ft/mile` },
            { label: "Estimated time", value: `${formatNumber(timeHours, 1)} hours` },
            { label: "Calories from hiking", value: formatNumber(baseCals, 0) },
            { label: "Extra calories from climbing", value: formatNumber(climbCals, 0) },
            { label: "Total weight carried", value: `${totalWeight} lbs` },
          ],
        };
      },
    },
    {
      id: "metric",
      name: "Metric Units",
      description: "Calculate grade using meters and kilometers",
      fields: [
        { name: "elevationGain", label: "Elevation Gain (meters)", type: "number", placeholder: "e.g. 500" },
        { name: "horizontalDistance", label: "Horizontal Distance (km)", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const gain = inputs.elevationGain as number;
        const dist = inputs.horizontalDistance as number;
        if (!gain || !dist) return null;
        const distM = dist * 1000;
        const gradePct = (gain / distM) * 100;
        const angle = Math.atan(gain / distM) * (180 / Math.PI);
        const trailDist = Math.sqrt(distM * distM + gain * gain);
        const gainFt = gain / 0.3048;
        return {
          primary: { label: "Average Grade", value: `${formatNumber(gradePct, 1)}%` },
          details: [
            { label: "Slope angle", value: `${formatNumber(angle, 1)}°` },
            { label: "Actual trail distance", value: `${formatNumber(trailDist / 1000, 2)} km` },
            { label: "Elevation gain", value: `${formatNumber(gain, 0)} m (${formatNumber(gainFt, 0)} ft)` },
            { label: "Horizontal distance", value: `${formatNumber(dist, 2)} km` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["trail-distance-calculator", "pace-calculator", "calorie-calculator"],
  faq: [
    { question: "What is a steep grade for hiking?", answer: "Hiking grades: 1-3% is gentle/flat, 5-8% is moderate (comfortable uphill), 10-15% is steep (you will feel it), 20%+ is very steep (may require scrambling). Most maintained trails average 5-15% grade." },
    { question: "How does elevation gain affect difficulty?", answer: "Elevation gain is the primary factor in hiking difficulty. Under 100 ft/mile is flat, 100-250 ft/mile is moderate, 250-500 ft/mile is strenuous, and over 500 ft/mile is very strenuous. For reference, 2,000 ft of climbing adds roughly 1 hour to a hike." },
    { question: "How many extra calories does climbing burn?", answer: "Climbing burns roughly 300-500 additional calories per 1,000 feet of elevation gain for a 150 lb person. This is on top of the approximately 100 calories per mile burned from flat hiking." },
  ],
  formula: "Grade (%) = (Elevation Gain / Horizontal Distance) × 100 | Trail Distance = √(horizontal² + vertical²)",
};
