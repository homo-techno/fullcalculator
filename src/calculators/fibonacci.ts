import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fibonacciCalculator: CalculatorDefinition = {
  slug: "fibonacci-calculator",
  title: "Fibonacci Calculator",
  description: "Free Fibonacci calculator. Calculate the nth Fibonacci number, check if a number is a Fibonacci number, and generate sequences.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["fibonacci calculator", "fibonacci sequence", "fibonacci number", "golden ratio", "fibonacci series"],
  variants: [
    {
      id: "nth",
      name: "Find nth Fibonacci Number",
      fields: [
        { name: "n", label: "Position (n)", type: "number", placeholder: "e.g. 10", min: 0, max: 78 },
      ],
      calculate: (inputs) => {
        const n = inputs.n as number;
        if (n === undefined || n < 0 || n > 78) return null;
        let a = 0, b = 1;
        for (let i = 0; i < n; i++) { [a, b] = [b, a + b]; }
        const seq: number[] = [];
        let x = 0, y = 1;
        for (let i = 0; i <= Math.min(n, 15); i++) { seq.push(x); [x, y] = [y, x + y]; }
        const phi = (1 + Math.sqrt(5)) / 2;
        return {
          primary: { label: `F(${n})`, value: formatNumber(a, 0) },
          details: [
            { label: "Sequence", value: seq.join(", ") + (n > 15 ? "..." : "") },
            { label: "Golden ratio (φ)", value: formatNumber(phi, 10) },
            { label: "F(n)/F(n-1) ≈ φ", value: n > 1 ? formatNumber(a / (b - a), 10) : "N/A" },
          ],
        };
      },
    },
    {
      id: "check",
      name: "Is It a Fibonacci Number?",
      fields: [
        { name: "num", label: "Number", type: "number", placeholder: "e.g. 89" },
      ],
      calculate: (inputs) => {
        const num = inputs.num as number;
        if (num === undefined || num < 0) return null;
        const isPerfectSquare = (x: number) => { const s = Math.sqrt(x); return Math.abs(s - Math.round(s)) < 0.0001; };
        const isFib = isPerfectSquare(5 * num * num + 4) || isPerfectSquare(5 * num * num - 4);
        let pos = -1;
        if (isFib) {
          let a = 0, b = 1, i = 0;
          while (a < num) { [a, b] = [b, a + b]; i++; }
          if (a === num) pos = i;
        }
        return {
          primary: { label: String(num), value: isFib ? `Yes — F(${pos})` : "Not a Fibonacci number" },
          details: [
            { label: "Is Fibonacci?", value: isFib ? "Yes" : "No" },
            ...(pos >= 0 ? [{ label: "Position", value: `F(${pos})` }] : []),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["number-sequence-calculator", "factorial-calculator", "prime-number-calculator"],
  faq: [{ question: "What is the Fibonacci sequence?", answer: "The Fibonacci sequence starts with 0, 1, and each subsequent number is the sum of the two preceding ones: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89... The ratio of consecutive terms approaches the golden ratio φ ≈ 1.618." }],
  formula: "F(n) = F(n-1) + F(n-2), F(0)=0, F(1)=1",
};
