import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const birdCageCalculator: CalculatorDefinition = {
  slug: "bird-cage-calculator",
  title: "Bird Cage Size Calculator",
  description:
    "Free bird cage size calculator. Find the minimum cage dimensions for your bird species, number of birds, and whether you plan to provide out-of-cage time.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "bird cage size",
    "bird cage calculator",
    "parrot cage size",
    "parakeet cage dimensions",
    "bird enclosure size",
  ],
  variants: [
    {
      id: "cage-size",
      name: "Bird Cage Size",
      description: "Calculate the minimum cage size for your birds",
      fields: [
        {
          name: "birdSpecies",
          label: "Bird Species / Size",
          type: "select",
          options: [
            { label: "Finch / Canary (small)", value: "finch" },
            { label: "Budgie / Parakeet", value: "budgie" },
            { label: "Cockatiel / Lovebird", value: "cockatiel" },
            { label: "Conure / Small Parrot", value: "conure" },
            { label: "African Grey / Amazon", value: "african_grey" },
            { label: "Cockatoo / Macaw (large)", value: "macaw" },
          ],
          defaultValue: "budgie",
        },
        {
          name: "numberOfBirds",
          label: "Number of Birds",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 20,
        },
        {
          name: "outOfCageTime",
          label: "Daily Out-of-Cage Time",
          type: "select",
          options: [
            { label: "None (cage only)", value: "none" },
            { label: "1-2 hours", value: "some" },
            { label: "3+ hours", value: "lots" },
          ],
          defaultValue: "some",
        },
      ],
      calculate: (inputs) => {
        const birdSpecies = inputs.birdSpecies as string;
        const numberOfBirds = inputs.numberOfBirds as number;
        const outOfCageTime = inputs.outOfCageTime as string;
        if (!numberOfBirds) return null;

        // Base cage dimensions (width x depth x height in inches) for one bird
        let baseWidth: number, baseDepth: number, baseHeight: number;
        let barSpacing: string;
        let perchDiameter: string;

        switch (birdSpecies) {
          case "finch":
            baseWidth = 24; baseDepth = 14; baseHeight = 18;
            barSpacing = "1/4 to 1/2 inch";
            perchDiameter = "3/8 inch";
            break;
          case "budgie":
            baseWidth = 24; baseDepth = 18; baseHeight = 24;
            barSpacing = "1/2 inch";
            perchDiameter = "1/2 inch";
            break;
          case "cockatiel":
            baseWidth = 30; baseDepth = 18; baseHeight = 30;
            barSpacing = "5/8 to 3/4 inch";
            perchDiameter = "5/8 inch";
            break;
          case "conure":
            baseWidth = 36; baseDepth = 24; baseHeight = 36;
            barSpacing = "3/4 inch";
            perchDiameter = "3/4 inch";
            break;
          case "african_grey":
            baseWidth = 36; baseDepth = 28; baseHeight = 48;
            barSpacing = "3/4 to 1 inch";
            perchDiameter = "1 inch";
            break;
          case "macaw":
            baseWidth = 48; baseDepth = 36; baseHeight = 60;
            barSpacing = "1 to 1.5 inches";
            perchDiameter = "1.5 inches";
            break;
          default:
            baseWidth = 24; baseDepth = 18; baseHeight = 24;
            barSpacing = "1/2 inch";
            perchDiameter = "1/2 inch";
        }

        // Scale for multiple birds
        const scaleFactor = 1 + (numberOfBirds - 1) * 0.5;
        let adjWidth = Math.round(baseWidth * scaleFactor);
        let adjDepth = Math.round(baseDepth * (1 + (numberOfBirds - 1) * 0.3));
        let adjHeight = baseHeight;

        // Adjust for out-of-cage time
        if (outOfCageTime === "none") {
          adjWidth = Math.round(adjWidth * 1.3);
          adjDepth = Math.round(adjDepth * 1.2);
          adjHeight = Math.round(adjHeight * 1.2);
        }

        const numPerches = Math.max(2, numberOfBirds + 1);
        const numFoodBowls = Math.max(2, numberOfBirds);

        return {
          primary: {
            label: "Minimum Cage Size",
            value: `${adjWidth} x ${adjDepth} x ${adjHeight} inches`,
          },
          details: [
            { label: "Width", value: `${adjWidth} inches` },
            { label: "Depth", value: `${adjDepth} inches` },
            { label: "Height", value: `${adjHeight} inches` },
            { label: "Bar Spacing", value: barSpacing },
            { label: "Perch Diameter", value: perchDiameter },
            { label: "Number of Perches", value: `${numPerches}` },
            { label: "Food/Water Bowls", value: `${numFoodBowls}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fish-tank-stocking-calculator", "rabbit-enclosure-calculator"],
  faq: [
    {
      question: "What size cage does a parakeet need?",
      answer:
        "A single parakeet needs a minimum cage of 24 x 18 x 24 inches (width x depth x height). Wider is better than taller since birds fly horizontally. For each additional bird, increase the width by about 50%.",
    },
    {
      question: "Is height or width more important for a bird cage?",
      answer:
        "Width is more important than height for most bird species. Birds fly horizontally, not vertically, so a wider cage provides more useful flight space. Height is mainly important for climbing species like macaws and cockatoos.",
    },
    {
      question: "Why does bar spacing matter?",
      answer:
        "Incorrect bar spacing can be dangerous. If bars are too wide, small birds can squeeze through and escape or get stuck. If bars are too narrow for large birds, they may not be able to climb comfortably. Always match bar spacing to your bird's size.",
    },
  ],
  formula:
    "Cage Size = Base Size x Scale Factor (for multiple birds) x Out-of-Cage Adjustment",
};
