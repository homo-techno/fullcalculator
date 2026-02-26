import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const clothingSizeConvertCalculator: CalculatorDefinition = {
  slug: "clothing-size-convert",
  title: "Clothing Size Converter",
  description: "Free online clothing size converter. Convert between US, UK, and EU clothing sizes for men and women.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["clothing size converter", "US to EU size", "UK to US size", "dress size converter", "international sizing"],
  variants: [
    {
      id: "womens-size",
      name: "Women's Clothing Sizes",
      fields: [
        {
          name: "usSize",
          label: "US Size",
          type: "select",
          options: [
            { label: "US 0 (XXS)", value: "0" },
            { label: "US 2 (XS)", value: "2" },
            { label: "US 4 (S)", value: "4" },
            { label: "US 6 (S)", value: "6" },
            { label: "US 8 (M)", value: "8" },
            { label: "US 10 (M)", value: "10" },
            { label: "US 12 (L)", value: "12" },
            { label: "US 14 (L)", value: "14" },
            { label: "US 16 (XL)", value: "16" },
            { label: "US 18 (XXL)", value: "18" },
            { label: "US 20 (XXL)", value: "20" },
          ],
        },
      ],
      calculate: (inputs) => {
        const usSize = parseFloat(inputs.usSize as string) || 0;

        // Women's size mappings
        const ukSize = usSize + 4;
        const euSize = usSize + 30;
        const bust = 31 + usSize;
        const waist = 23 + usSize;
        const hips = 33.5 + usSize;

        const letterSizes: Record<number, string> = {
          0: "XXS", 2: "XS", 4: "S", 6: "S", 8: "M",
          10: "M", 12: "L", 14: "L", 16: "XL", 18: "XXL", 20: "XXL",
        };
        const letterSize = letterSizes[usSize] || "M";

        return {
          primary: { label: "EU Size", value: formatNumber(euSize) },
          details: [
            { label: "US Size", value: formatNumber(usSize) },
            { label: "UK Size", value: formatNumber(ukSize) },
            { label: "Letter Size", value: letterSize },
            { label: "Bust (approx)", value: `${formatNumber(bust)} in` },
            { label: "Waist (approx)", value: `${formatNumber(waist)} in` },
            { label: "Hips (approx)", value: `${formatNumber(hips)} in` },
          ],
        };
      },
    },
    {
      id: "mens-size",
      name: "Men's Clothing Sizes",
      fields: [
        {
          name: "usSize",
          label: "US Size",
          type: "select",
          options: [
            { label: "US XS (34)", value: "34" },
            { label: "US S (36)", value: "36" },
            { label: "US M (38-40)", value: "39" },
            { label: "US L (42-44)", value: "43" },
            { label: "US XL (46)", value: "46" },
            { label: "US XXL (48-50)", value: "49" },
          ],
        },
      ],
      calculate: (inputs) => {
        const usSize = parseFloat(inputs.usSize as string) || 0;

        const euSize = usSize + 10;
        const ukSize = usSize; // UK and US men's are similar
        const chest = usSize;

        const letterMap: Record<number, string> = {
          34: "XS", 36: "S", 39: "M", 43: "L", 46: "XL", 49: "XXL",
        };
        const letterSize = letterMap[usSize] || "M";

        return {
          primary: { label: "EU Size", value: formatNumber(euSize) },
          details: [
            { label: "US Size", value: formatNumber(usSize) },
            { label: "UK Size", value: formatNumber(ukSize) },
            { label: "Letter Size", value: letterSize },
            { label: "Chest (approx)", value: `${formatNumber(chest)} in` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["shoe-size-converter"],
  faq: [
    {
      question: "How do I convert US women's sizes to EU?",
      answer: "Add 30 to the US size. For example, US 6 = EU 36, US 8 = EU 38, US 10 = EU 40. Note that sizes can vary between brands.",
    },
    {
      question: "What is the difference between US and UK women's sizes?",
      answer: "UK women's sizes are typically 4 sizes larger than US sizes. A US 6 is equivalent to a UK 10, and a US 8 is a UK 12.",
    },
    {
      question: "Are international clothing sizes standardized?",
      answer: "No. Clothing sizes vary significantly between brands and countries. These conversions are approximate guidelines. Always check the brand's specific size chart when possible.",
    },
  ],
  formula: "EU_women = US + 30; UK_women = US + 4; EU_men = US + 10",
};
