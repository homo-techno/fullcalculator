import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const birdCageSizeCalculator: CalculatorDefinition = {
  slug: "bird-cage-size-calculator",
  title: "Bird Cage Size Calculator",
  description:
    "Free bird cage size calculator. Find the minimum cage dimensions for your bird species based on size, number of birds, and veterinary guidelines.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "bird cage size calculator",
    "parrot cage size",
    "bird cage dimensions",
    "minimum bird cage size",
    "aviary size calculator",
  ],
  variants: [
    {
      id: "bySpecies",
      name: "Cage Size by Species",
      fields: [
        {
          name: "species",
          label: "Bird Species/Size",
          type: "select",
          options: [
            { label: "Finch / Canary", value: "finch" },
            { label: "Budgerigar (Parakeet)", value: "budgie" },
            { label: "Cockatiel", value: "cockatiel" },
            { label: "Conure / Lovebird", value: "conure" },
            { label: "African Grey / Amazon", value: "african_grey" },
            { label: "Cockatoo (Medium)", value: "cockatoo" },
            { label: "Macaw (Large)", value: "macaw" },
          ],
        },
        {
          name: "birdCount",
          label: "Number of Birds",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 20,
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const species = (inputs.species as string) || "budgie";
        const birdCount = (inputs.birdCount as number) || 1;
        if (birdCount <= 0) return null;

        // Minimum cage dimensions in inches (W x D x H) for single bird
        const specs: Record<string, { w: number; d: number; h: number; barSpacing: string; wingspan: string }> = {
          finch: { w: 18, d: 18, h: 24, barSpacing: "1/4 - 1/2 inch", wingspan: "6-8 inches" },
          budgie: { w: 18, d: 18, h: 24, barSpacing: "1/2 inch", wingspan: "10-12 inches" },
          cockatiel: { w: 24, d: 18, h: 24, barSpacing: "1/2 - 5/8 inch", wingspan: "14-16 inches" },
          conure: { w: 24, d: 24, h: 30, barSpacing: "5/8 - 3/4 inch", wingspan: "14-18 inches" },
          african_grey: { w: 36, d: 24, h: 48, barSpacing: "3/4 - 1 inch", wingspan: "18-20 inches" },
          cockatoo: { w: 36, d: 24, h: 48, barSpacing: "1 - 1.5 inches", wingspan: "20-26 inches" },
          macaw: { w: 48, d: 36, h: 60, barSpacing: "1 - 1.5 inches", wingspan: "36-48 inches" },
        };

        const spec = specs[species] || specs.budgie;
        // Each additional bird adds ~50% to width
        const additionalBirds = Math.max(0, birdCount - 1);
        const adjW = spec.w + additionalBirds * spec.w * 0.5;
        const adjD = spec.d;
        const adjH = spec.h;
        const cubicInches = adjW * adjD * adjH;
        const cubicFeet = cubicInches / 1728;

        return {
          primary: {
            label: "Minimum Cage Size",
            value: `${formatNumber(adjW, 0)}" W x ${formatNumber(adjD, 0)}" D x ${formatNumber(adjH, 0)}" H`,
          },
          details: [
            { label: "Volume", value: formatNumber(cubicFeet, 1) + " cubic feet" },
            { label: "Bar Spacing", value: spec.barSpacing },
            { label: "Wingspan", value: spec.wingspan },
            { label: "Number of Birds", value: String(birdCount) },
            {
              label: "Perches Needed",
              value: String(Math.max(2, birdCount * 2)) + " minimum",
            },
            {
              label: "Food/Water Dishes",
              value: birdCount <= 2 ? "2 of each" : formatNumber(birdCount, 0) + " of each",
            },
            {
              label: "Note",
              value: "Wider cages are better than taller. Birds fly horizontally, not vertically.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hamster-cage-size-calculator", "rabbit-hutch-size-calculator", "reptile-enclosure-calculator"],
  faq: [
    {
      question: "What size cage does a budgie need?",
      answer:
        "A single budgie needs a cage at least 18\" wide x 18\" deep x 24\" tall, but bigger is always better. The cage should be wide enough for the bird to fully extend its wings and fly short distances. For two budgies, increase the width to at least 30 inches.",
    },
    {
      question: "Why is cage width more important than height?",
      answer:
        "Birds fly horizontally, not vertically. A wide cage allows more natural flight patterns and exercise. While height is nice for climbing species like parrots, width should be the priority when choosing a cage. The minimum width should be at least 2-3 times the bird's wingspan.",
    },
    {
      question: "What bar spacing is safe for my bird?",
      answer:
        "Bar spacing must be narrow enough that your bird cannot fit its head through. Small birds (finches, budgies) need 1/4 to 1/2 inch spacing. Medium birds (cockatiels, conures) need 1/2 to 3/4 inch. Large birds (macaws, cockatoos) need 3/4 to 1.5 inches. Incorrect spacing can cause injury or escape.",
    },
  ],
  formula:
    "Base minimum cage size varies by species. Additional birds add ~50% to cage width per bird. Bar spacing must be appropriate for bird size to prevent head entrapment. Width should be at least 2-3x the bird's wingspan.",
};
