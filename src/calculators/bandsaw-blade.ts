import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bandsawBladeCalculator: CalculatorDefinition = {
  slug: "bandsaw-blade-calculator",
  title: "Bandsaw Blade Length Calculator",
  description: "Free bandsaw blade length calculator. Calculate the correct blade length for your bandsaw based on wheel diameter and center distance.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bandsaw blade calculator", "blade length calculator", "bandsaw wheel calculator", "bandsaw blade size", "blade circumference"],
  variants: [
    {
      id: "two-wheel",
      name: "Two-Wheel Bandsaw",
      description: "Calculate blade length for a standard two-wheel bandsaw",
      fields: [
        { name: "wheelDiameter", label: "Wheel Diameter (inches)", type: "number", placeholder: "e.g. 14" },
        { name: "centerDistance", label: "Center-to-Center Distance (inches)", type: "number", placeholder: "e.g. 20" },
        {
          name: "bladeWidth",
          label: "Blade Width",
          type: "select",
          options: [
            { label: "1/8 inch", value: "0.125" },
            { label: "1/4 inch", value: "0.25" },
            { label: "3/8 inch", value: "0.375" },
            { label: "1/2 inch", value: "0.5" },
            { label: "3/4 inch", value: "0.75" },
            { label: "1 inch", value: "1.0" },
          ],
        },
      ],
      calculate: (inputs) => {
        const wheelDia = inputs.wheelDiameter as number;
        const centerDist = inputs.centerDistance as number;
        const bladeWidth = parseFloat(inputs.bladeWidth as string);
        if (!wheelDia || !centerDist) return null;
        const bladeLength = (Math.PI * wheelDia) + (2 * centerDist);
        const minRadius = bladeWidth < 0.25 ? 0.5 : bladeWidth < 0.5 ? 1.5 : bladeWidth < 0.75 ? 3.5 : 5.25;
        const bladeSpeed = wheelDia * Math.PI;
        const bladeLengthFeet = bladeLength / 12;
        return {
          primary: { label: "Blade Length", value: `${formatNumber(bladeLength, 1)} inches` },
          details: [
            { label: "Blade Length (feet)", value: `${formatNumber(bladeLengthFeet, 2)} ft` },
            { label: "Wheel Diameter", value: `${formatNumber(wheelDia, 1)} inches` },
            { label: "Center Distance", value: `${formatNumber(centerDist, 1)} inches` },
            { label: "Blade Width", value: `${formatNumber(bladeWidth, 3)} inches` },
            { label: "Min Cutting Radius", value: `${formatNumber(minRadius, 2)} inches` },
            { label: "Circumference per Revolution", value: `${formatNumber(bladeSpeed, 1)} inches` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["lathe-speed-calculator", "router-bit-speed-calculator", "cutting-diagram-calculator"],
  faq: [
    { question: "How do I measure bandsaw blade length?", answer: "For a two-wheel bandsaw, measure the wheel diameter and the center-to-center distance between wheels. Blade length = Pi x wheel diameter + 2 x center distance." },
    { question: "What blade width should I use?", answer: "Narrow blades (1/8 to 1/4 inch) cut tight curves. Wide blades (1/2 to 1 inch) cut straighter and resaw better. Match blade width to your cutting needs." },
  ],
  formula: "Blade Length = Pi x Wheel Diameter + 2 x Center Distance",
};
