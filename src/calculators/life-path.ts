import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function digitReduce(num: number, keepMasters: boolean = true): number {
  while (num > 9) {
    if (keepMasters && (num === 11 || num === 22 || num === 33)) break;
    let sum = 0;
    while (num > 0) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    num = sum;
  }
  return num;
}

function nameToNumber(name: string): number {
  const letterValues: Record<string, number> = {
    a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
    j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
    s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
  };
  let sum = 0;
  for (const char of name.toLowerCase()) {
    if (letterValues[char]) sum += letterValues[char];
  }
  return digitReduce(sum);
}

function vowelsOnly(name: string): number {
  const vowels = "aeiou";
  const letterValues: Record<string, number> = {
    a: 1, e: 5, i: 9, o: 6, u: 3,
  };
  let sum = 0;
  for (const char of name.toLowerCase()) {
    if (vowels.includes(char) && letterValues[char]) sum += letterValues[char];
  }
  return digitReduce(sum);
}

function consonantsOnly(name: string): number {
  const vowels = "aeiou";
  const letterValues: Record<string, number> = {
    b: 2, c: 3, d: 4, f: 6, g: 7, h: 8,
    j: 1, k: 2, l: 3, m: 4, n: 5, p: 7, q: 8, r: 9,
    s: 1, t: 2, v: 4, w: 5, x: 6, y: 7, z: 8,
  };
  let sum = 0;
  for (const char of name.toLowerCase()) {
    if (!vowels.includes(char) && letterValues[char]) sum += letterValues[char];
  }
  return digitReduce(sum);
}

const numberMeanings: Record<number, string> = {
  1: "Leadership, independence, innovation",
  2: "Cooperation, diplomacy, sensitivity",
  3: "Creativity, expression, joy",
  4: "Stability, hard work, discipline",
  5: "Freedom, adventure, change",
  6: "Nurturing, responsibility, harmony",
  7: "Wisdom, spirituality, introspection",
  8: "Power, abundance, achievement",
  9: "Compassion, service, completion",
  11: "Intuition, inspiration, illumination (Master)",
  22: "Master builder, large-scale achievement (Master)",
  33: "Master teacher, selfless service (Master)",
};

export const lifePathCalculator: CalculatorDefinition = {
  slug: "life-path-calculator",
  title: "Life Path Number Calculator",
  description: "Free detailed life path calculator. Calculate your life path, expression, and soul urge numbers from your birth date and name.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["life path calculator", "expression number", "soul urge number", "destiny number", "numerology birth date"],
  variants: [
    {
      id: "birthdate",
      name: "From Birth Date",
      fields: [
        { name: "month", label: "Birth Month (1–12)", type: "number", placeholder: "e.g. 11", min: 1, max: 12 },
        { name: "day", label: "Birth Day (1–31)", type: "number", placeholder: "e.g. 29", min: 1, max: 31 },
        { name: "year", label: "Birth Year", type: "number", placeholder: "e.g. 1985", min: 1900, max: 2100 },
      ],
      calculate: (inputs) => {
        const month = inputs.month as number;
        const day = inputs.day as number;
        const year = inputs.year as number;
        if (!month || !day || !year) return null;

        const monthR = digitReduce(month);
        const dayR = digitReduce(day);
        const yearR = digitReduce(year);
        const lifePath = digitReduce(monthR + dayR + yearR);

        // Birthday number (just the day reduced)
        const birthdayNumber = digitReduce(day, false);

        // Personal year (current year)
        const currentYear = new Date().getFullYear();
        const personalYear = digitReduce(monthR + dayR + digitReduce(currentYear));

        const meaning = numberMeanings[lifePath] || "Unknown";
        const personalYearMeaning = numberMeanings[personalYear] || "Unknown";

        return {
          primary: { label: "Life Path Number", value: `${lifePath}` },
          details: [
            { label: "Life Path Meaning", value: meaning },
            { label: "Birthday Number", value: `${birthdayNumber} — ${numberMeanings[birthdayNumber] || "Unknown"}` },
            { label: "Personal Year (${currentYear})", value: `${personalYear} — ${personalYearMeaning}` },
            { label: "Calculation", value: `${monthR} + ${dayR} + ${yearR} = ${monthR + dayR + yearR} → ${lifePath}` },
            { label: "Master Number?", value: [11, 22, 33].includes(lifePath) ? "Yes" : "No" },
          ],
          note: "The life path number reveals your life purpose. The birthday number shows a special talent. The personal year indicates the theme of the current year.",
        };
      },
    },
    {
      id: "name",
      name: "From Full Name",
      description: "Calculate expression and soul urge numbers from your full birth name",
      fields: [
        { name: "fullName", label: "Full Birth Name", type: "number", placeholder: "Enter your full name at birth" },
      ],
      calculate: (inputs) => {
        const fullName = String(inputs.fullName || "").trim();
        if (!fullName || fullName.length < 2) return null;

        const expression = nameToNumber(fullName);
        const soulUrge = vowelsOnly(fullName);
        const personality = consonantsOnly(fullName);

        return {
          primary: { label: "Expression Number", value: `${expression}` },
          details: [
            { label: "Expression Meaning", value: numberMeanings[expression] || "Unknown" },
            { label: "Soul Urge Number", value: `${soulUrge} — ${numberMeanings[soulUrge] || "Unknown"}` },
            { label: "Personality Number", value: `${personality} — ${numberMeanings[personality] || "Unknown"}` },
            { label: "Name Analyzed", value: fullName },
          ],
          note: "Expression number (all letters) = your natural abilities. Soul urge (vowels) = your inner desires. Personality number (consonants) = how others see you. Use your full name as given at birth.",
        };
      },
    },
  ],
  relatedSlugs: ["numerology-calculator", "angel-number-calculator", "love-calculator"],
  faq: [
    { question: "What is the difference between life path and expression numbers?", answer: "The life path number comes from your birth date and represents your life's purpose. The expression number comes from your full birth name and represents your natural talents and abilities." },
    { question: "What is a soul urge number?", answer: "The soul urge (or heart's desire) number is calculated from the vowels in your full birth name. It reveals your innermost desires, motivations, and what truly drives you." },
    { question: "What is a personal year?", answer: "Your personal year is calculated by adding your birth month, birth day, and the current calendar year, then reducing to a single digit. It reveals the theme and energy of the current year for you." },
  ],
  formula: "Life Path = reduce(month + day + year) | Expression = reduce(sum of all letter values) | Soul Urge = reduce(vowels only) | A=1, B=2... I=9, J=1...",
};
