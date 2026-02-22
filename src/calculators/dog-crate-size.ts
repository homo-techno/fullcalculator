import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogCrateSizeCalculator: CalculatorDefinition = {
  slug: "dog-crate-size-calculator",
  title: "Dog Crate Size Calculator",
  description:
    "Free dog crate size calculator. Find the perfect crate dimensions for your dog based on their measurements. Ensure a comfortable and safe fit.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog crate size",
    "dog crate calculator",
    "what size crate for my dog",
    "dog kennel size guide",
    "crate size by breed",
  ],
  variants: [
    {
      id: "crateSizeByMeasurement",
      name: "Crate Size by Dog Measurements",
      fields: [
        {
          name: "dogLength",
          label: "Dog's Length - Nose to Tail Base (inches)",
          type: "number",
          placeholder: "e.g. 24",
          min: 6,
          max: 60,
          step: 0.5,
        },
        {
          name: "dogHeight",
          label: "Dog's Height - Floor to Top of Head (inches)",
          type: "number",
          placeholder: "e.g. 20",
          min: 4,
          max: 48,
          step: 0.5,
        },
        {
          name: "crateUse",
          label: "Primary Use",
          type: "select",
          options: [
            { label: "House Training / Sleep", value: "training" },
            { label: "Travel / Transport", value: "travel" },
            { label: "Daytime Containment", value: "daytime" },
          ],
        },
      ],
      calculate: (inputs) => {
        const dogLength = inputs.dogLength as number;
        const dogHeight = inputs.dogHeight as number;
        const crateUse = (inputs.crateUse as string) || "training";
        if (!dogLength || dogLength <= 0 || !dogHeight || dogHeight <= 0) return null;

        // Crate should be dog length + 2-4 inches and dog height + 2-4 inches
        const addInches = crateUse === "travel" ? 2 : 4;
        const minCrateLength = dogLength + addInches;
        const minCrateHeight = dogHeight + addInches;
        const minCrateWidth = Math.round(minCrateLength * 0.65);

        // Standard crate sizes (length in inches)
        const standardSizes = [
          { label: "XS (18\")", length: 18 },
          { label: "Small (22\")", length: 22 },
          { label: "Small-Medium (24\")", length: 24 },
          { label: "Medium (30\")", length: 30 },
          { label: "Medium-Large (36\")", length: 36 },
          { label: "Large (42\")", length: 42 },
          { label: "XL (48\")", length: 48 },
          { label: "XXL (54\")", length: 54 },
        ];

        const recommended = standardSizes.find((s) => s.length >= minCrateLength) || standardSizes[standardSizes.length - 1];

        return {
          primary: {
            label: "Recommended Crate Size",
            value: recommended.label,
          },
          details: [
            { label: "Minimum Crate Length", value: formatNumber(minCrateLength, 1) + " inches" },
            { label: "Minimum Crate Height", value: formatNumber(minCrateHeight, 1) + " inches" },
            { label: "Minimum Crate Width", value: formatNumber(minCrateWidth, 0) + " inches" },
            { label: "Dog Length (measured)", value: formatNumber(dogLength, 1) + " inches" },
            { label: "Dog Height (measured)", value: formatNumber(dogHeight, 1) + " inches" },
            { label: "Use Case", value: crateUse === "training" ? "House Training / Sleep" : crateUse === "travel" ? "Travel / Transport" : "Daytime Containment" },
            {
              label: "Tip",
              value: "Your dog should be able to stand, turn around, and lie down comfortably. For puppies, use a divider to reduce crate size during house training.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dog-weight-calculator", "dog-harness-size-calculator", "dog-kennel-size-calculator"],
  faq: [
    {
      question: "How do I measure my dog for a crate?",
      answer:
        "Measure your dog's length from the tip of their nose to the base of their tail (not the tip). Measure height from the floor to the top of their head or the tips of their ears (whichever is taller) while they're standing. Add 2-4 inches to each measurement for the minimum crate size.",
    },
    {
      question: "Should I get a bigger crate for a puppy?",
      answer:
        "You can buy a crate sized for their expected adult size and use a divider to make the space smaller while they're growing. For house training, the crate should be just big enough for the puppy to stand, turn around, and lie down. Too much space can undermine house training.",
    },
    {
      question: "What type of crate is best?",
      answer:
        "Wire crates offer good ventilation and visibility, and many come with dividers for puppies. Plastic crates are better for travel and provide a more den-like feel. Soft-sided crates work for calm, trained dogs but aren't ideal for puppies or heavy chewers.",
    },
  ],
  formula:
    "Minimum Crate Length = Dog Nose-to-Tail-Base Length + 2-4 inches. Minimum Crate Height = Dog Floor-to-Head Height + 2-4 inches. Minimum Crate Width = ~65% of crate length. Travel crates add 2 inches; training/daytime crates add 4 inches.",
};
