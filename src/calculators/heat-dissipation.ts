import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heatDissipationCalculator: CalculatorDefinition = {
  slug: "heat-dissipation-calculator",
  title: "Heat Dissipation Calculator",
  description:
    "Free heat dissipation calculator for electronics. Calculate heatsink requirements, thermal resistance, and junction temperature for semiconductors and power components.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "heat dissipation",
    "thermal calculator",
    "heatsink calculator",
    "junction temperature",
    "thermal resistance",
    "power dissipation",
  ],
  variants: [
    {
      id: "junction-temp",
      name: "Junction Temperature",
      description: "Calculate semiconductor junction temperature: Tj = Ta + (Pd × Rθja)",
      fields: [
        {
          name: "powerDissipation",
          label: "Power Dissipation (W)",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "ambientTemp",
          label: "Ambient Temperature (°C)",
          type: "number",
          placeholder: "e.g. 25",
          defaultValue: 25,
        },
        {
          name: "thetaJC",
          label: "Thermal Resistance Junction-to-Case θjc (°C/W)",
          type: "number",
          placeholder: "e.g. 1.5",
        },
        {
          name: "thetaCS",
          label: "Thermal Resistance Case-to-Sink θcs (°C/W)",
          type: "number",
          placeholder: "e.g. 0.5",
          defaultValue: 0.5,
        },
        {
          name: "thetaSA",
          label: "Thermal Resistance Sink-to-Ambient θsa (°C/W)",
          type: "number",
          placeholder: "e.g. 3",
        },
      ],
      calculate: (inputs) => {
        const pd = inputs.powerDissipation as number;
        const ta = (inputs.ambientTemp as number) ?? 25;
        const thetaJC = inputs.thetaJC as number;
        const thetaCS = (inputs.thetaCS as number) ?? 0.5;
        const thetaSA = inputs.thetaSA as number;
        if (!pd || thetaJC === undefined || thetaJC === null || !thetaSA) return null;

        const totalTheta = thetaJC + thetaCS + thetaSA;
        const tj = ta + pd * totalTheta;
        const tCase = ta + pd * (thetaCS + thetaSA);
        const tSink = ta + pd * thetaSA;

        return {
          primary: {
            label: "Junction Temperature",
            value: `${formatNumber(tj, 2)} °C`,
          },
          details: [
            { label: "Junction Temp (Tj)", value: `${formatNumber(tj, 2)} °C` },
            { label: "Case Temperature", value: `${formatNumber(tCase, 2)} °C` },
            { label: "Heatsink Temperature", value: `${formatNumber(tSink, 2)} °C` },
            { label: "Total θ (junction-ambient)", value: `${formatNumber(totalTheta, 2)} °C/W` },
            { label: "Temperature Rise", value: `${formatNumber(tj - ta, 2)} °C` },
            { label: "Power Dissipation", value: `${formatNumber(pd, 4)} W` },
          ],
        };
      },
    },
    {
      id: "heatsink-required",
      name: "Required Heatsink Thermal Resistance",
      description: "Calculate maximum heatsink θsa for a given max junction temperature",
      fields: [
        {
          name: "powerDissipation",
          label: "Power Dissipation (W)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "maxJunctionTemp",
          label: "Max Junction Temperature (°C)",
          type: "number",
          placeholder: "e.g. 150",
        },
        {
          name: "ambientTemp",
          label: "Max Ambient Temperature (°C)",
          type: "number",
          placeholder: "e.g. 40",
          defaultValue: 40,
        },
        {
          name: "thetaJC",
          label: "θjc Junction-to-Case (°C/W)",
          type: "number",
          placeholder: "e.g. 1.5",
        },
        {
          name: "thetaCS",
          label: "θcs Case-to-Sink (°C/W)",
          type: "number",
          placeholder: "e.g. 0.5",
          defaultValue: 0.5,
        },
      ],
      calculate: (inputs) => {
        const pd = inputs.powerDissipation as number;
        const tjMax = inputs.maxJunctionTemp as number;
        const ta = (inputs.ambientTemp as number) ?? 40;
        const thetaJC = inputs.thetaJC as number;
        const thetaCS = (inputs.thetaCS as number) ?? 0.5;
        if (!pd || !tjMax || thetaJC === undefined || thetaJC === null) return null;

        const totalThetaMax = (tjMax - ta) / pd;
        const thetaSA = totalThetaMax - thetaJC - thetaCS;

        if (thetaSA < 0) {
          return {
            primary: { label: "Error", value: "Cannot achieve target temperature. Reduce power or increase Tj max." },
            details: [
              { label: "Required Total θ", value: `${formatNumber(totalThetaMax, 2)} °C/W` },
              { label: "θjc + θcs alone", value: `${formatNumber(thetaJC + thetaCS, 2)} °C/W` },
              { label: "Deficit", value: `${formatNumber(Math.abs(thetaSA), 2)} °C/W` },
            ],
          };
        }

        return {
          primary: {
            label: "Max Heatsink θsa",
            value: `${formatNumber(thetaSA, 2)} °C/W`,
          },
          details: [
            { label: "Required θsa (max)", value: `${formatNumber(thetaSA, 2)} °C/W` },
            { label: "Total Thermal Budget", value: `${formatNumber(totalThetaMax, 2)} °C/W` },
            { label: "θjc (junction-case)", value: `${formatNumber(thetaJC, 2)} °C/W` },
            { label: "θcs (case-sink)", value: `${formatNumber(thetaCS, 2)} °C/W` },
            { label: "Temperature Margin", value: `${formatNumber(tjMax - ta, 0)} °C` },
          ],
          note: "Choose a heatsink with thermal resistance equal to or lower than the calculated θsa value.",
        };
      },
    },
    {
      id: "max-power",
      name: "Maximum Power Dissipation",
      description: "Calculate max allowable power for a given heatsink and conditions",
      fields: [
        {
          name: "maxJunctionTemp",
          label: "Max Junction Temperature (°C)",
          type: "number",
          placeholder: "e.g. 150",
        },
        {
          name: "ambientTemp",
          label: "Ambient Temperature (°C)",
          type: "number",
          placeholder: "e.g. 40",
          defaultValue: 40,
        },
        {
          name: "thetaJC",
          label: "θjc (°C/W)",
          type: "number",
          placeholder: "e.g. 1.5",
        },
        {
          name: "thetaCS",
          label: "θcs (°C/W)",
          type: "number",
          placeholder: "e.g. 0.5",
          defaultValue: 0.5,
        },
        {
          name: "thetaSA",
          label: "θsa Heatsink (°C/W)",
          type: "number",
          placeholder: "e.g. 3",
        },
      ],
      calculate: (inputs) => {
        const tjMax = inputs.maxJunctionTemp as number;
        const ta = (inputs.ambientTemp as number) ?? 40;
        const thetaJC = inputs.thetaJC as number;
        const thetaCS = (inputs.thetaCS as number) ?? 0.5;
        const thetaSA = inputs.thetaSA as number;
        if (!tjMax || thetaJC === undefined || !thetaSA) return null;

        const totalTheta = thetaJC + thetaCS + thetaSA;
        const maxPower = (tjMax - ta) / totalTheta;

        return {
          primary: {
            label: "Maximum Power",
            value: `${formatNumber(maxPower, 2)} W`,
          },
          details: [
            { label: "Max Power Dissipation", value: `${formatNumber(maxPower, 4)} W` },
            { label: "Total θja", value: `${formatNumber(totalTheta, 2)} °C/W` },
            { label: "Temperature Budget", value: `${formatNumber(tjMax - ta, 0)} °C` },
            { label: "Max Junction Temp", value: `${tjMax} °C` },
            { label: "Ambient Temperature", value: `${ta} °C` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ohms-law-calculator", "electrical-power-calculator", "pcb-trace-width-calculator"],
  faq: [
    {
      question: "What is thermal resistance?",
      answer:
        "Thermal resistance (θ, in °C/W) describes how much temperature rises per watt of power dissipated across a thermal path. Lower thermal resistance means better heat transfer. The total thermal path from junction to ambient is: θja = θjc + θcs + θsa.",
    },
    {
      question: "How do I choose the right heatsink?",
      answer:
        "Calculate the required θsa (sink-to-ambient thermal resistance) using: θsa = (Tj_max - T_ambient)/P - θjc - θcs. Choose a heatsink with equal or lower θsa. Use thermal paste or pads to minimize θcs. Forced air cooling reduces effective θsa by 30-50%.",
    },
    {
      question: "What is junction temperature and why does it matter?",
      answer:
        "Junction temperature (Tj) is the temperature at the semiconductor die inside a package. Exceeding the maximum Tj rating (typically 125-175°C) causes permanent damage. For reliability, keep Tj 20-30°C below the maximum. Every 10°C increase roughly halves component lifetime.",
    },
  ],
  formula:
    "Tj = Ta + Pd × (θjc + θcs + θsa) | θsa_max = (Tj_max - Ta)/Pd - θjc - θcs | Pd_max = (Tj_max - Ta) / (θjc + θcs + θsa)",
};
