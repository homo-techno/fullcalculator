import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function getDivisors(n: number): number[] {
  const divisors: number[] = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      divisors.push(i);
      if (i !== n / i && n / i !== n) {
        divisors.push(n / i);
      }
    }
  }
  // exclude n itself for proper divisors
  return divisors.filter((d) => d !== n).sort((a, b) => a - b);
}

function classifyNumber(n: number): string {
  const sum = getDivisors(n).reduce((a, b) => a + b, 0);
  if (sum === n) return "Perfect";
  if (sum > n) return "Abundant";
  return "Deficient";
}

export const perfectNumberCalculator: CalculatorDefinition = {
  slug: "perfect-number-checker",
  title: "Perfect Number Checker",
  description: "Free perfect number checker. Determine if a number is perfect, abundant, or deficient by analyzing its proper divisors and their sum.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["perfect number", "abundant number", "deficient number", "divisors", "aliquot sum", "number theory"],
  variants: [
    {
      id: "check",
      name: "Check a Number",
      description: "Check if a number is perfect, abundant, or deficient",
      fields: [
        { name: "number", label: "Number to Check", type: "number", placeholder: "e.g. 28", min: 1 },
      ],
      calculate: (inputs) => {
        const n = parseFloat(inputs.number as string);
        if (isNaN(n) || n < 1 || n !== Math.floor(n)) return null;
        if (n > 10000000) return null;

        const divisors = getDivisors(n);
        const aliquotSum = divisors.reduce((a, b) => a + b, 0);
        const classification = classifyNumber(n);
        const abundance = aliquotSum - n;
        const divisorCount = divisors.length;
        const divisorStr = divisors.length <= 20 ? divisors.map((d) => formatNumber(d, 0)).join(", ") : divisors.slice(0, 20).map((d) => formatNumber(d, 0)).join(", ") + "...";

        return {
          primary: { label: "Classification", value: classification },
          details: [
            { label: "Number", value: formatNumber(n, 0) },
            { label: "Proper Divisors", value: divisorStr },
            { label: "Number of Divisors", value: formatNumber(divisorCount, 0) },
            { label: "Aliquot Sum (σ(n)-n)", value: formatNumber(aliquotSum, 0) },
            { label: "Abundance (sum - n)", value: formatNumber(abundance, 0) },
            { label: "Is Perfect?", value: classification === "Perfect" ? "Yes" : "No" },
          ],
          note: classification === "Perfect"
            ? `${formatNumber(n, 0)} is a perfect number! Its proper divisors sum exactly to itself.`
            : classification === "Abundant"
            ? `${formatNumber(n, 0)} is abundant: divisor sum (${formatNumber(aliquotSum, 0)}) > ${formatNumber(n, 0)}.`
            : `${formatNumber(n, 0)} is deficient: divisor sum (${formatNumber(aliquotSum, 0)}) < ${formatNumber(n, 0)}.`,
        };
      },
    },
    {
      id: "find-perfect",
      name: "Find Perfect Numbers",
      description: "Find all perfect numbers up to a given limit using Mersenne primes",
      fields: [
        { name: "limit", label: "Search Up To", type: "number", placeholder: "e.g. 10000", min: 1, max: 40000000 },
      ],
      calculate: (inputs) => {
        const limit = parseFloat(inputs.limit as string);
        if (isNaN(limit) || limit < 1) return null;

        // Known even perfect numbers from Mersenne primes: 2^(p-1) * (2^p - 1)
        const knownPerfect = [6, 28, 496, 8128, 33550336];
        const found = knownPerfect.filter((p) => p <= limit);
        const count = found.length;

        const details: { label: string; value: string }[] = [
          { label: "Search Range", value: `1 to ${formatNumber(limit, 0)}` },
          { label: "Perfect Numbers Found", value: formatNumber(count, 0) },
        ];

        found.forEach((p, i) => {
          const divs = getDivisors(p);
          details.push({
            label: `Perfect #${formatNumber(i + 1, 0)}`,
            value: `${formatNumber(p, 0)} = ${divs.map((d) => formatNumber(d, 0)).join(" + ")}`,
          });
        });

        return {
          primary: { label: "Perfect Numbers Found", value: formatNumber(count, 0) },
          details,
          note: "All known perfect numbers are even. It is unknown whether odd perfect numbers exist.",
        };
      },
    },
    {
      id: "amicable",
      name: "Amicable Number Pair Check",
      description: "Check if two numbers form an amicable pair",
      fields: [
        { name: "numA", label: "First Number", type: "number", placeholder: "e.g. 220", min: 1 },
        { name: "numB", label: "Second Number", type: "number", placeholder: "e.g. 284", min: 1 },
      ],
      calculate: (inputs) => {
        const a = parseFloat(inputs.numA as string);
        const b = parseFloat(inputs.numB as string);
        if (isNaN(a) || isNaN(b) || a < 1 || b < 1) return null;
        if (a > 10000000 || b > 10000000) return null;

        const sumA = getDivisors(a).reduce((x, y) => x + y, 0);
        const sumB = getDivisors(b).reduce((x, y) => x + y, 0);
        const isAmicable = sumA === b && sumB === a && a !== b;

        return {
          primary: { label: "Amicable Pair?", value: isAmicable ? "Yes" : "No" },
          details: [
            { label: "Number A", value: formatNumber(a, 0) },
            { label: "Divisor Sum of A", value: formatNumber(sumA, 0) },
            { label: "Number B", value: formatNumber(b, 0) },
            { label: "Divisor Sum of B", value: formatNumber(sumB, 0) },
            { label: "Sum(A) = B?", value: sumA === b ? "Yes" : "No" },
            { label: "Sum(B) = A?", value: sumB === a ? "Yes" : "No" },
          ],
          note: isAmicable
            ? `${formatNumber(a, 0)} and ${formatNumber(b, 0)} are amicable numbers! Each equals the sum of the other's proper divisors.`
            : "These numbers are not an amicable pair.",
        };
      },
    },
  ],
  relatedSlugs: ["factorial-calculator", "lcm-gcd-calculator", "prime-counting-calculator"],
  faq: [
    { question: "What is a perfect number?", answer: "A perfect number equals the sum of its proper divisors (all divisors except itself). The first few perfect numbers are 6 (1+2+3), 28 (1+2+4+7+14), 496, and 8128. All known perfect numbers are even." },
    { question: "What are amicable numbers?", answer: "Two numbers are amicable if the sum of proper divisors of each equals the other number. The smallest amicable pair is (220, 284): the divisors of 220 sum to 284, and the divisors of 284 sum to 220." },
    { question: "What is the difference between abundant and deficient?", answer: "An abundant number has divisors that sum to more than itself (e.g., 12: 1+2+3+4+6=16 > 12). A deficient number has divisors that sum to less (e.g., 8: 1+2+4=7 < 8). A perfect number is exactly equal." },
  ],
  formula: "Perfect: σ(n) - n = n | Abundant: σ(n) - n > n | Deficient: σ(n) - n < n | Even perfect: 2^(p-1) × (2^p - 1)",
};
