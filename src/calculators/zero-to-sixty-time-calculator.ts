import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const zeroToSixtyTimeCalculator: CalculatorDefinition = {
  slug: "zero-to-sixty-time-calculator",
  title: "0-60 MPH Time Estimator",
  description: "Estimate your vehicle 0-60 mph acceleration time based on horsepower, weight, drivetrain, and transmission type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["0-60 time","zero to sixty","acceleration calculator","0-60 mph estimator"],
  variants: [{
    id: "standard",
    name: "0-60 MPH Time Estimator",
    description: "Estimate your vehicle 0-60 mph acceleration time based on horsepower, weight, drivetrain, and transmission type.",
    fields: [
      { name: "horsepower", label: "Engine Horsepower (HP)", type: "number", min: 50, max: 2000, defaultValue: 300 },
      { name: "curbWeight", label: "Curb Weight (lbs)", type: "number", min: 1000, max: 10000, defaultValue: 3500 },
      { name: "drivetrain", label: "Drivetrain", type: "select", options: [{ value: "1", label: "Front-Wheel Drive" }, { value: "2", label: "Rear-Wheel Drive" }, { value: "3", label: "All-Wheel Drive" }], defaultValue: "2" },
      { name: "transmission", label: "Transmission", type: "select", options: [{ value: "1", label: "Manual" }, { value: "2", label: "Automatic (Torque Converter)" }, { value: "3", label: "Dual-Clutch (DCT)" }, { value: "4", label: "CVT" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const hp = inputs.horsepower as number;
    const weight = inputs.curbWeight as number;
    const drivetrain = parseInt(inputs.drivetrain as string);
    const trans = parseInt(inputs.transmission as string);
    const ratio = weight / hp;
    const baseTime = Math.pow(ratio, 0.75) * 0.45;
    const drivetrainMult = { 1: 1.05, 2: 1.0, 3: 0.92 };
    const transMult = { 1: 1.0, 2: 1.02, 3: 0.95, 4: 1.08 };
    const estimated060 = Math.round(baseTime * (drivetrainMult[drivetrain] || 1) * (transMult[trans] || 1) * 100) / 100;
    const speed30 = Math.round(estimated060 * 0.38 * 100) / 100;
    let rating = "";
    if (estimated060 < 3.5) rating = "Supercar Quick";
    else if (estimated060 < 5) rating = "Very Fast";
    else if (estimated060 < 7) rating = "Quick";
    else if (estimated060 < 9) rating = "Average";
    else rating = "Leisurely";
    return {
      primary: { label: "Estimated 0-60 MPH", value: formatNumber(estimated060) + " seconds" },
      details: [
        { label: "0-30 MPH", value: formatNumber(speed30) + " seconds" },
        { label: "Weight-to-Power Ratio", value: formatNumber(Math.round(ratio * 10) / 10) + " lbs/HP" },
        { label: "Performance Rating", value: rating }
      ]
    };
  },
  }],
  relatedSlugs: ["engine-horsepower-to-weight-calculator","quarter-mile-time-calculator"],
  faq: [
    { question: "How accurate is this 0-60 estimate?", answer: "This calculator uses a simplified physics model and is typically accurate within 0.5 to 1.5 seconds. Real-world times depend on tire grip, launch technique, altitude, temperature, and gearing." },
    { question: "Does AWD improve 0-60 times?", answer: "All-wheel drive improves traction off the line, which typically reduces 0-60 times by 0.3 to 0.8 seconds compared to RWD on the same vehicle, especially in high-power applications." },
    { question: "Why are DCT transmissions faster?", answer: "Dual-clutch transmissions pre-select the next gear for near-instantaneous shifts with minimal power interruption, reducing shift times to under 100 milliseconds." },
  ],
  formula: "Base Time = (Weight/HP)^0.75 x 0.45; Adjusted Time = Base Time x Drivetrain Factor x Transmission Factor; AWD factor: 0.92, FWD: 1.05, RWD: 1.0",
};
