import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cableLengthAudioCalculator: CalculatorDefinition = {
  slug: "cable-length-audio-calculator",
  title: "Audio Cable Length Calculator",
  description:
    "Free audio cable length calculator. Calculate signal loss, impedance, and maximum cable runs for different audio cable types.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "audio cable calculator",
    "cable length signal loss",
    "speaker wire gauge",
    "audio cable distance",
    "XLR cable length",
    "speaker wire calculator",
  ],
  variants: [
    {
      id: "speaker-wire",
      name: "Speaker Wire Calculator",
      description: "Calculate recommended speaker wire gauge based on run length and impedance",
      fields: [
        {
          name: "distance",
          label: "Cable Run Length (feet)",
          type: "number",
          placeholder: "e.g. 50",
          min: 1,
        },
        {
          name: "impedance",
          label: "Speaker Impedance (ohms)",
          type: "select",
          options: [
            { label: "2 ohms", value: "2" },
            { label: "4 ohms", value: "4" },
            { label: "6 ohms", value: "6" },
            { label: "8 ohms", value: "8" },
            { label: "16 ohms", value: "16" },
          ],
          defaultValue: "8",
        },
        {
          name: "power",
          label: "Amplifier Power (watts)",
          type: "number",
          placeholder: "e.g. 100",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const distance = inputs.distance as number;
        const impedance = parseFloat(inputs.impedance as string);
        const power = inputs.power as number;
        if (!distance || !impedance || !power) return null;

        // Wire resistance per foot (round trip = 2x distance) per AWG
        const gaugeResistance: { awg: number; ohmPerFt: number }[] = [
          { awg: 18, ohmPerFt: 0.00651 },
          { awg: 16, ohmPerFt: 0.00409 },
          { awg: 14, ohmPerFt: 0.00257 },
          { awg: 12, ohmPerFt: 0.00162 },
          { awg: 10, ohmPerFt: 0.00102 },
        ];

        const results = gaugeResistance.map((g) => {
          const totalResistance = g.ohmPerFt * distance * 2; // round trip
          const lossPercent = (totalResistance / (impedance + totalResistance)) * 100;
          const lossDb = 10 * Math.log10(1 - totalResistance / (impedance + totalResistance));
          const powerDelivered = power * (impedance / (impedance + totalResistance));
          return {
            awg: g.awg,
            resistance: totalResistance,
            lossPercent,
            lossDb,
            powerDelivered,
            acceptable: lossPercent < 5,
          };
        });

        const recommended = results.find((r) => r.acceptable) || results[results.length - 1];

        const details: { label: string; value: string }[] = [
          { label: "Run Length", value: `${distance} ft (${formatNumber(distance * 0.3048, 1)} m)` },
          { label: "Speaker Impedance", value: `${impedance} ohms` },
          { label: "Amplifier Power", value: `${power} W` },
        ];

        results.forEach((r) => {
          const marker = r.awg === recommended.awg ? " [RECOMMENDED]" : "";
          details.push({
            label: `${r.awg} AWG`,
            value: `${formatNumber(r.lossPercent, 1)}% loss (${formatNumber(r.lossDb, 2)} dB), ${formatNumber(r.powerDelivered, 1)}W delivered${marker}`,
          });
        });

        return {
          primary: { label: "Recommended Gauge", value: `${recommended.awg} AWG` },
          details,
          note: "Keep power loss under 5% (about 0.2 dB) for best performance. Shorter runs or higher impedance speakers allow thinner wire.",
        };
      },
    },
    {
      id: "max-cable-length",
      name: "Max Audio Cable Length",
      description: "Maximum recommended cable length by cable type",
      fields: [
        {
          name: "cableType",
          label: "Cable Type",
          type: "select",
          options: [
            { label: "XLR (balanced mic/line)", value: "xlr" },
            { label: "TRS 1/4\" (balanced)", value: "trs" },
            { label: "TS 1/4\" (unbalanced guitar)", value: "ts" },
            { label: "RCA (unbalanced)", value: "rca" },
            { label: "3.5mm / AUX (unbalanced)", value: "aux" },
            { label: "HDMI (audio/video)", value: "hdmi" },
            { label: "Optical / TOSLINK", value: "optical" },
            { label: "USB (audio interface)", value: "usb" },
          ],
          defaultValue: "xlr",
        },
        {
          name: "desiredLength",
          label: "Desired Length (feet)",
          type: "number",
          placeholder: "e.g. 100",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const cableType = inputs.cableType as string;
        const desired = inputs.desiredLength as number;
        if (!desired) return null;

        const specs: Record<string, { maxFt: number; desc: string; balanced: boolean }> = {
          xlr: { maxFt: 1000, desc: "XLR (balanced)", balanced: true },
          trs: { maxFt: 500, desc: "TRS 1/4\" (balanced)", balanced: true },
          ts: { maxFt: 25, desc: "TS 1/4\" (unbalanced)", balanced: false },
          rca: { maxFt: 25, desc: "RCA (unbalanced)", balanced: false },
          aux: { maxFt: 15, desc: "3.5mm AUX (unbalanced)", balanced: false },
          hdmi: { maxFt: 50, desc: "HDMI", balanced: false },
          optical: { maxFt: 33, desc: "Optical / TOSLINK", balanced: false },
          usb: { maxFt: 16, desc: "USB 2.0", balanced: false },
        };

        const spec = specs[cableType] || specs.xlr;
        const withinSpec = desired <= spec.maxFt;
        const capacitanceLoss = spec.balanced ? "Minimal (balanced rejection)" : `~${formatNumber(desired * 0.3, 1)} dB high-freq loss estimate`;

        return {
          primary: { label: "Max Recommended Length", value: `${spec.maxFt} ft` },
          details: [
            { label: "Cable Type", value: spec.desc },
            { label: "Your Desired Length", value: `${desired} ft` },
            { label: "Within Spec?", value: withinSpec ? "Yes" : "No - too long" },
            { label: "Balanced?", value: spec.balanced ? "Yes (noise rejection)" : "No (susceptible to interference)" },
            { label: "High-Frequency Loss", value: capacitanceLoss },
          ],
          note: !withinSpec
            ? `${desired} ft exceeds the recommended ${spec.maxFt} ft maximum for ${spec.desc}. Consider a balanced cable, DI box, or signal booster.`
            : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["speaker-placement-calculator", "subwoofer-box-calculator", "ohms-law-calculator"],
  faq: [
    {
      question: "What gauge speaker wire do I need?",
      answer:
        "For short runs (under 25 ft) with 8-ohm speakers, 16 AWG is fine. For longer runs or lower impedance speakers, use 14 or 12 AWG. The rule of thumb: keep total power loss under 5% of speaker impedance.",
    },
    {
      question: "What is the maximum length for an XLR cable?",
      answer:
        "XLR cables can run up to 1000 feet (300m) with minimal signal loss because they use balanced signals that reject noise. This makes them ideal for long live sound and studio runs.",
    },
    {
      question: "Why are balanced cables better for long runs?",
      answer:
        "Balanced cables (XLR, TRS) carry two copies of the signal with opposite polarity. At the receiving end, noise picked up along the cable is canceled out (common-mode rejection). Unbalanced cables (TS, RCA) pick up more interference over distance.",
    },
  ],
  formula:
    "Wire Resistance = Ohms/ft x Length x 2 (round trip) | Power Loss % = Wire Resistance / (Speaker Impedance + Wire Resistance) x 100 | Loss dB = 10 x log10(1 - loss ratio)",
};
