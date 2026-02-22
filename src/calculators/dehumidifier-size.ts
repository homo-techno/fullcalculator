import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dehumidifierSizeCalculator: CalculatorDefinition = {
  slug: "dehumidifier-size-calculator",
  title: "Dehumidifier Sizing Calculator",
  description: "Free dehumidifier sizing calculator. Determine the right dehumidifier capacity in pints per day based on room size and moisture conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dehumidifier size calculator", "dehumidifier pints", "dehumidifier capacity", "moisture removal", "humidity control"],
  variants: [
    {
      id: "room-dehumidifier",
      name: "Room Dehumidifier Size",
      description: "Calculate dehumidifier capacity for a space",
      fields: [
        { name: "area", label: "Room Area (sq ft)", type: "number", placeholder: "e.g. 500" },
        { name: "dampness", label: "Moisture Condition", type: "select", options: [
          { label: "Slightly Damp (musty smell in humid weather)", value: "slight" },
          { label: "Moderately Damp (damp spots on walls)", value: "moderate" },
          { label: "Very Damp (seepage, sweating walls)", value: "very" },
          { label: "Wet (flooding, standing water)", value: "wet" },
        ], defaultValue: "moderate" },
        { name: "hasLaundry", label: "Has Washer/Dryer?", type: "select", options: [
          { label: "No", value: "no" },
          { label: "Yes (add 5 pints)", value: "yes" },
        ], defaultValue: "no" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const dampness = inputs.dampness as string;
        const hasLaundry = inputs.hasLaundry as string;
        if (!area) return null;
        const basePints: Record<string, number[]> = {
          slight: [10, 14, 18, 22, 26],
          moderate: [12, 17, 22, 27, 32],
          very: [14, 20, 26, 32, 38],
          wet: [16, 23, 30, 37, 44],
        };
        const sizeBreaks = [500, 1000, 1500, 2000, 2500];
        const pints = basePints[dampness] || basePints["moderate"];
        let idx = sizeBreaks.findIndex(s => s >= area);
        if (idx === -1) idx = pints.length - 1;
        let capacity = pints[idx];
        if (area > 2500) capacity += Math.ceil((area - 2500) / 500) * 5;
        if (hasLaundry === "yes") capacity += 5;
        return {
          primary: { label: "Required Capacity", value: `${formatNumber(capacity, 0)}` + " pints/day" },
          details: [
            { label: "Room Area", value: `${formatNumber(area, 0)}` + " sq ft" },
            { label: "Moisture Condition", value: dampness },
            { label: "Laundry Addition", value: hasLaundry === "yes" ? "+ 5 pints" : "None" },
            { label: "Liters per Day", value: `${formatNumber(capacity * 0.473, 1)}` + " L/day" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["humidifier-size-calculator", "cooling-load-calculator", "condensate-drain-calculator"],
  faq: [
    { question: "What size dehumidifier do I need?", answer: "For a moderately damp 500 sq ft space, you need about 12 pints/day capacity. For a very damp 1000 sq ft basement, about 20 pints/day. Add 5 pints if you have a washer/dryer in the space." },
    { question: "What humidity level should I target?", answer: "Aim for 30-50% relative humidity. Below 30% can cause dry skin and static. Above 50% promotes mold growth. For basements, 40-50% is ideal." },
  ],
  formula: "Capacity based on AHAM sizing guidelines: area x dampness level + appliance additions",
};