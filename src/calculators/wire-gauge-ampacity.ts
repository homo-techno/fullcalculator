import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wireGaugeAmpacityCalculator: CalculatorDefinition = {
  slug: "wire-gauge-ampacity",
  title: "Wire Gauge Ampacity Calculator",
  description:
    "Free wire gauge ampacity calculator. Find the maximum current capacity for copper and aluminum wire by AWG gauge size. NEC code reference included.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "wire gauge ampacity",
    "AWG ampacity",
    "wire current capacity",
    "copper wire ampacity",
    "aluminum wire ampacity",
    "NEC wire sizing",
    "electrical wire calculator",
  ],
  variants: [
    {
      id: "copper-ampacity",
      name: "Copper Wire Ampacity",
      description: "Find ampacity for copper conductors by AWG gauge",
      fields: [
        {
          name: "gauge",
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
            { label: "2/0 AWG", value: "00" },
            { label: "3/0 AWG", value: "000" },
            { label: "4/0 AWG", value: "0000" },
          ],
          defaultValue: "12",
        },
        {
          name: "insulation",
          label: "Insulation Temperature Rating",
          type: "select",
          options: [
            { label: "60°C (TW, UF)", value: "60" },
            { label: "75°C (THW, THWN)", value: "75" },
            { label: "90°C (THHN, XHHW)", value: "90" },
          ],
          defaultValue: "75",
        },
      ],
      calculate: (inputs) => {
        const gauge = inputs.gauge as string;
        const insulation = inputs.insulation as string;

        // NEC Table 310.16 copper ampacity values
        const ampacity: Record<string, Record<string, number>> = {
          "14": { "60": 15, "75": 20, "90": 25 },
          "12": { "60": 20, "75": 25, "90": 30 },
          "10": { "60": 30, "75": 35, "90": 40 },
          "8": { "60": 40, "75": 50, "90": 55 },
          "6": { "60": 55, "75": 65, "90": 75 },
          "4": { "60": 70, "75": 85, "90": 95 },
          "3": { "60": 85, "75": 100, "90": 115 },
          "2": { "60": 95, "75": 115, "90": 130 },
          "1": { "60": 110, "75": 130, "90": 145 },
          "0": { "60": 125, "75": 150, "90": 170 },
          "00": { "60": 145, "75": 175, "90": 195 },
          "000": { "60": 165, "75": 200, "90": 225 },
          "0000": { "60": 195, "75": 230, "90": 260 },
        };

        const amps = ampacity[gauge]?.[insulation];
        if (!amps) return null;

        const gaugeLabel = gauge.length > 2 ? gauge.replace(/0/g, "/0").substring(1) + " AWG" : gauge + " AWG";

        return {
          primary: {
            label: "Maximum Ampacity",
            value: formatNumber(amps),
            suffix: "Amps",
          },
          details: [
            { label: "Wire Gauge", value: gauge.length > 1 && gauge.startsWith("0") ? gauge.replace(/0/g, "/0").substring(1) + " AWG" : gauge + " AWG" },
            { label: "Insulation Rating", value: insulation + "°C" },
            { label: "Conductor Material", value: "Copper" },
            { label: "Max Continuous Load (80%)", value: formatNumber(amps * 0.8) + " Amps" },
          ],
        };
      },
    },
    {
      id: "aluminum-ampacity",
      name: "Aluminum Wire Ampacity",
      description: "Find ampacity for aluminum conductors by AWG gauge",
      fields: [
        {
          name: "gauge",
          label: "Wire Gauge (AWG)",
          type: "select",
          options: [
            { label: "12 AWG", value: "12" },
            { label: "10 AWG", value: "10" },
            { label: "8 AWG", value: "8" },
            { label: "6 AWG", value: "6" },
            { label: "4 AWG", value: "4" },
            { label: "3 AWG", value: "3" },
            { label: "2 AWG", value: "2" },
            { label: "1 AWG", value: "1" },
            { label: "1/0 AWG", value: "0" },
            { label: "2/0 AWG", value: "00" },
            { label: "3/0 AWG", value: "000" },
            { label: "4/0 AWG", value: "0000" },
          ],
          defaultValue: "10",
        },
        {
          name: "insulation",
          label: "Insulation Temperature Rating",
          type: "select",
          options: [
            { label: "60°C (TW, UF)", value: "60" },
            { label: "75°C (THW, THWN)", value: "75" },
            { label: "90°C (THHN, XHHW)", value: "90" },
          ],
          defaultValue: "75",
        },
      ],
      calculate: (inputs) => {
        const gauge = inputs.gauge as string;
        const insulation = inputs.insulation as string;

        const ampacity: Record<string, Record<string, number>> = {
          "12": { "60": 15, "75": 20, "90": 25 },
          "10": { "60": 25, "75": 30, "90": 35 },
          "8": { "60": 30, "75": 40, "90": 45 },
          "6": { "60": 40, "75": 50, "90": 60 },
          "4": { "60": 55, "75": 65, "90": 75 },
          "3": { "60": 65, "75": 75, "90": 85 },
          "2": { "60": 75, "75": 90, "90": 100 },
          "1": { "60": 85, "75": 100, "90": 115 },
          "0": { "60": 100, "75": 120, "90": 135 },
          "00": { "60": 115, "75": 135, "90": 150 },
          "000": { "60": 130, "75": 155, "90": 175 },
          "0000": { "60": 150, "75": 180, "90": 205 },
        };

        const amps = ampacity[gauge]?.[insulation];
        if (!amps) return null;

        return {
          primary: {
            label: "Maximum Ampacity",
            value: formatNumber(amps),
            suffix: "Amps",
          },
          details: [
            { label: "Wire Gauge", value: gauge + " AWG" },
            { label: "Insulation Rating", value: insulation + "°C" },
            { label: "Conductor Material", value: "Aluminum" },
            { label: "Max Continuous Load (80%)", value: formatNumber(amps * 0.8) + " Amps" },
          ],
        };
      },
    },
    {
      id: "voltage-drop",
      name: "Voltage Drop by Gauge",
      description: "Calculate voltage drop for a given wire gauge and length",
      fields: [
        {
          name: "gauge",
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
          ],
          defaultValue: "12",
        },
        {
          name: "current",
          label: "Current (Amps)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "length",
          label: "One-way Wire Length (feet)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "voltage",
          label: "System Voltage",
          type: "select",
          options: [
            { label: "120V", value: "120" },
            { label: "240V", value: "240" },
          ],
          defaultValue: "120",
        },
      ],
      calculate: (inputs) => {
        const gauge = inputs.gauge as string;
        const current = parseFloat(inputs.current as string);
        const length = parseFloat(inputs.length as string);
        const voltage = parseFloat(inputs.voltage as string);

        if (isNaN(current) || isNaN(length) || current <= 0 || length <= 0) return null;

        // Resistance per 1000 ft for copper wire (ohms)
        const resistance: Record<string, number> = {
          "14": 2.525,
          "12": 1.588,
          "10": 0.999,
          "8": 0.628,
          "6": 0.395,
          "4": 0.249,
          "2": 0.156,
          "0": 0.098,
        };

        const r = resistance[gauge];
        if (!r) return null;

        const vDrop = 2 * length * current * r / 1000;
        const vDropPercent = (vDrop / voltage) * 100;

        return {
          primary: {
            label: "Voltage Drop",
            value: formatNumber(vDrop, 2),
            suffix: "Volts",
          },
          details: [
            { label: "Voltage Drop %", value: formatNumber(vDropPercent, 2) + "%" },
            { label: "Voltage at Load", value: formatNumber(voltage - vDrop, 2) + " V" },
            { label: "Status", value: vDropPercent <= 3 ? "Acceptable (<=3%)" : "Excessive (>3% - upsize wire)" },
          ],
          note: vDropPercent > 3 ? "NEC recommends max 3% voltage drop for branch circuits." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["awg-to-mm-calc", "ohms-law-calculator", "electricity-calculator"],
  faq: [
    {
      question: "What is wire ampacity?",
      answer:
        "Ampacity is the maximum current a wire can safely carry continuously without exceeding its temperature rating. It depends on wire gauge, insulation type, and installation conditions. NEC Table 310.16 provides standard ampacity values.",
    },
    {
      question: "Why is the 80% rule important for wire ampacity?",
      answer:
        "The NEC requires that continuous loads (running 3+ hours) not exceed 80% of the wire's ampacity rating. This provides a safety margin to prevent overheating. For example, a 20A-rated 12 AWG wire should carry no more than 16A continuously.",
    },
    {
      question: "What is the difference between copper and aluminum wire ampacity?",
      answer:
        "Aluminum wire has about 61% of the conductivity of copper, so it has lower ampacity ratings for the same gauge size. You typically need to upsize aluminum wire by 1-2 gauge sizes to match copper ampacity.",
    },
  ],
  formula:
    "Voltage Drop = 2 x Length x Current x Resistance / 1000 | Continuous Load = Ampacity x 0.80",
};
