import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sourdoughStarterCalculator: CalculatorDefinition = {
  slug: "sourdough-starter-calculator",
  title: "Sourdough Starter Calculator",
  description:
    "Free sourdough starter calculator. Calculate feeding ratios, levain amounts, and ingredient quantities for sourdough bread baking.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "sourdough starter calculator",
    "sourdough feeding ratio",
    "levain calculator",
    "sourdough bread calculator",
    "sourdough hydration",
    "sourdough recipe calculator",
  ],
  variants: [
    {
      id: "feeding",
      name: "Starter Feeding Calculator",
      description: "Calculate flour and water for feeding your starter",
      fields: [
        {
          name: "starterAmount",
          label: "Starter to Keep (grams)",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "feedingRatio",
          label: "Feeding Ratio (Starter:Flour:Water)",
          type: "select",
          options: [
            { label: "1:1:1 (Standard maintenance)", value: "1" },
            { label: "1:2:2 (Build activity)", value: "2" },
            { label: "1:3:3 (Strong build / warm climate)", value: "3" },
            { label: "1:5:5 (Slow fermentation / cold retard)", value: "5" },
          ],
        },
        {
          name: "hydration",
          label: "Starter Hydration",
          type: "select",
          options: [
            { label: "100% (Equal flour and water)", value: "100" },
            { label: "80% (Stiffer starter)", value: "80" },
            { label: "125% (Wetter starter)", value: "125" },
          ],
        },
      ],
      calculate: (inputs) => {
        const starterAmount = inputs.starterAmount as number;
        const ratio = parseFloat(inputs.feedingRatio as string) || 1;
        const hydration = parseFloat(inputs.hydration as string) || 100;
        if (!starterAmount) return null;

        const flour = starterAmount * ratio;
        const water = flour * (hydration / 100);
        const total = starterAmount + flour + water;

        // Estimate peak time based on ratio and room temp (~75F)
        const peakHours = ratio <= 1 ? "4-6" : ratio <= 2 ? "6-8" : ratio <= 3 ? "8-12" : "12-16";

        return {
          primary: {
            label: "Flour to Add",
            value: formatNumber(flour, 0) + " g",
          },
          details: [
            { label: "Starter (kept)", value: formatNumber(starterAmount, 0) + " g" },
            { label: "Flour", value: formatNumber(flour, 0) + " g" },
            { label: "Water", value: formatNumber(water, 0) + " g" },
            { label: "Total After Feeding", value: formatNumber(total, 0) + " g" },
            { label: "Feeding Ratio", value: "1:" + ratio + ":" + formatNumber(ratio * hydration / 100, 1) },
            { label: "Hydration", value: hydration + "%" },
            { label: "Est. Peak Time (75\u00B0F)", value: peakHours + " hours" },
            { label: "Discard", value: "Discard or use remaining starter before feeding" },
          ],
        };
      },
    },
    {
      id: "levain",
      name: "Levain / Recipe Calculator",
      description: "Calculate levain and ingredients for sourdough bread",
      fields: [
        {
          name: "flourWeight",
          label: "Total Flour in Recipe (grams)",
          type: "number",
          placeholder: "e.g. 500",
        },
        {
          name: "starterPct",
          label: "Starter / Levain Percentage",
          type: "select",
          options: [
            { label: "10% (Mild flavor, long rise)", value: "10" },
            { label: "15% (Moderate)", value: "15" },
            { label: "20% (Standard / balanced)", value: "20" },
            { label: "25% (Tangier, faster rise)", value: "25" },
            { label: "30% (Very sour, quick rise)", value: "30" },
          ],
        },
        {
          name: "hydration",
          label: "Dough Hydration",
          type: "select",
          options: [
            { label: "65% (Beginner-friendly)", value: "65" },
            { label: "70% (Standard)", value: "70" },
            { label: "75% (Open crumb)", value: "75" },
            { label: "80% (High hydration)", value: "80" },
            { label: "85% (Very high / ciabatta)", value: "85" },
          ],
        },
      ],
      calculate: (inputs) => {
        const totalFlour = inputs.flourWeight as number;
        const starterPct = parseFloat(inputs.starterPct as string) || 20;
        const hydration = parseFloat(inputs.hydration as string) || 75;
        if (!totalFlour) return null;

        const levain = totalFlour * (starterPct / 100);
        // Levain at 100% hydration: half flour, half water
        const levainFlour = levain / 2;
        const levainWater = levain / 2;

        const remainingFlour = totalFlour - levainFlour;
        const totalWater = totalFlour * (hydration / 100);
        const remainingWater = totalWater - levainWater;
        const salt = totalFlour * 0.02;
        const totalDough = totalFlour + totalWater + salt;

        return {
          primary: {
            label: "Levain Needed",
            value: formatNumber(levain, 0) + " g",
          },
          details: [
            { label: "Levain (ripe starter)", value: formatNumber(levain, 0) + " g" },
            { label: "Bread Flour", value: formatNumber(remainingFlour, 0) + " g" },
            { label: "Water", value: formatNumber(remainingWater, 0) + " g" },
            { label: "Salt (2%)", value: formatNumber(salt, 1) + " g" },
            { label: "Total Dough Weight", value: formatNumber(totalDough, 0) + " g" },
            { label: "Effective Hydration", value: hydration + "%" },
            { label: "Levain Build", value: formatNumber(levainFlour, 0) + "g flour + " + formatNumber(levainWater, 0) + "g water + starter" },
          ],
          note: "Build your levain 8-12 hours before mixing dough. It's ready when it has doubled in size and is domed on top.",
        };
      },
    },
  ],
  relatedSlugs: ["bread-recipe-calculator", "yeast-conversion-calculator", "pizza-dough-calculator"],
  faq: [
    {
      question: "What is the best feeding ratio for sourdough starter?",
      answer:
        "A 1:1:1 ratio (equal parts starter, flour, water by weight) is standard for daily maintenance. Use 1:2:2 or higher to build a more vigorous starter or in warm climates. Higher ratios slow fermentation and reduce sourness.",
    },
    {
      question: "How do I know when my levain is ready?",
      answer:
        "A ripe levain has roughly doubled in size, has a domed top, smells pleasantly sour, and passes the float test (a small piece floats in water). This typically takes 4-12 hours depending on temperature and feeding ratio.",
    },
    {
      question: "What is sourdough hydration?",
      answer:
        "Hydration is the ratio of water to flour by weight, expressed as a percentage. A 100% hydration starter has equal parts flour and water. Higher hydration starters are more liquid and ferment faster, while lower hydration starters are stiffer.",
    },
  ],
  formula:
    "Feeding: Flour = Starter x Ratio, Water = Flour x (Hydration/100). Levain for bread: Levain = Total Flour x (Starter%/100). Standard sourdough: 20% levain, 75% hydration, 2% salt (all baker's percentages based on total flour).",
};
