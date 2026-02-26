import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waffleBatchCalculator: CalculatorDefinition = {
  slug: "waffle-batch-calculator",
  title: "Waffle & French Toast Batch Calculator",
  description:
    "Free waffle and french toast batch calculator. Calculate ingredients and quantities to make waffles or french toast for any number of people.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "waffle batch calculator",
    "waffles for crowd",
    "french toast batch",
    "waffle recipe scaler",
    "breakfast batch calculator",
    "waffles per person",
  ],
  variants: [
    {
      id: "waffles",
      name: "Waffles",
      description:
        "Calculate waffle batter ingredients for any number of people",
      fields: [
        {
          name: "people",
          label: "Number of People",
          type: "number",
          placeholder: "e.g. 8",
          min: 1,
          step: 1,
        },
        {
          name: "wafflesPerPerson",
          label: "Waffles Per Person",
          type: "select",
          options: [
            { label: "1 waffle (light)", value: "1" },
            { label: "1.5 waffles (average)", value: "1.5" },
            { label: "2 waffles (hearty)", value: "2" },
            { label: "3 waffles (big appetite)", value: "3" },
          ],
          defaultValue: "2",
        },
        {
          name: "waffleType",
          label: "Waffle Type",
          type: "select",
          options: [
            { label: "Classic/Regular", value: "classic" },
            { label: "Belgian (thick)", value: "belgian" },
          ],
          defaultValue: "classic",
        },
      ],
      calculate: (inputs) => {
        const people = parseFloat(inputs.people as string);
        const wafflesPerPerson = parseFloat(inputs.wafflesPerPerson as string);
        const waffleType = inputs.waffleType as string;
        if (!people || people <= 0) return null;

        const totalWaffles = people * wafflesPerPerson;

        // Standard recipe makes ~6 classic or ~4 Belgian waffles
        // Per classic waffle: ~1/3 cup batter = ~2.5 oz flour, 1 egg per 6 waffles
        const batterPerWaffle = waffleType === "belgian" ? 0.5 : 0.33; // cups of batter
        const totalBatterCups = totalWaffles * batterPerWaffle;

        // Ingredients scale from basic recipe: 6 waffles = 2c flour, 2c milk, 2 eggs, 1/3c oil, 1tbsp sugar, 1tbsp baking powder
        const multiplier = totalWaffles / (waffleType === "belgian" ? 4 : 6);
        const flourCups = 2 * multiplier;
        const milkCups = 2 * multiplier;
        const eggs = Math.ceil(2 * multiplier);
        const oilTbsp = Math.ceil(5 * multiplier); // 1/3 cup = 5.3 tbsp
        const sugarTbsp = Math.ceil(1 * multiplier);
        const bakingPowderTbsp = Math.ceil(1 * multiplier);

        return {
          primary: {
            label: `${waffleType === "belgian" ? "Belgian" : "Classic"} waffles for ${formatNumber(people)}`,
            value: `${formatNumber(totalWaffles)} waffles`,
          },
          details: [
            { label: "Total Waffles", value: formatNumber(totalWaffles) },
            { label: "All-Purpose Flour", value: `${formatNumber(flourCups, 1)} cups` },
            { label: "Milk", value: `${formatNumber(milkCups, 1)} cups` },
            { label: "Eggs", value: formatNumber(eggs) },
            { label: "Vegetable Oil/Melted Butter", value: `${formatNumber(oilTbsp)} tbsp` },
            { label: "Sugar", value: `${formatNumber(sugarTbsp)} tbsp` },
            { label: "Baking Powder", value: `${formatNumber(bakingPowderTbsp)} tbsp` },
          ],
          note: "For crispier waffles, replace some milk with buttermilk or add a tablespoon of cornstarch. Keep finished waffles warm on a wire rack in a 200\u00b0F oven.",
        };
      },
    },
    {
      id: "french-toast",
      name: "French Toast",
      description:
        "Calculate ingredients for french toast for any number of people",
      fields: [
        {
          name: "people",
          label: "Number of People",
          type: "number",
          placeholder: "e.g. 8",
          min: 1,
          step: 1,
        },
        {
          name: "slicesPerPerson",
          label: "Slices Per Person",
          type: "select",
          options: [
            { label: "2 slices (light)", value: "2" },
            { label: "3 slices (average)", value: "3" },
            { label: "4 slices (hearty)", value: "4" },
          ],
          defaultValue: "3",
        },
        {
          name: "breadType",
          label: "Bread Type",
          type: "select",
          options: [
            { label: "Regular sandwich bread", value: "regular" },
            { label: "Thick-cut Texas toast", value: "thick" },
            { label: "Brioche/Challah", value: "brioche" },
          ],
          defaultValue: "thick",
        },
      ],
      calculate: (inputs) => {
        const people = parseFloat(inputs.people as string);
        const slicesPerPerson = parseFloat(inputs.slicesPerPerson as string);
        const breadType = inputs.breadType as string;
        if (!people || people <= 0) return null;

        const totalSlices = people * slicesPerPerson;

        // Standard egg wash: 1 egg + 1/4 cup milk per 3 slices of regular bread
        // Thick bread needs more custard
        let custardPerSlice = 1 / 3; // eggs per slice
        if (breadType === "thick" || breadType === "brioche") custardPerSlice = 0.5;

        const eggs = Math.ceil(totalSlices * custardPerSlice);
        const milkCups = eggs * 0.25;
        const cinnamonTsp = Math.ceil(eggs / 3);
        const vanillaTsp = Math.ceil(eggs / 3);
        const butterTbsp = Math.ceil(totalSlices / 3);

        // Bread loaves (regular ~20 slices, thick ~12, brioche ~12)
        const slicesPerLoaf = breadType === "regular" ? 20 : 12;
        const loaves = Math.ceil(totalSlices / slicesPerLoaf);

        return {
          primary: {
            label: `French toast for ${formatNumber(people)}`,
            value: `${formatNumber(totalSlices)} slices`,
          },
          details: [
            { label: "Total Slices", value: formatNumber(totalSlices) },
            { label: "Bread Loaves Needed", value: formatNumber(loaves) },
            { label: "Eggs", value: formatNumber(eggs) },
            { label: "Milk", value: `${formatNumber(milkCups, 1)} cups` },
            { label: "Cinnamon", value: `${formatNumber(cinnamonTsp)} tsp` },
            { label: "Vanilla Extract", value: `${formatNumber(vanillaTsp)} tsp` },
            { label: "Butter (for griddle)", value: `${formatNumber(butterTbsp)} tbsp` },
          ],
          note: breadType === "brioche" || breadType === "thick"
            ? "Thick bread makes the best french toast. Let slices soak in custard for 30 seconds per side for optimal absorption."
            : "Day-old bread works better than fresh because it absorbs the egg custard without falling apart.",
        };
      },
    },
    {
      id: "pancakes",
      name: "Pancakes",
      description: "Calculate pancake batter for a crowd",
      fields: [
        {
          name: "people",
          label: "Number of People",
          type: "number",
          placeholder: "e.g. 8",
          min: 1,
          step: 1,
        },
        {
          name: "pancakesPerPerson",
          label: "Pancakes Per Person",
          type: "select",
          options: [
            { label: "2 pancakes", value: "2" },
            { label: "3 pancakes", value: "3" },
            { label: "4 pancakes", value: "4" },
            { label: "5 pancakes", value: "5" },
          ],
          defaultValue: "3",
        },
      ],
      calculate: (inputs) => {
        const people = parseFloat(inputs.people as string);
        const perPerson = parseFloat(inputs.pancakesPerPerson as string);
        if (!people || people <= 0) return null;

        const total = people * perPerson;

        // Standard: 12 pancakes = 1.5c flour, 1.25c milk, 1 egg, 2tbsp butter
        const mult = total / 12;
        const flourCups = 1.5 * mult;
        const milkCups = 1.25 * mult;
        const eggs = Math.ceil(1 * mult);
        const butterTbsp = Math.ceil(2 * mult);
        const bakingPowderTsp = Math.ceil(3 * mult);
        const sugarTbsp = Math.ceil(1 * mult);

        return {
          primary: {
            label: `Pancakes for ${formatNumber(people)}`,
            value: `${formatNumber(total)} pancakes`,
          },
          details: [
            { label: "Total Pancakes", value: formatNumber(total) },
            { label: "All-Purpose Flour", value: `${formatNumber(flourCups, 1)} cups` },
            { label: "Milk", value: `${formatNumber(milkCups, 1)} cups` },
            { label: "Eggs", value: formatNumber(eggs) },
            { label: "Melted Butter", value: `${formatNumber(butterTbsp)} tbsp` },
            { label: "Baking Powder", value: `${formatNumber(bakingPowderTsp)} tsp` },
            { label: "Sugar", value: `${formatNumber(sugarTbsp)} tbsp` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "brunch-planner-calculator",
    "cooking-converter",
    "potluck-planner-calculator",
  ],
  faq: [
    {
      question: "How many waffles per person should I plan?",
      answer:
        "For adults, plan 2 standard waffles or 1.5 Belgian waffles per person. For kids, 1-1.5 standard waffles. If serving waffles as part of a larger brunch with other items, 1 waffle per person may suffice.",
    },
    {
      question: "Can I make waffle or pancake batter ahead of time?",
      answer:
        "You can mix dry and wet ingredients separately the night before and combine them in the morning. Pre-mixed batter can be refrigerated for up to 2 hours, but baking powder starts losing potency once it gets wet. For best results, mix just before cooking.",
    },
  ],
  formula:
    "Total Waffles = People x Waffles per Person | Recipe scales linearly | 1 batch (6 waffles) = 2c flour + 2c milk + 2 eggs",
};
