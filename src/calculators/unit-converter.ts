import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const unitConverter: CalculatorDefinition = {
  slug: "unit-converter",
  title: "Unit Converter",
  description:
    "Free unit converter. Convert between metric and imperial units for length, weight, and temperature. Instant results, no signup required.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "unit converter",
    "metric converter",
    "length converter",
    "weight converter",
    "temperature converter",
    "kg to lbs",
    "cm to inches",
    "fahrenheit to celsius",
  ],
  variants: [
    {
      id: "length",
      name: "Length / Distance",
      description: "Convert between cm, inches, feet, meters, km, miles",
      fields: [
        {
          name: "value",
          label: "Value",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "from",
          label: "From",
          type: "select",
          options: [
            { label: "Centimeters (cm)", value: "cm" },
            { label: "Meters (m)", value: "m" },
            { label: "Kilometers (km)", value: "km" },
            { label: "Inches (in)", value: "in" },
            { label: "Feet (ft)", value: "ft" },
            { label: "Miles (mi)", value: "mi" },
          ],
          defaultValue: "cm",
        },
        {
          name: "to",
          label: "To",
          type: "select",
          options: [
            { label: "Centimeters (cm)", value: "cm" },
            { label: "Meters (m)", value: "m" },
            { label: "Kilometers (km)", value: "km" },
            { label: "Inches (in)", value: "in" },
            { label: "Feet (ft)", value: "ft" },
            { label: "Miles (mi)", value: "mi" },
          ],
          defaultValue: "in",
        },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const from = inputs.from as string;
        const to = inputs.to as string;
        if (!value && value !== 0) return null;

        // Convert everything to meters first
        const toMeters: Record<string, number> = {
          cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, mi: 1609.344,
        };
        const meters = value * (toMeters[from] || 1);
        const result = meters / (toMeters[to] || 1);

        return {
          primary: {
            label: `${value} ${from}`,
            value: formatNumber(result, 4),
            suffix: to,
          },
        };
      },
    },
    {
      id: "weight",
      name: "Weight / Mass",
      description: "Convert between grams, kg, ounces, pounds, stones",
      fields: [
        {
          name: "value",
          label: "Value",
          type: "number",
          placeholder: "e.g. 70",
        },
        {
          name: "from",
          label: "From",
          type: "select",
          options: [
            { label: "Grams (g)", value: "g" },
            { label: "Kilograms (kg)", value: "kg" },
            { label: "Ounces (oz)", value: "oz" },
            { label: "Pounds (lbs)", value: "lbs" },
            { label: "Stones (st)", value: "st" },
          ],
          defaultValue: "kg",
        },
        {
          name: "to",
          label: "To",
          type: "select",
          options: [
            { label: "Grams (g)", value: "g" },
            { label: "Kilograms (kg)", value: "kg" },
            { label: "Ounces (oz)", value: "oz" },
            { label: "Pounds (lbs)", value: "lbs" },
            { label: "Stones (st)", value: "st" },
          ],
          defaultValue: "lbs",
        },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const from = inputs.from as string;
        const to = inputs.to as string;
        if (!value && value !== 0) return null;

        const toGrams: Record<string, number> = {
          g: 1, kg: 1000, oz: 28.3495, lbs: 453.592, st: 6350.29,
        };
        const grams = value * (toGrams[from] || 1);
        const result = grams / (toGrams[to] || 1);

        return {
          primary: {
            label: `${value} ${from}`,
            value: formatNumber(result, 4),
            suffix: to,
          },
        };
      },
    },
    {
      id: "temperature",
      name: "Temperature",
      description: "Convert between Celsius, Fahrenheit, and Kelvin",
      fields: [
        {
          name: "value",
          label: "Temperature",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "from",
          label: "From",
          type: "select",
          options: [
            { label: "Celsius", value: "C" },
            { label: "Fahrenheit", value: "F" },
            { label: "Kelvin", value: "K" },
          ],
          defaultValue: "C",
        },
        {
          name: "to",
          label: "To",
          type: "select",
          options: [
            { label: "Celsius", value: "C" },
            { label: "Fahrenheit", value: "F" },
            { label: "Kelvin", value: "K" },
          ],
          defaultValue: "F",
        },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const from = inputs.from as string;
        const to = inputs.to as string;
        if (value === undefined || value === null) return null;
        if (typeof value !== "number") return null;

        // Convert to Celsius first
        let celsius: number;
        switch (from) {
          case "C": celsius = value; break;
          case "F": celsius = (value - 32) * 5 / 9; break;
          case "K": celsius = value - 273.15; break;
          default: return null;
        }

        let result: number;
        let suffix: string;
        switch (to) {
          case "C": result = celsius; suffix = "°C"; break;
          case "F": result = celsius * 9 / 5 + 32; suffix = "°F"; break;
          case "K": result = celsius + 273.15; suffix = "K"; break;
          default: return null;
        }

        return {
          primary: {
            label: `${value}°${from}`,
            value: formatNumber(result, 2),
            suffix,
          },
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "calorie-calculator"],
  faq: [
    {
      question: "How do I convert Celsius to Fahrenheit?",
      answer: "Multiply by 9/5, then add 32. Formula: °F = (°C x 9/5) + 32. For example, 100°C = 212°F.",
    },
    {
      question: "How do I convert kg to lbs?",
      answer: "Multiply by 2.20462. For example, 70 kg = 154.32 lbs.",
    },
    {
      question: "How do I convert cm to inches?",
      answer: "Divide by 2.54. For example, 175 cm = 68.9 inches.",
    },
  ],
  formula: "°F = (°C x 9/5) + 32 | 1 kg = 2.205 lbs | 1 cm = 0.3937 in",
};
