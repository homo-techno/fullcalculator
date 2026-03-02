import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const audioBitrateFileSizeCalculator: CalculatorDefinition = {
  slug: "audio-bitrate-file-size-calculator",
  title: "Audio Bitrate File Size Calculator",
  description: "Calculate audio file sizes based on bitrate, sample rate, duration, and format.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["audio","bitrate","file size","mp3","wav","flac"],
  variants: [{
    id: "standard",
    name: "Audio Bitrate File Size",
    description: "Calculate audio file sizes based on bitrate, sample rate, duration, and format.",
    fields: [
      { name: "duration", label: "Duration (minutes)", type: "number", min: 0.5, max: 600, defaultValue: 4 },
      { name: "format", label: "Audio Format", type: "select", options: [{ value: "1", label: "MP3 (128 kbps)" }, { value: "2", label: "MP3 (320 kbps)" }, { value: "3", label: "WAV (16-bit/44.1kHz)" }, { value: "4", label: "FLAC (Lossless)" }, { value: "5", label: "AAC (256 kbps)" }], defaultValue: "2" },
      { name: "numTracks", label: "Number of Tracks", type: "number", min: 1, max: 500, defaultValue: 12 },
    ],
    calculate: (inputs) => {
    const duration = inputs.duration as number;
    const format = inputs.format as number;
    const numTracks = inputs.numTracks as number;
    const bitrates = [0, 128, 320, 1411, 900, 256];
    const formatLabels = ["", "MP3 128kbps", "MP3 320kbps", "WAV 16-bit", "FLAC Lossless", "AAC 256kbps"];
    const bitrate = bitrates[format];
    const fileSizeMB = (bitrate * duration * 60) / 8 / 1024;
    const totalSizeMB = fileSizeMB * numTracks;
    const totalSizeGB = totalSizeMB / 1024;
    const totalDuration = duration * numTracks;
    return {
      primary: { label: "File Size Per Track", value: formatNumber(fileSizeMB) + " MB" },
      details: [
        { label: "Format", value: formatLabels[format] },
        { label: "Total Size (" + numTracks + " tracks)", value: totalSizeGB >= 1 ? formatNumber(totalSizeGB) + " GB" : formatNumber(totalSizeMB) + " MB" },
        { label: "Bitrate", value: formatNumber(bitrate) + " kbps" },
        { label: "Total Duration", value: formatNumber(totalDuration) + " min" }
      ]
    };
  },
  }],
  relatedSlugs: ["podcast-production-cost-calculator","album-production-budget-calculator","music-streaming-revenue-calculator"],
  faq: [
    { question: "How big is a 3-minute MP3 file?", answer: "At 320 kbps, a 3-minute MP3 is approximately 7.2 MB. At 128 kbps it is about 2.9 MB." },
    { question: "What is the difference between lossy and lossless audio?", answer: "Lossy formats like MP3 discard some audio data to reduce size, while lossless formats like FLAC preserve all original audio data." },
    { question: "What bitrate should I use for music?", answer: "For high quality listening, 320 kbps MP3 or 256 kbps AAC are excellent. Audiophiles prefer FLAC or WAV for lossless quality." },
  ],
  formula: "File Size (MB) = (Bitrate kbps x Duration sec) / 8 / 1024",
};
