import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const threePhasePowerCalculator: CalculatorDefinition = {
  slug: "three-phase-power-calculator",
  title: "Three Phase Power Calculator",
  description:
    "Free three-phase power calculator. Calculate power, current, and voltage for three-phase electrical systems. Convert between line and phase values.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "three phase power",
    "3 phase calculator",
    "three phase current",
    "three phase voltage",
    "three phase kW",
    "three phase kVA",
  ],
  variants: [
    {
      id: "power-from-voltage-current",
      name: "Calculate Three-Phase Power",
      description: "P = √3 × VL × IL × PF",
      fields: [
        {
          name: "lineVoltage",
          label: "Line-to-Line Voltage (V)",
          type: "number",
          placeholder: "e.g. 480",
        },
        {
          name: "lineCurrent",
          label: "Line Current (A)",
          type: "number",
          placeholder: "e.g. 50",
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
        const vl = inputs.lineVoltage as number;
        const il = inputs.lineCurrent as number;
        const pf = (inputs.powerFactor as number) || 0.85;
        if (!vl || !il) return null;

        const apparentPower = Math.sqrt(3) * vl * il; // VA
        const realPower = apparentPower * pf; // W
        const reactivePower = apparentPower * Math.sqrt(1 - pf * pf); // VAR
        const phaseVoltage = vl / Math.sqrt(3);
        const phaseCurrent = il; // for star connection

        return {
          primary: {
            label: "Real Power",
            value: `${formatNumber(realPower / 1000, 2)} kW`,
          },
          details: [
            { label: "Real Power (P)", value: `${formatNumber(realPower, 2)} W (${formatNumber(realPower / 1000, 2)} kW)` },
            { label: "Apparent Power (S)", value: `${formatNumber(apparentPower, 2)} VA (${formatNumber(apparentPower / 1000, 2)} kVA)` },
            { label: "Reactive Power (Q)", value: `${formatNumber(reactivePower, 2)} VAR (${formatNumber(reactivePower / 1000, 2)} kVAR)` },
            { label: "Phase Voltage (VL/√3)", value: `${formatNumber(phaseVoltage, 2)} V` },
            { label: "Power Factor", value: formatNumber(pf, 3) },
            { label: "Phase Angle", value: `${formatNumber(Math.acos(pf) * 180 / Math.PI, 2)}°` },
          ],
        };
      },
    },
    {
      id: "current-from-power",
      name: "Calculate Three-Phase Current",
      description: "IL = P / (√3 × VL × PF)",
      fields: [
        {
          name: "power",
          label: "Power",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "powerUnit",
          label: "Power Unit",
          type: "select",
          options: [
            { label: "kW (Real Power)", value: "kW" },
            { label: "kVA (Apparent Power)", value: "kVA" },
            { label: "HP (Horsepower)", value: "HP" },
          ],
          defaultValue: "kW",
        },
        {
          name: "lineVoltage",
          label: "Line-to-Line Voltage (V)",
          type: "number",
          placeholder: "e.g. 480",
        },
        {
          name: "powerFactor",
          label: "Power Factor",
          type: "number",
          placeholder: "e.g. 0.85",
          defaultValue: 0.85,
        },
        {
          name: "efficiency",
          label: "Efficiency (%) - for motors",
          type: "number",
          placeholder: "e.g. 90",
          defaultValue: 100,
        },
      ],
      calculate: (inputs) => {
        const power = inputs.power as number;
        const unit = inputs.powerUnit as string;
        const vl = inputs.lineVoltage as number;
        const pf = (inputs.powerFactor as number) || 0.85;
        const eff = (inputs.efficiency as number) || 100;
        if (!power || !vl) return null;

        let realPowerW: number;
        if (unit === "kW") {
          realPowerW = power * 1000;
        } else if (unit === "kVA") {
          realPowerW = power * 1000 * pf;
        } else {
          // HP
          realPowerW = power * 746;
        }

        const inputPowerW = realPowerW / (eff / 100);
        const apparentPowerVA = inputPowerW / pf;
        const lineCurrent = apparentPowerVA / (Math.sqrt(3) * vl);

        return {
          primary: {
            label: "Line Current",
            value: `${formatNumber(lineCurrent, 2)} A`,
          },
          details: [
            { label: "Line Current (IL)", value: `${formatNumber(lineCurrent, 4)} A` },
            { label: "Input Power", value: `${formatNumber(inputPowerW / 1000, 2)} kW` },
            { label: "Apparent Power", value: `${formatNumber(apparentPowerVA / 1000, 2)} kVA` },
            { label: "Output Power", value: `${formatNumber(realPowerW / 1000, 2)} kW` },
            { label: "Phase Voltage", value: `${formatNumber(vl / Math.sqrt(3), 2)} V` },
          ],
        };
      },
    },
    {
      id: "star-delta",
      name: "Star (Y) / Delta (Δ) Conversion",
      description: "Convert between star and delta voltage/current relationships",
      fields: [
        {
          name: "configuration",
          label: "Known Configuration",
          type: "select",
          options: [
            { label: "Star (Y) - know phase values", value: "star" },
            { label: "Delta (Δ) - know phase values", value: "delta" },
          ],
          defaultValue: "star",
        },
        {
          name: "phaseVoltage",
          label: "Phase Voltage (V)",
          type: "number",
          placeholder: "e.g. 277",
        },
        {
          name: "phaseCurrent",
          label: "Phase Current (A)",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const config = inputs.configuration as string;
        const vPhase = inputs.phaseVoltage as number;
        const iPhase = inputs.phaseCurrent as number;
        if (!vPhase || !iPhase) return null;

        let vLine: number, iLine: number;
        if (config === "star") {
          vLine = vPhase * Math.sqrt(3);
          iLine = iPhase;
        } else {
          vLine = vPhase;
          iLine = iPhase * Math.sqrt(3);
        }

        const apparentPower = Math.sqrt(3) * vLine * iLine;
        const phasePower = vPhase * iPhase;

        return {
          primary: {
            label: "Line Values",
            value: `${formatNumber(vLine, 2)} V, ${formatNumber(iLine, 2)} A`,
          },
          details: [
            { label: "Line Voltage (VL)", value: `${formatNumber(vLine, 2)} V` },
            { label: "Line Current (IL)", value: `${formatNumber(iLine, 2)} A` },
            { label: "Phase Voltage (Vφ)", value: `${formatNumber(vPhase, 2)} V` },
            { label: "Phase Current (Iφ)", value: `${formatNumber(iPhase, 2)} A` },
            { label: "Total Apparent Power", value: `${formatNumber(apparentPower / 1000, 2)} kVA` },
            { label: "Power per Phase", value: `${formatNumber(phasePower, 2)} VA` },
            { label: "Configuration", value: config === "star" ? "Star (Y): VL = √3 × Vφ, IL = Iφ" : "Delta (Δ): VL = Vφ, IL = √3 × Iφ" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["electrical-power-calculator", "motor-torque-calculator", "cable-voltage-drop-calculator"],
  faq: [
    {
      question: "What is three-phase power?",
      answer:
        "Three-phase power uses three AC voltage waveforms, each 120° apart. It is the standard for industrial and commercial power distribution because it provides constant power delivery (no zero-crossing), is more efficient for transmission, and can directly power three-phase motors.",
    },
    {
      question: "What is the difference between line and phase voltage?",
      answer:
        "Line voltage (VL) is measured between any two of the three power lines. Phase voltage (Vφ) is measured between a line and neutral. In star (Y) connection: VL = √3 × Vφ. In delta (Δ) connection: VL = Vφ. Common US systems: 480V line = 277V phase, 208V line = 120V phase.",
    },
    {
      question: "What is the difference between star (Y) and delta (Δ) connections?",
      answer:
        "Star (Y): All three phase windings share a common neutral point. VL = √3 × Vφ, IL = Iφ. Provides both line and phase voltage. Delta (Δ): Windings connected in a triangle. VL = Vφ, IL = √3 × Iφ. No neutral point. Delta is common for motors; star is common for distribution.",
    },
  ],
  formula:
    "P = √3 × VL × IL × PF | S = √3 × VL × IL | Q = √(S² - P²) | Star: VL = √3 × Vφ | Delta: IL = √3 × Iφ",
};
