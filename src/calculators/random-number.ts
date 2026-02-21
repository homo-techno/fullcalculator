import type { CalculatorDefinition } from "./types";

export const randomNumberGenerator: CalculatorDefinition = {
  slug: "random-number-generator",
  title: "Random Number Generator",
  description: "Free random number generator. Generate random numbers within any range. Perfect for lotteries, games, decision making, and statistics.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["random number generator", "rng", "random number", "random picker", "dice roller"],
  variants: [
    {
      id: "range",
      name: "Random Number in Range",
      description: "Generate a random integer between min and max (inclusive)",
      fields: [
        { name: "min", label: "Minimum", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
        { name: "max", label: "Maximum", type: "number", placeholder: "e.g. 100", defaultValue: 100 },
        { name: "count", label: "How Many Numbers", type: "number", placeholder: "e.g. 1", min: 1, max: 20, defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const min = inputs.min as number;
        const max = inputs.max as number;
        const count = Math.min((inputs.count as number) || 1, 20);
        if (min === undefined || max === undefined || min > max) return null;
        const numbers: number[] = [];
        for (let i = 0; i < count; i++) {
          numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        return {
          primary: { label: count === 1 ? "Random Number" : `${count} Random Numbers`, value: numbers.join(", ") },
          details: [
            { label: "Range", value: `${min} to ${max}` },
            ...(count > 1 ? [{ label: "Sum", value: `${numbers.reduce((a, b) => a + b, 0)}` }] : []),
          ],
          note: "Click any input field and change a value to generate new random numbers.",
        };
      },
    },
    {
      id: "dice",
      name: "Dice Roller",
      description: "Roll virtual dice",
      fields: [
        { name: "dice", label: "Number of Dice", type: "number", placeholder: "e.g. 2", min: 1, max: 10, defaultValue: 2 },
        { name: "sides", label: "Sides per Die", type: "select", options: [
          { label: "6 (standard)", value: "6" }, { label: "4 (d4)", value: "4" },
          { label: "8 (d8)", value: "8" }, { label: "10 (d10)", value: "10" },
          { label: "12 (d12)", value: "12" }, { label: "20 (d20)", value: "20" },
        ], defaultValue: "6" },
      ],
      calculate: (inputs) => {
        const numDice = Math.min((inputs.dice as number) || 2, 10);
        const sides = parseInt(inputs.sides as string) || 6;
        const rolls: number[] = [];
        for (let i = 0; i < numDice; i++) {
          rolls.push(Math.floor(Math.random() * sides) + 1);
        }
        const total = rolls.reduce((a, b) => a + b, 0);
        return {
          primary: { label: "Total", value: `${total}` },
          details: [
            { label: "Individual rolls", value: rolls.join(", ") },
            { label: "Dice", value: `${numDice}d${sides}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "standard-deviation-calculator"],
  faq: [
    { question: "Are these numbers truly random?", answer: "These numbers use Math.random(), a pseudorandom number generator. It is suitable for games, simulations, and everyday use, but not for cryptographic purposes." },
  ],
  formula: "Random Integer = floor(Math.random() x (max - min + 1)) + min",
};
