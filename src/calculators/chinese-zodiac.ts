import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chineseZodiacCalculator: CalculatorDefinition = {
  slug: "chinese-zodiac-calculator",
  title: "Chinese Zodiac Calculator",
  description:
    "Free Chinese zodiac calculator. Enter your birth year to find your Chinese zodiac animal and element in the 12-year cycle.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "chinese zodiac",
    "zodiac animal",
    "lunar new year",
    "birth year animal",
    "chinese astrology",
  ],
  variants: [
    {
      id: "calc",
      name: "Find Your Chinese Zodiac",
      fields: [
        {
          name: "birthYear",
          label: "Birth Year",
          type: "number",
          placeholder: "e.g. 1990",
        },
      ],
      calculate: (inputs) => {
        const birthYear = inputs.birthYear as number;
        if (!birthYear) return null;

        const animals = [
          "Monkey",
          "Rooster",
          "Dog",
          "Pig",
          "Rat",
          "Ox",
          "Tiger",
          "Rabbit",
          "Dragon",
          "Snake",
          "Horse",
          "Goat",
        ];

        const elements = ["Metal", "Water", "Wood", "Fire", "Earth"];

        const animalIndex = birthYear % 12;
        const animal = animals[animalIndex];

        const elementIndex = Math.floor((birthYear % 10) / 2);
        const element = elements[elementIndex];

        const yinYang = birthYear % 2 === 0 ? "Yang" : "Yin";

        const nextYear =
          birthYear + (12 - ((birthYear % 12) - (birthYear % 12))) + 12;
        const previousYear = birthYear - 12;

        return {
          primary: {
            label: "Chinese Zodiac Animal",
            value: `${element} ${animal}`,
          },
          details: [
            { label: "Animal", value: animal },
            { label: "Element", value: element },
            { label: "Yin/Yang", value: yinYang },
            { label: "Birth Year", value: formatNumber(birthYear, 0) },
            {
              label: "Previous Same Animal Year",
              value: formatNumber(previousYear, 0),
            },
            {
              label: "Next Same Animal Year",
              value: formatNumber(birthYear + 12, 0),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["zodiac-sign-calculator"],
  faq: [
    {
      question: "How is the Chinese zodiac animal determined?",
      answer:
        "The Chinese zodiac follows a 12-year cycle, with each year assigned one of 12 animals: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, and Pig. The animal is determined by birth year modulo 12.",
    },
    {
      question: "What are the five elements in Chinese astrology?",
      answer:
        "The five elements are Metal, Water, Wood, Fire, and Earth. They cycle every 10 years (2 consecutive years per element), adding another layer to the zodiac system.",
    },
  ],
  formula:
    "Animal = year mod 12 mapped to the 12-animal cycle. Element = (year mod 10) / 2 mapped to Metal, Water, Wood, Fire, Earth. Yin/Yang = even years are Yang, odd years are Yin.",
};
