import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const barToPsiConverter: CalculatorDefinition = {
  slug: "bar-to-psi-converter",
  title: "Bar to PSI Converter",
  description:
    "Free bar to PSI pressure converter. Quickly convert bar to PSI with our easy calculator. 1 bar = 14.5038 PSI.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "bar to psi",
    "psi to bar",
    "pressure converter",
    "bar converter",
    "psi converter",
  ],
  variants: [
    {
      id: "bar-to-psi",
      name: "Bar to PSI",
      fields: [
        {
          name: "bar",
          label: "Bar",
          type: "number",
          placeholder: "e.g. 1",
        },
      ],
      calculate: (inputs) => {
        const bar = inputs.bar as number;
        if (bar === undefined || bar === null) return null;
        const psi = bar * 14.5038;
        const kpa = bar * 100;
        const atm = bar / 1.01325;
        return {
          primary: {
            label: `${formatNumber(bar, 4)} bar`,
            value: `${formatNumber(psi, 4)} PSI`,
          },
          details: [
            { label: "PSI", value: formatNumber(psi, 4) },
            { label: "kPa", value: formatNumber(kpa, 4) },
            { label: "Atmospheres", value: formatNumber(atm, 6) },
            { label: "mmHg", value: formatNumber(bar * 750.062, 4) },
          ],
        };
      },
    },
    {
      id: "psi-to-bar",
      name: "PSI to Bar",
      fields: [
        {
          name: "psi",
          label: "PSI",
          type: "number",
          placeholder: "e.g. 14.7",
        },
      ],
      calculate: (inputs) => {
        const psi = inputs.psi as number;
        if (psi === undefined || psi === null) return null;
        const bar = psi * 0.0689476;
        const kpa = bar * 100;
        const atm = psi / 14.696;
        return {
          primary: {
            label: `${formatNumber(psi, 4)} PSI`,
            value: `${formatNumber(bar, 6)} bar`,
          },
          details: [
            { label: "Bar", value: formatNumber(bar, 6) },
            { label: "kPa", value: formatNumber(kpa, 4) },
            { label: "Atmospheres", value: formatNumber(atm, 6) },
            { label: "mmHg", value: formatNumber(psi * 51.7149, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["psi-to-bar-converter", "pressure-calculator", "unit-converter"],
  faq: [
    {
      question: "How many PSI is 1 bar?",
      answer:
        "1 bar equals 14.5038 PSI. Bar is commonly used internationally, while PSI (pounds per square inch) is standard in the US.",
    },
    {
      question: "What is standard atmospheric pressure in bar and PSI?",
      answer:
        "Standard atmospheric pressure is 1.01325 bar or 14.696 PSI (also 1 atm or 101.325 kPa).",
    },
  ],
  formula: "PSI = bar × 14.5038 | bar = PSI × 0.0689476",
};
