import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyClothingSizeCalculator: CalculatorDefinition = {
  slug: "baby-clothing-size-calculator",
  title: "Baby Clothing Size Calculator",
  description:
    "Free baby clothing size calculator. Find the right clothing size for your baby based on age, weight, and height across major brands.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby clothing size",
    "baby clothes size chart",
    "infant clothing size",
    "baby size guide",
    "what size baby clothes",
  ],
  variants: [
    {
      id: "clothing-size",
      name: "Find Baby Clothing Size",
      description: "Determine the right clothing size for your baby",
      fields: [
        {
          name: "ageMonths",
          label: "Baby's Age (months)",
          type: "number",
          placeholder: "e.g. 6",
          min: 0,
          max: 36,
        },
        {
          name: "weight",
          label: "Baby's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 16",
          min: 4,
          max: 40,
        },
        {
          name: "height",
          label: "Baby's Height (inches)",
          type: "number",
          placeholder: "e.g. 26",
          min: 17,
          max: 42,
        },
      ],
      calculate: (inputs) => {
        const ageMonths = inputs.ageMonths as number;
        const weightLbs = inputs.weight as number;
        const heightIn = inputs.height as number;
        if (!ageMonths && ageMonths !== 0) return null;
        if (!weightLbs || !heightIn) return null;

        // Standard US baby clothing sizes
        const sizes = [
          { label: "Preemie", maxWeight: 6, maxHeight: 17, maxAge: 0 },
          { label: "Newborn (NB)", maxWeight: 8, maxHeight: 21.5, maxAge: 1 },
          { label: "0-3 Months", maxWeight: 12.5, maxHeight: 23.5, maxAge: 3 },
          { label: "3-6 Months", maxWeight: 16.5, maxHeight: 26.5, maxAge: 6 },
          { label: "6-9 Months", maxWeight: 20.5, maxHeight: 28.5, maxAge: 9 },
          { label: "9-12 Months", maxWeight: 24, maxHeight: 30, maxAge: 12 },
          { label: "12-18 Months", maxWeight: 27.5, maxHeight: 32, maxAge: 18 },
          { label: "18-24 Months", maxWeight: 30, maxHeight: 33.5, maxAge: 24 },
          { label: "2T", maxWeight: 32, maxHeight: 35, maxAge: 30 },
          { label: "3T", maxWeight: 34, maxHeight: 38, maxAge: 36 },
        ];

        // Find size by weight (primary), height (secondary)
        let sizeByWeight = sizes[sizes.length - 1].label;
        for (const s of sizes) {
          if (weightLbs <= s.maxWeight) {
            sizeByWeight = s.label;
            break;
          }
        }

        let sizeByHeight = sizes[sizes.length - 1].label;
        for (const s of sizes) {
          if (heightIn <= s.maxHeight) {
            sizeByHeight = s.label;
            break;
          }
        }

        let sizeByAge = sizes[sizes.length - 1].label;
        for (const s of sizes) {
          if (ageMonths <= s.maxAge) {
            sizeByAge = s.label;
            break;
          }
        }

        // Recommend the larger of weight/height sizes
        const sizeIndex = (label: string) => sizes.findIndex((s) => s.label === label);
        const weightIdx = sizeIndex(sizeByWeight);
        const heightIdx = sizeIndex(sizeByHeight);
        const recommended = weightIdx >= heightIdx ? sizeByWeight : sizeByHeight;

        return {
          primary: {
            label: "Recommended Size",
            value: recommended,
          },
          details: [
            { label: "Size by Weight", value: sizeByWeight },
            { label: "Size by Height", value: sizeByHeight },
            { label: "Size by Age", value: sizeByAge },
            { label: "Weight", value: `${formatNumber(weightLbs, 1)} lbs` },
            { label: "Height", value: `${formatNumber(heightIn, 1)} inches` },
            { label: "Tip", value: "When in doubt, size up. Babies grow quickly and slightly larger clothes last longer." },
          ],
          note: "Sizing varies by brand. Carter's, Gerber, and other brands may fit differently. Always check the specific brand's size chart. When between sizes, choose the larger size.",
        };
      },
    },
  ],
  relatedSlugs: ["child-shoe-size-calculator", "baby-growth-calculator", "baby-weight-percentile-calculator"],
  faq: [
    {
      question: "Should I buy baby clothes by age or weight?",
      answer:
        "Weight is generally the most reliable indicator for baby clothing size. Many babies don't match the age listed on clothing tags. A large 3-month-old may need 6-month clothes, and a small 6-month-old may still fit in 3-month sizes.",
    },
    {
      question: "Why do baby clothing sizes vary by brand?",
      answer:
        "There is no universal standard for baby clothing sizes. Each brand creates its own size chart. Carter's tends to run true to size, while some European brands run smaller. Always check the specific brand's weight and height guidelines.",
    },
    {
      question: "How far ahead should I buy baby clothes?",
      answer:
        "Buy only a few outfits in each size, especially for the first year when babies grow rapidly. Many babies skip sizes entirely. Stock up on the current and next size only, and keep receipts for easy exchanges.",
    },
  ],
  formula:
    "Size determined by matching baby's weight and height to standard US clothing size charts. When weight and height suggest different sizes, the larger size is recommended.",
};
