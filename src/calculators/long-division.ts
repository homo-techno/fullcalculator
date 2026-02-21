import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const longDivisionCalculator: CalculatorDefinition = {
  slug: "long-division-calculator",
  title: "Long Division Calculator",
  description: "Free long division calculator. Divide two numbers and get quotient, remainder, decimal result, and mixed number form.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["long division calculator", "division calculator", "divide with remainder", "quotient and remainder", "division solver"],
  variants: [
    {
      id: "divide",
      name: "Long Division",
      fields: [
        { name: "dividend", label: "Dividend (number to divide)", type: "number", placeholder: "e.g. 127" },
        { name: "divisor", label: "Divisor (divide by)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const dividend = inputs.dividend as number;
        const divisor = inputs.divisor as number;
        if (dividend === undefined || !divisor) return null;
        const quotient = Math.trunc(dividend / divisor);
        const remainder = dividend % divisor;
        const decimal = dividend / divisor;
        const isEven = remainder === 0;
        return {
          primary: { label: `${dividend} ÷ ${divisor}`, value: isEven ? `${quotient}` : `${quotient} R ${Math.abs(remainder)}` },
          details: [
            { label: "Quotient", value: `${quotient}` },
            { label: "Remainder", value: `${Math.abs(remainder)}` },
            { label: "Decimal", value: formatNumber(decimal, 10) },
            ...(remainder !== 0 ? [{ label: "Mixed number", value: `${quotient} ${Math.abs(remainder)}/${Math.abs(divisor)}` }] : []),
            { label: "Verify", value: `${quotient} × ${divisor} + ${Math.abs(remainder)} = ${quotient * divisor + Math.abs(remainder)}` },
            { label: "Evenly divisible?", value: isEven ? "Yes" : "No" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fraction-calculator", "percentage-calculator", "average-calculator"],
  faq: [
    { question: "What is long division?", answer: "Long division breaks division into steps: Divide, Multiply, Subtract, Bring down. 127 ÷ 5: 5 goes into 12 twice (10), remainder 2. Bring down 7 → 27. 5 goes into 27 five times (25), remainder 2. Answer: 25 R 2." },
  ],
  formula: "Dividend = Quotient × Divisor + Remainder",
};
