import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wallpaperCalculator: CalculatorDefinition = {
  slug: "wallpaper-calculator",
  title: "Wallpaper Calculator",
  description: "Free wallpaper calculator. Calculate how many rolls of wallpaper you need for a room based on dimensions and pattern repeat.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wallpaper calculator", "wallpaper rolls calculator", "how much wallpaper", "wallpaper estimator"],
  variants: [
    {
      id: "rolls",
      name: "Calculate Wallpaper Rolls",
      fields: [
        { name: "length", label: "Room Length (ft)", type: "number", placeholder: "e.g. 15" },
        { name: "width", label: "Room Width (ft)", type: "number", placeholder: "e.g. 12" },
        { name: "height", label: "Wall Height (ft)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "doors", label: "Number of Doors", type: "number", placeholder: "e.g. 2", defaultValue: 1 },
        { name: "windows", label: "Number of Windows", type: "number", placeholder: "e.g. 2", defaultValue: 1 },
        { name: "rollWidth", label: "Roll Width (inches)", type: "number", placeholder: "e.g. 20.5", defaultValue: 20.5 },
        { name: "rollLength", label: "Roll Length (ft)", type: "number", placeholder: "e.g. 33", defaultValue: 33 },
      ],
      calculate: (inputs) => {
        const l = inputs.length as number, w = inputs.width as number;
        const h = (inputs.height as number) || 8;
        const doors = (inputs.doors as number) || 0, windows = (inputs.windows as number) || 0;
        const rollW = (inputs.rollWidth as number) || 20.5;
        const rollL = (inputs.rollLength as number) || 33;
        if (!l || !w) return null;
        const perimeter = 2 * (l + w);
        const totalWallArea = perimeter * h;
        const openingArea = doors * 21 + windows * 15;
        const coverArea = totalWallArea - openingArea;
        const rollArea = (rollW / 12) * rollL;
        const usableRollArea = rollArea * 0.85;
        const rolls = Math.ceil(coverArea / usableRollArea);
        return {
          primary: { label: "Rolls Needed", value: String(rolls) },
          details: [
            { label: "Wall area to cover", value: `${formatNumber(coverArea, 0)} sq ft` },
            { label: "Total wall area", value: `${formatNumber(totalWallArea, 0)} sq ft` },
            { label: "Openings deducted", value: `${formatNumber(openingArea, 0)} sq ft` },
            { label: "Coverage per roll", value: `${formatNumber(usableRollArea, 1)} sq ft (with waste)` },
            { label: "Room perimeter", value: `${formatNumber(perimeter, 0)} ft` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["paint-calculator", "square-footage-calculator", "tile-calculator"],
  faq: [{ question: "How much wallpaper do I need?", answer: "Calculate total wall area (perimeter × height), subtract doors (~21 sq ft each) and windows (~15 sq ft each). Divide by usable coverage per roll (typically ~56 sq ft for a standard American single roll, minus ~15% waste)." }],
  formula: "Rolls = (Perimeter × Height - Openings) / Roll Coverage",
};
