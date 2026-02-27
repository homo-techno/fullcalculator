import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const microgramsToMgCalculator: CalculatorDefinition = {
  slug: "micrograms-to-mg",
  title: "Micrograms to Milligrams Converter",
  description:
    "Convert between micrograms (\u00B5g) and milligrams (mg) for pharmaceutical dosing, nutritional supplements, and laboratory measurements.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "micrograms",
    "milligrams",
    "mcg",
    "\u00B5g",
    "mg",
    "dosage",
    "pharmaceutical",
    "supplements",
    "vitamins",
    "medication",
  ],
  variants: [
    {
      slug: "mcg-to-mg",
      title: "Micrograms to Milligrams",
      fields: [
        {
          name: "mcg",
          label: "Mass (micrograms, \u00B5g)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const mcg = parseFloat(inputs.mcg as string);
        if (isNaN(mcg)) return { error: "Please enter a valid microgram value." };

        const mg = mcg / 1000;
        const g = mcg / 1000000;
        const ng = mcg * 1000;
        const grains = mcg * 0.0000154324;

        return {
          results: [
            { label: "Milligrams (mg)", value: formatNumber(mg) },
            { label: "Grams (g)", value: formatNumber(g) },
            { label: "Nanograms (ng)", value: formatNumber(ng) },
            { label: "Grains (gr)", value: formatNumber(grains) },
          ],
        };
      },
    },
    {
      slug: "mg-to-mcg",
      title: "Milligrams to Micrograms",
      fields: [
        {
          name: "mg",
          label: "Mass (milligrams, mg)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const mg = parseFloat(inputs.mg as string);
        if (isNaN(mg)) return { error: "Please enter a valid milligram value." };

        const mcg = mg * 1000;
        const g = mg / 1000;
        const ng = mcg * 1000;
        const grains = mg * 0.0154324;

        return {
          results: [
            { label: "Micrograms (\u00B5g)", value: formatNumber(mcg) },
            { label: "Grams (g)", value: formatNumber(g) },
            { label: "Nanograms (ng)", value: formatNumber(ng) },
            { label: "Grains (gr)", value: formatNumber(grains) },
          ],
        };
      },
    },
    {
      slug: "dosage-conversion",
      title: "Dosage Unit Converter",
      fields: [
        {
          name: "value",
          label: "Mass Value",
          type: "number",
        },
        {
          name: "unit",
          label: "Input Unit",
          type: "select",
          options: [
            { label: "Micrograms (\u00B5g/mcg)", value: "mcg" },
            { label: "Milligrams (mg)", value: "mg" },
            { label: "Grams (g)", value: "g" },
            { label: "Nanograms (ng)", value: "ng" },
          ],
        },
      ],
      calculate(inputs) {
        const value = parseFloat(inputs.value as string);
        const unit = inputs.unit as string;
        if (isNaN(value)) return { error: "Please enter a valid mass value." };

        let mcg: number;
        if (unit === "mcg") mcg = value;
        else if (unit === "mg") mcg = value * 1000;
        else if (unit === "g") mcg = value * 1000000;
        else mcg = value / 1000;

        const mg = mcg / 1000;
        const g = mcg / 1000000;
        const ng = mcg * 1000;
        const kg = g / 1000;
        const grains = mcg * 0.0000154324;

        return {
          results: [
            { label: "Micrograms (\u00B5g)", value: formatNumber(mcg) },
            { label: "Milligrams (mg)", value: formatNumber(mg) },
            { label: "Grams (g)", value: formatNumber(g) },
            { label: "Nanograms (ng)", value: formatNumber(ng) },
            { label: "Kilograms (kg)", value: formatNumber(kg) },
            { label: "Grains (gr)", value: formatNumber(grains) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["stone-to-pounds-calc", "newtons-to-pounds", "light-years-to-km"],
  faq: [
    {
      question: "How many micrograms are in a milligram?",
      answer:
        "There are 1,000 micrograms (\u00B5g) in one milligram (mg). The prefix 'micro' means one-millionth, and 'milli' means one-thousandth, so 1 mg = 1,000 \u00B5g.",
    },
    {
      question: "Why is the microgram abbreviated as both \u00B5g and mcg?",
      answer:
        "The symbol \u00B5g uses the Greek letter mu (\u00B5) and is the official SI abbreviation. In medical and pharmaceutical contexts, 'mcg' is preferred to avoid confusion with 'mg' in handwritten prescriptions, reducing the risk of dosing errors.",
    },
    {
      question: "What common medications are measured in micrograms?",
      answer:
        "Many potent medications are dosed in micrograms, including thyroid hormones (levothyroxine, 25-200 mcg), vitamin B12 supplements (100-1,000 mcg), folic acid (400-800 mcg), and certain heart medications like digoxin (125-250 mcg).",
    },
  ],
  formula:
    "mg = \u00B5g / 1000 | \u00B5g = mg x 1000 | g = \u00B5g / 1,000,000 | ng = \u00B5g x 1000",
};
