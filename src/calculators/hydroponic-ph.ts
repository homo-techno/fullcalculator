import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hydroponicPhCalculator: CalculatorDefinition = {
  slug: "hydroponic-ph-calculator",
  title: "Hydroponic pH Calculator",
  description: "Free hydroponic pH calculator. Determine the ideal pH range for your hydroponic plants and calculate pH adjustment amounts.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hydroponic pH calculator", "nutrient solution pH", "pH adjustment calculator", "hydroponics pH range", "pH up pH down calculator"],
  variants: [
    {
      id: "ph-range",
      name: "Ideal pH Range by Plant",
      description: "Find the optimal pH range for your hydroponic crop",
      fields: [
        { name: "crop", label: "Crop Type", type: "select", options: [
          { label: "Lettuce / Leafy Greens", value: "lettuce" },
          { label: "Tomatoes", value: "tomato" },
          { label: "Peppers", value: "pepper" },
          { label: "Strawberries", value: "strawberry" },
          { label: "Basil / Herbs", value: "basil" },
          { label: "Cucumbers", value: "cucumber" },
          { label: "Beans", value: "bean" },
          { label: "Spinach", value: "spinach" },
          { label: "Cannabis (where legal)", value: "cannabis" },
        ], defaultValue: "lettuce" },
        { name: "currentPh", label: "Current pH Reading", type: "number", placeholder: "e.g. 7.2", step: 0.1 },
        { name: "reservoirSize", label: "Reservoir Size (gallons)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
      ],
      calculate: (inputs) => {
        const crop = inputs.crop as string;
        const currentPh = inputs.currentPh as number;
        const reservoir = (inputs.reservoirSize as number) || 20;

        const cropData: Record<string, { low: number; high: number; ideal: number; ec: string }> = {
          lettuce: { low: 5.5, high: 6.5, ideal: 6.0, ec: "0.8-1.2" },
          tomato: { low: 5.5, high: 6.5, ideal: 6.0, ec: "2.0-5.0" },
          pepper: { low: 5.5, high: 6.0, ideal: 5.8, ec: "1.5-2.5" },
          strawberry: { low: 5.5, high: 6.5, ideal: 6.0, ec: "1.0-1.5" },
          basil: { low: 5.5, high: 6.5, ideal: 6.0, ec: "1.0-1.6" },
          cucumber: { low: 5.5, high: 6.0, ideal: 5.8, ec: "1.5-2.5" },
          bean: { low: 5.8, high: 6.5, ideal: 6.0, ec: "2.0-4.0" },
          spinach: { low: 5.5, high: 6.6, ideal: 6.0, ec: "1.8-2.3" },
          cannabis: { low: 5.5, high: 6.5, ideal: 5.8, ec: "1.2-2.0" },
        };

        const data = cropData[crop];
        if (!data) return null;

        let adjustment = "";
        let direction = "";
        if (currentPh) {
          if (currentPh > data.high) {
            direction = "lower";
            const diff = currentPh - data.ideal;
            const mlPerGal = diff * 0.5;
            adjustment = `Add ~${formatNumber(mlPerGal * reservoir, 1)} mL of pH Down solution`;
          } else if (currentPh < data.low) {
            direction = "raise";
            const diff = data.ideal - currentPh;
            const mlPerGal = diff * 0.5;
            adjustment = `Add ~${formatNumber(mlPerGal * reservoir, 1)} mL of pH Up solution`;
          } else {
            adjustment = "pH is within the ideal range - no adjustment needed";
          }
        }

        const details = [
          { label: "Ideal pH range", value: `${data.low} - ${data.high}` },
          { label: "Target pH", value: `${data.ideal}` },
          { label: "Recommended EC range", value: `${data.ec} mS/cm` },
        ];
        if (currentPh) {
          details.push({ label: "Current pH", value: `${currentPh}` });
          details.push({ label: "Adjustment", value: adjustment });
        }

        return {
          primary: { label: "Target pH", value: `${data.low} - ${data.high}` },
          details,
          note: "Add pH adjusters slowly (a few mL at a time), wait 15-30 minutes, and retest. pH naturally drifts, so check daily.",
        };
      },
    },
    {
      id: "nutrient-solution",
      name: "Nutrient Solution Mixer",
      description: "Calculate nutrient concentrate amounts for your reservoir",
      fields: [
        { name: "reservoirSize", label: "Reservoir Size (gallons)", type: "number", placeholder: "e.g. 20" },
        { name: "nutrientRate", label: "Nutrient Concentration", type: "select", options: [
          { label: "Seedling (1/4 strength)", value: "0.25" },
          { label: "Young plant (1/2 strength)", value: "0.5" },
          { label: "Full strength", value: "1.0" },
          { label: "Heavy feeding (1.25x)", value: "1.25" },
        ], defaultValue: "1.0" },
        { name: "baseRate", label: "Product Base Rate (mL per gallon)", type: "number", placeholder: "e.g. 5", defaultValue: 5 },
      ],
      calculate: (inputs) => {
        const reservoir = inputs.reservoirSize as number;
        const strengthMod = parseFloat(inputs.nutrientRate as string) || 1.0;
        const baseRate = (inputs.baseRate as number) || 5;
        if (!reservoir) return null;

        const mlPerGallon = baseRate * strengthMod;
        const totalMl = mlPerGallon * reservoir;
        const totalTsp = totalMl / 5;
        const totalTbsp = totalMl / 15;

        return {
          primary: { label: "Nutrient to Add", value: `${formatNumber(totalMl, 1)} mL` },
          details: [
            { label: "Per gallon", value: `${formatNumber(mlPerGallon, 2)} mL/gal` },
            { label: "In teaspoons", value: `${formatNumber(totalTsp, 1)} tsp` },
            { label: "In tablespoons", value: `${formatNumber(totalTbsp, 1)} tbsp` },
            { label: "Strength", value: `${strengthMod * 100}%` },
            { label: "Reservoir size", value: `${reservoir} gallons` },
          ],
          note: "Always add nutrients to water, not water to nutrients. Check pH after adding nutrients as they can shift the pH significantly.",
        };
      },
    },
  ],
  relatedSlugs: ["watering-schedule-calculator", "indoor-plant-light-calculator", "ph-calculator"],
  faq: [
    { question: "What pH should hydroponic water be?", answer: "Most hydroponic plants grow best in a pH range of 5.5-6.5. This slightly acidic range allows optimal nutrient absorption. Different crops have slightly different ideal pH ranges." },
    { question: "Why does pH matter in hydroponics?", answer: "Nutrients become unavailable to plants outside the correct pH range, even if present in the solution. Iron locks out above pH 6.5, while calcium and magnesium lock out below pH 5.0." },
  ],
  formula: "pH Adjustment (mL) \u2248 (Current pH - Target pH) \u00D7 0.5 mL/gal \u00D7 Reservoir Gallons",
};
