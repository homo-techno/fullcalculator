import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const audioFileSizeCalculator: CalculatorDefinition = {
  slug: "audio-file-size-calculator",
  title: "Audio File Size Calculator",
  description: "Free audio file size calculator. Estimate audio file size from bitrate, sample rate, duration, and format for music production and recording.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["audio file size calculator", "WAV file size", "MP3 file size", "audio storage calculator", "music file size"],
  variants: [
    {
      id: "compressed",
      name: "Compressed Audio (MP3/AAC/OGG)",
      description: "Calculate file size for compressed audio formats",
      fields: [
        { name: "bitrate", label: "Bitrate", type: "select", options: [
          { label: "64 kbps (low/speech)", value: "64" },
          { label: "96 kbps (FM quality)", value: "96" },
          { label: "128 kbps (standard)", value: "128" },
          { label: "192 kbps (good)", value: "192" },
          { label: "256 kbps (high)", value: "256" },
          { label: "320 kbps (maximum MP3)", value: "320" },
        ], defaultValue: "192" },
        { name: "hours", label: "Hours", type: "number", placeholder: "0", defaultValue: 0 },
        { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "seconds", label: "Seconds", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
      ],
      calculate: (inputs) => {
        const bitrate = parseInt(inputs.bitrate as string) || 192;
        const hours = (inputs.hours as number) || 0;
        const minutes = (inputs.minutes as number) || 0;
        const seconds = (inputs.seconds as number) || 0;

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        if (totalSeconds === 0) return null;

        const fileSizeMB = (bitrate * totalSeconds) / 8 / 1024;
        const fileSizeKB = fileSizeMB * 1024;

        return {
          primary: { label: "File Size", value: fileSizeMB >= 1 ? `${formatNumber(fileSizeMB, 2)} MB` : `${formatNumber(fileSizeKB, 0)} KB` },
          details: [
            { label: "File size (KB)", value: `${formatNumber(fileSizeKB, 0)} KB` },
            { label: "File size (MB)", value: `${formatNumber(fileSizeMB, 2)} MB` },
            { label: "Duration", value: `${hours}h ${minutes}m ${seconds}s` },
            { label: "Bitrate", value: `${bitrate} kbps` },
            { label: "Per minute", value: `${formatNumber(bitrate * 60 / 8 / 1024, 2)} MB/min` },
            { label: "Per hour", value: `${formatNumber(bitrate * 3600 / 8 / 1024, 1)} MB/hr` },
          ],
        };
      },
    },
    {
      id: "uncompressed",
      name: "Uncompressed Audio (WAV/AIFF)",
      description: "Calculate file size for uncompressed audio",
      fields: [
        { name: "sampleRate", label: "Sample Rate", type: "select", options: [
          { label: "22,050 Hz (low quality)", value: "22050" },
          { label: "44,100 Hz (CD quality)", value: "44100" },
          { label: "48,000 Hz (video standard)", value: "48000" },
          { label: "88,200 Hz (high-res)", value: "88200" },
          { label: "96,000 Hz (high-res)", value: "96000" },
          { label: "192,000 Hz (ultra high-res)", value: "192000" },
        ], defaultValue: "44100" },
        { name: "bitDepth", label: "Bit Depth", type: "select", options: [
          { label: "16-bit (CD quality)", value: "16" },
          { label: "24-bit (professional)", value: "24" },
          { label: "32-bit float (studio)", value: "32" },
        ], defaultValue: "24" },
        { name: "channels", label: "Channels", type: "select", options: [
          { label: "Mono (1 channel)", value: "1" },
          { label: "Stereo (2 channels)", value: "2" },
          { label: "5.1 Surround (6 channels)", value: "6" },
          { label: "7.1 Surround (8 channels)", value: "8" },
        ], defaultValue: "2" },
        { name: "minutes", label: "Duration (minutes)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const sampleRate = parseInt(inputs.sampleRate as string) || 44100;
        const bitDepth = parseInt(inputs.bitDepth as string) || 24;
        const channels = parseInt(inputs.channels as string) || 2;
        const minutes = inputs.minutes as number;
        if (!minutes) return null;

        const totalSeconds = minutes * 60;
        const bytesPerSecond = sampleRate * (bitDepth / 8) * channels;
        const fileSizeMB = (bytesPerSecond * totalSeconds) / (1024 * 1024);
        const fileSizeGB = fileSizeMB / 1024;
        const bitrateKbps = (bytesPerSecond * 8) / 1000;

        return {
          primary: { label: "File Size", value: fileSizeGB >= 1 ? `${formatNumber(fileSizeGB, 2)} GB` : `${formatNumber(fileSizeMB, 1)} MB` },
          details: [
            { label: "File size", value: `${formatNumber(fileSizeMB, 1)} MB (${formatNumber(fileSizeGB, 3)} GB)` },
            { label: "Data rate", value: `${formatNumber(bitrateKbps, 0)} kbps` },
            { label: "Bytes per second", value: formatNumber(bytesPerSecond, 0) },
            { label: "Sample rate", value: `${formatNumber(sampleRate / 1000, 1)} kHz` },
            { label: "Bit depth", value: `${bitDepth}-bit` },
            { label: "Channels", value: `${channels}` },
            { label: "Per minute", value: `${formatNumber(bytesPerSecond * 60 / (1024 * 1024), 1)} MB` },
          ],
        };
      },
    },
    {
      id: "compare",
      name: "Format Comparison",
      description: "Compare file sizes across audio formats",
      fields: [
        { name: "minutes", label: "Duration (minutes)", type: "number", placeholder: "e.g. 4" },
        { name: "channels", label: "Channels", type: "select", options: [
          { label: "Mono", value: "1" },
          { label: "Stereo", value: "2" },
        ], defaultValue: "2" },
      ],
      calculate: (inputs) => {
        const minutes = inputs.minutes as number;
        const channels = parseInt(inputs.channels as string) || 2;
        if (!minutes) return null;

        const totalSeconds = minutes * 60;
        const wavSize = (44100 * 2 * channels * totalSeconds) / (1024 * 1024);
        const flacSize = wavSize * 0.55;
        const mp3_320 = (320 * totalSeconds) / 8 / 1024;
        const mp3_192 = (192 * totalSeconds) / 8 / 1024;
        const mp3_128 = (128 * totalSeconds) / 8 / 1024;
        const aac_256 = (256 * totalSeconds) / 8 / 1024;
        const ogg_160 = (160 * totalSeconds) / 8 / 1024;

        return {
          primary: { label: "WAV (16-bit) Size", value: `${formatNumber(wavSize, 1)} MB` },
          details: [
            { label: "WAV 16-bit/44.1kHz", value: `${formatNumber(wavSize, 1)} MB` },
            { label: "FLAC (lossless)", value: `~${formatNumber(flacSize, 1)} MB` },
            { label: "MP3 320 kbps", value: `${formatNumber(mp3_320, 1)} MB` },
            { label: "MP3 192 kbps", value: `${formatNumber(mp3_192, 1)} MB` },
            { label: "MP3 128 kbps", value: `${formatNumber(mp3_128, 1)} MB` },
            { label: "AAC 256 kbps", value: `${formatNumber(aac_256, 1)} MB` },
            { label: "OGG 160 kbps", value: `${formatNumber(ogg_160, 1)} MB` },
          ],
          note: "FLAC size is approximate (~55% of WAV). Actual compressed sizes vary with audio content complexity.",
        };
      },
    },
  ],
  relatedSlugs: ["video-file-size-calculator", "podcast-file-size-calculator", "streaming-data-calculator"],
  faq: [
    { question: "How big is a 3-minute MP3?", answer: "At 192 kbps (good quality), a 3-minute MP3 is about 4.2 MB. At 320 kbps (maximum quality), it's about 7 MB. At 128 kbps (standard), it's about 2.8 MB." },
    { question: "WAV vs FLAC - which is better?", answer: "Both are lossless (identical quality). WAV is uncompressed and universally compatible. FLAC compresses to about 50-60% of WAV size with no quality loss but requires compatible players." },
    { question: "What audio bitrate should I use?", answer: "For music: 256-320 kbps (MP3/AAC) or lossless (FLAC/WAV). For podcasts/speech: 64-128 kbps is sufficient. For professional production: 24-bit/48kHz WAV minimum." },
  ],
  formula: "Compressed: Size (MB) = Bitrate (kbps) × Duration (s) / 8 / 1024 | Uncompressed: Size = Sample Rate × Bit Depth/8 × Channels × Duration",
};
