import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const potteryGlazeCalculator: CalculatorDefinition = {
  slug: "pottery-glaze-calculator",
  title: "Pottery Glaze Recipe Calculator",
  description: "Free online pottery glaze recipe calculator. Scale glaze recipes, calculate material weights, and convert between batch sizes.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pottery glaze calculator", "glaze recipe calculator", "ceramic glaze calculator", "glaze batch calculator", "pottery recipe scaler"],
  variants: [
    {
      id: "batch-scale",
      name: "Batch Size Scaler",
      description: "Scale a glaze recipe to a different batch size",
      fields: [
        { name: "originalBatch", label: "Original Recipe Total (grams)", type: "number", placeholder: "e.g. 1000" },
        { name: "targetBatch", label: "Target Batch Size (grams)", type: "number", placeholder: "e.g. 3000" },
        { name: "ingredient1", label: "Ingredient 1 Amount (grams)", type: "number", placeholder: "e.g. 400" },
        { name: "ingredient2", label: "Ingredient 2 Amount (grams)", type: "number", placeholder: "e.g. 300" },
        { name: "ingredient3", label: "Ingredient 3 Amount (grams)", type: "number", placeholder: "e.g. 200" },
        { name: "ingredient4", label: "Ingredient 4 Amount (grams, optional)", type: "number", placeholder: "e.g. 100" },
      ],
      calculate: (inputs) => {
        const original = parseFloat(inputs.originalBatch as string) || 0;
        const target = parseFloat(inputs.targetBatch as string) || 0;
        const ing1 = parseFloat(inputs.ingredient1 as string) || 0;
        const ing2 = parseFloat(inputs.ingredient2 as string) || 0;
        const ing3 = parseFloat(inputs.ingredient3 as string) || 0;
        const ing4 = parseFloat(inputs.ingredient4 as string) || 0;
        if (!original || !target) return null;

        const factor = target / original;
        const ingredients = [ing1, ing2, ing3, ing4].filter((i) => i > 0);
        const scaled = ingredients.map((i) => i * factor);
        const totalScaled = scaled.reduce((a, b) => a + b, 0);

        const details = scaled.map((s, i) => ({
          label: `Ingredient ${i + 1}`,
          value: `${formatNumber(s, 1)} g (was ${formatNumber(ingredients[i], 1)} g)`,
        }));

        return {
          primary: { label: "Scaled Batch Total", value: `${formatNumber(totalScaled, 1)} g` },
          details: [
            { label: "Scale factor", value: `${formatNumber(factor, 3)}x` },
            ...details,
          ],
          note: "Water and additives (colorants, opacifiers) are typically added as percentages on top of the dry batch weight.",
        };
      },
    },
    {
      id: "coverage",
      name: "Glaze Coverage Estimator",
      description: "Estimate glaze needed based on surface area of pottery pieces",
      fields: [
        { name: "pieceType", label: "Piece Type", type: "select", options: [
          { label: "Small mug (80 sq in)", value: "80" },
          { label: "Large mug (120 sq in)", value: "120" },
          { label: "Small bowl (100 sq in)", value: "100" },
          { label: "Large bowl (200 sq in)", value: "200" },
          { label: "Dinner plate (140 sq in)", value: "140" },
          { label: "Small vase (150 sq in)", value: "150" },
          { label: "Large vase (300 sq in)", value: "300" },
          { label: "Custom area", value: "0" },
        ], defaultValue: "80" },
        { name: "customArea", label: "Custom Surface Area (sq in, if Custom)", type: "number", placeholder: "e.g. 100" },
        { name: "numPieces", label: "Number of Pieces", type: "number", placeholder: "e.g. 6", defaultValue: 1 },
        { name: "coats", label: "Number of Coats", type: "select", options: [
          { label: "1 coat (thin)", value: "1" },
          { label: "2 coats (standard dipping)", value: "2" },
          { label: "3 coats (brushing/thick)", value: "3" },
        ], defaultValue: "2" },
        { name: "glazeType", label: "Application Method", type: "select", options: [
          { label: "Dipping (5 g/sq in)", value: "5" },
          { label: "Brushing (3 g/sq in)", value: "3" },
          { label: "Spraying (4 g/sq in)", value: "4" },
        ], defaultValue: "5" },
      ],
      calculate: (inputs) => {
        const pieceArea = parseFloat(inputs.pieceType as string) || 0;
        const customArea = parseFloat(inputs.customArea as string) || 0;
        const numPieces = parseFloat(inputs.numPieces as string) || 1;
        const coats = parseFloat(inputs.coats as string) || 2;
        const glazeRate = parseFloat(inputs.glazeType as string) || 5;

        const area = pieceArea > 0 ? pieceArea : customArea;
        if (!area) return null;

        const totalArea = area * numPieces;
        const glazeNeeded = totalArea * glazeRate * (coats / 2);
        const glazeWithWaste = glazeNeeded * 1.15;
        const glazeLbs = glazeWithWaste / 453.6;

        return {
          primary: { label: "Dry Glaze Needed", value: `${formatNumber(glazeWithWaste, 0)} g` },
          details: [
            { label: "Total surface area", value: `${formatNumber(totalArea, 0)} sq in` },
            { label: "Glaze before waste", value: `${formatNumber(glazeNeeded, 0)} g` },
            { label: "Weight in pounds", value: `${formatNumber(glazeLbs, 2)} lbs` },
            { label: "Number of pieces", value: formatNumber(numPieces, 0) },
            { label: "Coats", value: formatNumber(coats, 0) },
            { label: "Waste allowance", value: "15%" },
          ],
          note: "Mix dry glaze materials with water (typically 40-60% water by weight of dry materials) to create the liquid glaze for dipping or brushing.",
        };
      },
    },
  ],
  relatedSlugs: ["ratio-calculator", "unit-converter"],
  faq: [
    { question: "How do I scale a glaze recipe?", answer: "Multiply each ingredient by the scale factor (target batch / original batch). If the original recipe totals 1000g and you want 3000g, multiply each ingredient by 3." },
    { question: "How much glaze do I need per pot?", answer: "A standard mug needs about 80-120 sq in of glaze coverage. At typical dipping thickness, plan for about 400-600g of mixed (wet) glaze per mug, or about 200-300g dry weight for 2 coats." },
    { question: "What is the water ratio for mixing glaze?", answer: "Most glaze recipes call for 40-60% water by weight of dry ingredients. For example, 1000g of dry materials mixed with 400-600g of water. The consistency should be like heavy cream." },
  ],
  formula: "Scaled Amount = Original Amount × (Target Batch / Original Batch)",
};
