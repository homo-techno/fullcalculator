import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soilErosionRateCalculator: CalculatorDefinition = {
  slug: "soil-erosion-rate-calculator",
  title: "Soil Erosion Rate Calculator",
  description: "Estimate annual soil loss using the Universal Soil Loss Equation based on rainfall, soil type, slope, cover, and conservation practices.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["soil erosion","USLE calculator","soil loss","erosion rate","topsoil loss"],
  variants: [{
    id: "standard",
    name: "Soil Erosion Rate",
    description: "Estimate annual soil loss using the Universal Soil Loss Equation based on rainfall, soil type, slope, cover, and conservation practices.",
    fields: [
      { name: "rainfallFactor", label: "Rainfall Erosivity (R factor)", type: "number", min: 10, max: 700, defaultValue: 200 },
      { name: "soilErodibility", label: "Soil Erodibility (K factor)", type: "number", min: 0.01, max: 0.70, defaultValue: 0.30 },
      { name: "slopeLength", label: "Slope Length (ft)", type: "number", min: 10, max: 1000, defaultValue: 200 },
      { name: "slopePercent", label: "Slope Steepness (%)", type: "number", min: 0.5, max: 50, defaultValue: 5 },
      { name: "coverFactor", label: "Cover Management (C factor)", type: "number", min: 0.001, max: 1.0, defaultValue: 0.15 },
    ],
    calculate: (inputs) => {
    const R = inputs.rainfallFactor as number;
    const K = inputs.soilErodibility as number;
    const slopeLength = inputs.slopeLength as number;
    const slopePercent = inputs.slopePercent as number;
    const C = inputs.coverFactor as number;
    const LS = Math.pow(slopeLength / 72.6, 0.5) * (0.065 + 0.045 * slopePercent + 0.0065 * slopePercent * slopePercent);
    const P = 1.0;
    const soilLoss = R * K * LS * C * P;
    const soilLossMetric = soilLoss * 0.224;
    let toleranceLevel = "Within Tolerance";
    if (soilLoss > 10) toleranceLevel = "Severe - Immediate action needed";
    else if (soilLoss > 5) toleranceLevel = "Above Tolerance - Conservation needed";
    else if (soilLoss > 3) toleranceLevel = "Near Tolerance Limit";
    const yearsToLoseInch = soilLoss > 0 ? Math.round(150 / soilLoss) : 999;
    const percentReductionWithCover = Math.round((1 - 0.003 / C) * 100);
    return {
      primary: { label: "Annual Soil Loss", value: formatNumber(Math.round(soilLoss * 100) / 100) + " tons/acre/year" },
      details: [
        { label: "Soil Loss (metric)", value: formatNumber(Math.round(soilLossMetric * 100) / 100) + " tonnes/ha/year" },
        { label: "LS Factor (Topography)", value: formatNumber(Math.round(LS * 100) / 100) },
        { label: "Erosion Status", value: toleranceLevel },
        { label: "Years to Lose 1 Inch Topsoil", value: formatNumber(yearsToLoseInch) + " years" },
        { label: "Soil Tolerance (T value)", value: "5 tons/acre/year" }
      ]
    };
  },
  }],
  relatedSlugs: ["deforestation-impact-calculator","drought-severity-index-calculator","evapotranspiration-rate-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "A = R x K x LS x C x P (Universal Soil Loss Equation)
LS = (Length/72.6)^0.5 x (0.065 + 0.045s + 0.0065s²)
Tolerance (T) = 5 tons/acre/year",
};
