import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coffeeBrewingCalculator: CalculatorDefinition = {
  slug: "coffee-brewing-calculator",
  title: "Coffee Brewing Ratio Calculator",
  description:
    "Free coffee brewing ratio calculator. Get perfect coffee-to-water ratios for pour-over, French press, espresso, cold brew, and more.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "coffee brewing",
    "pour over ratio",
    "french press ratio",
    "espresso ratio",
    "cold brew ratio",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "servings",
          label: "Number of Servings",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "method",
          label: "Brewing Method",
          type: "select",
          options: [
            { label: "Pour Over (V60, Chemex)", value: "pour_over" },
            { label: "French Press", value: "french_press" },
            { label: "Espresso", value: "espresso" },
            { label: "Cold Brew Concentrate", value: "cold_brew" },
            { label: "AeroPress", value: "aeropress" },
            { label: "Drip / Auto Coffee Maker", value: "drip" },
            { label: "Moka Pot", value: "moka" },
          ],
        },
        {
          name: "strength",
          label: "Strength",
          type: "select",
          options: [
            { label: "Light", value: "light" },
            { label: "Medium", value: "medium" },
            { label: "Strong", value: "strong" },
          ],
        },
      ],
      calculate: (inputs) => {
        const servings = inputs.servings as number;
        const method = inputs.method as string;
        const strength = inputs.strength as string;
        if (!servings || servings <= 0) return null;

        const servingSizeMl: Record<string, number> = {
          pour_over: 250,
          french_press: 250,
          espresso: 30,
          cold_brew: 120,
          aeropress: 220,
          drip: 250,
          moka: 60,
        };

        const ratios: Record<string, Record<string, number>> = {
          pour_over: { light: 17, medium: 15, strong: 13 },
          french_press: { light: 17, medium: 14, strong: 12 },
          espresso: { light: 2.5, medium: 2, strong: 1.5 },
          cold_brew: { light: 8, medium: 5, strong: 4 },
          aeropress: { light: 16, medium: 13, strong: 11 },
          drip: { light: 18, medium: 16, strong: 14 },
          moka: { light: 10, medium: 7, strong: 5 },
        };

        const brewTimeMins: Record<string, string> = {
          pour_over: "3-4",
          french_press: "4",
          espresso: "0.4-0.5",
          cold_brew: "720-1440",
          aeropress: "1-2",
          drip: "5-6",
          moka: "4-5",
        };

        const grindSize: Record<string, string> = {
          pour_over: "Medium-Fine",
          french_press: "Coarse",
          espresso: "Very Fine",
          cold_brew: "Extra Coarse",
          aeropress: "Medium",
          drip: "Medium",
          moka: "Fine",
        };

        const waterTemp: Record<string, string> = {
          pour_over: "200-205°F",
          french_press: "200°F",
          espresso: "195-205°F",
          cold_brew: "Room temp / cold",
          aeropress: "175-205°F",
          drip: "195-205°F",
          moka: "Start with hot water",
        };

        const ratio = (ratios[method] && ratios[method][strength]) || 15;
        const mlPerServing = servingSizeMl[method] || 250;
        const totalWaterMl = servings * mlPerServing;
        const coffeeGrams = totalWaterMl / ratio;
        const coffeeTbsp = coffeeGrams / 5;

        return {
          primary: {
            label: "Coffee Needed",
            value: formatNumber(coffeeGrams, 1) + " g",
          },
          details: [
            { label: "Water Needed", value: formatNumber(totalWaterMl, 0) + " ml" },
            { label: "Coffee (tablespoons)", value: formatNumber(coffeeTbsp, 1) + " tbsp" },
            { label: "Ratio (water:coffee)", value: "1:" + ratio },
            { label: "Grind Size", value: grindSize[method] || "Medium" },
            { label: "Water Temperature", value: waterTemp[method] || "200°F" },
            { label: "Brew Time", value: (brewTimeMins[method] || "4") + " min" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["coffee-ratio-calculator", "caffeine-calculator"],
  faq: [
    {
      question: "What is the best coffee-to-water ratio?",
      answer:
        "The Specialty Coffee Association recommends a 1:15 to 1:18 ratio for drip and pour-over. French press works best at 1:12 to 1:15. Espresso uses a much more concentrated 1:1.5 to 1:2.5 ratio.",
    },
    {
      question: "How long should cold brew steep?",
      answer:
        "Cold brew should steep for 12-24 hours in the refrigerator. A 1:5 ratio produces a concentrate that can be diluted with water or milk at a 1:1 ratio when serving.",
    },
  ],
  formula:
    "Coffee (g) = Total Water (ml) / Ratio. Serving sizes vary by method: Pour Over 250ml, Espresso 30ml, Cold Brew 120ml. Ratios depend on method and strength preference.",
};
