import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogHarnessSizeCalculator: CalculatorDefinition = {
  slug: "dog-harness-size-calculator",
  title: "Dog Harness Size Calculator",
  description:
    "Free dog harness size calculator. Find the right harness size for your dog based on chest girth, neck size, and weight measurements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog harness size",
    "dog harness calculator",
    "what size harness for my dog",
    "dog chest measurement harness",
    "dog harness fitting guide",
  ],
  variants: [
    {
      id: "harnessSize",
      name: "Harness Size Finder",
      fields: [
        {
          name: "chestGirth",
          label: "Chest Girth (inches) - widest part of ribcage",
          type: "number",
          placeholder: "e.g. 24",
          min: 8,
          max: 50,
          step: 0.5,
        },
        {
          name: "neckSize",
          label: "Neck Circumference (inches)",
          type: "number",
          placeholder: "e.g. 14",
          min: 5,
          max: 36,
          step: 0.5,
        },
        {
          name: "weight",
          label: "Dog's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 40",
          min: 1,
          max: 250,
          step: 1,
        },
      ],
      calculate: (inputs) => {
        const chestGirth = inputs.chestGirth as number;
        const neckSize = inputs.neckSize as number;
        const weight = inputs.weight as number;
        if (!chestGirth || chestGirth <= 0) return null;

        // Standard harness sizes based on chest girth
        const sizes = [
          { label: "XXS", chestMin: 8, chestMax: 12, weightRange: "2-5 lbs" },
          { label: "XS", chestMin: 12, chestMax: 16, weightRange: "5-10 lbs" },
          { label: "S", chestMin: 16, chestMax: 20, weightRange: "10-25 lbs" },
          { label: "M", chestMin: 20, chestMax: 26, weightRange: "25-50 lbs" },
          { label: "L", chestMin: 26, chestMax: 32, weightRange: "50-75 lbs" },
          { label: "XL", chestMin: 32, chestMax: 40, weightRange: "75-100 lbs" },
          { label: "XXL", chestMin: 40, chestMax: 50, weightRange: "100+ lbs" },
        ];

        const recommended = sizes.find((s) => chestGirth >= s.chestMin && chestGirth < s.chestMax) || sizes[sizes.length - 1];

        // If between sizes, recommend sizing up
        let fitNote = "Standard fit.";
        if (chestGirth >= recommended.chestMax - 1) {
          fitNote = "You're at the top of this size range. Consider sizing up if your dog is still growing.";
        }

        const details: { label: string; value: string }[] = [
          { label: "Recommended Size", value: recommended.label + " (chest " + recommended.chestMin + "-" + recommended.chestMax + "\")" },
          { label: "Weight Range for Size", value: recommended.weightRange },
          { label: "Your Dog's Chest Girth", value: formatNumber(chestGirth, 1) + " inches" },
        ];

        if (neckSize && neckSize > 0) {
          details.push({ label: "Neck Circumference", value: formatNumber(neckSize, 1) + " inches" });
        }
        if (weight && weight > 0) {
          details.push({ label: "Dog Weight", value: formatNumber(weight, 0) + " lbs" });
        }

        details.push({ label: "Fit Note", value: fitNote });
        details.push({
          label: "Tip",
          value: "You should be able to fit 2 fingers between the harness and your dog's body. Measure with a soft tape measure snugly but not tight.",
        });

        return {
          primary: {
            label: "Harness Size",
            value: recommended.label,
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["dog-crate-size-calculator", "dog-weight-calculator", "dog-walking-calorie-calculator"],
  faq: [
    {
      question: "How do I measure my dog for a harness?",
      answer:
        "The most important measurement is the chest girth. Measure around the widest part of your dog's ribcage, just behind the front legs. Use a soft tape measure and keep it snug but not tight. Also measure the neck circumference at the base where a collar would sit.",
    },
    {
      question: "What if my dog is between harness sizes?",
      answer:
        "If your dog is between sizes, it's generally better to size up, especially for puppies who are still growing. Most quality harnesses have adjustable straps that allow you to tighten the fit. A harness that's too tight can restrict breathing and movement.",
    },
    {
      question: "What type of harness is best for dogs that pull?",
      answer:
        "Front-clip (chest-clip) harnesses are best for dogs that pull, as they redirect the dog's forward motion when they pull. Back-clip harnesses are more comfortable for well-trained dogs. No-pull harnesses with both front and back clips offer the most versatility.",
    },
  ],
  formula:
    "Size determined by chest girth measurement: XXS 8-12\", XS 12-16\", S 16-20\", M 20-26\", L 26-32\", XL 32-40\", XXL 40-50\". When between sizes, size up. Two-finger rule: should fit two fingers between harness and dog.",
};
