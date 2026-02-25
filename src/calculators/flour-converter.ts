import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flourConverterCalculator: CalculatorDefinition = {
  slug: "flour-converter-calculator",
  title: "Flour Weight/Volume Converter",
  description:
    "Free flour converter. Convert between cups, grams, ounces, and tablespoons for different flour types used in baking.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "flour converter",
    "cups to grams flour",
    "flour weight",
    "baking measurement",
    "flour volume to weight",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "amount",
          label: "Amount",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "fromUnit",
          label: "From Unit",
          type: "select",
          options: [
            { label: "Cups", value: "cups" },
            { label: "Grams", value: "grams" },
            { label: "Ounces", value: "ounces" },
            { label: "Tablespoons", value: "tbsp" },
          ],
        },
        {
          name: "flourType",
          label: "Flour Type",
          type: "select",
          options: [
            { label: "All-Purpose Flour", value: "all_purpose" },
            { label: "Bread Flour", value: "bread" },
            { label: "Cake Flour", value: "cake" },
            { label: "Whole Wheat Flour", value: "whole_wheat" },
            { label: "Almond Flour", value: "almond" },
            { label: "Coconut Flour", value: "coconut" },
          ],
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const fromUnit = inputs.fromUnit as string;
        const flourType = inputs.flourType as string;
        if (!amount || amount <= 0) return null;

        const gramsPerCup: Record<string, number> = {
          all_purpose: 125,
          bread: 130,
          cake: 114,
          whole_wheat: 128,
          almond: 96,
          coconut: 80,
        };

        const gpc = gramsPerCup[flourType] || 125;
        let grams: number;

        switch (fromUnit) {
          case "cups":
            grams = amount * gpc;
            break;
          case "grams":
            grams = amount;
            break;
          case "ounces":
            grams = amount * 28.35;
            break;
          case "tbsp":
            grams = amount * (gpc / 16);
            break;
          default:
            grams = amount * gpc;
        }

        const cups = grams / gpc;
        const ounces = grams / 28.35;
        const tbsp = cups * 16;
        const tsp = tbsp * 3;

        const flourLabel =
          flourType === "all_purpose"
            ? "All-Purpose"
            : flourType === "bread"
              ? "Bread"
              : flourType === "cake"
                ? "Cake"
                : flourType === "whole_wheat"
                  ? "Whole Wheat"
                  : flourType === "almond"
                    ? "Almond"
                    : "Coconut";

        return {
          primary: {
            label: "Grams",
            value: formatNumber(grams, 1) + " g",
          },
          details: [
            { label: "Cups", value: formatNumber(cups, 2) },
            { label: "Ounces", value: formatNumber(ounces, 1) + " oz" },
            { label: "Tablespoons", value: formatNumber(tbsp, 1) + " tbsp" },
            { label: "Teaspoons", value: formatNumber(tsp, 0) + " tsp" },
            { label: "Flour Type", value: flourLabel },
            { label: "Grams per Cup", value: gpc + " g" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["baking-conversion-calculator", "cups-to-ml-calculator"],
  faq: [
    {
      question: "How many grams is 1 cup of flour?",
      answer:
        "One cup of all-purpose flour weighs about 125 grams. Bread flour is slightly heavier at 130g, cake flour is lighter at 114g, and whole wheat flour is 128g per cup.",
    },
    {
      question: "Why should I weigh flour instead of using cups?",
      answer:
        "Measuring flour by weight is more accurate because cup measurements can vary by 20-30% depending on how the flour is scooped. Weighing ensures consistent baking results.",
    },
  ],
  formula:
    "Grams = Cups × Grams per Cup. Grams per cup varies by type: All-Purpose 125g, Bread 130g, Cake 114g, Whole Wheat 128g, Almond 96g, Coconut 80g.",
};
