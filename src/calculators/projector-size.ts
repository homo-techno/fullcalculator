import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const projectorSizeCalculator: CalculatorDefinition = {
  slug: "projector-size-calculator",
  title: "Projector Size Calculator",
  description:
    "Free projector screen size calculator. Calculate screen dimensions from throw distance and throw ratio for 16:9 setups.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "projector",
    "screen size",
    "throw ratio",
    "throw distance",
    "home theater",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "throwRatio",
          label: "Throw Ratio",
          type: "number",
          placeholder: "e.g. 1.5 (typical 1.5-2.0)",
        },
        {
          name: "distance",
          label: "Distance to Screen (feet)",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const throwRatio = inputs.throwRatio as number;
        const distance = inputs.distance as number;
        if (!throwRatio || !distance || throwRatio <= 0 || distance <= 0)
          return null;

        // Throw Ratio = Distance / Screen Width
        // Screen Width = Distance / Throw Ratio
        const screenWidthFt = distance / throwRatio;
        const screenWidthIn = screenWidthFt * 12;

        // 16:9 aspect ratio
        const screenHeightIn = screenWidthIn / (16 / 9);
        const diagonalIn = Math.sqrt(
          screenWidthIn * screenWidthIn + screenHeightIn * screenHeightIn
        );

        const screenAreaSqFt =
          (screenWidthIn * screenHeightIn) / 144;

        // Recommended viewing distance for the calculated screen
        const minViewDist = diagonalIn * 1.5 / 12;
        const maxViewDist = diagonalIn * 2.5 / 12;

        return {
          primary: {
            label: "Screen Diagonal",
            value: formatNumber(diagonalIn, 1) + " inches",
          },
          details: [
            {
              label: "Screen Width",
              value: formatNumber(screenWidthIn, 1) + " inches (" + formatNumber(screenWidthFt, 1) + " ft)",
            },
            {
              label: "Screen Height",
              value: formatNumber(screenHeightIn, 1) + " inches",
            },
            {
              label: "Screen Area",
              value: formatNumber(screenAreaSqFt, 1) + " sq ft",
            },
            {
              label: "Aspect Ratio",
              value: "16:9",
            },
            {
              label: "Throw Distance",
              value: formatNumber(distance, 1) + " feet",
            },
            {
              label: "Throw Ratio",
              value: formatNumber(throwRatio, 2),
            },
            {
              label: "Viewing Distance (recommended)",
              value: formatNumber(minViewDist, 1) + " - " + formatNumber(maxViewDist, 1) + " ft",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tv-distance-calculator", "monitor-comparison-calculator"],
  faq: [
    {
      question: "What is throw ratio?",
      answer:
        "Throw ratio is the distance from the projector to the screen divided by the screen width. A throw ratio of 1.5 means the projector needs to be 1.5 feet away for every 1 foot of screen width. Most home projectors have a throw ratio of 1.5-2.0.",
    },
    {
      question: "How far should a projector be from the screen?",
      answer:
        "It depends on the desired screen size and your projector's throw ratio. For a 100-inch diagonal (16:9) screen, which is about 87 inches wide, a projector with 1.5 throw ratio needs about 10.9 feet of distance.",
    },
  ],
  formula:
    "Screen Width = Distance / Throw Ratio. For 16:9: Height = Width / 1.778. Diagonal = sqrt(Width^2 + Height^2). Throw Ratio = Distance / Screen Width.",
};
