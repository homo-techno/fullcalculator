import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cookingTempCalculator: CalculatorDefinition = {
  slug: "cooking-temperature-calculator",
  title: "Cooking Temperature Calculator",
  description: "Free cooking temperature calculator. Find safe internal cooking temperatures for meat, poultry, and fish. Convert oven temperatures.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cooking temperature", "meat temperature", "safe cooking temp", "internal temperature", "oven temperature converter"],
  variants: [
    {
      id: "meatTemp",
      name: "Safe Internal Temperatures",
      fields: [
        {
          name: "food", label: "Food Type", type: "select",
          options: [
            { label: "Beef/Pork/Lamb (steaks, roasts)", value: "beef" },
            { label: "Ground Meat (beef, pork, lamb)", value: "ground" },
            { label: "Chicken/Turkey (whole)", value: "poultry" },
            { label: "Fish & Shellfish", value: "fish" },
          ],
        },
        {
          name: "doneness", label: "Doneness (steaks only)", type: "select",
          options: [
            { label: "Rare", value: "rare" }, { label: "Medium Rare", value: "medRare" },
            { label: "Medium", value: "medium" }, { label: "Medium Well", value: "medWell" },
            { label: "Well Done", value: "well" },
          ],
        },
      ],
      calculate: (inputs) => {
        const food = (inputs.food as string) || "beef";
        const doneness = (inputs.doneness as string) || "medium";
        const temps: Record<string, Record<string, [number, number]>> = {
          beef: { rare: [120, 49], medRare: [130, 54], medium: [140, 60], medWell: [150, 66], well: [160, 71] },
          ground: { rare: [160, 71], medRare: [160, 71], medium: [160, 71], medWell: [160, 71], well: [160, 71] },
          poultry: { rare: [165, 74], medRare: [165, 74], medium: [165, 74], medWell: [165, 74], well: [165, 74] },
          fish: { rare: [125, 52], medRare: [130, 54], medium: [145, 63], medWell: [145, 63], well: [145, 63] },
        };
        const [f, c] = temps[food]?.[doneness] || [145, 63];
        const usdaMin = food === "poultry" ? 165 : food === "ground" ? 160 : 145;
        return {
          primary: { label: "Internal Temperature", value: `${f}°F (${c}°C)` },
          details: [
            { label: "USDA minimum safe temp", value: `${usdaMin}°F (${formatNumber((usdaMin - 32) * 5/9, 0)}°C)` },
            { label: "Rest time", value: food === "beef" ? "3 minutes" : "None required at safe temp" },
            { label: "Note", value: food === "ground" ? "Ground meat must reach 160°F — no pink" : food === "poultry" ? "All poultry must reach 165°F" : "Let rest 3 min after cooking" },
          ],
        };
      },
    },
    {
      id: "ovenConvert",
      name: "Oven Temperature Converter",
      fields: [
        { name: "temp", label: "Temperature", type: "number", placeholder: "e.g. 350" },
        { name: "from", label: "From", type: "select", options: [
          { label: "°F", value: "f" }, { label: "°C", value: "c" }, { label: "Gas Mark", value: "gas" },
        ]},
      ],
      calculate: (inputs) => {
        const temp = inputs.temp as number, from = (inputs.from as string) || "f";
        if (temp === undefined) return null;
        let f: number;
        switch (from) {
          case "c": f = temp * 9/5 + 32; break;
          case "gas": f = temp * 25 + 250; break;
          default: f = temp;
        }
        const c = (f - 32) * 5/9;
        const gas = Math.max(1, Math.round((f - 250) / 25));
        let description = "Very low";
        if (f >= 450) description = "Very hot";
        else if (f >= 400) description = "Hot";
        else if (f >= 350) description = "Moderate";
        else if (f >= 300) description = "Low";
        return {
          primary: { label: "Conversions", value: `${formatNumber(f, 0)}°F = ${formatNumber(c, 0)}°C` },
          details: [
            { label: "Fahrenheit", value: `${formatNumber(f, 0)}°F` },
            { label: "Celsius", value: `${formatNumber(c, 0)}°C` },
            { label: "Gas Mark", value: String(gas) },
            { label: "Description", value: description },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["temperature-converter", "cooking-converter", "unit-converter"],
  faq: [{ question: "What temperature should chicken be cooked to?", answer: "All poultry (chicken, turkey, duck) must reach an internal temperature of 165°F (74°C) for safety. Use a meat thermometer in the thickest part, avoiding bone." }],
  formula: "USDA: Poultry 165°F | Ground meat 160°F | Steaks 145°F + 3min rest",
};
