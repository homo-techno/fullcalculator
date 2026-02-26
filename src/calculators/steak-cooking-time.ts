import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const steakCookingTimeCalculator: CalculatorDefinition = {
  slug: "steak-cooking-time",
  title: "Steak Cooking Time & Temperature Calculator",
  description: "Free online steak cooking time calculator. Get perfect cooking times and temperatures for any steak thickness and doneness level.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["steak cooking time", "steak temperature", "steak doneness", "how long to cook steak", "steak guide"],
  variants: [
    {
      id: "steak-time",
      name: "Steak Cooking Time",
      fields: [
        { name: "thickness", label: "Steak Thickness (inches)", type: "number", placeholder: "e.g. 1.5", step: 0.25 },
        {
          name: "doneness",
          label: "Desired Doneness",
          type: "select",
          options: [
            { label: "Rare (120-125°F)", value: "rare" },
            { label: "Medium Rare (130-135°F)", value: "medium_rare" },
            { label: "Medium (135-145°F)", value: "medium" },
            { label: "Medium Well (145-155°F)", value: "medium_well" },
            { label: "Well Done (155-165°F)", value: "well_done" },
          ],
        },
        {
          name: "method",
          label: "Cooking Method",
          type: "select",
          options: [
            { label: "Pan Sear (Stovetop)", value: "pan" },
            { label: "Grill", value: "grill" },
            { label: "Oven Broil", value: "broil" },
            { label: "Reverse Sear (Oven + Pan)", value: "reverse" },
          ],
        },
      ],
      calculate: (inputs) => {
        const thickness = parseFloat(inputs.thickness as string) || 1;
        const doneness = inputs.doneness as string;
        const method = inputs.method as string;

        const targetTemp: Record<string, number> = {
          rare: 122,
          medium_rare: 132,
          medium: 140,
          medium_well: 150,
          well_done: 160,
        };

        const restTemp: Record<string, number> = {
          rare: 125,
          medium_rare: 135,
          medium: 145,
          medium_well: 155,
          well_done: 165,
        };

        // Base time in minutes per inch of thickness for each method
        const baseTimePerInch: Record<string, Record<string, number>> = {
          pan: { rare: 3, medium_rare: 4, medium: 5, medium_well: 6, well_done: 7 },
          grill: { rare: 3.5, medium_rare: 4.5, medium: 5.5, medium_well: 6.5, well_done: 8 },
          broil: { rare: 4, medium_rare: 5, medium: 6, medium_well: 7, well_done: 9 },
          reverse: { rare: 5, medium_rare: 6, medium: 7, medium_well: 8, well_done: 10 },
        };

        const timePerSide = (baseTimePerInch[method]?.[doneness] || 5) * thickness;
        const totalTime = timePerSide * 2;
        const restTime = 5 + (thickness > 1.5 ? 5 : 0);
        const pullTemp = targetTemp[doneness] || 140;
        const finalTemp = restTemp[doneness] || 145;

        return {
          primary: { label: "Total Cook Time", value: `${formatNumber(totalTime)} min` },
          details: [
            { label: "Time Per Side", value: `${formatNumber(timePerSide)} min` },
            { label: "Rest Time", value: `${formatNumber(restTime)} min` },
            { label: "Pull Temperature", value: `${formatNumber(pullTemp)}°F` },
            { label: "Final Temperature (after rest)", value: `${formatNumber(finalTemp)}°F` },
            { label: "Steak Thickness", value: `${formatNumber(thickness)} in` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sous-vide-calc", "bbq-smoking-time", "ham-cooking-time"],
  faq: [
    {
      question: "How long should I let my steak rest after cooking?",
      answer: "Let your steak rest for at least 5 minutes for thinner cuts (under 1.5 inches) and up to 10 minutes for thicker cuts. The temperature will rise 5-10°F during resting.",
    },
    {
      question: "What is the best temperature for medium rare steak?",
      answer: "Pull the steak off heat at 130-132°F. After resting, it will reach a final temperature of about 135°F, which is the ideal medium rare.",
    },
    {
      question: "Should I use a meat thermometer?",
      answer: "Yes. An instant-read meat thermometer is the most reliable way to check doneness. Insert it into the thickest part of the steak for the most accurate reading.",
    },
  ],
  formula: "cook_time = base_time_per_inch × thickness × 2 sides",
};
