import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const iceDamRiskCalculator: CalculatorDefinition = {
  slug: "ice-dam-risk-calculator",
  title: "Ice Dam Risk Calculator",
  description: "Evaluate ice dam risk on your roof based on insulation levels, attic temperature, roof slope, and outdoor conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ice dam","roof ice","ice dam prevention","attic insulation","roof ventilation"],
  variants: [{
    id: "standard",
    name: "Ice Dam Risk",
    description: "Evaluate ice dam risk on your roof based on insulation levels, attic temperature, roof slope, and outdoor conditions.",
    fields: [
      { name: "atticInsulation", label: "Attic Insulation R-Value", type: "number", min: 0, max: 60, defaultValue: 20 },
      { name: "outsideTemp", label: "Outside Temperature (°F)", type: "number", min: -30, max: 35, defaultValue: 20 },
      { name: "roofSlope", label: "Roof Slope (degrees)", type: "number", min: 5, max: 60, defaultValue: 30 },
      { name: "snowDepth", label: "Snow on Roof (inches)", type: "number", min: 1, max: 48, defaultValue: 12 },
      { name: "hasVentilation", label: "Adequate Roof Ventilation", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const atticInsulation = inputs.atticInsulation as number;
    const outsideTemp = inputs.outsideTemp as number;
    const roofSlope = inputs.roofSlope as number;
    const snowDepth = inputs.snowDepth as number;
    const hasVentilation = inputs.hasVentilation as number;
    const insulationRisk = Math.max(0, 100 - atticInsulation * 2.5);
    const tempRisk = outsideTemp < 10 ? 20 : outsideTemp < 25 ? 40 : outsideTemp <= 32 ? 60 : 10;
    const snowRisk = Math.min(snowDepth * 3, 50);
    const slopeReduction = Math.min(roofSlope * 0.3, 15);
    const ventReduction = hasVentilation === 1 ? 15 : 0;
    const riskScore = Math.min(Math.max(insulationRisk * 0.35 + tempRisk * 0.25 + snowRisk * 0.25 - slopeReduction - ventReduction, 0), 100);
    let riskLevel = "Low";
    if (riskScore >= 65) riskLevel = "High";
    else if (riskScore >= 40) riskLevel = "Moderate";
    const recommendedR = 49;
    const insulationGap = Math.max(0, recommendedR - atticInsulation);
    return {
      primary: { label: "Ice Dam Risk", value: riskLevel + " (" + formatNumber(Math.round(riskScore)) + "/100)" },
      details: [
        { label: "Insulation Risk Factor", value: formatNumber(Math.round(insulationRisk)) + "/100" },
        { label: "Temperature Risk Factor", value: formatNumber(tempRisk) + "/100" },
        { label: "Snow Depth Risk", value: formatNumber(Math.round(snowRisk)) + "/50" },
        { label: "Current R-Value", value: "R-" + formatNumber(atticInsulation) },
        { label: "Insulation Upgrade Needed", value: insulationGap > 0 ? "Add R-" + formatNumber(insulationGap) : "Adequate" }
      ]
    };
  },
  }],
  relatedSlugs: ["ice-dam-prevention-calculator","snow-load-calculator","frost-depth-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Risk = (Insulation Risk x 0.35) + (Temp Risk x 0.25) + (Snow Risk x 0.25) - Slope Reduction - Ventilation Reduction
Insulation Risk = max(0, 100 - R-Value x 2.5)",
};
