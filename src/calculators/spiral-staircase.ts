import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const spiralStaircaseCalculator: CalculatorDefinition = {
  slug: "spiral-staircase",
  title: "Spiral Staircase Calculator",
  description:
    "Free online spiral staircase calculator. Determine step count, rotation degrees, headroom, tread dimensions, and handrail length for a spiral staircase.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "spiral",
    "staircase",
    "helix",
    "circular",
    "rotation",
    "tread",
    "riser",
    "handrail",
  ],
  variants: [
    {
      id: "spiral-stairs",
      name: "Spiral Staircase Design",
      description:
        "Calculate dimensions and materials for a spiral staircase",
      fields: [
        {
          name: "floorHeight",
          label: "Floor-to-Floor Height",
          type: "number",
          placeholder: "e.g. 108",
          suffix: "in",
        },
        {
          name: "outerDiameter",
          label: "Outer Diameter",
          type: "number",
          placeholder: "e.g. 60",
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
          name: "centerPole",
          label: "Center Pole Diameter",
          type: "number",
          placeholder: "e.g. 4",
          suffix: "in",
          defaultValue: 4,
        },
      ],
      calculate: (inputs) => {
        const floorHeight = parseFloat(inputs.floorHeight as string) || 0;
        const outerDiameter = parseFloat(inputs.outerDiameter as string) || 0;
        const riserHeight = parseFloat(inputs.riserHeight as string) || 0;
        const centerPole = parseFloat(inputs.centerPole as string) || 4;

        if (floorHeight <= 0 || outerDiameter <= 0 || riserHeight <= 0)
          return null;

        const numRisers = Math.ceil(floorHeight / riserHeight);
        const actualRiserHeight = floorHeight / numRisers;
        const numTreads = numRisers; // landing counts as last tread

        // Typical rotation: 30 degrees per step
        const degreesPerStep = 30;
        const totalRotation = degreesPerStep * numTreads;
        const fullTurns = totalRotation / 360;

        // Tread dimensions
        const outerRadius = outerDiameter / 2;
        const innerRadius = centerPole / 2;
        const treadDepthOuter = (2 * Math.PI * outerRadius * degreesPerStep) / 360;
        const treadDepthInner = (2 * Math.PI * innerRadius * degreesPerStep) / 360;
        const walkLineRadius = outerRadius * 0.67; // walk line at 2/3 from center
        const treadAtWalkLine =
          (2 * Math.PI * walkLineRadius * degreesPerStep) / 360;

        // Handrail length (helix circumference)
        const helixRadius = outerRadius;
        const helixCircumference =
          fullTurns * 2 * Math.PI * helixRadius;
        const handrailLength = Math.sqrt(
          helixCircumference * helixCircumference + floorHeight * floorHeight
        );

        // Headroom check (height gained per full revolution)
        const headroomPerTurn = (360 / degreesPerStep) * actualRiserHeight;

        return {
          primary: {
            label: "Number of Steps",
            value: formatNumber(numTreads),
          },
          details: [
            {
              label: "Actual riser height",
              value: formatNumber(actualRiserHeight) + " in",
            },
            {
              label: "Total rotation",
              value: formatNumber(totalRotation) + "\u00B0 (" + formatNumber(fullTurns, 1) + " turns)",
            },
            {
              label: "Tread at outer edge",
              value: formatNumber(treadDepthOuter) + " in",
            },
            {
              label: "Tread at walk line",
              value: formatNumber(treadAtWalkLine) + " in",
            },
            {
              label: "Tread at inner edge",
              value: formatNumber(treadDepthInner) + " in",
            },
            {
              label: "Headroom per revolution",
              value: formatNumber(headroomPerTurn) + " in",
            },
            {
              label: "Handrail length",
              value: formatNumber(handrailLength / 12) + " ft",
            },
          ],
          note:
            headroomPerTurn < 78
              ? "Warning: Headroom per revolution is less than 78 inches (6.5 ft). Consider increasing diameter or riser height."
              : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["concrete-stairs", "stair-carpet-calc", "ramp-calculator"],
  faq: [
    {
      question: "What is the minimum diameter for a spiral staircase?",
      answer:
        "Building codes typically require a minimum diameter of 60 inches (5 feet) for a spiral staircase. However, 66-72 inches is more comfortable. The minimum clear width should be 26 inches.",
    },
    {
      question: "How do you calculate headroom for spiral stairs?",
      answer:
        "Headroom is the vertical distance gained in one full 360-degree revolution. It must be at least 78 inches (6.5 feet) per most building codes. Calculate it as (360 / degrees_per_step) x riser_height.",
    },
  ],
  formula:
    "Steps = ceil(FloorHeight / RiserHeight); Rotation = Steps x 30\u00B0; Headroom = (360/30) x ActualRiser",
};
