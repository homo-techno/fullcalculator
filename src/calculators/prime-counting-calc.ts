import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function sieveOfEratosthenes(limit: number): boolean[] {
  const isPrime = new Array(limit + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let i = 2; i * i <= limit; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= limit; j += i) {
        isPrime[j] = false;
      }
    }
  }
  return isPrime;
}

function countPrimes(n: number): number {
  if (n < 2) return 0;
  const sieve = sieveOfEratosthenes(n);
  return sieve.filter(Boolean).length;
}

function nthPrime(n: number): number {
  if (n < 1) return 2;
  // Upper bound approximation: p_n < n * (ln(n) + ln(ln(n)) + 2) for n >= 6
  let upperBound = Math.max(100, Math.ceil(n * (Math.log(n) + Math.log(Math.log(n)) + 2)));
  const sieve = sieveOfEratosthenes(upperBound);
  let count = 0;
  for (let i = 2; i <= upperBound; i++) {
    if (sieve[i]) {
      count++;
      if (count === n) return i;
    }
  }
  return -1;
}

function getPrimesUpTo(n: number): number[] {
  if (n < 2) return [];
  const sieve = sieveOfEratosthenes(n);
  const primes: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (sieve[i]) primes.push(i);
  }
  return primes;
}

export const primeCountingCalculator: CalculatorDefinition = {
  slug: "prime-counting-calculator",
  title: "Prime Counting Function Calculator",
  description: "Free prime counting function calculator. Count the number of primes up to N, find the Nth prime, and explore prime density using π(x).",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["prime counting function", "pi of x", "count primes", "nth prime", "prime number theorem", "sieve of eratosthenes"],
  variants: [
    {
      id: "count-primes",
      name: "Count Primes Up To N",
      description: "Calculate π(N) — the number of primes less than or equal to N",
      fields: [
        { name: "n", label: "Upper Limit (N)", type: "number", placeholder: "e.g. 1000", min: 1, max: 10000000 },
      ],
      calculate: (inputs) => {
        const n = parseFloat(inputs.n as string);
        if (isNaN(n) || n < 1) return null;
        if (n > 10000000) return null;

        const count = countPrimes(Math.floor(n));
        const primeDensity = count / n;
        // Prime Number Theorem approximation: π(x) ≈ x / ln(x)
        const pntApprox = n >= 2 ? n / Math.log(n) : 0;
        const liApprox = n >= 2 ? n / (Math.log(n) - 1) : 0;

        const primes = n <= 100 ? getPrimesUpTo(Math.floor(n)) : [];
        const details: { label: string; value: string }[] = [
          { label: "π(N)", value: formatNumber(count, 0) },
          { label: "N", value: formatNumber(n, 0) },
          { label: "Prime Density", value: formatNumber(primeDensity, 6) },
          { label: "PNT Estimate (N/ln N)", value: formatNumber(pntApprox, 1) },
          { label: "Li Estimate (N/(ln N-1))", value: formatNumber(liApprox, 1) },
          { label: "PNT Error", value: `${formatNumber(Math.abs(count - pntApprox), 1)} (${formatNumber(Math.abs(count - pntApprox) / Math.max(count, 1) * 100, 2)}%)` },
        ];

        if (primes.length > 0 && primes.length <= 50) {
          details.push({ label: "Primes", value: primes.map((p) => formatNumber(p, 0)).join(", ") });
        }

        return {
          primary: { label: `π(${formatNumber(n, 0)})`, value: formatNumber(count, 0) },
          details,
        };
      },
    },
    {
      id: "nth-prime",
      name: "Find Nth Prime",
      description: "Find the Nth prime number",
      fields: [
        { name: "n", label: "N (which prime?)", type: "number", placeholder: "e.g. 100", min: 1, max: 500000 },
      ],
      calculate: (inputs) => {
        const n = parseFloat(inputs.n as string);
        if (isNaN(n) || n < 1 || n > 500000) return null;

        const prime = nthPrime(Math.floor(n));
        if (prime === -1) return null;

        // Show nearby primes
        const prevPrime = n > 1 ? nthPrime(Math.floor(n) - 1) : 0;
        const nextPrime = n < 500000 ? nthPrime(Math.floor(n) + 1) : 0;

        return {
          primary: { label: `Prime #${formatNumber(n, 0)}`, value: formatNumber(prime, 0) },
          details: [
            { label: "N", value: formatNumber(n, 0) },
            { label: `Prime #${formatNumber(n, 0)}`, value: formatNumber(prime, 0) },
            ...(prevPrime > 0 ? [{ label: `Prime #${formatNumber(n - 1, 0)}`, value: formatNumber(prevPrime, 0) }] : []),
            ...(nextPrime > 0 ? [{ label: `Prime #${formatNumber(n + 1, 0)}`, value: formatNumber(nextPrime, 0) }] : []),
            { label: "Gap to Next", value: nextPrime > 0 ? formatNumber(nextPrime - prime, 0) : "N/A" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["perfect-number-checker", "factorial-calculator", "lcm-gcd-calculator"],
  faq: [
    { question: "What is the prime counting function π(x)?", answer: "π(x) counts the number of prime numbers less than or equal to x. For example, π(10) = 4 because there are 4 primes (2, 3, 5, 7) up to 10. It is one of the most studied functions in number theory." },
    { question: "What is the Prime Number Theorem?", answer: "The Prime Number Theorem states that π(x) ≈ x/ln(x) as x → ∞. This means primes become less frequent but never run out. A better approximation is Li(x) = x/(ln(x) - 1). The exact distribution is connected to the Riemann Hypothesis." },
    { question: "How does the Sieve of Eratosthenes work?", answer: "Start with all numbers 2 to N marked as prime. For each prime p found, mark all multiples of p (starting from p²) as composite. The remaining unmarked numbers are prime. It is one of the most efficient ways to find all primes up to a moderate limit." },
  ],
  formula: "π(x) = count of primes ≤ x | PNT: π(x) ≈ x/ln(x) | Li(x) ≈ x/(ln(x) - 1)",
};
