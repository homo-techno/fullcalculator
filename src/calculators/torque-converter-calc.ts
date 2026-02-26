import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const torqueConverterCalculator: CalculatorDefinition = {
  slug: "torque-converter-calc",
  title: "Torque Converter Calculator",
  description:
    "Free torque unit converter. Convert between Newton-meters, foot-pounds, inch-pounds, and kilogram-centimeters instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "torque converter",
    "Nm to ft-lbs",
    "foot pounds to newton meters",
    "torque calculator",
    "in-lbs converter",
    "kg-cm torque",
    "torque unit conversion",
  ],
  variants: [
    {
      id: "torque-convert",
      name: "Torque Unit Converter",
      description: "Convert between common torque units",
      fields: [
        {
          name: "value",
          label: "Torque Value",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "from",
          label: "From Unit",
          type: "select",
          options: [
            { label: "Newton-meters (Nm)", value: "Nm" },
            { label: "Foot-pounds (ft-lbs)", value: "ft-lbs" },
            { label: "Inch-pounds (in-lbs)", value: "in-lbs" },
            { label: "Kilogram-centimeters (kg-cm)", value: "kg-cm" },
            { label: "Kilogram-meters (kg-m)", value: "kg-m" },
          ],
          defaultValue: "Nm",
        },
        {
          name: "to",
          label: "To Unit",
          type: "select",
          options: [
            { label: "Newton-meters (Nm)", value: "Nm" },
            { label: "Foot-pounds (ft-lbs)", value: "ft-lbs" },
            { label: "Inch-pounds (in-lbs)", value: "in-lbs" },
            { label: "Kilogram-centimeters (kg-cm)", value: "kg-cm" },
            { label: "Kilogram-meters (kg-m)", value: "kg-m" },
          ],
          defaultValue: "ft-lbs",
        },
      ],
      calculate: (inputs) => {
        const value = parseFloat(inputs.value as string);
        const from = inputs.from as string;
        const to = inputs.to as string;
        if (isNaN(value)) return null;

        // Convert to Nm first
        const toNm: Record<string, number> = {
          "Nm": 1,
          "ft-lbs": 1.35582,
          "in-lbs": 0.112985,
          "kg-cm": 0.0980665,
          "kg-m": 9.80665,
        };

        const nm = value * (toNm[from] || 1);
        const result = nm / (toNm[to] || 1);

        return {
          primary: {
            label: `${formatNumber(value)} ${from}`,
            value: formatNumber(result, 4),
            suffix: to,
          },
          details: [
            { label: "Newton-meters", value: formatNumber(nm, 4) + " Nm" },
            { label: "Foot-pounds", value: formatNumber(nm / toNm["ft-lbs"], 4) + " ft-lbs" },
            { label: "Inch-pounds", value: formatNumber(nm / toNm["in-lbs"], 4) + " in-lbs" },
            { label: "Kilogram-cm", value: formatNumber(nm / toNm["kg-cm"], 4) + " kg-cm" },
          ],
        };
      },
    },
    {
      id: "bolt-torque",
      name: "Bolt Torque Reference",
      description: "Recommended torque for common bolt sizes",
      fields: [
        {
          name: "boltSize",
          label: "Bolt Size",
          type: "select",
          options: [
            { label: "M6 (1/4\")", value: "M6" },
            { label: "M8 (5/16\")", value: "M8" },
            { label: "M10 (3/8\")", value: "M10" },
            { label: "M12 (1/2\")", value: "M12" },
            { label: "M14 (9/16\")", value: "M14" },
            { label: "M16 (5/8\")", value: "M16" },
            { label: "M20 (3/4\")", value: "M20" },
            { label: "M24 (1\")", value: "M24" },
          ],
          defaultValue: "M10",
        },
        {
          name: "grade",
          label: "Bolt Grade",
          type: "select",
          options: [
            { label: "Grade 8.8 (Grade 5)", value: "8.8" },
            { label: "Grade 10.9 (Grade 8)", value: "10.9" },
            { label: "Grade 12.9", value: "12.9" },
          ],
          defaultValue: "8.8",
        },
      ],
      calculate: (inputs) => {
        const boltSize = inputs.boltSize as string;
        const grade = inputs.grade as string;

        // Recommended torque in Nm for dry (unlubricated) bolts
        const torqueTable: Record<string, Record<string, number>> = {
          "M6": { "8.8": 9.9, "10.9": 14.1, "12.9": 16.5 },
          "M8": { "8.8": 24, "10.9": 34, "12.9": 40 },
          "M10": { "8.8": 48, "10.9": 68, "12.9": 79 },
          "M12": { "8.8": 83, "10.9": 117, "12.9": 137 },
          "M14": { "8.8": 132, "10.9": 186, "12.9": 218 },
          "M16": { "8.8": 206, "10.9": 290, "12.9": 339 },
          "M20": { "8.8": 402, "10.9": 566, "12.9": 663 },
          "M24": { "8.8": 694, "10.9": 978, "12.9": 1145 },
        };

        const nm = torqueTable[boltSize]?.[grade];
        if (!nm) return null;

        const ftLbs = nm / 1.35582;

        return {
          primary: {
            label: "Recommended Torque",
            value: formatNumber(nm, 1),
            suffix: "Nm",
          },
          details: [
            { label: "In Foot-pounds", value: formatNumber(ftLbs, 1) + " ft-lbs" },
            { label: "In Inch-pounds", value: formatNumber(nm / 0.112985, 1) + " in-lbs" },
            { label: "Bolt Size", value: boltSize },
            { label: "Grade", value: grade },
          ],
          note: "Values are for dry, unlubricated bolts. Reduce torque by ~25% for lubricated bolts.",
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "force-calculator", "thread-pitch-calc"],
  faq: [
    {
      question: "How do I convert Nm to ft-lbs?",
      answer:
        "Divide Newton-meters by 1.35582 to get foot-pounds. For example, 100 Nm = 73.76 ft-lbs. Alternatively, multiply ft-lbs by 1.35582 to get Nm.",
    },
    {
      question: "What is the difference between torque and force?",
      answer:
        "Force is a push or pull measured in Newtons. Torque is a rotational force calculated as Force x Distance from pivot. It is measured in Newton-meters (Nm) or foot-pounds (ft-lbs).",
    },
  ],
  formula:
    "1 Nm = 0.7376 ft-lbs = 8.851 in-lbs = 10.197 kg-cm | Torque = Force x Distance",
};
