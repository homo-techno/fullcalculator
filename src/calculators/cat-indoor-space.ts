import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const catIndoorSpaceCalculator: CalculatorDefinition = {
  slug: "cat-indoor-space-calculator",
  title: "Cat Indoor Space Requirements Calculator",
  description:
    "Free cat indoor space calculator. Determine the minimum living space your indoor cats need for a happy, healthy environment.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cat indoor space",
    "cat room size",
    "cat living space requirements",
    "indoor cat space calculator",
    "apartment cat space",
  ],
  variants: [
    {
      id: "indoor-space",
      name: "Indoor Space Requirements",
      description: "Calculate the space your indoor cats need",
      fields: [
        {
          name: "numberOfCats",
          label: "Number of Cats",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 15,
        },
        {
          name: "catSize",
          label: "Average Cat Size",
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
          name: "activityLevel",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Low (mostly sleeping)", value: "low" },
            { label: "Medium (average play)", value: "medium" },
            { label: "High (very active/young)", value: "high" },
          ],
          defaultValue: "medium",
        },
        {
          name: "hasVerticalSpace",
          label: "Vertical Space Available",
          type: "select",
          options: [
            { label: "Yes (shelves, cat trees, etc.)", value: "yes" },
            { label: "No (floor level only)", value: "no" },
          ],
          defaultValue: "yes",
        },
      ],
      calculate: (inputs) => {
        const numberOfCats = inputs.numberOfCats as number;
        const catSize = inputs.catSize as string;
        const activityLevel = inputs.activityLevel as string;
        const hasVerticalSpace = inputs.hasVerticalSpace as string;
        if (!numberOfCats) return null;

        // Base space per cat: ~18 sq ft minimum
        let baseSpacePerCat: number;
        if (catSize === "xlarge") baseSpacePerCat = 25;
        else if (catSize === "large") baseSpacePerCat = 22;
        else if (catSize === "small") baseSpacePerCat = 15;
        else baseSpacePerCat = 18;

        // Activity level multiplier
        let activityMultiplier = 1.0;
        if (activityLevel === "high") activityMultiplier = 1.4;
        else if (activityLevel === "low") activityMultiplier = 0.85;

        // Vertical space reduces floor space needs by ~20%
        const verticalReduction = hasVerticalSpace === "yes" ? 0.8 : 1.0;

        const totalSpace = Math.round(
          numberOfCats * baseSpacePerCat * activityMultiplier * verticalReduction
        );

        // Additional space recommendations
        const litterBoxArea = (numberOfCats + 1) * 4; // ~4 sq ft per litter box
        const feedingStationArea = numberOfCats * 2;
        const playArea = Math.round(totalSpace * 0.25);

        const litterBoxes = numberOfCats + 1;
        const scratchingPosts = Math.max(numberOfCats, 2);
        const windowPerches = Math.max(1, Math.ceil(numberOfCats / 2));

        return {
          primary: {
            label: "Minimum Total Space",
            value: `${formatNumber(totalSpace)} sq ft`,
          },
          details: [
            { label: "Space Per Cat", value: `${formatNumber(Math.round(totalSpace / numberOfCats))} sq ft` },
            { label: "Litter Box Area Needed", value: `${formatNumber(litterBoxArea)} sq ft` },
            { label: "Feeding Station Area", value: `${formatNumber(feedingStationArea)} sq ft` },
            { label: "Play Area Recommended", value: `${formatNumber(playArea)} sq ft` },
            { label: "Litter Boxes Needed", value: `${litterBoxes}` },
            { label: "Scratching Posts", value: `${scratchingPosts}` },
            { label: "Window Perches", value: `${windowPerches}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cat-tree-size-calculator", "cat-litter-box-calculator"],
  faq: [
    {
      question: "How much space does an indoor cat need?",
      answer:
        "Each indoor cat needs a minimum of approximately 18 square feet of living space, though more is always better. This should include separate areas for eating, sleeping, playing, and litter box use. Vertical space like cat shelves and trees can supplement floor space.",
    },
    {
      question: "Can I keep a cat in a studio apartment?",
      answer:
        "Yes, cats can live happily in studio apartments as long as you maximize vertical space with cat trees, shelves, and window perches. A studio of 400+ square feet can accommodate 1-2 cats comfortably with proper enrichment.",
    },
    {
      question: "What enrichment do indoor cats need?",
      answer:
        "Indoor cats need scratching posts, climbing structures, window perches for bird watching, interactive toys, hiding spots, and regular play sessions. Environmental enrichment helps prevent boredom, obesity, and behavioral issues.",
    },
  ],
  formula:
    "Min Space = Cats x Base Space per Cat x Activity Multiplier x Vertical Reduction",
};
