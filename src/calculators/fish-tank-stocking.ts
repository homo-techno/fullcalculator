import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fishTankStockingCalculator: CalculatorDefinition = {
  slug: "fish-tank-stocking-calculator",
  title: "Fish Tank Stocking Calculator",
  description:
    "Free fish tank stocking calculator. Determine how many fish your aquarium can safely hold based on tank size, fish type, and filtration.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "fish tank stocking",
    "aquarium stocking calculator",
    "how many fish",
    "fish per gallon",
    "aquarium capacity",
  ],
  variants: [
    {
      id: "stocking-level",
      name: "Tank Stocking Level",
      description: "Calculate how many fish your tank can support",
      fields: [
        {
          name: "tankVolume",
          label: "Tank Volume",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "gallons",
          min: 1,
          max: 500,
        },
        {
          name: "fishType",
          label: "Primary Fish Type",
          type: "select",
          options: [
            { label: "Small Tropical (tetras, guppies)", value: "small" },
            { label: "Medium Tropical (mollies, gouramis)", value: "medium" },
            { label: "Large Tropical (angelfish, cichlids)", value: "large" },
            { label: "Goldfish", value: "goldfish" },
            { label: "Bettas", value: "betta" },
          ],
          defaultValue: "small",
        },
        {
          name: "filtration",
          label: "Filtration Quality",
          type: "select",
          options: [
            { label: "Basic (stock filter)", value: "basic" },
            { label: "Good (upgraded filter)", value: "good" },
            { label: "Excellent (oversized/canister)", value: "excellent" },
          ],
          defaultValue: "good",
        },
        {
          name: "livePlants",
          label: "Live Plants",
          type: "select",
          options: [
            { label: "No plants", value: "none" },
            { label: "Some plants", value: "some" },
            { label: "Heavily planted", value: "heavy" },
          ],
          defaultValue: "some",
        },
      ],
      calculate: (inputs) => {
        const tankVolume = inputs.tankVolume as number;
        const fishType = inputs.fishType as string;
        const filtration = inputs.filtration as string;
        const livePlants = inputs.livePlants as string;
        if (!tankVolume) return null;

        // Inches of fish per gallon rule (adjusted by fish type)
        let inchesPerGallon: number;
        let avgFishSize: number; // average adult size in inches
        if (fishType === "small") {
          inchesPerGallon = 1.0;
          avgFishSize = 1.5;
        } else if (fishType === "medium") {
          inchesPerGallon = 0.75;
          avgFishSize = 3;
        } else if (fishType === "large") {
          inchesPerGallon = 0.5;
          avgFishSize = 5;
        } else if (fishType === "goldfish") {
          inchesPerGallon = 0.3;
          avgFishSize = 6;
        } else {
          // betta
          inchesPerGallon = 0.4;
          avgFishSize = 2.5;
        }

        // Filtration bonus
        let filtrationMultiplier = 1.0;
        if (filtration === "excellent") filtrationMultiplier = 1.2;
        else if (filtration === "basic") filtrationMultiplier = 0.8;

        // Plants bonus
        let plantMultiplier = 1.0;
        if (livePlants === "heavy") plantMultiplier = 1.15;
        else if (livePlants === "none") plantMultiplier = 0.9;

        const totalInches = Math.round(
          tankVolume * inchesPerGallon * filtrationMultiplier * plantMultiplier
        );
        const maxFish = Math.floor(totalInches / avgFishSize);

        // Water change recommendations
        const waterChangePercent = filtration === "excellent" ? 20 : filtration === "good" ? 25 : 30;
        const waterChangeGallons = Math.round(tankVolume * (waterChangePercent / 100));

        return {
          primary: {
            label: "Maximum Fish",
            value: `${formatNumber(maxFish)} fish`,
          },
          details: [
            { label: "Total Fish Inches Capacity", value: `${formatNumber(totalInches)} inches` },
            { label: "Average Fish Size (adult)", value: `${avgFishSize} inches` },
            { label: "Conservative Stocking", value: `${formatNumber(Math.floor(maxFish * 0.75))} fish` },
            { label: "Weekly Water Change", value: `${waterChangePercent}% (${waterChangeGallons} gallons)` },
            { label: "Effective Tank Volume", value: `${formatNumber(Math.round(tankVolume * 0.9))} gallons (after decor)` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["aquarium-heater-calculator", "aquarium-filter-calculator"],
  faq: [
    {
      question: "What is the one inch per gallon rule?",
      answer:
        "The one inch per gallon rule is a general guideline that says you can keep one inch of fish per gallon of water. While useful as a starting point, it has limitations as it doesn't account for fish body mass, waste production, or specific species needs.",
    },
    {
      question: "Can I stock my tank to the maximum?",
      answer:
        "It is generally better to stock conservatively (about 75% of maximum) to maintain better water quality, reduce stress, and allow room for growth. Overstocking leads to ammonia spikes, disease, and aggression.",
    },
    {
      question: "How long should I wait before adding fish to a new tank?",
      answer:
        "You should cycle your aquarium for 4-6 weeks before adding fish. This allows beneficial bacteria to establish. Add fish gradually (a few at a time over several weeks) to avoid overwhelming the biological filtration.",
    },
  ],
  formula:
    "Max Inches = Tank Volume x Inches per Gallon x Filtration Factor x Plant Factor | Max Fish = Total Inches / Avg Fish Size",
};
