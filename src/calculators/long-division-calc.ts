import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const longDivisionCalc: CalculatorDefinition = {
  slug: "long-division-calculator",
  title: "Long Division Calculator",
  description:
    "Free online long division calculator with step-by-step solution. Divide any two numbers and see the quotient, remainder, and decimal result.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "long division calculator",
    "division with remainder",
    "step by step division",
    "divide numbers",
    "quotient and remainder",
  ],
  variants: [
    {
      id: "long-division",
      name: "Long Division",
      description: "Divide two numbers with quotient, remainder, and decimal result",
      fields: [
        {
          name: "dividend",
          label: "Dividend (number being divided)",
          type: "number",
          placeholder: "e.g. 1234",
        },
        {
          name: "divisor",
          label: "Divisor (divide by)",
          type: "number",
          placeholder: "e.g. 7",
        },
      ],
      calculate: (inputs) => {
        const dividend = parseFloat(inputs.dividend as string) || 0;
        const divisor = parseFloat(inputs.divisor as string) || 0;
        if (divisor === 0) return null;

        const quotient = Math.floor(Math.abs(dividend) / Math.abs(divisor));
        const remainder = Math.abs(dividend) % Math.abs(divisor);
        const decimalResult = dividend / divisor;
        const isNeg = (dividend < 0) !== (divisor < 0);

        // Build step-by-step
        const absDividend = Math.abs(dividend);
        const absDivisor = Math.abs(divisor);
        const digits = absDividend.toString().split("");
        const steps: string[] = [];
        let carry = 0;

        for (let i = 0; i < digits.length; i++) {
          carry = carry * 10 + parseInt(digits[i]);
          const stepQuotient = Math.floor(carry / absDivisor);
          const stepProduct = stepQuotient * absDivisor;
          steps.push(
            `Bring down ${digits[i]}: ${carry} / ${absDivisor} = ${stepQuotient}, remainder ${carry - stepProduct}`
          );
          carry = carry - stepProduct;
        }

        const stepsText = steps.join(" | ");

        return {
          primary: {
            label: "Result",
            value: formatNumber(decimalResult, 6),
          },
          details: [
            { label: "Quotient", value: `${isNeg ? "-" : ""}${formatNumber(quotient)}` },
            { label: "Remainder", value: formatNumber(remainder) },
            { label: "Expression", value: `${formatNumber(dividend)} / ${formatNumber(divisor)} = ${isNeg ? "-" : ""}${formatNumber(quotient)} R ${formatNumber(remainder)}` },
            { label: "Steps", value: stepsText },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "fraction-to-decimal-converter"],
  faq: [
    {
      question: "How does long division work?",
      answer:
        "Long division involves dividing one digit at a time from left to right. You divide, multiply, subtract, and bring down the next digit until all digits have been processed.",
    },
    {
      question: "What is the remainder in division?",
      answer:
        "The remainder is the amount left over after dividing. For example, 17 / 5 = 3 with a remainder of 2, because 5 x 3 = 15 and 17 - 15 = 2.",
    },
  ],
  formula: "Dividend / Divisor = Quotient remainder Remainder",
};
