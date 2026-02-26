import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rcCarGearingCalculator: CalculatorDefinition = {
  slug: "rc-car-gearing-calculator",
  title: "RC Car Gear Ratio Calculator",
  description: "Free online RC car gear ratio calculator. Calculate final drive ratio, top speed, and rollout for RC cars and trucks.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["rc car gear ratio calculator", "rc gearing calculator", "pinion spur calculator", "rc rollout calculator", "rc top speed calculator"],
  variants: [
    {
      id: "gear-ratio",
      name: "Gear Ratio & Rollout",
      description: "Calculate final drive ratio and rollout from pinion, spur, and internal ratio",
      fields: [
        { name: "pinion", label: "Pinion Gear Teeth", type: "number", placeholder: "e.g. 20" },
        { name: "spur", label: "Spur Gear Teeth", type: "number", placeholder: "e.g. 80" },
        { name: "internalRatio", label: "Internal Drive Ratio", type: "number", placeholder: "e.g. 2.6", defaultValue: 2.6 },
        { name: "tireDiameter", label: "Tire Diameter (mm)", type: "number", placeholder: "e.g. 100" },
        { name: "motorKv", label: "Motor KV Rating", type: "number", placeholder: "e.g. 3300" },
        { name: "voltage", label: "Battery Voltage (V)", type: "select", options: [
          { label: "7.4V (2S LiPo)", value: "7.4" },
          { label: "11.1V (3S LiPo)", value: "11.1" },
          { label: "14.8V (4S LiPo)", value: "14.8" },
        ], defaultValue: "7.4" },
      ],
      calculate: (inputs) => {
        const pinion = parseFloat(inputs.pinion as string) || 0;
        const spur = parseFloat(inputs.spur as string) || 0;
        const internalRatio = parseFloat(inputs.internalRatio as string) || 2.6;
        const tireDiameter = parseFloat(inputs.tireDiameter as string) || 0;
        const motorKv = parseFloat(inputs.motorKv as string) || 0;
        const voltage = parseFloat(inputs.voltage as string) || 7.4;
        if (!pinion || !spur) return null;

        const firstStage = spur / pinion;
        const finalDriveRatio = firstStage * internalRatio;
        const tireCircumMm = tireDiameter ? Math.PI * tireDiameter : 0;
        const rolloutMm = tireCircumMm ? tireCircumMm / finalDriveRatio : 0;

        let topSpeedMph = 0;
        if (motorKv && tireDiameter) {
          const motorRpm = motorKv * voltage;
          const wheelRpm = motorRpm / finalDriveRatio;
          const speedMmPerMin = wheelRpm * tireCircumMm;
          topSpeedMph = (speedMmPerMin * 60) / (1609344);
        }

        const details: { label: string; value: string }[] = [
          { label: "First stage ratio", value: `${formatNumber(firstStage, 2)}:1` },
          { label: "Final drive ratio", value: `${formatNumber(finalDriveRatio, 2)}:1` },
          { label: "Pinion / Spur", value: `${formatNumber(pinion, 0)}T / ${formatNumber(spur, 0)}T` },
          { label: "Internal ratio", value: `${formatNumber(internalRatio, 2)}:1` },
        ];

        if (rolloutMm > 0) {
          details.push({ label: "Rollout", value: `${formatNumber(rolloutMm, 2)} mm` });
        }
        if (topSpeedMph > 0) {
          details.push({ label: "Theoretical top speed", value: `${formatNumber(topSpeedMph, 1)} mph` });
          details.push({ label: "Motor RPM (no load)", value: formatNumber(motorKv * voltage, 0) });
        }

        return {
          primary: { label: "Final Drive Ratio", value: `${formatNumber(finalDriveRatio, 2)}:1` },
          details,
          note: "Actual top speed is lower due to motor load, drivetrain losses, and rolling resistance. Theoretical speed is roughly 70-80% achievable.",
        };
      },
    },
    {
      id: "find-pinion",
      name: "Find Pinion for Target Speed",
      description: "Calculate which pinion gear to use for a target top speed",
      fields: [
        { name: "targetSpeed", label: "Target Speed (mph)", type: "number", placeholder: "e.g. 40" },
        { name: "spur", label: "Spur Gear Teeth", type: "number", placeholder: "e.g. 80" },
        { name: "internalRatio", label: "Internal Drive Ratio", type: "number", placeholder: "e.g. 2.6", defaultValue: 2.6 },
        { name: "tireDiameter", label: "Tire Diameter (mm)", type: "number", placeholder: "e.g. 100" },
        { name: "motorKv", label: "Motor KV Rating", type: "number", placeholder: "e.g. 3300" },
        { name: "voltage", label: "Battery Voltage (V)", type: "number", placeholder: "e.g. 7.4", defaultValue: 7.4 },
      ],
      calculate: (inputs) => {
        const targetMph = parseFloat(inputs.targetSpeed as string) || 0;
        const spur = parseFloat(inputs.spur as string) || 0;
        const internalRatio = parseFloat(inputs.internalRatio as string) || 2.6;
        const tireDiameter = parseFloat(inputs.tireDiameter as string) || 0;
        const motorKv = parseFloat(inputs.motorKv as string) || 0;
        const voltage = parseFloat(inputs.voltage as string) || 7.4;
        if (!targetMph || !spur || !tireDiameter || !motorKv) return null;

        const theoreticalSpeed = targetMph / 0.75;
        const tireCircumMm = Math.PI * tireDiameter;
        const speedMmPerMin = (theoreticalSpeed * 1609344) / 60;
        const wheelRpm = speedMmPerMin / tireCircumMm;
        const motorRpm = motorKv * voltage;
        const neededFDR = motorRpm / wheelRpm;
        const neededFirstStage = neededFDR / internalRatio;
        const pinionTeeth = spur / neededFirstStage;

        return {
          primary: { label: "Recommended Pinion", value: `${formatNumber(Math.round(pinionTeeth), 0)}T` },
          details: [
            { label: "Exact pinion calculation", value: `${formatNumber(pinionTeeth, 1)}T` },
            { label: "Needed FDR", value: `${formatNumber(neededFDR, 2)}:1` },
            { label: "Target speed", value: `${formatNumber(targetMph)} mph` },
            { label: "Motor RPM", value: formatNumber(motorRpm, 0) },
            { label: "Spur gear", value: `${formatNumber(spur, 0)}T` },
          ],
          note: "Round to the nearest available pinion size. A 75% efficiency factor is applied to account for real-world losses.",
        };
      },
    },
  ],
  relatedSlugs: ["speed-calculator", "ratio-calculator"],
  faq: [
    { question: "What does gear ratio mean in RC cars?", answer: "Gear ratio is how many times the motor turns for one wheel rotation. A higher ratio (e.g., 12:1) gives more torque and acceleration. A lower ratio (e.g., 6:1) gives higher top speed." },
    { question: "How do I change my RC car's gearing?", answer: "Swap the pinion gear (on the motor shaft). A larger pinion = lower ratio = more speed. A smaller pinion = higher ratio = more torque. Always check motor temperature after changing gearing." },
    { question: "What is rollout?", answer: "Rollout is the distance the car travels per motor revolution. It combines gear ratio and tire size. Higher rollout = more speed but less acceleration." },
  ],
  formula: "Final Drive Ratio = (Spur / Pinion) × Internal Ratio",
};
