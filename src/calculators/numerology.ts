import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function reduceToSingle(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    let sum = 0;
    while (num > 0) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    num = sum;
  }
  return num;
}

const lifePathMeanings: Record<number, string> = {
  1: "The Leader — Independent, ambitious, pioneering. Natural-born leaders with strong drive and determination.",
  2: "The Diplomat — Cooperative, sensitive, peacemaker. Excellent mediators who thrive in partnerships.",
  3: "The Communicator — Creative, expressive, social. Gifted with words, art, and self-expression.",
  4: "The Builder — Practical, disciplined, hardworking. Creates stable foundations and values order.",
  5: "The Adventurer — Freedom-loving, versatile, dynamic. Embraces change and craves new experiences.",
  6: "The Nurturer — Responsible, caring, domestic. Devoted to family, home, and community service.",
  7: "The Seeker — Analytical, introspective, spiritual. Driven by a quest for knowledge and truth.",
  8: "The Powerhouse — Ambitious, authoritative, successful. Strong business sense and material mastery.",
  9: "The Humanitarian — Compassionate, generous, idealistic. Dedicated to serving humanity and global causes.",
  11: "Master Number 11 — The Intuitive. Highly spiritual, inspirational, and visionary. A channel for higher truths.",
  22: "Master Number 22 — The Master Builder. Turns dreams into reality. Combines vision with practical ability.",
  33: "Master Number 33 — The Master Teacher. Embodies selfless love and spiritual upliftment of humanity.",
};

export const numerologyCalculator: CalculatorDefinition = {
  slug: "numerology-calculator",
  title: "Numerology Calculator",
  description: "Free numerology life path number calculator. Find your life path number from your birth date and discover its meaning.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["numerology calculator", "life path number", "numerology number", "birth date numerology", "numerology meaning"],
  variants: [
    {
      id: "calc",
      name: "Calculate Life Path Number",
      fields: [
        { name: "month", label: "Birth Month (1–12)", type: "number", placeholder: "e.g. 7", min: 1, max: 12 },
        { name: "day", label: "Birth Day (1–31)", type: "number", placeholder: "e.g. 15", min: 1, max: 31 },
        { name: "year", label: "Birth Year", type: "number", placeholder: "e.g. 1990", min: 1900, max: 2100 },
      ],
      calculate: (inputs) => {
        const month = inputs.month as number;
        const day = inputs.day as number;
        const year = inputs.year as number;
        if (!month || !day || !year) return null;

        // Reduce each component separately (preserving master numbers)
        const monthReduced = reduceToSingle(month);
        const dayReduced = reduceToSingle(day);
        const yearReduced = reduceToSingle(year);

        // Sum and reduce
        const total = monthReduced + dayReduced + yearReduced;
        const lifePath = reduceToSingle(total);

        const meaning = lifePathMeanings[lifePath] || "Unknown";

        // Digit sum breakdown
        const digitSum = `${monthReduced} + ${dayReduced} + ${yearReduced} = ${total}`;

        // Compatible numbers
        const compatibility: Record<number, string> = {
          1: "1, 3, 5",
          2: "2, 4, 8",
          3: "1, 3, 5",
          4: "2, 4, 8",
          5: "1, 3, 5",
          6: "2, 6, 9",
          7: "3, 5, 7",
          8: "2, 4, 8",
          9: "3, 6, 9",
          11: "2, 4, 8",
          22: "4, 6, 8",
          33: "6, 9, 11",
        };

        return {
          primary: { label: "Life Path Number", value: `${lifePath}` },
          details: [
            { label: "Meaning", value: meaning },
            { label: "Calculation", value: digitSum },
            { label: "Birth Date", value: `${month}/${day}/${year}` },
            { label: "Master Number?", value: lifePath === 11 || lifePath === 22 || lifePath === 33 ? "Yes" : "No" },
            { label: "Compatible Numbers", value: compatibility[lifePath] || "N/A" },
          ],
          note: "Numerology is not scientifically validated. Life path numbers are part of a belief system based on the mystical significance of numbers. Use for entertainment and self-reflection.",
        };
      },
    },
  ],
  relatedSlugs: ["life-path-calculator", "angel-number-calculator", "love-calculator"],
  faq: [
    { question: "What is a life path number?", answer: "A life path number is derived from your birth date by reducing each component (month, day, year) to a single digit (or master number 11, 22, 33), then summing and reducing again. It represents your life's purpose in numerology." },
    { question: "What are master numbers?", answer: "Master numbers are 11, 22, and 33. They are not reduced to single digits because they carry special significance in numerology. 11 is the Intuitive, 22 is the Master Builder, and 33 is the Master Teacher." },
    { question: "Is numerology real?", answer: "Numerology is a belief system, not a science. There is no scientific evidence that numbers derived from birth dates predict personality or destiny. Many people find it useful for self-reflection and entertainment." },
  ],
  formula: "Life Path = reduce(reduce(month) + reduce(day) + reduce(year)) to single digit or master number (11, 22, 33)",
};
