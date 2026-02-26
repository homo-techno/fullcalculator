import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const engineHpCalculator: CalculatorDefinition = {
  slug: "engine-hp-calculator",
  title: "Engine Horsepower Calculator",
  description:
    "Free online engine horsepower calculator. Estimate HP from displacement, RPM, and torque. Convert between HP, kW, and PS.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "horsepower calculator",
    "engine hp calculator",
    "torque to hp",
    "hp from displacement",
    "engine power calculator",
  ],
  variants: [
    {
      id: "from-torque",
      name: "HP from Torque & RPM",
      description: "Calculate horsepower from torque and engine RPM",
      fields: [
        { name: "torque", label: "Torque", type: "number", placeholder: "e.g. 350", suffix: "lb-ft" },
        { name: "rpm", label: "Engine RPM", type: "number", placeholder: "e.g. 5500" },
      ],
      calculate: (inputs) => {
        const torque = parseFloat(inputs.torque as string) || 0;
        const rpm = parseFloat(inputs.rpm as string) || 0;
        if (!torque || !rpm) return null;

        const hp = (torque * rpm) / 5252;
        const kw = hp * 0.7457;
        const ps = hp * 1.01387;

        return {
          primary: { label: "Horsepower", value: `${formatNumber(hp)} HP` },
          details: [
            { label: "Kilowatts", value: `${formatNumber(kw)} kW` },
            { label: "Metric HP (PS)", value: `${formatNumber(ps)} PS` },
            { label: "Torque input", value: `${formatNumber(torque)} lb-ft` },
            { label: "RPM input", value: formatNumber(rpm) },
          ],
        };
      },
    },
    {
      id: "from-displacement",
      name: "HP from Displacement (estimate)",
      description: "Estimate horsepower from engine displacement",
      fields: [
        { name: "displacement", label: "Engine Displacement", type: "number", placeholder: "e.g. 5.0", suffix: "L" },
        {
          name: "engineType",
          label: "Engine Type",
          type: "select",
          options: [
            { label: "Naturally Aspirated", value: "na" },
            { label: "Turbocharged", value: "turbo" },
            { label: "Supercharged", value: "super" },
          ],
          defaultValue: "na",
        },
      ],
      calculate: (inputs) => {
        const displacement = parseFloat(inputs.displacement as string) || 0;
        const engineType = inputs.engineType as string;
        if (!displacement) return null;

        // Rough estimates: NA ~70-100 HP/L, turbo ~100-150 HP/L, supercharged ~90-130 HP/L
        let hpPerLiterLow: number;
        let hpPerLiterHigh: number;
        if (engineType === "turbo") {
          hpPerLiterLow = 100;
          hpPerLiterHigh = 150;
        } else if (engineType === "super") {
          hpPerLiterLow = 90;
          hpPerLiterHigh = 130;
        } else {
          hpPerLiterLow = 70;
          hpPerLiterHigh = 100;
        }

        const hpLow = displacement * hpPerLiterLow;
        const hpHigh = displacement * hpPerLiterHigh;
        const hpMid = (hpLow + hpHigh) / 2;

        return {
          primary: { label: "Estimated HP Range", value: `${formatNumber(hpLow)} - ${formatNumber(hpHigh)} HP` },
          details: [
            { label: "Midpoint estimate", value: `${formatNumber(hpMid)} HP` },
            { label: "Displacement", value: `${formatNumber(displacement)} L` },
            { label: "HP per liter (low)", value: formatNumber(hpPerLiterLow) },
            { label: "HP per liter (high)", value: formatNumber(hpPerLiterHigh) },
          ],
          note: "This is a rough estimate. Actual HP depends on engine design, tuning, and many other factors.",
        };
      },
    },
    {
      id: "convert",
      name: "Power Unit Converter",
      description: "Convert between HP, kW, and PS",
      fields: [
        { name: "value", label: "Power Value", type: "number", placeholder: "e.g. 300" },
        {
          name: "unit",
          label: "Input Unit",
          type: "select",
          options: [
            { label: "Horsepower (HP)", value: "hp" },
            { label: "Kilowatts (kW)", value: "kw" },
            { label: "Metric HP (PS)", value: "ps" },
          ],
          defaultValue: "hp",
        },
      ],
      calculate: (inputs) => {
        const value = parseFloat(inputs.value as string) || 0;
        const unit = inputs.unit as string;
        if (!value) return null;

        let hp: number;
        if (unit === "kw") hp = value / 0.7457;
        else if (unit === "ps") hp = value / 1.01387;
        else hp = value;

        const kw = hp * 0.7457;
        const ps = hp * 1.01387;

        return {
          primary: { label: "Horsepower", value: `${formatNumber(hp)} HP` },
          details: [
            { label: "Kilowatts", value: `${formatNumber(kw)} kW` },
            { label: "Metric HP (PS)", value: `${formatNumber(ps)} PS` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["0-60-calculator", "speed-calculator"],
  faq: [
    {
      question: "How is horsepower calculated from torque?",
      answer:
        "HP = (Torque x RPM) / 5252. At 5,252 RPM, horsepower and torque (in lb-ft) are always equal. Below that RPM, torque is higher; above it, HP is higher.",
    },
    {
      question: "What is the difference between HP, kW, and PS?",
      answer:
        "HP (mechanical horsepower) is used in the US and UK. kW (kilowatts) is the SI unit used internationally. PS (Pferdestärke) is the metric horsepower used in Europe and Japan. 1 HP = 0.7457 kW = 1.01387 PS.",
    },
  ],
  formula: "HP = (Torque x RPM) / 5252",
};
