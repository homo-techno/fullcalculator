import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

// First 100 digits of pi after decimal point
const PI_DIGITS =
  "14159265358979323846264338327950288419716939937510" +
  "58209749445923078164062862089986280348253421170679";

export const piDigitsCalculator: CalculatorDefinition = {
  slug: "pi-digits-calculator",
  title: "Pi Digits Calculator",
  description:
    "Free pi digits calculator. Display a specific number of digits of pi, find your birthday in pi, and explore fun facts about this famous mathematical constant.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pi digits",
    "digits of pi",
    "pi number",
    "pi calculator",
    "pi decimal places",
    "pi day",
  ],
  variants: [
    {
      id: "show-digits",
      name: "Show Pi Digits",
      description: "Display a specified number of digits of pi",
      fields: [
        {
          name: "numDigits",
          label: "Number of Decimal Digits",
          type: "number",
          placeholder: "e.g. 50",
          min: 1,
          max: 100,
          defaultValue: 50,
        },
      ],
      calculate: (inputs) => {
        const n = Math.min(Math.max((inputs.numDigits as number) || 50, 1), 100);

        const piString = "3." + PI_DIGITS.substring(0, n);

        // Group into sets of 10 for readability
        let grouped = "3.";
        for (let i = 0; i < n; i += 10) {
          grouped += PI_DIGITS.substring(i, Math.min(i + 10, n));
          if (i + 10 < n) grouped += " ";
        }

        // Count digit frequency
        const digitCounts: number[] = new Array(10).fill(0);
        for (let i = 0; i < n; i++) {
          digitCounts[parseInt(PI_DIGITS[i])]++;
        }

        const mostCommon = digitCounts.indexOf(Math.max(...digitCounts));
        const leastCommon = digitCounts.indexOf(Math.min(...digitCounts));

        return {
          primary: {
            label: `Pi to ${n} Decimal Places`,
            value: piString,
          },
          details: [
            { label: "Grouped (by 10s)", value: grouped },
            { label: "Total digits shown", value: formatNumber(n + 2) },
            { label: "Most common digit", value: `${mostCommon} (appears ${digitCounts[mostCommon]} times)` },
            { label: "Least common digit", value: `${leastCommon} (appears ${digitCounts[leastCommon]} times)` },
            { label: "Pi Day", value: "March 14 (3/14)" },
            { label: "Pi Approximation Day", value: "July 22 (22/7)" },
          ],
        };
      },
    },
    {
      id: "find-in-pi",
      name: "Find Number in Pi",
      description: "Search for a number sequence in the first 100 digits of pi",
      fields: [
        {
          name: "searchNum",
          label: "Number to Find (up to 6 digits)",
          type: "number",
          placeholder: "e.g. 314",
          min: 0,
          max: 999999,
        },
      ],
      calculate: (inputs) => {
        const searchNum = inputs.searchNum as number;
        if (searchNum === undefined || searchNum === null) return null;

        const searchStr = searchNum.toString();
        const position = PI_DIGITS.indexOf(searchStr);

        if (position === -1) {
          return {
            primary: {
              label: "Result",
              value: `"${searchStr}" not found in first 100 digits`,
            },
            details: [
              { label: "Searched for", value: searchStr },
              { label: "Digits searched", value: "100" },
              { label: "Tip", value: "Try a shorter number or fewer digits" },
            ],
          };
        }

        return {
          primary: {
            label: "Found!",
            value: `"${searchStr}" found at position ${position + 1}`,
          },
          details: [
            { label: "Search string", value: searchStr },
            { label: "Position (after decimal)", value: formatNumber(position + 1) },
            { label: "Context", value: `...${PI_DIGITS.substring(Math.max(0, position - 3), position + searchStr.length + 3)}...` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "circle-circumference-calculator",
    "area-of-circle-calculator",
    "scientific-notation-calculator",
  ],
  faq: [
    {
      question: "What is pi?",
      answer:
        "Pi is the ratio of a circle's circumference to its diameter, approximately 3.14159. It is an irrational number, meaning its decimal representation never ends or repeats.",
    },
    {
      question: "Why is Pi Day on March 14?",
      answer:
        "Pi Day is celebrated on March 14 (3/14) because the first three digits of pi are 3.14. The celebration became especially notable in 2015 (3/14/15 at 9:26:53).",
    },
  ],
  formula:
    "Pi = circumference / diameter = 3.14159265358979323846...",
};
