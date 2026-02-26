import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mashedPotatoesServingCalculator: CalculatorDefinition = {
  slug: "mashed-potatoes-serving-calculator",
  title: "Mashed Potatoes Per Person Calculator",
  description:
    "Free mashed potatoes per person calculator. Figure out how many pounds of potatoes you need for mashed potatoes based on number of guests and serving size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "mashed potatoes per person",
    "how many potatoes",
    "mashed potato calculator",
    "potatoes for crowd",
    "thanksgiving potatoes",
    "potato serving size",
  ],
  variants: [
    {
      id: "standard",
      name: "Standard Calculation",
      description:
        "Calculate mashed potato quantities based on guest count and serving style",
      fields: [
        {
          name: "guests",
          label: "Number of Guests",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
          step: 1,
        },
        {
          name: "servingSize",
          label: "Serving Size",
          type: "select",
          options: [
            { label: "Small side (1/2 cup / 4 oz)", value: "small" },
            { label: "Standard side (3/4 cup / 6 oz)", value: "standard" },
            { label: "Generous side (1 cup / 8 oz)", value: "generous" },
          ],
          defaultValue: "standard",
        },
        {
          name: "extras",
          label: "Leftovers?",
          type: "select",
          options: [
            { label: "No extra", value: "none" },
            { label: "A little extra (+15%)", value: "some" },
            { label: "Plenty of leftovers (+30%)", value: "lots" },
          ],
          defaultValue: "some",
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string);
        const servingSize = inputs.servingSize as string;
        const extras = inputs.extras as string;
        if (!guests || guests <= 0) return null;

        // Ounces of mashed potatoes per person (cooked)
        let ozPerPerson = 6;
        if (servingSize === "small") ozPerPerson = 4;
        if (servingSize === "generous") ozPerPerson = 8;

        let extraMult = 1.0;
        if (extras === "some") extraMult = 1.15;
        if (extras === "lots") extraMult = 1.3;

        const totalCookedOz = guests * ozPerPerson * extraMult;
        // Raw potatoes lose about 10-15% water when boiled then mashed with butter/milk
        // But you add back butter and milk. Roughly 1 lb raw = 1 lb mashed.
        // Actually ~1/3 lb raw potato per person for standard serving
        const rawLbs = totalCookedOz / 16;
        const rawKg = rawLbs * 0.453592;
        const mediumPotatoes = Math.ceil(rawLbs / 0.375); // medium potato ~6 oz
        const largePotatoes = Math.ceil(rawLbs / 0.625); // large potato ~10 oz

        // Extras: butter ~1 tbsp per lb, milk ~1/4 cup per lb
        const butterTbsp = Math.ceil(rawLbs * 1.5);
        const milkCups = rawLbs * 0.25;

        return {
          primary: {
            label: `Mashed potatoes for ${formatNumber(guests)} guests`,
            value: `${formatNumber(rawLbs, 1)} lbs potatoes`,
          },
          details: [
            {
              label: "Raw Potatoes Needed",
              value: `${formatNumber(rawLbs, 1)} lbs (${formatNumber(rawKg, 1)} kg)`,
            },
            {
              label: "Medium Potatoes (~6 oz each)",
              value: formatNumber(mediumPotatoes),
            },
            {
              label: "Large Potatoes (~10 oz each)",
              value: formatNumber(largePotatoes),
            },
            { label: "Butter", value: `~${formatNumber(butterTbsp)} tbsp` },
            {
              label: "Milk/Cream",
              value: `~${formatNumber(milkCups, 1)} cups`,
            },
          ],
          note: "Use Russet or Yukon Gold potatoes for the creamiest mashed potatoes. Yukon Golds have a naturally buttery flavor and creamy texture.",
        };
      },
    },
    {
      id: "by-potatoes",
      name: "By Potato Count",
      description: "Determine how many servings from a given amount of potatoes",
      fields: [
        {
          name: "pounds",
          label: "Potatoes Available (lbs)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0.5,
          step: 0.5,
        },
        {
          name: "servingSize",
          label: "Serving Size",
          type: "select",
          options: [
            { label: "Small side (4 oz)", value: "small" },
            { label: "Standard side (6 oz)", value: "standard" },
            { label: "Generous side (8 oz)", value: "generous" },
          ],
          defaultValue: "standard",
        },
      ],
      calculate: (inputs) => {
        const pounds = parseFloat(inputs.pounds as string);
        const servingSize = inputs.servingSize as string;
        if (!pounds || pounds <= 0) return null;

        let ozPerServing = 6;
        if (servingSize === "small") ozPerServing = 4;
        if (servingSize === "generous") ozPerServing = 8;

        const totalOz = pounds * 16;
        const servings = totalOz / ozPerServing;

        return {
          primary: {
            label: `${formatNumber(pounds, 1)} lbs potatoes`,
            value: `${formatNumber(servings, 0)} servings`,
          },
          details: [
            { label: "Servings", value: formatNumber(servings, 0) },
            {
              label: "Serving Size",
              value: `${formatNumber(ozPerServing)} oz each`,
            },
            {
              label: "Total Mashed (approx)",
              value: `${formatNumber(totalOz)} oz`,
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "turkey-size-calculator",
    "ham-per-person-calculator",
    "potluck-planner-calculator",
  ],
  faq: [
    {
      question: "How many pounds of potatoes per person for mashed potatoes?",
      answer:
        "Plan for about 1/3 to 1/2 pound of raw potatoes per person for a standard side serving. That yields roughly 3/4 cup of mashed potatoes per person after cooking and mashing with butter and milk.",
    },
    {
      question: "What type of potato is best for mashed potatoes?",
      answer:
        "Russet potatoes are fluffy and absorb butter and cream well. Yukon Gold potatoes are naturally creamy and buttery. For extra-creamy mashed potatoes, use Yukon Golds. For a lighter, fluffier texture, use Russets.",
    },
    {
      question: "Can I make mashed potatoes ahead of time?",
      answer:
        "Yes. Make mashed potatoes up to 2 days ahead. Store in the refrigerator and reheat in the oven at 350\u00b0F with extra butter and cream. You can also keep them warm for up to 2 hours in a slow cooker on low.",
    },
  ],
  formula:
    "Potatoes (lbs) = Guests x Oz per Person x Leftover Multiplier / 16 | ~1/3 lb raw potatoes per standard serving",
};
