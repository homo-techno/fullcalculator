import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dehydratorTimeCalculator: CalculatorDefinition = {
  slug: "dehydrator-time-calculator",
  title: "Food Dehydrator Time & Temperature Guide",
  description:
    "Free food dehydrator time and temperature calculator. Get recommended dehydrating times and temperatures for fruits, vegetables, meats (jerky), and herbs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dehydrator time",
    "dehydrating food",
    "food dehydrator guide",
    "jerky dehydrator time",
    "fruit dehydrator",
    "dehydrator temperature",
  ],
  variants: [
    {
      id: "fruit",
      name: "Fruits",
      description: "Dehydrating times and temperatures for fruits",
      fields: [
        {
          name: "fruit",
          label: "Fruit Type",
          type: "select",
          options: [
            { label: "Apples (sliced)", value: "apples" },
            { label: "Bananas (sliced)", value: "bananas" },
            { label: "Strawberries (halved)", value: "strawberries" },
            { label: "Blueberries (whole)", value: "blueberries" },
            { label: "Mangoes (sliced)", value: "mangoes" },
            { label: "Peaches (sliced)", value: "peaches" },
            { label: "Grapes (halved)", value: "grapes" },
            { label: "Pineapple (rings/chunks)", value: "pineapple" },
            { label: "Cherries (halved, pitted)", value: "cherries" },
            { label: "Cranberries (whole)", value: "cranberries" },
          ],
          defaultValue: "apples",
        },
        {
          name: "thickness",
          label: "Slice Thickness",
          type: "select",
          options: [
            { label: "Thin (1/8 inch)", value: "thin" },
            { label: "Standard (1/4 inch)", value: "standard" },
            { label: "Thick (3/8 inch)", value: "thick" },
          ],
          defaultValue: "standard",
        },
      ],
      calculate: (inputs) => {
        const fruit = inputs.fruit as string;
        const thickness = inputs.thickness as string;

        const fruitData: Record<string, { tempF: number; hours: number; note: string }> = {
          apples: { tempF: 135, hours: 8, note: "Pre-treat with lemon water to prevent browning." },
          bananas: { tempF: 135, hours: 8, note: "Ripe but firm bananas work best." },
          strawberries: { tempF: 135, hours: 10, note: "Cut evenly for consistent drying." },
          blueberries: { tempF: 135, hours: 14, note: "Pierce skins or freeze first to crack skins for faster drying." },
          mangoes: { tempF: 135, hours: 10, note: "Ripe mangoes produce sweeter results." },
          peaches: { tempF: 135, hours: 10, note: "Blanch briefly to remove skins easily." },
          grapes: { tempF: 135, hours: 18, note: "Cut in half. Can take up to 24 hours." },
          pineapple: { tempF: 135, hours: 12, note: "Core and remove skin. Pat dry." },
          cherries: { tempF: 135, hours: 14, note: "Pit and halve for faster drying." },
          cranberries: { tempF: 135, hours: 12, note: "Pierce or halve for moisture release." },
        };

        const data = fruitData[fruit] || fruitData.apples;
        let timeMult = 1.0;
        if (thickness === "thin") timeMult = 0.75;
        if (thickness === "thick") timeMult = 1.35;

        const minHours = Math.round(data.hours * timeMult * 0.85);
        const maxHours = Math.round(data.hours * timeMult * 1.15);

        return {
          primary: {
            label: fruit.charAt(0).toUpperCase() + fruit.slice(1),
            value: `${formatNumber(minHours)}-${formatNumber(maxHours)} hours at ${formatNumber(data.tempF)}\u00b0F`,
          },
          details: [
            { label: "Temperature", value: `${formatNumber(data.tempF)}\u00b0F (${formatNumber((data.tempF - 32) * 5 / 9, 0)}\u00b0C)` },
            { label: "Estimated Time", value: `${formatNumber(minHours)}-${formatNumber(maxHours)} hours` },
            { label: "Doneness Test", value: "Pliable with no moisture when squeezed" },
          ],
          note: data.note,
        };
      },
    },
    {
      id: "jerky",
      name: "Meat Jerky",
      description: "Dehydrating times and temperatures for beef, turkey, or venison jerky",
      fields: [
        {
          name: "meatType",
          label: "Meat Type",
          type: "select",
          options: [
            { label: "Beef (lean cuts)", value: "beef" },
            { label: "Turkey Breast", value: "turkey" },
            { label: "Venison/Deer", value: "venison" },
            { label: "Chicken Breast", value: "chicken" },
            { label: "Salmon/Fish", value: "fish" },
          ],
          defaultValue: "beef",
        },
        {
          name: "sliceThickness",
          label: "Slice Thickness",
          type: "select",
          options: [
            { label: "Thin (1/8 inch)", value: "thin" },
            { label: "Standard (1/4 inch)", value: "standard" },
          ],
          defaultValue: "standard",
        },
      ],
      calculate: (inputs) => {
        const meatType = inputs.meatType as string;
        const sliceThickness = inputs.sliceThickness as string;

        const meatData: Record<string, { tempF: number; hours: number; note: string }> = {
          beef: { tempF: 160, hours: 6, note: "Slice against the grain. Lean cuts like eye of round work best." },
          turkey: { tempF: 165, hours: 6, note: "Very lean. Marinate well for moisture." },
          venison: { tempF: 160, hours: 7, note: "Very lean game meat. Freeze to 0\u00b0F for 30 days first (parasite safety)." },
          chicken: { tempF: 165, hours: 6, note: "Must reach 165\u00b0F internal temp. Pre-cook if dehydrator cannot reach 165\u00b0F." },
          fish: { tempF: 145, hours: 8, note: "Use very fresh fish. Brine first for safety and flavor." },
        };

        const data = meatData[meatType] || meatData.beef;
        const timeMult = sliceThickness === "thin" ? 0.75 : 1.0;
        const minHours = Math.round(data.hours * timeMult * 0.85);
        const maxHours = Math.round(data.hours * timeMult * 1.25);

        // Yield: meat loses about 50-60% weight
        const yieldPct = 40;

        return {
          primary: {
            label: `${meatType.charAt(0).toUpperCase() + meatType.slice(1)} Jerky`,
            value: `${formatNumber(minHours)}-${formatNumber(maxHours)} hours at ${formatNumber(data.tempF)}\u00b0F`,
          },
          details: [
            { label: "Temperature", value: `${formatNumber(data.tempF)}\u00b0F (${formatNumber((data.tempF - 32) * 5 / 9, 0)}\u00b0C)` },
            { label: "Estimated Time", value: `${formatNumber(minHours)}-${formatNumber(maxHours)} hours` },
            { label: "Approximate Yield", value: `~${formatNumber(yieldPct)}% of raw weight` },
            { label: "Doneness Test", value: "Bends and cracks but does not break" },
          ],
          note: data.note,
        };
      },
    },
    {
      id: "herbs-veggies",
      name: "Herbs & Vegetables",
      description: "Dehydrating times for herbs and vegetables",
      fields: [
        {
          name: "item",
          label: "Item",
          type: "select",
          options: [
            { label: "Basil", value: "basil" },
            { label: "Oregano", value: "oregano" },
            { label: "Rosemary", value: "rosemary" },
            { label: "Parsley", value: "parsley" },
            { label: "Tomatoes (sliced)", value: "tomatoes" },
            { label: "Peppers (sliced)", value: "peppers" },
            { label: "Mushrooms (sliced)", value: "mushrooms" },
            { label: "Onions (sliced)", value: "onions" },
            { label: "Zucchini (sliced)", value: "zucchini" },
            { label: "Kale (chips)", value: "kale" },
          ],
          defaultValue: "basil",
        },
      ],
      calculate: (inputs) => {
        const item = inputs.item as string;

        const itemData: Record<string, { tempF: number; hours: number; note: string }> = {
          basil: { tempF: 95, hours: 4, note: "Low temp preserves essential oils." },
          oregano: { tempF: 95, hours: 4, note: "Strip leaves from stems after drying." },
          rosemary: { tempF: 95, hours: 5, note: "Woody stems help hold shape." },
          parsley: { tempF: 95, hours: 3, note: "Dries quickly. Check often." },
          tomatoes: { tempF: 135, hours: 10, note: "Core and slice 1/4 inch thick." },
          peppers: { tempF: 125, hours: 8, note: "Remove seeds and slice into rings or strips." },
          mushrooms: { tempF: 125, hours: 6, note: "Slice 1/4 inch thick. Clean but do not soak." },
          onions: { tempF: 125, hours: 8, note: "Slice into 1/4 inch rings." },
          zucchini: { tempF: 125, hours: 8, note: "Slice thin for crispy chips." },
          kale: { tempF: 125, hours: 4, note: "Remove stems. Toss with olive oil for chips." },
        };

        const data = itemData[item] || itemData.basil;
        const minHours = Math.round(data.hours * 0.85);
        const maxHours = Math.round(data.hours * 1.2);

        return {
          primary: {
            label: item.charAt(0).toUpperCase() + item.slice(1),
            value: `${formatNumber(minHours)}-${formatNumber(maxHours)} hours at ${formatNumber(data.tempF)}\u00b0F`,
          },
          details: [
            { label: "Temperature", value: `${formatNumber(data.tempF)}\u00b0F (${formatNumber((data.tempF - 32) * 5 / 9, 0)}\u00b0C)` },
            { label: "Estimated Time", value: `${formatNumber(minHours)}-${formatNumber(maxHours)} hours` },
            { label: "Doneness Test", value: item === "basil" || item === "oregano" || item === "rosemary" || item === "parsley" ? "Crumbles easily between fingers" : "Brittle or leathery with no moisture" },
          ],
          note: data.note,
        };
      },
    },
  ],
  relatedSlugs: [
    "canning-time-calculator",
    "fermentation-time-calculator",
    "cooking-converter",
  ],
  faq: [
    {
      question: "What temperature should I use for dehydrating food?",
      answer:
        "Herbs: 95-105\u00b0F to preserve essential oils. Fruits and vegetables: 125-135\u00b0F. Meat jerky: 160-165\u00b0F (USDA recommends meat reach this internal temperature for safety). Higher temps cause case-hardening where the outside dries but the inside stays moist.",
    },
    {
      question: "How long does dehydrated food last?",
      answer:
        "Properly dehydrated and stored food lasts 6-12 months at room temperature and up to 1-2 years in the freezer. Store in airtight containers or vacuum-sealed bags in a cool, dark place. Jerky lasts 1-2 months at room temperature and 6 months frozen.",
    },
  ],
  formula:
    "Dehydrating time varies by food density, water content, and thickness | Herbs: 95-105\u00b0F | Fruits/Veg: 125-135\u00b0F | Meat: 160-165\u00b0F",
};
