import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const catLitterBoxCalculator: CalculatorDefinition = {
  slug: "cat-litter-box-calculator",
  title: "Cat Litter Box Size Calculator",
  description:
    "Free cat litter box size calculator. Determine the ideal litter box dimensions based on your cat's size, number of cats, and living space.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cat litter box size",
    "litter box calculator",
    "cat litter box dimensions",
    "how many litter boxes",
    "litter box per cat",
  ],
  variants: [
    {
      id: "litter-box-size",
      name: "Litter Box Size",
      description: "Calculate the recommended litter box size for your cat",
      fields: [
        {
          name: "catLength",
          label: "Cat Body Length (nose to tail base)",
          type: "number",
          placeholder: "e.g. 18",
          suffix: "inches",
          min: 8,
          max: 30,
        },
        {
          name: "numberOfCats",
          label: "Number of Cats",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 20,
        },
        {
          name: "catSize",
          label: "Cat Size Category",
          type: "select",
          options: [
            { label: "Small (under 8 lbs)", value: "small" },
            { label: "Medium (8-12 lbs)", value: "medium" },
            { label: "Large (12-18 lbs)", value: "large" },
            { label: "Extra Large (over 18 lbs)", value: "xlarge" },
          ],
          defaultValue: "medium",
        },
        {
          name: "boxType",
          label: "Box Type Preference",
          type: "select",
          options: [
            { label: "Open Top", value: "open" },
            { label: "Covered/Hooded", value: "covered" },
            { label: "Top Entry", value: "top" },
          ],
          defaultValue: "open",
        },
      ],
      calculate: (inputs) => {
        const catLength = inputs.catLength as number;
        const numberOfCats = inputs.numberOfCats as number;
        const catSize = inputs.catSize as string;
        const boxType = inputs.boxType as string;
        if (!catLength || !numberOfCats) return null;

        // Recommended box length is 1.5x cat body length
        const recommendedLength = catLength * 1.5;
        const recommendedWidth = catLength;

        // Height adjustments based on box type
        let recommendedHeight: number;
        if (boxType === "covered") {
          recommendedHeight = catSize === "xlarge" ? 18 : catSize === "large" ? 16 : 14;
        } else if (boxType === "top") {
          recommendedHeight = catSize === "xlarge" ? 20 : catSize === "large" ? 18 : 15;
        } else {
          recommendedHeight = catSize === "xlarge" ? 8 : catSize === "large" ? 7 : 5;
        }

        // Number of boxes: n+1 rule
        const recommendedBoxes = numberOfCats + 1;

        // Litter depth recommendation
        const litterDepth = catSize === "xlarge" || catSize === "large" ? 4 : 3;

        return {
          primary: {
            label: "Recommended Box Size",
            value: `${formatNumber(Math.round(recommendedLength))} x ${formatNumber(Math.round(recommendedWidth))} inches`,
          },
          details: [
            { label: "Minimum Length", value: `${formatNumber(Math.round(recommendedLength))} inches` },
            { label: "Minimum Width", value: `${formatNumber(Math.round(recommendedWidth))} inches` },
            { label: "Recommended Wall Height", value: `${recommendedHeight} inches` },
            { label: "Number of Boxes Needed", value: `${recommendedBoxes} boxes (n+1 rule)` },
            { label: "Recommended Litter Depth", value: `${litterDepth} inches` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cat-indoor-space-calculator", "cat-water-intake-calculator"],
  faq: [
    {
      question: "How big should a litter box be?",
      answer:
        "A litter box should be at least 1.5 times the length of your cat from nose to tail base. The width should be at least equal to the cat's body length. This gives them enough room to comfortably turn around and dig.",
    },
    {
      question: "How many litter boxes do I need?",
      answer:
        "The general rule is n+1: one litter box per cat, plus one extra. So if you have 2 cats, you should have 3 litter boxes. This reduces territorial issues and ensures a clean option is always available.",
    },
    {
      question: "How deep should the litter be?",
      answer:
        "Most cats prefer 2-4 inches of litter depth. Too little litter means the box needs cleaning more often, while too much litter may discourage some cats from using the box.",
    },
  ],
  formula:
    "Recommended Length = Cat Body Length x 1.5 | Recommended Width = Cat Body Length | Boxes Needed = Number of Cats + 1",
};
