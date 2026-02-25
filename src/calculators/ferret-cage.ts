import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ferretCageCalculator: CalculatorDefinition = {
  slug: "ferret-cage-calculator",
  title: "Ferret Cage Size Calculator",
  description:
    "Free ferret cage size calculator. Determine the ideal multi-level cage dimensions for your ferrets based on the number of ferrets and available out-of-cage time.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "ferret cage size",
    "ferret cage calculator",
    "ferret enclosure",
    "ferret nation cage",
    "ferret habitat size",
  ],
  variants: [
    {
      id: "cage-size",
      name: "Ferret Cage Size",
      description: "Calculate the minimum cage size for your ferrets",
      fields: [
        {
          name: "numberOfFerrets",
          label: "Number of Ferrets",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 8,
        },
        {
          name: "outOfCageTime",
          label: "Daily Out-of-Cage Time",
          type: "select",
          options: [
            { label: "Minimum (1-2 hours)", value: "min" },
            { label: "Moderate (2-4 hours)", value: "mod" },
            { label: "Extensive (4+ hours)", value: "ext" },
          ],
          defaultValue: "mod",
        },
        {
          name: "cageStyle",
          label: "Cage Style",
          type: "select",
          options: [
            { label: "Multi-level (recommended)", value: "multi" },
            { label: "Single-level", value: "single" },
          ],
          defaultValue: "multi",
        },
      ],
      calculate: (inputs) => {
        const numberOfFerrets = inputs.numberOfFerrets as number;
        const outOfCageTime = inputs.outOfCageTime as string;
        const cageStyle = inputs.cageStyle as string;
        if (!numberOfFerrets) return null;

        // Minimum floor space: 24 x 24 x 18 inches per ferret (single level)
        // Multi-level adds vertical space, effectively doubling usable area
        let baseFloorSqIn = 24 * 24; // 576 sq in per ferret
        const totalFloorSqIn = baseFloorSqIn * numberOfFerrets;

        // Out-of-cage adjustment
        let cageMultiplier = 1.0;
        if (outOfCageTime === "min") cageMultiplier = 1.4;
        else if (outOfCageTime === "ext") cageMultiplier = 0.85;

        const adjustedSqIn = Math.round(totalFloorSqIn * cageMultiplier);

        // Convert to dimensions (roughly 2:1 ratio)
        const cageLength = Math.round(Math.sqrt(adjustedSqIn * 2));
        const cageWidth = Math.round(adjustedSqIn / cageLength);

        // Height and levels
        let levels: number;
        let cageHeight: number;
        if (cageStyle === "multi") {
          levels = Math.max(2, Math.min(numberOfFerrets + 1, 5));
          cageHeight = levels * 18;
        } else {
          levels = 1;
          cageHeight = 24;
        }

        const totalUsableArea = cageStyle === "multi"
          ? adjustedSqIn * levels
          : adjustedSqIn;

        const hammocks = Math.max(numberOfFerrets, 2);
        const litterBoxes = Math.max(Math.ceil(numberOfFerrets / 2), 1);
        const hideSpots = Math.max(numberOfFerrets, 2);

        return {
          primary: {
            label: "Minimum Cage Size",
            value: `${cageLength} x ${cageWidth} x ${cageHeight} inches`,
          },
          details: [
            { label: "Floor Area", value: `${formatNumber(adjustedSqIn)} sq inches` },
            { label: "Total Usable Area (all levels)", value: `${formatNumber(totalUsableArea)} sq inches` },
            { label: "Number of Levels", value: `${levels}` },
            { label: "Hammocks/Sleep Spots", value: `${hammocks}` },
            { label: "Litter Boxes in Cage", value: `${litterBoxes}` },
            { label: "Hiding Spots", value: `${hideSpots}` },
            { label: "Bar Spacing (max)", value: "1 inch" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rabbit-enclosure-calculator", "guinea-pig-cage-calculator"],
  faq: [
    {
      question: "How big should a ferret cage be?",
      answer:
        "A single ferret needs a cage that is at least 24 x 24 x 18 inches per level, with at least 2 levels. Multi-level cages are strongly recommended as ferrets love to climb. For each additional ferret, add approximately the same floor space.",
    },
    {
      question: "How much out-of-cage time do ferrets need?",
      answer:
        "Ferrets need a minimum of 2-4 hours of supervised out-of-cage time daily. They are extremely active, curious animals that need exercise and mental stimulation. The play area should be ferret-proofed to prevent escapes and access to dangerous items.",
    },
    {
      question: "Can ferrets live alone?",
      answer:
        "While ferrets can live alone with sufficient human interaction, they are highly social and generally do better in pairs or small groups. A bonded pair will play together, groom each other, and sleep together, enriching their quality of life.",
    },
  ],
  formula:
    "Floor Area = 576 sq in per ferret x Out-of-Cage Multiplier | Levels = max(2, ferrets + 1)",
};
