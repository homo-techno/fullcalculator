import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const concreteStairsCalculator: CalculatorDefinition = {
  slug: "concrete-stairs",
  title: "Concrete Staircase Calculator",
  description:
    "Free online concrete staircase calculator. Estimate cubic yards of concrete needed for steps, including risers and treads.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "concrete",
    "stairs",
    "steps",
    "staircase",
    "riser",
    "tread",
    "pour",
  ],
  variants: [
    {
      id: "stairs",
      name: "Concrete Stairs",
      description: "Calculate concrete for a set of stairs",
      fields: [
        {
          name: "numSteps",
          label: "Number of Steps",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "stepWidth",
          label: "Step Width",
          type: "number",
          placeholder: "e.g. 36",
          suffix: "in",
        },
        {
          name: "riserHeight",
          label: "Riser Height",
          type: "number",
          placeholder: "e.g. 7.5",
          suffix: "in",
        },
        {
          name: "treadDepth",
          label: "Tread Depth",
          type: "number",
          placeholder: "e.g. 11",
          suffix: "in",
        },
        {
          name: "platformDepth",
          label: "Top Platform Depth (optional)",
          type: "number",
          placeholder: "e.g. 36",
          suffix: "in",
        },
      ],
      calculate: (inputs) => {
        const numSteps = parseFloat(inputs.numSteps as string) || 0;
        const stepWidth = parseFloat(inputs.stepWidth as string) || 0;
        const riserHeight = parseFloat(inputs.riserHeight as string) || 0;
        const treadDepth = parseFloat(inputs.treadDepth as string) || 0;
        const platformDepth = parseFloat(inputs.platformDepth as string) || 0;

        if (numSteps <= 0 || stepWidth <= 0 || riserHeight <= 0 || treadDepth <= 0)
          return null;

        const widthFt = stepWidth / 12;
        const riserFt = riserHeight / 12;
        const treadFt = treadDepth / 12;
        const platformFt = platformDepth / 12;

        // Each step is a rectangular block that sits on top of the ones below
        // Step i (1-indexed) has height = i * riserFt and depth = treadFt
        // Total volume = sum of each step layer
        let totalCubicFeet = 0;
        for (let i = 1; i <= numSteps; i++) {
          totalCubicFeet += widthFt * riserFt * treadFt * i;
        }

        // Add platform if specified
        if (platformFt > 0) {
          const platformHeight = numSteps * riserFt;
          totalCubicFeet += widthFt * platformHeight * platformFt;
        }

        const cubicYards = totalCubicFeet / 27;
        const withWaste = cubicYards * 1.1;
        const bags80lb = Math.ceil(totalCubicFeet / 0.022);
        const totalRise = numSteps * riserHeight;
        const totalRun = numSteps * treadDepth;

        return {
          primary: {
            label: "Concrete Needed",
            value: formatNumber(withWaste) + " cubic yards",
          },
          details: [
            {
              label: "Volume (cubic feet)",
              value: formatNumber(totalCubicFeet),
            },
            { label: "Volume (cubic yards)", value: formatNumber(cubicYards) },
            {
              label: "With 10% waste",
              value: formatNumber(withWaste) + " cu yd",
            },
            { label: "80-lb bags needed", value: formatNumber(bags80lb) },
            { label: "Total Rise", value: formatNumber(totalRise) + " in" },
            { label: "Total Run", value: formatNumber(totalRun) + " in" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["concrete-slab", "concrete-column", "spiral-staircase"],
  faq: [
    {
      question: "What is the standard riser height for concrete stairs?",
      answer:
        "The standard riser height is between 7 and 7.75 inches. Building codes typically require risers to be no more than 7.75 inches and all risers in a flight must be uniform within 3/8 inch.",
    },
    {
      question: "How do you calculate concrete for stairs?",
      answer:
        "Calculate the volume of each step as a cumulative block (each step sits on the full height of all steps below it), then sum all step volumes. Add platform volume if applicable, and include 10% for waste.",
    },
  ],
  formula:
    "Volume = sum of (width x riser x tread x step_number) for each step; add platform volume if applicable",
};
