import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pressureConverter: CalculatorDefinition = {
  slug: "pressure-converter",
  title: "Pressure Converter",
  description: "Free pressure converter. Convert between PSI, bar, atm, Pa, kPa, mmHg, and torr for engineering and science.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["pressure converter", "psi to bar", "bar to psi", "pressure calculator", "atm to psi"],
  variants: [
    {
      id: "convert",
      name: "Convert Pressure",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 14.7" },
        { name: "from", label: "From", type: "select", options: [
          { label: "PSI (lb/in²)", value: "psi" },
          { label: "Bar", value: "bar" },
          { label: "Atmosphere (atm)", value: "atm" },
          { label: "Pascal (Pa)", value: "pa" },
          { label: "Kilopascal (kPa)", value: "kpa" },
          { label: "mmHg (Torr)", value: "mmhg" },
        ], defaultValue: "psi" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const from = inputs.from as string;
        if (value === undefined) return null;
        const toPa: Record<string, number> = { psi: 6894.76, bar: 100000, atm: 101325, pa: 1, kpa: 1000, mmhg: 133.322 };
        const pa = value * (toPa[from] || 1);
        return {
          primary: { label: `${formatNumber(value)} ${from}`, value: from === "psi" ? `${formatNumber(pa / toPa.bar, 4)} bar` : `${formatNumber(pa / toPa.psi, 4)} PSI` },
          details: [
            { label: "PSI", value: formatNumber(pa / toPa.psi, 4) },
            { label: "Bar", value: formatNumber(pa / toPa.bar, 6) },
            { label: "Atmosphere", value: formatNumber(pa / toPa.atm, 6) },
            { label: "kPa", value: formatNumber(pa / 1000, 4) },
            { label: "mmHg", value: formatNumber(pa / toPa.mmhg, 2) },
            { label: "Pascal", value: formatNumber(pa, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "force-calculator", "density-calculator"],
  faq: [
    { question: "What is standard atmospheric pressure?", answer: "1 atm = 101,325 Pa = 14.696 PSI = 1.01325 bar = 760 mmHg. This is the average air pressure at sea level." },
  ],
  formula: "1 atm = 101,325 Pa = 14.696 PSI = 1.013 bar = 760 mmHg",
};
