import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const motorTorqueCalculator: CalculatorDefinition = {
  slug: "motor-torque-calculator",
  title: "Electric Motor Torque Calculator",
  description:
    "Free electric motor torque calculator. Calculate torque, speed, and power for electric motors. Convert between HP, kW, RPM, and Nm.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "motor torque",
    "electric motor calculator",
    "torque calculator",
    "motor power",
    "rpm to torque",
    "motor sizing",
  ],
  variants: [
    {
      id: "power-to-torque",
      name: "Power & Speed to Torque",
      description: "T = P × 9550 / n (kW to Nm)",
      fields: [
        {
          name: "power",
          label: "Motor Power",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "powerUnit",
          label: "Power Unit",
          type: "select",
          options: [
            { label: "kW (Kilowatts)", value: "kW" },
            { label: "HP (Horsepower)", value: "HP" },
            { label: "W (Watts)", value: "W" },
          ],
          defaultValue: "kW",
        },
        {
          name: "speed",
          label: "Motor Speed (RPM)",
          type: "number",
          placeholder: "e.g. 1750",
        },
      ],
      calculate: (inputs) => {
        const power = inputs.power as number;
        const unit = inputs.powerUnit as string;
        const rpm = inputs.speed as number;
        if (!power || !rpm) return null;

        let powerKw = power;
        if (unit === "HP") powerKw = power * 0.7457;
        else if (unit === "W") powerKw = power / 1000;

        const powerW = powerKw * 1000;
        const torqueNm = (powerKw * 1000) / (2 * Math.PI * rpm / 60);
        const torqueLbFt = torqueNm * 0.7376;
        const torqueKgCm = torqueNm * 10.197;
        const angularVelocity = 2 * Math.PI * rpm / 60;

        return {
          primary: {
            label: "Torque",
            value: `${formatNumber(torqueNm, 4)} Nm`,
          },
          details: [
            { label: "Torque (Nm)", value: `${formatNumber(torqueNm, 4)} Nm` },
            { label: "Torque (lb-ft)", value: `${formatNumber(torqueLbFt, 4)} lb-ft` },
            { label: "Torque (kg-cm)", value: `${formatNumber(torqueKgCm, 4)} kg-cm` },
            { label: "Power (kW)", value: `${formatNumber(powerKw, 4)} kW` },
            { label: "Power (HP)", value: `${formatNumber(powerKw / 0.7457, 4)} HP` },
            { label: "Angular Velocity (ω)", value: `${formatNumber(angularVelocity, 4)} rad/s` },
          ],
        };
      },
    },
    {
      id: "torque-to-power",
      name: "Torque & Speed to Power",
      description: "P = T × 2π × n / 60",
      fields: [
        {
          name: "torque",
          label: "Torque",
          type: "number",
          placeholder: "e.g. 27.3",
        },
        {
          name: "torqueUnit",
          label: "Torque Unit",
          type: "select",
          options: [
            { label: "Nm (Newton-meters)", value: "Nm" },
            { label: "lb-ft (Pound-feet)", value: "lbft" },
            { label: "kg-cm", value: "kgcm" },
          ],
          defaultValue: "Nm",
        },
        {
          name: "speed",
          label: "Motor Speed (RPM)",
          type: "number",
          placeholder: "e.g. 1750",
        },
      ],
      calculate: (inputs) => {
        const torque = inputs.torque as number;
        const unit = inputs.torqueUnit as string;
        const rpm = inputs.speed as number;
        if (!torque || !rpm) return null;

        let torqueNm = torque;
        if (unit === "lbft") torqueNm = torque * 1.3558;
        else if (unit === "kgcm") torqueNm = torque * 0.09807;

        const powerW = torqueNm * 2 * Math.PI * rpm / 60;
        const powerKw = powerW / 1000;
        const powerHp = powerKw / 0.7457;

        return {
          primary: {
            label: "Power",
            value: `${formatNumber(powerKw, 4)} kW`,
          },
          details: [
            { label: "Power (W)", value: `${formatNumber(powerW, 4)} W` },
            { label: "Power (kW)", value: `${formatNumber(powerKw, 4)} kW` },
            { label: "Power (HP)", value: `${formatNumber(powerHp, 4)} HP` },
            { label: "Torque (Nm)", value: `${formatNumber(torqueNm, 4)} Nm` },
            { label: "Speed", value: `${rpm} RPM` },
          ],
        };
      },
    },
    {
      id: "motor-current",
      name: "Motor Full Load Current",
      description: "Estimate full load current for single and three-phase motors",
      fields: [
        {
          name: "power",
          label: "Motor Power (HP)",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "voltage",
          label: "Voltage (V)",
          type: "number",
          placeholder: "e.g. 230",
        },
        {
          name: "phase",
          label: "Phase",
          type: "select",
          options: [
            { label: "Single Phase", value: "1" },
            { label: "Three Phase", value: "3" },
          ],
          defaultValue: "3",
        },
        {
          name: "efficiency",
          label: "Efficiency (%)",
          type: "number",
          placeholder: "e.g. 85",
          defaultValue: 85,
        },
        {
          name: "powerFactor",
          label: "Power Factor",
          type: "number",
          placeholder: "e.g. 0.85",
          defaultValue: 0.85,
        },
      ],
      calculate: (inputs) => {
        const hp = inputs.power as number;
        const voltage = inputs.voltage as number;
        const phase = Number(inputs.phase);
        const eff = inputs.efficiency as number;
        const pf = inputs.powerFactor as number;
        if (!hp || !voltage || !eff || !pf) return null;

        const powerW = hp * 746;
        const inputPower = powerW / (eff / 100);

        let current: number;
        if (phase === 1) {
          current = inputPower / (voltage * pf);
        } else {
          current = inputPower / (Math.sqrt(3) * voltage * pf);
        }

        return {
          primary: {
            label: "Full Load Current",
            value: `${formatNumber(current, 2)} A`,
          },
          details: [
            { label: "Full Load Current", value: `${formatNumber(current, 4)} A` },
            { label: "Output Power", value: `${formatNumber(powerW, 2)} W (${formatNumber(powerW / 1000, 2)} kW)` },
            { label: "Input Power", value: `${formatNumber(inputPower, 2)} W` },
            { label: "Apparent Power", value: `${formatNumber(inputPower / pf, 2)} VA` },
            { label: "Phase", value: phase === 1 ? "Single Phase" : "Three Phase" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ohms-law-calculator", "electrical-power-calculator", "three-phase-power-calculator"],
  faq: [
    {
      question: "How do you calculate motor torque from horsepower?",
      answer:
        "Torque (Nm) = (HP × 746) / (2π × RPM/60), or simplified: Torque (lb-ft) = HP × 5252 / RPM. For example, a 5 HP motor at 1750 RPM produces about 15 lb-ft (20.3 Nm) of torque.",
    },
    {
      question: "What is the relationship between torque, power, and speed?",
      answer:
        "Power = Torque × Angular Velocity. In practical units: P(kW) = T(Nm) × n(RPM) / 9550, or P(HP) = T(lb-ft) × n(RPM) / 5252. Doubling the speed at the same torque doubles the power.",
    },
    {
      question: "How do I estimate motor full load current?",
      answer:
        "For single-phase: I = P / (V × PF × η). For three-phase: I = P / (√3 × V × PF × η). Where P is input power in watts, V is voltage, PF is power factor, and η is efficiency. Typical motor efficiency is 80-95% and power factor is 0.8-0.9.",
    },
  ],
  formula:
    "T = P / ω = P × 9550 / RPM | P = T × ω = T × RPM / 9550 | 1 HP = 746 W | ω = 2π × RPM / 60",
};
