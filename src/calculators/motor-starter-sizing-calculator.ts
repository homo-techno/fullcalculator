import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const motorStarterSizingCalculator: CalculatorDefinition = {
  slug: "motor-starter-sizing-calculator",
  title: "Motor Starter Sizing Calculator",
  description: "Determine the correct motor starter, overload relay, and wire size for electric motors based on horsepower, voltage, and starting method per NEC requirements.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["motor starter sizing","motor overload calculator","motor circuit sizing","NEC motor starter"],
  variants: [{
    id: "standard",
    name: "Motor Starter Sizing",
    description: "Determine the correct motor starter, overload relay, and wire size for electric motors based on horsepower, voltage, and starting method per NEC requirements.",
    fields: [
      { name: "motorHP", label: "Motor Horsepower", type: "select", options: [{ value: "0.5", label: "1/2 HP" }, { value: "1", label: "1 HP" }, { value: "2", label: "2 HP" }, { value: "3", label: "3 HP" }, { value: "5", label: "5 HP" }, { value: "7.5", label: "7.5 HP" }, { value: "10", label: "10 HP" }, { value: "15", label: "15 HP" }], defaultValue: "5" },
      { name: "voltage", label: "Voltage", type: "select", options: [{ value: "120", label: "120V 1-Phase" }, { value: "208", label: "208V 3-Phase" }, { value: "240", label: "240V 3-Phase" }, { value: "480", label: "480V 3-Phase" }], defaultValue: "208" },
      { name: "startType", label: "Starting Method", type: "select", options: [{ value: "1", label: "Direct On Line (DOL)" }, { value: "2", label: "Soft Starter" }, { value: "3", label: "VFD" }], defaultValue: "1" },
      { name: "serviceFactor", label: "Service Factor", type: "number", min: 1.0, max: 1.5, defaultValue: 1.15 },
    ],
    calculate: (inputs) => {
    const hp = parseFloat(inputs.motorHP as string);
    const voltage = parseFloat(inputs.voltage as string);
    const startType = parseInt(inputs.startType as string);
    const sf = inputs.serviceFactor as number;
    const phase = voltage >= 208 ? 3 : 1;
    const efficiency = 0.88;
    const fla = phase === 3 ? (hp * 746) / (voltage * 1.732 * efficiency * 0.85) : (hp * 746) / (voltage * efficiency * 0.85);
    const olRelay = fla * sf * 1.15;
    const breakerMultiplier = startType === 1 ? 2.5 : startType === 2 ? 1.75 : 1.5;
    const breakerSize = fla * breakerMultiplier;
    const stdBreakers = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200];
    let breaker = 15;
    for (let i = 0; i < stdBreakers.length; i++) {
      if (stdBreakers[i] >= breakerSize) { breaker = stdBreakers[i]; break; }
      if (i === stdBreakers.length - 1) breaker = stdBreakers[i];
    }
    const wireSize = fla <= 15 ? "14 AWG" : fla <= 20 ? "12 AWG" : fla <= 30 ? "10 AWG" : fla <= 40 ? "8 AWG" : fla <= 55 ? "6 AWG" : fla <= 70 ? "4 AWG" : "2 AWG";
    const startTypeName = { 1: "DOL", 2: "Soft Starter", 3: "VFD" };
    return {
      primary: { label: "Motor FLA", value: formatNumber(Math.round(fla * 10) / 10) + " A" },
      details: [
        { label: "Overload Relay Setting", value: formatNumber(Math.round(olRelay * 10) / 10) + " A" },
        { label: "Branch Circuit Breaker", value: formatNumber(breaker) + " A" },
        { label: "Minimum Wire Size", value: wireSize },
        { label: "Start Method", value: startTypeName[startType] || "DOL" }
      ]
    };
  },
  }],
  relatedSlugs: ["transformer-sizing-calculator","power-factor-correction-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "FLA (3-phase) = (HP x 746) / (Voltage x 1.732 x Efficiency x PF); Overload Setting = FLA x Service Factor x 1.15; Breaker Size = FLA x Start Type Multiplier; DOL = 2.5x, Soft Start = 1.75x, VFD = 1.5x",
};
