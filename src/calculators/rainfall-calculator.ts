import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rainfallCalculator: CalculatorDefinition = {
  slug: "rainfall-calculator",
  title: "Rainfall Calculator",
  description: "Free rainfall calculator. Calculate total rainfall volume, water collection potential, and precipitation rates for any area.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["rainfall calculator", "precipitation calculator", "rain volume calculator", "rainfall collection", "how much rain fell"],
  variants: [
    {
      id: "volume",
      name: "Rainfall Volume",
      description: "Calculate total water volume from rainfall on an area",
      fields: [
        { name: "rainfall", label: "Rainfall Amount (inches)", type: "number", placeholder: "e.g. 1.5", step: 0.1 },
        { name: "area", label: "Area (sq ft)", type: "number", placeholder: "e.g. 2000" },
      ],
      calculate: (inputs) => {
        const rain = inputs.rainfall as number;
        const area = inputs.area as number;
        if (!rain || !area) return null;
        const cubicFeet = area * (rain / 12);
        const gallons = cubicFeet * 7.481;
        const liters = gallons * 3.785;
        const cubicMeters = liters / 1000;
        return {
          primary: { label: "Total Water Volume", value: `${formatNumber(gallons, 0)} gallons` },
          details: [
            { label: "Liters", value: formatNumber(liters, 0) },
            { label: "Cubic feet", value: formatNumber(cubicFeet, 1) },
            { label: "Cubic meters", value: formatNumber(cubicMeters, 2) },
            { label: "Pounds of water", value: formatNumber(gallons * 8.34, 0) },
          ],
          note: "1 inch of rain on 1,000 sq ft produces approximately 623 gallons of water.",
        };
      },
    },
    {
      id: "metric",
      name: "Metric (mm & m²)",
      description: "Calculate rainfall volume in metric units",
      fields: [
        { name: "rainfall", label: "Rainfall Amount (mm)", type: "number", placeholder: "e.g. 25", step: 1 },
        { name: "area", label: "Area (m²)", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const rainMm = inputs.rainfall as number;
        const areaM2 = inputs.area as number;
        if (!rainMm || !areaM2) return null;
        const liters = areaM2 * rainMm;
        const gallons = liters * 0.2642;
        const cubicMeters = liters / 1000;
        return {
          primary: { label: "Total Water Volume", value: `${formatNumber(liters, 0)} liters` },
          details: [
            { label: "Gallons", value: formatNumber(gallons, 0) },
            { label: "Cubic meters", value: formatNumber(cubicMeters, 2) },
            { label: "Kilograms of water", value: formatNumber(liters, 0) },
          ],
          note: "1 mm of rain on 1 m² equals exactly 1 liter of water.",
        };
      },
    },
    {
      id: "roof-collection",
      name: "Roof Collection Potential",
      description: "Estimate harvestable rainwater from your roof",
      fields: [
        { name: "roofArea", label: "Roof Footprint (sq ft)", type: "number", placeholder: "e.g. 1500" },
        { name: "annualRain", label: "Annual Rainfall (inches)", type: "number", placeholder: "e.g. 40" },
        { name: "efficiency", label: "Collection Efficiency (%)", type: "number", placeholder: "e.g. 80", defaultValue: 80 },
      ],
      calculate: (inputs) => {
        const roofArea = inputs.roofArea as number;
        const annualRain = inputs.annualRain as number;
        const efficiency = (inputs.efficiency as number) || 80;
        if (!roofArea || !annualRain) return null;
        const totalGallons = roofArea * (annualRain / 12) * 7.481;
        const harvestable = totalGallons * (efficiency / 100);
        const monthlyAvg = harvestable / 12;
        return {
          primary: { label: "Annual Harvestable Water", value: `${formatNumber(harvestable, 0)} gallons` },
          details: [
            { label: "Total rainfall on roof", value: `${formatNumber(totalGallons, 0)} gallons` },
            { label: "Collection efficiency", value: `${efficiency}%` },
            { label: "Monthly average", value: `${formatNumber(monthlyAvg, 0)} gallons` },
            { label: "Daily average", value: `${formatNumber(harvestable / 365, 1)} gallons` },
          ],
          note: "Typical collection efficiency is 75-90% depending on roof material. Metal roofs are most efficient.",
        };
      },
    },
  ],
  relatedSlugs: ["rain-barrel-calculator", "irrigation-calculator", "drainage-calculator"],
  faq: [
    { question: "How much water does 1 inch of rain produce?", answer: "One inch of rain on 1,000 square feet produces about 623 gallons of water. On an average 1,500 sq ft roof, that is roughly 935 gallons per inch of rainfall." },
    { question: "How do I measure rainfall at home?", answer: "Use a rain gauge — a graduated cylinder placed in an open area away from buildings and trees. Measure the depth of water collected after each rain event. Alternatively, use a flat-bottomed container and a ruler." },
    { question: "What is considered heavy rainfall?", answer: "The NWS classifies rainfall rates as: light (< 0.10 in/hr), moderate (0.10-0.30 in/hr), and heavy (> 0.30 in/hr). Rainfall exceeding 1 inch per hour is considered very heavy and can cause flash flooding." },
  ],
  formula: "Volume (gallons) = Area (sq ft) × Rainfall (inches) / 12 × 7.481 gal/ft³",
};
