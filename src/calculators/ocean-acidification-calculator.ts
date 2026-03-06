import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const oceanAcidificationCalculator: CalculatorDefinition = {
  slug: "ocean-acidification-calculator",
  title: "Ocean Acidification Calculator",
  description: "Model the impact of CO2 absorption on ocean pH levels and the effects on marine ecosystems based on emissions scenarios.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["ocean acidification","ocean pH","marine impact","co2 ocean absorption","coral reef impact"],
  variants: [{
    id: "standard",
    name: "Ocean Acidification",
    description: "Model the impact of CO2 absorption on ocean pH levels and the effects on marine ecosystems based on emissions scenarios.",
    fields: [
      { name: "co2ppm", label: "Atmospheric CO2 (ppm)", type: "number", min: 280, max: 1000, defaultValue: 420 },
      { name: "yearsProjected", label: "Years to Project", type: "number", min: 1, max: 200, defaultValue: 50 },
      { name: "annualIncrease", label: "Annual CO2 Increase (ppm)", type: "number", min: 0, max: 10, defaultValue: 2.5 },
    ],
    calculate: (inputs) => {
    const co2ppm = inputs.co2ppm as number;
    const yearsProjected = inputs.yearsProjected as number;
    const annualIncrease = inputs.annualIncrease as number;
    const preindustrialCO2 = 280;
    const preindustrialPH = 8.18;
    const futureCO2 = co2ppm + (annualIncrease * yearsProjected);
    const currentPH = preindustrialPH - 0.0576 * Math.log(co2ppm / preindustrialCO2);
    const futurePH = preindustrialPH - 0.0576 * Math.log(futureCO2 / preindustrialCO2);
    const phDrop = currentPH - futurePH;
    const coralRisk = futurePH < 7.8 ? "Critical" : futurePH < 7.95 ? "Severe" : futurePH < 8.05 ? "Moderate" : "Low";
    const acidityIncrease = (Math.pow(10, -(futurePH)) / Math.pow(10, -(preindustrialPH)) - 1) * 100;
    return {
      primary: { label: "Projected Ocean pH", value: formatNumber(Math.round(futurePH * 1000) / 1000) },
      details: [
        { label: "Current Ocean pH", value: formatNumber(Math.round(currentPH * 1000) / 1000) },
        { label: "pH Drop Over Period", value: formatNumber(Math.round(phDrop * 1000) / 1000) },
        { label: "Projected CO2 Level", value: formatNumber(Math.round(futureCO2)) + " ppm" },
        { label: "Acidity Increase vs Pre-Industrial", value: formatNumber(Math.round(acidityIncrease)) + "%" },
        { label: "Coral Reef Risk Level", value: coralRisk }
      ]
    };
  },
  }],
  relatedSlugs: ["carbon-footprint-offset-calculator","deforestation-impact-calculator","permafrost-thaw-rate-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Ocean pH = 8.18 - 0.0576 x ln(CO2 / 280); Future CO2 = Current CO2 + (Annual Increase x Years); Acidity Change = (10^(-future pH) / 10^(-8.18) - 1) x 100%",
};
