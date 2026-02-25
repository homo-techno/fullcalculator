import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const squareFootGardenCalculator: CalculatorDefinition = {
  slug: "square-foot-garden-calculator",
  title: "Square Foot Garden Planner",
  description: "Free square foot garden planner. Calculate how many plants fit in each square foot using the square foot gardening method.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["square foot garden planner", "square foot gardening calculator", "SFG planner", "plants per square foot", "intensive planting calculator"],
  variants: [
    {
      id: "bed-planner",
      name: "Bed Layout Planner",
      description: "Plan a square foot garden bed with multiple crops",
      fields: [
        { name: "length", label: "Bed Length (feet)", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "width", label: "Bed Width (feet)", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "crop", label: "Primary Crop", type: "select", options: [
          { label: "Tomatoes (1 per sq ft)", value: "1" },
          { label: "Peppers (1 per sq ft)", value: "1" },
          { label: "Lettuce (4 per sq ft)", value: "4" },
          { label: "Spinach (9 per sq ft)", value: "9" },
          { label: "Carrots (16 per sq ft)", value: "16" },
          { label: "Radishes (16 per sq ft)", value: "16" },
          { label: "Beans (9 per sq ft)", value: "9" },
          { label: "Onions (9 per sq ft)", value: "9" },
          { label: "Peas (8 per sq ft)", value: "8" },
          { label: "Beets (9 per sq ft)", value: "9" },
          { label: "Corn (4 per sq ft - needs 9+ sq ft)", value: "4" },
          { label: "Squash (1 per 2 sq ft)", value: "0.5" },
          { label: "Cucumbers (2 per sq ft, trellised)", value: "2" },
          { label: "Herbs - basil (4 per sq ft)", value: "4" },
          { label: "Herbs - small (4 per sq ft)", value: "4" },
          { label: "Broccoli (1 per sq ft)", value: "1" },
          { label: "Cabbage (1 per sq ft)", value: "1" },
        ], defaultValue: "4" },
      ],
      calculate: (inputs) => {
        const length = (inputs.length as number) || 4;
        const width = (inputs.width as number) || 4;
        const plantsPerSqFt = parseFloat(inputs.crop as string) || 4;

        const totalSqFt = length * width;
        const totalPlants = Math.floor(totalSqFt * plantsPerSqFt);
        const soilCuFt = totalSqFt * 0.5;
        const soilCuYd = soilCuFt / 27;

        return {
          primary: { label: "Total Plants", value: `${totalPlants}` },
          details: [
            { label: "Total squares", value: `${totalSqFt} sq ft` },
            { label: "Plants per square", value: plantsPerSqFt >= 1 ? `${plantsPerSqFt}` : `1 plant per ${formatNumber(1 / plantsPerSqFt)} sq ft` },
            { label: "Bed dimensions", value: `${length} \u00D7 ${width} ft` },
            { label: "Soil needed (6\" deep)", value: `${formatNumber(soilCuFt, 1)} cu ft (${formatNumber(soilCuYd, 2)} cu yd)` },
            { label: "Grid squares per side", value: `${length} \u00D7 ${width}` },
          ],
          note: "In square foot gardening, divide each bed into 1\u00D71 ft squares with a grid. Plant a different crop in each square for diversity and companion planting benefits.",
        };
      },
    },
    {
      id: "mixed-bed",
      name: "Mixed Crop Bed",
      description: "Plan a bed with multiple crops in different squares",
      fields: [
        { name: "totalSquares", label: "Total Squares in Bed", type: "number", placeholder: "e.g. 16", defaultValue: 16 },
        { name: "tomatoSq", label: "Squares for Tomatoes (1/sq)", type: "number", placeholder: "e.g. 2", defaultValue: 0 },
        { name: "pepperSq", label: "Squares for Peppers (1/sq)", type: "number", placeholder: "e.g. 2", defaultValue: 0 },
        { name: "lettuceSq", label: "Squares for Lettuce (4/sq)", type: "number", placeholder: "e.g. 4", defaultValue: 0 },
        { name: "carrotSq", label: "Squares for Carrots (16/sq)", type: "number", placeholder: "e.g. 4", defaultValue: 0 },
        { name: "herbSq", label: "Squares for Herbs (4/sq)", type: "number", placeholder: "e.g. 4", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const total = (inputs.totalSquares as number) || 16;
        const tomato = (inputs.tomatoSq as number) || 0;
        const pepper = (inputs.pepperSq as number) || 0;
        const lettuce = (inputs.lettuceSq as number) || 0;
        const carrot = (inputs.carrotSq as number) || 0;
        const herb = (inputs.herbSq as number) || 0;

        const usedSquares = tomato + pepper + lettuce + carrot + herb;
        const remaining = total - usedSquares;

        const tomatoPlants = tomato * 1;
        const pepperPlants = pepper * 1;
        const lettucePlants = lettuce * 4;
        const carrotPlants = carrot * 16;
        const herbPlants = herb * 4;
        const totalPlants = tomatoPlants + pepperPlants + lettucePlants + carrotPlants + herbPlants;

        if (totalPlants === 0) return null;

        return {
          primary: { label: "Total Plants", value: `${totalPlants}` },
          details: [
            { label: "Tomatoes", value: `${tomatoPlants} plants (${tomato} squares)` },
            { label: "Peppers", value: `${pepperPlants} plants (${pepper} squares)` },
            { label: "Lettuce", value: `${lettucePlants} plants (${lettuce} squares)` },
            { label: "Carrots", value: `${carrotPlants} plants (${carrot} squares)` },
            { label: "Herbs", value: `${herbPlants} plants (${herb} squares)` },
            { label: "Squares used / available", value: `${usedSquares} / ${total} (${remaining} remaining)` },
          ],
          note: remaining < 0
            ? "Warning: You have allocated more squares than available. Reduce crop squares."
            : "Consider companion planting: tomatoes with basil, carrots with onions, lettuce with chives.",
        };
      },
    },
  ],
  relatedSlugs: ["vegetable-garden-size-calculator", "garden-row-spacing-calculator", "soil-volume-calculator"],
  faq: [
    { question: "What is square foot gardening?", answer: "Square foot gardening (SFG) is an intensive planting method where raised beds are divided into 1\u00D71 ft squares. Each square is planted with a specific number of plants based on size. It maximizes yield in small spaces." },
    { question: "How many plants per square foot?", answer: "It depends on plant size: Extra large (tomatoes, peppers, broccoli) = 1 per sq ft, Large (lettuce, basil) = 4, Medium (beans, beets, onions) = 9, Small (carrots, radishes) = 16." },
  ],
  formula: "Total Plants = Number of Squares \u00D7 Plants per Square Foot",
};
