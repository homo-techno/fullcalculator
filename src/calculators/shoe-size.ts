import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const shoeSizeConverter: CalculatorDefinition = {
  slug: "shoe-size-converter",
  title: "Shoe Size Converter",
  description: "Free shoe size converter. Convert between US, UK, EU, and CM shoe sizes for men, women, and children.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["shoe size converter", "US to EU shoe size", "shoe size chart", "shoe size calculator", "convert shoe size"],
  variants: [
    {
      id: "mens",
      name: "Men's Shoe Size",
      fields: [
        { name: "size", label: "Size (number)", type: "number", placeholder: "e.g. 10", step: 0.5 },
        { name: "from", label: "From System", type: "select", options: [
          { label: "US Men's", value: "us" },
          { label: "UK", value: "uk" },
          { label: "EU", value: "eu" },
          { label: "CM (foot length)", value: "cm" },
        ], defaultValue: "us" },
      ],
      calculate: (inputs) => {
        const size = inputs.size as number;
        const from = inputs.from as string;
        if (!size) return null;
        let cm: number;
        if (from === "us") cm = (size + 18) * 0.847;
        else if (from === "uk") cm = (size + 18.5) * 0.847;
        else if (from === "eu") cm = (size + 2) * 0.667;
        else cm = size;
        const us = cm / 0.847 - 18;
        const uk = cm / 0.847 - 18.5;
        const eu = cm / 0.667 - 2;
        return {
          primary: { label: `${from.toUpperCase()} ${size}`, value: `EU ${formatNumber(Math.round(eu * 2) / 2, 1)}` },
          details: [
            { label: "US Men's", value: formatNumber(Math.round(us * 2) / 2, 1) },
            { label: "UK", value: formatNumber(Math.round(uk * 2) / 2, 1) },
            { label: "EU", value: formatNumber(Math.round(eu * 2) / 2, 1) },
            { label: "CM (foot length)", value: formatNumber(cm, 1) },
            { label: "Inches", value: formatNumber(cm / 2.54, 1) },
          ],
          note: "Sizes are approximate. Try shoes on for best fit. Sizes can vary between brands.",
        };
      },
    },
    {
      id: "womens",
      name: "Women's Shoe Size",
      fields: [
        { name: "size", label: "Size (number)", type: "number", placeholder: "e.g. 8", step: 0.5 },
        { name: "from", label: "From System", type: "select", options: [
          { label: "US Women's", value: "us" },
          { label: "UK", value: "uk" },
          { label: "EU", value: "eu" },
        ], defaultValue: "us" },
      ],
      calculate: (inputs) => {
        const size = inputs.size as number;
        const from = inputs.from as string;
        if (!size) return null;
        let cm: number;
        if (from === "us") cm = (size + 17) * 0.847;
        else if (from === "uk") cm = (size + 18.5) * 0.847;
        else cm = (size + 2) * 0.667;
        const usW = cm / 0.847 - 17;
        const uk = cm / 0.847 - 18.5;
        const eu = cm / 0.667 - 2;
        const usM = usW - 1.5;
        return {
          primary: { label: `${from.toUpperCase()} ${size} Women's`, value: `EU ${formatNumber(Math.round(eu * 2) / 2, 1)}` },
          details: [
            { label: "US Women's", value: formatNumber(Math.round(usW * 2) / 2, 1) },
            { label: "US Men's (equiv)", value: formatNumber(Math.round(usM * 2) / 2, 1) },
            { label: "UK", value: formatNumber(Math.round(uk * 2) / 2, 1) },
            { label: "EU", value: formatNumber(Math.round(eu * 2) / 2, 1) },
            { label: "CM", value: formatNumber(cm, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "cooking-converter"],
  faq: [
    { question: "How do US and EU shoe sizes compare?", answer: "US Men's to EU: add ~33 (US 10 ≈ EU 43). US Women's to EU: add ~31 (US 8 ≈ EU 39). These are approximations — always check brand-specific size charts." },
  ],
  formula: "Approximate: EU ≈ US Men's + 33 | US Women's = US Men's + 1.5",
};
