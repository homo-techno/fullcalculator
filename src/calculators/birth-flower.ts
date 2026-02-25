import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const birthFlowerCalculator: CalculatorDefinition = {
  slug: "birth-flower",
  title: "Birth Flower Calculator",
  description: "Discover your birth flower based on your birth month, along with its meaning and symbolism.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["birth flower", "birth month flower", "flower meaning", "flower symbolism", "birthday flower"],
  variants: [
    {
      id: "calc",
      name: "Find Your Birth Flower",
      fields: [
        {
          name: "month",
          label: "Birth Month",
          type: "select",
          options: [
            { label: "January", value: "1" },
            { label: "February", value: "2" },
            { label: "March", value: "3" },
            { label: "April", value: "4" },
            { label: "May", value: "5" },
            { label: "June", value: "6" },
            { label: "July", value: "7" },
            { label: "August", value: "8" },
            { label: "September", value: "9" },
            { label: "October", value: "10" },
            { label: "November", value: "11" },
            { label: "December", value: "12" },
          ],
        },
      ],
      calculate: (inputs) => {
        const month = Number(inputs.month);
        if (!month || month < 1 || month > 12) return null;

        const flowers = [
          { primary: "Carnation", secondary: "Snowdrop", meaning: "Love, fascination, distinction", color: "Pink, Red, White" },
          { primary: "Violet", secondary: "Primrose", meaning: "Loyalty, faithfulness, modesty", color: "Purple, Blue, White" },
          { primary: "Daffodil", secondary: "Jonquil", meaning: "New beginnings, rebirth, hope", color: "Yellow, White" },
          { primary: "Daisy", secondary: "Sweet Pea", meaning: "Innocence, purity, joy", color: "White, Pink, Yellow" },
          { primary: "Lily of the Valley", secondary: "Hawthorn", meaning: "Sweetness, humility, happiness", color: "White, Pink" },
          { primary: "Rose", secondary: "Honeysuckle", meaning: "Love, passion, beauty", color: "Red, Pink, White, Yellow" },
          { primary: "Larkspur", secondary: "Water Lily", meaning: "Levity, lightness, swiftness", color: "Purple, Blue, Pink, White" },
          { primary: "Gladiolus", secondary: "Poppy", meaning: "Strength, integrity, honor", color: "Red, Pink, Yellow, Purple" },
          { primary: "Aster", secondary: "Morning Glory", meaning: "Wisdom, valor, faith", color: "Purple, Blue, Pink, White" },
          { primary: "Marigold", secondary: "Cosmos", meaning: "Warmth, creativity, passion", color: "Orange, Yellow, Gold" },
          { primary: "Chrysanthemum", secondary: "Peony", meaning: "Loyalty, devotion, longevity", color: "Red, Yellow, White, Purple" },
          { primary: "Narcissus", secondary: "Holly", meaning: "Faithfulness, respect, hope", color: "White, Yellow, Orange" },
        ];

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const f = flowers[month - 1];

        return {
          primary: { label: "Birth Flower", value: f.primary },
          details: [
            { label: "Month", value: monthNames[month - 1] },
            { label: "Primary Flower", value: f.primary },
            { label: "Secondary Flower", value: f.secondary },
            { label: "Meaning", value: f.meaning },
            { label: "Common Colors", value: f.color },
          ],
          note: "Birth flowers are a traditional way to celebrate the month of your birth, similar to birthstones.",
        };
      },
    },
  ],
  relatedSlugs: ["birthstone-calculator", "zodiac-sign-calculator", "birthday-calculator"],
  faq: [
    { question: "What is a birth flower?", answer: "Each month has one or two flowers associated with it, similar to birthstones. These traditional assignments carry symbolic meanings." },
    { question: "Can I have two birth flowers?", answer: "Yes! Most months have a primary and secondary birth flower, giving you two flowers to represent your birth month." },
  ],
  formula: "Birth Flower = Traditional monthly flower assignment based on birth month",
};
