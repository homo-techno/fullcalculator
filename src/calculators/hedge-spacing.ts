import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hedgeSpacingCalculator: CalculatorDefinition = {
  slug: "hedge-spacing-calculator",
  title: "Hedge Plant Spacing Calculator",
  description: "Free hedge plant spacing calculator. Calculate the number of hedge plants needed for a given length based on plant species and desired density.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hedge spacing calculator", "how many hedge plants", "hedge planting distance", "privacy hedge calculator", "hedge row planner"],
  variants: [
    {
      id: "by-species",
      name: "Spacing by Hedge Species",
      description: "Get recommended spacing for common hedge plants",
      fields: [
        { name: "species", label: "Hedge Species", type: "select", options: [
          { label: "Boxwood (small hedge)", value: "boxwood" },
          { label: "Privet", value: "privet" },
          { label: "Arborvitae (Thuja)", value: "arborvitae" },
          { label: "Leyland Cypress", value: "leyland" },
          { label: "Holly", value: "holly" },
          { label: "Yew (Taxus)", value: "yew" },
          { label: "Laurel (Cherry Laurel)", value: "laurel" },
          { label: "Forsythia", value: "forsythia" },
          { label: "Rose of Sharon (Hibiscus)", value: "hibiscus" },
          { label: "Lilac", value: "lilac" },
        ], defaultValue: "arborvitae" },
        { name: "hedgeLength", label: "Total Hedge Length (feet)", type: "number", placeholder: "e.g. 50" },
        { name: "density", label: "Hedge Density", type: "select", options: [
          { label: "Tight / Privacy screen (closer spacing)", value: "tight" },
          { label: "Standard hedge", value: "standard" },
          { label: "Loose / Informal (wider spacing)", value: "loose" },
        ], defaultValue: "standard" },
      ],
      calculate: (inputs) => {
        const species = inputs.species as string;
        const length = inputs.hedgeLength as number;
        const density = inputs.density as string;
        if (!length) return null;

        const speciesData: Record<string, { tight: number; standard: number; loose: number; height: string; growth: string }> = {
          boxwood: { tight: 1.5, standard: 2, loose: 3, height: "3-5 ft", growth: "3-6 in/yr" },
          privet: { tight: 2, standard: 3, loose: 4, height: "6-12 ft", growth: "12-24 in/yr" },
          arborvitae: { tight: 3, standard: 4, loose: 5, height: "10-15 ft", growth: "6-12 in/yr" },
          leyland: { tight: 4, standard: 6, loose: 8, height: "40-60 ft", growth: "24-36 in/yr" },
          holly: { tight: 3, standard: 4, loose: 5, height: "6-15 ft", growth: "6-12 in/yr" },
          yew: { tight: 2, standard: 3, loose: 4, height: "5-20 ft", growth: "6-12 in/yr" },
          laurel: { tight: 3, standard: 4, loose: 6, height: "10-18 ft", growth: "12-24 in/yr" },
          forsythia: { tight: 3, standard: 4, loose: 6, height: "8-10 ft", growth: "12-24 in/yr" },
          hibiscus: { tight: 3, standard: 4, loose: 6, height: "8-12 ft", growth: "12-24 in/yr" },
          lilac: { tight: 4, standard: 6, loose: 8, height: "8-15 ft", growth: "12-24 in/yr" },
        };

        const data = speciesData[species];
        if (!data) return null;

        const spacing = data[density as keyof typeof data] as number;
        const plantsNeeded = Math.ceil(length / spacing) + 1;
        const totalCost = plantsNeeded;

        return {
          primary: { label: "Plants Needed", value: `${plantsNeeded}` },
          details: [
            { label: "Spacing", value: `${spacing} ft apart` },
            { label: "Hedge length", value: `${formatNumber(length)} ft` },
            { label: "Mature height", value: data.height },
            { label: "Growth rate", value: data.growth },
            { label: "Years to fill in", value: density === "tight" ? "2-3 years" : density === "standard" ? "3-5 years" : "4-6 years" },
          ],
          note: "Plant hedges in a straight trench rather than individual holes for even growth. Water deeply the first 2 years to establish roots.",
        };
      },
    },
    {
      id: "custom",
      name: "Custom Spacing Calculator",
      description: "Calculate plants needed with custom spacing",
      fields: [
        { name: "hedgeLength", label: "Hedge Length (feet)", type: "number", placeholder: "e.g. 50" },
        { name: "spacing", label: "Plant Spacing (feet)", type: "number", placeholder: "e.g. 4", step: 0.5 },
        { name: "rows", label: "Number of Rows", type: "select", options: [
          { label: "Single row", value: "1" },
          { label: "Double row (staggered)", value: "2" },
        ], defaultValue: "1" },
        { name: "pricePerPlant", label: "Price per Plant (optional)", type: "number", placeholder: "e.g. 15", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.hedgeLength as number;
        const spacing = inputs.spacing as number;
        const rows = parseInt(inputs.rows as string) || 1;
        const price = inputs.pricePerPlant as number;
        if (!length || !spacing) return null;

        const plantsPerRow = Math.ceil(length / spacing) + 1;
        const totalPlants = plantsPerRow * rows;

        const details = [
          { label: "Plants per row", value: `${plantsPerRow}` },
          { label: "Number of rows", value: `${rows}` },
          { label: "Spacing", value: `${spacing} ft` },
          { label: "Hedge length", value: `${formatNumber(length)} ft` },
        ];
        if (rows === 2) {
          details.push({ label: "Row offset", value: `Stagger by ${formatNumber(spacing / 2, 1)} ft` });
          details.push({ label: "Row separation", value: `${formatNumber(spacing * 0.75, 1)} ft` });
        }
        if (price) {
          details.push({ label: "Estimated plant cost", value: `$${formatNumber(totalPlants * price)}` });
        }

        return {
          primary: { label: "Total Plants", value: `${totalPlants}` },
          details,
          note: rows === 2
            ? "Double-row hedges provide faster privacy. Stagger plants so the second row fills gaps in the first row."
            : "Consider a double row for faster privacy screening.",
        };
      },
    },
  ],
  relatedSlugs: ["berry-bush-spacing-calculator", "flower-bed-calculator", "garden-path-calculator"],
  faq: [
    { question: "How far apart should hedge plants be?", answer: "It depends on species: Boxwood 1.5-3 ft, Arborvitae 3-5 ft, Privet 2-4 ft, Leyland Cypress 4-8 ft. Closer spacing fills in faster but costs more. Wider spacing is more economical." },
    { question: "How long does it take for a hedge to fill in?", answer: "Fast-growing hedges (privet, leyland cypress) fill in 2-3 years. Medium-growth (arborvitae, laurel) take 3-5 years. Slow-growing (boxwood, yew) take 5-7 years. Closer spacing speeds this up." },
  ],
  formula: "Plants = (Hedge Length / Spacing) + 1 | Double Row = Plants per Row \u00D7 2",
};
