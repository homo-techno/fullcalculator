import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const solarLuminosityCalculator: CalculatorDefinition = {
  slug: "solar-luminosity-calculator",
  title: "Solar Panel in Space Calculator",
  description: "Calculate the solar radiation intensity and power output of a solar panel at any distance from the Sun, accounting for the inverse square law.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["solar intensity","inverse square law","solar constant","space solar power"],
  variants: [{
    id: "standard",
    name: "Solar Panel in Space",
    description: "Calculate the solar radiation intensity and power output of a solar panel at any distance from the Sun, accounting for the inverse square law.",
    fields: [
      { name: "distanceAU", label: "Distance from Sun (AU)", type: "number", min: 0.1, max: 100, defaultValue: 1 },
      { name: "panelArea", label: "Solar Panel Area (m2)", type: "number", min: 0.01, max: 1000, defaultValue: 10 },
      { name: "efficiency", label: "Panel Efficiency (%)", type: "number", min: 1, max: 50, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const d = inputs.distanceAU as number;
    const area = inputs.panelArea as number;
    const eff = inputs.efficiency as number / 100;
    const solarConstant = 1361;
    const intensity = solarConstant / (d * d);
    const powerTotal = intensity * area;
    const powerElectric = powerTotal * eff;
    return {
      primary: { label: "Solar Intensity", value: formatNumber(Math.round(intensity * 100) / 100) + " W/m2" },
      details: [
        { label: "Total Solar Power on Panel", value: formatNumber(Math.round(powerTotal * 100) / 100) + " W" },
        { label: "Electrical Output", value: formatNumber(Math.round(powerElectric * 100) / 100) + " W" },
        { label: "Intensity vs Earth", value: formatNumber(Math.round(1 / (d * d) * 10000) / 100) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["space-travel-time-calculator","hohmann-transfer-calculator"],
  faq: [
    { question: "What is the solar constant?", answer: "The solar constant is approximately 1,361 W/m2, the average solar radiation intensity at Earth distance (1 AU) from the Sun." },
    { question: "How does solar intensity change with distance?", answer: "Solar intensity follows the inverse square law. At 2 AU, intensity is only one-quarter of what it is at 1 AU. At Jupiter (5.2 AU), it is only about 3.7 percent of Earth levels." },
    { question: "Can solar panels work in the outer solar system?", answer: "Solar panels become impractical beyond Jupiter due to low light levels. The Juno spacecraft at Jupiter uses very large panels, while missions to Saturn and beyond typically rely on nuclear power sources." },
  ],
  formula: "Solar Intensity = 1361 / d^2 (W/m2)
Power = Intensity x Panel Area x Efficiency",
};
