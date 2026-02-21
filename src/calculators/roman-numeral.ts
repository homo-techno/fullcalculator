import type { CalculatorDefinition } from "./types";

const romanMap: [number, string][] = [
  [1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],
  [50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"],
];

function toRoman(n: number): string {
  if (n <= 0 || n > 3999) return "Out of range (1-3999)";
  let result = "";
  let remaining = Math.floor(n);
  for (const [val, sym] of romanMap) {
    while (remaining >= val) { result += sym; remaining -= val; }
  }
  return result;
}

function fromRoman(s: string): number {
  const map: Record<string, number> = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]], next = map[s[i + 1]] || 0;
    total += cur < next ? -cur : cur;
  }
  return total;
}

export const romanNumeralCalculator: CalculatorDefinition = {
  slug: "roman-numeral-calculator",
  title: "Roman Numeral Calculator",
  description: "Free Roman numeral calculator. Convert between Roman numerals and decimal numbers. Supports values 1 to 3999.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["roman numeral converter", "roman numeral calculator", "roman to decimal", "decimal to roman"],
  variants: [
    {
      id: "decToRoman",
      name: "Decimal → Roman Numeral",
      fields: [
        { name: "num", label: "Decimal Number (1-3999)", type: "number", placeholder: "e.g. 2024" },
      ],
      calculate: (inputs) => {
        const n = inputs.num as number;
        if (!n || n < 1 || n > 3999) return null;
        return {
          primary: { label: String(Math.floor(n)), value: toRoman(n) },
          details: [
            { label: "Roman numeral", value: toRoman(n) },
            { label: "Decimal", value: String(Math.floor(n)) },
          ],
        };
      },
    },
    {
      id: "romanToDec",
      name: "Roman Numeral → Decimal",
      fields: [
        { name: "roman", label: "Roman Numeral", type: "text" as "number", placeholder: "e.g. MMXXIV" },
      ],
      calculate: (inputs) => {
        const s = String(inputs.roman || "").trim().toUpperCase();
        if (!s || !/^[IVXLCDM]+$/.test(s)) return null;
        const dec = fromRoman(s);
        return {
          primary: { label: s, value: String(dec) },
          details: [
            { label: "Decimal", value: String(dec) },
            { label: "Verification", value: toRoman(dec) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hex-to-decimal-calculator", "binary-hex-calculator", "number-sequence-calculator"],
  faq: [{ question: "How do Roman numerals work?", answer: "Roman numerals use letters: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. A smaller numeral before a larger one means subtraction (IV=4, IX=9). Otherwise, add them left to right." }],
  formula: "I=1, V=5, X=10, L=50, C=100, D=500, M=1000",
};
