import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wheatstoneBridgeCalculator: CalculatorDefinition = {
  slug: "wheatstone-bridge-calculator",
  title: "Wheatstone Bridge Calculator",
  description:
    "Free Wheatstone bridge calculator. Calculate the unknown resistance, bridge voltage, and balance condition for Wheatstone bridge circuits.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "wheatstone bridge",
    "bridge circuit",
    "wheatstone bridge calculator",
    "bridge balance",
    "unknown resistance",
    "strain gauge",
  ],
  variants: [
    {
      id: "find-unknown",
      name: "Find Unknown Resistance",
      description: "Rx = R3 × R2 / R1 (balanced bridge condition)",
      fields: [
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
          placeholder: "e.g. 150",
        },
        {
          name: "r3",
          label: "R3 (Ohms)",
          type: "number",
          placeholder: "e.g. 200",
        },
      ],
      calculate: (inputs) => {
        const r1 = inputs.r1 as number;
        const r2 = inputs.r2 as number;
        const r3 = inputs.r3 as number;
        if (!r1 || !r2 || !r3) return null;

        const rx = (r3 * r2) / r1;
        const ratio = r2 / r1;

        return {
          primary: {
            label: "Unknown Resistance (Rx)",
            value: `${formatNumber(rx, 4)} Ω`,
          },
          details: [
            { label: "Rx", value: `${formatNumber(rx, 4)} Ω` },
            { label: "Rx (kΩ)", value: `${formatNumber(rx / 1000, 4)} kΩ` },
            { label: "Ratio (R2/R1)", value: formatNumber(ratio, 6) },
            { label: "Balance Condition", value: "R1 × Rx = R2 × R3" },
            { label: "Verify", value: `${formatNumber(r1 * rx, 2)} = ${formatNumber(r2 * r3, 2)}` },
          ],
        };
      },
    },
    {
      id: "bridge-voltage",
      name: "Bridge Voltage (Unbalanced)",
      description: "Calculate the voltage across the bridge for any four resistors",
      fields: [
        {
          name: "vs",
          label: "Supply Voltage (V)",
          type: "number",
          placeholder: "e.g. 10",
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
          placeholder: "e.g. 150",
        },
        {
          name: "r3",
          label: "R3 (Ohms)",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "r4",
          label: "R4 / Rx (Ohms)",
          type: "number",
          placeholder: "e.g. 300",
        },
      ],
      calculate: (inputs) => {
        const vs = inputs.vs as number;
        const r1 = inputs.r1 as number;
        const r2 = inputs.r2 as number;
        const r3 = inputs.r3 as number;
        const r4 = inputs.r4 as number;
        if (!vs || !r1 || !r2 || !r3 || !r4) return null;

        // Vbridge = Vs × (R3/(R3+R1) - R4/(R4+R2))
        const vA = vs * r3 / (r3 + r1);
        const vB = vs * r4 / (r4 + r2);
        const vBridge = vA - vB;

        const balanced = Math.abs(vBridge) < 0.0001;
        const rxBalanced = (r3 * r2) / r1;

        return {
          primary: {
            label: "Bridge Voltage",
            value: `${formatNumber(vBridge, 6)} V`,
          },
          details: [
            { label: "Bridge Voltage (Vg)", value: `${formatNumber(vBridge, 6)} V` },
            { label: "Bridge Voltage (mV)", value: `${formatNumber(vBridge * 1000, 4)} mV` },
            { label: "Node A Voltage", value: `${formatNumber(vA, 4)} V` },
            { label: "Node B Voltage", value: `${formatNumber(vB, 4)} V` },
            { label: "Bridge Status", value: balanced ? "Balanced" : "Unbalanced" },
            { label: "R4 for Balance", value: `${formatNumber(rxBalanced, 4)} Ω` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ohms-law-calculator", "resistance-calculator", "voltage-divider-calculator"],
  faq: [
    {
      question: "What is a Wheatstone bridge?",
      answer:
        "A Wheatstone bridge is a circuit of four resistors arranged in a diamond pattern with a voltage source across one diagonal and a measurement device across the other. When balanced (R1×Rx = R2×R3), no current flows through the galvanometer, allowing precise measurement of unknown resistance.",
    },
    {
      question: "When is a Wheatstone bridge balanced?",
      answer:
        "The bridge is balanced when the ratio of resistors on one side equals the ratio on the other: R1/R3 = R2/Rx, or equivalently R1×Rx = R2×R3. At balance, the voltage across the bridge (galvanometer) is zero.",
    },
    {
      question: "What are common applications of Wheatstone bridges?",
      answer:
        "Wheatstone bridges are used in strain gauge measurements, temperature sensors (RTDs), pressure transducers, load cells, and precision resistance measurement. They are excellent at detecting small changes in resistance with high accuracy.",
    },
  ],
  formula:
    "Balance: R1 × Rx = R2 × R3 | Rx = R3 × R2 / R1 | Vbridge = Vs × (R3/(R3+R1) - R4/(R4+R2))",
};
