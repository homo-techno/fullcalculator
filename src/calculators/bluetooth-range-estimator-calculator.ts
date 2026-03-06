import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bluetoothRangeEstimatorCalculator: CalculatorDefinition = {
  slug: "bluetooth-range-estimator-calculator",
  title: "Bluetooth Range Estimator Calculator",
  description: "Estimate the effective Bluetooth range between devices based on Bluetooth version, transmit power, environment, and obstacles.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bluetooth range estimator","bluetooth distance calculator","bluetooth signal range","bt range","wireless range calculator"],
  variants: [{
    id: "standard",
    name: "Bluetooth Range Estimator",
    description: "Estimate the effective Bluetooth range between devices based on Bluetooth version, transmit power, environment, and obstacles.",
    fields: [
      { name: "btVersion", label: "Bluetooth Version", type: "select", options: [{ value: "1", label: "Bluetooth 4.0 / 4.2 (BLE)" }, { value: "2", label: "Bluetooth 5.0" }, { value: "3", label: "Bluetooth 5.1 / 5.2" }, { value: "4", label: "Bluetooth 5.3+" }], defaultValue: "2" },
      { name: "powerClass", label: "Power Class", type: "select", options: [{ value: "1", label: "Class 1 (100m max)" }, { value: "2", label: "Class 2 (10m max)" }, { value: "3", label: "Class 3 (1m max)" }], defaultValue: "2" },
      { name: "environment", label: "Environment", type: "select", options: [{ value: "1", label: "Open Outdoor" }, { value: "2", label: "Indoor (few walls)" }, { value: "3", label: "Indoor (many walls)" }, { value: "4", label: "Crowded/Urban" }], defaultValue: "2" },
      { name: "obstacles", label: "Number of Walls/Obstacles", type: "number", min: 0, max: 10, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const version = parseInt(inputs.btVersion as string);
    const powerClass = parseInt(inputs.powerClass as string);
    const env = parseInt(inputs.environment as string);
    const obstacles = inputs.obstacles as number;
    const maxRange = { 1: 100, 2: 10, 3: 1 };
    const versionMultiplier = { 1: 1.0, 2: 4.0, 3: 4.0, 4: 4.0 };
    const envFactor = { 1: 1.0, 2: 0.5, 3: 0.25, 4: 0.3 };
    const baseRange = (maxRange[powerClass] || 10) * (versionMultiplier[version] || 1.0);
    const effectiveRange = Math.round(baseRange * (envFactor[env] || 0.5) * Math.pow(0.7, obstacles));
    const signalQuality = effectiveRange > 20 ? "Strong" : effectiveRange > 8 ? "Good" : effectiveRange > 3 ? "Fair" : "Weak";
    const dataRate = version >= 2 ? "2 Mbps" : "1 Mbps";
    return {
      primary: { label: "Effective Range", value: formatNumber(effectiveRange) + " meters" },
      details: [
        { label: "Max Theoretical Range", value: formatNumber(Math.round(baseRange)) + " meters" },
        { label: "Signal Quality", value: signalQuality },
        { label: "Max Data Rate", value: dataRate },
        { label: "Range in Feet", value: formatNumber(Math.round(effectiveRange * 3.281)) + " feet" }
      ]
    };
  },
  }],
  relatedSlugs: ["wireless-router-range-calculator","wireless-charger-efficiency-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Effective Range = Max Range x Version Multiplier x Environment Factor x 0.7^Obstacles; Max Range: Class 1 = 100m, Class 2 = 10m, Class 3 = 1m; BT 5.0+ multiplies range by 4x",
};
