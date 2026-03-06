import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const scubaTankDurationCalculator: CalculatorDefinition = {
  slug: "scuba-tank-duration-calculator",
  title: "Scuba Tank Duration Calculator",
  description: "Estimate how long your scuba tank will last based on tank size, working pressure, depth, and your surface air consumption rate.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["scuba tank duration","air consumption rate","dive time calculator","scuba air supply"],
  variants: [{
    id: "standard",
    name: "Scuba Tank Duration",
    description: "Estimate how long your scuba tank will last based on tank size, working pressure, depth, and your surface air consumption rate.",
    fields: [
      { name: "tankVolume", label: "Tank Volume (cubic feet)", type: "number", min: 19, max: 130, defaultValue: 80 },
      { name: "tankPressure", label: "Starting Pressure (PSI)", type: "number", min: 1000, max: 4500, defaultValue: 3000 },
      { name: "reservePressure", label: "Reserve Pressure (PSI)", type: "number", min: 300, max: 1000, defaultValue: 500 },
      { name: "depth", label: "Dive Depth (feet)", type: "number", min: 10, max: 200, defaultValue: 60 },
      { name: "sac", label: "Surface Air Consumption (cu ft/min)", type: "number", min: 0.3, max: 2.0, defaultValue: 0.75 },
    ],
    calculate: (inputs) => {
    const volume = inputs.tankVolume as number;
    const startPsi = inputs.tankPressure as number;
    const reservePsi = inputs.reservePressure as number;
    const depth = inputs.depth as number;
    const sac = inputs.sac as number;
    const ata = (depth / 33) + 1;
    const actualConsumption = sac * ata;
    const usablePsi = startPsi - reservePsi;
    const usableAir = volume * (usablePsi / startPsi);
    const diveTime = actualConsumption > 0 ? usableAir / actualConsumption : 0;
    return {
      primary: { label: "Estimated Dive Time", value: formatNumber(Math.round(diveTime)) + " minutes" },
      details: [
        { label: "Depth Pressure (ATA)", value: formatNumber(Math.round(ata * 100) / 100) },
        { label: "Air Consumption at Depth", value: formatNumber(Math.round(actualConsumption * 100) / 100) + " cu ft/min" },
        { label: "Usable Air Volume", value: formatNumber(Math.round(usableAir * 10) / 10) + " cu ft" },
        { label: "Reserve Air", value: formatNumber(Math.round(volume * (reservePsi / startPsi) * 10) / 10) + " cu ft" }
      ]
    };
  },
  }],
  relatedSlugs: ["dive-decompression-calculator","paddleboard-size-calculator"],
  faq: [
    { question: "What is SAC rate in scuba diving?", answer: "Surface Air Consumption (SAC) rate measures how much air you breathe per minute at the surface. Average SAC rates range from 0.5 to 1.0 cubic feet per minute. New divers tend to have higher SAC rates that improve with experience." },
    { question: "How deep can you go on a standard scuba tank?", answer: "Recreational scuba limits are typically 60 feet for beginners and 130 feet for advanced open water certified divers. Air supply decreases faster at greater depths because pressure increases air consumption." },
    { question: "Why does air last less time at greater depths?", answer: "At depth, water pressure compresses air so you breathe denser air with each breath. At 33 feet (2 ATA), you consume air twice as fast as at the surface. At 99 feet (4 ATA), four times as fast." },
  ],
  formula: "ATA (Atmospheres Absolute) = (Depth / 33) + 1
Air Consumption at Depth = SAC Rate x ATA
Usable Air = Tank Volume x (Usable PSI / Starting PSI)
Dive Time = Usable Air / Consumption at Depth",
};
