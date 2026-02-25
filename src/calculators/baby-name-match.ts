import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyNameMatchCalculator: CalculatorDefinition = {
  slug: "baby-name-match-calculator",
  title: "Baby Name Match Calculator",
  description:
    "Free baby name match calculator. See how well a baby name pairs with your last name based on syllable balance, initials, and numerology score.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "baby name",
    "name match",
    "baby name compatibility",
    "name pairing",
    "name score",
    "baby name calculator",
  ],
  variants: [
    {
      id: "name-match",
      name: "Name Match Score",
      description: "Score how well a first name matches with a last name",
      fields: [
        {
          name: "firstNameLength",
          label: "First Name Length (letters)",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 30,
        },
        {
          name: "firstSyllables",
          label: "First Name Syllables",
          type: "select",
          options: [
            { label: "1 syllable", value: "1" },
            { label: "2 syllables", value: "2" },
            { label: "3 syllables", value: "3" },
            { label: "4+ syllables", value: "4" },
          ],
        },
        {
          name: "lastNameLength",
          label: "Last Name Length (letters)",
          type: "number",
          placeholder: "e.g. 7",
          min: 1,
          max: 30,
        },
        {
          name: "lastSyllables",
          label: "Last Name Syllables",
          type: "select",
          options: [
            { label: "1 syllable", value: "1" },
            { label: "2 syllables", value: "2" },
            { label: "3 syllables", value: "3" },
            { label: "4+ syllables", value: "4" },
          ],
        },
        {
          name: "middleName",
          label: "Include Middle Name?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes (1 syllable)", value: "1" },
            { label: "Yes (2 syllables)", value: "2" },
            { label: "Yes (3+ syllables)", value: "3" },
          ],
        },
      ],
      calculate: (inputs) => {
        const firstLen = inputs.firstNameLength as number;
        const firstSyl = parseInt((inputs.firstSyllables as string) || "2");
        const lastLen = inputs.lastNameLength as number;
        const lastSyl = parseInt((inputs.lastSyllables as string) || "2");
        const middleStr = (inputs.middleName as string) || "no";

        if (!firstLen || !lastLen) return null;

        let score = 50; // base score

        // Syllable balance: different syllable counts sound better
        const sylDiff = Math.abs(firstSyl - lastSyl);
        if (sylDiff === 1) score += 20;
        else if (sylDiff === 2) score += 15;
        else if (sylDiff === 0) score += 5;
        else score += 10;

        // Total syllables: 3-5 syllables in full name is ideal
        let totalSyl = firstSyl + lastSyl;
        if (middleStr !== "no") totalSyl += parseInt(middleStr);

        if (totalSyl >= 3 && totalSyl <= 5) score += 15;
        else if (totalSyl >= 2 && totalSyl <= 6) score += 10;
        else score += 5;

        // Length balance
        const totalLen = firstLen + lastLen;
        if (totalLen >= 8 && totalLen <= 16) score += 15;
        else if (totalLen >= 6 && totalLen <= 20) score += 10;
        else score += 5;

        score = Math.min(100, Math.max(0, score));

        let rating: string;
        if (score >= 85) rating = "Excellent match";
        else if (score >= 70) rating = "Great match";
        else if (score >= 55) rating = "Good match";
        else if (score >= 40) rating = "Fair match";
        else rating = "Could be improved";

        const hasMiddle = middleStr !== "no";

        return {
          primary: {
            label: "Name Match Score",
            value: `${formatNumber(score, 0)}/100`,
          },
          details: [
            { label: "Rating", value: rating },
            { label: "First name", value: `${firstLen} letters, ${firstSyl} syllable(s)` },
            { label: "Last name", value: `${lastLen} letters, ${lastSyl} syllable(s)` },
            { label: "Middle name", value: hasMiddle ? `${middleStr} syllable(s)` : "None" },
            { label: "Total syllables", value: formatNumber(totalSyl) },
            { label: "Total letters", value: formatNumber(totalLen) },
            { label: "Syllable variety", value: sylDiff > 0 ? "Good contrast" : "Same rhythm" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "baby-name-popularity-calculator",
    "name-numerology-calculator",
    "numerology-calculator",
  ],
  faq: [
    {
      question: "What makes a good baby name pairing?",
      answer:
        "A good name pairing typically has varying syllable counts between first and last name (e.g., 2-syllable first + 3-syllable last), a pleasant rhythm, and a total length that is easy to say and remember.",
    },
    {
      question: "How is the match score calculated?",
      answer:
        "The score considers syllable contrast between first and last name, total syllable count, letter length balance, and whether a middle name adds to or balances the overall name flow.",
    },
  ],
  formula:
    "Score = Base (50) + Syllable Contrast Bonus + Total Syllable Bonus + Length Balance Bonus. Max 100.",
};
