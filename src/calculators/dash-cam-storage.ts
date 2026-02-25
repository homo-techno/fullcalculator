import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dashCamStorageCalculator: CalculatorDefinition = {
  slug: "dash-cam-storage-calculator",
  title: "Dash Cam Storage Calculator",
  description: "Free dash cam storage calculator. Estimate how much memory card storage you need and how long your dash cam can record before overwriting.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dash cam storage", "dash cam SD card size", "dash cam recording time", "dash cam memory card", "dashcam storage calculator"],
  variants: [
    {
      id: "recording",
      name: "Recording Time",
      description: "Calculate how long a memory card will record",
      fields: [
        { name: "cardSize", label: "Memory Card Size", type: "select", options: [
          { label: "32 GB", value: "32" },
          { label: "64 GB", value: "64" },
          { label: "128 GB", value: "128" },
          { label: "256 GB", value: "256" },
          { label: "512 GB", value: "512" },
        ], defaultValue: "128" },
        { name: "resolution", label: "Recording Resolution", type: "select", options: [
          { label: "1080p (Full HD)", value: "1080" },
          { label: "1440p (2K)", value: "1440" },
          { label: "2160p (4K)", value: "2160" },
        ], defaultValue: "1080" },
        { name: "channels", label: "Camera Channels", type: "select", options: [
          { label: "Front only (1 channel)", value: "1" },
          { label: "Front + Rear (2 channel)", value: "2" },
          { label: "Front + Rear + Interior (3 channel)", value: "3" },
        ], defaultValue: "1" },
        { name: "bitrate", label: "Video Bitrate", type: "select", options: [
          { label: "Low (~10 Mbps)", value: "10" },
          { label: "Medium (~20 Mbps)", value: "20" },
          { label: "High (~30 Mbps)", value: "30" },
          { label: "Very High (~50 Mbps)", value: "50" },
        ], defaultValue: "20" },
      ],
      calculate: (inputs) => {
        const cardGB = parseInt(inputs.cardSize as string) || 128;
        const channels = parseInt(inputs.channels as string) || 1;
        const bitrateMbps = parseInt(inputs.bitrate as string) || 20;

        const totalBitrate = bitrateMbps * channels;
        const bytesPerSecond = (totalBitrate * 1000000) / 8;
        const gbPerHour = (bytesPerSecond * 3600) / (1024 * 1024 * 1024);
        const usableGB = cardGB * 0.93;
        const recordingHours = usableGB / gbPerHour;
        const recordingDays = recordingHours / 24;

        const avgDrivingHours = 2;
        const drivingDays = recordingHours / avgDrivingHours;

        return {
          primary: { label: "Recording Time", value: `${formatNumber(recordingHours, 1)} hours` },
          details: [
            { label: "Continuous recording", value: `${formatNumber(recordingDays, 1)} days` },
            { label: "Driving days (~2 hr/day)", value: `${formatNumber(drivingDays, 0)} days` },
            { label: "Storage per hour", value: `${formatNumber(gbPerHour, 1)} GB/hr` },
            { label: "Usable storage", value: `${formatNumber(usableGB, 0)} GB` },
            { label: "Total data rate", value: `${totalBitrate} Mbps` },
          ],
        };
      },
    },
    {
      id: "cardsize",
      name: "Recommended Card Size",
      description: "Find the right memory card size for your needs",
      fields: [
        { name: "dailyDriving", label: "Daily Driving Hours", type: "number", placeholder: "e.g. 2", suffix: "hours" },
        { name: "daysToKeep", label: "Days of Footage to Keep", type: "number", placeholder: "e.g. 7", suffix: "days" },
        { name: "resolution", label: "Recording Resolution", type: "select", options: [
          { label: "1080p", value: "1080" },
          { label: "1440p (2K)", value: "1440" },
          { label: "2160p (4K)", value: "2160" },
        ], defaultValue: "1080" },
        { name: "channels", label: "Camera Channels", type: "select", options: [
          { label: "1 channel", value: "1" },
          { label: "2 channels", value: "2" },
          { label: "3 channels", value: "3" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const daily = inputs.dailyDriving as number;
        const daysKeep = inputs.daysToKeep as number;
        const resolution = parseInt(inputs.resolution as string) || 1080;
        const channels = parseInt(inputs.channels as string) || 1;
        if (!daily || !daysKeep) return null;

        let baseBitrate = 15;
        if (resolution === 1440) baseBitrate = 25;
        else if (resolution === 2160) baseBitrate = 45;

        const totalBitrate = baseBitrate * channels;
        const gbPerHour = (totalBitrate * 1000000 / 8 * 3600) / (1024 * 1024 * 1024);
        const totalHours = daily * daysKeep;
        const requiredGB = (gbPerHour * totalHours) / 0.93;

        const cardSizes = [32, 64, 128, 256, 512, 1024];
        const recommendedSize = cardSizes.find(s => s >= requiredGB) || 1024;

        return {
          primary: { label: "Recommended Card Size", value: `${recommendedSize} GB` },
          details: [
            { label: "Storage needed", value: `${formatNumber(requiredGB, 0)} GB` },
            { label: "Total recording hours", value: `${formatNumber(totalHours, 0)} hours` },
            { label: "Data per hour", value: `${formatNumber(gbPerHour, 1)} GB/hr` },
            { label: "Days of footage", value: `${daysKeep} days` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-total-cost-calculator", "car-maintenance-cost-calculator"],
  faq: [
    { question: "What size SD card do I need for a dash cam?", answer: "For a 1080p single-channel dash cam, a 64-128 GB card provides 8-20 hours of recording. For 4K or dual-channel setups, 128-256 GB is recommended. Most dash cams loop-record, overwriting the oldest footage automatically." },
    { question: "How long does a 128GB card last in a dash cam?", answer: "At 1080p with a single camera, approximately 12-20 hours. At 4K or with dual cameras, approximately 4-8 hours. The exact time depends on video bitrate, compression, and whether audio is recorded." },
  ],
  formula: "Recording Hours = (Card Size × 0.93) / ((Bitrate Mbps × Channels × 3600) / 8 / 1,073,741,824)",
};
