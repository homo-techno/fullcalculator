import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gearRatioCalculator: CalculatorDefinition = {
  slug: "gear-ratio-calculator",
  title: "Gear Ratio Calculator",
  description:
    "Free gear ratio calculator. Calculate gear ratio from driving and driven gear teeth, plus output speed and torque multiplication.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "gear ratio",
    "gear calculator",
    "gear teeth",
    "output speed",
    "torque",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Gear Ratio",
      fields: [
        {
          name: "drivingTeeth",
          label: "Driving Gear Teeth",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "drivenTeeth",
          label: "Driven Gear Teeth",
          type: "number",
          placeholder: "e.g. 40",
        },
        {
          name: "inputRPM",
          label: "Input RPM (optional)",
          type: "number",
          placeholder: "e.g. 1000",
        },
      ],
      calculate: (inputs) => {
        const drivingTeeth = inputs.drivingTeeth as number;
        const drivenTeeth = inputs.drivenTeeth as number;
        const inputRPM = inputs.inputRPM as number;

        if (!drivingTeeth || !drivenTeeth) return null;
        if (drivingTeeth <= 0 || drivenTeeth <= 0) return null;

        const ratio = drivenTeeth / drivingTeeth;
        const ratioSimplified = `${drivenTeeth}:${drivingTeeth}`;

        let gearType = "";
        if (ratio > 1) gearType = "Reduction (speed down, torque up)";
        else if (ratio < 1) gearType = "Overdrive (speed up, torque down)";
        else gearType = "1:1 (direct drive)";

        const torqueMultiplier = ratio;
        const speedMultiplier = 1 / ratio;

        const details: { label: string; value: string }[] = [
          {
            label: "Driving Gear Teeth",
            value: formatNumber(drivingTeeth, 0),
          },
          {
            label: "Driven Gear Teeth",
            value: formatNumber(drivenTeeth, 0),
          },
          {
            label: "Gear Ratio",
            value: `${formatNumber(ratio, 3)}:1`,
          },
          { label: "Ratio (simplified)", value: ratioSimplified },
          { label: "Gear Type", value: gearType },
          {
            label: "Torque Multiplier",
            value: `${formatNumber(torqueMultiplier, 3)}x`,
          },
          {
            label: "Speed Multiplier",
            value: `${formatNumber(speedMultiplier, 3)}x`,
          },
        ];

        if (inputRPM && inputRPM > 0) {
          const outputRPM = inputRPM / ratio;
          details.push({
            label: "Input RPM",
            value: formatNumber(inputRPM, 0),
          });
          details.push({
            label: "Output RPM",
            value: formatNumber(outputRPM, 1),
          });
        }

        return {
          primary: {
            label: "Gear Ratio",
            value: `${formatNumber(ratio, 3)}:1`,
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["engine-displacement-calculator", "tire-size-calculator"],
  faq: [
    {
      question: "How is gear ratio calculated?",
      answer:
        "Gear ratio = driven gear teeth / driving gear teeth. A ratio of 2:1 means the driven gear has twice as many teeth and rotates at half the speed with double the torque.",
    },
    {
      question: "What is a reduction gear?",
      answer:
        "A reduction gear has a ratio greater than 1:1, meaning the output speed is slower but the torque is multiplied. This is common in transmissions, where lower gears provide more torque for acceleration.",
    },
  ],
  formula:
    "Gear Ratio = Driven Teeth / Driving Teeth. Output RPM = Input RPM / Ratio. Torque Multiplier = Ratio.",
};
