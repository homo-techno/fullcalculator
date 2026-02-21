import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rainBarrelCalculator: CalculatorDefinition = {
  slug: "rain-barrel-calculator",
  title: "Rain Barrel Calculator",
  description: "Free rain barrel calculator. Calculate rainwater harvesting potential, number of barrels needed, and annual water savings from your roof.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["rain barrel calculator", "rainwater harvesting calculator", "rain collection calculator", "rainwater tank size", "how many rain barrels"],
  variants: [
    {
      id: "barrels-needed",
      name: "Barrels Needed",
      description: "Calculate how many rain barrels you need",
      fields: [
        { name: "roofArea", label: "Roof Area Draining to Barrel (sq ft)", type: "number", placeholder: "e.g. 500" },
        { name: "rainfall", label: "Rainfall per Storm (inches)", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
        { name: "barrelSize", label: "Barrel Size (gallons)", type: "select", options: [
          { label: "35 gallons", value: "35" },
          { label: "50 gallons", value: "50" },
          { label: "55 gallons (standard)", value: "55" },
          { label: "65 gallons", value: "65" },
          { label: "100 gallons", value: "100" },
          { label: "200 gallons (cistern)", value: "200" },
          { label: "500 gallons (tank)", value: "500" },
        ], defaultValue: "55" },
      ],
      calculate: (inputs) => {
        const roofArea = inputs.roofArea as number;
        const rainfall = inputs.rainfall as number;
        const barrelSize = parseFloat(inputs.barrelSize as string) || 55;
        if (!roofArea || !rainfall) return null;
        const cubicFeet = roofArea * (rainfall / 12);
        const gallons = cubicFeet * 7.481;
        const efficiency = 0.85;
        const collectableGallons = gallons * efficiency;
        const barrelsNeeded = Math.ceil(collectableGallons / barrelSize);
        return {
          primary: { label: "Barrels Needed", value: `${barrelsNeeded}` },
          details: [
            { label: "Water generated per storm", value: `${formatNumber(gallons, 0)} gallons` },
            { label: "Collectable (85% efficiency)", value: `${formatNumber(collectableGallons, 0)} gallons` },
            { label: "Barrel size", value: `${barrelSize} gallons` },
            { label: "Overflow (if 1 barrel)", value: `${formatNumber(Math.max(0, collectableGallons - barrelSize), 0)} gallons` },
            { label: "Roof area", value: `${formatNumber(roofArea, 0)} sq ft` },
          ],
          note: "1 inch of rain on 1,000 sq ft of roof produces about 623 gallons. A single downspout typically drains 200-500 sq ft of roof.",
        };
      },
    },
    {
      id: "annual-savings",
      name: "Annual Water Savings",
      description: "Estimate yearly water and cost savings",
      fields: [
        { name: "roofArea", label: "Total Roof Area (sq ft)", type: "number", placeholder: "e.g. 1500" },
        { name: "annualRainfall", label: "Annual Rainfall (inches)", type: "number", placeholder: "e.g. 40" },
        { name: "storageCapacity", label: "Total Storage Capacity (gallons)", type: "number", placeholder: "e.g. 200" },
        { name: "waterCost", label: "Water Cost ($/1,000 gallons)", type: "number", placeholder: "e.g. 5", defaultValue: 5 },
      ],
      calculate: (inputs) => {
        const roofArea = inputs.roofArea as number;
        const annualRain = inputs.annualRainfall as number;
        const storage = inputs.storageCapacity as number;
        const waterCost = inputs.waterCost as number;
        if (!roofArea || !annualRain || !storage) return null;
        const totalGallons = roofArea * (annualRain / 12) * 7.481 * 0.85;
        // Usable amount is limited by storage capacity × turnover rate
        const avgRainEvents = annualRain / 0.5; // avg 0.5" per rain event
        const turnovers = Math.min(avgRainEvents, 52); // assume used weekly
        const usableGallons = Math.min(totalGallons, storage * turnovers);
        const annualSavings = (usableGallons / 1000) * (waterCost || 5);
        return {
          primary: { label: "Usable Water per Year", value: `${formatNumber(usableGallons, 0)} gallons` },
          details: [
            { label: "Total roof collection potential", value: `${formatNumber(totalGallons, 0)} gallons` },
            { label: "Storage capacity", value: `${formatNumber(storage, 0)} gallons` },
            { label: "Estimated barrel refills", value: formatNumber(turnovers, 0) },
            { label: "Annual water cost savings", value: `$${formatNumber(annualSavings, 2)}` },
            { label: "Monthly average savings", value: `$${formatNumber(annualSavings / 12, 2)}` },
          ],
          note: "Actual savings depend on how frequently you empty barrels. Rainwater is ideal for gardens, lawns, and car washing. Check local regulations for rainwater harvesting in your area.",
        };
      },
    },
  ],
  relatedSlugs: ["rainfall-calculator", "irrigation-calculator", "water-flow-rate-calculator"],
  faq: [
    { question: "How many gallons can I collect from my roof?", answer: "A 1,000 sq ft roof collects about 623 gallons per inch of rainfall. With 40 inches of annual rainfall, that is about 25,000 gallons potential per year, though actual collection depends on storage capacity and usage." },
    { question: "What size rain barrel do I need?", answer: "A standard 55-gallon rain barrel fills up from just 1 inch of rain on about 90 sq ft of roof. For a typical downspout draining 300-500 sq ft, you will need 2-4 barrels to capture a 1-inch rain event. Consider a larger cistern (200-500 gallons) for serious harvesting." },
    { question: "Is collecting rainwater legal?", answer: "Rainwater harvesting is legal in most US states, though some states have restrictions. Colorado, for example, limits collection to two 55-gallon barrels. Check your state and local regulations before installing a system." },
  ],
  formula: "Gallons = Roof Area (sq ft) × Rainfall (in) / 12 × 7.481 × 0.85 efficiency | Barrels = Gallons / Barrel Size",
};
