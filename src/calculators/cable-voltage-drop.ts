import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cableVoltageDropCalculator: CalculatorDefinition = {
  slug: "cable-voltage-drop-calculator",
  title: "Cable Voltage Drop Calculator",
  description:
    "Free cable voltage drop calculator. Calculate voltage drop across cables for single-phase and three-phase circuits. Ensure compliance with NEC 3% and 5% limits.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "cable voltage drop",
    "voltage drop calculator",
    "wire voltage drop",
    "cable sizing",
    "NEC voltage drop",
    "conductor voltage drop",
  ],
  variants: [
    {
      id: "single-phase",
      name: "Single-Phase Voltage Drop",
      description: "Vd = 2 × I × R × L for single-phase circuits",
      fields: [
        {
          name: "current",
          label: "Load Current (A)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "voltage",
          label: "Source Voltage (V)",
          type: "number",
          placeholder: "e.g. 240",
        },
        {
          name: "distance",
          label: "One-Way Distance (feet)",
          type: "number",
          placeholder: "e.g. 100",
        },
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
            { label: "3 AWG", value: "3" },
            { label: "2 AWG", value: "2" },
            { label: "1 AWG", value: "1" },
            { label: "1/0 AWG", value: "0" },
            { label: "2/0 AWG", value: "-1" },
            { label: "3/0 AWG", value: "-2" },
            { label: "4/0 AWG", value: "-3" },
          ],
          defaultValue: "12",
        },
        {
          name: "material",
          label: "Conductor Material",
          type: "select",
          options: [
            { label: "Copper", value: "copper" },
            { label: "Aluminum", value: "aluminum" },
          ],
          defaultValue: "copper",
        },
      ],
      calculate: (inputs) => {
        const current = inputs.current as number;
        const voltage = inputs.voltage as number;
        const distance = inputs.distance as number;
        const gauge = inputs.wireGauge as string;
        const material = inputs.material as string;
        if (!current || !voltage || !distance) return null;

        // Resistance per 1000 ft at 75°C (Ω/1000ft) - NEC Chapter 9 Table 8
        const copperResistance: Record<string, number> = {
          "14": 3.14, "12": 1.98, "10": 1.24, "8": 0.778,
          "6": 0.491, "4": 0.308, "3": 0.245, "2": 0.194,
          "1": 0.154, "0": 0.122, "-1": 0.0967, "-2": 0.0766, "-3": 0.0608,
        };
        const aluminumResistance: Record<string, number> = {
          "14": 5.17, "12": 3.25, "10": 2.04, "8": 1.28,
          "6": 0.808, "4": 0.508, "3": 0.403, "2": 0.319,
          "1": 0.253, "0": 0.201, "-1": 0.159, "-2": 0.126, "-3": 0.100,
        };

        const rTable = material === "copper" ? copperResistance : aluminumResistance;
        const rPer1000ft = rTable[gauge];
        if (!rPer1000ft) return null;

        const rPerFt = rPer1000ft / 1000;
        // Single phase: Vd = 2 × I × R × L
        const vDrop = 2 * current * rPerFt * distance;
        const vDropPercent = (vDrop / voltage) * 100;
        const voltageAtLoad = voltage - vDrop;
        const powerLoss = vDrop * current;

        const gaugeLabel: Record<string, string> = {
          "0": "1/0", "-1": "2/0", "-2": "3/0", "-3": "4/0",
        };
        const displayGauge = gaugeLabel[gauge] || gauge;

        return {
          primary: {
            label: "Voltage Drop",
            value: `${formatNumber(vDrop, 2)} V (${formatNumber(vDropPercent, 2)}%)`,
          },
          details: [
            { label: "Voltage Drop", value: `${formatNumber(vDrop, 4)} V` },
            { label: "Voltage Drop %", value: `${formatNumber(vDropPercent, 2)}%` },
            { label: "Voltage at Load", value: `${formatNumber(voltageAtLoad, 2)} V` },
            { label: "Power Loss in Cable", value: `${formatNumber(powerLoss, 2)} W` },
            { label: "Wire", value: `${displayGauge} AWG ${material}` },
            { label: "NEC Compliance", value: vDropPercent <= 3 ? "OK (≤3% branch)" : vDropPercent <= 5 ? "OK (≤5% total)" : "EXCEEDS 5% - use larger wire" },
          ],
        };
      },
    },
    {
      id: "three-phase",
      name: "Three-Phase Voltage Drop",
      description: "Vd = √3 × I × R × L for three-phase circuits",
      fields: [
        {
          name: "current",
          label: "Load Current (A)",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "voltage",
          label: "Line-to-Line Voltage (V)",
          type: "number",
          placeholder: "e.g. 480",
        },
        {
          name: "distance",
          label: "One-Way Distance (feet)",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "wireGauge",
          label: "Wire Gauge (AWG)",
          type: "select",
          options: [
            { label: "10 AWG", value: "10" },
            { label: "8 AWG", value: "8" },
            { label: "6 AWG", value: "6" },
            { label: "4 AWG", value: "4" },
            { label: "3 AWG", value: "3" },
            { label: "2 AWG", value: "2" },
            { label: "1 AWG", value: "1" },
            { label: "1/0 AWG", value: "0" },
            { label: "2/0 AWG", value: "-1" },
            { label: "3/0 AWG", value: "-2" },
            { label: "4/0 AWG", value: "-3" },
          ],
          defaultValue: "8",
        },
        {
          name: "material",
          label: "Conductor Material",
          type: "select",
          options: [
            { label: "Copper", value: "copper" },
            { label: "Aluminum", value: "aluminum" },
          ],
          defaultValue: "copper",
        },
      ],
      calculate: (inputs) => {
        const current = inputs.current as number;
        const voltage = inputs.voltage as number;
        const distance = inputs.distance as number;
        const gauge = inputs.wireGauge as string;
        const material = inputs.material as string;
        if (!current || !voltage || !distance) return null;

        const copperR: Record<string, number> = {
          "10": 1.24, "8": 0.778, "6": 0.491, "4": 0.308,
          "3": 0.245, "2": 0.194, "1": 0.154, "0": 0.122,
          "-1": 0.0967, "-2": 0.0766, "-3": 0.0608,
        };
        const aluminumR: Record<string, number> = {
          "10": 2.04, "8": 1.28, "6": 0.808, "4": 0.508,
          "3": 0.403, "2": 0.319, "1": 0.253, "0": 0.201,
          "-1": 0.159, "-2": 0.126, "-3": 0.100,
        };

        const rTable = material === "copper" ? copperR : aluminumR;
        const rPer1000ft = rTable[gauge];
        if (!rPer1000ft) return null;

        const rPerFt = rPer1000ft / 1000;
        // Three phase: Vd = √3 × I × R × L
        const vDrop = Math.sqrt(3) * current * rPerFt * distance;
        const vDropPercent = (vDrop / voltage) * 100;
        const voltageAtLoad = voltage - vDrop;
        const powerLoss = Math.sqrt(3) * vDrop * current;

        const gaugeLabel: Record<string, string> = {
          "0": "1/0", "-1": "2/0", "-2": "3/0", "-3": "4/0",
        };
        const displayGauge = gaugeLabel[gauge] || gauge;

        return {
          primary: {
            label: "Voltage Drop",
            value: `${formatNumber(vDrop, 2)} V (${formatNumber(vDropPercent, 2)}%)`,
          },
          details: [
            { label: "Voltage Drop", value: `${formatNumber(vDrop, 4)} V` },
            { label: "Voltage Drop %", value: `${formatNumber(vDropPercent, 2)}%` },
            { label: "Voltage at Load", value: `${formatNumber(voltageAtLoad, 2)} V` },
            { label: "Power Loss in Cable", value: `${formatNumber(powerLoss, 2)} W` },
            { label: "Wire", value: `${displayGauge} AWG ${material}` },
            { label: "NEC Compliance", value: vDropPercent <= 3 ? "OK (≤3% branch)" : vDropPercent <= 5 ? "OK (≤5% total)" : "EXCEEDS 5% - use larger wire" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["voltage-drop-calculator", "wire-gauge-calculator", "wire-ampacity-calculator"],
  faq: [
    {
      question: "What is the maximum allowable voltage drop per NEC?",
      answer:
        "NEC recommends (but does not mandate) a maximum of 3% voltage drop for branch circuits and 5% total for the combination of feeder and branch circuit. These are in NEC 210.19(A) and 215.2(A) Informational Notes. Many engineers treat these as requirements.",
    },
    {
      question: "How do I calculate voltage drop for single-phase vs three-phase?",
      answer:
        "Single-phase: Vd = 2 × I × R × L (factor of 2 for round-trip). Three-phase: Vd = √3 × I × R × L (factor of √3 ≈ 1.732). Where I is current in amps, R is resistance per foot, and L is one-way distance in feet.",
    },
    {
      question: "How can I reduce voltage drop?",
      answer:
        "Use larger wire (lower gauge number), shorten cable runs, increase voltage (e.g., 240V instead of 120V halves the current), or use copper instead of aluminum. For long runs, it's often more cost-effective to increase wire size than to suffer power losses.",
    },
  ],
  formula:
    "Single-Phase: Vd = 2 × I × R × L | Three-Phase: Vd = √3 × I × R × L | Vd% = (Vd / Vsource) × 100 | R from NEC Chapter 9 Table 8",
};
