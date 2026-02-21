import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a;
}
function lcm(a: number, b: number): number { return (a * b) / gcd(a, b); }

export const lcmGcdCalculator: CalculatorDefinition = {
  slug: "lcm-gcd-calculator",
  title: "LCM & GCD Calculator",
  description: "Free LCM and GCD calculator. Find the Least Common Multiple and Greatest Common Divisor of two or more numbers.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["lcm calculator", "gcd calculator", "least common multiple", "greatest common divisor", "hcf calculator"],
  variants: [
    {
      id: "two",
      name: "LCM & GCD of Two Numbers",
      fields: [
        { name: "a", label: "First Number", type: "number", placeholder: "e.g. 12" },
        { name: "b", label: "Second Number", type: "number", placeholder: "e.g. 18" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        if (!a || !b) return null;
        const g = gcd(a, b);
        const l = lcm(a, b);
        return {
          primary: { label: "LCM", value: formatNumber(l, 0) },
          details: [
            { label: "GCD (HCF)", value: formatNumber(g, 0) },
            { label: "Product a × b", value: formatNumber(a * b, 0) },
            { label: "LCM × GCD", value: formatNumber(l * g, 0) },
            { label: "Verify: LCM × GCD = a × b", value: l * g === a * b ? "✓ True" : "✗ False" },
          ],
        };
      },
    },
    {
      id: "three",
      name: "LCM & GCD of Three Numbers",
      fields: [
        { name: "a", label: "First Number", type: "number", placeholder: "e.g. 4" },
        { name: "b", label: "Second Number", type: "number", placeholder: "e.g. 6" },
        { name: "c", label: "Third Number", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        if (!a || !b || !c) return null;
        const g = gcd(gcd(a, b), c);
        const l = lcm(lcm(a, b), c);
        return {
          primary: { label: "LCM", value: formatNumber(l, 0) },
          details: [
            { label: "GCD (HCF)", value: formatNumber(g, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fraction-calculator", "ratio-calculator", "factorial-calculator"],
  faq: [
    { question: "What is LCM?", answer: "The Least Common Multiple is the smallest number divisible by both numbers. LCM(4,6)=12 because 12 is the smallest number divisible by both 4 and 6." },
    { question: "What is GCD?", answer: "The Greatest Common Divisor (also called HCF) is the largest number that divides both numbers evenly. GCD(12,18)=6." },
  ],
  formula: "GCD: Euclidean algorithm | LCM(a,b) = a×b / GCD(a,b)",
};
