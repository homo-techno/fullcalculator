import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const jamSugarCalculator: CalculatorDefinition = {
  slug: "jam-sugar-calculator",
  title: "Jam/Jelly Sugar Ratio Calculator",
  description:
    "Free jam and jelly sugar ratio calculator. Get the right fruit-to-sugar ratio for homemade jams, jellies, and preserves.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "jam sugar ratio",
    "jelly recipe",
    "preserves calculator",
    "fruit to sugar",
    "canning calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "fruitAmount",
          label: "Fruit Amount (cups)",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "fruitType",
          label: "Fruit Type",
          type: "select",
          options: [
            { label: "Strawberry", value: "strawberry" },
            { label: "Raspberry", value: "raspberry" },
            { label: "Blueberry", value: "blueberry" },
            { label: "Peach", value: "peach" },
            { label: "Grape", value: "grape" },
            { label: "Apple", value: "apple" },
            { label: "Cherry", value: "cherry" },
            { label: "Blackberry", value: "blackberry" },
          ],
        },
        {
          name: "pectinType",
          label: "Pectin Type",
          type: "select",
          options: [
            { label: "Regular Pectin", value: "regular" },
            { label: "Low-Sugar Pectin", value: "low_sugar" },
            { label: "No Pectin (long cook)", value: "none" },
          ],
        },
      ],
      calculate: (inputs) => {
        const fruitCups = inputs.fruitAmount as number;
        const fruitType = inputs.fruitType as string;
        const pectinType = inputs.pectinType as string;
        if (!fruitCups || fruitCups <= 0) return null;

        const naturalPectin: Record<string, string> = {
          strawberry: "Low",
          raspberry: "Low",
          blueberry: "Medium",
          peach: "Low",
          grape: "Medium",
          apple: "High",
          cherry: "Low",
          blackberry: "Medium",
        };

        const sugarRatio: Record<string, number> = {
          regular: 1.0,
          low_sugar: 0.5,
          none: 0.75,
        };

        const ratio = sugarRatio[pectinType] || 1.0;
        const sugarCups = fruitCups * ratio;
        const sugarGrams = sugarCups * 200;
        const lemonJuiceTbsp = Math.ceil(fruitCups / 2);
        const pectinPackets = pectinType !== "none" ? Math.ceil(fruitCups / 4) : 0;
        const yieldCups = fruitCups + sugarCups * 0.6;
        const jars8oz = Math.ceil(yieldCups / 1);
        const cookTime = pectinType === "none" ? "45-60" : "10-15";
        const pectin = naturalPectin[fruitType] || "Medium";

        return {
          primary: {
            label: "Sugar Needed",
            value: formatNumber(sugarCups, 1) + " cups",
          },
          details: [
            { label: "Sugar (grams)", value: formatNumber(sugarGrams, 0) + " g" },
            { label: "Lemon Juice", value: lemonJuiceTbsp + " tbsp" },
            { label: "Pectin Packets", value: pectinPackets > 0 ? String(pectinPackets) : "None needed" },
            { label: "Natural Pectin Level", value: pectin },
            { label: "Estimated Yield", value: jars8oz + " jars (8 oz each)" },
            { label: "Cook Time (after boil)", value: cookTime + " min" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["canning-time-calculator", "recipe-scaler-calculator"],
  faq: [
    {
      question: "What is the fruit-to-sugar ratio for jam?",
      answer:
        "Traditional jam uses a 1:1 ratio of fruit to sugar by volume. Low-sugar recipes use a 2:1 ratio (fruit to sugar) with special low-sugar pectin. No-pectin recipes typically use a 4:3 ratio.",
    },
    {
      question: "Do I need to add pectin to all jams?",
      answer:
        "Not all fruits need added pectin. Apples, citrus, and cranberries are high in natural pectin. Low-pectin fruits like strawberries and peaches need added pectin for a proper set, or a longer cooking time.",
    },
  ],
  formula:
    "Sugar = Fruit cups × Sugar ratio. Ratios: Regular pectin 1:1, Low-sugar pectin 1:0.5, No pectin 1:0.75. Lemon juice = 1 tbsp per 2 cups fruit.",
};
