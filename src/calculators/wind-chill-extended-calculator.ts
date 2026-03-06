import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const windChillExtendedCalculator: CalculatorDefinition = {
  slug: "wind-chill-extended-calculator",
  title: "Wind Chill Extended Calculator",
  description: "Calculate wind chill temperature with frostbite risk assessment and exposure time limits for cold weather safety planning.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["wind chill extended","frostbite risk","cold exposure","hypothermia risk","windchill frostbite time"],
  variants: [{
    id: "standard",
    name: "Wind Chill Extended",
    description: "Calculate wind chill temperature with frostbite risk assessment and exposure time limits for cold weather safety planning.",
    fields: [
      { name: "airTemp", label: "Air Temperature (°F)", type: "number", min: -60, max: 50, defaultValue: 10 },
      { name: "windSpeed", label: "Wind Speed (mph)", type: "number", min: 3, max: 80, defaultValue: 25 },
      { name: "exposureMinutes", label: "Exposure Duration (minutes)", type: "number", min: 1, max: 480, defaultValue: 30 },
      { name: "skinCovered", label: "Skin Coverage", type: "select", options: [{ value: "1", label: "Face & hands exposed" }, { value: "2", label: "Only face exposed" }, { value: "3", label: "Fully covered" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const airTemp = inputs.airTemp as number;
    const windSpeed = inputs.windSpeed as number;
    const exposureMinutes = inputs.exposureMinutes as number;
    const skinCovered = inputs.skinCovered as number;
    const windChill = 35.74 + 0.6215 * airTemp - 35.75 * Math.pow(windSpeed, 0.16) + 0.4275 * airTemp * Math.pow(windSpeed, 0.16);
    const effectiveWC = Math.round(windChill);
    let frostbiteTime = "No immediate risk";
    if (effectiveWC <= -60) frostbiteTime = "Under 5 minutes";
    else if (effectiveWC <= -40) frostbiteTime = "5-10 minutes";
    else if (effectiveWC <= -20) frostbiteTime = "10-30 minutes";
    else if (effectiveWC <= 0) frostbiteTime = "30-60 minutes";
    const coverageMultiplier = [1, 1.5, 3][skinCovered - 1];
    const safeExposureBase = effectiveWC <= -40 ? 5 : effectiveWC <= -20 ? 15 : effectiveWC <= 0 ? 30 : effectiveWC <= 20 ? 60 : 120;
    const safeExposure = Math.round(safeExposureBase * coverageMultiplier);
    const exposureRisk = exposureMinutes > safeExposure ? "Exceeds safe limit" : "Within safe range";
    let dangerLevel = "Low";
    if (effectiveWC <= -40) dangerLevel = "Extreme Danger";
    else if (effectiveWC <= -20) dangerLevel = "High Danger";
    else if (effectiveWC <= 0) dangerLevel = "Moderate Danger";
    else if (effectiveWC <= 20) dangerLevel = "Low Danger";
    return {
      primary: { label: "Wind Chill Temperature", value: formatNumber(effectiveWC) + " °F" },
      details: [
        { label: "Danger Level", value: dangerLevel },
        { label: "Frostbite Risk", value: frostbiteTime },
        { label: "Safe Exposure Time", value: formatNumber(safeExposure) + " min" },
        { label: "Your Exposure", value: exposureRisk + " (" + formatNumber(exposureMinutes) + " min)" },
        { label: "Actual Air Temperature", value: formatNumber(airTemp) + " °F" }
      ]
    };
  },
  }],
  relatedSlugs: ["wind-chill-calculator","heat-index-calculator","frost-depth-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Wind Chill = 35.74 + 0.6215T - 35.75V^0.16 + 0.4275TV^0.16; Safe Exposure = Base Time x Coverage Multiplier; Frostbite risk increases rapidly below -20°F wind chill",
};
