import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pascalToAtm: CalculatorDefinition = {
  slug: "pascal-to-atm",
  title: "Pascals to Atmospheres",
  description: "Free Pascals to atmospheres converter. Convert pressure from Pa to atm instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["pascal to atm", "pascals to atmospheres", "Pa to atm", "pressure conversion"],
  variants: [
    {
      id: "pascal-to-atm",
      name: "Pascals to Atmospheres",
      fields: [
        { name: "pascals", label: "Pressure (Pa)", type: "number", placeholder: "e.g. 101325", suffix: "Pa" },
      ],
      calculate: (inputs) => {
        const pascals = inputs.pascals as number;
        if (pascals === undefined) return null;
        const atm = pascals / 101325;
        const kPa = pascals / 1000;
        const bar = pascals / 100000;
        const psi = pascals * 0.000145038;
        const mmHg = pascals * 0.00750062;
        return {
          primary: { label: "Atmospheres", value: formatNumber(atm, 6), suffix: "atm" },
          details: [
            { label: "Pascals", value: `${formatNumber(pascals, 0)} Pa` },
            { label: "Atmospheres", value: `${formatNumber(atm, 6)} atm` },
            { label: "Kilopascals", value: `${formatNumber(kPa, 3)} kPa` },
            { label: "Bar", value: `${formatNumber(bar, 5)} bar` },
            { label: "PSI", value: `${formatNumber(psi, 4)} psi` },
            { label: "mmHg (Torr)", value: `${formatNumber(mmHg, 2)} mmHg` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["atm-to-pascal", "pressure", "unit-converter"],
  faq: [
    { question: "How do I convert Pascals to atmospheres?", answer: "Divide the pressure in Pascals by 101,325. For example, 101,325 Pa = 1 atm." },
    { question: "What is a Pascal?", answer: "A Pascal (Pa) is the SI unit of pressure, defined as one Newton per square meter. Standard atmospheric pressure is 101,325 Pa." },
  ],
  formula: "atm = Pa ÷ 101,325",
};
