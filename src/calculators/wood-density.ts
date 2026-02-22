import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const woodDensityCalculator: CalculatorDefinition = {
  slug: "wood-density-calculator",
  title: "Wood Density/Weight Calculator",
  description: "Free wood density and weight calculator. Estimate the weight of lumber based on species, dimensions, and moisture content.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wood density calculator", "wood weight calculator", "lumber weight", "board weight calculator", "specific gravity wood"],
  variants: [
    {
      id: "weight-from-dimensions",
      name: "Weight from Dimensions",
      description: "Calculate weight of a board from its dimensions and species",
      fields: [
        { name: "length", label: "Length (inches)", type: "number", placeholder: "e.g. 96" },
        { name: "width", label: "Width (inches)", type: "number", placeholder: "e.g. 6" },
        { name: "thickness", label: "Thickness (inches)", type: "number", placeholder: "e.g. 0.75" },
        {
          name: "species",
          label: "Wood Species (Specific Gravity)",
          type: "select",
          options: [
            { label: "Balsa (0.16)", value: "0.16" },
            { label: "Western Red Cedar (0.32)", value: "0.32" },
            { label: "Pine / Spruce (0.42)", value: "0.42" },
            { label: "Douglas Fir (0.48)", value: "0.48" },
            { label: "Poplar (0.42)", value: "0.42" },
            { label: "Cherry (0.50)", value: "0.50" },
            { label: "Walnut (0.55)", value: "0.55" },
            { label: "Red Oak (0.63)", value: "0.63" },
            { label: "White Oak (0.68)", value: "0.68" },
            { label: "Hard Maple (0.63)", value: "0.63" },
            { label: "Hickory (0.72)", value: "0.72" },
            { label: "Ipe (1.05)", value: "1.05" },
          ],
        },
        { name: "mc", label: "Moisture Content (%)", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const thickness = inputs.thickness as number;
        const sg = parseFloat(inputs.species as string);
        const mc = inputs.mc as number;
        if (!length || !width || !thickness || !sg) return null;
        const moisturePct = mc || 12;
        const volumeCuIn = length * width * thickness;
        const volumeCuFt = volumeCuIn / 1728;
        const ovenDryDensity = sg * 62.4;
        const adjustedDensity = ovenDryDensity * (1 + moisturePct / 100);
        const weightLbs = volumeCuFt * adjustedDensity;
        const weightKg = weightLbs * 0.453592;
        const boardFeet = (length * width * thickness) / 144;
        return {
          primary: { label: "Estimated Weight", value: `${formatNumber(weightLbs, 2)} lbs` },
          details: [
            { label: "Weight (kg)", value: `${formatNumber(weightKg, 2)} kg` },
            { label: "Volume", value: `${formatNumber(volumeCuIn, 1)} cubic inches` },
            { label: "Volume (cu ft)", value: `${formatNumber(volumeCuFt, 3)} cubic feet` },
            { label: "Specific Gravity", value: formatNumber(sg, 2) },
            { label: "Density at MC", value: `${formatNumber(adjustedDensity, 1)} lbs/cu ft` },
            { label: "Moisture Content", value: `${formatNumber(moisturePct, 1)}%` },
            { label: "Board Feet", value: formatNumber(boardFeet, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["board-footage-calculator", "wood-shrinkage-calculator", "wood-moisture-calculator"],
  faq: [
    { question: "How is wood density measured?", answer: "Wood density is typically expressed as specific gravity, which is the ratio of wood density to water density. A value of 0.50 means the wood is half as dense as water." },
    { question: "Does moisture content affect weight?", answer: "Yes, significantly. Green lumber can weigh twice as much as kiln-dried lumber. The calculator accounts for moisture content in the weight estimate." },
  ],
  formula: "Weight = Volume x Density | Density = SG x 62.4 x (1 + MC/100) | Volume = L x W x T",
};
