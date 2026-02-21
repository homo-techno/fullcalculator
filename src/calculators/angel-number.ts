import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const angelMeanings: Record<string, { meaning: string; theme: string }> = {
  "000": { meaning: "Infinite potential and oneness with the universe. A fresh start is available.", theme: "Potential" },
  "111": { meaning: "New beginnings, manifestation, and alignment. Your thoughts are creating your reality.", theme: "New Beginnings" },
  "222": { meaning: "Balance, harmony, and trust. Everything is working out as it should.", theme: "Balance" },
  "333": { meaning: "Divine protection and encouragement. Your angels are near and supporting you.", theme: "Protection" },
  "444": { meaning: "Stability, foundation, and grounding. You are on the right path.", theme: "Stability" },
  "555": { meaning: "Major changes ahead. Embrace transformation and release what no longer serves you.", theme: "Change" },
  "666": { meaning: "Time to refocus. Balance material concerns with spiritual growth and self-care.", theme: "Refocus" },
  "777": { meaning: "Spiritual awakening and good fortune. You are in alignment with your highest self.", theme: "Luck" },
  "888": { meaning: "Abundance and financial prosperity. The universe is rewarding your efforts.", theme: "Abundance" },
  "999": { meaning: "Completion and closure. A chapter is ending to make way for something new.", theme: "Completion" },
  "1010": { meaning: "Stay positive and trust your journey. You are exactly where you need to be.", theme: "Trust" },
  "1111": { meaning: "A powerful manifestation portal. Make a wish — the universe is listening.", theme: "Manifestation" },
  "1212": { meaning: "Stay focused on your goals. Positive energy surrounds your endeavors.", theme: "Focus" },
  "1234": { meaning: "You are on the right track, step by step. Keep progressing forward.", theme: "Progress" },
};

export const angelNumberCalculator: CalculatorDefinition = {
  slug: "angel-number-calculator",
  title: "Angel Number Calculator",
  description: "Free angel number calculator. Discover the meaning of repeating numbers and angel number sequences.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["angel number calculator", "angel numbers meaning", "111 meaning", "222 meaning", "333 meaning", "444 meaning", "repeating numbers"],
  variants: [
    {
      id: "calc",
      name: "Look Up Angel Number",
      fields: [
        { name: "number", label: "Enter a Number", type: "number", placeholder: "e.g. 444 or 1111" },
      ],
      calculate: (inputs) => {
        const num = inputs.number as number;
        if (num === undefined || num === null) return null;

        const numStr = Math.abs(Math.round(num)).toString();

        // Check if it's a known angel number
        const known = angelMeanings[numStr];

        // Check patterns
        const isRepeating = numStr.length >= 2 && numStr.split("").every(c => c === numStr[0]);
        const isSequence = numStr.length >= 3 && numStr.split("").every((c, i) => i === 0 || parseInt(c) === parseInt(numStr[i - 1]) + 1);
        const isMirror = numStr.length >= 2 && numStr === numStr.split("").reverse().join("");

        let pattern: string;
        if (isRepeating) pattern = "Repeating digits";
        else if (isSequence) pattern = "Sequential digits";
        else if (isMirror) pattern = "Mirror/palindrome number";
        else pattern = "Standard number";

        // Digit root (reduce to single digit)
        let digitRoot = 0;
        for (const c of numStr) digitRoot += parseInt(c);
        while (digitRoot > 9 && digitRoot !== 11 && digitRoot !== 22 && digitRoot !== 33) {
          let sum = 0;
          while (digitRoot > 0) {
            sum += digitRoot % 10;
            digitRoot = Math.floor(digitRoot / 10);
          }
          digitRoot = sum;
        }

        const rootMeanings: Record<number, string> = {
          1: "Independence, leadership, new starts",
          2: "Partnership, balance, diplomacy",
          3: "Creativity, communication, growth",
          4: "Structure, stability, hard work",
          5: "Change, freedom, adventure",
          6: "Love, responsibility, healing",
          7: "Spirituality, wisdom, introspection",
          8: "Power, abundance, karma",
          9: "Completion, humanitarianism, wisdom",
          11: "Intuition, spiritual insight (master number)",
          22: "Master builder, turning dreams to reality (master number)",
          33: "Master teacher, compassion (master number)",
        };

        if (known) {
          return {
            primary: { label: `Angel Number ${numStr}`, value: known.theme },
            details: [
              { label: "Meaning", value: known.meaning },
              { label: "Pattern", value: pattern },
              { label: "Digit Root", value: `${digitRoot} — ${rootMeanings[digitRoot] || ""}` },
              { label: "Number", value: numStr },
            ],
            note: "Angel numbers are part of a spiritual belief system. They are not scientifically validated but are widely used for personal reflection and mindfulness.",
          };
        }

        // Generate meaning for non-standard numbers
        let generalMeaning = `The digit root of ${numStr} is ${digitRoot}. `;
        generalMeaning += rootMeanings[digitRoot] || "";
        if (isRepeating) generalMeaning += ` As a repeating number, this energy is amplified.`;
        if (isMirror) generalMeaning += ` As a mirror number, it suggests reflection and self-awareness.`;

        return {
          primary: { label: `Number ${numStr}`, value: rootMeanings[digitRoot] ? rootMeanings[digitRoot].split(",")[0] : "Analyze" },
          details: [
            { label: "Interpretation", value: generalMeaning },
            { label: "Pattern", value: pattern },
            { label: "Digit Root", value: `${digitRoot}` },
            { label: "Is Known Angel Number?", value: "No — showing digit root interpretation" },
          ],
          note: "This number is not a commonly recognized angel number. The interpretation is based on its digit root and pattern. Common angel numbers include 111, 222, 333, 444, 555, 666, 777, 888, 999.",
        };
      },
    },
  ],
  relatedSlugs: ["numerology-calculator", "life-path-calculator", "love-calculator"],
  faq: [
    { question: "What are angel numbers?", answer: "Angel numbers are repeating number sequences (like 111, 222, 333) that some believe carry spiritual messages. The concept comes from numerology and the idea that the universe communicates through patterns." },
    { question: "What does 444 mean?", answer: "Angel number 444 is associated with stability, protection, and being on the right path. It suggests your angels are near and you have a strong foundation." },
    { question: "What does 1111 mean?", answer: "Angel number 1111 is considered a powerful manifestation number. It's associated with new beginnings, spiritual awakening, and the alignment of your thoughts with reality." },
  ],
  formula: "Known angel numbers mapped to meanings | Unknown numbers analyzed by digit root and pattern (repeating, sequential, mirror)",
};
