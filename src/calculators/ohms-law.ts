import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ohmsLawCalculator: CalculatorDefinition = {
  slug: "ohms-law-calculator",
  title: "Ohm's Law Calculator",
  description: "Free Ohm's Law calculator. Calculate voltage, current, resistance, and power for any electrical circuit.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["ohms law calculator", "voltage calculator", "resistance calculator", "current calculator", "electrical calculator"],
  variants: [
    {
      id: "vir",
      name: "Voltage / Current / Resistance",
      description: "Enter any two values to calculate the third (V = I × R)",
      fields: [
        { name: "voltage", label: "Voltage (V)", type: "number", placeholder: "e.g. 12" },
        { name: "current", label: "Current (A)", type: "number", placeholder: "e.g. 2" },
        { name: "resistance", label: "Resistance (Ω)", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const v = inputs.voltage as number;
        const i = inputs.current as number;
        const r = inputs.resistance as number;
        const hasV = v !== undefined && v !== null && String(v) !== "";
        const hasI = i !== undefined && i !== null && String(i) !== "";
        const hasR = r !== undefined && r !== null && String(r) !== "";
        const count = [hasV, hasI, hasR].filter(Boolean).length;
        if (count < 2) return null;
        let voltage = v, current = i, resistance = r;
        let solved = "";
        if (!hasV && hasI && hasR) { voltage = i * r; solved = "Voltage"; }
        else if (!hasI && hasV && hasR) { current = v / r; solved = "Current"; }
        else if (!hasR && hasV && hasI) { resistance = v / i; solved = "Resistance"; }
        else { solved = "All provided"; }
        const power = voltage * current;
        return {
          primary: { label: solved !== "All provided" ? `${solved}` : "Power", value: solved === "Voltage" ? `${formatNumber(voltage, 4)} V` : solved === "Current" ? `${formatNumber(current, 4)} A` : solved === "Resistance" ? `${formatNumber(resistance, 4)} Ω` : `${formatNumber(power, 4)} W` },
          details: [
            { label: "Voltage", value: `${formatNumber(voltage, 4)} V` },
            { label: "Current", value: `${formatNumber(current, 4)} A` },
            { label: "Resistance", value: `${formatNumber(resistance, 4)} Ω` },
            { label: "Power", value: `${formatNumber(power, 4)} W` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["electricity-cost-calculator", "scientific-calculator", "unit-converter"],
  faq: [
    { question: "What is Ohm's Law?", answer: "V = I × R. Voltage (V, volts) = Current (I, amps) × Resistance (R, ohms). Power (W, watts) = V × I. It describes the relationship between voltage, current, and resistance in a circuit." },
  ],
  formula: "V = I × R | P = V × I | I = V / R | R = V / I",
};
