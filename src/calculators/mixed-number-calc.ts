import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mixedNumberCalc: CalculatorDefinition = {
  slug: "mixed-number-calculator",
  title: "Mixed Number Calculator",
  description:
    "Free online mixed number calculator. Add, subtract, multiply, and divide mixed numbers and fractions with step-by-step solutions.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "mixed number calculator",
    "mixed fraction calculator",
    "add mixed numbers",
    "subtract mixed numbers",
    "multiply mixed numbers",
    "divide mixed numbers",
  ],
  variants: [
    {
      id: "add-mixed",
      name: "Add Mixed Numbers",
      description: "Add two mixed numbers or fractions",
      fields: [
        {
          name: "whole1",
          label: "First Whole Number (0 for fraction only)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "num1",
          label: "First Numerator",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "den1",
          label: "First Denominator",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
        },
        {
          name: "whole2",
          label: "Second Whole Number (0 for fraction only)",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "num2",
          label: "Second Numerator",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "den2",
          label: "Second Denominator",
          type: "number",
          placeholder: "e.g. 3",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const w1 = parseFloat(inputs.whole1 as string) || 0;
        const n1 = parseFloat(inputs.num1 as string) || 0;
        const d1 = parseFloat(inputs.den1 as string) || 0;
        const w2 = parseFloat(inputs.whole2 as string) || 0;
        const n2 = parseFloat(inputs.num2 as string) || 0;
        const d2 = parseFloat(inputs.den2 as string) || 0;
        if (d1 === 0 || d2 === 0) return null;

        // Convert to improper fractions
        const imp1Num = w1 * d1 + n1;
        const imp2Num = w2 * d2 + n2;

        // Add: a/b + c/d = (ad + bc) / bd
        const resNum = imp1Num * d2 + imp2Num * d1;
        const resDen = d1 * d2;

        // Simplify
        const gcd = (a: number, b: number): number => {
          a = Math.abs(Math.round(a));
          b = Math.abs(Math.round(b));
          return b === 0 ? a : gcd(b, a % b);
        };
        const g = gcd(Math.abs(resNum), Math.abs(resDen));
        const simpNum = resNum / g;
        const simpDen = resDen / g;

        // To mixed number
        const whole = Math.trunc(simpNum / simpDen);
        const remNum = Math.abs(simpNum % simpDen);
        const decimal = simpNum / simpDen;

        const mixedStr =
          remNum === 0
            ? `${whole}`
            : whole !== 0
              ? `${whole} and ${remNum}/${Math.abs(simpDen)}`
              : `${simpNum}/${simpDen}`;

        return {
          primary: {
            label: "Result",
            value: mixedStr,
          },
          details: [
            { label: "Improper fraction", value: `${formatNumber(simpNum)}/${formatNumber(simpDen)}` },
            { label: "Decimal", value: formatNumber(decimal, 6) },
            { label: "First as improper", value: `${formatNumber(imp1Num)}/${formatNumber(d1)}` },
            { label: "Second as improper", value: `${formatNumber(imp2Num)}/${formatNumber(d2)}` },
          ],
        };
      },
    },
    {
      id: "subtract-mixed",
      name: "Subtract Mixed Numbers",
      description: "Subtract two mixed numbers or fractions",
      fields: [
        {
          name: "whole1",
          label: "First Whole Number",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "num1",
          label: "First Numerator",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "den1",
          label: "First Denominator",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
        },
        {
          name: "whole2",
          label: "Second Whole Number",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "num2",
          label: "Second Numerator",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "den2",
          label: "Second Denominator",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const w1 = parseFloat(inputs.whole1 as string) || 0;
        const n1 = parseFloat(inputs.num1 as string) || 0;
        const d1 = parseFloat(inputs.den1 as string) || 0;
        const w2 = parseFloat(inputs.whole2 as string) || 0;
        const n2 = parseFloat(inputs.num2 as string) || 0;
        const d2 = parseFloat(inputs.den2 as string) || 0;
        if (d1 === 0 || d2 === 0) return null;

        const imp1Num = w1 * d1 + n1;
        const imp2Num = w2 * d2 + n2;

        // Subtract: a/b - c/d = (ad - bc) / bd
        const resNum = imp1Num * d2 - imp2Num * d1;
        const resDen = d1 * d2;

        const gcd = (a: number, b: number): number => {
          a = Math.abs(Math.round(a));
          b = Math.abs(Math.round(b));
          return b === 0 ? a : gcd(b, a % b);
        };
        const g = gcd(Math.abs(resNum), Math.abs(resDen));
        const simpNum = resNum / g;
        const simpDen = resDen / g;

        const whole = Math.trunc(simpNum / simpDen);
        const remNum = Math.abs(simpNum % simpDen);
        const decimal = simpNum / simpDen;

        const mixedStr =
          remNum === 0
            ? `${whole}`
            : whole !== 0
              ? `${whole} and ${remNum}/${Math.abs(simpDen)}`
              : `${simpNum}/${simpDen}`;

        return {
          primary: {
            label: "Result",
            value: mixedStr,
          },
          details: [
            { label: "Improper fraction", value: `${formatNumber(simpNum)}/${formatNumber(simpDen)}` },
            { label: "Decimal", value: formatNumber(decimal, 6) },
          ],
        };
      },
    },
    {
      id: "multiply-mixed",
      name: "Multiply Mixed Numbers",
      description: "Multiply two mixed numbers or fractions",
      fields: [
        {
          name: "whole1",
          label: "First Whole Number",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "num1",
          label: "First Numerator",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "den1",
          label: "First Denominator",
          type: "number",
          placeholder: "e.g. 3",
          min: 1,
        },
        {
          name: "whole2",
          label: "Second Whole Number",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "num2",
          label: "Second Numerator",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "den2",
          label: "Second Denominator",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const w1 = parseFloat(inputs.whole1 as string) || 0;
        const n1 = parseFloat(inputs.num1 as string) || 0;
        const d1 = parseFloat(inputs.den1 as string) || 0;
        const w2 = parseFloat(inputs.whole2 as string) || 0;
        const n2 = parseFloat(inputs.num2 as string) || 0;
        const d2 = parseFloat(inputs.den2 as string) || 0;
        if (d1 === 0 || d2 === 0) return null;

        const imp1Num = w1 * d1 + n1;
        const imp2Num = w2 * d2 + n2;

        // Multiply: (a/b) x (c/d) = ac / bd
        const resNum = imp1Num * imp2Num;
        const resDen = d1 * d2;

        const gcd = (a: number, b: number): number => {
          a = Math.abs(Math.round(a));
          b = Math.abs(Math.round(b));
          return b === 0 ? a : gcd(b, a % b);
        };
        const g = gcd(Math.abs(resNum), Math.abs(resDen));
        const simpNum = resNum / g;
        const simpDen = resDen / g;

        const whole = Math.trunc(simpNum / simpDen);
        const remNum = Math.abs(simpNum % simpDen);
        const decimal = simpNum / simpDen;

        const mixedStr =
          remNum === 0
            ? `${whole}`
            : whole !== 0
              ? `${whole} and ${remNum}/${Math.abs(simpDen)}`
              : `${simpNum}/${simpDen}`;

        return {
          primary: {
            label: "Result",
            value: mixedStr,
          },
          details: [
            { label: "Improper fraction", value: `${formatNumber(simpNum)}/${formatNumber(simpDen)}` },
            { label: "Decimal", value: formatNumber(decimal, 6) },
          ],
        };
      },
    },
    {
      id: "divide-mixed",
      name: "Divide Mixed Numbers",
      description: "Divide two mixed numbers or fractions",
      fields: [
        {
          name: "whole1",
          label: "First Whole Number",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "num1",
          label: "First Numerator",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "den1",
          label: "First Denominator",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
        },
        {
          name: "whole2",
          label: "Second Whole Number",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "num2",
          label: "Second Numerator",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "den2",
          label: "Second Denominator",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const w1 = parseFloat(inputs.whole1 as string) || 0;
        const n1 = parseFloat(inputs.num1 as string) || 0;
        const d1 = parseFloat(inputs.den1 as string) || 0;
        const w2 = parseFloat(inputs.whole2 as string) || 0;
        const n2 = parseFloat(inputs.num2 as string) || 0;
        const d2 = parseFloat(inputs.den2 as string) || 0;
        if (d1 === 0 || d2 === 0) return null;

        const imp1Num = w1 * d1 + n1;
        const imp2Num = w2 * d2 + n2;

        if (imp2Num === 0) return null;

        // Divide: (a/b) / (c/d) = (a x d) / (b x c)
        const resNum = imp1Num * d2;
        const resDen = d1 * imp2Num;

        const gcd = (a: number, b: number): number => {
          a = Math.abs(Math.round(a));
          b = Math.abs(Math.round(b));
          return b === 0 ? a : gcd(b, a % b);
        };
        const g = gcd(Math.abs(resNum), Math.abs(resDen));
        let simpNum = resNum / g;
        let simpDen = resDen / g;

        // Ensure denominator is positive
        if (simpDen < 0) {
          simpNum = -simpNum;
          simpDen = -simpDen;
        }

        const whole = Math.trunc(simpNum / simpDen);
        const remNum = Math.abs(simpNum % simpDen);
        const decimal = simpNum / simpDen;

        const mixedStr =
          remNum === 0
            ? `${whole}`
            : whole !== 0
              ? `${whole} and ${remNum}/${Math.abs(simpDen)}`
              : `${simpNum}/${simpDen}`;

        return {
          primary: {
            label: "Result",
            value: mixedStr,
          },
          details: [
            { label: "Improper fraction", value: `${formatNumber(simpNum)}/${formatNumber(simpDen)}` },
            { label: "Decimal", value: formatNumber(decimal, 6) },
            { label: "Method", value: "Multiply by reciprocal of second fraction" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fraction-to-decimal-converter", "decimal-to-fraction-converter"],
  faq: [
    {
      question: "What is a mixed number?",
      answer:
        "A mixed number is a combination of a whole number and a proper fraction, such as 2 3/4. It represents the sum of the whole part and the fractional part (2 + 3/4 = 11/4).",
    },
    {
      question: "How do I add mixed numbers?",
      answer:
        "Convert each mixed number to an improper fraction, find a common denominator, add the numerators, and then simplify. For example, 2 1/3 + 1 1/4 = 7/3 + 5/4 = 28/12 + 15/12 = 43/12 = 3 7/12.",
    },
    {
      question: "How do I multiply mixed numbers?",
      answer:
        "Convert each mixed number to an improper fraction, multiply the numerators together and the denominators together, then simplify. For example, 1 1/2 x 2 1/3 = 3/2 x 7/3 = 21/6 = 3 1/2.",
    },
  ],
  formula: "Convert to improper fractions, perform operation, simplify result",
};
