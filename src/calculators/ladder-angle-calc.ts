import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ladderAngleCalculator: CalculatorDefinition = {
  slug: "ladder-angle-calc",
  title: "Ladder Angle Safety Calculator",
  description:
    "Free online ladder angle calculator. Determine the safe ladder placement angle, base distance, and reach height using the 4-to-1 rule.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "ladder",
    "angle",
    "safety",
    "placement",
    "4 to 1",
    "height",
    "reach",
    "OSHA",
  ],
  variants: [
    {
      id: "by-height",
      name: "By Wall Height",
      description: "Calculate safe ladder placement from wall height",
      fields: [
        {
          name: "wallHeight",
          label: "Height to Reach",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "ft",
        },
        {
          name: "ladderExtension",
          label: "Ladder Extension Above Surface",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "ft",
          defaultValue: 3,
        },
      ],
      calculate: (inputs) => {
        const wallHeight = parseFloat(inputs.wallHeight as string) || 0;
        const ladderExtension =
          parseFloat(inputs.ladderExtension as string) || 3;

        if (wallHeight <= 0) return null;

        // 4-to-1 rule: base distance = height / 4
        const baseDistance = wallHeight / 4;
        const totalLadderHeight = wallHeight + ladderExtension;
        // Actual ladder length needed (hypotenuse)
        const ladderLength = Math.sqrt(
          wallHeight * wallHeight + baseDistance * baseDistance
        );
        const ladderLengthWithExt = ladderLength + ladderExtension;
        // Angle from ground
        const angleDeg = Math.atan(wallHeight / baseDistance) * (180 / Math.PI);

        const safe = angleDeg >= 70 && angleDeg <= 80;

        return {
          primary: {
            label: "Base Distance from Wall",
            value: formatNumber(baseDistance) + " ft",
          },
          details: [
            {
              label: "Ladder length needed",
              value: formatNumber(ladderLengthWithExt) + " ft",
            },
            {
              label: "Angle from ground",
              value: formatNumber(angleDeg) + "\u00B0",
            },
            {
              label: "Wall height",
              value: formatNumber(wallHeight) + " ft",
            },
            {
              label: "Extension above surface",
              value: formatNumber(ladderExtension) + " ft",
            },
            {
              label: "Safety check (75\u00B0 \u00B1 5\u00B0)",
              value: safe ? "SAFE" : "ADJUST PLACEMENT",
            },
          ],
          note: safe
            ? "Ladder angle is within the safe range of 75\u00B0 (\u00B15\u00B0). The 4-to-1 rule is satisfied."
            : "Warning: Ladder angle may be outside the safe range. The ideal angle is 75\u00B0 (between 70\u00B0 and 80\u00B0).",
        };
      },
    },
    {
      id: "by-ladder-length",
      name: "By Ladder Length",
      description: "Calculate placement from known ladder length",
      fields: [
        {
          name: "ladderLength",
          label: "Ladder Length",
          type: "number",
          placeholder: "e.g. 24",
          suffix: "ft",
        },
        {
          name: "angle",
          label: "Desired Angle",
          type: "number",
          placeholder: "e.g. 75",
          suffix: "\u00B0",
          defaultValue: 75,
        },
      ],
      calculate: (inputs) => {
        const ladderLength = parseFloat(inputs.ladderLength as string) || 0;
        const angle = parseFloat(inputs.angle as string) || 75;

        if (ladderLength <= 0 || angle <= 0 || angle >= 90) return null;

        const angleRad = angle * (Math.PI / 180);
        const wallHeight = ladderLength * Math.sin(angleRad);
        const baseDistance = ladderLength * Math.cos(angleRad);
        const safe = angle >= 70 && angle <= 80;
        const ideal41Base = wallHeight / 4;

        return {
          primary: {
            label: "Maximum Reach Height",
            value: formatNumber(wallHeight) + " ft",
          },
          details: [
            {
              label: "Base distance from wall",
              value: formatNumber(baseDistance) + " ft",
            },
            {
              label: "Angle",
              value: formatNumber(angle) + "\u00B0",
            },
            {
              label: "Ladder length",
              value: formatNumber(ladderLength) + " ft",
            },
            {
              label: "4-to-1 rule base distance",
              value: formatNumber(ideal41Base) + " ft",
            },
            {
              label: "Safety check",
              value: safe ? "SAFE" : "ADJUST ANGLE",
            },
          ],
          note: safe
            ? "Ladder angle is within the safe range."
            : "Warning: Angle should be between 70\u00B0 and 80\u00B0 for safe ladder use.",
        };
      },
    },
  ],
  relatedSlugs: ["ramp-calculator", "spiral-staircase"],
  faq: [
    {
      question: "What is the 4-to-1 ladder rule?",
      answer:
        "The 4-to-1 rule states that for every 4 feet of height, the base of the ladder should be 1 foot away from the wall. This creates approximately a 75-degree angle, which is the safest angle for ladder use.",
    },
    {
      question: "How far should a ladder extend above the roofline?",
      answer:
        "OSHA requires that a ladder extend at least 3 feet above the upper landing surface (such as a roofline) to provide a secure handhold when stepping on and off the ladder.",
    },
  ],
  formula:
    "Base Distance = Height / 4 (4-to-1 rule); Ladder Length = sqrt(Height^2 + Base^2); Angle = atan(Height / Base)",
};
