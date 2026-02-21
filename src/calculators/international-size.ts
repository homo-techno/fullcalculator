import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const internationalSizeCalculator: CalculatorDefinition = {
  slug: "international-size-calculator",
  title: "International Clothing Size Converter",
  description:
    "Free international clothing size converter. Convert US clothing sizes to UK, EU, and Asian sizes for men's and women's apparel.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "international size converter",
    "clothing size converter",
    "EU to US size",
    "UK size converter",
    "dress size conversion",
  ],
  variants: [
    {
      id: "women",
      name: "Women's Clothing Sizes",
      description: "Convert women's clothing sizes between regions",
      fields: [
        {
          name: "usSize",
          label: "US Size",
          type: "select",
          options: [
            { label: "US 0 (XS)", value: "0" },
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
          defaultValue: "8",
        },
      ],
      calculate: (inputs) => {
        const usSize = parseInt(inputs.usSize as string);

        const sizeMap: Record<number, { uk: number; eu: number; aus: number; japan: number; label: string }> = {
          0: { uk: 4, eu: 32, aus: 4, japan: 5, label: "XS" },
          2: { uk: 6, eu: 34, aus: 6, japan: 7, label: "XS" },
          4: { uk: 8, eu: 36, aus: 8, japan: 9, label: "S" },
          6: { uk: 10, eu: 38, aus: 10, japan: 11, label: "S" },
          8: { uk: 12, eu: 40, aus: 12, japan: 13, label: "M" },
          10: { uk: 14, eu: 42, aus: 14, japan: 15, label: "M" },
          12: { uk: 16, eu: 44, aus: 16, japan: 17, label: "L" },
          14: { uk: 18, eu: 46, aus: 18, japan: 19, label: "L" },
          16: { uk: 20, eu: 48, aus: 20, japan: 21, label: "XL" },
          18: { uk: 22, eu: 50, aus: 22, japan: 23, label: "XXL" },
          20: { uk: 24, eu: 52, aus: 24, japan: 25, label: "XXL" },
        };

        const sizes = sizeMap[usSize];
        if (!sizes) return null;

        const bustCm = 76 + usSize * 2.5;
        const waistCm = 58 + usSize * 2.5;
        const hipCm = 84 + usSize * 2.5;

        return {
          primary: {
            label: "International Size",
            value: `EU ${sizes.eu} / UK ${sizes.uk}`,
          },
          details: [
            { label: "US size", value: `${usSize} (${sizes.label})` },
            { label: "UK size", value: `${sizes.uk}` },
            { label: "EU size", value: `${sizes.eu}` },
            { label: "Australia size", value: `${sizes.aus}` },
            { label: "Japan size", value: `${sizes.japan}` },
            { label: "General size", value: sizes.label },
            { label: "Approx bust", value: `${formatNumber(bustCm, 0)} cm / ${formatNumber(bustCm / 2.54, 1)} in` },
            { label: "Approx waist", value: `${formatNumber(waistCm, 0)} cm / ${formatNumber(waistCm / 2.54, 1)} in` },
            { label: "Approx hip", value: `${formatNumber(hipCm, 0)} cm / ${formatNumber(hipCm / 2.54, 1)} in` },
          ],
          note: "Sizes are approximate and vary by brand. Always check the brand's specific size chart when shopping internationally. Try items on when possible.",
        };
      },
    },
    {
      id: "men",
      name: "Men's Clothing Sizes",
      description: "Convert men's clothing sizes between regions",
      fields: [
        {
          name: "usSize",
          label: "US/UK Chest Size (inches)",
          type: "select",
          options: [
            { label: "34 (XS)", value: "34" },
            { label: "36 (S)", value: "36" },
            { label: "38 (M)", value: "38" },
            { label: "40 (M)", value: "40" },
            { label: "42 (L)", value: "42" },
            { label: "44 (XL)", value: "44" },
            { label: "46 (XXL)", value: "46" },
            { label: "48 (3XL)", value: "48" },
            { label: "50 (4XL)", value: "50" },
          ],
          defaultValue: "40",
        },
        {
          name: "garment",
          label: "Garment Type",
          type: "select",
          options: [
            { label: "Suit / Jacket", value: "suit" },
            { label: "Shirt / Dress Shirt", value: "shirt" },
            { label: "Pants / Trousers", value: "pants" },
          ],
          defaultValue: "suit",
        },
      ],
      calculate: (inputs) => {
        const usSize = parseInt(inputs.usSize as string);
        const garment = inputs.garment as string;
        if (!usSize) return null;

        const euSize = usSize + 10;
        const chestCm = usSize * 2.54;

        const labelMap: Record<number, string> = {
          34: "XS", 36: "S", 38: "M", 40: "M", 42: "L", 44: "XL", 46: "XXL", 48: "3XL", 50: "4XL",
        };
        const label = labelMap[usSize] || "M";

        const shirtNeck = garment === "shirt" ? Math.round((usSize / 2.7 + 0.3) * 2) / 2 : 0;
        const euPants = garment === "pants" ? usSize + 16 : 0;
        const japanSize = garment === "suit" ? usSize - 2 : usSize;

        return {
          primary: {
            label: "International Size",
            value: `EU ${euSize} / ${label}`,
          },
          details: [
            { label: "US/UK size", value: `${usSize} (${label})` },
            { label: "EU/IT size", value: `${euSize}` },
            { label: "Japan size", value: `${japanSize}` },
            { label: "General size", value: label },
            { label: "Chest measurement", value: `${usSize} in / ${formatNumber(chestCm, 0)} cm` },
            ...(garment === "shirt" ? [{ label: "Shirt neck size", value: `${shirtNeck} in` }] : []),
            ...(garment === "pants" ? [{ label: "EU pants size", value: `${euPants}` }] : []),
          ],
          note: "European sizes typically add 10 to US/UK chest measurements for suits and jackets. Always refer to individual brand size charts as sizing can vary significantly between manufacturers.",
        };
      },
    },
  ],
  relatedSlugs: ["shoe-size-calculator", "travel-packing-calculator"],
  faq: [
    {
      question: "How do I convert US to EU clothing sizes?",
      answer:
        "For women: US size + 30 = approximate EU size (US 8 = EU 38). For men's suits: US chest size + 10 = EU size (US 40 = EU 50). These are approximations; always check brand-specific size charts as European brands can vary.",
    },
    {
      question: "Are Asian clothing sizes smaller than US sizes?",
      answer:
        "Yes, generally Asian sizes run 1-2 sizes smaller than US sizes. A US Medium might be an Asian Large or XL. Japanese sizing uses different numbering systems. Always check measurements in cm rather than relying on S/M/L labels when shopping in Asia.",
    },
    {
      question: "Why do clothing sizes vary between brands?",
      answer:
        "Clothing sizes are not standardized globally. Each brand creates their own size chart based on their target market. 'Vanity sizing' is also common, where brands label clothes with smaller size numbers to make customers feel better. Always use actual body measurements for the most accurate fit.",
    },
  ],
  formula:
    "Women: EU = US + 30; UK = US + 4; Men's Suits: EU = US + 10. Approximate body measurements estimated from size charts.",
};
