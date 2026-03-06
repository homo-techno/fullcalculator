import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heatIndexActivityCalculator: CalculatorDefinition = {
  slug: "heat-index-activity-calculator",
  title: "Heat Index Activity Calculator",
  description: "Calculate the heat index with activity-specific safety guidelines including hydration needs, rest intervals, and heat illness risk levels.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["heat index activity","heat safety","heat illness prevention","hydration calculator","heat stress"],
  variants: [{
    id: "standard",
    name: "Heat Index Activity",
    description: "Calculate the heat index with activity-specific safety guidelines including hydration needs, rest intervals, and heat illness risk levels.",
    fields: [
      { name: "temperature", label: "Temperature (°F)", type: "number", min: 75, max: 130, defaultValue: 92 },
      { name: "humidity", label: "Relative Humidity (%)", type: "number", min: 10, max: 100, defaultValue: 60 },
      { name: "activityType", label: "Activity Type", type: "select", options: [{ value: "1", label: "Sedentary / Office" }, { value: "2", label: "Light Exercise" }, { value: "3", label: "Moderate Exercise" }, { value: "4", label: "Heavy Labor / Sports" }], defaultValue: "3" },
      { name: "duration", label: "Activity Duration (minutes)", type: "number", min: 10, max: 480, defaultValue: 60 },
    ],
    calculate: (inputs) => {
    const temperature = inputs.temperature as number;
    const humidity = inputs.humidity as number;
    const activityType = inputs.activityType as number;
    const duration = inputs.duration as number;
    const T = temperature;
    const R = humidity;
    const HI = -42.379 + 2.04901523 * T + 10.14333127 * R - 0.22475541 * T * R - 0.00683783 * T * T - 0.05481717 * R * R + 0.00122874 * T * T * R + 0.00085282 * T * R * R - 0.00000199 * T * T * R * R;
    const activityMultiplier = [1, 1.2, 1.5, 2.0][activityType - 1];
    const effectiveHI = HI * activityMultiplier;
    let riskLevel = "Low";
    let hydrationOzPerHour = 8;
    let restInterval = "No additional rest needed";
    if (effectiveHI >= 175) { riskLevel = "Extreme Danger - Cancel activity"; hydrationOzPerHour = 48; restInterval = "Do not continue"; }
    else if (effectiveHI >= 145) { riskLevel = "Danger"; hydrationOzPerHour = 32; restInterval = "10 min rest every 20 min"; }
    else if (effectiveHI >= 120) { riskLevel = "Extreme Caution"; hydrationOzPerHour = 24; restInterval = "10 min rest every 30 min"; }
    else if (effectiveHI >= 100) { riskLevel = "Caution"; hydrationOzPerHour = 16; restInterval = "5 min rest every 30 min"; }
    const totalHydration = (hydrationOzPerHour * duration) / 60;
    return {
      primary: { label: "Heat Index", value: formatNumber(Math.round(HI)) + " °F" },
      details: [
        { label: "Activity-Adjusted Index", value: formatNumber(Math.round(effectiveHI)) + " °F equivalent" },
        { label: "Risk Level", value: riskLevel },
        { label: "Hydration Needed", value: formatNumber(hydrationOzPerHour) + " oz/hour" },
        { label: "Total Hydration for Session", value: formatNumber(Math.round(totalHydration)) + " oz" },
        { label: "Rest Interval", value: restInterval }
      ]
    };
  },
  }],
  relatedSlugs: ["heat-index-calculator","uv-protection-factor-calculator","wind-chill-extended-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Heat Index = -42.379 + 2.049T + 10.143R - 0.225TR - ... (Rothfusz regression); Effective HI = HI x Activity Multiplier; Hydration varies by risk level: 8-48 oz/hour",
};
