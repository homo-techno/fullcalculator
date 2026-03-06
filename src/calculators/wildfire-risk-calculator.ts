import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wildfireRiskCalculator: CalculatorDefinition = {
  slug: "wildfire-risk-calculator",
  title: "Wildfire Risk Calculator",
  description: "Assess wildfire risk for your property based on vegetation density, slope, distance to wildland, humidity, and wind conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wildfire risk","fire danger","wildland fire","fire risk assessment","defensible space"],
  variants: [{
    id: "standard",
    name: "Wildfire Risk",
    description: "Assess wildfire risk for your property based on vegetation density, slope, distance to wildland, humidity, and wind conditions.",
    fields: [
      { name: "vegetationDensity", label: "Vegetation Density", type: "select", options: [{ value: "1", label: "Sparse (desert/urban)" }, { value: "2", label: "Moderate (mixed)" }, { value: "3", label: "Dense (forest/chaparral)" }], defaultValue: "2" },
      { name: "slopePercent", label: "Terrain Slope (%)", type: "number", min: 0, max: 100, defaultValue: 15 },
      { name: "defensibleSpace", label: "Defensible Space (ft)", type: "number", min: 0, max: 300, defaultValue: 100 },
      { name: "humidity", label: "Relative Humidity (%)", type: "number", min: 5, max: 100, defaultValue: 30 },
      { name: "windSpeed", label: "Wind Speed (mph)", type: "number", min: 0, max: 80, defaultValue: 15 },
    ],
    calculate: (inputs) => {
    const vegetationDensity = inputs.vegetationDensity as number;
    const slopePercent = inputs.slopePercent as number;
    const defensibleSpace = inputs.defensibleSpace as number;
    const humidity = inputs.humidity as number;
    const windSpeed = inputs.windSpeed as number;
    const vegScore = [15, 40, 70][vegetationDensity - 1];
    const slopeScore = Math.min(slopePercent * 0.5, 30);
    const defenseReduction = Math.min(defensibleSpace / 3, 30);
    const humidityScore = Math.max(0, (50 - humidity) * 0.6);
    const windScore = windSpeed * 0.4;
    const rawRisk = vegScore + slopeScore + humidityScore + windScore - defenseReduction;
    const riskScore = Math.min(Math.max(rawRisk, 0), 100);
    let riskLevel = "Low";
    if (riskScore >= 75) riskLevel = "Extreme";
    else if (riskScore >= 55) riskLevel = "High";
    else if (riskScore >= 35) riskLevel = "Moderate";
    const fireSpreadRate = (windSpeed * 0.1 + slopePercent * 0.05) * vegetationDensity;
    const recommendedSpace = riskScore >= 55 ? 200 : riskScore >= 35 ? 100 : 50;
    return {
      primary: { label: "Wildfire Risk", value: riskLevel + " (" + formatNumber(Math.round(riskScore)) + "/100)" },
      details: [
        { label: "Vegetation Risk", value: formatNumber(vegScore) + "/70" },
        { label: "Slope Risk Contribution", value: formatNumber(Math.round(slopeScore)) + "/30" },
        { label: "Defensible Space Benefit", value: "-" + formatNumber(Math.round(defenseReduction)) + " pts" },
        { label: "Est. Fire Spread Rate", value: formatNumber(Math.round(fireSpreadRate * 10) / 10) + " chains/hr" },
        { label: "Recommended Defensible Space", value: formatNumber(recommendedSpace) + " ft" }
      ]
    };
  },
  }],
  relatedSlugs: ["wildfire-prep-calculator","wind-chill-calculator","drought-severity-index-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Risk Score = Vegetation Score + Slope Score + Humidity Score + Wind Score - Defensible Space Reduction; Fire Spread = (Wind x 0.1 + Slope x 0.05) x Vegetation Density",
};
