import type { CalculatorDefinition } from "./types";

export const roundingCalculator: CalculatorDefinition = {
  slug: "rounding-calculator",
  title: "Rounding Calculator",
  description: "Free rounding calculator. Round numbers to any decimal place, significant figures, or to the nearest whole number, ten, hundred, or thousand.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["rounding calculator", "round to nearest", "round decimal", "significant figures", "sig fig calculator"],
  variants: [
    {
      id: "round",
      name: "Round a Number",
      fields: [
        { name: "number", label: "Number", type: "number", placeholder: "e.g. 3.14159", step: 0.000001 },
        { name: "places", label: "Round to", type: "select", options: [
          { label: "Nearest whole number", value: "0" },
          { label: "1 decimal place", value: "1" },
          { label: "2 decimal places", value: "2" },
          { label: "3 decimal places", value: "3" },
          { label: "4 decimal places", value: "4" },
          { label: "Nearest 10", value: "-1" },
          { label: "Nearest 100", value: "-2" },
          { label: "Nearest 1000", value: "-3" },
        ], defaultValue: "2" },
      ],
      calculate: (inputs) => {
        const n = inputs.number as number;
        const places = parseInt(inputs.places as string);
        if (n === undefined) return null;
        const factor = Math.pow(10, places);
        const rounded = Math.round(n * factor) / factor;
        const floor = Math.floor(n * factor) / factor;
        const ceil = Math.ceil(n * factor) / factor;
        return {
          primary: { label: "Rounded", value: places >= 0 ? rounded.toFixed(places) : `${rounded}` },
          details: [
            { label: "Rounded (half up)", value: places >= 0 ? rounded.toFixed(places) : `${rounded}` },
            { label: "Rounded down (floor)", value: places >= 0 ? floor.toFixed(places) : `${floor}` },
            { label: "Rounded up (ceil)", value: places >= 0 ? ceil.toFixed(places) : `${ceil}` },
            { label: "Truncated", value: places >= 0 ? (Math.trunc(n * factor) / factor).toFixed(places) : `${Math.trunc(n * factor) / factor}` },
          ],
        };
      },
    },
    {
      id: "sigfig",
      name: "Significant Figures",
      description: "Round to a specified number of significant figures",
      fields: [
        { name: "number", label: "Number", type: "number", placeholder: "e.g. 0.004567", step: 0.000001 },
        { name: "sigfigs", label: "Significant Figures", type: "select", options: [
          { label: "1 sig fig", value: "1" }, { label: "2 sig figs", value: "2" },
          { label: "3 sig figs", value: "3" }, { label: "4 sig figs", value: "4" },
        ], defaultValue: "3" },
      ],
      calculate: (inputs) => {
        const n = inputs.number as number;
        const sf = parseInt(inputs.sigfigs as string) || 3;
        if (n === undefined || n === 0) return null;
        const d = Math.ceil(Math.log10(Math.abs(n)));
        const power = sf - d;
        const magnitude = Math.pow(10, power);
        const result = Math.round(n * magnitude) / magnitude;
        return {
          primary: { label: `${sf} Significant Figures`, value: result.toPrecision(sf) },
          details: [
            { label: "Original", value: `${n}` },
            { label: "Scientific notation", value: result.toExponential(sf - 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "scientific-calculator", "average-calculator"],
  faq: [
    { question: "What is rounding?", answer: "Rounding replaces a number with an approximate value. The rule: if the digit after your rounding position is 5 or more, round up; otherwise, round down. 3.456 rounded to 2 places = 3.46." },
  ],
  formula: "Round(x, n) = floor(x × 10^n + 0.5) / 10^n",
};
