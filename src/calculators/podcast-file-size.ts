import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const podcastFileSizeCalculator: CalculatorDefinition = {
  slug: "podcast-file-size-calculator",
  title: "Podcast File Size Calculator",
  description: "Free podcast file size calculator. Estimate podcast episode file size and storage needs based on duration, bitrate, and audio format.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["podcast file size calculator", "podcast storage calculator", "podcast bitrate", "podcast audio size", "episode size calculator"],
  variants: [
    {
      id: "episode",
      name: "Episode File Size",
      description: "Calculate file size for a podcast episode",
      fields: [
        { name: "hours", label: "Hours", type: "number", placeholder: "0", defaultValue: 0 },
        { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 45" },
        { name: "bitrate", label: "Output Bitrate", type: "select", options: [
          { label: "64 kbps Mono (spoken word)", value: "64" },
          { label: "96 kbps Mono (good speech)", value: "96" },
          { label: "128 kbps Stereo (standard podcast)", value: "128" },
          { label: "160 kbps Stereo (good quality)", value: "160" },
          { label: "192 kbps Stereo (high quality)", value: "192" },
          { label: "256 kbps Stereo (music podcast)", value: "256" },
        ], defaultValue: "128" },
        { name: "format", label: "Audio Format", type: "select", options: [
          { label: "MP3 (most compatible)", value: "mp3" },
          { label: "AAC/M4A (smaller, Apple)", value: "aac" },
          { label: "OGG Vorbis (open source)", value: "ogg" },
        ], defaultValue: "mp3" },
      ],
      calculate: (inputs) => {
        const hours = (inputs.hours as number) || 0;
        const minutes = (inputs.minutes as number) || 0;
        const bitrate = parseInt(inputs.bitrate as string) || 128;
        const format = inputs.format as string;

        const totalMinutes = hours * 60 + minutes;
        if (totalMinutes === 0) return null;

        const totalSeconds = totalMinutes * 60;
        const formatMultiplier = format === "aac" ? 0.85 : format === "ogg" ? 0.9 : 1.0;
        const fileSizeMB = (bitrate * totalSeconds * formatMultiplier) / 8 / 1024;
        const fileSizeGB = fileSizeMB / 1024;

        const monthlyEpisodes4 = fileSizeMB * 4;
        const yearlyStorage = fileSizeMB * 52;

        return {
          primary: { label: "Episode File Size", value: `${formatNumber(fileSizeMB, 1)} MB` },
          details: [
            { label: "File size", value: `${formatNumber(fileSizeMB, 1)} MB` },
            { label: "Duration", value: `${hours}h ${minutes}m` },
            { label: "Bitrate", value: `${bitrate} kbps` },
            { label: "Format", value: format.toUpperCase() },
            { label: "Per minute", value: `${formatNumber(bitrate * 60 * formatMultiplier / 8 / 1024, 2)} MB/min` },
            { label: "Monthly (4 episodes)", value: `${formatNumber(monthlyEpisodes4, 1)} MB` },
            { label: "Yearly (weekly show)", value: `${formatNumber(yearlyStorage / 1024, 2)} GB` },
          ],
          note: "Most podcast hosts recommend 128 kbps MP3 for speech-only podcasts. Music podcasts benefit from 192-256 kbps. Mono is fine for single-speaker shows.",
        };
      },
    },
    {
      id: "hosting",
      name: "Hosting Storage Estimate",
      description: "Estimate podcast hosting storage needs",
      fields: [
        { name: "avgDuration", label: "Avg Episode Duration (min)", type: "number", placeholder: "e.g. 45" },
        { name: "frequency", label: "Publishing Frequency", type: "select", options: [
          { label: "Daily (7/week)", value: "365" },
          { label: "3x per week", value: "156" },
          { label: "2x per week", value: "104" },
          { label: "Weekly", value: "52" },
          { label: "Bi-weekly", value: "26" },
          { label: "Monthly", value: "12" },
        ], defaultValue: "52" },
        { name: "bitrate", label: "Bitrate (kbps)", type: "select", options: [
          { label: "64 kbps", value: "64" },
          { label: "96 kbps", value: "96" },
          { label: "128 kbps", value: "128" },
          { label: "192 kbps", value: "192" },
        ], defaultValue: "128" },
        { name: "years", label: "Time Period", type: "select", options: [
          { label: "1 year", value: "1" },
          { label: "2 years", value: "2" },
          { label: "3 years", value: "3" },
          { label: "5 years", value: "5" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const avgMin = inputs.avgDuration as number;
        const epsPerYear = parseInt(inputs.frequency as string) || 52;
        const bitrate = parseInt(inputs.bitrate as string) || 128;
        const years = parseInt(inputs.years as string) || 1;
        if (!avgMin) return null;

        const episodeSizeMB = (bitrate * avgMin * 60) / 8 / 1024;
        const totalEpisodes = epsPerYear * years;
        const totalSizeGB = (episodeSizeMB * totalEpisodes) / 1024;
        const monthlyBandwidthGB1000 = (episodeSizeMB * 1000 * epsPerYear / 12) / 1024;

        return {
          primary: { label: "Total Storage", value: `${formatNumber(totalSizeGB, 1)} GB` },
          details: [
            { label: "Per episode", value: `${formatNumber(episodeSizeMB, 1)} MB` },
            { label: "Total episodes", value: formatNumber(totalEpisodes) },
            { label: "Total storage", value: `${formatNumber(totalSizeGB, 2)} GB` },
            { label: "Episodes per year", value: formatNumber(epsPerYear) },
            { label: "Time period", value: `${years} year${years > 1 ? "s" : ""}` },
            { label: "Monthly bandwidth (1K downloads/ep)", value: `${formatNumber(monthlyBandwidthGB1000, 1)} GB` },
          ],
          note: "Bandwidth = file size x downloads. Most podcast hosts offer unlimited storage. Budget for bandwidth if self-hosting.",
        };
      },
    },
    {
      id: "recording",
      name: "Recording Storage",
      description: "Estimate raw recording storage needs",
      fields: [
        { name: "recordMinutes", label: "Recording Duration (minutes)", type: "number", placeholder: "e.g. 90" },
        { name: "sampleRate", label: "Sample Rate", type: "select", options: [
          { label: "44,100 Hz (CD quality)", value: "44100" },
          { label: "48,000 Hz (standard)", value: "48000" },
          { label: "96,000 Hz (high-res)", value: "96000" },
        ], defaultValue: "48000" },
        { name: "bitDepth", label: "Bit Depth", type: "select", options: [
          { label: "16-bit", value: "16" },
          { label: "24-bit (recommended)", value: "24" },
          { label: "32-bit float", value: "32" },
        ], defaultValue: "24" },
        { name: "tracks", label: "Number of Tracks", type: "select", options: [
          { label: "1 (mono)", value: "1" },
          { label: "2 (stereo)", value: "2" },
          { label: "3 (2 mics + room)", value: "3" },
          { label: "4 (multi-track)", value: "4" },
          { label: "6 (multi-track)", value: "6" },
          { label: "8 (full multi-track)", value: "8" },
        ], defaultValue: "2" },
      ],
      calculate: (inputs) => {
        const minutes = inputs.recordMinutes as number;
        const sampleRate = parseInt(inputs.sampleRate as string) || 48000;
        const bitDepth = parseInt(inputs.bitDepth as string) || 24;
        const tracks = parseInt(inputs.tracks as string) || 2;
        if (!minutes) return null;

        const totalSeconds = minutes * 60;
        const bytesPerSecondPerTrack = sampleRate * (bitDepth / 8);
        const totalBytes = bytesPerSecondPerTrack * tracks * totalSeconds;
        const totalMB = totalBytes / (1024 * 1024);
        const totalGB = totalMB / 1024;

        const exportedMP3 = (128 * totalSeconds) / 8 / 1024;

        return {
          primary: { label: "Raw Recording Size", value: totalGB >= 1 ? `${formatNumber(totalGB, 2)} GB` : `${formatNumber(totalMB, 0)} MB` },
          details: [
            { label: "Raw WAV size", value: `${formatNumber(totalMB, 0)} MB (${formatNumber(totalGB, 2)} GB)` },
            { label: "Duration", value: `${minutes} minutes` },
            { label: "Sample rate", value: `${formatNumber(sampleRate / 1000, 1)} kHz` },
            { label: "Bit depth", value: `${bitDepth}-bit` },
            { label: "Tracks", value: `${tracks}` },
            { label: "Per track", value: `${formatNumber(totalMB / tracks, 0)} MB` },
            { label: "Exported MP3 (128kbps)", value: `${formatNumber(exportedMP3, 1)} MB` },
            { label: "Compression ratio", value: `${formatNumber(totalMB / exportedMP3, 0)}:1` },
          ],
          note: "Always record in WAV/AIFF at 24-bit/48kHz minimum. Export to MP3/AAC for distribution. Keep raw files for re-editing.",
        };
      },
    },
  ],
  relatedSlugs: ["audio-file-size-calculator", "streaming-data-calculator", "video-file-size-calculator"],
  faq: [
    { question: "What bitrate should I use for my podcast?", answer: "For speech-only podcasts, 64 kbps mono or 128 kbps stereo MP3 is standard. Music podcasts should use 192-256 kbps. Apple Podcasts recommends 128 kbps stereo or 64 kbps mono." },
    { question: "How big is a 1-hour podcast episode?", answer: "At 128 kbps (standard): about 57 MB. At 64 kbps mono: about 29 MB. At 192 kbps: about 86 MB. Most episodes are 30-90 minutes, resulting in 25-100 MB files." },
    { question: "Should I record in mono or stereo?", answer: "Record in stereo for multiple speakers or music. Single-speaker shows can use mono to halve file size. Most listeners won't notice the difference for speech on earbuds." },
  ],
  formula: "File Size (MB) = Bitrate (kbps) × Duration (seconds) / 8 / 1024 | Raw WAV = Sample Rate × Bit Depth/8 × Channels × Duration",
};
