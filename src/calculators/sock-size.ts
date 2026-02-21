import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sockSizeCalculator: CalculatorDefinition = {
  slug: "sock-size-calculator",
  title: "Sock Size Calculator",
  description: "Free sock size calculator. Convert shoe size to sock size for men, women, and children.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sock size calculator", "sock size chart", "shoe size to sock size", "sock size converter", "what size socks do I need"],
  variants: [
    {
      id: "womens",
      name: "Women's Sock Size",
      fields: [
        { name: "shoeSize", label: "Women's Shoe Size (US)", type: "number", placeholder: "e.g. 8", step: 0.5 },
      ],
      calculate: (inputs) => {
        const shoeSize = inputs.shoeSize as number;
        if (!shoeSize) return null;

        let sockSize: string;
        let sockNumeric: string;
        if (shoeSize < 4) { sockSize = "XS"; sockNumeric = "4-5"; }
        else if (shoeSize < 6.5) { sockSize = "S"; sockNumeric = "5-7"; }
        else if (shoeSize < 9) { sockSize = "M"; sockNumeric = "7-9"; }
        else if (shoeSize < 11) { sockSize = "L"; sockNumeric = "9-11"; }
        else { sockSize = "XL"; sockNumeric = "11-13"; }

        // Foot length estimate
        const footLengthIn = (shoeSize + 17) * 0.847 / 2.54 * 2.54 / 2.54;
        const footLengthCm = (shoeSize + 17) * 0.847;

        return {
          primary: { label: "Sock Size", value: sockSize },
          details: [
            { label: "Numeric Range", value: sockNumeric },
            { label: "Shoe Size (US Women's)", value: formatNumber(shoeSize, 1) },
            { label: "Approx. Foot Length", value: `${formatNumber(footLengthCm, 1)} cm` },
          ],
          note: "Sock sizes typically cover a range of shoe sizes. If between sizes, choose the larger sock size for comfort.",
        };
      },
    },
    {
      id: "mens",
      name: "Men's Sock Size",
      fields: [
        { name: "shoeSize", label: "Men's Shoe Size (US)", type: "number", placeholder: "e.g. 10", step: 0.5 },
      ],
      calculate: (inputs) => {
        const shoeSize = inputs.shoeSize as number;
        if (!shoeSize) return null;

        let sockSize: string;
        let sockNumeric: string;
        if (shoeSize < 6) { sockSize = "XS"; sockNumeric = "5-6"; }
        else if (shoeSize < 8.5) { sockSize = "S"; sockNumeric = "6-8"; }
        else if (shoeSize < 10.5) { sockSize = "M"; sockNumeric = "8-10"; }
        else if (shoeSize < 12.5) { sockSize = "L"; sockNumeric = "10-12"; }
        else if (shoeSize < 14.5) { sockSize = "XL"; sockNumeric = "12-14"; }
        else { sockSize = "XXL"; sockNumeric = "14-16"; }

        const footLengthCm = (shoeSize + 18) * 0.847;

        return {
          primary: { label: "Sock Size", value: sockSize },
          details: [
            { label: "Numeric Range", value: sockNumeric },
            { label: "Shoe Size (US Men's)", value: formatNumber(shoeSize, 1) },
            { label: "Approx. Foot Length", value: `${formatNumber(footLengthCm, 1)} cm` },
          ],
          note: "Most men's socks come in standard sizes covering 2-3 shoe sizes. Athletic socks may fit differently than dress socks.",
        };
      },
    },
    {
      id: "kids",
      name: "Children's Sock Size",
      fields: [
        { name: "shoeSize", label: "Child's Shoe Size (US)", type: "number", placeholder: "e.g. 12", step: 0.5, min: 1 },
        { name: "ageGroup", label: "Age Group", type: "select", options: [
          { label: "Infant (0-12 months)", value: "infant" },
          { label: "Toddler (1-3 years)", value: "toddler" },
          { label: "Little Kid (4-7 years)", value: "little" },
          { label: "Big Kid (8-12 years)", value: "big" },
        ], defaultValue: "little" },
      ],
      calculate: (inputs) => {
        const shoeSize = inputs.shoeSize as number;
        const ageGroup = inputs.ageGroup as string;
        if (!shoeSize) return null;

        let sockSize: string;
        if (ageGroup === "infant") {
          if (shoeSize < 2) sockSize = "0-6 months";
          else sockSize = "6-12 months";
        } else if (ageGroup === "toddler") {
          if (shoeSize < 6) sockSize = "2T-3T (shoe 4-5.5)";
          else sockSize = "3T-4T (shoe 6-8.5)";
        } else if (ageGroup === "little") {
          if (shoeSize < 10) sockSize = "S (shoe 8-9.5)";
          else if (shoeSize < 12) sockSize = "M (shoe 10-11.5)";
          else sockSize = "L (shoe 12-13.5)";
        } else {
          if (shoeSize < 2) sockSize = "S (shoe 1-2)";
          else if (shoeSize < 4) sockSize = "M (shoe 2-4)";
          else sockSize = "L (shoe 4-6)";
        }

        return {
          primary: { label: "Sock Size", value: sockSize },
          details: [
            { label: "Age Group", value: ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1) },
            { label: "Shoe Size", value: formatNumber(shoeSize, 1) },
          ],
          note: "Children's feet grow quickly. Check sizing every 2-3 months. Socks that are too small can restrict circulation.",
        };
      },
    },
  ],
  relatedSlugs: ["shoe-size-converter", "glove-size-calculator", "hat-size-calculator"],
  faq: [
    { question: "How do I know my sock size?", answer: "Sock sizes are based on your shoe size. Most socks list a shoe size range (e.g., 6-10). For women's socks: S fits shoes 5-7, M fits 7-9, L fits 9-11. For men's: M fits 8-10, L fits 10-12." },
    { question: "What happens if socks are too small?", answer: "Socks that are too small can restrict blood circulation, cause discomfort, bunch up in shoes, and wear out faster. The heel of the sock should sit at your heel, not ride up or sit under your arch." },
    { question: "Should I size up or down in socks?", answer: "If between sizes, size up. Slightly larger socks are more comfortable and will not restrict circulation. Socks also tend to shrink slightly after washing, especially cotton." },
  ],
  formula: "Sock size is determined by shoe size ranges | Women's: S=5-7, M=7-9, L=9-11 | Men's: S=6-8, M=8-10, L=10-12",
};
