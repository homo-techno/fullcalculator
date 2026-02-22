import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const woodExpansionCalculator: CalculatorDefinition = {
  slug: "wood-expansion-calculator",
  title: "Wood Expansion Calculator",
  description: "Free wood expansion calculator. Predict seasonal wood movement to plan for expansion gaps in tabletops, flooring, and panel construction.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wood expansion calculator", "seasonal wood movement", "expansion gap calculator", "wood contraction", "tabletop movement"],
  variants: [
    {
      id: "seasonal-movement",
      name: "Seasonal Movement",
      description: "Calculate wood expansion and contraction across seasons",
      fields: [
        { name: "boardWidth", label: "Board/Panel Width (inches)", type: "number", placeholder: "e.g. 24" },
        {
          name: "species",
          label: "Wood Species (Tangential Shrinkage %)",
          type: "select",
          options: [
            { label: "Red Oak (8.6%)", value: "8.6" },
            { label: "White Oak (6.6%)", value: "6.6" },
            { label: "Hard Maple (9.9%)", value: "9.9" },
            { label: "Cherry (7.1%)", value: "7.1" },
            { label: "Walnut (7.8%)", value: "7.8" },
            { label: "Pine (7.7%)", value: "7.7" },
            { label: "Douglas Fir (7.6%)", value: "7.6" },
            { label: "Poplar (8.2%)", value: "8.2" },
          ],
        },
        {
          name: "sawType",
          label: "Saw Cut Type",
          type: "select",
          options: [
            { label: "Flat Sawn (tangential)", value: "1.0" },
            { label: "Quarter Sawn (radial)", value: "0.55" },
            { label: "Rift Sawn", value: "0.75" },
          ],
        },
        { name: "mcLow", label: "Winter MC (dry season %)", type: "number", placeholder: "e.g. 6" },
        { name: "mcHigh", label: "Summer MC (humid season %)", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const boardWidth = inputs.boardWidth as number;
        const totalShrinkage = parseFloat(inputs.species as string);
        const sawFactor = parseFloat(inputs.sawType as string);
        const mcLow = inputs.mcLow as number;
        const mcHigh = inputs.mcHigh as number;
        if (!boardWidth || !totalShrinkage || !mcLow || !mcHigh) return null;
        const fsp = 28;
        const effectiveShrinkage = totalShrinkage * sawFactor;
        const mcChange = Math.abs(mcHigh - mcLow);
        const movementPercent = effectiveShrinkage * mcChange / fsp;
        const totalMovement = boardWidth * (movementPercent / 100);
        const gapNeeded = totalMovement / 2;
        const winterWidth = boardWidth * (1 - effectiveShrinkage * mcLow / fsp / 100);
        const summerWidth = boardWidth * (1 - effectiveShrinkage * (fsp - mcHigh) / fsp / 100);
        const widthDifference = Math.abs(summerWidth - winterWidth);
        return {
          primary: { label: "Total Seasonal Movement", value: `${formatNumber(totalMovement, 4)} inches` },
          details: [
            { label: "Movement Percentage", value: `${formatNumber(movementPercent, 3)}%` },
            { label: "Expansion Gap Needed (each side)", value: `${formatNumber(gapNeeded, 4)} inches` },
            { label: "MC Range", value: `${formatNumber(mcLow, 0)}% - ${formatNumber(mcHigh, 0)}%` },
            { label: "MC Swing", value: `${formatNumber(mcChange, 0)}%` },
            { label: "Effective Shrinkage", value: `${formatNumber(effectiveShrinkage, 2)}%` },
            { label: "Board Width", value: `${formatNumber(boardWidth, 2)} inches` },
            { label: "Movement per Inch of Width", value: `${formatNumber(totalMovement / boardWidth * 1000, 2)} thou/inch` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wood-shrinkage-calculator", "wood-moisture-calculator", "wood-density-calculator"],
  faq: [
    { question: "How much do I need for an expansion gap?", answer: "Calculate the total seasonal movement and divide by 2 for each side. For a 24-inch wide red oak tabletop, expect about 1/8 inch total seasonal movement." },
    { question: "Does quarter-sawn wood move less?", answer: "Yes. Quarter-sawn lumber moves about 55% as much as flat-sawn lumber. This is why quarter-sawn wood is preferred for wide panels and fine furniture." },
  ],
  formula: "Movement = Width x (Shrinkage% x MC_change / FSP) / 100 | Gap = Movement / 2",
};
