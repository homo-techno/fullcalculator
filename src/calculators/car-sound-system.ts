import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carSoundSystemCalculator: CalculatorDefinition = {
  slug: "car-sound-system-calculator",
  title: "Car Sound System Calculator",
  description: "Free car sound system calculator. Plan your car audio upgrade with amplifier power, speaker matching, and budget calculations.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["car sound system calculator", "car audio calculator", "amplifier power calculator", "car speaker calculator", "car stereo budget"],
  variants: [
    {
      id: "power",
      name: "Amplifier Power Matching",
      description: "Calculate proper amplifier power for your speakers",
      fields: [
        { name: "speakerRms", label: "Speaker RMS Rating (each)", type: "number", placeholder: "e.g. 75", suffix: "watts" },
        { name: "numSpeakers", label: "Number of Speakers", type: "number", placeholder: "e.g. 4" },
        { name: "speakerOhms", label: "Speaker Impedance", type: "select", options: [
          { label: "2 ohms", value: "2" },
          { label: "4 ohms", value: "4" },
          { label: "8 ohms", value: "8" },
        ], defaultValue: "4" },
        { name: "subRms", label: "Subwoofer RMS (if any)", type: "number", placeholder: "e.g. 300", suffix: "watts" },
      ],
      calculate: (inputs) => {
        const speakerRms = (inputs.speakerRms as number) || 0;
        const numSpeakers = (inputs.numSpeakers as number) || 0;
        const ohms = parseInt(inputs.speakerOhms as string) || 4;
        const subRms = (inputs.subRms as number) || 0;

        const totalSpeakerRms = speakerRms * numSpeakers;
        const recommendedAmpMin = totalSpeakerRms * 0.75;
        const recommendedAmpMax = totalSpeakerRms * 1.5;
        const subAmpMin = subRms * 0.75;
        const subAmpMax = subRms * 1.5;
        const totalSystemPower = totalSpeakerRms + subRms;

        return {
          primary: { label: "Total System RMS", value: `${formatNumber(totalSystemPower, 0)} watts` },
          details: [
            { label: "Speaker amp needed", value: `${formatNumber(recommendedAmpMin, 0)}-${formatNumber(recommendedAmpMax, 0)} watts RMS` },
            { label: "Sub amp needed", value: subRms > 0 ? `${formatNumber(subAmpMin, 0)}-${formatNumber(subAmpMax, 0)} watts RMS` : "No sub" },
            { label: "Total speaker RMS", value: `${formatNumber(totalSpeakerRms, 0)} watts` },
            { label: "Speaker impedance", value: `${ohms} ohms` },
            { label: "Channels needed", value: `${numSpeakers}${subRms > 0 ? " + 1 sub" : ""}` },
          ],
        };
      },
    },
    {
      id: "budget",
      name: "Audio Upgrade Budget",
      description: "Plan your car audio upgrade budget",
      fields: [
        { name: "headUnit", label: "Head Unit / Stereo", type: "number", placeholder: "e.g. 300", prefix: "$" },
        { name: "speakers", label: "Speakers (set)", type: "number", placeholder: "e.g. 200", prefix: "$" },
        { name: "amplifier", label: "Amplifier", type: "number", placeholder: "e.g. 250", prefix: "$" },
        { name: "subwoofer", label: "Subwoofer + Enclosure", type: "number", placeholder: "e.g. 350", prefix: "$" },
        { name: "wiring", label: "Wiring Kit", type: "number", placeholder: "e.g. 50", prefix: "$" },
        { name: "installation", label: "Professional Installation", type: "number", placeholder: "e.g. 400", prefix: "$" },
        { name: "soundDeadening", label: "Sound Deadening Material", type: "number", placeholder: "e.g. 100", prefix: "$" },
      ],
      calculate: (inputs) => {
        const head = (inputs.headUnit as number) || 0;
        const speakers = (inputs.speakers as number) || 0;
        const amp = (inputs.amplifier as number) || 0;
        const sub = (inputs.subwoofer as number) || 0;
        const wiring = (inputs.wiring as number) || 0;
        const install = (inputs.installation as number) || 0;
        const deadening = (inputs.soundDeadening as number) || 0;

        const equipmentTotal = head + speakers + amp + sub + wiring + deadening;
        const grandTotal = equipmentTotal + install;
        const diyTotal = equipmentTotal;

        return {
          primary: { label: "Total Upgrade Cost", value: `$${formatNumber(grandTotal)}` },
          details: [
            { label: "Equipment total", value: `$${formatNumber(equipmentTotal)}` },
            { label: "Installation", value: `$${formatNumber(install)}` },
            { label: "DIY total (no install)", value: `$${formatNumber(diyTotal)}` },
            { label: "Head unit", value: `$${formatNumber(head)}` },
            { label: "Speakers", value: `$${formatNumber(speakers)}` },
            { label: "Amp + Sub", value: `$${formatNumber(amp + sub)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-total-cost-calculator", "car-maintenance-cost-calculator"],
  faq: [
    { question: "How much does a car sound system upgrade cost?", answer: "A basic upgrade (head unit + speakers) costs $200-$500. A mid-level system with amplifier and subwoofer runs $500-$1,500. High-end custom systems can cost $2,000-$10,000+. Installation adds $100-$500." },
    { question: "Should amp watts match speaker watts?", answer: "Your amplifier should provide 75-150% of the speaker's RMS rating. Too little power causes distortion, while too much can damage speakers. Always match RMS ratings, not peak power ratings." },
  ],
  formula: "Recommended Amp Power = Speaker RMS × 0.75 to Speaker RMS × 1.5",
};
