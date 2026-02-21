import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pcbTraceWidthCalculator: CalculatorDefinition = {
  slug: "pcb-trace-width-calculator",
  title: "PCB Trace Width Calculator",
  description:
    "Free PCB trace width calculator. Calculate required PCB trace width for a given current using IPC-2221 standards. Supports internal and external layers.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "pcb trace width",
    "pcb calculator",
    "trace width calculator",
    "IPC-2221",
    "printed circuit board",
    "pcb design",
  ],
  variants: [
    {
      id: "external-layer",
      name: "External Layer Trace",
      description: "Calculate trace width for external (outer) PCB layers using IPC-2221",
      fields: [
        {
          name: "current",
          label: "Current (A)",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "tempRise",
          label: "Allowable Temperature Rise (°C)",
          type: "number",
          placeholder: "e.g. 10",
          defaultValue: 10,
        },
        {
          name: "thickness",
          label: "Copper Thickness (oz/ft²)",
          type: "select",
          options: [
            { label: "0.5 oz (17.5 µm)", value: "0.5" },
            { label: "1 oz (35 µm)", value: "1" },
            { label: "2 oz (70 µm)", value: "2" },
            { label: "3 oz (105 µm)", value: "3" },
          ],
          defaultValue: "1",
        },
      ],
      calculate: (inputs) => {
        const current = inputs.current as number;
        const tempRise = inputs.tempRise as number;
        const thickness = Number(inputs.thickness);
        if (!current || !tempRise || !thickness) return null;

        // IPC-2221 formula for external layers
        // Area (mils²) = (I / (k × ΔT^b))^(1/c)
        // k=0.048, b=0.44, c=0.725 for external layers
        const k = 0.048;
        const b = 0.44;
        const c = 0.725;

        const area = Math.pow(current / (k * Math.pow(tempRise, b)), 1 / c);
        const thicknessMils = thickness * 1.378; // oz to mils
        const widthMils = area / thicknessMils;
        const widthMm = widthMils * 0.0254;
        const widthInches = widthMils / 1000;

        return {
          primary: {
            label: "Required Trace Width",
            value: `${formatNumber(widthMils, 2)} mils`,
          },
          details: [
            { label: "Width (mils)", value: `${formatNumber(widthMils, 2)} mils` },
            { label: "Width (mm)", value: `${formatNumber(widthMm, 3)} mm` },
            { label: "Width (inches)", value: `${formatNumber(widthInches, 4)} in` },
            { label: "Cross-Section Area", value: `${formatNumber(area, 2)} mils²` },
            { label: "Copper Thickness", value: `${formatNumber(thicknessMils, 3)} mils` },
          ],
        };
      },
    },
    {
      id: "internal-layer",
      name: "Internal Layer Trace",
      description: "Calculate trace width for internal PCB layers using IPC-2221",
      fields: [
        {
          name: "current",
          label: "Current (A)",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "tempRise",
          label: "Allowable Temperature Rise (°C)",
          type: "number",
          placeholder: "e.g. 10",
          defaultValue: 10,
        },
        {
          name: "thickness",
          label: "Copper Thickness (oz/ft²)",
          type: "select",
          options: [
            { label: "0.5 oz (17.5 µm)", value: "0.5" },
            { label: "1 oz (35 µm)", value: "1" },
            { label: "2 oz (70 µm)", value: "2" },
            { label: "3 oz (105 µm)", value: "3" },
          ],
          defaultValue: "1",
        },
      ],
      calculate: (inputs) => {
        const current = inputs.current as number;
        const tempRise = inputs.tempRise as number;
        const thickness = Number(inputs.thickness);
        if (!current || !tempRise || !thickness) return null;

        // IPC-2221 formula for internal layers
        // k=0.024, b=0.44, c=0.725 for internal layers
        const k = 0.024;
        const b = 0.44;
        const c = 0.725;

        const area = Math.pow(current / (k * Math.pow(tempRise, b)), 1 / c);
        const thicknessMils = thickness * 1.378;
        const widthMils = area / thicknessMils;
        const widthMm = widthMils * 0.0254;
        const widthInches = widthMils / 1000;

        return {
          primary: {
            label: "Required Trace Width",
            value: `${formatNumber(widthMils, 2)} mils`,
          },
          details: [
            { label: "Width (mils)", value: `${formatNumber(widthMils, 2)} mils` },
            { label: "Width (mm)", value: `${formatNumber(widthMm, 3)} mm` },
            { label: "Width (inches)", value: `${formatNumber(widthInches, 4)} in` },
            { label: "Cross-Section Area", value: `${formatNumber(area, 2)} mils²` },
            { label: "Copper Thickness", value: `${formatNumber(thicknessMils, 3)} mils` },
          ],
          note: "Internal layers have reduced heat dissipation. Trace widths are wider than external layers for the same current.",
        };
      },
    },
  ],
  relatedSlugs: ["ohms-law-calculator", "wire-gauge-calculator", "resistance-calculator"],
  faq: [
    {
      question: "What is IPC-2221?",
      answer:
        "IPC-2221 is a generic standard for printed circuit board design published by IPC (Association Connecting Electronics Industries). It defines formulas for calculating minimum trace widths based on current, temperature rise, and copper thickness.",
    },
    {
      question: "Why do internal layers need wider traces?",
      answer:
        "Internal layers are surrounded by insulating material (FR-4) which reduces heat dissipation compared to external layers that can radiate heat to the air. The IPC-2221 constant for internal layers (k=0.024) is half that of external layers (k=0.048).",
    },
    {
      question: "What temperature rise should I use?",
      answer:
        "A common design guideline is 10°C temperature rise above ambient. For high-reliability applications, use lower values (5°C). For less critical designs, 20-30°C may be acceptable. Always consider the maximum ambient temperature in your application.",
    },
  ],
  formula:
    "Area (mils²) = (I / (k × ΔT^0.44))^(1/0.725) | Width = Area / Thickness | External: k=0.048, Internal: k=0.024",
};
