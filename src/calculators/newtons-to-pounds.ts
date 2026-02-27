import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const newtonsToPoundsCalculator: CalculatorDefinition = {
  slug: "newtons-to-pounds",
  title: "Newtons to Pounds-Force Converter",
  description:
    "Convert between Newtons (N) and pounds-force (lbf). Supports bidirectional conversion for engineering, physics, and everyday force measurements.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "newtons",
    "pounds-force",
    "lbf",
    "force conversion",
    "N to lbf",
    "lbf to N",
    "physics",
    "engineering",
  ],
  variants: [
    {
      slug: "n-to-lbf",
      title: "Newtons to Pounds-Force",
      fields: [
        {
          name: "newtons",
          label: "Force (Newtons)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const newtons = parseFloat(inputs.newtons as string);
        if (isNaN(newtons)) return { error: "Please enter a valid force in Newtons." };

        const lbf = newtons * 0.224809;
        const kgf = newtons * 0.101972;
        const dynes = newtons * 100000;

        return {
          results: [
            { label: "Pounds-Force (lbf)", value: formatNumber(lbf) },
            { label: "Kilogram-Force (kgf)", value: formatNumber(kgf) },
            { label: "Dynes", value: formatNumber(dynes) },
            { label: "Newtons (input)", value: formatNumber(newtons) },
          ],
        };
      },
    },
    {
      slug: "lbf-to-n",
      title: "Pounds-Force to Newtons",
      fields: [
        {
          name: "lbf",
          label: "Force (Pounds-Force)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const lbf = parseFloat(inputs.lbf as string);
        if (isNaN(lbf)) return { error: "Please enter a valid force in pounds-force." };

        const newtons = lbf * 4.44822;
        const kgf = newtons * 0.101972;
        const dynes = newtons * 100000;

        return {
          results: [
            { label: "Newtons (N)", value: formatNumber(newtons) },
            { label: "Kilogram-Force (kgf)", value: formatNumber(kgf) },
            { label: "Dynes", value: formatNumber(dynes) },
            { label: "Pounds-Force (input)", value: formatNumber(lbf) },
          ],
        };
      },
    },
    {
      slug: "force-comparison",
      title: "Force Unit Comparison",
      fields: [
        {
          name: "value",
          label: "Force Value",
          type: "number",
        },
        {
          name: "unit",
          label: "Input Unit",
          type: "select",
          options: [
            { label: "Newtons (N)", value: "N" },
            { label: "Pounds-Force (lbf)", value: "lbf" },
            { label: "Kilogram-Force (kgf)", value: "kgf" },
          ],
        },
      ],
      calculate(inputs) {
        const value = parseFloat(inputs.value as string);
        const unit = inputs.unit as string;
        if (isNaN(value)) return { error: "Please enter a valid force value." };

        let newtons: number;
        if (unit === "N") newtons = value;
        else if (unit === "lbf") newtons = value * 4.44822;
        else newtons = value * 9.80665;

        const lbf = newtons * 0.224809;
        const kgf = newtons * 0.101972;
        const dynes = newtons * 100000;
        const kN = newtons / 1000;

        return {
          results: [
            { label: "Newtons (N)", value: formatNumber(newtons) },
            { label: "Kilonewtons (kN)", value: formatNumber(kN) },
            { label: "Pounds-Force (lbf)", value: formatNumber(lbf) },
            { label: "Kilogram-Force (kgf)", value: formatNumber(kgf) },
            { label: "Dynes", value: formatNumber(dynes) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["horsepower-to-torque", "btu-to-kw", "micrograms-to-mg"],
  faq: [
    {
      question: "How many pounds-force are in one Newton?",
      answer:
        "One Newton equals approximately 0.2248 pounds-force (lbf). Conversely, one pound-force equals approximately 4.4482 Newtons.",
    },
    {
      question: "What is the difference between Newtons and pounds-force?",
      answer:
        "Both are units of force. The Newton is the SI unit defined as the force needed to accelerate 1 kg at 1 m/s². The pound-force is an imperial unit equal to the gravitational force on one pound of mass at standard gravity (9.80665 m/s²).",
    },
    {
      question: "When would I need to convert Newtons to pounds-force?",
      answer:
        "This conversion is common in engineering when working with specifications from different countries, in physics problem-solving, and when comparing force ratings on equipment like springs, load cells, or hydraulic systems.",
    },
  ],
  formula:
    "lbf = N × 0.224809 | N = lbf × 4.44822 | kgf = N × 0.101972 | 1 N = 100,000 dynes",
};
