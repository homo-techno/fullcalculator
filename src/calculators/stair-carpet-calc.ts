import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stairCarpetCalculator: CalculatorDefinition = {
  slug: "stair-carpet-calc",
  title: "Stair Carpet Calculator",
  description:
    "Free online stair carpet calculator. Estimate how much carpet you need for stairs, including tread, riser, and nosing measurements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "stair",
    "carpet",
    "runner",
    "tread",
    "riser",
    "nosing",
    "flooring",
    "steps",
  ],
  variants: [
    {
      id: "stair-carpet",
      name: "Stair Carpet",
      description: "Calculate carpet for a straight staircase",
      fields: [
        {
          name: "numSteps",
          label: "Number of Steps",
          type: "number",
          placeholder: "e.g. 13",
        },
        {
          name: "treadDepth",
          label: "Tread Depth",
          type: "number",
          placeholder: "e.g. 10",
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
          name: "stairWidth",
          label: "Stair Width",
          type: "number",
          placeholder: "e.g. 36",
          suffix: "in",
        },
        {
          name: "nosing",
          label: "Nosing Overhang",
          type: "number",
          placeholder: "e.g. 1",
          suffix: "in",
          defaultValue: 1,
        },
        {
          name: "style",
          label: "Installation Style",
          type: "select",
          options: [
            { label: "Waterfall (carpet drapes over nosing)", value: "waterfall" },
            { label: "Hollywood (tucked under nosing)", value: "hollywood" },
          ],
          defaultValue: "waterfall",
        },
      ],
      calculate: (inputs) => {
        const numSteps = parseFloat(inputs.numSteps as string) || 0;
        const treadDepth = parseFloat(inputs.treadDepth as string) || 0;
        const riserHeight = parseFloat(inputs.riserHeight as string) || 0;
        const stairWidth = parseFloat(inputs.stairWidth as string) || 0;
        const nosing = parseFloat(inputs.nosing as string) || 1;
        const style = (inputs.style as string) || "waterfall";

        if (numSteps <= 0 || treadDepth <= 0 || riserHeight <= 0 || stairWidth <= 0)
          return null;

        // Per step carpet length
        let perStepIn: number;
        if (style === "waterfall") {
          perStepIn = treadDepth + riserHeight + nosing + 1; // +1" for tuck
        } else {
          perStepIn = treadDepth + riserHeight + 2; // +2" for tucking both ends
        }

        const totalLengthIn = perStepIn * numSteps;
        const totalLengthFt = totalLengthIn / 12;
        const stairWidthFt = stairWidth / 12;
        const totalAreaSqFt = totalLengthFt * stairWidthFt;
        const totalAreaSqYd = totalAreaSqFt / 9;
        // Standard carpet roll is 12 ft wide
        const linearFtFromRoll = Math.ceil(totalLengthFt);

        return {
          primary: {
            label: "Carpet Needed",
            value: formatNumber(totalAreaSqYd) + " sq yards",
          },
          details: [
            { label: "Total carpet length", value: formatNumber(totalLengthFt) + " ft" },
            { label: "Carpet area", value: formatNumber(totalAreaSqFt) + " sq ft" },
            { label: "Per step length", value: formatNumber(perStepIn) + " in" },
            { label: "Number of steps", value: formatNumber(numSteps) },
            { label: "Linear ft from 12-ft roll", value: formatNumber(linearFtFromRoll) + " ft" },
            { label: "Installation style", value: style === "waterfall" ? "Waterfall" : "Hollywood" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["concrete-stairs", "spiral-staircase"],
  faq: [
    {
      question: "How much carpet do I need for stairs?",
      answer:
        "For each step, add the tread depth plus the riser height plus 1-2 inches for tucking. Multiply by the number of steps to get total length. Then multiply by stair width for total area.",
    },
    {
      question:
        "What is the difference between waterfall and Hollywood carpet installation?",
      answer:
        "Waterfall installation drapes the carpet smoothly over the nosing and down the riser. Hollywood installation tucks the carpet under the nosing for a more fitted look that shows the step profile.",
    },
  ],
  formula:
    "Total Length = NumSteps × (TreadDepth + RiserHeight + Nosing + TuckAllowance); Area = TotalLength × Width",
};
