import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boylesLawCalculator: CalculatorDefinition = {
  slug: "boyles-law-calculator",
  title: "Boyle's Law Calculator",
  description:
    "Free Boyle's Law calculator. Compute pressure or volume using P1V1 = P2V2 for an ideal gas at constant temperature.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "boyles law",
    "pressure volume",
    "ideal gas",
    "P1V1",
    "isothermal",
  ],
  variants: [
    {
      id: "find-p2",
      name: "Find P2",
      fields: [
        {
          name: "p1",
          label: "Initial Pressure (P1)",
          type: "number",
          placeholder: "e.g. 101325",
        },
        {
          name: "v1",
          label: "Initial Volume (V1)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "v2",
          label: "Final Volume (V2)",
          type: "number",
          placeholder: "e.g. 4",
        },
      ],
      calculate: (inputs) => {
        const p1 = inputs.p1 as number;
        const v1 = inputs.v1 as number;
        const v2 = inputs.v2 as number;
        if (!p1 || !v1 || !v2) return null;
        const p2 = (p1 * v1) / v2;
        return {
          primary: { label: "Final Pressure (P2)", value: formatNumber(p2, 4) },
          details: [
            { label: "P1", value: formatNumber(p1, 4) },
            { label: "V1", value: formatNumber(v1, 4) },
            { label: "V2", value: formatNumber(v2, 4) },
            { label: "P1 × V1", value: formatNumber(p1 * v1, 4) },
          ],
        };
      },
    },
    {
      id: "find-v2",
      name: "Find V2",
      fields: [
        {
          name: "p1",
          label: "Initial Pressure (P1)",
          type: "number",
          placeholder: "e.g. 101325",
        },
        {
          name: "v1",
          label: "Initial Volume (V1)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "p2",
          label: "Final Pressure (P2)",
          type: "number",
          placeholder: "e.g. 50662.5",
        },
      ],
      calculate: (inputs) => {
        const p1 = inputs.p1 as number;
        const v1 = inputs.v1 as number;
        const p2 = inputs.p2 as number;
        if (!p1 || !v1 || !p2) return null;
        const v2 = (p1 * v1) / p2;
        return {
          primary: { label: "Final Volume (V2)", value: formatNumber(v2, 4) },
          details: [
            { label: "P1", value: formatNumber(p1, 4) },
            { label: "V1", value: formatNumber(v1, 4) },
            { label: "P2", value: formatNumber(p2, 4) },
            { label: "P1 × V1", value: formatNumber(p1 * v1, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["charles-law-calculator", "dilution-calculator"],
  faq: [
    {
      question: "What is Boyle's Law?",
      answer:
        "Boyle's Law states that the pressure of a gas is inversely proportional to its volume when temperature is held constant: P1V1 = P2V2.",
    },
    {
      question: "When does Boyle's Law apply?",
      answer:
        "Boyle's Law applies to ideal gases at constant temperature (isothermal processes). Real gases approximate this behavior at low pressures and high temperatures.",
    },
  ],
  formula:
    "P1 × V1 = P2 × V2, where P is pressure and V is volume at constant temperature.",
};
