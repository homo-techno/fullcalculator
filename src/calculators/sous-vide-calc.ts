import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sousVideCalculator: CalculatorDefinition = {
  slug: "sous-vide-calc",
  title: "Sous Vide Time & Temperature Calculator",
  description: "Free online sous vide time and temperature calculator. Get precise settings for perfectly cooked steak, chicken, pork, eggs, and more.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sous vide calculator", "sous vide time", "sous vide temperature", "immersion circulator", "precision cooking"],
  variants: [
    {
      id: "sous-vide",
      name: "Sous Vide Settings",
      fields: [
        {
          name: "protein",
          label: "Protein",
          type: "select",
          options: [
            { label: "Beef Steak", value: "steak" },
            { label: "Beef Roast", value: "beef_roast" },
            { label: "Chicken Breast", value: "chicken_breast" },
            { label: "Chicken Thigh", value: "chicken_thigh" },
            { label: "Pork Chop", value: "pork_chop" },
            { label: "Pork Tenderloin", value: "pork_tenderloin" },
            { label: "Salmon", value: "salmon" },
            { label: "Shrimp", value: "shrimp" },
            { label: "Eggs (Soft)", value: "eggs_soft" },
            { label: "Eggs (Hard)", value: "eggs_hard" },
            { label: "Lamb Chop", value: "lamb_chop" },
          ],
        },
        {
          name: "doneness",
          label: "Doneness / Texture",
          type: "select",
          options: [
            { label: "Rare", value: "rare" },
            { label: "Medium Rare", value: "medium_rare" },
            { label: "Medium", value: "medium" },
            { label: "Medium Well", value: "medium_well" },
            { label: "Well Done", value: "well_done" },
          ],
        },
        { name: "thickness", label: "Thickness (inches)", type: "number", placeholder: "e.g. 1.5", step: 0.25 },
      ],
      calculate: (inputs) => {
        const protein = inputs.protein as string;
        const doneness = inputs.doneness as string;
        const thickness = parseFloat(inputs.thickness as string) || 1;

        // Temperature in °F by protein and doneness
        const temps: Record<string, Record<string, number>> = {
          steak: { rare: 125, medium_rare: 131, medium: 140, medium_well: 150, well_done: 160 },
          beef_roast: { rare: 131, medium_rare: 135, medium: 145, medium_well: 155, well_done: 165 },
          chicken_breast: { rare: 140, medium_rare: 145, medium: 150, medium_well: 155, well_done: 165 },
          chicken_thigh: { rare: 148, medium_rare: 155, medium: 165, medium_well: 170, well_done: 176 },
          pork_chop: { rare: 135, medium_rare: 140, medium: 145, medium_well: 150, well_done: 160 },
          pork_tenderloin: { rare: 135, medium_rare: 140, medium: 145, medium_well: 150, well_done: 160 },
          salmon: { rare: 110, medium_rare: 115, medium: 120, medium_well: 130, well_done: 140 },
          shrimp: { rare: 130, medium_rare: 135, medium: 140, medium_well: 145, well_done: 150 },
          eggs_soft: { rare: 145, medium_rare: 147, medium: 150, medium_well: 155, well_done: 160 },
          eggs_hard: { rare: 160, medium_rare: 165, medium: 170, medium_well: 175, well_done: 180 },
          lamb_chop: { rare: 125, medium_rare: 131, medium: 140, medium_well: 150, well_done: 160 },
        };

        // Base time in minutes for 1-inch thickness
        const baseTime: Record<string, number> = {
          steak: 60,
          beef_roast: 240,
          chicken_breast: 60,
          chicken_thigh: 120,
          pork_chop: 60,
          pork_tenderloin: 90,
          salmon: 45,
          shrimp: 30,
          eggs_soft: 45,
          eggs_hard: 60,
          lamb_chop: 60,
        };

        const temp = temps[protein]?.[doneness] || 135;
        const tempC = (temp - 32) * 5 / 9;
        const base = baseTime[protein] || 60;
        // Time increases roughly with square of thickness ratio
        const timeMinutes = base * Math.pow(thickness, 1.5);
        const hours = Math.floor(timeMinutes / 60);
        const minutes = Math.round(timeMinutes % 60);

        return {
          primary: { label: "Water Bath Temperature", value: `${formatNumber(temp)}°F (${formatNumber(tempC)}°C)` },
          details: [
            { label: "Cook Time", value: `${hours}h ${minutes}m` },
            { label: "Thickness", value: `${formatNumber(thickness)} in` },
            { label: "Doneness", value: doneness.replace("_", " ") },
            { label: "Sear After", value: "1-2 min per side (recommended)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["steak-cooking-time", "bbq-smoking-time", "ham-cooking-time"],
  faq: [
    {
      question: "What temperature is medium rare for sous vide steak?",
      answer: "Set your sous vide to 131°F (55°C) for a perfect medium rare steak. The steak should cook for at least 1 hour for a 1-inch thick cut, longer for thicker cuts.",
    },
    {
      question: "Do I need to sear after sous vide?",
      answer: "While not strictly required, searing is highly recommended. A quick 1-2 minute sear per side in a very hot pan creates a flavorful crust without overcooking the interior.",
    },
    {
      question: "Can you overcook food with sous vide?",
      answer: "While sous vide prevents overcooking in the traditional sense (the food cannot exceed the water temperature), leaving food in too long (over 4+ hours for tender cuts) can make the texture mushy.",
    },
  ],
  formula: "cook_time = base_time × thickness^1.5; temperature set to target doneness",
};
