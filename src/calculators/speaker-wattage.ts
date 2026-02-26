import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const speakerWattageCalculator: CalculatorDefinition = {
  slug: "speaker-wattage-calculator",
  title: "Speaker & Amplifier Wattage Calculator",
  description: "Free online speaker and amplifier wattage calculator. Calculate power requirements, SPL levels, and amplifier matching for speakers.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["speaker wattage calculator", "amplifier power calculator", "speaker power calculator", "SPL calculator", "amp wattage calculator"],
  variants: [
    {
      id: "spl",
      name: "SPL (Sound Pressure Level)",
      description: "Calculate expected SPL from speaker sensitivity and amplifier power",
      fields: [
        { name: "sensitivity", label: "Speaker Sensitivity (dB @ 1W/1m)", type: "number", placeholder: "e.g. 87" },
        { name: "power", label: "Amplifier Power (watts RMS)", type: "number", placeholder: "e.g. 100" },
        { name: "distance", label: "Listening Distance (feet)", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
        { name: "numSpeakers", label: "Number of Speakers", type: "select", options: [
          { label: "1 speaker", value: "1" },
          { label: "2 speakers (+3 dB)", value: "2" },
          { label: "4 speakers (+6 dB)", value: "4" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const sensitivity = parseFloat(inputs.sensitivity as string) || 0;
        const power = parseFloat(inputs.power as string) || 0;
        const distanceFt = parseFloat(inputs.distance as string) || 10;
        const numSpeakers = parseFloat(inputs.numSpeakers as string) || 1;
        if (!sensitivity || !power) return null;

        const distanceM = distanceFt * 0.3048;
        const splAt1m = sensitivity + 10 * Math.log10(power);
        const distanceLoss = 20 * Math.log10(distanceM);
        const speakerBonus = 10 * Math.log10(numSpeakers);
        const splAtDistance = splAt1m - distanceLoss + speakerBonus;

        return {
          primary: { label: "SPL at Listening Position", value: `${formatNumber(splAtDistance, 1)} dB` },
          details: [
            { label: "SPL at 1 meter", value: `${formatNumber(splAt1m, 1)} dB` },
            { label: "Distance loss", value: `${formatNumber(distanceLoss, 1)} dB` },
            { label: "Multi-speaker gain", value: `+${formatNumber(speakerBonus, 1)} dB` },
            { label: "Listening distance", value: `${formatNumber(distanceFt, 1)} ft (${formatNumber(distanceM, 2)} m)` },
          ],
          note: "85 dB is typical comfortable listening. 100+ dB is concert level. Sustained exposure above 85 dB may damage hearing.",
        };
      },
    },
    {
      id: "amp-matching",
      name: "Amplifier Matching",
      description: "Calculate recommended amplifier wattage for your speakers",
      fields: [
        { name: "speakerRms", label: "Speaker RMS Power (watts)", type: "number", placeholder: "e.g. 100" },
        { name: "speakerPeak", label: "Speaker Peak Power (watts)", type: "number", placeholder: "e.g. 200" },
        { name: "impedance", label: "Speaker Impedance (ohms)", type: "select", options: [
          { label: "4 ohms", value: "4" },
          { label: "6 ohms", value: "6" },
          { label: "8 ohms", value: "8" },
          { label: "16 ohms", value: "16" },
        ], defaultValue: "8" },
        { name: "usage", label: "Usage Type", type: "select", options: [
          { label: "Home listening", value: "0.8" },
          { label: "Home theater", value: "1.0" },
          { label: "DJ / Party", value: "1.25" },
          { label: "Live sound / PA", value: "1.5" },
        ], defaultValue: "1.0" },
      ],
      calculate: (inputs) => {
        const speakerRms = parseFloat(inputs.speakerRms as string) || 0;
        const speakerPeak = parseFloat(inputs.speakerPeak as string) || 0;
        const impedance = parseFloat(inputs.impedance as string) || 8;
        const usageFactor = parseFloat(inputs.usage as string) || 1.0;
        if (!speakerRms) return null;

        const minAmp = speakerRms * 0.8;
        const idealAmp = speakerRms * usageFactor;
        const maxAmp = speakerPeak > 0 ? speakerPeak : speakerRms * 2;
        const currentDraw = idealAmp / (impedance * 0.8);

        return {
          primary: { label: "Recommended Amp Power", value: `${formatNumber(idealAmp, 0)} watts RMS` },
          details: [
            { label: "Minimum amp power", value: `${formatNumber(minAmp, 0)} watts` },
            { label: "Maximum amp power", value: `${formatNumber(maxAmp, 0)} watts` },
            { label: "Speaker impedance", value: `${impedance} ohms` },
            { label: "Est. current draw at full power", value: `${formatNumber(currentDraw, 1)} amps` },
          ],
          note: "Choose an amplifier rated at 1-1.5x the speaker's RMS rating for optimal headroom without risk of damage.",
        };
      },
    },
  ],
  relatedSlugs: ["ohms-law-calculator", "electricity-cost-calculator"],
  faq: [
    { question: "How do I match speakers and amplifiers?", answer: "Choose an amplifier that provides 1 to 1.5 times the speaker's continuous (RMS) power rating. Never exceed the speaker's peak power rating. Make sure impedances are compatible." },
    { question: "What is speaker sensitivity?", answer: "Sensitivity measures how loud a speaker is at 1 watt of power, measured at 1 meter. Higher sensitivity (90+ dB) means the speaker produces more sound per watt, requiring less amplifier power." },
    { question: "Does doubling watts double the volume?", answer: "No. Doubling the amplifier power only adds about 3 dB, which is barely noticeable. You need roughly 10x the power to sound twice as loud to human ears." },
  ],
  formula: "SPL (dB) = Sensitivity + 10 × log10(Power) - 20 × log10(Distance)",
};
