import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hogwartsHouseCalculator: CalculatorDefinition = {
  slug: "hogwarts-house",
  title: "Hogwarts House Calculator",
  description: "Find out which Hogwarts house you belong to based on your personality traits and values.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hogwarts house", "harry potter", "sorting hat", "gryffindor", "slytherin", "ravenclaw", "hufflepuff"],
  variants: [
    {
      id: "calc",
      name: "Sort Into Your House",
      fields: [
        {
          name: "value1",
          label: "Most Important Value",
          type: "select",
          options: [
            { label: "Bravery", value: "bravery" },
            { label: "Ambition", value: "ambition" },
            { label: "Knowledge", value: "knowledge" },
            { label: "Loyalty", value: "loyalty" },
          ],
        },
        {
          name: "value2",
          label: "Secondary Value",
          type: "select",
          options: [
            { label: "Adventure", value: "adventure" },
            { label: "Power", value: "power" },
            { label: "Creativity", value: "creativity" },
            { label: "Fairness", value: "fairness" },
          ],
        },
        {
          name: "animal",
          label: "Preferred Animal",
          type: "select",
          options: [
            { label: "Lion", value: "lion" },
            { label: "Snake", value: "snake" },
            { label: "Eagle", value: "eagle" },
            { label: "Badger", value: "badger" },
          ],
        },
        {
          name: "color",
          label: "Preferred Color",
          type: "select",
          options: [
            { label: "Red and Gold", value: "red" },
            { label: "Green and Silver", value: "green" },
            { label: "Blue and Bronze", value: "blue" },
            { label: "Yellow and Black", value: "yellow" },
          ],
        },
      ],
      calculate: (inputs) => {
        const value1 = String(inputs.value1 || "bravery");
        const value2 = String(inputs.value2 || "adventure");
        const animal = String(inputs.animal || "lion");
        const color = String(inputs.color || "red");

        const scores: Record<string, number> = { gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 };

        const v1Map: Record<string, string> = { bravery: "gryffindor", ambition: "slytherin", knowledge: "ravenclaw", loyalty: "hufflepuff" };
        const v2Map: Record<string, string> = { adventure: "gryffindor", power: "slytherin", creativity: "ravenclaw", fairness: "hufflepuff" };
        const animalMap: Record<string, string> = { lion: "gryffindor", snake: "slytherin", eagle: "ravenclaw", badger: "hufflepuff" };
        const colorMap: Record<string, string> = { red: "gryffindor", green: "slytherin", blue: "ravenclaw", yellow: "hufflepuff" };

        scores[v1Map[value1] || "gryffindor"] += 3;
        scores[v2Map[value2] || "gryffindor"] += 2;
        scores[animalMap[animal] || "gryffindor"] += 2;
        scores[colorMap[color] || "gryffindor"] += 1;

        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const house = sorted[0][0];
        const total = sorted.reduce((s, e) => s + e[1], 0);
        const pct = Math.round((sorted[0][1] / total) * 100);

        const houseInfo: Record<string, { name: string; founder: string; trait: string; ghost: string; element: string }> = {
          gryffindor: { name: "Gryffindor", founder: "Godric Gryffindor", trait: "Courage, daring, nerve, chivalry", ghost: "Nearly Headless Nick", element: "Fire" },
          slytherin: { name: "Slytherin", founder: "Salazar Slytherin", trait: "Ambition, cunning, resourcefulness", ghost: "The Bloody Baron", element: "Water" },
          ravenclaw: { name: "Ravenclaw", founder: "Rowena Ravenclaw", trait: "Intelligence, wisdom, creativity, wit", ghost: "The Grey Lady", element: "Air" },
          hufflepuff: { name: "Hufflepuff", founder: "Helga Hufflepuff", trait: "Dedication, patience, loyalty, fair play", ghost: "The Fat Friar", element: "Earth" },
        };

        const info = houseInfo[house];

        return {
          primary: { label: "Your Hogwarts House", value: info.name },
          details: [
            { label: "Match Strength", value: pct + "%" },
            { label: "Founder", value: info.founder },
            { label: "Key Traits", value: info.trait },
            { label: "House Ghost", value: info.ghost },
            { label: "Element", value: info.element },
            { label: "Runner-Up House", value: houseInfo[sorted[1][0]].name },
          ],
          note: "This is a fan-made sorting tool for entertainment. Harry Potter is a trademark of Warner Bros. and J.K. Rowling.",
        };
      },
    },
  ],
  relatedSlugs: ["spirit-animal-calculator", "zodiac-sign-calculator", "dnd-character-calculator"],
  faq: [
    { question: "How does the sorting work?", answer: "We assign weighted points based on your value, animal, and color preferences, then match you to the house with the highest score." },
    { question: "Can I be in more than one house?", answer: "Like the Sorting Hat considers your preferences, you may have traits from multiple houses. The calculator shows your best match and runner-up." },
  ],
  formula: "House = highest weighted score from (primary value x3 + secondary value x2 + animal x2 + color x1)",
};
