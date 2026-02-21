import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beltLengthCalculator: CalculatorDefinition = {
  slug: "belt-length-calculator",
  title: "Belt Length Calculator",
  description:
    "Free belt length calculator for two-pulley systems. Calculate the belt length from center distance and pulley diameters using the standard belt formula.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "belt length",
    "belt calculator",
    "pulley belt",
    "drive belt",
    "v-belt length",
    "belt size calculator",
  ],
  variants: [
    {
      id: "belt-length",
      name: "Calculate Belt Length",
      description: "L = 2C + π(D+d)/2 + (D-d)²/(4C)",
      fields: [
        {
          name: "centerDistance",
          label: "Center Distance (inches)",
          type: "number",
          placeholder: "e.g. 24",
        },
        {
          name: "largeDiameter",
          label: "Large Pulley Diameter (inches)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "smallDiameter",
          label: "Small Pulley Diameter (inches)",
          type: "number",
          placeholder: "e.g. 6",
        },
      ],
      calculate: (inputs) => {
        const C = inputs.centerDistance as number;
        const D = inputs.largeDiameter as number;
        const d = inputs.smallDiameter as number;
        if (!C || !D || !d) return null;

        // Standard belt length formula for open belt
        const beltLength = 2 * C + (Math.PI * (D + d)) / 2 + ((D - d) * (D - d)) / (4 * C);
        const speedRatio = D / d;
        const wrapAngleLarge = 180 + (2 * Math.asin((D - d) / (2 * C)) * 180) / Math.PI;
        const wrapAngleSmall = 180 - (2 * Math.asin((D - d) / (2 * C)) * 180) / Math.PI;
        const beltLengthMm = beltLength * 25.4;

        return {
          primary: {
            label: "Belt Length",
            value: `${formatNumber(beltLength, 4)} inches`,
          },
          details: [
            { label: "Belt Length (inches)", value: formatNumber(beltLength, 4) },
            { label: "Belt Length (mm)", value: formatNumber(beltLengthMm, 2) },
            { label: "Belt Length (feet)", value: formatNumber(beltLength / 12, 4) },
            { label: "Speed Ratio", value: `${formatNumber(speedRatio, 4)}:1` },
            { label: "Wrap Angle (large)", value: `${formatNumber(wrapAngleLarge, 2)}°` },
            { label: "Wrap Angle (small)", value: `${formatNumber(wrapAngleSmall, 2)}°` },
          ],
        };
      },
    },
    {
      id: "center-distance",
      name: "Estimate Center Distance from Belt Length",
      description: "Approximate center distance from known belt length and pulley sizes",
      fields: [
        {
          name: "beltLength",
          label: "Belt Length (inches)",
          type: "number",
          placeholder: "e.g. 80",
        },
        {
          name: "largeDiameter",
          label: "Large Pulley Diameter (inches)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "smallDiameter",
          label: "Small Pulley Diameter (inches)",
          type: "number",
          placeholder: "e.g. 6",
        },
      ],
      calculate: (inputs) => {
        const L = inputs.beltLength as number;
        const D = inputs.largeDiameter as number;
        const d = inputs.smallDiameter as number;
        if (!L || !D || !d) return null;

        // Solve for C using the approximation formula:
        // C ≈ (2L - π(D+d) + √((2L - π(D+d))² - 32(D-d)²)) / 16
        const b = 2 * L - Math.PI * (D + d);
        const discriminant = b * b - 32 * (D - d) * (D - d);
        if (discriminant < 0) {
          return {
            primary: { label: "Error", value: "Belt is too short for these pulley sizes" },
            details: [],
          };
        }
        const C = (b + Math.sqrt(discriminant)) / 16;
        const speedRatio = D / d;

        return {
          primary: {
            label: "Center Distance",
            value: `${formatNumber(C, 4)} inches`,
          },
          details: [
            { label: "Center Distance (inches)", value: formatNumber(C, 4) },
            { label: "Center Distance (mm)", value: formatNumber(C * 25.4, 2) },
            { label: "Center Distance (feet)", value: formatNumber(C / 12, 4) },
            { label: "Speed Ratio", value: `${formatNumber(speedRatio, 4)}:1` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gear-speed-calculator", "pulley-calculator", "gear-ratio-calculator"],
  faq: [
    {
      question: "How do I calculate belt length for two pulleys?",
      answer:
        "Use the formula: L = 2C + π(D+d)/2 + (D-d)²/(4C), where C is the center distance between pulleys, D is the large pulley diameter, and d is the small pulley diameter. All measurements must be in the same units.",
    },
    {
      question: "What is the wrap angle?",
      answer:
        "The wrap angle is the arc of contact between the belt and pulley. The small pulley always has a smaller wrap angle. A wrap angle below 120° can reduce power transmission efficiency and increase belt wear.",
    },
  ],
  formula: "L = 2C + π(D+d)/2 + (D-d)²/(4C)",
};
