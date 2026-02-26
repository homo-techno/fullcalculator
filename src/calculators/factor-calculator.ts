import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const factorCalculator: CalculatorDefinition = {
  slug: "factor-calculator",
  title: "Prime Factorization Calculator",
  description:
    "Free online prime factorization calculator. Find all prime factors of any number. Also lists all factors/divisors.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "prime factorization",
    "factor calculator",
    "prime factors",
    "divisors",
    "factor tree",
    "factoring numbers",
  ],
  variants: [
    {
      id: "prime-factorization",
      name: "Prime Factorization",
      description: "Find the prime factorization of a positive integer",
      fields: [
        {
          name: "number",
          label: "Number",
          type: "number",
          placeholder: "e.g. 360",
          min: 2,
        },
      ],
      calculate: (inputs) => {
        const num = Math.floor(parseFloat(inputs.number as string) || 0);
        if (num < 2) return null;

        // Prime factorization
        const factors: number[] = [];
        let n = num;
        for (let i = 2; i * i <= n; i++) {
          while (n % i === 0) {
            factors.push(i);
            n = n / i;
          }
        }
        if (n > 1) factors.push(n);

        // Count occurrences
        const factorCounts: Record<number, number> = {};
        for (const f of factors) {
          factorCounts[f] = (factorCounts[f] || 0) + 1;
        }

        const factorizationStr = Object.entries(factorCounts)
          .map(([base, exp]) => (exp === 1 ? base : `${base}^${exp}`))
          .join(" x ");

        // All divisors
        const divisors: number[] = [];
        for (let i = 1; i * i <= num; i++) {
          if (num % i === 0) {
            divisors.push(i);
            if (i !== num / i) divisors.push(num / i);
          }
        }
        divisors.sort((a, b) => a - b);

        const isPrime = factors.length === 1 && factors[0] === num;

        return {
          primary: {
            label: "Prime Factorization",
            value: factorizationStr,
          },
          details: [
            { label: "Number", value: formatNumber(num) },
            { label: "Is prime", value: isPrime ? "Yes" : "No" },
            { label: "Number of prime factors", value: formatNumber(factors.length) },
            { label: "Unique prime factors", value: Object.keys(factorCounts).join(", ") },
            { label: "All divisors", value: divisors.map((d) => formatNumber(d)).join(", ") },
            { label: "Number of divisors", value: formatNumber(divisors.length) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["lcm-calculator", "gcf-calculator"],
  faq: [
    {
      question: "What is prime factorization?",
      answer:
        "Prime factorization is the process of breaking down a number into its prime number components. Every integer greater than 1 can be uniquely expressed as a product of prime numbers.",
    },
    {
      question: "What is a prime number?",
      answer:
        "A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself. Examples: 2, 3, 5, 7, 11, 13, 17, 19, 23.",
    },
  ],
  formula: "Every integer n > 1 can be written as n = p1^a1 x p2^a2 x ... x pk^ak where pi are primes",
};
