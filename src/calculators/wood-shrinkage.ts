import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const woodShrinkageCalculator: CalculatorDefinition = {
  slug: "wood-shrinkage-calculator",
  title: "Wood Shrinkage Calculator",
  description: "Free wood shrinkage calculator. Estimate dimensional changes in wood due to moisture content changes across different species.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wood shrinkage calculator", "lumber shrinkage", "wood dimensional change", "moisture shrinkage", "wood movement calculator"],
  variants: [
    {
      id: "shrinkage",
      name: "Wood Shrinkage",
      description: "Calculate shrinkage based on moisture content change",
      fields: [
        { name: "currentWidth", label: "Current Width (inches)", type: "number", placeholder: "e.g. 8" },
        { name: "initialMC", label: "Initial Moisture Content (%)", type: "number", placeholder: "e.g. 20" },
        { name: "finalMC", label: "Final Moisture Content (%)", type: "number", placeholder: "e.g. 8" },
        {
          name: "species",
          label: "Wood Species",
          type: "select",
          options: [
            { label: "Red Oak (Tangential 8.6%)", value: "8.6" },
            { label: "White Oak (Tangential 6.6%)", value: "6.6" },
            { label: "Hard Maple (Tangential 9.9%)", value: "9.9" },
            { label: "Cherry (Tangential 7.1%)", value: "7.1" },
            { label: "Walnut (Tangential 7.8%)", value: "7.8" },
            { label: "Pine (Tangential 7.7%)", value: "7.7" },
            { label: "Douglas Fir (Tangential 7.6%)", value: "7.6" },
            { label: "Poplar (Tangential 8.2%)", value: "8.2" },
          ],
        },
        {
          name: "direction",
          label: "Grain Direction",
          type: "select",
          options: [
            { label: "Tangential (flat sawn)", value: "tangential" },
            { label: "Radial (quarter sawn)", value: "radial" },
          ],
        },
      ],
      calculate: (inputs) => {
        const currentWidth = inputs.currentWidth as number;
        const initialMC = inputs.initialMC as number;
        const finalMC = inputs.finalMC as number;
        const totalTangentialShrinkage = parseFloat(inputs.species as string);
        const direction = inputs.direction as string;
        if (!currentWidth || initialMC === undefined || finalMC === undefined || !totalTangentialShrinkage) return null;
        const fsp = 28;
        const effectiveInitial = Math.min(initialMC, fsp);
        const effectiveFinal = Math.min(finalMC, fsp);
        const totalShrinkage = direction === "radial" ? totalTangentialShrinkage * 0.55 : totalTangentialShrinkage;
        const shrinkagePercent = totalShrinkage * (effectiveInitial - effectiveFinal) / fsp;
        const dimensionChange = currentWidth * (shrinkagePercent / 100);
        const finalWidth = currentWidth - dimensionChange;
        return {
          primary: { label: "Dimension Change", value: `${formatNumber(Math.abs(dimensionChange), 4)} inches` },
          details: [
            { label: "Final Width", value: `${formatNumber(finalWidth, 4)} inches` },
            { label: "Shrinkage Percent", value: `${formatNumber(shrinkagePercent, 2)}%` },
            { label: "Total Species Shrinkage", value: `${formatNumber(totalShrinkage, 1)}%` },
            { label: "Effective Initial MC", value: `${formatNumber(effectiveInitial, 1)}%` },
            { label: "Effective Final MC", value: `${formatNumber(effectiveFinal, 1)}%` },
            { label: "Direction", value: direction === "radial" ? "Radial (quarter sawn)" : "Tangential (flat sawn)" },
            { label: "Movement Type", value: shrinkagePercent >= 0 ? "Shrinking" : "Expanding" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wood-moisture-calculator", "wood-expansion-calculator", "wood-density-calculator"],
  faq: [
    { question: "What is the fiber saturation point?", answer: "The fiber saturation point (FSP) is approximately 28% moisture content. Above this point, wood does not change dimensions as free water is lost. Dimensional changes only occur below FSP." },
    { question: "Why does tangential shrinkage differ from radial?", answer: "Tangential shrinkage (flat sawn) is roughly twice radial shrinkage (quarter sawn) due to the orientation of wood cells and growth rings. Quarter-sawn lumber is more dimensionally stable." },
  ],
  formula: "Shrinkage % = Total Shrinkage % x (MC_initial - MC_final) / FSP | Dimension Change = Width x Shrinkage%",
};
