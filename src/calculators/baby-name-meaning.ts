import type { CalculatorDefinition } from "./types";

export const babyNameMeaningCalculator: CalculatorDefinition = {
  slug: "baby-name-meaning-calculator",
  title: "Baby Name Meaning Calculator",
  description:
    "Free baby name meaning calculator. Explore the numerology, letter analysis, and characteristics associated with baby names.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby name meaning",
    "name numerology",
    "name analysis",
    "baby name calculator",
    "what does name mean",
  ],
  variants: [
    {
      id: "numerology",
      name: "Name Numerology Analysis",
      description: "Analyze the numerological value and characteristics of a name",
      fields: [
        {
          name: "nameLength",
          label: "Number of Letters in Name",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 20,
        },
        {
          name: "firstLetter",
          label: "First Letter Position (A=1, B=2...Z=26)",
          type: "number",
          placeholder: "e.g. 5 for E",
          min: 1,
          max: 26,
        },
        {
          name: "vowelCount",
          label: "Number of Vowels (A,E,I,O,U)",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
          max: 15,
        },
        {
          name: "consonantCount",
          label: "Number of Consonants",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
          max: 15,
        },
      ],
      calculate: (inputs) => {
        const nameLength = inputs.nameLength as number;
        const firstLetter = inputs.firstLetter as number;
        const vowels = inputs.vowelCount as number;
        const consonants = inputs.consonantCount as number;
        if (!nameLength || !firstLetter || vowels === undefined || consonants === undefined) return null;

        // Numerology: reduce to single digit
        let numSum = firstLetter + nameLength + vowels + consonants;
        while (numSum > 9 && numSum !== 11 && numSum !== 22) {
          const digits = String(numSum).split("").map(Number);
          numSum = digits.reduce((a, b) => a + b, 0);
        }

        const numerologyMeanings: Record<number, string> = {
          1: "Leadership, independence, pioneer spirit",
          2: "Cooperation, diplomacy, sensitivity",
          3: "Creativity, expression, joy",
          4: "Stability, hard work, determination",
          5: "Freedom, adventure, versatility",
          6: "Nurturing, responsibility, harmony",
          7: "Wisdom, intuition, analytical mind",
          8: "Ambition, success, abundance",
          9: "Compassion, generosity, humanitarian",
          11: "Intuition, inspiration, master number",
          22: "Master builder, visionary, master number",
        };

        const meaning = numerologyMeanings[numSum] || "Unique and special combination";

        // Vowel/consonant ratio analysis
        const ratio = vowels / (consonants || 1);
        let soundQuality = "";
        if (ratio > 1.5) soundQuality = "Very melodic and flowing";
        else if (ratio > 0.8) soundQuality = "Balanced and harmonious";
        else if (ratio > 0.4) soundQuality = "Strong and grounded";
        else soundQuality = "Bold and commanding";

        // Name length analysis
        let lengthNote = "";
        if (nameLength <= 3) lengthNote = "Short, memorable, and impactful";
        else if (nameLength <= 5) lengthNote = "Classic length, easy to say and spell";
        else if (nameLength <= 7) lengthNote = "Elegant, with good nickname potential";
        else lengthNote = "Distinctive and formal, great nickname options";

        const letterNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const firstLetterChar = letterNames[firstLetter - 1] || "?";

        return {
          primary: { label: "Numerology Number", value: `${numSum} - ${meaning}` },
          details: [
            { label: "Sound quality", value: soundQuality },
            { label: "Name length analysis", value: lengthNote },
            { label: "First letter", value: `${firstLetterChar} (position ${firstLetter})` },
            { label: "Vowels / Consonants", value: `${vowels} / ${consonants}` },
            { label: "Letters total", value: `${nameLength}` },
            {
              label: "Syllable estimate",
              value: `~${Math.max(1, vowels)} syllables`,
            },
          ],
          note: "Name numerology is for entertainment purposes. The most important thing is that you love the name and it feels right for your family.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-name-popularity-calculator", "baby-growth-calculator"],
  faq: [
    {
      question: "What is name numerology?",
      answer:
        "Name numerology assigns numerical values to the letters in a name and reduces them to a single digit (1-9) or master number (11, 22). Each number is associated with certain personality traits and characteristics.",
    },
    {
      question: "Should I choose a name based on numerology?",
      answer:
        "Name numerology is for fun and inspiration. Choose a name you love that sounds good with your last name, has a meaning you connect with, and feels right for your family. Cultural significance and family traditions are also great considerations.",
    },
  ],
  formula:
    "Numerology number = sum of letter positions reduced to single digit (1-9) or master number (11, 22). Vowels indicate soul expression; consonants indicate outer personality.",
};
