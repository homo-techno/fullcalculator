import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ledResistorCalculator: CalculatorDefinition = {
  slug: "led-resistor-calculator",
  title: "LED Resistor Calculator",
  description:
    "Free LED resistor calculator. Calculate the correct resistor value for any LED circuit. R = (Vs - Vf) / If. Includes nearest standard resistor value.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "led resistor",
    "led resistor calculator",
    "led current limiting resistor",
    "resistor for led",
    "led circuit",
  ],
  variants: [
    {
      id: "single-led",
      name: "Single LED Resistor",
      description: "R = (Vs - Vf) / If",
      fields: [
        {
          name: "supplyVoltage",
          label: "Supply Voltage (V)",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "forwardVoltage",
          label: "LED Forward Voltage (V)",
          type: "number",
          placeholder: "e.g. 2.0",
        },
        {
          name: "forwardCurrent",
          label: "LED Forward Current (mA)",
          type: "number",
          placeholder: "e.g. 20",
        },
      ],
      calculate: (inputs) => {
        const vs = inputs.supplyVoltage as number;
        const vf = inputs.forwardVoltage as number;
        const ifMa = inputs.forwardCurrent as number;
        if (!vs || !vf || !ifMa) return null;

        if (vs <= vf) {
          return {
            primary: { label: "Error", value: "Supply voltage must exceed LED forward voltage" },
            details: [],
          };
        }

        const ifAmps = ifMa / 1000;
        const resistance = (vs - vf) / ifAmps;
        const powerDissipated = (vs - vf) * ifAmps;

        // Find nearest standard E24 resistor value
        const e24 = [
          1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
          3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1,
        ];
        const decade = Math.floor(Math.log10(resistance));
        const normalized = resistance / Math.pow(10, decade);
        let nearest = e24[0];
        let minDiff = Math.abs(normalized - e24[0]);
        for (const val of e24) {
          const diff = Math.abs(normalized - val);
          if (diff < minDiff) {
            minDiff = diff;
            nearest = val;
          }
        }
        // Also check next decade up
        const nearestLow = nearest * Math.pow(10, decade);
        const nearestHigh = e24[0] * Math.pow(10, decade + 1);
        const standardValue = Math.abs(resistance - nearestLow) <= Math.abs(resistance - nearestHigh)
          ? nearestLow
          : nearestHigh;

        // Actual current with standard value (pick higher resistor for safety)
        const safeResistor = standardValue >= resistance ? standardValue : nearestLow;
        const actualCurrent = ((vs - vf) / safeResistor) * 1000;

        return {
          primary: {
            label: "Required Resistor",
            value: `${formatNumber(resistance, 4)} Ω`,
          },
          details: [
            { label: "Exact Resistance", value: `${formatNumber(resistance, 4)} Ω` },
            { label: "Nearest Standard (E24)", value: `${formatNumber(standardValue, 4)} Ω` },
            { label: "Actual Current (std)", value: `${formatNumber(actualCurrent, 2)} mA` },
            { label: "Power Dissipated", value: `${formatNumber(powerDissipated * 1000, 2)} mW` },
            { label: "Voltage Across Resistor", value: `${formatNumber(vs - vf, 4)} V` },
          ],
        };
      },
    },
    {
      id: "series-leds",
      name: "LEDs in Series",
      description: "R = (Vs - n × Vf) / If",
      fields: [
        {
          name: "supplyVoltage",
          label: "Supply Voltage (V)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "forwardVoltage",
          label: "LED Forward Voltage (V each)",
          type: "number",
          placeholder: "e.g. 2.0",
        },
        {
          name: "numLeds",
          label: "Number of LEDs",
          type: "number",
          placeholder: "e.g. 3",
          min: 1,
        },
        {
          name: "forwardCurrent",
          label: "LED Forward Current (mA)",
          type: "number",
          placeholder: "e.g. 20",
        },
      ],
      calculate: (inputs) => {
        const vs = inputs.supplyVoltage as number;
        const vf = inputs.forwardVoltage as number;
        const n = inputs.numLeds as number;
        const ifMa = inputs.forwardCurrent as number;
        if (!vs || !vf || !n || !ifMa) return null;

        const totalVf = n * vf;
        if (vs <= totalVf) {
          return {
            primary: { label: "Error", value: `Supply voltage (${vs}V) must exceed total LED voltage (${formatNumber(totalVf, 2)}V)` },
            details: [],
          };
        }

        const ifAmps = ifMa / 1000;
        const resistance = (vs - totalVf) / ifAmps;
        const powerDissipated = (vs - totalVf) * ifAmps;

        return {
          primary: {
            label: "Required Resistor",
            value: `${formatNumber(resistance, 4)} Ω`,
          },
          details: [
            { label: "Resistance", value: `${formatNumber(resistance, 4)} Ω` },
            { label: "Total LED Voltage", value: `${formatNumber(totalVf, 2)} V` },
            { label: "Voltage Across Resistor", value: `${formatNumber(vs - totalVf, 4)} V` },
            { label: "Power Dissipated", value: `${formatNumber(powerDissipated * 1000, 2)} mW` },
            { label: "Max LEDs for this voltage", value: String(Math.floor(vs / vf)) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ohms-law-calculator", "voltage-divider-calculator", "resistance-calculator"],
  faq: [
    {
      question: "How do I calculate the resistor for an LED?",
      answer:
        "Use R = (Vs - Vf) / If, where Vs is supply voltage, Vf is the LED forward voltage, and If is the desired LED current. For a typical red LED (Vf=2V, If=20mA) on 5V supply: R = (5 - 2) / 0.02 = 150 Ohms.",
    },
    {
      question: "What is the typical forward voltage for different LED colors?",
      answer:
        "Red: 1.8-2.2V, Orange: 2.0-2.2V, Yellow: 2.0-2.2V, Green: 2.0-3.5V, Blue: 3.0-3.5V, White: 3.0-3.5V. Always check the LED datasheet.",
    },
  ],
  formula: "R = (Vs - Vf) / If | For series LEDs: R = (Vs - n × Vf) / If",
};
