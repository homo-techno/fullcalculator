import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pondFishStockingCalculator: CalculatorDefinition = {
  slug: "pond-fish-stocking-calculator",
  title: "Pond Fish Stocking Calculator",
  description:
    "Free pond fish stocking calculator. Determine how many fish your garden or koi pond can support based on pond volume, surface area, and fish type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pond fish stocking",
    "koi pond calculator",
    "pond fish capacity",
    "garden pond fish",
    "how many fish in pond",
  ],
  variants: [
    {
      id: "pond-stocking",
      name: "Pond Fish Stocking",
      description: "Calculate how many fish your pond can support",
      fields: [
        {
          name: "pondVolume",
          label: "Pond Volume",
          type: "number",
          placeholder: "e.g. 1000",
          suffix: "gallons",
          min: 50,
          max: 50000,
        },
        {
          name: "pondSurfaceArea",
          label: "Surface Area",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "sq ft",
          min: 10,
          max: 5000,
        },
        {
          name: "fishType",
          label: "Primary Fish Type",
          type: "select",
          options: [
            { label: "Koi", value: "koi" },
            { label: "Goldfish / Comets", value: "goldfish" },
            { label: "Shubunkin", value: "shubunkin" },
            { label: "Mixed Pond Fish", value: "mixed" },
          ],
          defaultValue: "koi",
        },
        {
          name: "filtration",
          label: "Filtration System",
          type: "select",
          options: [
            { label: "No filtration (natural)", value: "none" },
            { label: "Basic pump and filter", value: "basic" },
            { label: "Good multi-stage filter", value: "good" },
            { label: "Excellent (multi-stage + UV + aeration)", value: "excellent" },
          ],
          defaultValue: "good",
        },
        {
          name: "pondDepth",
          label: "Average Pond Depth",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "feet",
          min: 1,
          max: 10,
        },
      ],
      calculate: (inputs) => {
        const pondVolume = inputs.pondVolume as number;
        const pondSurfaceArea = inputs.pondSurfaceArea as number;
        const fishType = inputs.fishType as string;
        const filtration = inputs.filtration as string;
        const pondDepth = inputs.pondDepth as number;
        if (!pondVolume || !pondSurfaceArea || !pondDepth) return null;

        // Stocking rates differ by fish type
        let gallonsPerFish: number;
        let avgAdultLength: number;

        switch (fishType) {
          case "koi":
            gallonsPerFish = 250; // Koi need lots of space
            avgAdultLength = 24;
            break;
          case "goldfish":
            gallonsPerFish = 50;
            avgAdultLength = 10;
            break;
          case "shubunkin":
            gallonsPerFish = 75;
            avgAdultLength = 12;
            break;
          case "mixed":
            gallonsPerFish = 100;
            avgAdultLength = 12;
            break;
          default:
            gallonsPerFish = 100;
            avgAdultLength = 12;
        }

        // Surface area rule: 1 inch of fish per 10 sq in of surface area
        const surfaceBasedCapacityInches = (pondSurfaceArea * 144) / 10;
        const surfaceBasedFish = Math.floor(surfaceBasedCapacityInches / avgAdultLength);

        // Volume-based capacity
        let filtrationMultiplier = 1.0;
        if (filtration === "none") filtrationMultiplier = 0.5;
        else if (filtration === "basic") filtrationMultiplier = 0.8;
        else if (filtration === "excellent") filtrationMultiplier = 1.25;

        const volumeBasedFish = Math.floor((pondVolume / gallonsPerFish) * filtrationMultiplier);

        // Use the lower of the two methods for safety
        const maxFish = Math.min(surfaceBasedFish, volumeBasedFish);
        const conservativeFish = Math.floor(maxFish * 0.75);

        // Winter considerations
        const canOverwinter = pondDepth >= 3 ? "Yes (deep enough)" : "Risk of freezing - consider bringing fish inside";

        // Aeration recommendation
        const aerationNeeded = maxFish > 5 || pondVolume > 500 ? "Recommended" : "Optional";

        return {
          primary: {
            label: "Maximum Fish",
            value: `${formatNumber(maxFish)} fish`,
          },
          details: [
            { label: "Conservative Stocking", value: `${formatNumber(conservativeFish)} fish` },
            { label: "Volume-Based Capacity", value: `${formatNumber(volumeBasedFish)} fish` },
            { label: "Surface-Based Capacity", value: `${formatNumber(surfaceBasedFish)} fish` },
            { label: "Overwinter Safe", value: canOverwinter },
            { label: "Aeration", value: aerationNeeded },
            { label: "Expected Adult Fish Size", value: `${avgAdultLength} inches` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fish-tank-stocking-calculator", "aquarium-filter-calculator"],
  faq: [
    {
      question: "How many koi can I have in my pond?",
      answer:
        "The general rule for koi is one fish per 250 gallons of water with good filtration. Koi grow large (up to 24+ inches) and are heavy waste producers. A 1,000-gallon pond can typically support 3-4 adult koi comfortably.",
    },
    {
      question: "How deep should a fish pond be?",
      answer:
        "A fish pond should be at least 2 feet deep for goldfish and 3 feet deep for koi. In cold climates where the surface freezes, 4+ feet depth ensures fish can safely overwinter at the bottom where water stays above freezing.",
    },
    {
      question: "Do I need a filter for my pond?",
      answer:
        "Yes, unless you have a very large, lightly stocked natural pond with plenty of aquatic plants. Filtration removes waste, maintains water quality, and supports healthy fish. A multi-stage filter with biological, mechanical, and UV components is ideal.",
    },
  ],
  formula:
    "Max Fish = min(Volume / Gallons per Fish, Surface Capacity) x Filtration Factor",
};
