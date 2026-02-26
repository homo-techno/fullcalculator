import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const threadPitchCalculator: CalculatorDefinition = {
  slug: "thread-pitch-calc",
  title: "Thread Pitch Calculator",
  description:
    "Free thread pitch and TPI calculator. Convert between metric thread pitch (mm) and imperial threads per inch (TPI). Reference common thread sizes.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "thread pitch calculator",
    "TPI calculator",
    "metric thread pitch",
    "threads per inch",
    "bolt thread size",
    "thread conversion",
    "screw thread calculator",
  ],
  variants: [
    {
      id: "pitch-to-tpi",
      name: "Pitch to TPI Converter",
      description: "Convert metric pitch (mm) to threads per inch",
      fields: [
        {
          name: "pitch",
          label: "Thread Pitch (mm)",
          type: "number",
          placeholder: "e.g. 1.5",
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const pitch = parseFloat(inputs.pitch as string);
        if (isNaN(pitch) || pitch <= 0) return null;

        const tpi = 25.4 / pitch;
        const leadPerRev = pitch;

        return {
          primary: {
            label: "Threads Per Inch",
            value: formatNumber(tpi, 3),
            suffix: "TPI",
          },
          details: [
            { label: "Pitch", value: formatNumber(pitch, 3) + " mm" },
            { label: "Lead per Revolution", value: formatNumber(leadPerRev, 3) + " mm" },
            { label: "Pitch in Inches", value: formatNumber(pitch / 25.4, 5) + " in" },
          ],
        };
      },
    },
    {
      id: "tpi-to-pitch",
      name: "TPI to Pitch Converter",
      description: "Convert threads per inch to metric pitch (mm)",
      fields: [
        {
          name: "tpi",
          label: "Threads Per Inch (TPI)",
          type: "number",
          placeholder: "e.g. 20",
        },
      ],
      calculate: (inputs) => {
        const tpi = parseFloat(inputs.tpi as string);
        if (isNaN(tpi) || tpi <= 0) return null;

        const pitch = 25.4 / tpi;

        return {
          primary: {
            label: "Thread Pitch",
            value: formatNumber(pitch, 3),
            suffix: "mm",
          },
          details: [
            { label: "TPI", value: formatNumber(tpi) },
            { label: "Pitch in Inches", value: formatNumber(1 / tpi, 5) + " in" },
            { label: "Threads per cm", value: formatNumber(tpi / 2.54, 2) },
          ],
        };
      },
    },
    {
      id: "common-threads",
      name: "Common Thread Reference",
      description: "Look up standard metric and imperial thread sizes",
      fields: [
        {
          name: "threadType",
          label: "Thread Standard",
          type: "select",
          options: [
            { label: "M3 x 0.5 (Metric Fine)", value: "M3F" },
            { label: "M4 x 0.7 (Metric Coarse)", value: "M4C" },
            { label: "M5 x 0.8 (Metric Coarse)", value: "M5C" },
            { label: "M6 x 1.0 (Metric Coarse)", value: "M6C" },
            { label: "M8 x 1.25 (Metric Coarse)", value: "M8C" },
            { label: "M10 x 1.5 (Metric Coarse)", value: "M10C" },
            { label: "M12 x 1.75 (Metric Coarse)", value: "M12C" },
            { label: "1/4\"-20 UNC", value: "14-20" },
            { label: "5/16\"-18 UNC", value: "516-18" },
            { label: "3/8\"-16 UNC", value: "38-16" },
            { label: "1/2\"-13 UNC", value: "12-13" },
            { label: "5/8\"-11 UNC", value: "58-11" },
            { label: "3/4\"-10 UNC", value: "34-10" },
          ],
          defaultValue: "M8C",
        },
      ],
      calculate: (inputs) => {
        const threadType = inputs.threadType as string;

        const threads: Record<string, { name: string; pitch: number; majorDia: number; minorDia: number; tpi: number }> = {
          "M3F": { name: "M3 x 0.5", pitch: 0.5, majorDia: 3.0, minorDia: 2.459, tpi: 50.8 },
          "M4C": { name: "M4 x 0.7", pitch: 0.7, majorDia: 4.0, minorDia: 3.242, tpi: 36.29 },
          "M5C": { name: "M5 x 0.8", pitch: 0.8, majorDia: 5.0, minorDia: 4.134, tpi: 31.75 },
          "M6C": { name: "M6 x 1.0", pitch: 1.0, majorDia: 6.0, minorDia: 4.917, tpi: 25.4 },
          "M8C": { name: "M8 x 1.25", pitch: 1.25, majorDia: 8.0, minorDia: 6.647, tpi: 20.32 },
          "M10C": { name: "M10 x 1.5", pitch: 1.5, majorDia: 10.0, minorDia: 8.376, tpi: 16.93 },
          "M12C": { name: "M12 x 1.75", pitch: 1.75, majorDia: 12.0, minorDia: 10.106, tpi: 14.51 },
          "14-20": { name: "1/4\"-20 UNC", pitch: 1.27, majorDia: 6.35, minorDia: 5.19, tpi: 20 },
          "516-18": { name: "5/16\"-18 UNC", pitch: 1.411, majorDia: 7.938, minorDia: 6.60, tpi: 18 },
          "38-16": { name: "3/8\"-16 UNC", pitch: 1.5875, majorDia: 9.525, minorDia: 8.03, tpi: 16 },
          "12-13": { name: "1/2\"-13 UNC", pitch: 1.954, majorDia: 12.7, minorDia: 10.80, tpi: 13 },
          "58-11": { name: "5/8\"-11 UNC", pitch: 2.309, majorDia: 15.875, minorDia: 13.57, tpi: 11 },
          "34-10": { name: "3/4\"-10 UNC", pitch: 2.54, majorDia: 19.05, minorDia: 16.51, tpi: 10 },
        };

        const t = threads[threadType];
        if (!t) return null;

        return {
          primary: {
            label: t.name,
            value: formatNumber(t.pitch, 3),
            suffix: "mm pitch",
          },
          details: [
            { label: "Threads Per Inch", value: formatNumber(t.tpi, 2) + " TPI" },
            { label: "Major Diameter", value: formatNumber(t.majorDia, 3) + " mm" },
            { label: "Minor Diameter", value: formatNumber(t.minorDia, 3) + " mm" },
            { label: "Tap Drill (approx)", value: formatNumber(t.minorDia, 1) + " mm" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["torque-converter-calc", "unit-converter", "awg-to-mm-calc"],
  faq: [
    {
      question: "How do I convert thread pitch to TPI?",
      answer:
        "Divide 25.4 by the pitch in millimeters. For example, a 1.5mm pitch = 25.4 / 1.5 = 16.93 TPI. Conversely, divide 25.4 by TPI to get pitch in mm.",
    },
    {
      question: "What is the difference between UNC and UNF threads?",
      answer:
        "UNC (Unified National Coarse) has fewer threads per inch and is the most common standard. UNF (Unified National Fine) has more threads per inch, providing greater tensile strength and finer adjustment but is more prone to cross-threading.",
    },
  ],
  formula: "TPI = 25.4 / Pitch (mm) | Pitch (mm) = 25.4 / TPI",
};
