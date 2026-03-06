import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const droughtSeverityIndexCalculator: CalculatorDefinition = {
  slug: "drought-severity-index-calculator",
  title: "Drought Severity Index Calculator",
  description: "Calculate drought severity using precipitation deficits, temperature anomalies, and soil moisture to assess agricultural and water supply risk.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["drought index","drought severity","precipitation deficit","water shortage","drought monitor"],
  variants: [{
    id: "standard",
    name: "Drought Severity Index",
    description: "Calculate drought severity using precipitation deficits, temperature anomalies, and soil moisture to assess agricultural and water supply risk.",
    fields: [
      { name: "actualPrecip", label: "Actual Precipitation (inches)", type: "number", min: 0, max: 50, defaultValue: 2 },
      { name: "normalPrecip", label: "Normal Precipitation (inches)", type: "number", min: 0.5, max: 50, defaultValue: 4 },
      { name: "tempAnomaly", label: "Temperature Above Normal (°F)", type: "number", min: 0, max: 20, defaultValue: 5 },
      { name: "soilMoisture", label: "Soil Moisture (%)", type: "number", min: 0, max: 100, defaultValue: 30 },
    ],
    calculate: (inputs) => {
    const actualPrecip = inputs.actualPrecip as number;
    const normalPrecip = inputs.normalPrecip as number;
    const tempAnomaly = inputs.tempAnomaly as number;
    const soilMoisture = inputs.soilMoisture as number;
    const precipDeficit = ((normalPrecip - actualPrecip) / normalPrecip) * 100;
    const precipIndex = precipDeficit * 0.4;
    const tempIndex = tempAnomaly * 3;
    const moistureIndex = (100 - soilMoisture) * 0.3;
    const severityScore = precipIndex + tempIndex + moistureIndex;
    let category = "D0 - Abnormally Dry";
    if (severityScore >= 80) category = "D4 - Exceptional Drought";
    else if (severityScore >= 60) category = "D3 - Extreme Drought";
    else if (severityScore >= 45) category = "D2 - Severe Drought";
    else if (severityScore >= 30) category = "D1 - Moderate Drought";
    const cropImpact = severityScore > 60 ? "Major crop losses likely" : severityScore > 40 ? "Reduced yields expected" : "Minimal crop impact";
    return {
      primary: { label: "Drought Severity", value: category },
      details: [
        { label: "Severity Score", value: formatNumber(Math.round(severityScore)) },
        { label: "Precipitation Deficit", value: formatNumber(Math.round(precipDeficit)) + "%" },
        { label: "Temperature Contribution", value: formatNumber(Math.round(tempIndex)) + " pts" },
        { label: "Soil Moisture Contribution", value: formatNumber(Math.round(moistureIndex)) + " pts" },
        { label: "Agricultural Impact", value: cropImpact }
      ]
    };
  },
  }],
  relatedSlugs: ["evapotranspiration-rate-calculator","soil-erosion-rate-calculator","growing-degree-days-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Severity Score = (Precip Deficit% x 0.4) + (Temp Anomaly x 3) + ((100 - Soil Moisture%) x 0.3); D0 < 30, D1 30-45, D2 45-60, D3 60-80, D4 > 80",
};
