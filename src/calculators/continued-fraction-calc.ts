import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function toContinuedFraction(num: number, maxTerms: number = 15): number[] {
  const terms: number[] = [];
  let x = num;
  for (let i = 0; i < maxTerms; i++) {
    const a = Math.floor(x);
    terms.push(a);
    const remainder = x - a;
    if (Math.abs(remainder) < 1e-10) break;
    x = 1 / remainder;
  }
  return terms;
}

function fromContinuedFraction(terms: number[]): { numerator: number; denominator: number } {
  if (terms.length === 0) return { numerator: 0, denominator: 1 };
  let num = terms[terms.length - 1];
  let den = 1;
  for (let i = terms.length - 2; i >= 0; i--) {
    const newNum = terms[i] * num + den;
    den = num;
    num = newNum;
  }
  return { numerator: num, denominator: den };
}

function convergents(terms: number[]): { numerator: number; denominator: number }[] {
  const result: { numerator: number; denominator: number }[] = [];
  for (let i = 1; i <= terms.length; i++) {
    result.push(fromContinuedFraction(terms.slice(0, i)));
  }
  return result;
}

export const continuedFractionCalculator: CalculatorDefinition = {
  slug: "continued-fraction-calculator",
  title: "Continued Fraction Calculator",
  description: "Free continued fraction calculator. Convert decimals to continued fraction representations and compute convergents for rational approximations.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["continued fraction", "rational approximation", "convergent", "fraction expansion", "number theory"],
  variants: [
    {
      id: "decimal-to-cf",
      name: "Decimal to Continued Fraction",
      description: "Convert a decimal number to its continued fraction representation",
      fields: [
        { name: "value", label: "Decimal Value", type: "number", placeholder: "e.g. 3.14159", step: 0.00001 },
        { name: "maxTerms", label: "Max Terms", type: "number", placeholder: "e.g. 10", min: 1, max: 20, defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const value = parseFloat(inputs.value as string);
        const maxTerms = parseFloat(inputs.maxTerms as string) || 10;
        if (isNaN(value)) return null;

        const terms = toContinuedFraction(value, maxTerms);
        const cfNotation = `[${terms[0]}; ${terms.slice(1).join(", ")}]`;
        const convs = convergents(terms);
        const lastConv = convs[convs.length - 1];
        const error = Math.abs(value - lastConv.numerator / lastConv.denominator);

        const details: { label: string; value: string }[] = [
          { label: "CF Notation", value: cfNotation },
          { label: "Number of Terms", value: formatNumber(terms.length, 0) },
          { label: "Best Rational Approx", value: `${formatNumber(lastConv.numerator, 0)}/${formatNumber(lastConv.denominator, 0)}` },
          { label: "Approximation Error", value: formatNumber(error, 10) },
        ];

        // Show first few convergents
        const showConvs = convs.slice(0, Math.min(5, convs.length));
        showConvs.forEach((c, i) => {
          const approx = c.numerator / c.denominator;
          details.push({ label: `Convergent ${formatNumber(i + 1, 0)}`, value: `${formatNumber(c.numerator, 0)}/${formatNumber(c.denominator, 0)} = ${formatNumber(approx, 8)}` });
        });

        return {
          primary: { label: "Continued Fraction", value: cfNotation },
          details,
        };
      },
    },
    {
      id: "fraction-to-cf",
      name: "Fraction to Continued Fraction",
      description: "Convert a fraction (numerator/denominator) to continued fraction form",
      fields: [
        { name: "numerator", label: "Numerator", type: "number", placeholder: "e.g. 355" },
        { name: "denominator", label: "Denominator", type: "number", placeholder: "e.g. 113", min: 1 },
      ],
      calculate: (inputs) => {
        const num = parseFloat(inputs.numerator as string);
        const den = parseFloat(inputs.denominator as string);
        if (isNaN(num) || isNaN(den) || den === 0) return null;

        const value = num / den;
        const terms = toContinuedFraction(value, 20);
        const cfNotation = `[${terms[0]}; ${terms.slice(1).join(", ")}]`;
        const convs = convergents(terms);

        const details: { label: string; value: string }[] = [
          { label: "Fraction", value: `${formatNumber(num, 0)}/${formatNumber(den, 0)}` },
          { label: "Decimal Value", value: formatNumber(value, 10) },
          { label: "CF Notation", value: cfNotation },
          { label: "Terms", value: formatNumber(terms.length, 0) },
        ];

        const showConvs = convs.slice(0, Math.min(4, convs.length));
        showConvs.forEach((c, i) => {
          details.push({ label: `Convergent ${formatNumber(i + 1, 0)}`, value: `${formatNumber(c.numerator, 0)}/${formatNumber(c.denominator, 0)}` });
        });

        return {
          primary: { label: "Continued Fraction", value: cfNotation },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["fraction-calculator", "decimal-fraction-converter", "scientific-calculator"],
  faq: [
    { question: "What is a continued fraction?", answer: "A continued fraction represents a number as a sequence of integer quotients: a₀ + 1/(a₁ + 1/(a₂ + ...)). Written as [a₀; a₁, a₂, ...]. For example, the golden ratio φ = [1; 1, 1, 1, ...] and π ≈ [3; 7, 15, 1, 292, ...]." },
    { question: "What are convergents?", answer: "Convergents are the rational numbers obtained by truncating a continued fraction at each step. They provide the best rational approximations for a given denominator size. For example, 22/7 and 355/113 are famous convergents of π." },
  ],
  formula: "x = a₀ + 1/(a₁ + 1/(a₂ + 1/(a₃ + ...))) | Notation: [a₀; a₁, a₂, a₃, ...]",
};
