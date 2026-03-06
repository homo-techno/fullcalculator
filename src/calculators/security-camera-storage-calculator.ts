import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const securityCameraStorageCalculator: CalculatorDefinition = {
  slug: "security-camera-storage-calculator",
  title: "Security Camera Storage Calculator",
  description: "Calculate the storage space required for security camera footage based on number of cameras, resolution, frame rate, and retention period.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["security camera storage","cctv storage calculator","surveillance storage","ip camera hard drive","nvr storage calculator"],
  variants: [{
    id: "standard",
    name: "Security Camera Storage",
    description: "Calculate the storage space required for security camera footage based on number of cameras, resolution, frame rate, and retention period.",
    fields: [
      { name: "numCameras", label: "Number of Cameras", type: "number", min: 1, max: 64, defaultValue: 4 },
      { name: "resolution", label: "Camera Resolution", type: "select", options: [{ value: "0.75", label: "1080p (2 MP)" }, { value: "1.5", label: "2K (4 MP)" }, { value: "3", label: "4K (8 MP)" }, { value: "0.3", label: "720p (1 MP)" }], defaultValue: "0.75" },
      { name: "fps", label: "Frame Rate (FPS)", type: "number", min: 1, max: 30, defaultValue: 15 },
      { name: "recordHours", label: "Recording Hours Per Day", type: "number", min: 1, max: 24, defaultValue: 24 },
      { name: "retentionDays", label: "Retention Period (Days)", type: "number", min: 1, max: 365, defaultValue: 30 },
      { name: "compression", label: "Compression", type: "select", options: [{ value: "1", label: "H.264 (Standard)" }, { value: "0.5", label: "H.265 (Efficient)" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const cameras = inputs.numCameras as number;
    const mbPerHour = parseFloat(inputs.resolution as string);
    const fps = inputs.fps as number;
    const hours = inputs.recordHours as number;
    const days = inputs.retentionDays as number;
    const compressionFactor = parseFloat(inputs.compression as string);
    const gbPerCamPerHour = mbPerHour * (fps / 15) * compressionFactor;
    const dailyPerCam = gbPerCamPerHour * hours;
    const dailyTotal = dailyPerCam * cameras;
    const totalStorage = dailyTotal * days;
    const totalTB = totalStorage / 1000;
    const recommendedDrives = Math.ceil(totalTB / 4);
    return {
      primary: { label: "Total Storage Needed", value: formatNumber(Math.round(totalStorage)) + " GB" },
      details: [
        { label: "Storage in TB", value: formatNumber(Math.round(totalTB * 100) / 100) + " TB" },
        { label: "Daily Usage (All Cameras)", value: formatNumber(Math.round(dailyTotal * 10) / 10) + " GB/day" },
        { label: "Per Camera Per Day", value: formatNumber(Math.round(dailyPerCam * 10) / 10) + " GB" },
        { label: "Recommended 4TB Drives", value: formatNumber(recommendedDrives) }
      ]
    };
  },
  }],
  relatedSlugs: ["nas-drive-cost-calculator","wireless-router-range-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Daily Storage = GB/hour x (FPS/15) x Compression Factor x Hours x Cameras; Total Storage = Daily Storage x Retention Days; GB/hour based on resolution: 1080p = 0.75 GB, 4K = 3 GB",
};
