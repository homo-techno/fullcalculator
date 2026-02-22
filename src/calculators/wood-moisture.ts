import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const woodMoistureCalculator: CalculatorDefinition = {
  slug: "wood-moisture-calculator",
  title: "Wood Moisture Content Calculator",
  description: "Free wood moisture content calculator. Calculate moisture content from oven-dry weight or estimate equilibrium moisture content from conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wood moisture content calculator", "MC calculator", "equilibrium moisture content", "wood drying calculator", "lumber moisture"],
  variants: [
    {
      id: "oven-dry",
      name: "Oven-Dry Method",
      description: "Calculate moisture content from wet and oven-dry weights",
      fields: [
        { name: "wetWeight", label: "Initial (Wet) Weight (grams or lbs)", type: "number", placeholder: "e.g. 500" },
        { name: "dryWeight", label: "Oven-Dry Weight (grams or lbs)", type: "number", placeholder: "e.g. 420" },
        {
          name: "targetMC",
          label: "Target Moisture Content",
          type: "select",
          options: [
            { label: "6-8% (indoor furniture)", value: "7" },
            { label: "9-14% (indoor general)", value: "12" },
            { label: "12-18% (outdoor, covered)", value: "15" },
            { label: "15-20% (outdoor, exposed)", value: "18" },
          ],
        },
      ],
      calculate: (inputs) => {
        const wetWeight = inputs.wetWeight as number;
        const dryWeight = inputs.dryWeight as number;
        const targetMC = parseFloat(inputs.targetMC as string);
        if (!wetWeight || !dryWeight) return null;
        const waterWeight = wetWeight - dryWeight;
        const moistureContent = (waterWeight / dryWeight) * 100;
        const targetWeight = dryWeight * (1 + targetMC / 100);
        const weightToLose = wetWeight - targetWeight;
        const percentToLose = ((wetWeight - targetWeight) / wetWeight) * 100;
        const atTarget = Math.abs(moistureContent - targetMC) < 1;
        const needsDrying = moistureContent > targetMC;
        return {
          primary: { label: "Moisture Content", value: `${formatNumber(moistureContent, 1)}%` },
          details: [
            { label: "Water Weight", value: `${formatNumber(waterWeight, 1)} (same unit as input)` },
            { label: "Target MC", value: `${formatNumber(targetMC, 0)}%` },
            { label: "Target Weight", value: formatNumber(targetWeight, 1) },
            { label: "Weight to Lose", value: weightToLose > 0 ? formatNumber(weightToLose, 1) : "Already at/below target" },
            { label: "Percent Weight to Lose", value: percentToLose > 0 ? `${formatNumber(percentToLose, 1)}%` : "None" },
            { label: "Status", value: atTarget ? "At target" : needsDrying ? "Needs drying" : "Below target" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wood-shrinkage-calculator", "wood-expansion-calculator", "wood-density-calculator"],
  faq: [
    { question: "What moisture content should wood be for furniture?", answer: "For indoor furniture, wood should be dried to 6-8% moisture content. This matches the equilibrium moisture content of most heated indoor environments." },
    { question: "How does a pin moisture meter work?", answer: "Pin meters measure electrical resistance between two pins driven into the wood. Higher moisture content means lower resistance. They are accurate in the 6-30% range." },
  ],
  formula: "MC% = ((Wet Weight - Dry Weight) / Dry Weight) x 100 | Target Weight = Dry Weight x (1 + Target MC/100)",
};
