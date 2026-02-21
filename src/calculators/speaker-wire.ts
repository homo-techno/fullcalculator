import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const speakerWireCalculator: CalculatorDefinition = {
  slug: "speaker-wire-calculator",
  title: "Speaker Wire Calculator",
  description:
    "Free speaker wire gauge calculator. Find the right wire gauge to minimize power loss based on impedance and run length.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "speaker wire",
    "wire gauge",
    "speaker cable",
    "AWG",
    "power loss",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "impedance",
          label: "Speaker Impedance (ohms)",
          type: "select",
          options: [
            { label: "4 ohms", value: "4" },
            { label: "6 ohms", value: "6" },
            { label: "8 ohms", value: "8" },
            { label: "16 ohms", value: "16" },
          ],
        },
        {
          name: "runLength",
          label: "Wire Run Length (feet, one way)",
          type: "number",
          placeholder: "e.g. 25",
        },
      ],
      calculate: (inputs) => {
        const impedance = parseFloat(inputs.impedance as string) || 8;
        const runLength = inputs.runLength as number;
        if (!runLength || runLength <= 0) return null;

        // Wire resistance per foot (round trip = 2x) for common gauges
        // Resistance in ohms per foot of copper wire
        const gauges = [
          { awg: 10, ohmPerFt: 0.000999 },
          { awg: 12, ohmPerFt: 0.001588 },
          { awg: 14, ohmPerFt: 0.002525 },
          { awg: 16, ohmPerFt: 0.004016 },
          { awg: 18, ohmPerFt: 0.006385 },
        ];

        const maxLossPercent = 5;

        // Round trip length
        const roundTrip = runLength * 2;

        const results = gauges.map((g) => {
          const totalResistance = g.ohmPerFt * roundTrip;
          const lossPercent = (totalResistance / (impedance + totalResistance)) * 100;
          return {
            awg: g.awg,
            resistance: totalResistance,
            lossPercent,
            acceptable: lossPercent <= maxLossPercent,
          };
        });

        const recommended = results.find((r) => r.acceptable);
        const recommendedGauge = recommended ? recommended.awg + " AWG" : "10 AWG or thicker";

        return {
          primary: {
            label: "Recommended Gauge",
            value: recommendedGauge,
          },
          details: results
            .map((r) => ({
              label:
                r.awg +
                " AWG" +
                (r.acceptable ? "" : " (too thin)"),
              value:
                formatNumber(r.resistance, 4) +
                " ohms, " +
                formatNumber(r.lossPercent, 2) +
                "% loss",
            }))
            .concat([
              {
                label: "Speaker Impedance",
                value: impedance + " ohms",
              },
              {
                label: "Wire Run (one way)",
                value: formatNumber(runLength, 0) + " ft (round trip: " + formatNumber(roundTrip, 0) + " ft)",
              },
              {
                label: "Max Acceptable Loss",
                value: maxLossPercent + "%",
              },
            ]),
        };
      },
    },
  ],
  relatedSlugs: ["room-acoustics-calculator", "tv-distance-calculator"],
  faq: [
    {
      question: "What gauge speaker wire do I need?",
      answer:
        "For runs under 50 feet with 8-ohm speakers, 16 AWG is usually sufficient. For longer runs or 4-ohm speakers, use 12 or 14 AWG. The goal is to keep power loss under 5%.",
    },
    {
      question: "Does speaker wire quality matter?",
      answer:
        "The most important factor is using the correct gauge (thickness) for your run length and speaker impedance. Oxygen-free copper (OFC) offers marginal benefits. Exotic cables rarely provide audible improvement.",
    },
  ],
  formula:
    "Power Loss (%) = Wire Resistance / (Speaker Impedance + Wire Resistance) x 100. Wire Resistance = Resistance per foot x 2 x run length (round trip). Target: under 5% loss.",
};
