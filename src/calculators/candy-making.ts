import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const candyMakingCalculator: CalculatorDefinition = {
  slug: "candy-making-calculator",
  title: "Candy Making Temperature Calculator",
  description:
    "Free candy making temperature calculator. Find the correct sugar temperature stage for fudge, caramel, toffee, hard candy, and more.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "candy temperature",
    "sugar stages",
    "candy making",
    "hard crack",
    "soft ball stage",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "candyType",
          label: "Candy Type",
          type: "select",
          options: [
            { label: "Fudge", value: "fudge" },
            { label: "Caramel", value: "caramel" },
            { label: "Taffy", value: "taffy" },
            { label: "Toffee", value: "toffee" },
            { label: "Hard Candy / Lollipops", value: "hard_candy" },
            { label: "Marshmallow", value: "marshmallow" },
            { label: "Pralines", value: "pralines" },
            { label: "Brittles", value: "brittles" },
          ],
        },
        {
          name: "altitude",
          label: "Altitude (feet above sea level)",
          type: "number",
          placeholder: "e.g. 0",
        },
        {
          name: "batchSize",
          label: "Batch Size (cups of sugar)",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const candyType = inputs.candyType as string;
        const altitude = (inputs.altitude as number) || 0;
        const batchSize = inputs.batchSize as number;
        if (!batchSize || batchSize <= 0) return null;

        const stages: Record<string, { stage: string; minTemp: number; maxTemp: number; description: string }> = {
          fudge: { stage: "Soft Ball", minTemp: 235, maxTemp: 240, description: "Flattens when removed from water" },
          caramel: { stage: "Firm Ball", minTemp: 245, maxTemp: 250, description: "Holds shape but is pliable" },
          taffy: { stage: "Hard Ball", minTemp: 250, maxTemp: 265, description: "Holds shape, slightly pliable" },
          toffee: { stage: "Soft Crack", minTemp: 270, maxTemp: 290, description: "Bends before breaking" },
          hard_candy: { stage: "Hard Crack", minTemp: 300, maxTemp: 310, description: "Breaks cleanly" },
          marshmallow: { stage: "Soft Ball", minTemp: 240, maxTemp: 245, description: "Flattens when removed from water" },
          pralines: { stage: "Soft Ball", minTemp: 236, maxTemp: 240, description: "Flattens when removed from water" },
          brittles: { stage: "Hard Crack", minTemp: 295, maxTemp: 310, description: "Breaks cleanly" },
        };

        const info = stages[candyType] || stages.fudge;
        const altitudeAdjustment = Math.round(altitude / 500) * 1;
        const adjMin = info.minTemp - altitudeAdjustment;
        const adjMax = info.maxTemp - altitudeAdjustment;
        const sugarGrams = batchSize * 200;
        const waterMl = Math.round(sugarGrams * 0.35);
        const cookTime = Math.round((info.maxTemp - 212) / 5);

        return {
          primary: {
            label: "Target Temperature",
            value: adjMin + " - " + adjMax + " °F",
          },
          details: [
            { label: "Sugar Stage", value: info.stage },
            { label: "Stage Description", value: info.description },
            { label: "Altitude Adjustment", value: "-" + altitudeAdjustment + " °F" },
            { label: "Sugar Needed", value: formatNumber(sugarGrams, 0) + " g" },
            { label: "Water to Add", value: formatNumber(waterMl, 0) + " ml" },
            { label: "Approx. Cook Time", value: cookTime + " min from boiling" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cooking-temp-calculator", "baking-conversion-calculator"],
  faq: [
    {
      question: "What are the sugar temperature stages?",
      answer:
        "The stages are Thread (230-235°F), Soft Ball (235-240°F), Firm Ball (245-250°F), Hard Ball (250-265°F), Soft Crack (270-290°F), Hard Crack (300-310°F), and Caramel (320-350°F).",
    },
    {
      question: "How does altitude affect candy making?",
      answer:
        "For every 500 feet above sea level, reduce the target temperature by about 1°F. Water boils at a lower temperature at higher altitudes, so candy reaches its stage at a lower temperature.",
    },
  ],
  formula:
    "Adjusted Temp = Base Temp - (Altitude / 500). Sugar stages: Soft Ball 235-240°F, Firm Ball 245-250°F, Hard Ball 250-265°F, Soft Crack 270-290°F, Hard Crack 300-310°F.",
};
