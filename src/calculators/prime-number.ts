import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

function factorize(n: number): string {
  if (n < 2) return String(n);
  const factors: string[] = [];
  let remaining = Math.abs(n);
  for (let d = 2; d * d <= remaining; d++) {
    let count = 0;
    while (remaining % d === 0) { remaining /= d; count++; }
    if (count > 0) factors.push(count > 1 ? `${d}^${count}` : String(d));
  }
  if (remaining > 1) factors.push(String(remaining));
  return factors.join(" × ") || String(n);
}

export const primeNumberCalculator: CalculatorDefinition = {
  slug: "prime-number-calculator",
  title: "Prime Number Calculator",
  description: "Free prime number calculator. Check if a number is prime, find prime factorization, and list primes in a range.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["prime number calculator", "prime checker", "is it prime", "prime factorization", "factor calculator"],
  variants: [
    {
      id: "check",
      name: "Prime Check & Factorization",
      fields: [
        { name: "num", label: "Number", type: "number", placeholder: "e.g. 97" },
      ],
      calculate: (inputs) => {
        const n = inputs.num as number;
        if (!n || n < 1 || n !== Math.floor(n)) return null;
        const prime = isPrime(n);
        const details = [
          { label: "Is prime?", value: prime ? "Yes" : "No" },
        ];
        if (!prime && n > 1) {
          details.push({ label: "Prime factorization", value: factorize(n) });
        }
        let divisors = 0;
        for (let i = 1; i <= Math.min(n, 10000); i++) { if (n % i === 0) divisors++; }
        details.push({ label: "Number of divisors", value: n <= 10000 ? String(divisors) : `≥${divisors}` });
        details.push({ label: "Even/Odd", value: n % 2 === 0 ? "Even" : "Odd" });
        return {
          primary: { label: String(n), value: prime ? "Prime" : "Not Prime" },
          details,
        };
      },
    },
    {
      id: "range",
      name: "Primes in Range",
      fields: [
        { name: "from", label: "From", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
        { name: "to", label: "To", type: "number", placeholder: "e.g. 100" },
      ],
      calculate: (inputs) => {
        const from = (inputs.from as number) || 1, to = inputs.to as number;
        if (!to || to < from || to > 100000) return null;
        const primes: number[] = [];
        for (let i = Math.max(2, from); i <= to && primes.length < 200; i++) {
          if (isPrime(i)) primes.push(i);
        }
        return {
          primary: { label: `Primes ${from}–${to}`, value: `${primes.length} primes found` },
          details: [
            { label: "Primes", value: primes.length <= 50 ? primes.join(", ") : primes.slice(0, 50).join(", ") + "..." },
            { label: "Count", value: String(primes.length) },
            { label: "Smallest", value: primes.length ? String(primes[0]) : "None" },
            { label: "Largest", value: primes.length ? String(primes[primes.length - 1]) : "None" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["factorial-calculator", "lcm-gcd-calculator", "number-sequence-calculator"],
  faq: [{ question: "What is a prime number?", answer: "A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself. The first primes are: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29. The number 2 is the only even prime." }],
  formula: "A number n is prime if it has no divisors from 2 to √n",
};
