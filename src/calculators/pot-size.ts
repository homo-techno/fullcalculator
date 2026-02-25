import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const potSizeCalculator: CalculatorDefinition = {
  slug: "pot-size-calculator",
  title: "Plant Pot Size Calculator",
  description: "Free plant pot size calculator. Find the right container size for your plants based on plant type, root ball size, and growth requirements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pot size calculator", "plant container size", "what size pot for plant", "planter size calculator", "container gardening"],
  variants: [
    {
      id: "by-plant",
      name: "Pot Size by Plant Type",
      description: "Find the recommended pot size for different plant types",
      fields: [
        { name: "plantType", label: "Plant Type", type: "select", options: [
          { label: "Small herbs (basil, cilantro)", value: "small-herb" },
          { label: "Large herbs (rosemary, sage)", value: "large-herb" },
          { label: "Tomatoes", value: "tomato" },
          { label: "Peppers", value: "pepper" },
          { label: "Lettuce / Greens", value: "lettuce" },
          { label: "Strawberries", value: "strawberry" },
          { label: "Small flowers (annuals)", value: "small-flower" },
          { label: "Large flowers (perennials)", value: "large-flower" },
          { label: "Small houseplant", value: "small-house" },
          { label: "Medium houseplant", value: "medium-house" },
          { label: "Large houseplant / tree", value: "large-house" },
        ], defaultValue: "tomato" },
        { name: "numPlants", label: "Number of Plants", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const plantType = inputs.plantType as string;
        const numPlants = (inputs.numPlants as number) || 1;

        const potData: Record<string, { minDiam: number; minDepth: number; gallons: number; label: string }> = {
          "small-herb": { minDiam: 6, minDepth: 6, gallons: 1, label: "Small herbs" },
          "large-herb": { minDiam: 10, minDepth: 10, gallons: 3, label: "Large herbs" },
          "tomato": { minDiam: 18, minDepth: 18, gallons: 10, label: "Tomatoes" },
          "pepper": { minDiam: 14, minDepth: 12, gallons: 5, label: "Peppers" },
          "lettuce": { minDiam: 8, minDepth: 6, gallons: 1.5, label: "Lettuce / Greens" },
          "strawberry": { minDiam: 10, minDepth: 8, gallons: 2, label: "Strawberries" },
          "small-flower": { minDiam: 8, minDepth: 8, gallons: 1.5, label: "Small flowers" },
          "large-flower": { minDiam: 14, minDepth: 12, gallons: 5, label: "Large flowers" },
          "small-house": { minDiam: 6, minDepth: 6, gallons: 1, label: "Small houseplant" },
          "medium-house": { minDiam: 10, minDepth: 10, gallons: 3, label: "Medium houseplant" },
          "large-house": { minDiam: 18, minDepth: 18, gallons: 10, label: "Large houseplant" },
        };

        const data = potData[plantType];
        if (!data) return null;

        const totalGallons = data.gallons * numPlants;
        const totalSoilCuFt = totalGallons * 0.134;

        return {
          primary: { label: "Minimum Pot Size", value: `${data.minDiam}\" diameter` },
          details: [
            { label: "Minimum depth", value: `${data.minDepth} inches` },
            { label: "Volume per pot", value: `${data.gallons} gallons` },
            { label: "Total soil needed", value: `${formatNumber(totalSoilCuFt, 1)} cu ft (${numPlants} pot${numPlants > 1 ? "s" : ""})` },
            { label: "Plant type", value: data.label },
          ],
          note: "Always choose a pot with drainage holes. Going one size larger than minimum is recommended for better root growth.",
        };
      },
    },
    {
      id: "by-rootball",
      name: "Pot Size by Root Ball",
      description: "Calculate the right pot size when transplanting",
      fields: [
        { name: "rootDiam", label: "Current Root Ball Diameter (inches)", type: "number", placeholder: "e.g. 6" },
        { name: "rootDepth", label: "Current Root Ball Depth (inches)", type: "number", placeholder: "e.g. 6" },
        { name: "sizeUp", label: "Size Up By", type: "select", options: [
          { label: "2 inches (standard repot)", value: "2" },
          { label: "4 inches (larger jump)", value: "4" },
          { label: "6 inches (significant upgrade)", value: "6" },
        ], defaultValue: "2" },
      ],
      calculate: (inputs) => {
        const rootDiam = inputs.rootDiam as number;
        const rootDepth = inputs.rootDepth as number;
        const sizeUp = parseInt(inputs.sizeUp as string) || 2;
        if (!rootDiam || !rootDepth) return null;

        const newDiam = rootDiam + sizeUp;
        const newDepth = rootDepth + sizeUp;
        const newRadius = newDiam / 2;
        const volumeCuIn = Math.PI * newRadius * newRadius * newDepth;
        const volumeGal = volumeCuIn / 231;

        return {
          primary: { label: "New Pot Size", value: `${newDiam}\" diameter × ${newDepth}\" deep` },
          details: [
            { label: "Current root ball", value: `${rootDiam}\" \u00D7 ${rootDepth}\"` },
            { label: "Size increase", value: `+${sizeUp} inches` },
            { label: "Pot volume", value: `${formatNumber(volumeGal, 1)} gallons` },
            { label: "Soil needed", value: `${formatNumber(volumeGal * 0.134, 1)} cu ft` },
          ],
          note: "Do not over-pot: jumping too many sizes can lead to overwatering and root rot. Repot when roots circle the bottom or emerge from drainage holes.",
        };
      },
    },
  ],
  relatedSlugs: ["soil-volume-calculator", "indoor-plant-light-calculator", "watering-schedule-calculator"],
  faq: [
    { question: "What size pot does a tomato plant need?", answer: "Tomatoes need at least a 5-gallon container (18\" diameter). Larger indeterminate varieties do best in 10-15 gallon pots. The bigger the pot, the better the yield." },
    { question: "How do I know when to repot a plant?", answer: "Repot when roots grow out of drainage holes, the plant dries out quickly after watering, growth slows despite proper care, or you see roots circling the soil surface." },
  ],
  formula: "New Pot = Root Ball Diameter + 2-4\" | Volume (gal) = \u03C0 \u00D7 r\u00B2 \u00D7 depth / 231",
};
