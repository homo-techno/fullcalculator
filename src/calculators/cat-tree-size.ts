import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const catTreeSizeCalculator: CalculatorDefinition = {
  slug: "cat-tree-size-calculator",
  title: "Cat Tree Size Calculator",
  description:
    "Free cat tree size calculator. Determine the ideal cat tree height, number of platforms, and features based on your cats and living space.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cat tree size",
    "cat tree calculator",
    "cat tower height",
    "cat tree for multiple cats",
    "cat furniture size",
  ],
  variants: [
    {
      id: "cat-tree-size",
      name: "Cat Tree Size",
      description: "Calculate the ideal cat tree for your home and cats",
      fields: [
        {
          name: "numberOfCats",
          label: "Number of Cats",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 10,
        },
        {
          name: "ceilingHeight",
          label: "Ceiling Height",
          type: "number",
          placeholder: "e.g. 96",
          suffix: "inches",
          min: 72,
          max: 144,
        },
        {
          name: "catAge",
          label: "Cat Age Range",
          type: "select",
          options: [
            { label: "Kitten (under 1 year)", value: "kitten" },
            { label: "Young Adult (1-7 years)", value: "young" },
            { label: "Adult (7-11 years)", value: "adult" },
            { label: "Senior (11+ years)", value: "senior" },
          ],
          defaultValue: "young",
        },
        {
          name: "activityLevel",
          label: "Cat Activity Level",
          type: "select",
          options: [
            { label: "Low (couch potato)", value: "low" },
            { label: "Medium (average)", value: "medium" },
            { label: "High (very active/climber)", value: "high" },
          ],
          defaultValue: "medium",
        },
        {
          name: "availableFloorSpace",
          label: "Available Floor Space",
          type: "number",
          placeholder: "e.g. 16",
          suffix: "sq ft",
          min: 2,
          max: 50,
        },
      ],
      calculate: (inputs) => {
        const numberOfCats = inputs.numberOfCats as number;
        const ceilingHeight = inputs.ceilingHeight as number;
        const catAge = inputs.catAge as string;
        const activityLevel = inputs.activityLevel as string;
        const availableFloorSpace = inputs.availableFloorSpace as number;
        if (!numberOfCats || !ceilingHeight || !availableFloorSpace) return null;

        // Height recommendation
        let heightFactor: number;
        if (catAge === "senior") {
          heightFactor = 0.4;
        } else if (catAge === "kitten") {
          heightFactor = 0.5;
        } else if (activityLevel === "high") {
          heightFactor = 0.85;
        } else if (activityLevel === "medium") {
          heightFactor = 0.65;
        } else {
          heightFactor = 0.5;
        }

        const recommendedHeight = Math.round(ceilingHeight * heightFactor);

        // Platforms: at least 1 per cat + 1 extra
        const minPlatforms = numberOfCats + 1;
        const recommendedPlatforms = Math.min(minPlatforms + (activityLevel === "high" ? 2 : 0), 10);

        // Scratching posts
        const scratchingPosts = Math.max(numberOfCats, 2);

        // Base size recommendation
        const minBaseWidth = Math.max(18, 18 + (numberOfCats - 1) * 6);
        const minBaseDepth = Math.max(18, 18 + (numberOfCats - 1) * 4);

        // Hideaway spots
        const hideaways = Math.max(1, Math.floor(numberOfCats * 0.75));

        return {
          primary: {
            label: "Recommended Tree Height",
            value: `${formatNumber(recommendedHeight)} inches`,
          },
          details: [
            { label: "Minimum Platforms/Perches", value: `${recommendedPlatforms}` },
            { label: "Scratching Posts", value: `${scratchingPosts}` },
            { label: "Hideaway Spots", value: `${hideaways}` },
            { label: "Minimum Base Size", value: `${minBaseWidth} x ${minBaseDepth} inches` },
            { label: "Height in Feet", value: `${formatNumber(recommendedHeight / 12, 1)} ft` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cat-indoor-space-calculator", "cat-litter-box-calculator"],
  faq: [
    {
      question: "How tall should a cat tree be?",
      answer:
        "A cat tree should generally be 50-85% of your ceiling height for active cats. Senior cats and kittens benefit from shorter trees (40-50% of ceiling height) with easier access to platforms. Most cats enjoy being able to survey their territory from a high vantage point.",
    },
    {
      question: "How many platforms does a cat tree need for multiple cats?",
      answer:
        "For multiple cats, aim for at least one platform per cat plus one extra. This helps reduce competition and gives each cat their own space. Active cats benefit from additional climbing platforms.",
    },
    {
      question: "Where should I place a cat tree?",
      answer:
        "Place cat trees near windows for outdoor viewing, in social areas where the family spends time, or in corners where cats can observe the room. Avoid isolated rooms where cats rarely go.",
    },
  ],
  formula:
    "Recommended Height = Ceiling Height x Activity Factor | Platforms = Number of Cats + 1 | Base Size = 18 + (cats - 1) x 6 inches",
};
