import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const phoneBatteryHealthCalculator: CalculatorDefinition = {
  slug: "phone-battery-health-calculator",
  title: "Phone Battery Health Calculator",
  description: "Estimate your phone battery degradation and remaining capacity based on charge cycles, age, and usage patterns.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["phone battery health","battery degradation calculator","battery cycle count","phone battery capacity","battery lifespan"],
  variants: [{
    id: "standard",
    name: "Phone Battery Health",
    description: "Estimate your phone battery degradation and remaining capacity based on charge cycles, age, and usage patterns.",
    fields: [
      { name: "originalCapacity", label: "Original Battery Capacity (mAh)", type: "number", min: 1000, max: 10000, defaultValue: 4500 },
      { name: "phoneAge", label: "Phone Age (Months)", type: "number", min: 1, max: 72, defaultValue: 24 },
      { name: "chargesPerDay", label: "Charges Per Day (Avg)", type: "number", min: 0.3, max: 3, defaultValue: 1 },
      { name: "chargingHabit", label: "Typical Charging Range", type: "select", options: [{ value: "1", label: "0-100% (Full cycles)" }, { value: "2", label: "20-80% (Optimal)" }, { value: "3", label: "10-90% (Moderate)" }, { value: "4", label: "0-100% with fast charge" }], defaultValue: "1" },
      { name: "fastCharging", label: "Uses Fast Charging", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const original = inputs.originalCapacity as number;
    const ageMonths = inputs.phoneAge as number;
    const chargesDay = inputs.chargesPerDay as number;
    const habit = parseInt(inputs.chargingHabit as string);
    const fastCharge = parseInt(inputs.fastCharging as string);
    const totalCycles = Math.round(chargesDay * ageMonths * 30.44);
    const habitWear = { 1: 1.0, 2: 0.5, 3: 0.7, 4: 1.3 };
    const fastChargeWear = fastCharge === 1 ? 1.15 : 1.0;
    const effectiveCycles = totalCycles * (habitWear[habit] || 1.0) * fastChargeWear;
    const degradation = Math.min(effectiveCycles * 0.04, 50);
    const healthPercent = Math.round(100 - degradation);
    const currentCapacity = Math.round(original * healthPercent / 100);
    const cyclesTo80 = Math.round(800 / ((habitWear[habit] || 1.0) * fastChargeWear));
    const monthsTo80 = Math.round(cyclesTo80 / (chargesDay * 30.44));
    return {
      primary: { label: "Estimated Battery Health", value: formatNumber(healthPercent) + "%" },
      details: [
        { label: "Current Capacity", value: formatNumber(currentCapacity) + " mAh" },
        { label: "Capacity Lost", value: formatNumber(original - currentCapacity) + " mAh" },
        { label: "Estimated Charge Cycles", value: formatNumber(totalCycles) },
        { label: "Months Until 80% Health", value: monthsTo80 > ageMonths ? formatNumber(monthsTo80 - ageMonths) + " months remaining" : "Already below 80%" }
      ]
    };
  },
  }],
  relatedSlugs: ["e-reader-battery-calculator","wireless-charger-efficiency-calculator","smartphone-screen-repair-cost-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Health % = 100 - (Effective Cycles x 0.04); Effective Cycles = Total Cycles x Habit Wear x Fast Charge Wear; Total Cycles = Charges/Day x Age (months) x 30.44",
};
