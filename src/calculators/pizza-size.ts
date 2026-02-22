import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pizzaSizeCalculator: CalculatorDefinition = {
  slug: "pizza-size-calculator",
  title: "Pizza Size Comparison Calculator",
  description:
    "Free pizza size comparison calculator. Compare pizza sizes to find the best value. Discover why one 18-inch pizza is more than two 12-inch pizzas!",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pizza size",
    "pizza comparison",
    "pizza value",
    "pizza area",
    "pizza calculator",
    "best pizza deal",
  ],
  variants: [
    {
      id: "compare",
      name: "Compare Two Pizza Sizes",
      fields: [
        {
          name: "diameter1",
          label: "Pizza A Diameter (inches)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "price1",
          label: "Pizza A Price ($)",
          type: "number",
          placeholder: "e.g. 10",
          prefix: "$",
        },
        {
          name: "diameter2",
          label: "Pizza B Diameter (inches)",
          type: "number",
          placeholder: "e.g. 18",
        },
        {
          name: "price2",
          label: "Pizza B Price ($)",
          type: "number",
          placeholder: "e.g. 18",
          prefix: "$",
        },
        {
          name: "numPizzaA",
          label: "Number of Pizza A",
          type: "number",
          placeholder: "e.g. 2",
          defaultValue: 1,
        },
        {
          name: "numPizzaB",
          label: "Number of Pizza B",
          type: "number",
          placeholder: "e.g. 1",
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const d1 = inputs.diameter1 as number;
        const p1 = inputs.price1 as number;
        const d2 = inputs.diameter2 as number;
        const p2 = inputs.price2 as number;
        const n1 = (inputs.numPizzaA as number) || 1;
        const n2 = (inputs.numPizzaB as number) || 1;

        if (!d1 || !p1 || !d2 || !p2) return null;
        if (d1 <= 0 || d2 <= 0 || p1 <= 0 || p2 <= 0) return null;

        const area1 = Math.PI * Math.pow(d1 / 2, 2);
        const area2 = Math.PI * Math.pow(d2 / 2, 2);

        const totalArea1 = area1 * n1;
        const totalArea2 = area2 * n2;
        const totalPrice1 = p1 * n1;
        const totalPrice2 = p2 * n2;

        const pricePerSqIn1 = totalPrice1 / totalArea1;
        const pricePerSqIn2 = totalPrice2 / totalArea2;

        const betterDeal = pricePerSqIn1 < pricePerSqIn2 ? "A" : pricePerSqIn1 > pricePerSqIn2 ? "B" : "Tie";
        const savings = Math.abs(pricePerSqIn1 - pricePerSqIn2) / Math.max(pricePerSqIn1, pricePerSqIn2) * 100;

        const slicesA = Math.round(totalArea1 / 14.1);
        const slicesB = Math.round(totalArea2 / 14.1);

        return {
          primary: {
            label: "Best Value",
            value: betterDeal === "Tie" ? "It's a Tie!" : `Pizza ${betterDeal} wins!`,
          },
          details: [
            { label: `Pizza A: ${n1}x ${d1}" Area`, value: `${formatNumber(totalArea1, 1)} sq in` },
            { label: `Pizza B: ${n2}x ${d2}" Area`, value: `${formatNumber(totalArea2, 1)} sq in` },
            { label: "Pizza A Price/sq in", value: `$${formatNumber(pricePerSqIn1, 4)}` },
            { label: "Pizza B Price/sq in", value: `$${formatNumber(pricePerSqIn2, 4)}` },
            { label: "Area Difference", value: `${formatNumber(Math.abs(totalArea1 - totalArea2), 1)} sq in (${formatNumber(Math.max(totalArea1, totalArea2) / Math.min(totalArea1, totalArea2) * 100 - 100, 1)}% more)` },
            { label: "Price Savings", value: `${formatNumber(savings, 1)}% better per sq inch` },
            { label: "~Slices (Pizza A)", value: `${slicesA} slices` },
            { label: "~Slices (Pizza B)", value: `${slicesB} slices` },
          ],
          note: "A standard pizza slice is about 14.1 square inches. Remember: area scales with the SQUARE of the diameter!",
        };
      },
    },
  ],
  relatedSlugs: ["tip-split-calculator", "percentage-calculator"],
  faq: [
    {
      question: "Why is one 18-inch pizza bigger than two 12-inch pizzas?",
      answer:
        "Area = pi x r^2. An 18-inch pizza has an area of about 254 sq inches, while two 12-inch pizzas total only about 226 sq inches. The 18-inch pizza gives you 12% more pizza! This is because area grows with the square of the diameter, not linearly.",
    },
    {
      question: "What's the best pizza size for value?",
      answer:
        "Almost always the largest size. Larger pizzas cost relatively less per square inch because the dough, labor, and oven space don't increase proportionally. A typical 18-inch pizza costs 30-50% more than a 12-inch but delivers 125% more pizza.",
    },
    {
      question: "How many slices are in different pizza sizes?",
      answer:
        "A typical 10-inch pizza has 6 slices, a 12-inch has 8, a 14-inch has 10, a 16-inch has 12, and an 18-inch has 12-14 slices. But the slices on larger pizzas are themselves much bigger!",
    },
  ],
  formula:
    "Pizza Area = pi x (diameter/2)^2. Price per square inch = Total Price / Total Area. Bigger diameter = exponentially more pizza.",
};
