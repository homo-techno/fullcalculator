import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const compatibilityScoreCalculator: CalculatorDefinition = {
  slug: "compatibility-score-calculator",
  title: "Zodiac Compatibility Score Calculator",
  description:
    "Free zodiac compatibility calculator. Find your compatibility score with any zodiac sign. Explore love, friendship, and communication compatibility between all 12 signs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "zodiac compatibility",
    "astrology compatibility",
    "love compatibility",
    "sign compatibility",
    "horoscope match",
    "zodiac match",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Zodiac Compatibility",
      fields: [
        {
          name: "sign1",
          label: "Your Zodiac Sign",
          type: "select",
          options: [
            { label: "Aries", value: "aries" },
            { label: "Taurus", value: "taurus" },
            { label: "Gemini", value: "gemini" },
            { label: "Cancer", value: "cancer" },
            { label: "Leo", value: "leo" },
            { label: "Virgo", value: "virgo" },
            { label: "Libra", value: "libra" },
            { label: "Scorpio", value: "scorpio" },
            { label: "Sagittarius", value: "sagittarius" },
            { label: "Capricorn", value: "capricorn" },
            { label: "Aquarius", value: "aquarius" },
            { label: "Pisces", value: "pisces" },
          ],
        },
        {
          name: "sign2",
          label: "Their Zodiac Sign",
          type: "select",
          options: [
            { label: "Aries", value: "aries" },
            { label: "Taurus", value: "taurus" },
            { label: "Gemini", value: "gemini" },
            { label: "Cancer", value: "cancer" },
            { label: "Leo", value: "leo" },
            { label: "Virgo", value: "virgo" },
            { label: "Libra", value: "libra" },
            { label: "Scorpio", value: "scorpio" },
            { label: "Sagittarius", value: "sagittarius" },
            { label: "Capricorn", value: "capricorn" },
            { label: "Aquarius", value: "aquarius" },
            { label: "Pisces", value: "pisces" },
          ],
        },
      ],
      calculate: (inputs) => {
        const sign1 = inputs.sign1 as string;
        const sign2 = inputs.sign2 as string;

        if (!sign1 || !sign2) return null;

        const signs = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];
        const elements: Record<string, string> = {
          aries: "Fire", taurus: "Earth", gemini: "Air", cancer: "Water",
          leo: "Fire", virgo: "Earth", libra: "Air", scorpio: "Water",
          sagittarius: "Fire", capricorn: "Earth", aquarius: "Air", pisces: "Water",
        };
        const qualities: Record<string, string> = {
          aries: "Cardinal", taurus: "Fixed", gemini: "Mutable", cancer: "Cardinal",
          leo: "Fixed", virgo: "Mutable", libra: "Cardinal", scorpio: "Fixed",
          sagittarius: "Mutable", capricorn: "Cardinal", aquarius: "Fixed", pisces: "Mutable",
        };

        const idx1 = signs.indexOf(sign1);
        const idx2 = signs.indexOf(sign2);
        if (idx1 === -1 || idx2 === -1) return null;

        const distance = Math.abs(idx1 - idx2);
        const aspect = Math.min(distance, 12 - distance);

        // Compatibility based on aspect (angular distance)
        const aspectScores: Record<number, { love: number; friendship: number; communication: number; name: string }> = {
          0: { love: 80, friendship: 90, communication: 85, name: "Conjunction (Same Sign)" },
          1: { love: 45, friendship: 50, communication: 40, name: "Semi-Sextile" },
          2: { love: 85, friendship: 90, communication: 90, name: "Sextile" },
          3: { love: 55, friendship: 55, communication: 50, name: "Square (Challenging)" },
          4: { love: 90, friendship: 95, communication: 88, name: "Trine (Harmonious)" },
          5: { love: 50, friendship: 55, communication: 45, name: "Quincunx" },
          6: { love: 70, friendship: 65, communication: 75, name: "Opposition" },
        };

        const scores = aspectScores[aspect] || { love: 60, friendship: 60, communication: 60, name: "Unknown" };

        // Element compatibility bonus
        const elem1 = elements[sign1];
        const elem2 = elements[sign2];
        let elementBonus = 0;
        if (elem1 === elem2) elementBonus = 10;
        else if ((elem1 === "Fire" && elem2 === "Air") || (elem1 === "Air" && elem2 === "Fire")) elementBonus = 8;
        else if ((elem1 === "Earth" && elem2 === "Water") || (elem1 === "Water" && elem2 === "Earth")) elementBonus = 8;

        const love = Math.min(100, scores.love + elementBonus);
        const friendship = Math.min(100, scores.friendship + elementBonus);
        const communication = Math.min(100, scores.communication + elementBonus);
        const overall = Math.round((love + friendship + communication) / 3);

        const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

        let verdict: string;
        if (overall >= 85) verdict = "A cosmic match! The stars strongly favor this connection.";
        else if (overall >= 70) verdict = "Great compatibility! You complement each other well.";
        else if (overall >= 55) verdict = "Mixed energy. This pairing requires effort but can be rewarding.";
        else verdict = "Challenging match. Growth comes from navigating differences.";

        return {
          primary: {
            label: "Overall Compatibility",
            value: `${overall}%`,
          },
          details: [
            { label: "Signs", value: `${capitalize(sign1)} + ${capitalize(sign2)}` },
            { label: "Love Score", value: `${love}%` },
            { label: "Friendship Score", value: `${friendship}%` },
            { label: "Communication Score", value: `${communication}%` },
            { label: "Aspect", value: scores.name },
            { label: `${capitalize(sign1)} Element`, value: elem1 },
            { label: `${capitalize(sign2)} Element`, value: elem2 },
            { label: `${capitalize(sign1)} Quality`, value: qualities[sign1] },
            { label: `${capitalize(sign2)} Quality`, value: qualities[sign2] },
            { label: "Verdict", value: verdict },
          ],
          note: "Zodiac compatibility is based on traditional astrological aspects and elements. For a complete picture, a full birth chart comparison (synastry) is needed. This is for entertainment!",
        };
      },
    },
  ],
  relatedSlugs: ["zodiac-sign-calculator", "love-calculator", "chinese-zodiac-calculator"],
  faq: [
    {
      question: "Which zodiac signs are most compatible?",
      answer:
        "Signs of the same element tend to be highly compatible: Fire signs (Aries, Leo, Sagittarius) with each other, Earth with Earth, Air with Air, Water with Water. Additionally, Fire pairs well with Air, and Earth pairs well with Water. The most traditionally compatible aspects are Trines (4 signs apart) and Sextiles (2 signs apart).",
    },
    {
      question: "Can incompatible zodiac signs make a relationship work?",
      answer:
        "Absolutely! Zodiac compatibility is just one tiny piece of the puzzle. Real relationship success depends on communication, respect, shared values, and effort. Some of the most passionate and growth-oriented relationships are between 'incompatible' signs. Square aspects (challenging) often create intense attraction.",
    },
    {
      question: "What are the zodiac elements and why do they matter?",
      answer:
        "The four elements are Fire (passion, energy), Earth (stability, practicality), Air (intellect, communication), and Water (emotion, intuition). Compatible elements share similar values and communication styles. Fire and Air fuel each other, while Earth and Water nourish each other.",
    },
  ],
  formula:
    "Compatibility is calculated using angular distance between signs (aspects), element compatibility, and quality matches. Trines (120 degrees) and Sextiles (60 degrees) score highest.",
};
