import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const luckyNumberCalculator: CalculatorDefinition = {
  slug: "lucky-number-calculator",
  title: "Lucky Number Generator",
  description:
    "Free lucky number generator. Generate lucky numbers based on your name, birthday, and numerology for lottery, games, and fun.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "lucky number",
    "lucky number generator",
    "lottery numbers",
    "numerology number",
    "fortune number",
    "random lucky number",
  ],
  variants: [
    {
      id: "lucky-from-birthday",
      name: "Lucky Numbers from Birthday",
      description: "Generate lucky numbers based on your birth date",
      fields: [
        {
          name: "birthYear",
          label: "Birth Year",
          type: "number",
          placeholder: "e.g. 1990",
          min: 1900,
          max: 2030,
        },
        {
          name: "birthMonth",
          label: "Birth Month",
          type: "number",
          placeholder: "1-12",
          min: 1,
          max: 12,
        },
        {
          name: "birthDay",
          label: "Birth Day",
          type: "number",
          placeholder: "1-31",
          min: 1,
          max: 31,
        },
        {
          name: "count",
          label: "How Many Numbers",
          type: "select",
          options: [
            { label: "3 numbers", value: "3" },
            { label: "5 numbers", value: "5" },
            { label: "6 numbers (lottery)", value: "6" },
            { label: "7 numbers", value: "7" },
          ],
        },
        {
          name: "maxNum",
          label: "Maximum Number",
          type: "select",
          options: [
            { label: "Up to 10", value: "10" },
            { label: "Up to 49", value: "49" },
            { label: "Up to 69 (Powerball)", value: "69" },
            { label: "Up to 100", value: "100" },
          ],
        },
      ],
      calculate: (inputs) => {
        const year = inputs.birthYear as number;
        const month = inputs.birthMonth as number;
        const day = inputs.birthDay as number;
        const countStr = (inputs.count as string) || "6";
        const maxStr = (inputs.maxNum as string) || "49";

        if (!year || !month || !day) return null;

        const count = parseInt(countStr);
        const maxNum = parseInt(maxStr);

        // Deterministic pseudo-random from birthday seed
        let seed = year * 10000 + month * 100 + day;
        const pseudoRandom = () => {
          seed = (seed * 16807 + 1) % 2147483647;
          return seed / 2147483647;
        };

        // Generate unique numbers
        const numbers: number[] = [];
        const used = new Set<number>();
        let attempts = 0;
        while (numbers.length < count && attempts < 1000) {
          const num = Math.floor(pseudoRandom() * maxNum) + 1;
          if (!used.has(num)) {
            used.add(num);
            numbers.push(num);
          }
          attempts++;
        }
        numbers.sort((a, b) => a - b);

        // Numerology: life path number
        const digits = `${year}${month}${day}`.split("").map(Number);
        let lifePathSum = digits.reduce((a, b) => a + b, 0);
        while (lifePathSum > 9 && lifePathSum !== 11 && lifePathSum !== 22 && lifePathSum !== 33) {
          lifePathSum = lifePathSum
            .toString()
            .split("")
            .map(Number)
            .reduce((a, b) => a + b, 0);
        }

        return {
          primary: {
            label: "Your Lucky Numbers",
            value: numbers.join(", "),
          },
          details: [
            { label: "Lucky numbers", value: numbers.join(", ") },
            { label: "Count", value: formatNumber(count) },
            { label: "Range", value: `1 to ${maxNum}` },
            { label: "Life Path Number", value: formatNumber(lifePathSum) },
            { label: "Birth date", value: `${month}/${day}/${year}` },
            { label: "Primary lucky number", value: formatNumber(numbers[0]) },
            { label: "Sum of lucky numbers", value: formatNumber(numbers.reduce((a, b) => a + b, 0)) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "numerology-calculator",
    "lottery-odds-calculator",
    "random-number-calculator",
  ],
  faq: [
    {
      question: "Are lucky numbers really lucky?",
      answer:
        "Lucky numbers are generated for fun and entertainment purposes. There is no scientific evidence that any number is inherently luckier than another. Lottery draws are random.",
    },
    {
      question: "How are the numbers generated?",
      answer:
        "The calculator uses your birth date as a seed for a deterministic algorithm, so the same birthday always produces the same lucky numbers. This is based on numerology traditions, not randomness.",
    },
  ],
  formula:
    "Numbers are generated using a seeded pseudo-random algorithm based on birth date. Life Path = sum digits of birthday, reduce to single digit.",
};
