import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const atmToPascal: CalculatorDefinition = {
  slug: "atm-to-pascal",
  title: "Atmospheres to Pascals",
  description: "Free atmospheres to Pascals converter. Convert pressure from atm to Pa instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["atm to pascal", "atmospheres to pascals", "atm to Pa", "pressure conversion"],
  variants: [
    {
      id: "atm-to-pascal",
      name: "Atmospheres to Pascals",
      fields: [
        { name: "atm", label: "Pressure (atm)", type: "number", placeholder: "e.g. 1", suffix: "atm" },
      ],
      calculate: (inputs) => {
        const atm = inputs.atm as number;
        if (atm === undefined) return null;
        const pascals = atm * 101325;
        const kPa = pascals / 1000;
        const bar = atm * 1.01325;
        const psi = atm * 14.696;
        const mmHg = atm * 760;
        const torr = atm * 760;
        return {
          primary: { label: "Pascals", value: formatNumber(pascals, 0), suffix: "Pa" },
          details: [
            { label: "Atmospheres", value: `${formatNumber(atm, 6)} atm` },
            { label: "Pascals", value: `${formatNumber(pascals, 0)} Pa` },
            { label: "Kilopascals", value: `${formatNumber(kPa, 3)} kPa` },
            { label: "Bar", value: `${formatNumber(bar, 5)} bar` },
            { label: "PSI", value: `${formatNumber(psi, 3)} psi` },
            { label: "mmHg (Torr)", value: `${formatNumber(mmHg, 2)} mmHg` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pascal-to-atm", "pressure", "unit-converter"],
  faq: [
    { question: "How many Pascals in 1 atmosphere?", answer: "One standard atmosphere equals exactly 101,325 Pascals (Pa), or 101.325 kPa." },
    { question: "What is standard atmospheric pressure?", answer: "Standard atmospheric pressure (1 atm) is defined as 101,325 Pa. This is the average pressure at sea level." },
  ],
  formula: "Pa = atm × 101,325",
};
