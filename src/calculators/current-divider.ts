import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const currentDividerCalculator: CalculatorDefinition = {
  slug: "current-divider-calculator",
  title: "Current Divider Calculator",
  description:
    "Free current divider calculator. Calculate branch currents in a parallel resistor circuit using the current divider rule.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "current divider",
    "current divider calculator",
    "parallel resistor current",
    "branch current",
    "current division rule",
  ],
  variants: [
    {
      id: "two-resistor",
      name: "Two-Resistor Current Divider",
      description: "I1 = IT × R2 / (R1 + R2)",
      fields: [
        {
          name: "totalCurrent",
          label: "Total Current (A)",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "r1",
          label: "R1 (Ohms)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "r2",
          label: "R2 (Ohms)",
          type: "number",
          placeholder: "e.g. 200",
        },
      ],
      calculate: (inputs) => {
        const it = inputs.totalCurrent as number;
        const r1 = inputs.r1 as number;
        const r2 = inputs.r2 as number;
        if (!it || !r1 || !r2) return null;

        const i1 = it * r2 / (r1 + r2);
        const i2 = it * r1 / (r1 + r2);
        const rParallel = (r1 * r2) / (r1 + r2);
        const totalVoltage = it * rParallel;
        const p1 = i1 * i1 * r1;
        const p2 = i2 * i2 * r2;

        return {
          primary: {
            label: "Current through R1",
            value: `${formatNumber(i1, 4)} A`,
          },
          details: [
            { label: "I1 (through R1)", value: `${formatNumber(i1, 4)} A (${formatNumber(i1 * 1000, 4)} mA)` },
            { label: "I2 (through R2)", value: `${formatNumber(i2, 4)} A (${formatNumber(i2 * 1000, 4)} mA)` },
            { label: "Parallel Resistance", value: `${formatNumber(rParallel, 4)} Ω` },
            { label: "Voltage Across Both", value: `${formatNumber(totalVoltage, 4)} V` },
            { label: "Power in R1", value: `${formatNumber(p1, 4)} W` },
            { label: "Power in R2", value: `${formatNumber(p2, 4)} W` },
            { label: "Total Power", value: `${formatNumber(p1 + p2, 4)} W` },
          ],
        };
      },
    },
    {
      id: "three-resistor",
      name: "Three-Resistor Current Divider",
      description: "Calculate branch currents for three parallel resistors",
      fields: [
        {
          name: "totalCurrent",
          label: "Total Current (A)",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "r1",
          label: "R1 (Ohms)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "r2",
          label: "R2 (Ohms)",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "r3",
          label: "R3 (Ohms)",
          type: "number",
          placeholder: "e.g. 300",
        },
      ],
      calculate: (inputs) => {
        const it = inputs.totalCurrent as number;
        const r1 = inputs.r1 as number;
        const r2 = inputs.r2 as number;
        const r3 = inputs.r3 as number;
        if (!it || !r1 || !r2 || !r3) return null;

        const gTotal = 1 / r1 + 1 / r2 + 1 / r3;
        const rParallel = 1 / gTotal;
        const voltage = it * rParallel;
        const i1 = voltage / r1;
        const i2 = voltage / r2;
        const i3 = voltage / r3;

        return {
          primary: {
            label: "Branch Currents",
            value: `I1=${formatNumber(i1, 4)}A, I2=${formatNumber(i2, 4)}A, I3=${formatNumber(i3, 4)}A`,
          },
          details: [
            { label: "I1 (through R1)", value: `${formatNumber(i1, 4)} A (${formatNumber(i1 * 1000, 4)} mA)` },
            { label: "I2 (through R2)", value: `${formatNumber(i2, 4)} A (${formatNumber(i2 * 1000, 4)} mA)` },
            { label: "I3 (through R3)", value: `${formatNumber(i3, 4)} A (${formatNumber(i3 * 1000, 4)} mA)` },
            { label: "Parallel Resistance", value: `${formatNumber(rParallel, 4)} Ω` },
            { label: "Voltage Across All", value: `${formatNumber(voltage, 4)} V` },
            { label: "Sum of Currents", value: `${formatNumber(i1 + i2 + i3, 4)} A` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["voltage-divider-calculator", "ohms-law-calculator", "resistance-calculator"],
  faq: [
    {
      question: "What is a current divider?",
      answer:
        "A current divider is a circuit with parallel resistors where the total current splits into branch currents inversely proportional to the resistance. Higher resistance branches carry less current. The formula for two resistors: I1 = IT × R2/(R1+R2).",
    },
    {
      question: "How does a current divider differ from a voltage divider?",
      answer:
        "A voltage divider uses series resistors and divides voltage proportionally to resistance. A current divider uses parallel resistors and divides current inversely proportional to resistance. In a current divider, the smaller resistor carries more current.",
    },
    {
      question: "What is the general current divider formula for N resistors?",
      answer:
        "For N parallel resistors: In = IT × (Rtotal_parallel / Rn), where Rtotal_parallel = 1/(1/R1 + 1/R2 + ... + 1/Rn). Alternatively: In = IT × (Gn/Gtotal), where G is conductance (1/R).",
    },
  ],
  formula:
    "Two resistors: I1 = IT × R2/(R1+R2) | I2 = IT × R1/(R1+R2) | General: In = IT × (Rp/Rn) | Rp = 1/(1/R1 + 1/R2 + ...)",
};
