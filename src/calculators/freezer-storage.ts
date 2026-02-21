import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const freezerStorageCalculator: CalculatorDefinition = {
  slug: "freezer-storage-calculator",
  title: "Freezer Storage Time Calculator",
  description:
    "Free freezer storage time calculator. Find out how long food stays safe and maintains quality in the freezer for meats, produce, baked goods, and more.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "freezer storage time",
    "how long to freeze",
    "freezer food safety",
    "frozen food shelf life",
    "freezer storage chart",
    "how long does frozen food last",
  ],
  variants: [
    {
      id: "calc",
      name: "Freezer Storage Guide",
      fields: [
        {
          name: "category",
          label: "Food Category",
          type: "select",
          options: [
            { label: "Raw Beef / Lamb", value: "raw_beef" },
            { label: "Raw Pork", value: "raw_pork" },
            { label: "Raw Chicken / Turkey", value: "raw_poultry" },
            { label: "Raw Ground Meat", value: "ground_meat" },
            { label: "Raw Fish / Seafood", value: "raw_fish" },
            { label: "Cooked Meat / Poultry", value: "cooked_meat" },
            { label: "Soups & Stews", value: "soup" },
            { label: "Casseroles", value: "casserole" },
            { label: "Bread & Rolls", value: "bread" },
            { label: "Cakes & Pies", value: "cake" },
            { label: "Cookie Dough", value: "cookie_dough" },
            { label: "Fresh Berries", value: "berries" },
            { label: "Vegetables (blanched)", value: "vegetables" },
            { label: "Butter", value: "butter" },
            { label: "Cheese (hard)", value: "cheese_hard" },
            { label: "Cheese (soft)", value: "cheese_soft" },
            { label: "Milk / Cream", value: "milk" },
            { label: "Eggs (beaten, not in shell)", value: "eggs" },
          ],
        },
        {
          name: "freezerType",
          label: "Freezer Type",
          type: "select",
          options: [
            { label: "Standalone Freezer (0\u00B0F / -18\u00B0C)", value: "standalone" },
            { label: "Fridge Freezer Combo", value: "combo" },
          ],
        },
      ],
      calculate: (inputs) => {
        const category = inputs.category as string;
        const freezerType = inputs.freezerType as string;
        if (!category || !freezerType) return null;

        interface StorageData {
          months: number;
          quality: string;
          tips: string;
          thawMethod: string;
        }

        const storageGuide: Record<string, StorageData> = {
          raw_beef: { months: 12, quality: "Best within 6-12 months", tips: "Wrap tightly in freezer paper or vacuum seal. Remove air.", thawMethod: "Refrigerator (24 hrs per 5 lbs)" },
          raw_pork: { months: 6, quality: "Best within 4-6 months", tips: "Double wrap to prevent freezer burn. Label with date.", thawMethod: "Refrigerator (24 hrs per 5 lbs)" },
          raw_poultry: { months: 12, quality: "Whole: 12 months, Parts: 9 months", tips: "Remove original packaging and rewrap tightly.", thawMethod: "Refrigerator (24 hrs per 5 lbs)" },
          ground_meat: { months: 4, quality: "Best within 3-4 months", tips: "Flatten into thin portions for faster thawing.", thawMethod: "Refrigerator (overnight) or cold water" },
          raw_fish: { months: 6, quality: "Lean fish: 6-8 months, Fatty fish: 2-3 months", tips: "Glaze with ice water before wrapping for best results.", thawMethod: "Refrigerator (overnight)" },
          cooked_meat: { months: 3, quality: "Best within 2-3 months", tips: "Cool completely before freezing. Add sauce/gravy to keep moist.", thawMethod: "Refrigerator or microwave" },
          soup: { months: 3, quality: "Best within 2-3 months", tips: "Leave headspace for expansion. Cool before freezing.", thawMethod: "Refrigerator or stovetop from frozen" },
          casserole: { months: 3, quality: "Best within 2-3 months", tips: "Freeze in portion sizes. Undercook pasta slightly.", thawMethod: "Refrigerator overnight, bake from frozen +15 min" },
          bread: { months: 3, quality: "Best within 1-3 months", tips: "Slice before freezing. Double bag to prevent freezer burn.", thawMethod: "Room temperature (30 min) or toast directly" },
          cake: { months: 4, quality: "Unfrosted lasts longer (4 months). Frosted: 2 months.", tips: "Flash freeze unfrosted, then wrap. Buttercream freezes well.", thawMethod: "Refrigerator overnight" },
          cookie_dough: { months: 3, quality: "Best within 2-3 months", tips: "Pre-scoop into balls and flash freeze on a sheet.", thawMethod: "Bake directly from frozen, add 1-2 min" },
          berries: { months: 12, quality: "Best within 6-12 months", tips: "Freeze in single layer on sheet pan first, then bag.", thawMethod: "Use frozen in smoothies or thaw in fridge" },
          vegetables: { months: 12, quality: "Best within 8-12 months", tips: "Blanch before freezing to preserve color and texture.", thawMethod: "Cook directly from frozen" },
          butter: { months: 9, quality: "Best within 6-9 months", tips: "Keep in original wrapping plus freezer bag.", thawMethod: "Refrigerator overnight" },
          cheese_hard: { months: 6, quality: "Best within 4-6 months. Texture changes.", tips: "Grate before freezing for best results. May crumble after thawing.", thawMethod: "Refrigerator - use in cooking" },
          cheese_soft: { months: 2, quality: "Best within 1-2 months. Texture will change.", tips: "Not ideal for freezing. Best used in cooking after thawing.", thawMethod: "Refrigerator overnight" },
          milk: { months: 3, quality: "Best within 1-3 months. May separate.", tips: "Leave room for expansion. Shake well after thawing.", thawMethod: "Refrigerator (2-3 days)" },
          eggs: { months: 12, quality: "Best within 6-12 months", tips: "Beat eggs before freezing. Add pinch of salt or sugar to prevent graininess.", thawMethod: "Refrigerator overnight" },
        };

        const data = storageGuide[category];
        if (!data) return null;

        // Fridge/freezer combos typically reduce storage time by 20-30% due to temp fluctuation
        const adjustedMonths = freezerType === "combo" ? Math.round(data.months * 0.75) : data.months;

        return {
          primary: {
            label: "Maximum Storage Time",
            value: adjustedMonths + " months",
          },
          details: [
            { label: "Quality Window", value: data.quality },
            { label: "Freezer Type", value: freezerType === "standalone" ? "Standalone (0\u00B0F)" : "Fridge-Freezer Combo" },
            { label: "Storage Tips", value: data.tips },
            { label: "Best Thaw Method", value: data.thawMethod },
            { label: "Target Temp", value: "0\u00B0F (-18\u00B0C) or below" },
          ],
          note: freezerType === "combo"
            ? "Fridge-freezer combos have more temperature fluctuation from frequent opening. Storage times are reduced by ~25%."
            : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["meat-cooking-time-calculator", "meal-prep-calculator"],
  faq: [
    {
      question: "Is frozen food safe indefinitely?",
      answer:
        "Yes, food kept at 0\u00B0F is safe indefinitely from a food safety standpoint. However, quality (taste, texture, nutrition) degrades over time. The storage times listed are for optimal quality, not safety.",
    },
    {
      question: "What is freezer burn?",
      answer:
        "Freezer burn is dehydration and oxidation caused by air reaching the food surface. It appears as grayish-brown patches. While safe to eat, freezer-burned food has degraded flavor and texture. Prevent it by wrapping food tightly and removing air.",
    },
    {
      question: "What is the best way to thaw frozen food?",
      answer:
        "The safest method is thawing in the refrigerator (allow 24 hours per 5 lbs). For faster thawing, submerge sealed food in cold water (change water every 30 minutes). Microwave thawing works but cook immediately after. Never thaw on the counter.",
    },
  ],
  formula:
    "Storage times at 0\u00B0F (-18\u00B0C): Raw beef/poultry = 12 months, Raw pork = 6 months, Ground meat = 4 months, Cooked meat = 3 months, Vegetables = 12 months, Bread = 3 months. Fridge-freezer combos: reduce times by ~25%.",
};
