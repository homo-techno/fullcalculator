import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const horsepowerToTorqueCalculator: CalculatorDefinition = {
  slug: "horsepower-to-torque",
  title: "Horsepower to Torque Converter",
  description:
    "Convert between horsepower and torque at a given RPM. Essential for automotive engineering, motor selection, and performance analysis.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "horsepower",
    "torque",
    "HP",
    "ft-lb",
    "Nm",
    "RPM",
    "engine",
    "motor",
    "automotive",
    "power",
  ],
  variants: [
    {
      slug: "hp-to-torque",
      title: "Horsepower to Torque",
      fields: [
        {
          name: "horsepower",
          label: "Horsepower (HP)",
          type: "number",
        },
        {
          name: "rpm",
          label: "Engine Speed (RPM)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const hp = parseFloat(inputs.horsepower as string);
        const rpm = parseFloat(inputs.rpm as string);
        if (isNaN(hp) || isNaN(rpm)) return { error: "Please enter valid horsepower and RPM." };
        if (rpm <= 0) return { error: "RPM must be greater than zero." };

        const torqueFtLb = (hp * 5252) / rpm;
        const torqueNm = torqueFtLb * 1.35582;
        const torqueKgfm = torqueNm / 9.80665;
        const kw = hp * 0.7457;

        return {
          results: [
            { label: "Torque (ft-lb)", value: formatNumber(torqueFtLb) },
            { label: "Torque (Nm)", value: formatNumber(torqueNm) },
            { label: "Torque (kgf-m)", value: formatNumber(torqueKgfm) },
            { label: "Power (kW)", value: formatNumber(kw) },
          ],
        };
      },
    },
    {
      slug: "torque-to-hp",
      title: "Torque to Horsepower",
      fields: [
        {
          name: "torque",
          label: "Torque (ft-lb)",
          type: "number",
        },
        {
          name: "rpm",
          label: "Engine Speed (RPM)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const torque = parseFloat(inputs.torque as string);
        const rpm = parseFloat(inputs.rpm as string);
        if (isNaN(torque) || isNaN(rpm)) return { error: "Please enter valid torque and RPM." };
        if (rpm <= 0) return { error: "RPM must be greater than zero." };

        const hp = (torque * rpm) / 5252;
        const kw = hp * 0.7457;
        const torqueNm = torque * 1.35582;

        return {
          results: [
            { label: "Horsepower (HP)", value: formatNumber(hp) },
            { label: "Power (kW)", value: formatNumber(kw) },
            { label: "Torque (Nm)", value: formatNumber(torqueNm) },
            { label: "Torque (ft-lb, input)", value: formatNumber(torque) },
          ],
        };
      },
    },
    {
      slug: "find-rpm",
      title: "Find RPM from HP and Torque",
      fields: [
        {
          name: "horsepower",
          label: "Horsepower (HP)",
          type: "number",
        },
        {
          name: "torque",
          label: "Torque (ft-lb)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const hp = parseFloat(inputs.horsepower as string);
        const torque = parseFloat(inputs.torque as string);
        if (isNaN(hp) || isNaN(torque)) return { error: "Please enter valid HP and torque." };
        if (torque <= 0) return { error: "Torque must be greater than zero." };

        const rpm = (hp * 5252) / torque;
        const kw = hp * 0.7457;
        const torqueNm = torque * 1.35582;

        return {
          results: [
            { label: "Engine Speed (RPM)", value: formatNumber(rpm) },
            { label: "Horsepower (HP)", value: formatNumber(hp) },
            { label: "Torque (Nm)", value: formatNumber(torqueNm) },
            { label: "Power (kW)", value: formatNumber(kw) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["btu-to-kw", "newtons-to-pounds", "gallons-per-minute"],
  faq: [
    {
      question: "What is the relationship between horsepower, torque, and RPM?",
      answer:
        "HP = (Torque in ft-lb x RPM) / 5252. The constant 5252 comes from converting between the units: it equals 33,000 ft-lb/min (1 HP) divided by 2pi. Horsepower and torque curves always cross at 5,252 RPM.",
    },
    {
      question: "Why does torque decrease as RPM increases for the same horsepower?",
      answer:
        "Since HP = (Torque x RPM) / 5252, for a fixed horsepower, torque is inversely proportional to RPM. Higher RPM means each revolution does less work but more revolutions happen per unit time, keeping power constant.",
    },
  ],
  formula:
    "Torque (ft-lb) = (HP x 5252) / RPM | HP = (Torque x RPM) / 5252 | 1 ft-lb = 1.35582 Nm | 1 HP = 0.7457 kW",
};
