import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const septicSizeCalculator: CalculatorDefinition = {
  slug: "septic-size-calculator",
  title: "Septic Tank Size Calculator",
  description: "Free septic tank size calculator. Determine the right septic tank capacity based on bedrooms, occupants, and water usage for your home.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["septic tank size calculator", "septic system calculator", "septic tank capacity", "how big septic tank", "septic tank gallons"],
  variants: [
    {
      id: "by-bedrooms",
      name: "By Bedrooms (Code Standard)",
      description: "Calculate minimum septic tank size per building code",
      fields: [
        { name: "bedrooms", label: "Number of Bedrooms", type: "select", options: [
          { label: "1 bedroom", value: "1" },
          { label: "2 bedrooms", value: "2" },
          { label: "3 bedrooms", value: "3" },
          { label: "4 bedrooms", value: "4" },
          { label: "5 bedrooms", value: "5" },
          { label: "6 bedrooms", value: "6" },
          { label: "7+ bedrooms", value: "7" },
        ], defaultValue: "3" },
        { name: "extras", label: "Special Features", type: "select", options: [
          { label: "None", value: "none" },
          { label: "Garbage disposal", value: "disposal" },
          { label: "Hot tub / Jacuzzi", value: "hottub" },
          { label: "Garbage disposal + Hot tub", value: "both" },
        ], defaultValue: "none" },
      ],
      calculate: (inputs) => {
        const bedrooms = parseInt(inputs.bedrooms as string) || 3;
        const extras = inputs.extras as string;
        // Standard septic tank sizing (most US codes)
        const tankSizeMap: Record<number, number> = {
          1: 750, 2: 750, 3: 1000, 4: 1250, 5: 1500, 6: 1750, 7: 2000,
        };
        let tankSize = tankSizeMap[bedrooms] || 1000;
        // Add 50% for garbage disposal, 250 gal for hot tub
        if (extras === "disposal") tankSize = Math.ceil(tankSize * 1.5 / 250) * 250;
        else if (extras === "hottub") tankSize += 250;
        else if (extras === "both") tankSize = Math.ceil(tankSize * 1.5 / 250) * 250 + 250;
        const occupants = bedrooms * 2;
        const dailyFlow = occupants * 75; // 75 gallons per person per day
        const liters = tankSize * 3.785;
        const drainFieldSqFt = dailyFlow * 2; // rough estimate for loam soil
        return {
          primary: { label: "Minimum Tank Size", value: `${formatNumber(tankSize, 0)} gallons` },
          details: [
            { label: "Tank size (liters)", value: formatNumber(liters, 0) },
            { label: "Estimated occupants", value: `${occupants}` },
            { label: "Daily wastewater flow", value: `${formatNumber(dailyFlow, 0)} gallons/day` },
            { label: "Pumping frequency", value: "Every 3-5 years" },
            { label: "Drain field size (est.)", value: `${formatNumber(drainFieldSqFt, 0)} sq ft` },
          ],
          note: "These are minimum sizes per most US building codes. Always check your local health department requirements. Many jurisdictions require larger tanks than the minimum.",
        };
      },
    },
    {
      id: "by-flow",
      name: "By Daily Flow",
      description: "Size tank based on actual daily water usage",
      fields: [
        { name: "occupants", label: "Number of Occupants", type: "number", placeholder: "e.g. 4" },
        { name: "gallonsPerPerson", label: "Gallons per Person per Day", type: "number", placeholder: "e.g. 75", defaultValue: 75 },
        { name: "soilType", label: "Soil Type", type: "select", options: [
          { label: "Sand/Gravel (fast perc)", value: "sand" },
          { label: "Sandy Loam", value: "sandy-loam" },
          { label: "Loam", value: "loam" },
          { label: "Clay Loam", value: "clay-loam" },
          { label: "Clay (slow perc)", value: "clay" },
        ], defaultValue: "loam" },
      ],
      calculate: (inputs) => {
        const occupants = inputs.occupants as number;
        const gpd = inputs.gallonsPerPerson as number;
        const soil = inputs.soilType as string;
        if (!occupants || !gpd) return null;
        const dailyFlow = occupants * gpd;
        // Tank should hold at least 2 days of flow or minimum 750 gallons
        const tankByFlow = Math.max(750, dailyFlow * 2);
        const tankRounded = Math.ceil(tankByFlow / 250) * 250;
        // Drain field sizing by soil type (sq ft per GPD)
        const drainFieldRate: Record<string, number> = {
          sand: 0.6, "sandy-loam": 1.0, loam: 1.5, "clay-loam": 2.5, clay: 4.0,
        };
        const rate = drainFieldRate[soil] || 1.5;
        const drainFieldSize = dailyFlow * rate;
        return {
          primary: { label: "Recommended Tank Size", value: `${formatNumber(tankRounded, 0)} gallons` },
          details: [
            { label: "Daily flow", value: `${formatNumber(dailyFlow, 0)} gallons` },
            { label: "Tank holds", value: `${formatNumber(tankRounded / dailyFlow, 1)} days of flow` },
            { label: "Drain field needed", value: `${formatNumber(drainFieldSize, 0)} sq ft` },
            { label: "Soil percolation", value: `${rate} sq ft per GPD` },
            { label: "Pumping volume", value: `${formatNumber(tankRounded * 0.7, 0)} gallons (70% capacity)` },
          ],
          note: "Average US water use is 60-80 gallons per person per day. Water-efficient homes may use 40-50 gallons. Percolation test results determine actual drain field size.",
        };
      },
    },
  ],
  relatedSlugs: ["well-pump-calculator", "drainage-calculator", "water-flow-rate-calculator"],
  faq: [
    { question: "What size septic tank do I need?", answer: "Most codes require a minimum 1,000-gallon tank for a 3-bedroom home. Add 250 gallons for each additional bedroom. Garbage disposals typically require 50% larger tanks. Always check with your local health department for specific requirements." },
    { question: "How often should I pump my septic tank?", answer: "The EPA recommends pumping every 3-5 years for a household of 4 using a 1,000-gallon tank. More frequent pumping is needed for smaller tanks, larger households, or homes with garbage disposals." },
    { question: "What are signs of septic tank problems?", answer: "Warning signs include: slow drains, sewage odors, wet spots or lush grass over the drain field, sewage backup in the home, and high levels of nitrates or coliform bacteria in well water. Regular inspections every 1-3 years help prevent failures." },
  ],
  formula: "Tank Size = max(750, Daily Flow × 2 days) | Daily Flow = Occupants × 75 GPD | Drain Field = Daily Flow × Soil Factor",
};
