import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const birthstoneCalculator: CalculatorDefinition = {
  slug: "birthstone-calculator",
  title: "Birthstone Calculator",
  description: "Find your birthstone based on your birth month, including its meaning, color, and properties.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["birthstone", "birth month stone", "gemstone", "birthstone meaning", "birthday stone"],
  variants: [
    {
      id: "calc",
      name: "Find Your Birthstone",
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

        const stones = [
          { name: "Garnet", color: "Deep Red", meaning: "Protection, strength, friendship", hardness: "6.5-7.5" },
          { name: "Amethyst", color: "Purple", meaning: "Wisdom, peace, courage", hardness: "7" },
          { name: "Aquamarine", color: "Light Blue", meaning: "Serenity, courage, clarity", hardness: "7.5-8" },
          { name: "Diamond", color: "Clear/White", meaning: "Eternal love, strength, invincibility", hardness: "10" },
          { name: "Emerald", color: "Green", meaning: "Rebirth, love, wisdom", hardness: "7.5-8" },
          { name: "Alexandrite", color: "Color-changing (green/red)", meaning: "Luck, prosperity, intellect", hardness: "8.5" },
          { name: "Ruby", color: "Red", meaning: "Passion, protection, prosperity", hardness: "9" },
          { name: "Peridot", color: "Olive Green", meaning: "Strength, healing, harmony", hardness: "6.5-7" },
          { name: "Sapphire", color: "Blue", meaning: "Wisdom, virtue, good fortune", hardness: "9" },
          { name: "Opal", color: "Multi-color iridescent", meaning: "Creativity, hope, innocence", hardness: "5.5-6.5" },
          { name: "Topaz", color: "Yellow/Orange", meaning: "Strength, intelligence, courage", hardness: "8" },
          { name: "Tanzanite", color: "Blue-Violet", meaning: "Transformation, spiritual growth", hardness: "6-7" },
        ];

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const s = stones[month - 1];

        return {
          primary: { label: "Your Birthstone", value: s.name },
          details: [
            { label: "Month", value: monthNames[month - 1] },
            { label: "Color", value: s.color },
            { label: "Meaning", value: s.meaning },
            { label: "Mohs Hardness", value: s.hardness },
          ],
          note: "Birthstones are based on the modern birthstone list adopted by the American Gem Trade Association.",
        };
      },
    },
  ],
  relatedSlugs: ["birth-flower-calculator", "zodiac-sign-calculator", "birthday-calculator"],
  faq: [
    { question: "What is a birthstone?", answer: "A birthstone is a gemstone associated with each month of the year. The modern list was standardized in 1912 by the National Association of Jewelers." },
    { question: "Can I wear a birthstone from a different month?", answer: "Absolutely! While birthstones have traditional associations, anyone can wear and enjoy any gemstone regardless of their birth month." },
  ],
  formula: "Birthstone = Traditional monthly gemstone assignment based on the modern birthstone list",
};
