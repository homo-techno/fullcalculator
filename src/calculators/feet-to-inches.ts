import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const feetToInchesConverter: CalculatorDefinition = {
  slug: "feet-to-inches-converter",
  title: "Feet to Inches Converter",
  description:
    "Free feet to inches converter. Quickly convert feet to inches, millimeters, and centimeters with our easy calculator. 1 foot = 12 inches.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "feet to inches",
    "foot to inch",
    "feet converter",
    "length converter",
    "feet to cm",
    "feet to mm",
  ],
  variants: [
    {
      id: "feet-to-inches",
      name: "Feet to Inches",
      fields: [
        {
          name: "feet",
          label: "Feet",
          type: "number",
          placeholder: "e.g. 5.5",
        },
      ],
      calculate: (inputs) => {
        const feet = inputs.feet as number;
        if (feet === undefined || feet === null) return null;
        const inches = feet * 12;
        const cm = feet * 30.48;
        const mm = feet * 304.8;
        const meters = feet * 0.3048;
        const yards = feet / 3;
        return {
          primary: {
            label: `${formatNumber(feet, 4)} feet`,
            value: `${formatNumber(inches, 4)} inches`,
          },
          details: [
            { label: "Inches", value: formatNumber(inches, 4) },
            { label: "Centimeters", value: formatNumber(cm, 4) },
            { label: "Millimeters", value: formatNumber(mm, 2) },
            { label: "Meters", value: formatNumber(meters, 4) },
            { label: "Yards", value: formatNumber(yards, 4) },
          ],
        };
      },
    },
    {
      id: "inches-to-feet",
      name: "Inches to Feet",
      fields: [
        {
          name: "inches",
          label: "Inches",
          type: "number",
          placeholder: "e.g. 72",
        },
      ],
      calculate: (inputs) => {
        const inches = inputs.inches as number;
        if (inches === undefined || inches === null) return null;
        const feet = inches / 12;
        const wholeFeet = Math.floor(feet);
        const remainingInches = inches - wholeFeet * 12;
        const cm = inches * 2.54;
        const mm = inches * 25.4;
        const meters = inches * 0.0254;
        return {
          primary: {
            label: `${formatNumber(inches, 4)} inches`,
            value: `${formatNumber(feet, 4)} feet`,
          },
          details: [
            { label: "Feet (decimal)", value: formatNumber(feet, 4) },
            { label: "Feet & Inches", value: `${wholeFeet}' ${formatNumber(remainingInches, 2)}"` },
            { label: "Centimeters", value: formatNumber(cm, 4) },
            { label: "Millimeters", value: formatNumber(mm, 2) },
            { label: "Meters", value: formatNumber(meters, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["inches-to-cm-converter", "length-converter", "unit-converter"],
  faq: [
    {
      question: "How many inches are in a foot?",
      answer:
        "There are exactly 12 inches in 1 foot. This is a standard US and Imperial measurement.",
    },
    {
      question: "How do I convert feet to centimeters?",
      answer:
        "Multiply feet by 30.48 to get centimeters. For example, 5 feet = 5 × 30.48 = 152.4 cm.",
    },
  ],
  formula: "inches = feet × 12 | cm = feet × 30.48 | mm = feet × 304.8",
};
