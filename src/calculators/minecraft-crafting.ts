import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const minecraftCraftingCalculator: CalculatorDefinition = {
  slug: "minecraft-crafting",
  title: "Minecraft Crafting Calculator",
  description: "Calculate how many raw materials you need to craft items in Minecraft. Plan your resource gathering efficiently.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["minecraft", "crafting calculator", "minecraft materials", "resource calculator", "minecraft items"],
  variants: [
    {
      id: "calc",
      name: "Calculate Materials Needed",
      fields: [
        {
          name: "item",
          label: "Item to Craft",
          type: "select",
          options: [
            { label: "Diamond Pickaxe", value: "diamond_pickaxe" },
            { label: "Iron Armor Set", value: "iron_armor" },
            { label: "Diamond Armor Set", value: "diamond_armor" },
            { label: "Bookshelf (15 for max enchanting)", value: "bookshelves_15" },
            { label: "Chest", value: "chest" },
            { label: "Crafting Table", value: "crafting_table" },
            { label: "Furnace", value: "furnace" },
            { label: "Bed", value: "bed" },
            { label: "64 Torches", value: "torches_64" },
            { label: "Enchanting Table", value: "enchanting_table" },
          ],
        },
        { name: "quantity", label: "Quantity", type: "number", placeholder: "e.g. 1", min: 1, max: 100, defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const item = String(inputs.item || "diamond_pickaxe");
        const qty = Number(inputs.quantity) || 1;

        const recipes: Record<string, { name: string; materials: Record<string, number>; output: number }> = {
          diamond_pickaxe: { name: "Diamond Pickaxe", materials: { "Diamonds": 3, "Sticks": 2, "Planks (for sticks)": 1 }, output: 1 },
          iron_armor: { name: "Iron Armor Set", materials: { "Iron Ingots": 24 }, output: 1 },
          diamond_armor: { name: "Diamond Armor Set", materials: { "Diamonds": 24 }, output: 1 },
          bookshelves_15: { name: "15 Bookshelves", materials: { "Planks": 90, "Books": 45, "Leather (for books)": 45, "Paper (for books)": 135, "Sugar Cane (for paper)": 135 }, output: 1 },
          chest: { name: "Chest", materials: { "Planks": 8, "Logs (for planks)": 2 }, output: 1 },
          crafting_table: { name: "Crafting Table", materials: { "Planks": 4, "Logs (for planks)": 1 }, output: 1 },
          furnace: { name: "Furnace", materials: { "Cobblestone": 8 }, output: 1 },
          bed: { name: "Bed", materials: { "Wool": 3, "Planks": 3, "Logs (for planks)": 1 }, output: 1 },
          torches_64: { name: "64 Torches", materials: { "Sticks": 16, "Coal/Charcoal": 16, "Planks (for sticks)": 8, "Logs (for planks)": 2 }, output: 1 },
          enchanting_table: { name: "Enchanting Table", materials: { "Diamonds": 2, "Obsidian": 4, "Book": 1, "Leather (for book)": 1, "Paper (for book)": 3 }, output: 1 },
        };

        const recipe = recipes[item];
        if (!recipe) return null;

        const details = Object.entries(recipe.materials).map(([mat, count]) => ({
          label: mat,
          value: formatNumber(count * qty),
        }));

        const totalItems = Object.values(recipe.materials).reduce((s, c) => s + c, 0) * qty;

        return {
          primary: { label: "Crafting", value: qty + "x " + recipe.name },
          details: [
            ...details,
            { label: "Total Raw Items Needed", value: formatNumber(totalItems) },
          ],
          note: "Material counts include sub-crafting requirements. Actual needs may vary with game version.",
        };
      },
    },
  ],
  relatedSlugs: ["dnd-character-calculator", "hogwarts-house-calculator", "binge-watch-time-calculator"],
  faq: [
    { question: "Are these material counts accurate?", answer: "They reflect standard Java Edition recipes. Some items require intermediate crafting steps which are included in the total." },
    { question: "Does this include all Minecraft items?", answer: "No, this covers some of the most commonly crafted items. Minecraft has hundreds of craftable items." },
  ],
  formula: "Materials = Recipe requirements x Quantity (including sub-crafting dependencies)",
};
