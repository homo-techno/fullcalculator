import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const binaryArithmeticCalculator: CalculatorDefinition = {
  slug: "binary-arithmetic-calculator",
  title: "Binary Arithmetic Calculator",
  description:
    "Free binary arithmetic calculator. Add two binary numbers and see the result in both binary and decimal.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "binary arithmetic",
    "binary addition",
    "binary to decimal",
    "base 2",
    "number systems",
  ],
  variants: [
    {
      id: "add",
      name: "Add Binary Numbers",
      fields: [
        {
          name: "bin1",
          label: "First binary number",
          type: "text" as "number",
          placeholder: "e.g. 1010",
        },
        {
          name: "bin2",
          label: "Second binary number",
          type: "text" as "number",
          placeholder: "e.g. 1101",
        },
      ],
      calculate: (inputs) => {
        const bin1 = (inputs.bin1 as string || "").trim();
        const bin2 = (inputs.bin2 as string || "").trim();
        if (!bin1 || !bin2) return null;
        if (!/^[01]+$/.test(bin1) || !/^[01]+$/.test(bin2)) return null;

        const dec1 = parseInt(bin1, 2);
        const dec2 = parseInt(bin2, 2);
        const sum = dec1 + dec2;
        const sumBin = sum.toString(2);

        return {
          primary: { label: "Sum (binary)", value: sumBin },
          details: [
            { label: "Sum (decimal)", value: formatNumber(sum) },
            { label: `${bin1} (decimal)`, value: formatNumber(dec1) },
            { label: `${bin2} (decimal)`, value: formatNumber(dec2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "modular-arithmetic-calculator",
    "polynomial-calculator",
    "determinant-calculator",
  ],
  faq: [
    {
      question: "How does binary addition work?",
      answer:
        "Binary addition follows the same rules as decimal addition but in base 2. The key rules are: 0+0=0, 0+1=1, 1+0=1, and 1+1=10 (0 with a carry of 1). When both bits are 1 with a carry, 1+1+1=11 (1 with a carry of 1).",
    },
  ],
  formula: "Convert binary → decimal, add, convert back to binary",
};
