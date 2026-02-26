import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gcfCalculator: CalculatorDefinition = {
  slug: "gcf-calculator",
  title: "GCF Calculator",
  description:
    "Free online Greatest Common Factor (GCF) calculator. Find the GCF/GCD of two or more numbers using the Euclidean algorithm.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "GCF calculator",
    "greatest common factor",
    "GCD calculator",
    "greatest common divisor",
    "highest common factor",
  ],
  variants: [
    {
      id: "gcf-two",
      name: "GCF of Two Numbers",
      description: "Calculate the greatest common factor of two numbers",
      fields: [
        {
          name: "a",
          label: "First Number",
          type: "number",
          placeholder: "e.g. 48",
          min: 1,
        },
        {
          name: "b",
          label: "Second Number",
          type: "number",
          placeholder: "e.g. 36",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const a = Math.floor(parseFloat(inputs.a as string) || 0);
        const b = Math.floor(parseFloat(inputs.b as string) || 0);
        if (a < 1 || b < 1) return null;

        const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
        const gcfVal = gcd(a, b);
        const lcmVal = (a / gcfVal) * b;

        // Euclidean steps
        const steps: string[] = [];
        let x = a;
        let y = b;
        while (y !== 0) {
          const q = Math.floor(x / y);
          const r = x % y;
          steps.push(`${formatNumber(x)} = ${formatNumber(q)} x ${formatNumber(y)} + ${formatNumber(r)}`);
          x = y;
          y = r;
        }

        return {
          primary: {
            label: "GCF / GCD",
            value: formatNumber(gcfVal),
          },
          details: [
            { label: "Numbers", value: `${formatNumber(a)} and ${formatNumber(b)}` },
            { label: "LCM", value: formatNumber(lcmVal) },
            { label: "Euclidean steps", value: steps.join(" | ") },
            { label: "a / GCF", value: formatNumber(a / gcfVal) },
            { label: "b / GCF", value: formatNumber(b / gcfVal) },
          ],
        };
      },
    },
    {
      id: "gcf-three",
      name: "GCF of Three Numbers",
      description: "Calculate the greatest common factor of three numbers",
      fields: [
        {
          name: "a",
          label: "First Number",
          type: "number",
          placeholder: "e.g. 24",
          min: 1,
        },
        {
          name: "b",
          label: "Second Number",
          type: "number",
          placeholder: "e.g. 36",
          min: 1,
        },
        {
          name: "c",
          label: "Third Number",
          type: "number",
          placeholder: "e.g. 60",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const a = Math.floor(parseFloat(inputs.a as string) || 0);
        const b = Math.floor(parseFloat(inputs.b as string) || 0);
        const c = Math.floor(parseFloat(inputs.c as string) || 0);
        if (a < 1 || b < 1 || c < 1) return null;

        const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
        const gcfVal = gcd(gcd(a, b), c);

        return {
          primary: {
            label: "GCF / GCD",
            value: formatNumber(gcfVal),
          },
          details: [
            { label: "Numbers", value: `${formatNumber(a)}, ${formatNumber(b)}, and ${formatNumber(c)}` },
            { label: "GCF of first two", value: formatNumber(gcd(a, b)) },
            { label: "Final GCF", value: formatNumber(gcfVal) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["lcm-calculator", "factor-calculator"],
  faq: [
    {
      question: "What is the Greatest Common Factor (GCF)?",
      answer:
        "The GCF (also called GCD - Greatest Common Divisor) is the largest positive integer that divides two or more numbers without leaving a remainder. For example, the GCF of 12 and 18 is 6.",
    },
    {
      question: "How does the Euclidean algorithm work?",
      answer:
        "The Euclidean algorithm repeatedly divides the larger number by the smaller and takes the remainder, until the remainder is zero. The last non-zero remainder is the GCF.",
    },
  ],
  formula: "GCF using Euclidean Algorithm: GCF(a, b) = GCF(b, a mod b) until remainder = 0",
};
