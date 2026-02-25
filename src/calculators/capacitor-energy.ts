import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const capacitorEnergyCalculator: CalculatorDefinition = {
  slug: "capacitor-energy",
  title: "Capacitor Energy Calculator",
  description:
    "Calculate the energy stored in a capacitor using E = ½CV², E = ½QV, or E = Q²/(2C).",
  category: "Science",
  categorySlug: "science",
  icon: "Battery",
  keywords: [
    "capacitor",
    "energy",
    "capacitance",
    "voltage",
    "charge",
    "farads",
    "physics",
  ],
  variants: [
    {
      id: "energy-from-capacitance-voltage",
      name: "Energy from Capacitance & Voltage",
      fields: [
        {
          name: "capacitance",
          label: "Capacitance C (F)",
          type: "number",
          placeholder: "Enter capacitance in farads (e.g. 1e-6 for 1 μF)",
        },
        {
          name: "voltage",
          label: "Voltage V (V)",
          type: "number",
          placeholder: "Enter voltage in volts",
        },
      ],
      calculate: (inputs) => {
        const C = parseFloat(inputs.capacitance as string);
        const V = parseFloat(inputs.voltage as string);
        if (isNaN(C) || isNaN(V) || C < 0) {
          return { primary: { label: "Energy", value: "Invalid input" }, details: [] };
        }
        const energy = 0.5 * C * V * V;
        const charge = C * V;
        return {
          primary: { label: "Energy Stored", value: `${formatNumber(energy)} J` },
          details: [
            { label: "Capacitance", value: `${formatNumber(C)} F` },
            { label: "Capacitance (μF)", value: `${formatNumber(C * 1e6)} μF` },
            { label: "Voltage", value: `${formatNumber(V)} V` },
            { label: "Charge Stored", value: `${formatNumber(charge)} C` },
            { label: "Energy (mJ)", value: `${formatNumber(energy * 1000)} mJ` },
          ],
        };
      },
    },
    {
      id: "energy-from-charge-capacitance",
      name: "Energy from Charge & Capacitance",
      fields: [
        {
          name: "charge",
          label: "Charge Q (C)",
          type: "number",
          placeholder: "Enter charge in coulombs",
        },
        {
          name: "capacitance",
          label: "Capacitance C (F)",
          type: "number",
          placeholder: "Enter capacitance in farads",
        },
      ],
      calculate: (inputs) => {
        const Q = parseFloat(inputs.charge as string);
        const C = parseFloat(inputs.capacitance as string);
        if (isNaN(Q) || isNaN(C) || C <= 0) {
          return { primary: { label: "Energy", value: "Invalid input" }, details: [] };
        }
        const energy = (Q * Q) / (2 * C);
        const voltage = Q / C;
        return {
          primary: { label: "Energy Stored", value: `${formatNumber(energy)} J` },
          details: [
            { label: "Charge", value: `${formatNumber(Q)} C` },
            { label: "Capacitance", value: `${formatNumber(C)} F` },
            { label: "Voltage", value: `${formatNumber(voltage)} V` },
            { label: "Energy (mJ)", value: `${formatNumber(energy * 1000)} mJ` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["parallel-capacitors", "series-capacitors", "electric-field"],
  faq: [
    {
      question: "How is energy stored in a capacitor?",
      answer:
        "Energy is stored in the electric field between the capacitor's plates. As charge accumulates on the plates, the electric field grows, storing more energy. The energy equals ½CV².",
    },
    {
      question: "What happens to the energy when a capacitor discharges?",
      answer:
        "When a capacitor discharges, the stored electrical energy is converted into other forms such as heat (in a resistor), light, or work done on a circuit. The energy is fully released when the voltage drops to zero.",
    },
  ],
  formula:
    "E = ½CV² = ½QV = Q²/(2C), where E is energy in joules, C is capacitance in farads, V is voltage in volts, and Q is charge in coulombs.",
};
