import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const modularArithmeticCalculator: CalculatorDefinition = {
  slug: "modular-arithmetic-calculator",
  title: "Modular Arithmetic Calculator",
  description:
    "Free modular arithmetic calculator. Compute a mod n and modular exponentiation a^b mod n.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "modular arithmetic",
    "modulo",
    "mod calculator",
    "modular exponentiation",
    "number theory",
  ],
  variants: [
    {
      id: "mod",
      name: "Calculate a mod n",
      fields: [
        { name: "a", label: "a", type: "number", placeholder: "e.g. 17" },
        { name: "n", label: "n (modulus)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const n = inputs.n as number;
        if (a === undefined || !n) return null;
        if (!Number.isInteger(n) || n <= 0) return null;

        // JavaScript % can return negative values for negative a
        const result = ((a % n) + n) % n;
        const quotient = Math.floor(a / n);

        return {
          primary: { label: `${formatNumber(a)} mod ${formatNumber(n)}`, value: formatNumber(result) },
          details: [
            { label: "Quotient", value: formatNumber(quotient) },
            { label: "Remainder", value: formatNumber(result) },
            {
              label: "Verification",
              value: `${formatNumber(quotient)} × ${formatNumber(n)} + ${formatNumber(result)} = ${formatNumber(quotient * n + result)}`,
            },
          ],
        };
      },
    },
    {
      id: "modpow",
      name: "Modular Exponentiation a^b mod n",
      fields: [
        { name: "a", label: "Base (a)", type: "number", placeholder: "e.g. 2" },
        { name: "b", label: "Exponent (b)", type: "number", placeholder: "e.g. 10" },
        { name: "n", label: "Modulus (n)", type: "number", placeholder: "e.g. 1000" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const n = inputs.n as number;
        if (a === undefined || b === undefined || !n) return null;
        if (!Number.isInteger(a) || !Number.isInteger(b) || !Number.isInteger(n)) return null;
        if (b < 0 || n <= 0) return null;

        // Modular exponentiation by repeated squaring
        let result = 1;
        let base = ((a % n) + n) % n;
        let exp = b;
        while (exp > 0) {
          if (exp % 2 === 1) {
            result = (result * base) % n;
          }
          exp = Math.floor(exp / 2);
          base = (base * base) % n;
        }

        return {
          primary: {
            label: `${formatNumber(a)}^${formatNumber(b)} mod ${formatNumber(n)}`,
            value: formatNumber(result),
          },
          details: [
            { label: "Base", value: formatNumber(a) },
            { label: "Exponent", value: formatNumber(b) },
            { label: "Modulus", value: formatNumber(n) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "binary-arithmetic-calculator",
    "binomial-coefficient-calculator",
    "summation-calculator",
  ],
  faq: [
    {
      question: "What is modular arithmetic?",
      answer:
        "Modular arithmetic is a system of arithmetic for integers where numbers wrap around upon reaching a certain value (the modulus). For example, 17 mod 5 = 2 because 17 = 3×5 + 2. It is widely used in cryptography, computer science, and number theory.",
    },
  ],
  formula: "a mod n = remainder of a ÷ n; a^b mod n via repeated squaring",
};
