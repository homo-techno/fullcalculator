import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const transformerCalculator: CalculatorDefinition = {
  slug: "transformer-calculator",
  title: "Transformer Calculator",
  description:
    "Free transformer calculator. Compute secondary voltage and current ratio using Vs/Vp = Ns/Np = Ip/Is.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "transformer",
    "voltage ratio",
    "turns ratio",
    "step up",
    "step down",
    "electromagnetic induction",
  ],
  variants: [
    {
      id: "voltage",
      name: "Find Secondary Voltage",
      fields: [
        {
          name: "vp",
          label: "Primary Voltage (V)",
          type: "number",
          placeholder: "e.g. 120",
        },
        {
          name: "np",
          label: "Primary Turns (Np)",
          type: "number",
          placeholder: "e.g. 500",
        },
        {
          name: "ns",
          label: "Secondary Turns (Ns)",
          type: "number",
          placeholder: "e.g. 1000",
        },
        {
          name: "ip",
          label: "Primary Current (A) — optional",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const vp = inputs.vp as number;
        const np = inputs.np as number;
        const ns = inputs.ns as number;
        const ip = inputs.ip as number;
        if (!vp || !np || !ns) return null;
        if (np <= 0) return null;
        const turnsRatio = ns / np;
        const vs = vp * turnsRatio;
        const transformerType = turnsRatio > 1 ? "Step-Up" : turnsRatio < 1 ? "Step-Down" : "1:1 (Isolation)";

        const details = [
          { label: "Primary Voltage", value: formatNumber(vp, 4) + " V" },
          { label: "Turns Ratio (Ns/Np)", value: formatNumber(turnsRatio, 4) },
          { label: "Type", value: transformerType },
        ];

        if (ip) {
          const is_ = ip / turnsRatio;
          details.push(
            { label: "Primary Current", value: formatNumber(ip, 4) + " A" },
            { label: "Secondary Current", value: formatNumber(is_, 4) + " A" },
            {
              label: "Power (ideal)",
              value: formatNumber(vp * ip, 4) + " W",
            }
          );
        }

        return {
          primary: {
            label: "Secondary Voltage (Vs)",
            value: formatNumber(vs, 4) + " V",
          },
          details,
        };
      },
    },
    {
      id: "turns",
      name: "Find Required Turns",
      fields: [
        {
          name: "vp",
          label: "Primary Voltage (V)",
          type: "number",
          placeholder: "e.g. 120",
        },
        {
          name: "vs",
          label: "Desired Secondary Voltage (V)",
          type: "number",
          placeholder: "e.g. 240",
        },
        {
          name: "np",
          label: "Primary Turns (Np)",
          type: "number",
          placeholder: "e.g. 500",
        },
      ],
      calculate: (inputs) => {
        const vp = inputs.vp as number;
        const vs = inputs.vs as number;
        const np = inputs.np as number;
        if (!vp || !vs || !np) return null;
        if (vp <= 0) return null;
        const ns = (vs / vp) * np;
        const turnsRatio = ns / np;
        return {
          primary: {
            label: "Secondary Turns (Ns)",
            value: formatNumber(ns, 0),
          },
          details: [
            { label: "Primary Voltage", value: formatNumber(vp, 4) + " V" },
            { label: "Secondary Voltage", value: formatNumber(vs, 4) + " V" },
            { label: "Primary Turns", value: String(np) },
            { label: "Turns Ratio", value: formatNumber(turnsRatio, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["inductance-calculator", "power-factor-calculator"],
  faq: [
    {
      question: "How does an ideal transformer work?",
      answer:
        "An ideal transformer converts AC voltages by electromagnetic induction. The voltage ratio equals the turns ratio: Vs/Vp = Ns/Np. Power is conserved, so Ip/Is = Ns/Np.",
    },
    {
      question: "What is the difference between step-up and step-down?",
      answer:
        "A step-up transformer has more secondary turns than primary turns (Ns > Np), increasing voltage. A step-down transformer has fewer secondary turns, decreasing voltage.",
    },
  ],
  formula:
    "Vs/Vp = Ns/Np = Ip/Is, where V is voltage, N is number of turns, I is current, p is primary, and s is secondary.",
};
