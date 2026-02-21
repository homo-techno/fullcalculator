import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gloveSizeCalculator: CalculatorDefinition = {
  slug: "glove-size-calculator",
  title: "Glove Size Calculator",
  description: "Free glove size calculator. Find your perfect glove size from hand measurements for men's and women's gloves.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["glove size calculator", "glove size chart", "hand measurement for gloves", "glove fitting guide", "work glove size"],
  variants: [
    {
      id: "womens",
      name: "Women's Glove Size",
      fields: [
        { name: "circumference", label: "Hand Circumference (around knuckles)", type: "number", placeholder: "e.g. 7", suffix: "in", step: 0.25 },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Inches", value: "in" },
          { label: "Centimeters", value: "cm" },
        ], defaultValue: "in" },
      ],
      calculate: (inputs) => {
        let circ = inputs.circumference as number;
        const unit = inputs.unit as string;
        if (!circ) return null;

        if (unit === "cm") circ = circ / 2.54;

        let size: string;
        let numericSize: number;
        if (circ < 6) { size = "XS"; numericSize = 5.5; }
        else if (circ < 6.5) { size = "XS"; numericSize = 6; }
        else if (circ < 7) { size = "S"; numericSize = 6.5; }
        else if (circ < 7.5) { size = "M"; numericSize = 7; }
        else if (circ < 8) { size = "L"; numericSize = 7.5; }
        else if (circ < 8.5) { size = "XL"; numericSize = 8; }
        else { size = "XXL"; numericSize = 8.5; }

        return {
          primary: { label: "Glove Size", value: size },
          details: [
            { label: "Numeric Size", value: formatNumber(numericSize, 1) },
            { label: "Hand Circumference", value: `${formatNumber(circ, 1)} in (${formatNumber(circ * 2.54, 1)} cm)` },
            { label: "Size Range", value: `XS: <6.5\" | S: 6.5-7\" | M: 7-7.5\" | L: 7.5-8\"` },
          ],
          note: "Measure around your dominant hand's knuckles (excluding thumb) with hand flat. If between sizes, size up for winter gloves, size down for leather gloves.",
        };
      },
    },
    {
      id: "mens",
      name: "Men's Glove Size",
      fields: [
        { name: "circumference", label: "Hand Circumference (around knuckles)", type: "number", placeholder: "e.g. 9", suffix: "in", step: 0.25 },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Inches", value: "in" },
          { label: "Centimeters", value: "cm" },
        ], defaultValue: "in" },
      ],
      calculate: (inputs) => {
        let circ = inputs.circumference as number;
        const unit = inputs.unit as string;
        if (!circ) return null;

        if (unit === "cm") circ = circ / 2.54;

        let size: string;
        let numericSize: number;
        if (circ < 7.5) { size = "XS"; numericSize = 7; }
        else if (circ < 8) { size = "S"; numericSize = 7.5; }
        else if (circ < 8.5) { size = "S"; numericSize = 8; }
        else if (circ < 9) { size = "M"; numericSize = 8.5; }
        else if (circ < 9.5) { size = "M"; numericSize = 9; }
        else if (circ < 10) { size = "L"; numericSize = 9.5; }
        else if (circ < 10.5) { size = "L"; numericSize = 10; }
        else if (circ < 11) { size = "XL"; numericSize = 10.5; }
        else if (circ < 11.5) { size = "XL"; numericSize = 11; }
        else { size = "XXL"; numericSize = 12; }

        return {
          primary: { label: "Glove Size", value: size },
          details: [
            { label: "Numeric Size", value: formatNumber(numericSize, 1) },
            { label: "Hand Circumference", value: `${formatNumber(circ, 1)} in (${formatNumber(circ * 2.54, 1)} cm)` },
            { label: "Size Range", value: `S: 7.5-8.5\" | M: 8.5-9.5\" | L: 9.5-10.5\" | XL: 10.5-11.5\"` },
          ],
          note: "Measure around your dominant hand's knuckles (excluding thumb) with hand flat. Work gloves may need to be sized up for heavy-duty use.",
        };
      },
    },
  ],
  relatedSlugs: ["ring-size-calculator", "hat-size-calculator", "bracelet-size-calculator"],
  faq: [
    { question: "How do I measure my hand for gloves?", answer: "Wrap a tape measure around the widest part of your hand (across the knuckles, excluding the thumb) with your hand flat and fingers together. This circumference in inches is your numeric glove size." },
    { question: "What is the difference between men's and women's glove sizes?", answer: "Women's sizes start smaller: XS at ~6\" circumference vs men's XS at ~7.5\". A women's Large is roughly equivalent to a men's Small. Always use the gender-specific chart." },
    { question: "Should gloves be tight or loose?", answer: "Gloves should fit snugly without restricting movement. Leather gloves will stretch 5-10% over time, so a snug fit is fine. Knit and winter gloves should allow some room for insulation." },
  ],
  formula: "Glove size ≈ hand circumference (inches) around knuckles | Women's range: XS (<6.5\") to XL (8\"+) | Men's range: XS (<7.5\") to XXL (11.5\"+)",
};
