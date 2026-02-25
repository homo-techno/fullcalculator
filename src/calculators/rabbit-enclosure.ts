import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rabbitEnclosureCalculator: CalculatorDefinition = {
  slug: "rabbit-enclosure-calculator",
  title: "Rabbit Enclosure Size Calculator",
  description:
    "Free rabbit enclosure size calculator. Determine the ideal hutch, pen, or cage size for your rabbits based on breed size and number of bunnies.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "rabbit enclosure size",
    "rabbit cage calculator",
    "rabbit hutch size",
    "bunny cage dimensions",
    "rabbit pen size",
  ],
  variants: [
    {
      id: "enclosure-size",
      name: "Rabbit Enclosure Size",
      description: "Calculate the minimum enclosure size for your rabbits",
      fields: [
        {
          name: "rabbitSize",
          label: "Rabbit Breed Size",
          type: "select",
          options: [
            { label: "Small (under 4 lbs - Netherland Dwarf)", value: "small" },
            { label: "Medium (4-8 lbs - Holland Lop, Mini Rex)", value: "medium" },
            { label: "Large (8-12 lbs - New Zealand, Rex)", value: "large" },
            { label: "Giant (over 12 lbs - Flemish Giant)", value: "giant" },
          ],
          defaultValue: "medium",
        },
        {
          name: "numberOfRabbits",
          label: "Number of Rabbits",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 10,
        },
        {
          name: "enclosureType",
          label: "Enclosure Type",
          type: "select",
          options: [
            { label: "Indoor Cage/Pen", value: "indoor" },
            { label: "Outdoor Hutch", value: "outdoor" },
            { label: "Free-roam Room", value: "freeroom" },
          ],
          defaultValue: "indoor",
        },
        {
          name: "exerciseTime",
          label: "Daily Exercise/Free-Roam Time",
          type: "select",
          options: [
            { label: "None (enclosure only)", value: "none" },
            { label: "1-3 hours", value: "some" },
            { label: "3+ hours", value: "lots" },
          ],
          defaultValue: "some",
        },
      ],
      calculate: (inputs) => {
        const rabbitSize = inputs.rabbitSize as string;
        const numberOfRabbits = inputs.numberOfRabbits as number;
        const enclosureType = inputs.enclosureType as string;
        const exerciseTime = inputs.exerciseTime as string;
        if (!numberOfRabbits) return null;

        // Base enclosure area per rabbit in sq ft (RSPCA guidelines)
        let baseArea: number; // sq ft
        let minHeight: number; // inches
        if (rabbitSize === "small") {
          baseArea = 12;
          minHeight = 18;
        } else if (rabbitSize === "medium") {
          baseArea = 16;
          minHeight = 24;
        } else if (rabbitSize === "large") {
          baseArea = 20;
          minHeight = 28;
        } else {
          baseArea = 28;
          minHeight = 36;
        }

        // Additional rabbits need ~60% extra each
        const totalBaseArea = baseArea + (numberOfRabbits - 1) * baseArea * 0.6;

        // Exercise time adjustment
        let exerciseMultiplier = 1.0;
        if (exerciseTime === "none") exerciseMultiplier = 1.5;
        else if (exerciseTime === "lots") exerciseMultiplier = 0.85;

        const totalArea = Math.round(totalBaseArea * exerciseMultiplier);

        // Convert to dimensions
        const length = Math.round(Math.sqrt(totalArea * 1.5) * 12); // inches, 3:2 ratio
        const width = Math.round((totalArea * 144) / length); // inches

        // Exercise run area
        const exerciseRunArea = Math.round(totalArea * 3);

        // Outdoor hutch adds insulation needs
        const outdoorNote =
          enclosureType === "outdoor"
            ? "Add weatherproofing, insulation, and predator-proof mesh"
            : "";

        return {
          primary: {
            label: "Minimum Enclosure Area",
            value: `${formatNumber(totalArea)} sq ft`,
          },
          details: [
            { label: "Recommended Dimensions", value: `${length} x ${width} inches` },
            { label: "Minimum Height", value: `${minHeight} inches` },
            { label: "Exercise Run Area", value: `${formatNumber(exerciseRunArea)} sq ft` },
            { label: "Hay Rack Needed", value: "Yes" },
            { label: "Hiding Spots", value: `${Math.max(numberOfRabbits, 2)}` },
            { label: "Litter Boxes", value: `${numberOfRabbits}` },
          ],
          note: outdoorNote || undefined,
        };
      },
    },
  ],
  relatedSlugs: ["guinea-pig-cage-calculator", "hamster-wheel-size-calculator"],
  faq: [
    {
      question: "How big should a rabbit enclosure be?",
      answer:
        "A rabbit enclosure should be at least 4 times the size of the rabbit when stretched out. For a medium rabbit, this means at least 12-16 square feet of living space, plus access to a larger exercise area of 32+ square feet.",
    },
    {
      question: "Can rabbits live in a cage full time?",
      answer:
        "Rabbits should not be confined to a small cage 24/7. They need several hours of exercise daily in a larger space. If enclosure-only living is necessary, the enclosure must be significantly larger to compensate for the lack of free-roam time.",
    },
    {
      question: "Do rabbits need to be in pairs?",
      answer:
        "Rabbits are social animals and generally thrive in pairs or groups. A bonded pair of spayed/neutered rabbits will be happier and healthier than a solo rabbit. If keeping a single rabbit, extra human interaction is important.",
    },
  ],
  formula:
    "Base Area = Size Factor per Rabbit | Total Area = Base + (Additional Rabbits x 60%) x Exercise Multiplier",
};
