import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const voltageDividerCalculator: CalculatorDefinition = {
  slug: "voltage-divider-calculator",
  title: "Voltage Divider Calculator",
  description:
    "Free voltage divider calculator. Calculate output voltage from a resistive voltage divider circuit. Vout = Vin × R2 / (R1 + R2).",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "voltage divider",
    "resistor divider",
    "voltage divider calculator",
    "resistive divider",
    "Vout calculator",
  ],
  variants: [
    {
      id: "find-vout",
      name: "Find Output Voltage",
      description: "Vout = Vin × R2 / (R1 + R2)",
      fields: [
        {
          name: "vin",
          label: "Input Voltage Vin (V)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "r1",
          label: "R1 (Ohms)",
          type: "number",
          placeholder: "e.g. 10000",
        },
        {
          name: "r2",
          label: "R2 (Ohms)",
          type: "number",
          placeholder: "e.g. 10000",
        },
      ],
      calculate: (inputs) => {
        const vin = inputs.vin as number;
        const r1 = inputs.r1 as number;
        const r2 = inputs.r2 as number;
        if (!vin || !r1 || !r2) return null;
        if (r1 + r2 === 0) return null;
        const vout = vin * r2 / (r1 + r2);
        const ratio = r2 / (r1 + r2);
        const totalR = r1 + r2;
        const current = vin / totalR;
        const powerR1 = current * current * r1;
        const powerR2 = current * current * r2;
        return {
          primary: {
            label: "Output Voltage (Vout)",
            value: `${formatNumber(vout, 4)} V`,
          },
          details: [
            { label: "Vout", value: `${formatNumber(vout, 4)} V` },
            { label: "Divider Ratio", value: formatNumber(ratio, 6) },
            { label: "Total Resistance", value: `${formatNumber(totalR, 4)} Ω` },
            { label: "Current", value: `${formatNumber(current * 1000, 4)} mA` },
            { label: "Power in R1", value: `${formatNumber(powerR1 * 1000, 4)} mW` },
            { label: "Power in R2", value: `${formatNumber(powerR2 * 1000, 4)} mW` },
          ],
        };
      },
    },
    {
      id: "find-r2",
      name: "Find R2 for Desired Vout",
      description: "R2 = R1 × Vout / (Vin - Vout)",
      fields: [
        {
          name: "vin",
          label: "Input Voltage Vin (V)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "vout",
          label: "Desired Output Voltage Vout (V)",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "r1",
          label: "R1 (Ohms)",
          type: "number",
          placeholder: "e.g. 10000",
        },
      ],
      calculate: (inputs) => {
        const vin = inputs.vin as number;
        const vout = inputs.vout as number;
        const r1 = inputs.r1 as number;
        if (!vin || vout === undefined || vout === null || !r1) return null;
        if (vout >= vin) {
          return {
            primary: { label: "Error", value: "Vout must be less than Vin" },
            details: [],
          };
        }
        const r2 = r1 * vout / (vin - vout);
        const totalR = r1 + r2;
        const current = vin / totalR;
        return {
          primary: {
            label: "Required R2",
            value: `${formatNumber(r2, 4)} Ω`,
          },
          details: [
            { label: "R2", value: `${formatNumber(r2, 4)} Ω` },
            { label: "R2 (kΩ)", value: `${formatNumber(r2 / 1000, 4)} kΩ` },
            { label: "Total Resistance", value: `${formatNumber(totalR, 4)} Ω` },
            { label: "Current", value: `${formatNumber(current * 1000, 4)} mA` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ohms-law-calculator", "led-resistor-calculator", "voltage-drop-calculator"],
  faq: [
    {
      question: "What is a voltage divider?",
      answer:
        "A voltage divider is a simple circuit using two resistors in series to produce an output voltage that is a fraction of the input voltage. The formula is Vout = Vin × R2 / (R1 + R2).",
    },
    {
      question: "When should I use a voltage divider?",
      answer:
        "Voltage dividers are commonly used for sensor readings, biasing transistors, level shifting, and creating reference voltages. They work best with high-impedance loads.",
    },
  ],
  formula: "Vout = Vin × R2 / (R1 + R2)",
};
