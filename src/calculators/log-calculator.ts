import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const logCalculator: CalculatorDefinition = {
  slug: "log-calculator",
  title: "Logarithm Calculator",
  description:
    "Free online logarithm calculator. Calculate common (log base 10), natural (ln), and custom base logarithms.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "logarithm calculator",
    "log calculator",
    "natural log",
    "log base 10",
    "ln calculator",
    "custom base log",
  ],
  variants: [
    {
      id: "common-log",
      name: "Common Logarithm (log10)",
      description: "Calculate the base-10 logarithm of a number",
      fields: [
        {
          name: "value",
          label: "Number",
          type: "number",
          placeholder: "e.g. 1000",
        },
      ],
      calculate: (inputs) => {
        const val = parseFloat(inputs.value as string);
        if (isNaN(val) || val <= 0) return null;

        const result = Math.log10(val);

        return {
          primary: {
            label: "log\u2081\u2080 Result",
            value: formatNumber(result, 6),
          },
          details: [
            { label: "Expression", value: `log\u2081\u2080(${formatNumber(val)}) = ${formatNumber(result, 6)}` },
            { label: "Verification", value: `10^${formatNumber(result, 6)} = ${formatNumber(Math.pow(10, result), 6)}` },
          ],
        };
      },
    },
    {
      id: "natural-log",
      name: "Natural Logarithm (ln)",
      description: "Calculate the natural logarithm (base e) of a number",
      fields: [
        {
          name: "value",
          label: "Number",
          type: "number",
          placeholder: "e.g. 100",
        },
      ],
      calculate: (inputs) => {
        const val = parseFloat(inputs.value as string);
        if (isNaN(val) || val <= 0) return null;

        const result = Math.log(val);

        return {
          primary: {
            label: "ln Result",
            value: formatNumber(result, 6),
          },
          details: [
            { label: "Expression", value: `ln(${formatNumber(val)}) = ${formatNumber(result, 6)}` },
            { label: "Euler's number (e)", value: formatNumber(Math.E, 6) },
            { label: "Verification", value: `e^${formatNumber(result, 6)} = ${formatNumber(Math.exp(result), 6)}` },
          ],
        };
      },
    },
    {
      id: "custom-base",
      name: "Custom Base Logarithm",
      description: "Calculate the logarithm of a number with any base",
      fields: [
        {
          name: "base",
          label: "Base",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "value",
          label: "Number",
          type: "number",
          placeholder: "e.g. 64",
        },
      ],
      calculate: (inputs) => {
        const base = parseFloat(inputs.base as string);
        const val = parseFloat(inputs.value as string);
        if (isNaN(base) || isNaN(val) || base <= 0 || base === 1 || val <= 0) return null;

        const result = Math.log(val) / Math.log(base);

        return {
          primary: {
            label: `log base ${formatNumber(base)} Result`,
            value: formatNumber(result, 6),
          },
          details: [
            { label: "Expression", value: `log_${formatNumber(base)}(${formatNumber(val)}) = ${formatNumber(result, 6)}` },
            { label: "Using change of base", value: `ln(${formatNumber(val)}) / ln(${formatNumber(base)}) = ${formatNumber(result, 6)}` },
            { label: "Verification", value: `${formatNumber(base)}^${formatNumber(result, 6)} = ${formatNumber(Math.pow(base, result), 6)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["exponent-calculator", "scientific-notation-calculator"],
  faq: [
    {
      question: "What is a logarithm?",
      answer:
        "A logarithm answers the question: 'To what power must the base be raised to produce a given number?' For example, log base 2 of 8 = 3 because 2^3 = 8.",
    },
    {
      question: "What is the difference between log and ln?",
      answer:
        "log (common logarithm) uses base 10, while ln (natural logarithm) uses base e (approximately 2.71828). Both are used widely in science and engineering.",
    },
    {
      question: "Why can't I take the log of a negative number?",
      answer:
        "In real number mathematics, logarithms are only defined for positive numbers. The log of zero or a negative number is undefined.",
    },
  ],
  formula: "log_b(x) = ln(x) / ln(b)",
};
