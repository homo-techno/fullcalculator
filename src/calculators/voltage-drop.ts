import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const voltageDropCalculator: CalculatorDefinition = {
  slug: "voltage-drop-calculator",
  title: "Voltage Drop Calculator",
  description:
    "Free voltage drop calculator. Calculate wire voltage drop based on wire gauge (AWG), current, distance, and supply voltage. Determine if your wiring meets NEC standards.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "voltage drop",
    "wire voltage drop",
    "awg voltage drop",
    "electrical wire calculator",
    "nec voltage drop",
    "wire gauge calculator",
  ],
  variants: [
    {
      id: "voltage-drop",
      name: "Calculate Voltage Drop",
      description: "VD = 2 × I × R × L / 1000",
      fields: [
        {
          name: "wireGauge",
          label: "Wire Gauge (AWG)",
          type: "select",
          options: [
            { label: "14 AWG", value: "14" },
            { label: "12 AWG", value: "12" },
            { label: "10 AWG", value: "10" },
            { label: "8 AWG", value: "8" },
            { label: "6 AWG", value: "6" },
            { label: "4 AWG", value: "4" },
            { label: "2 AWG", value: "2" },
            { label: "1/0 AWG", value: "0" },
            { label: "2/0 AWG", value: "-1" },
            { label: "4/0 AWG", value: "-3" },
          ],
        },
        {
          name: "current",
          label: "Current (Amps)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "distance",
          label: "One-Way Distance (feet)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "voltage",
          label: "Supply Voltage (V)",
          type: "number",
          placeholder: "e.g. 120",
          defaultValue: 120,
        },
      ],
      calculate: (inputs) => {
        const gaugeStr = inputs.wireGauge as string;
        const current = inputs.current as number;
        const distance = inputs.distance as number;
        const voltage = inputs.voltage as number;
        if (!gaugeStr || !current || !distance || !voltage) return null;

        // Resistance per 1000 feet for copper wire (ohms)
        const resistanceTable: Record<string, number> = {
          "14": 3.14,
          "12": 1.98,
          "10": 1.24,
          "8": 0.778,
          "6": 0.491,
          "4": 0.308,
          "2": 0.194,
          "0": 0.122,
          "-1": 0.0967,
          "-3": 0.0608,
        };

        const resistance = resistanceTable[gaugeStr];
        if (!resistance) return null;

        // VD = 2 × I × R × L / 1000
        const voltageDrop = (2 * current * resistance * distance) / 1000;
        const percentDrop = (voltageDrop / voltage) * 100;
        const endVoltage = voltage - voltageDrop;
        const isAcceptable = percentDrop <= 3;

        const gaugeLabels: Record<string, string> = {
          "14": "14 AWG", "12": "12 AWG", "10": "10 AWG", "8": "8 AWG",
          "6": "6 AWG", "4": "4 AWG", "2": "2 AWG", "0": "1/0 AWG",
          "-1": "2/0 AWG", "-3": "4/0 AWG",
        };

        return {
          primary: {
            label: "Voltage Drop",
            value: `${formatNumber(voltageDrop, 4)} V`,
          },
          details: [
            { label: "Voltage Drop", value: `${formatNumber(voltageDrop, 4)} V` },
            { label: "Percentage Drop", value: `${formatNumber(percentDrop, 2)}%` },
            { label: "End Voltage", value: `${formatNumber(endVoltage, 4)} V` },
            { label: "Wire Gauge", value: gaugeLabels[gaugeStr] || gaugeStr },
            { label: "Wire Resistance", value: `${resistance} Ω/1000ft` },
            { label: "NEC Compliant (≤3%)", value: isAcceptable ? "Yes" : "No - consider larger wire" },
          ],
          note: percentDrop > 3
            ? "Warning: Voltage drop exceeds the NEC recommended 3% for branch circuits. Consider using a larger wire gauge."
            : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["ohms-law-calculator", "wire-gauge-calculator", "electrical-power-calculator"],
  faq: [
    {
      question: "What is voltage drop?",
      answer:
        "Voltage drop is the reduction in voltage as current flows through wire resistance. Excessive voltage drop can cause equipment malfunction. The NEC recommends no more than 3% drop for branch circuits and 5% total.",
    },
    {
      question: "How is voltage drop calculated?",
      answer:
        "VD = 2 × I × R × L / 1000, where I is current in amps, R is wire resistance in ohms per 1000 feet, and L is one-way distance in feet. The factor of 2 accounts for both the supply and return conductors.",
    },
  ],
  formula: "VD = 2 × I × R × L / 1000 | % Drop = (VD / V_supply) × 100",
};
