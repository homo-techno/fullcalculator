import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const scientificNotationCalc: CalculatorDefinition = {
  slug: "scientific-notation-calculator",
  title: "Scientific Notation Calculator",
  description:
    "Free online scientific notation converter and calculator. Convert numbers to and from scientific notation. Perform arithmetic in scientific notation.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "scientific notation",
    "standard form",
    "exponential notation",
    "scientific notation converter",
    "powers of ten",
  ],
  variants: [
    {
      id: "to-scientific",
      name: "Number to Scientific Notation",
      description: "Convert a decimal number to scientific notation",
      fields: [
        {
          name: "number",
          label: "Number",
          type: "number",
          placeholder: "e.g. 123456.789",
        },
      ],
      calculate: (inputs) => {
        const num = parseFloat(inputs.number as string);
        if (isNaN(num)) return null;

        if (num === 0) {
          return {
            primary: { label: "Scientific Notation", value: "0 x 10^0" },
            details: [
              { label: "Coefficient", value: "0" },
              { label: "Exponent", value: "0" },
            ],
          };
        }

        const exp = Math.floor(Math.log10(Math.abs(num)));
        const coeff = num / Math.pow(10, exp);

        return {
          primary: {
            label: "Scientific Notation",
            value: `${formatNumber(coeff, 6)} x 10^${exp}`,
          },
          details: [
            { label: "Coefficient", value: formatNumber(coeff, 6) },
            { label: "Exponent", value: formatNumber(exp) },
            { label: "E notation", value: `${formatNumber(coeff, 6)}e${exp}` },
            { label: "Original number", value: num.toPrecision(10) },
          ],
        };
      },
    },
    {
      id: "from-scientific",
      name: "Scientific Notation to Number",
      description: "Convert scientific notation (coefficient x 10^exponent) to a standard number",
      fields: [
        {
          name: "coefficient",
          label: "Coefficient",
          type: "number",
          placeholder: "e.g. 1.23",
        },
        {
          name: "exponent",
          label: "Exponent (power of 10)",
          type: "number",
          placeholder: "e.g. 5",
        },
      ],
      calculate: (inputs) => {
        const coeff = parseFloat(inputs.coefficient as string);
        const exp = parseFloat(inputs.exponent as string);
        if (isNaN(coeff) || isNaN(exp)) return null;

        const result = coeff * Math.pow(10, exp);

        return {
          primary: {
            label: "Standard Number",
            value: formatNumber(result, 6),
          },
          details: [
            { label: "Scientific notation", value: `${formatNumber(coeff, 6)} x 10^${formatNumber(exp)}` },
            { label: "E notation", value: `${formatNumber(coeff, 6)}e${formatNumber(exp)}` },
            { label: "Full precision", value: result.toPrecision(15) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["exponent-calculator", "sig-figs-calculator"],
  faq: [
    {
      question: "What is scientific notation?",
      answer:
        "Scientific notation expresses a number as a coefficient between 1 and 10 multiplied by a power of 10. For example, 5,000 = 5 x 10^3 and 0.003 = 3 x 10^(-3).",
    },
    {
      question: "When should I use scientific notation?",
      answer:
        "Scientific notation is most useful for very large or very small numbers. It is commonly used in science, engineering, and mathematics to make numbers more readable and easier to calculate with.",
    },
  ],
  formula: "Number = Coefficient x 10^Exponent (where 1 <= |Coefficient| < 10)",
};
