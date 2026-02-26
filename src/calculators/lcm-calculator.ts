import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lcmCalculator: CalculatorDefinition = {
  slug: "lcm-calculator",
  title: "LCM Calculator",
  description:
    "Free online Least Common Multiple (LCM) calculator. Find the LCM of two or more numbers using prime factorization.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "LCM calculator",
    "least common multiple",
    "lowest common multiple",
    "LCM of two numbers",
    "LCM finder",
  ],
  variants: [
    {
      id: "lcm-two",
      name: "LCM of Two Numbers",
      description: "Calculate the least common multiple of two numbers",
      fields: [
        {
          name: "a",
          label: "First Number",
          type: "number",
          placeholder: "e.g. 12",
          min: 1,
        },
        {
          name: "b",
          label: "Second Number",
          type: "number",
          placeholder: "e.g. 18",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const a = Math.floor(parseFloat(inputs.a as string) || 0);
        const b = Math.floor(parseFloat(inputs.b as string) || 0);
        if (a < 1 || b < 1) return null;

        const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
        const gcdVal = gcd(a, b);
        const lcmVal = (a / gcdVal) * b;

        // First few common multiples
        const multiples: string[] = [];
        for (let i = 1; i <= 5; i++) {
          multiples.push(formatNumber(lcmVal * i));
        }

        return {
          primary: {
            label: "LCM",
            value: formatNumber(lcmVal),
          },
          details: [
            { label: "Numbers", value: `${formatNumber(a)} and ${formatNumber(b)}` },
            { label: "GCF/GCD", value: formatNumber(gcdVal) },
            { label: "Formula used", value: `LCM = (${formatNumber(a)} x ${formatNumber(b)}) / GCF = ${formatNumber(a * b)} / ${formatNumber(gcdVal)}` },
            { label: "First 5 common multiples", value: multiples.join(", ") },
          ],
        };
      },
    },
    {
      id: "lcm-three",
      name: "LCM of Three Numbers",
      description: "Calculate the least common multiple of three numbers",
      fields: [
        {
          name: "a",
          label: "First Number",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
        },
        {
          name: "b",
          label: "Second Number",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
        },
        {
          name: "c",
          label: "Third Number",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const a = Math.floor(parseFloat(inputs.a as string) || 0);
        const b = Math.floor(parseFloat(inputs.b as string) || 0);
        const c = Math.floor(parseFloat(inputs.c as string) || 0);
        if (a < 1 || b < 1 || c < 1) return null;

        const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
        const lcm2 = (x: number, y: number) => (x / gcd(x, y)) * y;
        const lcmVal = lcm2(lcm2(a, b), c);

        return {
          primary: {
            label: "LCM",
            value: formatNumber(lcmVal),
          },
          details: [
            { label: "Numbers", value: `${formatNumber(a)}, ${formatNumber(b)}, and ${formatNumber(c)}` },
            { label: "LCM of first two", value: formatNumber(lcm2(a, b)) },
            { label: "Final LCM", value: formatNumber(lcmVal) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gcf-calculator", "factor-calculator"],
  faq: [
    {
      question: "What is the Least Common Multiple (LCM)?",
      answer:
        "The LCM of two or more numbers is the smallest positive integer that is divisible by all of them. For example, the LCM of 4 and 6 is 12.",
    },
    {
      question: "How is LCM related to GCF?",
      answer:
        "LCM and GCF are related by the formula: LCM(a, b) = (a x b) / GCF(a, b). Knowing one helps you find the other.",
    },
  ],
  formula: "LCM(a, b) = (a x b) / GCF(a, b)",
};
