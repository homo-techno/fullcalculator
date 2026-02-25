import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const guineaPigCageCalculator: CalculatorDefinition = {
  slug: "guinea-pig-cage-calculator",
  title: "Guinea Pig Cage Size Calculator",
  description:
    "Free guinea pig cage size calculator. Find the minimum cage dimensions for your guinea pigs based on the number of piggies, breed size, and cage style.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "guinea pig cage size",
    "guinea pig cage calculator",
    "C&C cage size",
    "guinea pig enclosure",
    "cavy cage dimensions",
  ],
  variants: [
    {
      id: "cage-size",
      name: "Guinea Pig Cage Size",
      description: "Calculate the minimum cage size for your guinea pigs",
      fields: [
        {
          name: "numberOfPigs",
          label: "Number of Guinea Pigs",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 10,
        },
        {
          name: "pigSize",
          label: "Breed Size",
          type: "select",
          options: [
            { label: "Small (Abyssinian, American)", value: "small" },
            { label: "Medium (Peruvian, Silkie)", value: "medium" },
            { label: "Large (Texel, Cuy)", value: "large" },
          ],
          defaultValue: "medium",
        },
        {
          name: "cageType",
          label: "Cage Type",
          type: "select",
          options: [
            { label: "C&C Grid Cage", value: "cnc" },
            { label: "Store-bought Cage", value: "store" },
            { label: "Custom Enclosure", value: "custom" },
          ],
          defaultValue: "cnc",
        },
        {
          name: "hasFloorTime",
          label: "Daily Floor Time",
          type: "select",
          options: [
            { label: "No floor time", value: "none" },
            { label: "Some (1-2 hours)", value: "some" },
            { label: "Lots (3+ hours)", value: "lots" },
          ],
          defaultValue: "some",
        },
      ],
      calculate: (inputs) => {
        const numberOfPigs = inputs.numberOfPigs as number;
        const pigSize = inputs.pigSize as string;
        const cageType = inputs.cageType as string;
        const hasFloorTime = inputs.hasFloorTime as string;
        if (!numberOfPigs) return null;

        // Minimum sq ft per Humane Society / Guinea Lynx guidelines
        let baseSqFt: number;
        if (numberOfPigs === 1) baseSqFt = 7.5;
        else if (numberOfPigs === 2) baseSqFt = 10.5;
        else if (numberOfPigs === 3) baseSqFt = 13;
        else baseSqFt = 13 + (numberOfPigs - 3) * 3;

        // Size adjustment
        let sizeMultiplier = 1.0;
        if (pigSize === "large") sizeMultiplier = 1.2;
        else if (pigSize === "small") sizeMultiplier = 0.95;

        // Floor time adjustment
        let floorMultiplier = 1.0;
        if (hasFloorTime === "none") floorMultiplier = 1.25;
        else if (hasFloorTime === "lots") floorMultiplier = 0.9;

        const totalSqFt = Math.round(baseSqFt * sizeMultiplier * floorMultiplier * 10) / 10;
        const totalSqIn = Math.round(totalSqFt * 144);

        // C&C grid dimensions (each grid is 14x14 inches)
        let cncGrids = "";
        if (cageType === "cnc") {
          const gridsLong = Math.ceil(Math.sqrt(totalSqIn / 196) * 1.5);
          const gridsWide = Math.ceil(totalSqIn / (gridsLong * 196));
          cncGrids = `${gridsLong} x ${gridsWide} grids`;
        }

        // Recommended dimensions (2:1 ratio)
        const lengthInches = Math.round(Math.sqrt(totalSqIn * 2));
        const widthInches = Math.round(totalSqIn / lengthInches);

        const hideHouses = Math.max(numberOfPigs, 2);
        const hayRacks = Math.max(1, Math.ceil(numberOfPigs / 2));
        const waterBottles = Math.max(1, Math.ceil(numberOfPigs / 2));

        return {
          primary: {
            label: "Minimum Cage Area",
            value: `${formatNumber(totalSqFt, 1)} sq ft`,
          },
          details: [
            { label: "Area in Square Inches", value: `${formatNumber(totalSqIn)} sq in` },
            { label: "Recommended Dimensions", value: `${lengthInches} x ${widthInches} inches` },
            ...(cncGrids ? [{ label: "C&C Grid Size", value: cncGrids }] : []),
            { label: "Hide Houses Needed", value: `${hideHouses}` },
            { label: "Hay Racks", value: `${hayRacks}` },
            { label: "Water Bottles/Bowls", value: `${waterBottles}` },
            { label: "Wall Height (minimum)", value: "12-14 inches" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rabbit-enclosure-calculator", "hamster-wheel-size-calculator"],
  faq: [
    {
      question: "What is the minimum cage size for two guinea pigs?",
      answer:
        "Two guinea pigs need a minimum of 10.5 square feet (approximately 30 x 50 inches). This is the size of a 2x4 C&C cage. Bigger is always better as guinea pigs are active and need room to run and play.",
    },
    {
      question: "What is a C&C cage?",
      answer:
        "C&C stands for Cubes and Coroplast. These cages are built using wire storage cube grids (14x14 inch panels) for walls and a corrugated plastic (Coroplast) base. They are popular because they are affordable, customizable, and provide much more space than most store-bought cages.",
    },
    {
      question: "Should guinea pigs live alone or in pairs?",
      answer:
        "Guinea pigs are social herd animals and should ideally be kept in same-sex pairs or groups. In some places (like Switzerland), it is illegal to keep a single guinea pig. A companion of the same species is essential for their mental well-being.",
    },
  ],
  formula:
    "Min Area = Base Area (by count) x Size Multiplier x Floor Time Multiplier",
};
