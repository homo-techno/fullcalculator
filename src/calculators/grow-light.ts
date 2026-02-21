import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const growLightCalculator: CalculatorDefinition = {
  slug: "grow-light-calculator",
  title: "Grow Light Calculator",
  description: "Free grow light calculator. Calculate how many grow lights you need, wattage requirements, and optimal light height based on your grow space and plants.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["grow light calculator", "LED grow light calculator", "grow light wattage calculator", "indoor grow light", "PPFD calculator", "grow light coverage"],
  variants: [
    {
      id: "by-area",
      name: "By Grow Area",
      description: "Calculate grow light wattage needed for your space",
      fields: [
        { name: "length", label: "Grow Area Length (ft)", type: "number", placeholder: "e.g. 4" },
        { name: "width", label: "Grow Area Width (ft)", type: "number", placeholder: "e.g. 4" },
        { name: "plantType", label: "Plant Type", type: "select", options: [
          { label: "Seedlings/Clones (20-30W/sq ft)", value: "seedling" },
          { label: "Leafy Greens/Herbs (25-35W/sq ft)", value: "leafy" },
          { label: "Fruiting Vegetables (35-50W/sq ft)", value: "fruiting" },
          { label: "Flowering Plants (40-60W/sq ft)", value: "flowering" },
          { label: "Succulents/Cacti (15-25W/sq ft)", value: "succulent" },
        ], defaultValue: "leafy" },
        { name: "lightType", label: "Light Type", type: "select", options: [
          { label: "LED (Most Efficient)", value: "led" },
          { label: "Fluorescent T5", value: "t5" },
          { label: "CFL", value: "cfl" },
          { label: "HPS/MH (High Intensity)", value: "hps" },
        ], defaultValue: "led" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const plantType = inputs.plantType as string;
        const lightType = inputs.lightType as string;
        if (!length || !width) return null;

        const area = length * width;
        const wattsPerSqFt: Record<string, number> = {
          seedling: 25, leafy: 30, fruiting: 40, flowering: 50, succulent: 20,
        };
        const efficiency: Record<string, number> = {
          led: 1.0, t5: 0.7, cfl: 0.5, hps: 0.8,
        };
        const ppfdTarget: Record<string, number> = {
          seedling: 200, leafy: 300, fruiting: 500, flowering: 600, succulent: 250,
        };

        const baseWatts = area * (wattsPerSqFt[plantType] || 30);
        const actualWatts = baseWatts / (efficiency[lightType] || 1.0);
        const ppfd = ppfdTarget[plantType] || 300;
        const dli = ppfd * 16 * 3600 / 1000000;

        const lightHours: Record<string, number> = {
          seedling: 16, leafy: 14, fruiting: 16, flowering: 12, succulent: 12,
        };
        const hours = lightHours[plantType] || 14;
        const dailyKwh = (actualWatts * hours) / 1000;
        const monthlyCost = dailyKwh * 30 * 0.12;

        const heightRecommendation: Record<string, string> = {
          led: "12-24 inches above canopy",
          t5: "4-8 inches above canopy",
          cfl: "6-12 inches above canopy",
          hps: "18-36 inches above canopy",
        };

        return {
          primary: { label: "Total Wattage Needed", value: `${formatNumber(actualWatts, 0)}W` },
          details: [
            { label: "Grow area", value: `${formatNumber(area, 0)} sq ft` },
            { label: "Target PPFD", value: `${ppfd} µmol/m²/s` },
            { label: "Daily Light Integral (DLI)", value: `${formatNumber(dli, 1)} mol/m²/day` },
            { label: "Recommended photoperiod", value: `${hours} hours/day` },
            { label: "Light height", value: heightRecommendation[lightType] || "12-24 inches" },
            { label: "Daily energy use", value: `${formatNumber(dailyKwh, 2)} kWh` },
            { label: "Monthly electricity cost", value: `~$${formatNumber(monthlyCost, 2)}` },
          ],
          note: "LED grow lights are 40-60% more efficient than HPS/MH. Choose full spectrum (white) LEDs for general growing or red/blue spectrum for targeted growth stages.",
        };
      },
    },
    {
      id: "light-count",
      name: "Number of Lights Needed",
      description: "Calculate how many individual lights to buy",
      fields: [
        { name: "areaLength", label: "Total Area Length (ft)", type: "number", placeholder: "e.g. 8" },
        { name: "areaWidth", label: "Total Area Width (ft)", type: "number", placeholder: "e.g. 4" },
        { name: "lightWattage", label: "Light Wattage (per unit)", type: "select", options: [
          { label: "100W LED", value: "100" },
          { label: "200W LED", value: "200" },
          { label: "300W LED", value: "300" },
          { label: "400W LED", value: "400" },
          { label: "600W LED", value: "600" },
          { label: "1000W HPS", value: "1000" },
        ], defaultValue: "200" },
        { name: "cropIntensity", label: "Light Intensity Needed", type: "select", options: [
          { label: "Low (Seedlings, Herbs) - 25W/sq ft", value: "low" },
          { label: "Medium (Lettuce, Greens) - 35W/sq ft", value: "medium" },
          { label: "High (Tomatoes, Peppers) - 50W/sq ft", value: "high" },
        ], defaultValue: "medium" },
      ],
      calculate: (inputs) => {
        const length = inputs.areaLength as number;
        const width = inputs.areaWidth as number;
        const wattage = parseInt(inputs.lightWattage as string);
        const intensity = inputs.cropIntensity as string;
        if (!length || !width || !wattage) return null;

        const area = length * width;
        const wattsNeeded: Record<string, number> = { low: 25, medium: 35, high: 50 };
        const totalWatts = area * (wattsNeeded[intensity] || 35);
        const numLights = Math.ceil(totalWatts / wattage);
        const coveragePerLight = area / numLights;
        const dailyKwh = (numLights * wattage * 14) / 1000;

        return {
          primary: { label: "Lights Needed", value: `${numLights}` },
          details: [
            { label: "Total area", value: `${formatNumber(area, 0)} sq ft` },
            { label: "Total wattage needed", value: `${formatNumber(totalWatts, 0)}W` },
            { label: "Wattage per light", value: `${wattage}W` },
            { label: "Coverage per light", value: `${formatNumber(coveragePerLight, 1)} sq ft` },
            { label: "Daily energy use", value: `${formatNumber(dailyKwh, 1)} kWh` },
            { label: "Monthly cost (at $0.12/kWh)", value: `~$${formatNumber(dailyKwh * 30 * 0.12, 2)}` },
          ],
          note: "Space lights evenly across the growing area. Overlap light footprints by 10-20% for uniform coverage. Use a light meter or phone app to check actual PPFD at plant level.",
        };
      },
    },
  ],
  relatedSlugs: ["greenhouse-size-calculator", "hydroponic-nutrient-calculator", "seed-starting-calculator"],
  faq: [
    { question: "How many watts per square foot for grow lights?", answer: "For LED grow lights: Seedlings need 20-30W/sq ft, leafy greens need 25-35W/sq ft, fruiting vegetables need 35-50W/sq ft. These are actual wall watts, not equivalent watts. LED is the most efficient option for indoor growing." },
    { question: "How high should grow lights be above plants?", answer: "LED panels: 12-24 inches above canopy. T5 fluorescent: 4-8 inches. CFL: 6-12 inches. HPS/MH: 18-36 inches. Start higher and lower gradually - if leaves curl or bleach, raise the light." },
    { question: "How many hours of light do indoor plants need?", answer: "Most vegetables need 14-16 hours of light per day. Fruiting crops: 16 hours in veg, 12 hours for fruiting. Herbs and greens: 12-16 hours. Seedlings: 16 hours. Always provide at least 8 hours of darkness for plant rest." },
  ],
  formula: "Total Watts = Area (sq ft) × Watts per sq ft / Light Efficiency | PPFD Target: Seedlings 200, Greens 300, Fruiting 500+ µmol/m²/s",
};
