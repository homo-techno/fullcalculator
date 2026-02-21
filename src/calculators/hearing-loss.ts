import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hearingLossCalculator: CalculatorDefinition = {
  slug: "hearing-loss-calculator",
  title: "Hearing Loss Assessment Calculator",
  description:
    "Free hearing loss assessment calculator. Evaluate hearing loss severity based on audiogram values in decibels (dB). Understand hearing loss classifications and recommendations.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "hearing loss calculator",
    "hearing test",
    "audiogram",
    "decibel hearing",
    "hearing loss severity",
    "hearing assessment",
    "dB hearing level",
  ],
  variants: [
    {
      id: "pta",
      name: "Pure Tone Average (PTA)",
      description: "Calculate hearing loss severity from audiogram values",
      fields: [
        {
          name: "freq500",
          label: "Threshold at 500 Hz",
          type: "number",
          placeholder: "e.g. 25",
          suffix: "dB HL",
          min: -10,
          max: 120,
        },
        {
          name: "freq1000",
          label: "Threshold at 1000 Hz",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "dB HL",
          min: -10,
          max: 120,
        },
        {
          name: "freq2000",
          label: "Threshold at 2000 Hz",
          type: "number",
          placeholder: "e.g. 35",
          suffix: "dB HL",
          min: -10,
          max: 120,
        },
        {
          name: "freq4000",
          label: "Threshold at 4000 Hz",
          type: "number",
          placeholder: "e.g. 40",
          suffix: "dB HL",
          min: -10,
          max: 120,
        },
        {
          name: "ear",
          label: "Ear",
          type: "select",
          options: [
            { label: "Right Ear", value: "right" },
            { label: "Left Ear", value: "left" },
          ],
        },
      ],
      calculate: (inputs) => {
        const f500 = inputs.freq500 as number;
        const f1000 = inputs.freq1000 as number;
        const f2000 = inputs.freq2000 as number;
        const f4000 = inputs.freq4000 as number;
        const ear = inputs.ear as string;
        if (f500 === undefined || f1000 === undefined || f2000 === undefined || f4000 === undefined || !ear) return null;

        // Standard PTA: average of 500, 1000, 2000 Hz
        const pta3 = (f500 + f1000 + f2000) / 3;
        // Four-frequency PTA (includes 4000 Hz)
        const pta4 = (f500 + f1000 + f2000 + f4000) / 4;

        // WHO classification based on PTA (better ear)
        let severity: string;
        let description: string;
        if (pta3 <= 15) { severity = "Normal hearing"; description = "No or very slight hearing problems. Able to hear whispers."; }
        else if (pta3 <= 25) { severity = "Slight hearing loss"; description = "Able to hear and repeat words spoken in normal voice at 1 meter."; }
        else if (pta3 <= 40) { severity = "Mild hearing loss"; description = "Able to hear and repeat words in raised voice at 1 meter. May miss soft speech."; }
        else if (pta3 <= 55) { severity = "Moderate hearing loss"; description = "Able to hear and repeat words in loud voice at 1 meter. Difficulty with normal conversation."; }
        else if (pta3 <= 70) { severity = "Moderately severe hearing loss"; description = "Difficulty hearing even loud speech. Hearing aids strongly recommended."; }
        else if (pta3 <= 90) { severity = "Severe hearing loss"; description = "Can only hear shouted or amplified speech. Hearing aids essential."; }
        else { severity = "Profound hearing loss"; description = "Unable to hear and understand even amplified voice. May benefit from cochlear implant."; }

        let recommendation: string;
        if (pta3 <= 25) recommendation = "Annual hearing check recommended";
        else if (pta3 <= 40) recommendation = "Consider hearing aids; audiologist evaluation recommended";
        else if (pta3 <= 70) recommendation = "Hearing aids recommended; consult an audiologist";
        else recommendation = "Urgent audiological assessment; hearing aids or cochlear implant evaluation";

        // Check for high-frequency loss pattern (noise-induced)
        const highFreqLoss = f4000 > pta3 + 15;

        return {
          primary: { label: `${ear === "right" ? "Right" : "Left"} Ear PTA`, value: `${formatNumber(pta3, 0)} dB HL` },
          details: [
            { label: "3-frequency PTA (500, 1k, 2k)", value: `${formatNumber(pta3, 1)} dB HL` },
            { label: "4-frequency PTA (500, 1k, 2k, 4k)", value: `${formatNumber(pta4, 1)} dB HL` },
            { label: "Severity", value: severity },
            { label: "Description", value: description },
            { label: "Recommendation", value: recommendation },
            ...(highFreqLoss ? [{ label: "Pattern note", value: "High-frequency loss detected — may suggest noise-induced hearing loss" }] : []),
          ],
          note: "This calculator uses WHO hearing loss classifications. A proper hearing assessment requires a complete audiogram performed by an audiologist in a sound booth. This tool is for educational purposes and not a substitute for professional evaluation.",
        };
      },
    },
    {
      id: "binaural",
      name: "Binaural Hearing Loss Percentage",
      description: "Calculate hearing impairment percentage for both ears (AMA method)",
      fields: [
        {
          name: "rightPta",
          label: "Right Ear PTA (avg of 500, 1k, 2k, 3k Hz)",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "dB HL",
          min: 0,
          max: 120,
        },
        {
          name: "leftPta",
          label: "Left Ear PTA (avg of 500, 1k, 2k, 3k Hz)",
          type: "number",
          placeholder: "e.g. 35",
          suffix: "dB HL",
          min: 0,
          max: 120,
        },
      ],
      calculate: (inputs) => {
        const rightPta = inputs.rightPta as number;
        const leftPta = inputs.leftPta as number;
        if (rightPta === undefined || leftPta === undefined) return null;

        // AMA method: monaural impairment = (PTA - 25) x 1.5, capped at 0-100%
        const rightImpairment = Math.max(0, Math.min(100, (rightPta - 25) * 1.5));
        const leftImpairment = Math.max(0, Math.min(100, (leftPta - 25) * 1.5));

        // Binaural: (5 x better ear + 1 x worse ear) / 6
        const betterEar = Math.min(rightImpairment, leftImpairment);
        const worseEar = Math.max(rightImpairment, leftImpairment);
        const binauralImpairment = (5 * betterEar + worseEar) / 6;

        return {
          primary: { label: "Binaural Hearing Impairment", value: `${formatNumber(binauralImpairment, 1)}%` },
          details: [
            { label: "Right ear impairment", value: `${formatNumber(rightImpairment, 1)}%` },
            { label: "Left ear impairment", value: `${formatNumber(leftImpairment, 1)}%` },
            { label: "Binaural impairment", value: `${formatNumber(binauralImpairment, 1)}%` },
            { label: "Better ear", value: rightImpairment <= leftImpairment ? "Right" : "Left" },
            { label: "Method", value: "AMA Guides (AAO-HNS)" },
          ],
          note: "This uses the AAO-HNS/AMA method for calculating hearing impairment. The formula weights the better ear more heavily (5:1 ratio). This is commonly used for disability and workers' compensation evaluations. Consult an audiologist for official assessment.",
        };
      },
    },
  ],
  relatedSlugs: ["decibel-calculator", "noise-level-calculator"],
  faq: [
    {
      question: "What is a Pure Tone Average (PTA)?",
      answer:
        "PTA is the average hearing threshold across key speech frequencies (typically 500, 1000, and 2000 Hz). It provides a single number representing overall hearing ability and is used to classify hearing loss severity.",
    },
    {
      question: "What are the degrees of hearing loss?",
      answer:
        "According to WHO: Normal (0-15 dB), Slight (16-25 dB), Mild (26-40 dB), Moderate (41-55 dB), Moderately Severe (56-70 dB), Severe (71-90 dB), Profound (91+ dB). These are based on PTA.",
    },
    {
      question: "What causes hearing loss?",
      answer:
        "Common causes include aging (presbycusis), noise exposure, genetics, ear infections, medications (ototoxic drugs), head trauma, and diseases. Noise-induced hearing loss typically shows a 'notch' at 4000 Hz on the audiogram.",
    },
    {
      question: "When should I get a hearing test?",
      answer:
        "Adults should have a baseline hearing test and then regular screenings. See an audiologist if you notice difficulty hearing conversations, frequently ask people to repeat themselves, turn up the TV volume excessively, or experience ringing in the ears (tinnitus).",
    },
  ],
  formula:
    "PTA (3-freq) = (500Hz + 1000Hz + 2000Hz) / 3 | PTA (4-freq) = (500Hz + 1000Hz + 2000Hz + 4000Hz) / 4 | Monaural impairment (AMA) = (PTA - 25) x 1.5% | Binaural = (5 x better ear + worse ear) / 6",
};
