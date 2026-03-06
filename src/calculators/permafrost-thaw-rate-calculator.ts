import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const permafrostThawRateCalculator: CalculatorDefinition = {
  slug: "permafrost-thaw-rate-calculator",
  title: "Permafrost Thaw Rate Calculator",
  description: "Estimate permafrost degradation and methane release based on temperature rise, soil type, and ice content for climate impact modeling.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["permafrost thaw","permafrost melting","methane release","arctic warming","frozen ground"],
  variants: [{
    id: "standard",
    name: "Permafrost Thaw Rate",
    description: "Estimate permafrost degradation and methane release based on temperature rise, soil type, and ice content for climate impact modeling.",
    fields: [
      { name: "tempRise", label: "Temperature Increase Above Baseline (°C)", type: "number", min: 0.5, max: 10, defaultValue: 2 },
      { name: "areaKm2", label: "Permafrost Area (km²)", type: "number", min: 1, max: 1000000, defaultValue: 1000 },
      { name: "iceContent", label: "Ice Content (%)", type: "number", min: 10, max: 90, defaultValue: 50 },
      { name: "years", label: "Time Period (years)", type: "number", min: 1, max: 200, defaultValue: 50 },
    ],
    calculate: (inputs) => {
    const tempRise = inputs.tempRise as number;
    const areaKm2 = inputs.areaKm2 as number;
    const iceContent = inputs.iceContent as number;
    const years = inputs.years as number;
    const thawRateCmPerYear = tempRise * 3.5;
    const totalThawCm = thawRateCmPerYear * years;
    const carbonPerKm2 = 1500 * (iceContent / 100);
    const totalCarbonStored = areaKm2 * carbonPerKm2;
    const percentThawed = Math.min((totalThawCm / 300) * 100, 100);
    const carbonReleased = totalCarbonStored * (percentThawed / 100) * 0.1;
    const methaneReleased = carbonReleased * 0.023;
    const co2Equivalent = methaneReleased * 28 + carbonReleased * (1 - 0.023);
    return {
      primary: { label: "Estimated Thaw Depth", value: formatNumber(Math.round(totalThawCm)) + " cm" },
      details: [
        { label: "Thaw Rate", value: formatNumber(Math.round(thawRateCmPerYear * 10) / 10) + " cm/year" },
        { label: "Area Percent Thawed", value: formatNumber(Math.round(percentThawed)) + "%" },
        { label: "Carbon Released", value: formatNumber(Math.round(carbonReleased)) + " tons" },
        { label: "Methane Released", value: formatNumber(Math.round(methaneReleased)) + " tons CH4" },
        { label: "CO2 Equivalent", value: formatNumber(Math.round(co2Equivalent)) + " tons CO2e" }
      ]
    };
  },
  }],
  relatedSlugs: ["ocean-acidification-calculator","deforestation-impact-calculator","carbon-footprint-offset-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Thaw Depth = Temperature Rise x 3.5 cm/year x Years; Percent Thawed = (Thaw Depth / 300) x 100; Carbon Released = Stored Carbon x % Thawed x 0.1; CO2 Equivalent = (CH4 x 28) + CO2",
};
