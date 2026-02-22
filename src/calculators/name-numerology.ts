import type { CalculatorDefinition } from "./types";

export const nameNumerologyCalculator: CalculatorDefinition = {
  slug: "name-numerology-calculator",
  title: "Name Numerology Calculator",
  description:
    "Free name numerology calculator. Discover the hidden numerological meaning of your name using Pythagorean numerology. Find your Expression, Soul Urge, and Personality numbers.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "name numerology",
    "expression number",
    "soul urge number",
    "personality number",
    "pythagorean numerology",
    "name meaning",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Name Numerology",
      fields: [
        {
          name: "fullName",
          label: "Your Full Name",
          type: "number",
          placeholder: "Enter your full birth name",
        },
      ],
      calculate: (inputs) => {
        const name = String(inputs.fullName || "").trim();
        if (!name || name.length < 2) return null;

        const pythagorean: Record<string, number> = {
          a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
          j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
          s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
        };

        const vowels = new Set(["a", "e", "i", "o", "u"]);

        const reduceToSingle = (num: number): number => {
          while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
            let sum = 0;
            while (num > 0) {
              sum += num % 10;
              num = Math.floor(num / 10);
            }
            num = sum;
          }
          return num;
        };

        const letters = name.toLowerCase().replace(/[^a-z]/g, "");
        if (letters.length === 0) return null;

        let totalSum = 0;
        let vowelSum = 0;
        let consonantSum = 0;

        for (const ch of letters) {
          const val = pythagorean[ch] || 0;
          totalSum += val;
          if (vowels.has(ch)) {
            vowelSum += val;
          } else {
            consonantSum += val;
          }
        }

        const expressionNum = reduceToSingle(totalSum);
        const soulUrgeNum = reduceToSingle(vowelSum);
        const personalityNum = reduceToSingle(consonantSum);

        const expressionMeanings: Record<number, string> = {
          1: "The Leader - Independent, ambitious, pioneering. You forge your own path.",
          2: "The Peacemaker - Diplomatic, cooperative, sensitive. You bring harmony.",
          3: "The Communicator - Creative, expressive, joyful. You inspire through words.",
          4: "The Builder - Practical, disciplined, hardworking. You create lasting foundations.",
          5: "The Freedom Seeker - Adventurous, versatile, dynamic. You crave experience.",
          6: "The Nurturer - Responsible, caring, domestic. You heal and protect.",
          7: "The Seeker - Analytical, spiritual, introspective. You search for truth.",
          8: "The Powerhouse - Ambitious, authoritative, material. You command success.",
          9: "The Humanitarian - Compassionate, idealistic, generous. You serve the world.",
          11: "Master Number - Intuitive visionary. You channel higher spiritual truths.",
          22: "Master Number - The Master Builder. You can manifest grand dreams into reality.",
          33: "Master Number - The Master Teacher. You uplift humanity through selfless service.",
        };

        const soulMeanings: Record<number, string> = {
          1: "Deep desire for independence and achievement",
          2: "Inner longing for love, partnership, and peace",
          3: "Soul craves creative expression and joy",
          4: "Inner need for stability, order, and security",
          5: "Soul yearns for freedom, travel, and adventure",
          6: "Deep desire to nurture, love, and create beauty",
          7: "Inner quest for knowledge, wisdom, and solitude",
          8: "Soul drives toward power, recognition, and abundance",
          9: "Deep calling to serve humanity and make a difference",
          11: "Spiritual awakening and intuitive mastery",
          22: "Inner drive to build something that changes the world",
          33: "Soul purpose to heal and teach on a grand scale",
        };

        return {
          primary: {
            label: "Expression Number",
            value: String(expressionNum),
          },
          details: [
            { label: "Full Name", value: name },
            { label: "Expression Number", value: `${expressionNum} - ${expressionMeanings[expressionNum] || "Unique energy"}` },
            { label: "Soul Urge Number", value: `${soulUrgeNum} - ${soulMeanings[soulUrgeNum] || "Unique inner drive"}` },
            { label: "Personality Number", value: String(personalityNum) },
            { label: "Total Letter Sum", value: String(totalSum) },
            { label: "Vowel Sum", value: String(vowelSum) },
            { label: "Consonant Sum", value: String(consonantSum) },
            { label: "Letters Analyzed", value: String(letters.length) },
          ],
          note: "Name numerology uses Pythagorean letter-to-number mapping. For most accurate results, use your full birth name. This is for entertainment purposes.",
        };
      },
    },
  ],
  relatedSlugs: ["numerology-calculator", "life-path-calculator", "angel-number-calculator"],
  faq: [
    {
      question: "What is the difference between Expression, Soul Urge, and Personality numbers?",
      answer:
        "Your Expression number (all letters) reveals your natural talents and abilities. Your Soul Urge number (vowels only) reveals your inner desires and motivations. Your Personality number (consonants only) shows how others perceive you. Together, they paint a complete numerological portrait.",
    },
    {
      question: "Should I use my birth name or current name?",
      answer:
        "Traditional numerology uses your full birth name (the name on your birth certificate) for the most 'authentic' reading, as it represents your core identity. However, if you've changed your name, your current name also carries energy that influences your life. You can calculate both to see the difference.",
    },
    {
      question: "What are Master Numbers?",
      answer:
        "Master Numbers (11, 22, 33) are not reduced to single digits because they carry amplified spiritual significance. 11 is the Intuitive Master, 22 is the Master Builder, and 33 is the Master Teacher. Having a Master Number doesn't make you 'better' — it suggests heightened potential AND greater challenges.",
    },
  ],
  formula:
    "Pythagorean system: A=1, B=2, C=3... I=9, J=1, K=2... Each letter maps to 1-9. Sum all letters and reduce to single digit (preserving Master Numbers 11, 22, 33).",
};
