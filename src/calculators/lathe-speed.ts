import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const latheSpeedCalculator: CalculatorDefinition = {
  slug: "lathe-speed-calculator",
  title: "Lathe Speed Calculator",
  description: "Free lathe speed calculator. Calculate optimal RPM for wood turning based on workpiece diameter and desired surface speed.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["lathe speed calculator", "lathe RPM calculator", "wood turning speed", "spindle speed calculator", "woodworking lathe"],
  variants: [
    {
      id: "rpm-from-diameter",
      name: "RPM from Diameter",
      description: "Calculate optimal lathe RPM from workpiece diameter",
      fields: [
        { name: "diameter", label: "Workpiece Diameter (inches)", type: "number", placeholder: "e.g. 8" },
        {
          name: "operation",
          label: "Operation Type",
          type: "select",
          options: [
            { label: "Roughing (3000 ft/min)", value: "3000" },
            { label: "General Turning (4000 ft/min)", value: "4000" },
            { label: "Finishing (5000 ft/min)", value: "5000" },
            { label: "Sanding (6000 ft/min)", value: "6000" },
          ],
        },
        {
          name: "woodType",
          label: "Wood Type",
          type: "select",
          options: [
            { label: "Softwood", value: "1.0" },
            { label: "Hardwood", value: "0.85" },
            { label: "Green/Wet Wood", value: "0.7" },
            { label: "Exotic Hardwood", value: "0.75" },
          ],
        },
      ],
      calculate: (inputs) => {
        const diameter = inputs.diameter as number;
        const surfaceSpeed = parseFloat(inputs.operation as string);
        const woodFactor = parseFloat(inputs.woodType as string);
        if (!diameter || !surfaceSpeed || !woodFactor) return null;
        const adjustedSurfaceSpeed = surfaceSpeed * woodFactor;
        const rpm = (adjustedSurfaceSpeed * 12) / (Math.PI * diameter);
        const circumference = Math.PI * diameter;
        const actualSurfaceSpeed = (rpm * circumference) / 12;
        const minRpm = rpm * 0.7;
        const maxRpm = rpm * 1.3;
        return {
          primary: { label: "Recommended RPM", value: formatNumber(Math.round(rpm), 0) },
          details: [
            { label: "RPM Range (Low)", value: formatNumber(Math.round(minRpm), 0) },
            { label: "RPM Range (High)", value: formatNumber(Math.round(maxRpm), 0) },
            { label: "Surface Speed", value: `${formatNumber(actualSurfaceSpeed, 0)} ft/min` },
            { label: "Adjusted Surface Speed", value: `${formatNumber(adjustedSurfaceSpeed, 0)} ft/min` },
            { label: "Circumference", value: `${formatNumber(circumference, 2)} inches` },
            { label: "Workpiece Diameter", value: `${formatNumber(diameter, 2)} inches` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["router-bit-speed-calculator", "drill-bit-size-calculator", "bandsaw-blade-calculator"],
  faq: [
    { question: "How do I determine lathe speed?", answer: "Start slow and increase speed gradually. For roughing, use lower speeds. As the piece becomes round and balanced, increase to finishing speeds. Always stay within your lathe's rated capacity." },
    { question: "What if the workpiece is out of balance?", answer: "Start at the lowest speed and increase gradually. Out-of-balance pieces create dangerous vibration at high speeds. Rough the piece round at low speed first." },
  ],
  formula: "RPM = (Surface Speed x 12) / (Pi x Diameter) | Surface Speed adjusted by wood type factor",
};
