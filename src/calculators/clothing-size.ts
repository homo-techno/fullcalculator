import type { CalculatorDefinition } from "./types";

export const clothingSizeConverter: CalculatorDefinition = {
  slug: "clothing-size-converter",
  title: "Clothing Size Converter",
  description: "Free clothing size converter. Convert between US, UK, EU, and international clothing sizes for men and women.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["clothing size converter", "dress size converter", "size chart", "US to EU size", "international size"],
  variants: [
    {
      id: "women",
      name: "Women's Sizes",
      fields: [
        { name: "size", label: "US Size", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const us = inputs.size as number;
        if (!us || us < 0 || us > 22) return null;
        const uk = us - 2;
        const eu = us + 30;
        const jp = us + 1;
        const sizeNames: Record<number, string> = {
          0: "XXS", 2: "XS", 4: "S", 6: "S", 8: "M", 10: "M",
          12: "L", 14: "L", 16: "XL", 18: "XXL", 20: "XXXL", 22: "XXXL",
        };
        return {
          primary: { label: `US ${us}`, value: `EU ${eu}` },
          details: [
            { label: "US", value: String(us) },
            { label: "UK", value: String(uk) },
            { label: "EU", value: String(eu) },
            { label: "Japan", value: String(jp) },
            { label: "Letter size", value: sizeNames[Math.round(us / 2) * 2] || "—" },
          ],
        };
      },
    },
    {
      id: "men",
      name: "Men's Sizes",
      fields: [
        { name: "chest", label: "Chest (inches)", type: "number", placeholder: "e.g. 40" },
      ],
      calculate: (inputs) => {
        const chest = inputs.chest as number;
        if (!chest || chest < 32 || chest > 54) return null;
        const usSize = chest;
        const eu = Math.round((chest - 10) * 2.54);
        let letter = "M";
        if (chest <= 34) letter = "XS";
        else if (chest <= 36) letter = "S";
        else if (chest <= 40) letter = "M";
        else if (chest <= 44) letter = "L";
        else if (chest <= 48) letter = "XL";
        else letter = "XXL";
        return {
          primary: { label: `US ${usSize}`, value: `EU ${eu}` },
          details: [
            { label: "US/UK", value: String(usSize) },
            { label: "EU", value: String(eu) },
            { label: "Letter size", value: letter },
            { label: "Chest", value: `${chest}"` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["shoe-size-converter", "unit-converter", "bmi-calculator"],
  faq: [{ question: "How do I convert US to EU clothing size?", answer: "Women: EU = US + 30 (US 8 = EU 38). Men: EU size is roughly chest in cm minus some offset. Sizes vary by brand, so always check the brand's size chart." }],
  formula: "Women: EU = US + 30 | UK = US - 2",
};
