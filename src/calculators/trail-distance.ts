import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const trailDistanceCalculator: CalculatorDefinition = {
  slug: "trail-distance-calculator",
  title: "Trail Distance & Time Calculator",
  description: "Free trail distance and time calculator. Estimate hiking time using Naismith's Rule based on distance, elevation gain, and fitness level.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["trail distance calculator", "hiking time calculator", "Naismith rule calculator", "how long does a hike take", "hiking pace calculator"],
  variants: [
    {
      id: "time",
      name: "Estimate Hiking Time",
      description: "Calculate how long a hike will take",
      fields: [
        { name: "distance", label: "Trail Distance (miles)", type: "number", placeholder: "e.g. 8", step: 0.5 },
        { name: "elevationGain", label: "Total Elevation Gain (feet)", type: "number", placeholder: "e.g. 2500" },
        { name: "elevationLoss", label: "Total Elevation Loss (feet)", type: "number", placeholder: "e.g. 2500", defaultValue: 0 },
        { name: "fitness", label: "Fitness Level", type: "select", options: [
          { label: "Beginner (2 mph)", value: "beginner" },
          { label: "Average (2.5 mph)", value: "average" },
          { label: "Fit (3 mph)", value: "fit" },
          { label: "Very Fit/Trail Runner (4 mph)", value: "very-fit" },
        ], defaultValue: "average" },
        { name: "terrain", label: "Trail Conditions", type: "select", options: [
          { label: "Well-maintained/Paved", value: "easy" },
          { label: "Standard Trail", value: "standard" },
          { label: "Rocky/Root-covered", value: "rough" },
          { label: "Off-trail/Scrambling", value: "off-trail" },
        ], defaultValue: "standard" },
      ],
      calculate: (inputs) => {
        const distance = inputs.distance as number;
        const gain = (inputs.elevationGain as number) || 0;
        const loss = (inputs.elevationLoss as number) || 0;
        const fitness = inputs.fitness as string;
        const terrain = inputs.terrain as string;
        if (!distance) return null;
        const paceMap: Record<string, number> = { beginner: 2, average: 2.5, fit: 3, "very-fit": 4 };
        const terrainFactor: Record<string, number> = { easy: 0.9, standard: 1.0, rough: 1.3, "off-trail": 1.6 };
        const pace = paceMap[fitness] || 2.5;
        const tf = terrainFactor[terrain] || 1.0;
        // Naismith's Rule: 3 mph + 1 hr per 2000 ft gain, adjusted for fitness
        const flatTime = (distance / pace) * tf;
        const climbTime = gain / 2000; // 1 hour per 2000 ft gain
        const descentTime = loss > gain ? (loss - gain) / 3000 * 0.5 : 0; // steep descent slows you down
        const totalHours = flatTime + climbTime + descentTime;
        const breakTime = totalHours > 3 ? 0.5 : totalHours > 1.5 ? 0.25 : 0;
        const totalWithBreaks = totalHours + breakTime;
        const hours = Math.floor(totalWithBreaks);
        const minutes = Math.round((totalWithBreaks - hours) * 60);
        return {
          primary: { label: "Estimated Time", value: `${hours}h ${minutes}m` },
          details: [
            { label: "Moving time", value: `${Math.floor(totalHours)}h ${Math.round((totalHours - Math.floor(totalHours)) * 60)}m` },
            { label: "Break time", value: `${formatNumber(breakTime * 60, 0)} min` },
            { label: "Pace (flat)", value: `${pace} mph` },
            { label: "Avg pace (overall)", value: `${formatNumber(distance / totalHours, 1)} mph` },
            { label: "Distance", value: `${distance} miles` },
            { label: "Elevation gain", value: `${formatNumber(gain, 0)} ft` },
          ],
        };
      },
    },
    {
      id: "metric",
      name: "Metric Units",
      description: "Calculate hiking time in km and meters",
      fields: [
        { name: "distance", label: "Trail Distance (km)", type: "number", placeholder: "e.g. 12", step: 0.5 },
        { name: "elevationGain", label: "Total Elevation Gain (m)", type: "number", placeholder: "e.g. 800" },
        { name: "fitness", label: "Fitness Level", type: "select", options: [
          { label: "Beginner (3 km/h)", value: "beginner" },
          { label: "Average (4 km/h)", value: "average" },
          { label: "Fit (5 km/h)", value: "fit" },
          { label: "Very Fit (6.5 km/h)", value: "very-fit" },
        ], defaultValue: "average" },
      ],
      calculate: (inputs) => {
        const distance = inputs.distance as number;
        const gain = (inputs.elevationGain as number) || 0;
        const fitness = inputs.fitness as string;
        if (!distance) return null;
        const paceMap: Record<string, number> = { beginner: 3, average: 4, fit: 5, "very-fit": 6.5 };
        const pace = paceMap[fitness] || 4;
        const flatTime = distance / pace;
        const climbTime = gain / 600; // Naismith: 1 hr per 600m gain
        const totalHours = flatTime + climbTime;
        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);
        const distMiles = distance * 0.6214;
        const gainFt = gain * 3.281;
        return {
          primary: { label: "Estimated Time", value: `${hours}h ${minutes}m` },
          details: [
            { label: "Flat pace", value: `${pace} km/h` },
            { label: "Overall pace", value: `${formatNumber(distance / totalHours, 1)} km/h` },
            { label: "Distance", value: `${distance} km (${formatNumber(distMiles, 1)} mi)` },
            { label: "Elevation gain", value: `${gain} m (${formatNumber(gainFt, 0)} ft)` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["elevation-gain-calculator", "pace-calculator", "calorie-calculator"],
  faq: [
    { question: "How long does a 10-mile hike take?", answer: "A 10-mile hike with 2,000 ft of elevation gain takes an average hiker about 5-6 hours of moving time. Add 30 minutes for breaks. Fit hikers may complete it in 4 hours, while beginners may need 7-8 hours." },
    { question: "What is Naismith's Rule?", answer: "Naismith's Rule estimates hiking time as 1 hour per 3 miles (5 km) of horizontal distance plus 1 hour per 2,000 feet (600 m) of elevation gain. It was developed by Scottish mountaineer William Naismith in 1892 and remains widely used." },
    { question: "How does terrain affect hiking speed?", answer: "Terrain significantly affects speed: well-maintained trails allow near-full pace, rocky terrain reduces speed by 20-30%, and off-trail bushwhacking can reduce speed by 40-60%. Mud, snow, and loose rock add even more time." },
  ],
  formula: "Naismith's Rule: Time (hrs) = Distance (mi) / 3 + Elevation Gain (ft) / 2,000 | Metric: Time = km / 5 + meters / 600",
};
