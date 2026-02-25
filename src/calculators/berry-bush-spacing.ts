import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const berryBushSpacingCalculator: CalculatorDefinition = {
  slug: "berry-bush-spacing-calculator",
  title: "Berry Bush Spacing Calculator",
  description: "Free berry bush spacing calculator. Calculate proper spacing, row layout, and expected yield for blueberries, raspberries, blackberries, and more.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["berry bush spacing", "blueberry spacing calculator", "raspberry spacing", "berry patch planner", "berry bush layout"],
  variants: [
    {
      id: "by-type",
      name: "Spacing by Berry Type",
      description: "Get recommended spacing and yield for berry bushes",
      fields: [
        { name: "berryType", label: "Berry Type", type: "select", options: [
          { label: "Blueberry (highbush)", value: "blueberry" },
          { label: "Raspberry (summer-bearing)", value: "raspberry" },
          { label: "Blackberry (erect)", value: "blackberry" },
          { label: "Blackberry (trailing)", value: "blackberry-trail" },
          { label: "Gooseberry", value: "gooseberry" },
          { label: "Currant (red/black)", value: "currant" },
          { label: "Strawberry", value: "strawberry" },
        ], defaultValue: "blueberry" },
        { name: "numPlants", label: "Number of Plants", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const berryType = inputs.berryType as string;
        const numPlants = inputs.numPlants as number;
        if (!numPlants) return null;

        const berryData: Record<string, { plantSpace: number; rowSpace: number; yield: string; yearsToFull: number; sunNeeds: string }> = {
          blueberry: { plantSpace: 5, rowSpace: 10, yield: "5-10 lbs/bush", yearsToFull: 4, sunNeeds: "Full sun (6+ hrs)" },
          raspberry: { plantSpace: 2.5, rowSpace: 8, yield: "2-4 lbs/plant", yearsToFull: 2, sunNeeds: "Full sun (6+ hrs)" },
          blackberry: { plantSpace: 3, rowSpace: 8, yield: "3-6 lbs/plant", yearsToFull: 2, sunNeeds: "Full sun (6+ hrs)" },
          "blackberry-trail": { plantSpace: 5, rowSpace: 10, yield: "4-8 lbs/plant", yearsToFull: 2, sunNeeds: "Full sun (6+ hrs)" },
          gooseberry: { plantSpace: 4, rowSpace: 8, yield: "3-5 lbs/bush", yearsToFull: 3, sunNeeds: "Full to partial sun" },
          currant: { plantSpace: 4, rowSpace: 8, yield: "3-5 lbs/bush", yearsToFull: 3, sunNeeds: "Full to partial sun" },
          strawberry: { plantSpace: 1.5, rowSpace: 3, yield: "0.5-1 lb/plant", yearsToFull: 1, sunNeeds: "Full sun (6+ hrs)" },
        };

        const data = berryData[berryType];
        if (!data) return null;

        const rowLength = numPlants * data.plantSpace;
        const totalArea = rowLength * data.rowSpace;

        return {
          primary: { label: "Row Length Needed", value: `${formatNumber(rowLength)} ft` },
          details: [
            { label: "Plant spacing", value: `${data.plantSpace} ft apart in row` },
            { label: "Row spacing", value: `${data.rowSpace} ft between rows` },
            { label: "Total area needed", value: `${formatNumber(totalArea)} sq ft (1 row)` },
            { label: "Expected yield at maturity", value: data.yield },
            { label: "Years to full production", value: `${data.yearsToFull}` },
            { label: "Sun requirements", value: data.sunNeeds },
          ],
          note: "Most berries need acidic soil (pH 4.5-5.5 for blueberries, 5.5-6.5 for others). Mulch heavily and provide consistent moisture.",
        };
      },
    },
    {
      id: "by-space",
      name: "Plants by Available Space",
      description: "Calculate how many berry bushes fit in your space",
      fields: [
        { name: "length", label: "Available Length (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "width", label: "Available Width (feet)", type: "number", placeholder: "e.g. 10" },
        { name: "berryType", label: "Berry Type", type: "select", options: [
          { label: "Blueberry (5 ft × 10 ft)", value: "5-10" },
          { label: "Raspberry (2.5 ft × 8 ft)", value: "2.5-8" },
          { label: "Blackberry (3 ft × 8 ft)", value: "3-8" },
          { label: "Gooseberry (4 ft × 8 ft)", value: "4-8" },
          { label: "Strawberry (1.5 ft × 3 ft)", value: "1.5-3" },
        ], defaultValue: "5-10" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const spacing = inputs.berryType as string;
        if (!length || !width) return null;

        const [plantStr, rowStr] = spacing.split("-");
        const plantSpace = parseFloat(plantStr);
        const rowSpace = parseFloat(rowStr);

        const rows = Math.floor(width / rowSpace);
        const plantsPerRow = Math.floor(length / plantSpace);
        const totalPlants = Math.max(rows, 1) * plantsPerRow;

        return {
          primary: { label: "Plants That Fit", value: `${totalPlants}` },
          details: [
            { label: "Rows", value: `${Math.max(rows, 1)}` },
            { label: "Plants per row", value: `${plantsPerRow}` },
            { label: "Plant spacing", value: `${plantSpace} ft` },
            { label: "Row spacing", value: `${rowSpace} ft` },
            { label: "Area used", value: `${formatNumber(length * width)} sq ft` },
          ],
          note: "Leave extra space at the ends for access and maintenance. Consider trellising for raspberries and blackberries.",
        };
      },
    },
  ],
  relatedSlugs: ["garden-row-spacing-calculator", "vegetable-garden-size-calculator", "hedge-spacing-calculator"],
  faq: [
    { question: "How far apart should blueberry bushes be planted?", answer: "Space highbush blueberries 4-6 feet apart in the row, with 8-12 feet between rows. Plant at least 2 different varieties for cross-pollination and better fruit set." },
    { question: "How many berry bushes do I need for a family?", answer: "For a family of 4: 6-8 blueberry bushes, 10-15 raspberry canes, or 6-8 blackberry plants. Strawberries: 25-50 plants. This provides plenty for fresh eating and some preserving." },
  ],
  formula: "Row Length = Plants \u00D7 Plant Spacing | Rows = Width / Row Spacing",
};
