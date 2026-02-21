import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hydroponicNutrientCalculator: CalculatorDefinition = {
  slug: "hydroponic-nutrient-calculator",
  title: "Hydroponic Nutrient Calculator",
  description: "Free hydroponic nutrient calculator. Calculate nutrient solution strength, pH targets, and mixing ratios for hydroponic and aquaponic growing systems.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hydroponic nutrient calculator", "hydroponic EC calculator", "nutrient solution calculator", "hydroponic PPM calculator", "hydroponic mixing ratio"],
  variants: [
    {
      id: "nutrient-mix",
      name: "Nutrient Solution Mixing",
      description: "Calculate nutrient concentrate amounts for your reservoir",
      fields: [
        { name: "reservoirGallons", label: "Reservoir Size (gallons)", type: "number", placeholder: "e.g. 20" },
        { name: "cropType", label: "Crop Type", type: "select", options: [
          { label: "Leafy Greens (Lettuce, Spinach)", value: "leafy" },
          { label: "Herbs (Basil, Cilantro)", value: "herbs" },
          { label: "Fruiting (Tomatoes, Peppers)", value: "fruiting" },
          { label: "Strawberries", value: "strawberry" },
          { label: "Cucumbers", value: "cucumber" },
          { label: "Seedlings/Clones", value: "seedling" },
        ], defaultValue: "leafy" },
        { name: "growStage", label: "Growth Stage", type: "select", options: [
          { label: "Seedling (Week 1-2)", value: "seedling" },
          { label: "Vegetative (Week 3-6)", value: "veg" },
          { label: "Flowering/Fruiting", value: "flower" },
          { label: "Late Fruiting/Ripening", value: "ripen" },
        ], defaultValue: "veg" },
      ],
      calculate: (inputs) => {
        const gallons = inputs.reservoirGallons as number;
        const crop = inputs.cropType as string;
        const stage = inputs.growStage as string;
        if (!gallons) return null;

        const ecTargets: Record<string, Record<string, number>> = {
          leafy: { seedling: 0.8, veg: 1.2, flower: 1.4, ripen: 1.0 },
          herbs: { seedling: 0.8, veg: 1.4, flower: 1.6, ripen: 1.2 },
          fruiting: { seedling: 1.0, veg: 1.8, flower: 2.4, ripen: 2.0 },
          strawberry: { seedling: 0.8, veg: 1.4, flower: 1.8, ripen: 1.6 },
          cucumber: { seedling: 1.0, veg: 1.6, flower: 2.2, ripen: 1.8 },
          seedling: { seedling: 0.5, veg: 0.8, flower: 0.8, ripen: 0.5 },
        };

        const phTargets: Record<string, [number, number]> = {
          leafy: [5.5, 6.5], herbs: [5.5, 6.5], fruiting: [5.8, 6.5],
          strawberry: [5.5, 6.2], cucumber: [5.5, 6.0], seedling: [5.5, 6.0],
        };

        const ec = ecTargets[crop]?.[stage] || 1.5;
        const ppm = ec * 500;
        const ph = phTargets[crop] || [5.5, 6.5];
        const mlPerGallon = ec * 2.5;
        const totalMl = mlPerGallon * gallons;
        const liters = gallons * 3.785;
        const waterChangeDays = crop === "fruiting" ? 7 : 10;

        return {
          primary: { label: "Target EC", value: `${formatNumber(ec, 1)} mS/cm (${formatNumber(ppm, 0)} PPM)` },
          details: [
            { label: "Target pH range", value: `${ph[0]} - ${ph[1]}` },
            { label: "Nutrient per gallon", value: `~${formatNumber(mlPerGallon, 1)} ml` },
            { label: "Total nutrient needed", value: `~${formatNumber(totalMl, 0)} ml (${formatNumber(totalMl / 5, 1)} tsp)` },
            { label: "Reservoir volume", value: `${gallons} gal (${formatNumber(liters, 1)} L)` },
            { label: "Water change interval", value: `Every ${waterChangeDays}-14 days` },
            { label: "Daily water use estimate", value: `${formatNumber(gallons * 0.1, 1)} gal/day (top-off)` },
          ],
          note: "Always add nutrients to water (never the reverse). Check EC and pH daily. Adjust pH after adding nutrients. Nutrient amounts vary by brand - use manufacturer's feeding chart as primary guide.",
        };
      },
    },
    {
      id: "reservoir-sizing",
      name: "Reservoir Sizing",
      description: "Calculate reservoir size based on number of plants",
      fields: [
        { name: "numPlants", label: "Number of Plants", type: "number", placeholder: "e.g. 12" },
        { name: "plantSize", label: "Plant Size", type: "select", options: [
          { label: "Small (Lettuce, Herbs) - 0.5 gal each", value: "small" },
          { label: "Medium (Peppers, Strawberries) - 1.5 gal each", value: "medium" },
          { label: "Large (Tomatoes, Cucumbers) - 2.5 gal each", value: "large" },
        ], defaultValue: "medium" },
        { name: "system", label: "System Type", type: "select", options: [
          { label: "Deep Water Culture (DWC)", value: "dwc" },
          { label: "Nutrient Film Technique (NFT)", value: "nft" },
          { label: "Drip System", value: "drip" },
          { label: "Ebb and Flow", value: "ebb" },
          { label: "Kratky (Passive)", value: "kratky" },
        ], defaultValue: "dwc" },
      ],
      calculate: (inputs) => {
        const plants = inputs.numPlants as number;
        const size = inputs.plantSize as string;
        const system = inputs.system as string;
        if (!plants) return null;

        const galPerPlant: Record<string, number> = { small: 0.5, medium: 1.5, large: 2.5 };
        const systemMultiplier: Record<string, number> = { dwc: 1.5, nft: 1.0, drip: 1.2, ebb: 1.3, kratky: 1.0 };

        const baseGallons = plants * (galPerPlant[size] || 1.5);
        const totalGallons = baseGallons * (systemMultiplier[system] || 1.2);
        const liters = totalGallons * 3.785;
        const weeklyNutrientMl = totalGallons * 5;

        return {
          primary: { label: "Reservoir Size", value: `${formatNumber(totalGallons, 0)} gallons minimum` },
          details: [
            { label: "Base water need", value: `${formatNumber(baseGallons, 1)} gallons` },
            { label: "With system buffer", value: `${formatNumber(totalGallons, 1)} gallons (${formatNumber(liters, 0)} L)` },
            { label: "Weekly nutrient use", value: `~${formatNumber(weeklyNutrientMl, 0)} ml` },
            { label: "Air pump needed (DWC)", value: system === "dwc" ? `${formatNumber(plants * 0.5, 1)} LPM minimum` : "N/A" },
            { label: "System type", value: system.toUpperCase() },
          ],
          note: "Larger reservoirs are more stable - pH and EC fluctuate less. Always size up if possible. Keep water temperature between 65-75°F.",
        };
      },
    },
  ],
  relatedSlugs: ["grow-light-calculator", "garden-water-calculator", "ph-adjustment-calculator"],
  faq: [
    { question: "What EC/PPM should I use for hydroponics?", answer: "EC targets vary by crop: Leafy greens 0.8-1.4 mS/cm, Herbs 1.0-1.6, Tomatoes/Peppers 1.8-2.5, Strawberries 1.4-1.8, Cucumbers 1.6-2.2. Seedlings should start at half strength and increase gradually." },
    { question: "What is the ideal pH for hydroponic growing?", answer: "Most hydroponic crops thrive at pH 5.5-6.5, with 5.8-6.2 being the sweet spot. pH affects nutrient availability - too high or low locks out specific nutrients. Check and adjust pH daily." },
    { question: "How often should I change hydroponic nutrient solution?", answer: "Change your nutrient solution every 7-14 days, or when EC drifts more than 30% from target. Top off with plain water between changes. Complete reservoir changes prevent salt buildup and nutrient imbalances." },
  ],
  formula: "PPM = EC (mS/cm) × 500 | Reservoir Size = Plants × Gallons per Plant × System Multiplier | Nutrient (ml) ≈ EC × 2.5 × Gallons",
};
