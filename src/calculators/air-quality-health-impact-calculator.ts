import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airQualityHealthImpactCalculator: CalculatorDefinition = {
  slug: "air-quality-health-impact-calculator",
  title: "Air Quality Health Impact Calculator",
  description: "Assess the health impact of air pollution levels based on AQI, exposure duration, and activity level for respiratory risk awareness.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["air quality","aqi calculator","pollution health","respiratory risk","air pollution index"],
  variants: [{
    id: "standard",
    name: "Air Quality Health Impact",
    description: "Assess the health impact of air pollution levels based on AQI, exposure duration, and activity level for respiratory risk awareness.",
    fields: [
      { name: "aqi", label: "Air Quality Index (AQI)", type: "number", min: 0, max: 500, defaultValue: 75 },
      { name: "exposureHours", label: "Daily Outdoor Exposure (hours)", type: "number", min: 0, max: 24, defaultValue: 3 },
      { name: "activityLevel", label: "Activity Level", type: "select", options: [{ value: "1", label: "Light (walking)" }, { value: "2", label: "Moderate (jogging)" }, { value: "3", label: "Heavy (running/sports)" }], defaultValue: "1" },
      { name: "sensitive", label: "Sensitive Group", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes (asthma, elderly, children)" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
    const aqi = inputs.aqi as number;
    const exposureHours = inputs.exposureHours as number;
    const activityLevel = inputs.activityLevel as number;
    const sensitive = inputs.sensitive as number;
    const breathingMultiplier = [1, 2.5, 5][activityLevel - 1];
    const sensitiveMultiplier = sensitive === 1 ? 1.5 : 1;
    const effectiveDose = aqi * (exposureHours / 24) * breathingMultiplier * sensitiveMultiplier;
    let riskLevel = "Low";
    let recommendation = "Normal outdoor activity is safe";
    if (effectiveDose > 300) { riskLevel = "Very High"; recommendation = "Avoid all outdoor exertion"; }
    else if (effectiveDose > 150) { riskLevel = "High"; recommendation = "Reduce prolonged outdoor exertion"; }
    else if (effectiveDose > 75) { riskLevel = "Moderate"; recommendation = "Sensitive groups should limit outdoor exertion"; }
    else if (effectiveDose > 35) { riskLevel = "Low-Moderate"; recommendation = "Unusually sensitive people should reduce outdoor activity"; }
    const annualExposure = effectiveDose * 365;
    return {
      primary: { label: "Risk Level", value: riskLevel },
      details: [
        { label: "Effective Daily Dose", value: formatNumber(Math.round(effectiveDose)) + " AQI-hours" },
        { label: "Annualized Exposure", value: formatNumber(Math.round(annualExposure)) + " AQI-hours/year" },
        { label: "Breathing Rate Multiplier", value: formatNumber(breathingMultiplier) + "x" },
        { label: "Recommendation", value: recommendation }
      ]
    };
  },
  }],
  relatedSlugs: ["uv-protection-factor-calculator","heat-index-calculator","carbon-footprint-offset-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Effective Dose = AQI x (Hours / 24) x Activity Multiplier x Sensitivity Multiplier; Risk thresholds: Low (<35), Moderate (35-75), High (75-150), Very High (>150)",
};
