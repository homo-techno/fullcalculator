import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const evapotranspirationRateCalculator: CalculatorDefinition = {
  slug: "evapotranspiration-rate-calculator",
  title: "Evapotranspiration Rate Calculator",
  description: "Estimate daily evapotranspiration rate for irrigation planning using temperature, humidity, wind speed, and solar radiation data.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["evapotranspiration","ET rate","irrigation water loss","crop water use","water evaporation rate"],
  variants: [{
    id: "standard",
    name: "Evapotranspiration Rate",
    description: "Estimate daily evapotranspiration rate for irrigation planning using temperature, humidity, wind speed, and solar radiation data.",
    fields: [
      { name: "avgTemp", label: "Average Temperature (°F)", type: "number", min: 32, max: 120, defaultValue: 75 },
      { name: "humidity", label: "Relative Humidity (%)", type: "number", min: 5, max: 100, defaultValue: 50 },
      { name: "windSpeed", label: "Wind Speed (mph)", type: "number", min: 0, max: 40, defaultValue: 8 },
      { name: "solarHours", label: "Daily Sunshine Hours", type: "number", min: 0, max: 16, defaultValue: 10 },
      { name: "cropCoeff", label: "Crop Coefficient (Kc)", type: "number", min: 0.2, max: 1.5, defaultValue: 1.0 },
    ],
    calculate: (inputs) => {
    const avgTemp = inputs.avgTemp as number;
    const humidity = inputs.humidity as number;
    const windSpeed = inputs.windSpeed as number;
    const solarHours = inputs.solarHours as number;
    const cropCoeff = inputs.cropCoeff as number;
    const tempC = (avgTemp - 32) * 5 / 9;
    const satVaporPressure = 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3));
    const actualVaporPressure = satVaporPressure * (humidity / 100);
    const vaporDeficit = satVaporPressure - actualVaporPressure;
    const solarRadiation = solarHours * 2.5;
    const windMs = windSpeed * 0.447;
    const etRef = (0.408 * solarRadiation + 0.063 * (tempC + 273) * windMs * vaporDeficit) / (1 + 0.34 * windMs);
    const etCrop = etRef * cropCoeff;
    const inchesPerDay = etCrop / 25.4;
    const weeklyInches = inchesPerDay * 7;
    const monthlyGallonsPer1000sqft = inchesPerDay * 30 * 623;
    return {
      primary: { label: "Daily ET Rate", value: formatNumber(Math.round(inchesPerDay * 100) / 100) + " inches/day" },
      details: [
        { label: "Reference ET (ETo)", value: formatNumber(Math.round(etRef * 100) / 100) + " mm/day" },
        { label: "Crop ET (ETc)", value: formatNumber(Math.round(etCrop * 100) / 100) + " mm/day" },
        { label: "Weekly Water Need", value: formatNumber(Math.round(weeklyInches * 100) / 100) + " inches" },
        { label: "Monthly per 1000 sq ft", value: formatNumber(Math.round(monthlyGallonsPer1000sqft)) + " gallons" },
        { label: "Vapor Pressure Deficit", value: formatNumber(Math.round(vaporDeficit * 100) / 100) + " kPa" }
      ]
    };
  },
  }],
  relatedSlugs: ["growing-degree-days-calculator","drought-severity-index-calculator","rainfall-collection-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "ETo = (0.408 x Solar Radiation + 0.063 x (Temp+273) x Wind x VPD) / (1 + 0.34 x Wind)
ETc = ETo x Crop Coefficient
VPD = Saturation VP - Actual VP",
};
