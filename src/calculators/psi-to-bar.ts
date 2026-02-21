import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const psiToBarConverter: CalculatorDefinition = {
  slug: "psi-to-bar-converter",
  title: "PSI to Bar Converter",
  description:
    "Free PSI to bar pressure converter. Quickly convert between PSI and bar with our easy calculator. 1 PSI = 0.0689476 bar.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "psi to bar",
    "bar to psi",
    "pressure converter",
    "psi converter",
    "bar converter",
  ],
  variants: [
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
  ],
  relatedSlugs: ["bar-to-psi-converter", "pressure-calculator", "unit-converter"],
  faq: [
    {
      question: "How many bar is 1 PSI?",
      answer:
        "1 PSI equals 0.0689476 bar. PSI (pounds per square inch) is commonly used in the US, while bar is used internationally.",
    },
    {
      question: "What is the conversion factor between PSI and bar?",
      answer:
        "To convert PSI to bar, multiply by 0.0689476. To convert bar to PSI, multiply by 14.5038.",
    },
  ],
  formula: "bar = PSI × 0.0689476 | PSI = bar × 14.5038",
};
