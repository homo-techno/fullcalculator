import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const staircaseCalculator: CalculatorDefinition = {
  slug: "staircase-calculator",
  title: "Staircase Calculator",
  description: "Free staircase calculator. Calculate the number of steps, riser height, tread depth, and stringer length for your stairs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["staircase calculator", "stair calculator", "riser calculator", "tread calculator", "stringer length"],
  variants: [
    {
      id: "calculate",
      name: "Calculate Stairs",
      fields: [
        { name: "totalRise", label: "Total Rise / Height (inches)", type: "number", placeholder: "e.g. 108" },
        { name: "riserTarget", label: "Target Riser Height (in)", type: "number", placeholder: "e.g. 7.5", defaultValue: 7.5 },
        { name: "tread", label: "Tread Depth (in)", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const totalRise = inputs.totalRise as number;
        const riserTarget = (inputs.riserTarget as number) || 7.5;
        const tread = (inputs.tread as number) || 10;
        if (!totalRise) return null;
        const risers = Math.round(totalRise / riserTarget);
        const actualRiser = totalRise / risers;
        const treads = risers - 1;
        const totalRun = treads * tread;
        const stringerLength = Math.sqrt(totalRise * totalRise + totalRun * totalRun);
        const angle = Math.atan2(totalRise, totalRun) * 180 / Math.PI;
        const codeCompliant = actualRiser >= 4 && actualRiser <= 7.75 && tread >= 10;
        return {
          primary: { label: "Number of Steps", value: String(risers) },
          details: [
            { label: "Actual riser height", value: `${formatNumber(actualRiser, 3)}"` },
            { label: "Number of treads", value: String(treads) },
            { label: "Tread depth", value: `${tread}"` },
            { label: "Total run", value: `${formatNumber(totalRun, 1)}" (${formatNumber(totalRun / 12, 1)} ft)` },
            { label: "Stringer length", value: `${formatNumber(stringerLength, 1)}" (${formatNumber(stringerLength / 12, 1)} ft)` },
            { label: "Stair angle", value: `${formatNumber(angle, 1)}°` },
            { label: "Code compliant", value: codeCompliant ? "Yes" : "Check local codes" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["deck-calculator", "square-footage-calculator", "pythagorean-theorem-calculator"],
  faq: [{ question: "What is the standard stair riser height?", answer: "Building code typically requires risers between 4\" and 7.75\" (7.5\" ideal), treads minimum 10\" deep. The rule of thumb: 2 × riser + tread = 24-25\". For a 9ft (108\") floor-to-floor height, you need about 14-15 steps." }],
  formula: "Risers = Total Rise / Target Riser | Run = (Risers-1) × Tread",
};
