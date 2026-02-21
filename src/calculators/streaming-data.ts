import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const streamingDataCalculator: CalculatorDefinition = {
  slug: "streaming-data-calculator",
  title: "Streaming Data Usage Calculator",
  description: "Free streaming data calculator. Estimate data usage for Netflix, YouTube, Spotify, and other streaming services by quality and duration.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["streaming data calculator", "Netflix data usage", "YouTube data calculator", "streaming bandwidth", "data cap calculator"],
  variants: [
    {
      id: "video",
      name: "Video Streaming",
      description: "Calculate data usage for video streaming services",
      fields: [
        { name: "quality", label: "Streaming Quality", type: "select", options: [
          { label: "Low (480p) - 0.7 GB/hr", value: "0.7" },
          { label: "Medium (720p) - 1.5 GB/hr", value: "1.5" },
          { label: "HD (1080p) - 3 GB/hr", value: "3" },
          { label: "Full HD+ (1080p HDR) - 5 GB/hr", value: "5" },
          { label: "4K UHD - 7 GB/hr", value: "7" },
          { label: "4K HDR/Dolby Vision - 10 GB/hr", value: "10" },
        ], defaultValue: "3" },
        { name: "hoursPerDay", label: "Hours per Day", type: "number", placeholder: "e.g. 2", step: 0.5 },
        { name: "daysPerMonth", label: "Days per Month", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
      ],
      calculate: (inputs) => {
        const gbPerHour = parseFloat(inputs.quality as string) || 3;
        const hoursPerDay = inputs.hoursPerDay as number;
        const daysPerMonth = (inputs.daysPerMonth as number) || 30;
        if (!hoursPerDay) return null;

        const dailyGB = gbPerHour * hoursPerDay;
        const monthlyGB = dailyGB * daysPerMonth;
        const yearlyGB = monthlyGB * 12;

        return {
          primary: { label: "Monthly Data Usage", value: `${formatNumber(monthlyGB, 1)} GB` },
          details: [
            { label: "Per hour", value: `${gbPerHour} GB` },
            { label: "Per day", value: `${formatNumber(dailyGB, 1)} GB` },
            { label: "Per week", value: `${formatNumber(dailyGB * 7, 1)} GB` },
            { label: "Per month", value: `${formatNumber(monthlyGB, 1)} GB` },
            { label: "Per year", value: `${formatNumber(yearlyGB, 0)} GB (${formatNumber(yearlyGB / 1024, 1)} TB)` },
            { label: "Bandwidth needed", value: `${formatNumber(gbPerHour * 1024 / 3600 * 8, 1)} Mbps minimum` },
          ],
          note: "Data usage varies by service. Netflix, Disney+, and Amazon Prime have similar ranges. YouTube may use slightly more at comparable quality levels.",
        };
      },
    },
    {
      id: "music",
      name: "Music Streaming",
      description: "Calculate data for Spotify, Apple Music, etc.",
      fields: [
        { name: "quality", label: "Audio Quality", type: "select", options: [
          { label: "Low (24 kbps) - speech", value: "24" },
          { label: "Normal (96 kbps) - Spotify Free", value: "96" },
          { label: "High (160 kbps) - Spotify Normal", value: "160" },
          { label: "Very High (320 kbps) - Spotify Premium", value: "320" },
          { label: "Lossless (1411 kbps) - CD quality", value: "1411" },
          { label: "Hi-Res (4608 kbps) - 24-bit/96kHz", value: "4608" },
        ], defaultValue: "160" },
        { name: "hoursPerDay", label: "Hours per Day", type: "number", placeholder: "e.g. 3", step: 0.5 },
        { name: "daysPerMonth", label: "Days per Month", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
      ],
      calculate: (inputs) => {
        const bitrateKbps = parseInt(inputs.quality as string) || 160;
        const hoursPerDay = inputs.hoursPerDay as number;
        const days = (inputs.daysPerMonth as number) || 30;
        if (!hoursPerDay) return null;

        const mbPerHour = (bitrateKbps * 3600) / 8 / 1024;
        const dailyMB = mbPerHour * hoursPerDay;
        const monthlyMB = dailyMB * days;
        const monthlyGB = monthlyMB / 1024;

        return {
          primary: { label: "Monthly Data Usage", value: `${formatNumber(monthlyGB, 2)} GB` },
          details: [
            { label: "Per hour", value: `${formatNumber(mbPerHour, 1)} MB` },
            { label: "Per day", value: `${formatNumber(dailyMB, 0)} MB` },
            { label: "Per month", value: `${formatNumber(monthlyGB, 2)} GB` },
            { label: "Audio bitrate", value: `${bitrateKbps} kbps` },
            { label: "Songs per GB (~3.5 min avg)", value: `~${Math.round(1024 / (bitrateKbps * 210 / 8 / 1024))} songs` },
          ],
        };
      },
    },
    {
      id: "datacap",
      name: "Data Cap Budget",
      description: "How much streaming fits in your data plan",
      fields: [
        { name: "dataCap", label: "Monthly Data Cap (GB)", type: "select", options: [
          { label: "50 GB", value: "50" },
          { label: "100 GB", value: "100" },
          { label: "200 GB", value: "200" },
          { label: "500 GB", value: "500" },
          { label: "1 TB (1024 GB)", value: "1024" },
          { label: "1.2 TB (1229 GB)", value: "1229" },
          { label: "Unlimited", value: "99999" },
        ], defaultValue: "1024" },
        { name: "otherUsageGB", label: "Other Usage per Month (GB)", type: "number", placeholder: "e.g. 100", defaultValue: 100 },
        { name: "streamQuality", label: "Video Quality", type: "select", options: [
          { label: "SD 480p (0.7 GB/hr)", value: "0.7" },
          { label: "HD 720p (1.5 GB/hr)", value: "1.5" },
          { label: "Full HD 1080p (3 GB/hr)", value: "3" },
          { label: "4K UHD (7 GB/hr)", value: "7" },
        ], defaultValue: "3" },
      ],
      calculate: (inputs) => {
        const cap = parseInt(inputs.dataCap as string) || 1024;
        const other = (inputs.otherUsageGB as number) || 0;
        const gbPerHour = parseFloat(inputs.streamQuality as string) || 3;

        const available = cap - other;
        if (available <= 0) return { primary: { label: "Available for Streaming", value: "0 GB" }, details: [{ label: "Issue", value: "Other usage exceeds data cap" }] };

        const totalHours = available / gbPerHour;
        const hoursPerDay = totalHours / 30;

        return {
          primary: { label: "Streaming Budget", value: `${formatNumber(totalHours, 0)} hours/month` },
          details: [
            { label: "Available for streaming", value: `${formatNumber(available, 0)} GB` },
            { label: "Total streaming hours", value: `${formatNumber(totalHours, 1)} hours/month` },
            { label: "Hours per day", value: `${formatNumber(hoursPerDay, 1)} hours/day` },
            { label: "Data cap", value: cap >= 99999 ? "Unlimited" : `${cap} GB` },
            { label: "Other usage", value: `${other} GB` },
            { label: "Per hour usage", value: `${gbPerHour} GB/hr` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["video-file-size-calculator", "audio-file-size-calculator", "podcast-file-size-calculator"],
  faq: [
    { question: "How much data does Netflix use?", answer: "Netflix uses about 0.7 GB/hr for SD, 3 GB/hr for HD (1080p), and 7 GB/hr for 4K UHD. A 2-hour movie in HD uses about 6 GB. With 4K HDR, it can reach 10 GB/hr." },
    { question: "How much data does Spotify use?", answer: "Spotify uses about 43 MB/hr on Normal quality (96 kbps), 72 MB/hr on High (160 kbps), and 144 MB/hr on Very High (320 kbps). Downloaded music uses no data." },
    { question: "Will streaming use up my data cap?", answer: "At 1080p, watching 3 hours of Netflix daily uses about 270 GB/month. With a 1 TB data cap, that leaves plenty for other usage. 4K streaming at 3 hours/day uses about 630 GB/month." },
  ],
  formula: "Data (GB) = GB per hour × Hours per day × Days | Bandwidth (Mbps) = GB/hr × 1024 × 8 / 3600",
};
