import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vinylRecordSpeedCalculator: CalculatorDefinition = {
  slug: "vinyl-record-speed-calculator",
  title: "Vinyl Record Speed Calculator",
  description: "Calculate adjusted playback speed and pitch change for vinyl records at different RPM settings.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["vinyl speed", "record RPM", "turntable pitch"],
  variants: [{
    id: "standard",
    name: "Vinyl Record Speed",
    description: "Calculate adjusted playback speed and pitch change for vinyl records at different RPM settings",
    fields: [
      { name: "originalRpm", label: "Original RPM", type: "select", options: [{value:"33.33",label:"33 1/3 RPM"},{value:"45",label:"45 RPM"},{value:"78",label:"78 RPM"}], defaultValue: "33.33" },
      { name: "playbackRpm", label: "Playback RPM", type: "select", options: [{value:"33.33",label:"33 1/3 RPM"},{value:"45",label:"45 RPM"},{value:"78",label:"78 RPM"}], defaultValue: "45" },
      { name: "trackLength", label: "Track Length", type: "number", suffix: "minutes", min: 0.5, max: 30, defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const origRpm = parseFloat(inputs.originalRpm as string);
      const playRpm = parseFloat(inputs.playbackRpm as string);
      const trackLen = inputs.trackLength as number;
      if (!origRpm || !playRpm || !trackLen) return null;
      const speedRatio = playRpm / origRpm;
      const pitchChange = (speedRatio - 1) * 100;
      const semitones = 12 * Math.log2(speedRatio);
      const adjustedLength = trackLen / speedRatio;
      return {
        primary: { label: "Speed Change", value: (pitchChange >= 0 ? "+" : "") + pitchChange.toFixed(1) + "%" },
        details: [
          { label: "Pitch Shift", value: (semitones >= 0 ? "+" : "") + semitones.toFixed(1) + " semitones" },
          { label: "Adjusted Track Length", value: adjustedLength.toFixed(2) + " minutes" },
          { label: "Speed Ratio", value: speedRatio.toFixed(3) + "x" },
        ],
      };
    },
  }],
  relatedSlugs: ["bpm-to-ms-calculator", "audio-cable-length-calculator"],
  faq: [
    { question: "What happens when you play a 33 RPM record at 45 RPM?", answer: "The music plays approximately 35% faster and the pitch rises by about 5 semitones, making everything sound higher and quicker." },
    { question: "What are the standard vinyl record speeds?", answer: "The three standard speeds are 33 1/3 RPM for albums, 45 RPM for singles, and 78 RPM for older shellac records." },
  ],
  formula: "Speed Change = ((Playback RPM / Original RPM) - 1) x 100%",
};
