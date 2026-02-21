import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gearSpeedCalculator: CalculatorDefinition = {
  slug: "gear-speed-calculator",
  title: "Gear Speed Calculator",
  description:
    "Free gear speed calculator. Calculate output RPM from input RPM and gear teeth counts. Output RPM = Input RPM × (driving teeth / driven teeth).",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "gear speed",
    "gear rpm",
    "gear ratio calculator",
    "gear teeth calculator",
    "gear reduction",
    "gear speed calculator",
  ],
  variants: [
    {
      id: "output-rpm",
      name: "Calculate Output RPM",
      description: "Output RPM = Input RPM × (Driving Teeth / Driven Teeth)",
      fields: [
        {
          name: "inputRpm",
          label: "Input RPM",
          type: "number",
          placeholder: "e.g. 1800",
        },
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
          placeholder: "e.g. 60",
        },
      ],
      calculate: (inputs) => {
        const inputRpm = inputs.inputRpm as number;
        const drivingTeeth = inputs.drivingTeeth as number;
        const drivenTeeth = inputs.drivenTeeth as number;
        if (!inputRpm || !drivingTeeth || !drivenTeeth) return null;

        const gearRatio = drivenTeeth / drivingTeeth;
        const outputRpm = inputRpm * (drivingTeeth / drivenTeeth);
        const torqueMultiplier = gearRatio;
        const isReduction = gearRatio > 1;
        const isOverdrive = gearRatio < 1;

        return {
          primary: {
            label: "Output RPM",
            value: `${formatNumber(outputRpm, 4)} RPM`,
          },
          details: [
            { label: "Output RPM", value: formatNumber(outputRpm, 4) },
            { label: "Gear Ratio", value: `${formatNumber(gearRatio, 4)}:1` },
            { label: "Speed Change", value: isReduction ? "Reduction (slower)" : isOverdrive ? "Overdrive (faster)" : "1:1 (same speed)" },
            { label: "Torque Multiplier", value: `${formatNumber(torqueMultiplier, 4)}×` },
            { label: "Input RPM", value: formatNumber(inputRpm, 4) },
          ],
        };
      },
    },
    {
      id: "required-teeth",
      name: "Find Gear Teeth for Desired RPM",
      description: "Driven Teeth = Driving Teeth × (Input RPM / Desired Output RPM)",
      fields: [
        {
          name: "inputRpm",
          label: "Input RPM",
          type: "number",
          placeholder: "e.g. 1800",
        },
        {
          name: "desiredOutputRpm",
          label: "Desired Output RPM",
          type: "number",
          placeholder: "e.g. 600",
        },
        {
          name: "drivingTeeth",
          label: "Driving Gear Teeth",
          type: "number",
          placeholder: "e.g. 20",
        },
      ],
      calculate: (inputs) => {
        const inputRpm = inputs.inputRpm as number;
        const desiredRpm = inputs.desiredOutputRpm as number;
        const drivingTeeth = inputs.drivingTeeth as number;
        if (!inputRpm || !desiredRpm || !drivingTeeth) return null;

        const requiredDrivenTeeth = drivingTeeth * (inputRpm / desiredRpm);
        const gearRatio = requiredDrivenTeeth / drivingTeeth;
        const roundedTeeth = Math.round(requiredDrivenTeeth);
        const actualOutputRpm = inputRpm * (drivingTeeth / roundedTeeth);

        return {
          primary: {
            label: "Required Driven Gear Teeth",
            value: `${formatNumber(requiredDrivenTeeth, 2)} teeth`,
          },
          details: [
            { label: "Exact Teeth Needed", value: formatNumber(requiredDrivenTeeth, 4) },
            { label: "Nearest Whole Number", value: String(roundedTeeth) },
            { label: "Actual Output RPM (rounded)", value: formatNumber(actualOutputRpm, 4) },
            { label: "Gear Ratio", value: `${formatNumber(gearRatio, 4)}:1` },
            { label: "Torque Multiplier", value: `${formatNumber(gearRatio, 4)}×` },
          ],
        };
      },
    },
    {
      id: "gear-train",
      name: "Two-Stage Gear Train",
      description: "Final RPM = Input RPM × (T1_drive/T1_driven) × (T2_drive/T2_driven)",
      fields: [
        {
          name: "inputRpm",
          label: "Input RPM",
          type: "number",
          placeholder: "e.g. 1800",
        },
        {
          name: "stage1Drive",
          label: "Stage 1 Driving Teeth",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "stage1Driven",
          label: "Stage 1 Driven Teeth",
          type: "number",
          placeholder: "e.g. 60",
        },
        {
          name: "stage2Drive",
          label: "Stage 2 Driving Teeth",
          type: "number",
          placeholder: "e.g. 15",
        },
        {
          name: "stage2Driven",
          label: "Stage 2 Driven Teeth",
          type: "number",
          placeholder: "e.g. 45",
        },
      ],
      calculate: (inputs) => {
        const inputRpm = inputs.inputRpm as number;
        const s1Drive = inputs.stage1Drive as number;
        const s1Driven = inputs.stage1Driven as number;
        const s2Drive = inputs.stage2Drive as number;
        const s2Driven = inputs.stage2Driven as number;
        if (!inputRpm || !s1Drive || !s1Driven || !s2Drive || !s2Driven) return null;

        const ratio1 = s1Driven / s1Drive;
        const ratio2 = s2Driven / s2Drive;
        const totalRatio = ratio1 * ratio2;
        const intermediateRpm = inputRpm * (s1Drive / s1Driven);
        const outputRpm = intermediateRpm * (s2Drive / s2Driven);

        return {
          primary: {
            label: "Final Output RPM",
            value: `${formatNumber(outputRpm, 4)} RPM`,
          },
          details: [
            { label: "Final Output RPM", value: formatNumber(outputRpm, 4) },
            { label: "Intermediate RPM", value: formatNumber(intermediateRpm, 4) },
            { label: "Stage 1 Ratio", value: `${formatNumber(ratio1, 4)}:1` },
            { label: "Stage 2 Ratio", value: `${formatNumber(ratio2, 4)}:1` },
            { label: "Total Gear Ratio", value: `${formatNumber(totalRatio, 4)}:1` },
            { label: "Total Torque Multiplier", value: `${formatNumber(totalRatio, 4)}×` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gear-ratio-calculator", "belt-length-calculator", "pulley-calculator"],
  faq: [
    {
      question: "How do I calculate gear output speed?",
      answer:
        "Output RPM = Input RPM × (Driving Teeth / Driven Teeth). For example, if the motor runs at 1800 RPM with a 20-tooth driving gear and 60-tooth driven gear: Output = 1800 × (20/60) = 600 RPM.",
    },
    {
      question: "What is a gear ratio?",
      answer:
        "Gear ratio = Driven Teeth / Driving Teeth. A ratio greater than 1:1 means speed reduction (more torque). A ratio less than 1:1 means overdrive (more speed). A 3:1 ratio means the output is 1/3 the speed but 3× the torque.",
    },
  ],
  formula: "Output RPM = Input RPM × (Driving Teeth / Driven Teeth) | Gear Ratio = Driven Teeth / Driving Teeth",
};
