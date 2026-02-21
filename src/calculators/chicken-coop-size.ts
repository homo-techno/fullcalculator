import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chickenCoopSizeCalculator: CalculatorDefinition = {
  slug: "chicken-coop-size-calculator",
  title: "Chicken Coop Size Calculator",
  description:
    "Free chicken coop size calculator. Determine the right coop and run size based on flock size, chicken breed, and housing type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "chicken coop size calculator",
    "how big should a chicken coop be",
    "chicken run size",
    "backyard chicken coop",
    "poultry housing calculator",
  ],
  variants: [
    {
      id: "coopSize",
      name: "Coop & Run Size",
      fields: [
        {
          name: "chickenCount",
          label: "Number of Chickens",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          max: 500,
        },
        {
          name: "breed",
          label: "Breed Size",
          type: "select",
          options: [
            { label: "Bantam (small breeds)", value: "bantam" },
            { label: "Standard (Rhode Island Red, Plymouth Rock)", value: "standard" },
            { label: "Large (Orpington, Brahma, Jersey Giant)", value: "large" },
          ],
        },
        {
          name: "housingType",
          label: "Housing Type",
          type: "select",
          options: [
            { label: "Coop + Outdoor Run", value: "coop_run" },
            { label: "Free Range (coop for night)", value: "free_range" },
            { label: "Coop Only (no outdoor access)", value: "coop_only" },
          ],
        },
      ],
      calculate: (inputs) => {
        const chickenCount = inputs.chickenCount as number;
        const breed = (inputs.breed as string) || "standard";
        const housingType = (inputs.housingType as string) || "coop_run";
        if (!chickenCount || chickenCount <= 0) return null;

        // Square feet per chicken inside coop
        const coopSqFtPer: Record<string, number> = {
          bantam: 2,
          standard: 4,
          large: 5,
        };

        // Square feet per chicken in run
        const runSqFtPer: Record<string, number> = {
          bantam: 8,
          standard: 10,
          large: 12,
        };

        const sqFtPerBird = coopSqFtPer[breed] || 4;
        let coopSqFt = chickenCount * sqFtPerBird;

        // If coop only, birds need more indoor space
        if (housingType === "coop_only") {
          coopSqFt = chickenCount * (sqFtPerBird * 2.5);
        }

        const runSqFt =
          housingType === "free_range"
            ? 0
            : chickenCount * (runSqFtPer[breed] || 10);

        // Nesting boxes: 1 per 3-4 chickens
        const nestBoxes = Math.max(1, Math.ceil(chickenCount / 4));

        // Roost space: 8-12 inches per standard chicken
        const roostInchPer = breed === "bantam" ? 6 : breed === "large" ? 12 : 8;
        const roostFeet = (chickenCount * roostInchPer) / 12;

        // Ventilation: 1 sq ft per 10 sq ft of floor
        const ventSqFt = coopSqFt / 10;

        // Feeder/waterer space
        const feederInches = chickenCount * 4; // 4 inches per bird

        return {
          primary: {
            label: "Coop Floor Space",
            value: formatNumber(coopSqFt, 0) + " sq ft",
          },
          details: [
            {
              label: "Run Area",
              value:
                housingType === "free_range"
                  ? "Free range (250+ sq ft per bird ideal)"
                  : formatNumber(runSqFt, 0) + " sq ft",
            },
            { label: "Total Covered Area", value: formatNumber(coopSqFt + runSqFt, 0) + " sq ft" },
            { label: "Nesting Boxes", value: nestBoxes + " boxes (1 per 3-4 hens)" },
            { label: "Roost Space", value: formatNumber(roostFeet, 1) + " feet of roost bar" },
            { label: "Ventilation", value: formatNumber(ventSqFt, 1) + " sq ft of vents" },
            { label: "Feeder Space", value: formatNumber(feederInches, 0) + " inches (4\" per bird)" },
            { label: "Sq Ft Per Bird (coop)", value: sqFtPerBird + (housingType === "coop_only" ? " x 2.5 (no run)" : "") + " sq ft" },
            {
              label: "Note",
              value: "More space reduces pecking, stress, and disease. These are minimums.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["egg-production-calculator", "livestock-water-calculator", "rabbit-hutch-size-calculator"],
  faq: [
    {
      question: "How much space does each chicken need in a coop?",
      answer:
        "Standard-sized chickens need at least 4 square feet per bird inside the coop and 10 square feet per bird in an outdoor run. Bantams need 2 sq ft inside and 8 sq ft in a run. Large breeds (Orpington, Brahma) need 5 sq ft inside and 12 sq ft in a run. These are minimums; more space is always better.",
    },
    {
      question: "How many nesting boxes do I need?",
      answer:
        "Provide 1 nesting box for every 3-4 hens. Nesting boxes should be about 12\" x 12\" x 12\" for standard breeds and placed in a darker, quieter area of the coop. Hens will often share boxes, so you don't need one per bird.",
    },
    {
      question: "How much roost space do chickens need?",
      answer:
        "Each standard chicken needs 8-10 inches of roost bar space. Large breeds need 12 inches, and bantams need about 6 inches. Roosts should be at least 2 feet off the ground and higher than the nesting boxes. Use 2-inch wide flat-sided roosts for best foot health.",
    },
  ],
  formula:
    "Coop sq ft = chickens x sq ft per bird (bantam 2, standard 4, large 5). Run sq ft = chickens x run sq ft per bird (bantam 8, standard 10, large 12). Nesting boxes = chickens / 4. Roost = chickens x inches per bird / 12.",
};
