import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const resistorColorCodeCalculator: CalculatorDefinition = {
  slug: "resistor-color-code-calculator",
  title: "Resistor Color Code Calculator",
  description:
    "Free resistor color code calculator. Decode 4-band and 5-band resistor color codes to find resistance values. Supports all standard color bands.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "resistor color code",
    "resistor calculator",
    "color band resistor",
    "4 band resistor",
    "5 band resistor",
    "resistor decoder",
  ],
  variants: [
    {
      id: "four-band",
      name: "4-Band Resistor",
      description: "Decode a 4-band resistor color code",
      fields: [
        {
          name: "band1",
          label: "Band 1 (1st Digit)",
          type: "select",
          options: [
            { label: "Black (0)", value: "0" },
            { label: "Brown (1)", value: "1" },
            { label: "Red (2)", value: "2" },
            { label: "Orange (3)", value: "3" },
            { label: "Yellow (4)", value: "4" },
            { label: "Green (5)", value: "5" },
            { label: "Blue (6)", value: "6" },
            { label: "Violet (7)", value: "7" },
            { label: "Grey (8)", value: "8" },
            { label: "White (9)", value: "9" },
          ],
          defaultValue: "1",
        },
        {
          name: "band2",
          label: "Band 2 (2nd Digit)",
          type: "select",
          options: [
            { label: "Black (0)", value: "0" },
            { label: "Brown (1)", value: "1" },
            { label: "Red (2)", value: "2" },
            { label: "Orange (3)", value: "3" },
            { label: "Yellow (4)", value: "4" },
            { label: "Green (5)", value: "5" },
            { label: "Blue (6)", value: "6" },
            { label: "Violet (7)", value: "7" },
            { label: "Grey (8)", value: "8" },
            { label: "White (9)", value: "9" },
          ],
          defaultValue: "0",
        },
        {
          name: "multiplier",
          label: "Band 3 (Multiplier)",
          type: "select",
          options: [
            { label: "Black (×1)", value: "1" },
            { label: "Brown (×10)", value: "10" },
            { label: "Red (×100)", value: "100" },
            { label: "Orange (×1k)", value: "1000" },
            { label: "Yellow (×10k)", value: "10000" },
            { label: "Green (×100k)", value: "100000" },
            { label: "Blue (×1M)", value: "1000000" },
            { label: "Violet (×10M)", value: "10000000" },
            { label: "Gold (×0.1)", value: "0.1" },
            { label: "Silver (×0.01)", value: "0.01" },
          ],
          defaultValue: "100",
        },
        {
          name: "tolerance",
          label: "Band 4 (Tolerance)",
          type: "select",
          options: [
            { label: "Brown (±1%)", value: "1" },
            { label: "Red (±2%)", value: "2" },
            { label: "Gold (±5%)", value: "5" },
            { label: "Silver (±10%)", value: "10" },
            { label: "None (±20%)", value: "20" },
          ],
          defaultValue: "5",
        },
      ],
      calculate: (inputs) => {
        const d1 = Number(inputs.band1);
        const d2 = Number(inputs.band2);
        const mult = Number(inputs.multiplier);
        const tol = Number(inputs.tolerance);

        const resistance = (d1 * 10 + d2) * mult;
        const minR = resistance * (1 - tol / 100);
        const maxR = resistance * (1 + tol / 100);

        const formatResistance = (r: number): string => {
          if (r >= 1000000) return `${formatNumber(r / 1000000, 4)} MΩ`;
          if (r >= 1000) return `${formatNumber(r / 1000, 4)} kΩ`;
          return `${formatNumber(r, 4)} Ω`;
        };

        return {
          primary: {
            label: "Resistance",
            value: formatResistance(resistance),
          },
          details: [
            { label: "Resistance", value: `${formatNumber(resistance, 4)} Ω` },
            { label: "Tolerance", value: `±${tol}%` },
            { label: "Minimum", value: formatResistance(minR) },
            { label: "Maximum", value: formatResistance(maxR) },
          ],
        };
      },
    },
    {
      id: "five-band",
      name: "5-Band Resistor",
      description: "Decode a 5-band resistor color code (precision resistors)",
      fields: [
        {
          name: "band1",
          label: "Band 1 (1st Digit)",
          type: "select",
          options: [
            { label: "Black (0)", value: "0" },
            { label: "Brown (1)", value: "1" },
            { label: "Red (2)", value: "2" },
            { label: "Orange (3)", value: "3" },
            { label: "Yellow (4)", value: "4" },
            { label: "Green (5)", value: "5" },
            { label: "Blue (6)", value: "6" },
            { label: "Violet (7)", value: "7" },
            { label: "Grey (8)", value: "8" },
            { label: "White (9)", value: "9" },
          ],
          defaultValue: "4",
        },
        {
          name: "band2",
          label: "Band 2 (2nd Digit)",
          type: "select",
          options: [
            { label: "Black (0)", value: "0" },
            { label: "Brown (1)", value: "1" },
            { label: "Red (2)", value: "2" },
            { label: "Orange (3)", value: "3" },
            { label: "Yellow (4)", value: "4" },
            { label: "Green (5)", value: "5" },
            { label: "Blue (6)", value: "6" },
            { label: "Violet (7)", value: "7" },
            { label: "Grey (8)", value: "8" },
            { label: "White (9)", value: "9" },
          ],
          defaultValue: "7",
        },
        {
          name: "band3",
          label: "Band 3 (3rd Digit)",
          type: "select",
          options: [
            { label: "Black (0)", value: "0" },
            { label: "Brown (1)", value: "1" },
            { label: "Red (2)", value: "2" },
            { label: "Orange (3)", value: "3" },
            { label: "Yellow (4)", value: "4" },
            { label: "Green (5)", value: "5" },
            { label: "Blue (6)", value: "6" },
            { label: "Violet (7)", value: "7" },
            { label: "Grey (8)", value: "8" },
            { label: "White (9)", value: "9" },
          ],
          defaultValue: "0",
        },
        {
          name: "multiplier",
          label: "Band 4 (Multiplier)",
          type: "select",
          options: [
            { label: "Black (×1)", value: "1" },
            { label: "Brown (×10)", value: "10" },
            { label: "Red (×100)", value: "100" },
            { label: "Orange (×1k)", value: "1000" },
            { label: "Yellow (×10k)", value: "10000" },
            { label: "Green (×100k)", value: "100000" },
            { label: "Blue (×1M)", value: "1000000" },
            { label: "Gold (×0.1)", value: "0.1" },
            { label: "Silver (×0.01)", value: "0.01" },
          ],
          defaultValue: "1",
        },
        {
          name: "tolerance",
          label: "Band 5 (Tolerance)",
          type: "select",
          options: [
            { label: "Brown (±1%)", value: "1" },
            { label: "Red (±2%)", value: "2" },
            { label: "Green (±0.5%)", value: "0.5" },
            { label: "Blue (±0.25%)", value: "0.25" },
            { label: "Violet (±0.1%)", value: "0.1" },
            { label: "Gold (±5%)", value: "5" },
            { label: "Silver (±10%)", value: "10" },
          ],
          defaultValue: "1",
        },
      ],
      calculate: (inputs) => {
        const d1 = Number(inputs.band1);
        const d2 = Number(inputs.band2);
        const d3 = Number(inputs.band3);
        const mult = Number(inputs.multiplier);
        const tol = Number(inputs.tolerance);

        const resistance = (d1 * 100 + d2 * 10 + d3) * mult;
        const minR = resistance * (1 - tol / 100);
        const maxR = resistance * (1 + tol / 100);

        const formatResistance = (r: number): string => {
          if (r >= 1000000) return `${formatNumber(r / 1000000, 4)} MΩ`;
          if (r >= 1000) return `${formatNumber(r / 1000, 4)} kΩ`;
          return `${formatNumber(r, 4)} Ω`;
        };

        return {
          primary: {
            label: "Resistance",
            value: formatResistance(resistance),
          },
          details: [
            { label: "Resistance", value: `${formatNumber(resistance, 4)} Ω` },
            { label: "Tolerance", value: `±${tol}%` },
            { label: "Minimum", value: formatResistance(minR) },
            { label: "Maximum", value: formatResistance(maxR) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ohms-law-calculator", "resistance-calculator"],
  faq: [
    {
      question: "How do I read a resistor color code?",
      answer:
        "Read the bands from left to right. For a 4-band resistor: Band 1 is the first digit, Band 2 is the second digit, Band 3 is the multiplier, and Band 4 is the tolerance. For a 5-band resistor, there is an extra digit band before the multiplier.",
    },
    {
      question: "What is the color code mnemonic?",
      answer:
        "A common mnemonic is: Black (0), Brown (1), Red (2), Orange (3), Yellow (4), Green (5), Blue (6), Violet (7), Grey (8), White (9). The phrase 'BB ROY of Great Britain has a Very Good Wife' helps remember the order.",
    },
    {
      question: "What is the difference between 4-band and 5-band resistors?",
      answer:
        "4-band resistors have two significant digit bands, one multiplier band, and one tolerance band (typically ±5% or ±10%). 5-band resistors add a third significant digit for higher precision (typically ±1% or better).",
    },
  ],
  formula:
    "4-Band: R = (D1×10 + D2) × Multiplier ± Tolerance% | 5-Band: R = (D1×100 + D2×10 + D3) × Multiplier ± Tolerance%",
};
