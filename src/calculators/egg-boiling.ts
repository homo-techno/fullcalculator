import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eggBoilingCalculator: CalculatorDefinition = {
  slug: "egg-boiling-calculator",
  title: "Egg Boiling Time Calculator",
  description:
    "Free egg boiling time calculator. Get perfect soft-boiled, medium, or hard-boiled eggs every time based on size and starting temperature.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "egg boiling time",
    "soft boiled egg",
    "hard boiled egg",
    "how long to boil eggs",
    "egg timer",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "doneness",
          label: "Desired Doneness",
          type: "select",
          options: [
            { label: "Soft Boiled (runny yolk)", value: "soft" },
            { label: "Medium Soft (jammy yolk)", value: "medium_soft" },
            { label: "Medium (slightly soft center)", value: "medium" },
            { label: "Hard Boiled (fully set)", value: "hard" },
          ],
        },
        {
          name: "eggSize",
          label: "Egg Size",
          type: "select",
          options: [
            { label: "Medium", value: "medium" },
            { label: "Large", value: "large" },
            { label: "Extra Large", value: "xlarge" },
            { label: "Jumbo", value: "jumbo" },
          ],
        },
        {
          name: "startTemp",
          label: "Starting Temperature",
          type: "select",
          options: [
            { label: "From Refrigerator", value: "fridge" },
            { label: "Room Temperature", value: "room" },
          ],
        },
        {
          name: "quantity",
          label: "Number of Eggs",
          type: "number",
          placeholder: "e.g. 6",
        },
      ],
      calculate: (inputs) => {
        const doneness = inputs.doneness as string;
        const eggSize = inputs.eggSize as string;
        const startTemp = inputs.startTemp as string;
        const quantity = inputs.quantity as number;
        if (!quantity || quantity <= 0) return null;

        const baseTimes: Record<string, number> = {
          soft: 6,
          medium_soft: 7,
          medium: 9,
          hard: 12,
        };

        const sizeAdj: Record<string, number> = {
          medium: -0.5,
          large: 0,
          xlarge: 0.5,
          jumbo: 1,
        };

        const tempAdj = startTemp === "fridge" ? 1 : 0;
        const baseTime = baseTimes[doneness] || 9;
        const adjustment = (sizeAdj[eggSize] || 0) + tempAdj;
        const totalTime = baseTime + adjustment;
        const batchAdj = quantity > 6 ? 1 : 0;
        const finalTime = totalTime + batchAdj;

        const donenessLabels: Record<string, string> = {
          soft: "Runny yolk, barely set white",
          medium_soft: "Jammy yolk, set white",
          medium: "Slightly soft center yolk",
          hard: "Fully set yolk throughout",
        };

        const iceBathTime = doneness === "soft" || doneness === "medium_soft" ? 5 : 10;
        const waterQts = Math.ceil(quantity / 3);

        return {
          primary: {
            label: "Boiling Time",
            value: formatNumber(finalTime, 1) + " minutes",
          },
          details: [
            { label: "Doneness", value: donenessLabels[doneness] || "Set yolk" },
            { label: "Egg Size", value: eggSize.charAt(0).toUpperCase() + eggSize.slice(1) },
            { label: "Starting Temp", value: startTemp === "fridge" ? "Refrigerator" : "Room Temp" },
            { label: "Number of Eggs", value: String(quantity) },
            { label: "Ice Bath Time", value: iceBathTime + " min" },
            { label: "Water Needed", value: waterQts + " quarts (minimum)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cooking-temp-calculator", "cooking-calculator"],
  faq: [
    {
      question: "How long do I boil eggs for soft boiled?",
      answer:
        "For a soft-boiled egg with a runny yolk, boil a large egg from the refrigerator for 7 minutes. For room temperature eggs, 6 minutes. Transfer to an ice bath immediately.",
    },
    {
      question: "Should I start eggs in cold or boiling water?",
      answer:
        "Starting in boiling water gives more consistent results. Gently lower eggs into already-boiling water and start your timer. This method makes timing more predictable.",
    },
  ],
  formula:
    "Boil Time = Base time + Size adjustment + Temperature adjustment + Batch adjustment. Base times: Soft 6min, Medium-Soft 7min, Medium 9min, Hard 12min. Add 1 min from fridge, add 1 min for 6+ eggs.",
};
