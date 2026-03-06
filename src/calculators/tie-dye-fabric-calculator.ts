import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tieDyeFabricCalculator: CalculatorDefinition = {
  slug: "tie-dye-fabric-calculator",
  title: "Tie-Dye Fabric Calculator",
  description: "Calculate dye powder, soda ash, and water quantities for tie-dye projects based on fabric weight and number of items.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tie dye calculator","fabric dye amount","tie dye supplies","dye powder calculator"],
  variants: [{
    id: "standard",
    name: "Tie-Dye Fabric",
    description: "Calculate dye powder, soda ash, and water quantities for tie-dye projects based on fabric weight and number of items.",
    fields: [
      { name: "numItems", label: "Number of Items", type: "number", min: 1, max: 50, defaultValue: 6 },
      { name: "itemWeight", label: "Avg Item Weight (oz)", type: "number", min: 2, max: 32, defaultValue: 6 },
      { name: "dyeType", label: "Dye Type", type: "select", options: [{ value: "1", label: "Procion MX (powder)" }, { value: "2", label: "Liquid Dye" }, { value: "3", label: "All-Purpose (Rit)" }], defaultValue: "1" },
      { name: "numColors", label: "Number of Colors", type: "number", min: 1, max: 10, defaultValue: 3 },
      { name: "intensity", label: "Color Intensity", type: "select", options: [{ value: "1", label: "Pastel" }, { value: "2", label: "Medium" }, { value: "3", label: "Dark/Vibrant" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const numItems = inputs.numItems as number;
    const itemWeight = inputs.itemWeight as number;
    const dyeType = parseInt(inputs.dyeType as string);
    const numColors = inputs.numColors as number;
    const intensity = parseInt(inputs.intensity as string);
    const totalFabricOz = numItems * itemWeight;
    const tspPerOzFabric = { 1: 0.15, 2: 0.5, 3: 0.3 };
    const intensityMult = { 1: 0.5, 2: 1.0, 3: 2.0 };
    const dyePerOz = (tspPerOzFabric[dyeType] || 0.15) * (intensityMult[intensity] || 1.0);
    const totalDyeTsp = totalFabricOz * dyePerOz;
    const dyePerColor = Math.round(totalDyeTsp / numColors * 10) / 10;
    const sodaAshTsp = totalFabricOz * 0.2;
    const waterCups = totalFabricOz * 0.5;
    return {
      primary: { label: "Total Dye Needed", value: formatNumber(Math.round(totalDyeTsp * 10) / 10) + " tsp" },
      details: [
        { label: "Dye Per Color", value: formatNumber(dyePerColor) + " tsp" },
        { label: "Soda Ash", value: formatNumber(Math.round(sodaAshTsp * 10) / 10) + " tsp" },
        { label: "Water for Dye", value: formatNumber(Math.round(waterCups * 10) / 10) + " cups" },
        { label: "Total Fabric Weight", value: formatNumber(totalFabricOz) + " oz" }
      ]
    };
  },
  }],
  relatedSlugs: ["candle-making-wax-calculator","soap-making-lye-calculator"],
  faq: [
    { question: "How much dye do I need for tie-dye?", answer: "For Procion MX dye, use about 2 to 4 teaspoons of dye powder per 8 ounces of fabric for medium colors. Double for dark or vibrant results." },
    { question: "What is soda ash for in tie-dye?", answer: "Soda ash (sodium carbonate) is a fixative that raises the pH to allow fiber-reactive dyes like Procion MX to bond permanently with cotton fibers." },
    { question: "Can I tie-dye polyester?", answer: "Standard fiber-reactive dyes only work on natural fibers like cotton. Polyester requires disperse dyes and high heat. Cotton or cotton blends with at least 60 percent cotton work best." },
  ],
  formula: "Total Dye (tsp) = Total Fabric Weight x Dye Rate x Intensity Multiplier; Dye Per Color = Total Dye / Number of Colors; Soda Ash = Fabric Weight x 0.2 tsp per oz",
};
