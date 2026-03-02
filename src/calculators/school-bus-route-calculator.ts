import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const schoolBusRouteCalculator: CalculatorDefinition = {
  slug: "school-bus-route-calculator",
  title: "School Bus Route Calculator",
  description: "Estimate the bus route time based on stops and distance to school.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["school bus","route","time","distance","commute"],
  variants: [{
    id: "standard",
    name: "School Bus Route",
    description: "Estimate the bus route time based on stops and distance to school.",
    fields: [
      { name: "totalDistance", label: "Total Route Distance (miles)", type: "number", min: 1, max: 50, step: 0.5, defaultValue: 8 },
      { name: "numStops", label: "Number of Stops", type: "number", min: 1, max: 30, step: 1, defaultValue: 10 },
      { name: "avgStopTime", label: "Average Stop Time (minutes)", type: "number", min: 0.5, max: 5, step: 0.5, defaultValue: 1.5 },
      { name: "avgSpeed", label: "Average Speed (mph)", type: "number", min: 10, max: 40, step: 5, defaultValue: 25 },
    ],
    calculate: (inputs) => {
    const totalDistance = inputs.totalDistance as number;
    const numStops = inputs.numStops as number;
    const avgStopTime = inputs.avgStopTime as number;
    const avgSpeed = inputs.avgSpeed as number;
    const driveTime = (totalDistance / avgSpeed) * 60;
    const totalStopTime = numStops * avgStopTime;
    const totalRouteTime = driveTime + totalStopTime;
    return {
      primary: { label: "Total Route Time", value: formatNumber(totalRouteTime) + " minutes" },
      details: [
        { label: "Drive Time", value: formatNumber(driveTime) + " min" },
        { label: "Total Stop Time", value: formatNumber(totalStopTime) + " min" },
        { label: "Average Time Per Stop", value: formatNumber(avgStopTime) + " min" },
        { label: "Route Distance", value: formatNumber(totalDistance) + " miles" }
      ]
    };
  },
  }],
  relatedSlugs: ["field-trip-cost-calculator","classroom-size-calculator","study-hours-calculator"],
  faq: [
    { question: "How long is the average school bus ride?", answer: "The average school bus ride is 30 to 45 minutes each way in most districts." },
    { question: "How many stops does a school bus make?", answer: "A typical school bus route includes 8 to 15 stops depending on the area." },
  ],
  formula: "Total Time = (Distance / Speed x 60) + (Stops x Stop Time)",
};
