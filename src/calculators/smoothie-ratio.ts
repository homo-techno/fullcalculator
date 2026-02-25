import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const smoothieRatioCalculator: CalculatorDefinition = {
  slug: "smoothie-ratio-calculator",
  title: "Smoothie Ratio Calculator",
  description:
    "Free smoothie ratio calculator. Get the perfect liquid, fruit, and add-in ratios for balanced, delicious smoothies.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "smoothie ratio",
    "smoothie recipe",
    "smoothie calculator",
    "fruit smoothie",
    "smoothie ingredients",
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
          name: "smoothieType",
          label: "Smoothie Type",
          type: "select",
          options: [
            { label: "Fruit Smoothie", value: "fruit" },
            { label: "Green Smoothie", value: "green" },
            { label: "Protein Smoothie", value: "protein" },
            { label: "Tropical Smoothie", value: "tropical" },
            { label: "Berry Smoothie", value: "berry" },
          ],
        },
        {
          name: "thickness",
          label: "Thickness Preference",
          type: "select",
          options: [
            { label: "Thin (drinkable)", value: "thin" },
            { label: "Medium", value: "medium" },
            { label: "Thick (bowl consistency)", value: "thick" },
          ],
        },
      ],
      calculate: (inputs) => {
        const servings = inputs.servings as number;
        const smoothieType = inputs.smoothieType as string;
        const thickness = inputs.thickness as string;
        if (!servings || servings <= 0) return null;

        const liquidCups: Record<string, number> = {
          thin: 1.25,
          medium: 1.0,
          thick: 0.75,
        };

        const liquidPerServing = liquidCups[thickness] || 1.0;
        const fruitPerServing = 1.5;
        const iceCubes = thickness === "thick" ? 4 : thickness === "medium" ? 6 : 8;

        const totalLiquid = liquidPerServing * servings;
        const totalFruit = fruitPerServing * servings;
        const totalIce = iceCubes * servings;

        const extras: Record<string, { name: string; amount: string }[]> = {
          fruit: [
            { name: "Banana", amount: String(servings) + " medium" },
            { name: "Yogurt", amount: formatNumber(servings * 0.5, 1) + " cups" },
            { name: "Honey/Sweetener", amount: servings + " tbsp" },
          ],
          green: [
            { name: "Spinach/Kale", amount: String(servings) + " cups (packed)" },
            { name: "Banana", amount: String(servings) + " medium" },
            { name: "Ginger (optional)", amount: formatNumber(servings * 0.5, 1) + " tsp" },
          ],
          protein: [
            { name: "Protein Powder", amount: String(servings) + " scoops" },
            { name: "Peanut Butter", amount: servings + " tbsp" },
            { name: "Banana", amount: String(servings) + " medium" },
          ],
          tropical: [
            { name: "Mango", amount: formatNumber(servings * 0.75, 1) + " cups" },
            { name: "Pineapple", amount: formatNumber(servings * 0.75, 1) + " cups" },
            { name: "Coconut Milk", amount: formatNumber(servings * 0.5, 1) + " cups" },
          ],
          berry: [
            { name: "Mixed Berries", amount: formatNumber(servings * 1.5, 1) + " cups" },
            { name: "Banana", amount: String(Math.ceil(servings * 0.5)) + " medium" },
            { name: "Yogurt", amount: formatNumber(servings * 0.5, 1) + " cups" },
          ],
        };

        const extraList = extras[smoothieType] || extras.fruit;
        const totalOz = (totalLiquid + totalFruit) * 8;
        const calories = smoothieType === "protein" ? servings * 350 : servings * 250;

        return {
          primary: {
            label: "Liquid Base",
            value: formatNumber(totalLiquid, 1) + " cups",
          },
          details: [
            { label: "Frozen Fruit", value: formatNumber(totalFruit, 1) + " cups" },
            { label: "Ice Cubes", value: String(totalIce) },
            { label: extraList[0].name, value: extraList[0].amount },
            { label: extraList[1].name, value: extraList[1].amount },
            { label: extraList[2].name, value: extraList[2].amount },
            { label: "Approx. Calories", value: formatNumber(calories, 0) + " cal" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["coffee-brewing-calculator", "calorie-calculator"],
  faq: [
    {
      question: "What is the ideal smoothie ratio?",
      answer:
        "The ideal smoothie ratio is roughly 2 parts fruit to 1 part liquid. Start with 1 cup liquid and 1.5 cups frozen fruit per serving. Adjust liquid for desired thickness.",
    },
    {
      question: "How do I make a thick smoothie bowl?",
      answer:
        "Use less liquid (3/4 cup per serving), more frozen fruit, and add a frozen banana. The key is using frozen ingredients rather than adding ice, which can make it watery.",
    },
  ],
  formula:
    "Liquid = Servings × Cups per serving (Thin 1.25, Medium 1, Thick 0.75). Fruit = Servings × 1.5 cups. Add-ins vary by type. Total yield approximately 16 oz per serving.",
};
