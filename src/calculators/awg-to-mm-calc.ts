import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const awgToMmCalculator: CalculatorDefinition = {
  slug: "awg-to-mm-calc",
  title: "AWG to mm² Wire Size Converter",
  description:
    "Free AWG to mm² wire size converter. Convert American Wire Gauge to metric cross-sectional area (mm²) and diameter (mm). Includes resistance values.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "AWG to mm",
    "wire gauge to mm",
    "AWG to mm2",
    "wire size converter",
    "American Wire Gauge",
    "wire diameter calculator",
    "AWG metric conversion",
  ],
  variants: [
    {
      id: "awg-to-metric",
      name: "AWG to Metric",
      description: "Convert AWG gauge to mm² area and mm diameter",
      fields: [
        {
          name: "awg",
          label: "AWG Gauge",
          type: "select",
          options: [
            { label: "30 AWG", value: "30" },
            { label: "28 AWG", value: "28" },
            { label: "26 AWG", value: "26" },
            { label: "24 AWG", value: "24" },
            { label: "22 AWG", value: "22" },
            { label: "20 AWG", value: "20" },
            { label: "18 AWG", value: "18" },
            { label: "16 AWG", value: "16" },
            { label: "14 AWG", value: "14" },
            { label: "12 AWG", value: "12" },
            { label: "10 AWG", value: "10" },
            { label: "8 AWG", value: "8" },
            { label: "6 AWG", value: "6" },
            { label: "4 AWG", value: "4" },
            { label: "2 AWG", value: "2" },
            { label: "1 AWG", value: "1" },
            { label: "1/0 AWG", value: "0" },
            { label: "2/0 AWG", value: "-1" },
            { label: "3/0 AWG", value: "-2" },
            { label: "4/0 AWG", value: "-3" },
          ],
          defaultValue: "12",
        },
      ],
      calculate: (inputs) => {
        const awgNum = parseFloat(inputs.awg as string);
        if (isNaN(awgNum)) return null;

        // AWG formula: diameter in mm = 0.127 * 92^((36-n)/39)
        const diameterMm = 0.127 * Math.pow(92, (36 - awgNum) / 39);
        const areaMm2 = Math.PI * Math.pow(diameterMm / 2, 2);
        const diameterIn = diameterMm / 25.4;
        const areaCircMils = Math.pow(diameterIn * 1000, 2);

        // Copper resistance in ohms per 1000ft at 20°C
        const resistancePer1000ft = 10.371 / areaCircMils * 1000;

        const awgLabel = awgNum <= 0 ? Math.abs(awgNum - 1) + "/0 AWG" : awgNum + " AWG";

        return {
          primary: {
            label: "Cross-sectional Area",
            value: formatNumber(areaMm2, 3),
            suffix: "mm²",
          },
          details: [
            { label: "Wire Gauge", value: awgLabel },
            { label: "Diameter", value: formatNumber(diameterMm, 3) + " mm" },
            { label: "Diameter (inches)", value: formatNumber(diameterIn, 4) + " in" },
            { label: "Area (circular mils)", value: formatNumber(Math.round(areaCircMils)) + " cmil" },
            { label: "Resistance (copper)", value: formatNumber(resistancePer1000ft, 3) + " Ω/1000ft" },
          ],
        };
      },
    },
    {
      id: "mm2-to-awg",
      name: "mm² to AWG",
      description: "Find the closest AWG for a given mm² area",
      fields: [
        {
          name: "mm2",
          label: "Cross-sectional Area (mm²)",
          type: "number",
          placeholder: "e.g. 2.5",
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const mm2 = parseFloat(inputs.mm2 as string);
        if (isNaN(mm2) || mm2 <= 0) return null;

        const diameterMm = 2 * Math.sqrt(mm2 / Math.PI);
        // Reverse AWG formula: n = 36 - 39 * log(d/0.127) / log(92)
        const awgExact = 36 - 39 * Math.log(diameterMm / 0.127) / Math.log(92);
        const awgRounded = Math.round(awgExact);

        // Compute exact values for rounded AWG
        const exactDiameter = 0.127 * Math.pow(92, (36 - awgRounded) / 39);
        const exactArea = Math.PI * Math.pow(exactDiameter / 2, 2);

        const awgLabel = awgRounded <= 0 ? Math.abs(awgRounded - 1) + "/0 AWG" : awgRounded + " AWG";

        return {
          primary: {
            label: "Nearest AWG",
            value: awgLabel,
          },
          details: [
            { label: "Input Area", value: formatNumber(mm2, 3) + " mm²" },
            { label: "Input Diameter", value: formatNumber(diameterMm, 3) + " mm" },
            { label: "Exact AWG (decimal)", value: formatNumber(awgExact, 2) },
            { label: "Nearest AWG Area", value: formatNumber(exactArea, 3) + " mm²" },
            { label: "Nearest AWG Diameter", value: formatNumber(exactDiameter, 3) + " mm" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wire-gauge-ampacity", "ohms-law-calculator", "unit-converter"],
  faq: [
    {
      question: "How is AWG calculated?",
      answer:
        "AWG uses the formula: diameter (mm) = 0.127 x 92^((36-n)/39), where n is the gauge number. Lower gauge numbers mean thicker wire. Each 6-gauge decrease doubles the wire diameter, and each 3-gauge decrease doubles the cross-sectional area.",
    },
    {
      question: "What are common AWG to mm² equivalents?",
      answer:
        "Common equivalents: 14 AWG = 2.08 mm², 12 AWG = 3.31 mm², 10 AWG = 5.26 mm², 8 AWG = 8.37 mm², 6 AWG = 13.30 mm², 4 AWG = 21.15 mm², 2 AWG = 33.63 mm².",
    },
    {
      question: "Why does Europe use mm² instead of AWG?",
      answer:
        "Europe and most of the world use the IEC 60228 standard which specifies wire sizes by cross-sectional area in mm². AWG is primarily used in North America and follows a logarithmic scale based on wire drawing dies from the 19th century.",
    },
  ],
  formula:
    "Diameter (mm) = 0.127 x 92^((36-n)/39) | Area (mm²) = π x (d/2)² | AWG n = 36 - 39 x log(d/0.127) / log(92)",
};
