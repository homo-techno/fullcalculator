import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cookingConverter: CalculatorDefinition = {
  slug: "cooking-converter",
  title: "Cooking Measurement Converter",
  description: "Free cooking measurement converter. Convert between cups, tablespoons, teaspoons, milliliters, ounces, and grams for cooking and baking.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["cooking converter", "cup to tablespoon", "tablespoon to teaspoon", "ml to cups", "cooking measurement converter"],
  variants: [
    {
      id: "volume",
      name: "Volume Conversion",
      description: "Convert between cups, tablespoons, teaspoons, and milliliters",
      fields: [
        { name: "amount", label: "Amount", type: "number", placeholder: "e.g. 2" },
        { name: "from", label: "From", type: "select", options: [
          { label: "Cups", value: "cup" },
          { label: "Tablespoons", value: "tbsp" },
          { label: "Teaspoons", value: "tsp" },
          { label: "Fluid Ounces", value: "floz" },
          { label: "Milliliters (mL)", value: "ml" },
          { label: "Liters", value: "l" },
        ], defaultValue: "cup" },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const from = inputs.from as string;
        if (!amount) return null;

        const toMl: Record<string, number> = {
          cup: 236.588, tbsp: 14.787, tsp: 4.929, floz: 29.574, ml: 1, l: 1000,
        };
        const ml = amount * (toMl[from] || 1);

        return {
          primary: { label: `${amount} ${from}`, value: `${formatNumber(ml)} mL` },
          details: [
            { label: "Cups", value: formatNumber(ml / toMl.cup, 3) },
            { label: "Tablespoons", value: formatNumber(ml / toMl.tbsp, 2) },
            { label: "Teaspoons", value: formatNumber(ml / toMl.tsp, 2) },
            { label: "Fluid ounces", value: formatNumber(ml / toMl.floz, 3) },
            { label: "Milliliters", value: formatNumber(ml, 2) },
            { label: "Liters", value: formatNumber(ml / 1000, 4) },
          ],
        };
      },
    },
    {
      id: "weight",
      name: "Baking Weight Conversion",
      description: "Convert between grams, ounces, and pounds for baking",
      fields: [
        { name: "amount", label: "Amount", type: "number", placeholder: "e.g. 250" },
        { name: "from", label: "From", type: "select", options: [
          { label: "Grams", value: "g" },
          { label: "Ounces", value: "oz" },
          { label: "Pounds", value: "lb" },
          { label: "Kilograms", value: "kg" },
        ], defaultValue: "g" },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const from = inputs.from as string;
        if (!amount) return null;

        const toG: Record<string, number> = { g: 1, oz: 28.3495, lb: 453.592, kg: 1000 };
        const g = amount * (toG[from] || 1);

        return {
          primary: { label: `${amount} ${from}`, value: `${formatNumber(g)} grams` },
          details: [
            { label: "Grams", value: formatNumber(g, 2) },
            { label: "Ounces", value: formatNumber(g / toG.oz, 3) },
            { label: "Pounds", value: formatNumber(g / toG.lb, 4) },
            { label: "Kilograms", value: formatNumber(g / 1000, 4) },
          ],
        };
      },
    },
    {
      id: "temperature",
      name: "Oven Temperature",
      description: "Convert oven temperatures between Fahrenheit, Celsius, and Gas Mark",
      fields: [
        { name: "temp", label: "Temperature", type: "number", placeholder: "e.g. 350" },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Fahrenheit", value: "f" },
          { label: "Celsius", value: "c" },
        ], defaultValue: "f" },
      ],
      calculate: (inputs) => {
        const temp = inputs.temp as number;
        const unit = inputs.unit as string;
        if (temp === undefined) return null;

        const f = unit === "c" ? (temp * 9) / 5 + 32 : temp;
        const c = unit === "f" ? ((temp - 32) * 5) / 9 : temp;
        const gasMarks: [number, number][] = [[275, 1], [300, 2], [325, 3], [350, 4], [375, 5], [400, 6], [425, 7], [450, 8], [475, 9]];
        const closest = gasMarks.reduce((prev, curr) => Math.abs(curr[0] - f) < Math.abs(prev[0] - f) ? curr : prev);
        const gasMark = Math.abs(closest[0] - f) <= 30 ? `${closest[1]}` : "N/A";

        return {
          primary: { label: `${temp}°${unit.toUpperCase()}`, value: unit === "f" ? `${formatNumber(c, 1)}°C` : `${formatNumber(f, 1)}°F` },
          details: [
            { label: "Fahrenheit", value: `${formatNumber(f, 1)}°F` },
            { label: "Celsius", value: `${formatNumber(c, 1)}°C` },
            { label: "Gas Mark", value: gasMark },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "percentage-calculator"],
  faq: [
    { question: "How many tablespoons in a cup?", answer: "There are 16 tablespoons in 1 cup, and 3 teaspoons in 1 tablespoon. So 1 cup = 48 teaspoons. A half cup = 8 tablespoons." },
    { question: "Why measure by weight for baking?", answer: "Weight (grams) is more accurate than volume (cups) because ingredients pack differently. 1 cup of sifted flour weighs ~120g while packed flour weighs ~150g. Professional bakers always use weight." },
  ],
  formula: "1 cup = 16 tbsp = 48 tsp = 8 fl oz ≈ 237 mL | 1 oz ≈ 28.35 g",
};
