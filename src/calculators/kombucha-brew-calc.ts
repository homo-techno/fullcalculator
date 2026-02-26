import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kombuchaBrewCalculator: CalculatorDefinition = {
  slug: "kombucha-brew-calculator",
  title: "Kombucha Brewing Calculator",
  description:
    "Free kombucha brewing calculator. Calculate tea, sugar, starter liquid, and fermentation times for first and second fermentation based on batch size and temperature.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "kombucha calculator",
    "kombucha brewing",
    "kombucha recipe",
    "kombucha fermentation time",
    "SCOBY brewing",
    "kombucha batch calculator",
  ],
  variants: [
    {
      id: "first-fermentation",
      name: "First Fermentation (F1)",
      description:
        "Calculate ingredients and time for primary kombucha fermentation",
      fields: [
        {
          name: "batchSize",
          label: "Batch Size",
          type: "select",
          options: [
            { label: "1 quart (32 oz)", value: "1" },
            { label: "Half gallon (64 oz)", value: "2" },
            { label: "1 gallon (128 oz)", value: "4" },
            { label: "2 gallons", value: "8" },
            { label: "5 gallons", value: "20" },
          ],
          defaultValue: "4",
        },
        {
          name: "teaType",
          label: "Tea Type",
          type: "select",
          options: [
            { label: "Black Tea", value: "black" },
            { label: "Green Tea", value: "green" },
            { label: "White Tea", value: "white" },
            { label: "Oolong Tea", value: "oolong" },
            { label: "Black + Green Blend", value: "blend" },
          ],
          defaultValue: "black",
        },
        {
          name: "temperature",
          label: "Room Temperature (\u00b0F)",
          type: "number",
          placeholder: "e.g. 75",
          min: 65,
          max: 85,
          step: 1,
          defaultValue: 75,
        },
      ],
      calculate: (inputs) => {
        const batchSize = parseFloat(inputs.batchSize as string); // in quarts
        const teaType = inputs.teaType as string;
        const temperature = parseFloat(inputs.temperature as string);
        if (!batchSize || !temperature) return null;

        // Per quart: ~2 tea bags (or 2 tsp loose), ~1/4 cup sugar, ~1/2 cup starter
        const teaBags = Math.ceil(batchSize * 2);
        const teaTsp = batchSize * 2; // loose leaf
        const sugarCups = batchSize * 0.25;
        const sugarGrams = sugarCups * 200; // 1 cup sugar = ~200g
        const starterCups = batchSize * 0.5;
        const waterCups = batchSize * 4 - starterCups;

        // Fermentation time: base 7-14 days at 75F
        let baseDays = 10;
        if (teaType === "green" || teaType === "white") baseDays = 8;
        if (teaType === "oolong") baseDays = 9;

        const tempFactor = Math.pow(2, (75 - temperature) / 15);
        const minDays = Math.max(5, Math.round(7 * tempFactor));
        const maxDays = Math.round(14 * tempFactor);
        const idealDays = Math.round(baseDays * tempFactor);

        return {
          primary: {
            label: `${formatNumber(batchSize)} quart kombucha batch`,
            value: `${formatNumber(minDays)}-${formatNumber(maxDays)} days`,
          },
          details: [
            { label: "Water", value: `${formatNumber(waterCups, 1)} cups` },
            { label: "Tea Bags (or loose tsp)", value: `${formatNumber(teaBags)} bags (${formatNumber(teaTsp)} tsp loose)` },
            { label: "Sugar", value: `${formatNumber(sugarCups, 2)} cups (${formatNumber(sugarGrams)} g)` },
            { label: "Starter Liquid", value: `${formatNumber(starterCups, 1)} cups` },
            { label: "SCOBY", value: "1 per vessel" },
            { label: "Fermentation Range", value: `${formatNumber(minDays)}-${formatNumber(maxDays)} days` },
            { label: "Ideal Fermentation", value: `~${formatNumber(idealDays)} days` },
          ],
          note: "Taste starting at day 5-7. It should be slightly sweet and tangy. More time = more vinegary. Cover with a breathable cloth and rubber band, not a sealed lid.",
        };
      },
    },
    {
      id: "second-fermentation",
      name: "Second Fermentation (F2)",
      description:
        "Calculate flavoring and carbonation for bottled kombucha",
      fields: [
        {
          name: "bottleCount",
          label: "Number of Bottles (16 oz)",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          step: 1,
        },
        {
          name: "flavor",
          label: "Flavoring Type",
          type: "select",
          options: [
            { label: "Fresh Fruit (chopped)", value: "fruit" },
            { label: "Fruit Juice", value: "juice" },
            { label: "Ginger", value: "ginger" },
            { label: "Herbs (mint, basil)", value: "herbs" },
            { label: "Plain (carbonation only)", value: "plain" },
          ],
          defaultValue: "fruit",
        },
        {
          name: "temperature",
          label: "Room Temperature (\u00b0F)",
          type: "number",
          placeholder: "e.g. 75",
          min: 65,
          max: 85,
          step: 1,
          defaultValue: 75,
        },
      ],
      calculate: (inputs) => {
        const bottles = parseFloat(inputs.bottleCount as string);
        const flavor = inputs.flavor as string;
        const temperature = parseFloat(inputs.temperature as string);
        if (!bottles || bottles <= 0 || !temperature) return null;

        // Flavoring amounts per 16 oz bottle
        let flavoringPerBottle = "";
        let sugarBoostTsp = 0;
        if (flavor === "fruit") {
          flavoringPerBottle = "2-3 tbsp chopped fruit";
          sugarBoostTsp = 0;
        } else if (flavor === "juice") {
          flavoringPerBottle = "2-3 tbsp juice (10-15% of volume)";
          sugarBoostTsp = 0;
        } else if (flavor === "ginger") {
          flavoringPerBottle = "1 tsp grated ginger";
          sugarBoostTsp = 0.25;
        } else if (flavor === "herbs") {
          flavoringPerBottle = "2-3 leaves";
          sugarBoostTsp = 0.5;
        } else {
          flavoringPerBottle = "None (add 1/2 tsp sugar for carbonation)";
          sugarBoostTsp = 0.5;
        }

        const totalSugarTsp = bottles * sugarBoostTsp;

        const tempFactor = Math.pow(2, (75 - temperature) / 15);
        const minDays = Math.max(1, Math.round(2 * tempFactor));
        const maxDays = Math.round(4 * tempFactor);

        return {
          primary: {
            label: `F2: ${formatNumber(bottles)} bottles`,
            value: `${formatNumber(minDays)}-${formatNumber(maxDays)} days`,
          },
          details: [
            { label: "Flavoring per Bottle", value: flavoringPerBottle },
            { label: "Extra Sugar (optional)", value: totalSugarTsp > 0 ? `${formatNumber(totalSugarTsp, 1)} tsp total (${formatNumber(sugarBoostTsp, 2)} per bottle)` : "Not needed (fruit provides sugar)" },
            { label: "Carbonation Time", value: `${formatNumber(minDays)}-${formatNumber(maxDays)} days` },
          ],
          note: "Use pressure-rated bottles (swing-top or plastic soda bottles). Burp bottles daily to prevent explosions. Refrigerate when desired carbonation is reached.",
        };
      },
    },
  ],
  relatedSlugs: [
    "fermentation-time-calculator",
    "bread-proofing-calculator",
    "cocktail-recipe-calculator",
  ],
  faq: [
    {
      question: "What is the ideal temperature for brewing kombucha?",
      answer:
        "The ideal brewing temperature is 75-80\u00b0F (24-27\u00b0C). Below 70\u00b0F, fermentation slows significantly and takes 2-3 weeks. Above 85\u00b0F, the SCOBY can be stressed and off-flavors develop. Use a heating strip in cold weather.",
    },
    {
      question: "How much sugar does kombucha actually contain after fermentation?",
      answer:
        "The SCOBY consumes most of the sugar during fermentation. A 7-day brew retains about 20-30% of the original sugar. A 14-day brew has very little residual sugar. Longer fermentation = less sugar but more vinegary taste.",
    },
    {
      question: "Can I use honey instead of sugar for kombucha?",
      answer:
        "Regular kombucha uses cane sugar because the SCOBY thrives on sucrose. Honey contains antimicrobial properties that can inhibit the SCOBY. Jun tea is a related ferment that uses honey with a specific culture adapted to it.",
    },
  ],
  formula:
    "Per quart: 2 tea bags + 1/4 cup sugar + 1/2 cup starter | F1: 7-14 days at 75\u00b0F | F2: 2-4 days in sealed bottles",
};
