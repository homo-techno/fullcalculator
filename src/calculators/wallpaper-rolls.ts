import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wallpaperRollsCalculator: CalculatorDefinition = {
  slug: "wallpaper-rolls-calculator",
  title: "Wallpaper Rolls Calculator",
  description: "Free wallpaper rolls calculator. Calculate how many rolls of wallpaper you need for a room with pattern repeat waste included.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wallpaper rolls calculator", "how many rolls of wallpaper", "wallpaper quantity calculator", "wallpaper pattern repeat", "wallpaper estimator tool"],
  variants: [
    {
      id: "calc",
      name: "Calculate Wallpaper Rolls",
      description: "Calculate rolls needed with pattern repeat waste",
      fields: [
        { name: "length", label: "Room Length (ft)", type: "number", placeholder: "e.g. 15" },
        { name: "width", label: "Room Width (ft)", type: "number", placeholder: "e.g. 12" },
        { name: "height", label: "Wall Height (ft)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "doors", label: "Number of Doors", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
        { name: "windows", label: "Number of Windows", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = (inputs.height as number) || 8;
        const doors = (inputs.doors as number) || 0;
        const windows = (inputs.windows as number) || 0;
        if (!length || !width) return null;

        const perimeter = 2 * (length + width);
        const grossWallArea = perimeter * height;
        const doorArea = doors * 20;
        const windowArea = windows * 15;
        const netWallArea = grossWallArea - doorArea - windowArea;

        // Standard American single roll: 27" wide x 27 ft long
        // Actual coverage: 27/12 * 27 = 60.75 sq ft gross
        const rollWidth = 27; // inches
        const rollLength = 27; // feet
        const grossRollArea = (rollWidth / 12) * rollLength; // ~60.75 sq ft
        // Usable area after 15% pattern repeat waste
        const usableRollArea = grossRollArea * 0.85; // ~51.6 sq ft

        const rollsExact = netWallArea / usableRollArea;
        const rollsNeeded = Math.ceil(rollsExact);

        // Euro rolls (common alternative): 20.5" wide x 33 ft
        const euroRollArea = (20.5 / 12) * 33 * 0.85;
        const euroRolls = Math.ceil(netWallArea / euroRollArea);

        return {
          primary: { label: "Wallpaper Rolls Needed", value: `${rollsNeeded} rolls` },
          details: [
            { label: "Room dimensions", value: `${length} ft x ${width} ft x ${height} ft` },
            { label: "Room perimeter", value: `${formatNumber(perimeter)} ft` },
            { label: "Gross wall area", value: `${formatNumber(grossWallArea)} sq ft` },
            { label: "Deducted (doors + windows)", value: `${formatNumber(doorArea + windowArea)} sq ft` },
            { label: "Net wall area", value: `${formatNumber(netWallArea)} sq ft` },
            { label: "Standard roll coverage", value: `~${formatNumber(usableRollArea, 1)} sq ft (with waste)` },
            { label: "Standard rolls (27\" x 27')", value: `${rollsNeeded}` },
            { label: "Euro rolls (20.5\" x 33')", value: `${euroRolls}` },
            { label: "Pattern repeat waste", value: "15% included" },
          ],
          note: "Based on standard American single rolls (27\" x 27', ~57 usable sq ft after 15% pattern repeat waste). Euro rolls are 20.5\" x 33'. Large pattern repeats may require more waste. Always buy an extra roll.",
        };
      },
    },
  ],
  relatedSlugs: ["wallpaper-calculator", "paint-quantity-calculator", "square-footage-calculator"],
  faq: [
    { question: "How many rolls of wallpaper do I need for a room?", answer: "Calculate the net wall area (perimeter x height minus doors and windows), then divide by the usable coverage per roll (~51-57 sq ft for standard rolls after pattern waste). A typical 12x12 room needs 6-8 single rolls." },
    { question: "What is pattern repeat waste?", answer: "Pattern repeat is the distance between repeating design elements. You must align patterns between strips, which creates waste. Simple textures waste 5-10%, medium patterns 10-15%, and large patterns 15-25%. Budget 15% waste as a safe average." },
    { question: "What is the difference between single and double rolls?", answer: "A single roll is 27\" x 15' or 27\" x 27' depending on the standard. A double roll contains twice the paper. Most wallpaper is sold in double rolls (even if priced per single roll) to reduce waste when cutting strips." },
  ],
  formula: "Rolls = (Perimeter x Height - Doors x 20 - Windows x 15) / (Roll Area x 0.85)",
};
