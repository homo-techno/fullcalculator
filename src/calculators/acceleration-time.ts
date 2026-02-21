import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const accelerationTimeCalculator: CalculatorDefinition = {
  slug: "acceleration-time-calculator",
  title: "0-60 Acceleration Time Calculator",
  description: "Free 0-60 acceleration time calculator. Estimate a vehicle's acceleration time based on horsepower, weight, drivetrain, and conditions.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["0-60 calculator", "acceleration time", "quarter mile calculator", "horsepower to 0-60", "vehicle acceleration"],
  variants: [
    {
      id: "zero60",
      name: "Estimate 0-60 MPH Time",
      description: "Estimate acceleration time from horsepower and weight",
      fields: [
        { name: "horsepower", label: "Horsepower (HP)", type: "number", placeholder: "e.g. 300" },
        { name: "weight", label: "Vehicle Weight (lbs)", type: "number", placeholder: "e.g. 3500" },
        { name: "drivetrain", label: "Drivetrain", type: "select", options: [
          { label: "Front-Wheel Drive (FWD)", value: "fwd" },
          { label: "Rear-Wheel Drive (RWD)", value: "rwd" },
          { label: "All-Wheel Drive (AWD)", value: "awd" },
        ], defaultValue: "rwd" },
        { name: "transmission", label: "Transmission", type: "select", options: [
          { label: "Manual", value: "manual" },
          { label: "Automatic", value: "auto" },
          { label: "Dual-Clutch (DCT)", value: "dct" },
        ], defaultValue: "auto" },
      ],
      calculate: (inputs) => {
        const hp = inputs.horsepower as number;
        const weight = inputs.weight as number;
        const drivetrain = (inputs.drivetrain as string) || "rwd";
        const transmission = (inputs.transmission as string) || "auto";
        if (!hp || !weight) return null;

        const powerToWeight = weight / hp;

        // Empirical formula: 0-60 time approximation
        // Based on Road & Track and MotorTrend data regression
        let time060 = 0.0058 * powerToWeight * powerToWeight + 0.0515 * powerToWeight - 0.77;

        // Drivetrain factor (AWD gets better launch)
        const driveFactors: Record<string, number> = { fwd: 1.05, rwd: 1.0, awd: 0.92 };
        time060 *= driveFactors[drivetrain] || 1.0;

        // Transmission factor
        const transFactors: Record<string, number> = { manual: 1.02, auto: 1.0, dct: 0.95 };
        time060 *= transFactors[transmission] || 1.0;

        time060 = Math.max(time060, 1.8); // physical minimum

        // Quarter mile estimation (Hale formula): ET = 6.290 x (weight/hp)^(1/3)
        const quarterMileTime = 6.290 * Math.pow(weight / hp, 1 / 3);
        const quarterMileSpeed = 224 * Math.pow(hp / weight, 1 / 3); // trap speed

        // 0-100 mph estimate (roughly 2.5-3x the 0-60 time)
        const time0100 = time060 * 2.7;

        return {
          primary: { label: "Estimated 0-60 MPH Time", value: `${formatNumber(time060, 1)} seconds` },
          details: [
            { label: "Power-to-weight ratio", value: `${formatNumber(powerToWeight, 1)} lbs/hp` },
            { label: "Quarter mile time", value: `${formatNumber(quarterMileTime, 1)} seconds` },
            { label: "Quarter mile trap speed", value: `${formatNumber(quarterMileSpeed, 0)} mph` },
            { label: "Estimated 0-100 mph", value: `${formatNumber(time0100, 1)} seconds` },
          ],
        };
      },
    },
    {
      id: "quartermile",
      name: "Quarter Mile Time",
      description: "Estimate quarter mile time and trap speed",
      fields: [
        { name: "horsepower", label: "Horsepower (HP)", type: "number", placeholder: "e.g. 400" },
        { name: "weight", label: "Vehicle Weight (lbs)", type: "number", placeholder: "e.g. 3800" },
        { name: "tireType", label: "Tire Type", type: "select", options: [
          { label: "All-Season", value: "allseason" },
          { label: "Performance Summer", value: "summer" },
          { label: "Drag Radials", value: "drag" },
          { label: "Drag Slicks", value: "slick" },
        ], defaultValue: "summer" },
      ],
      calculate: (inputs) => {
        const hp = inputs.horsepower as number;
        const weight = inputs.weight as number;
        const tireType = (inputs.tireType as string) || "summer";
        if (!hp || !weight) return null;

        // Hale formula
        let et = 6.290 * Math.pow(weight / hp, 1 / 3);
        let trapSpeed = 224 * Math.pow(hp / weight, 1 / 3);

        // Tire factor
        const tireFactors: Record<string, number> = { allseason: 1.05, summer: 1.0, drag: 0.96, slick: 0.93 };
        et *= tireFactors[tireType] || 1.0;

        const eighthMile = et * 0.655; // 1/8 mile is roughly 65.5% of 1/4 mile time

        return {
          primary: { label: "Quarter Mile ET", value: `${formatNumber(et, 2)} seconds` },
          details: [
            { label: "Trap speed", value: `${formatNumber(trapSpeed, 0)} mph` },
            { label: "1/8 mile time", value: `${formatNumber(eighthMile, 2)} seconds` },
            { label: "Power-to-weight", value: `${formatNumber(weight / hp, 1)} lbs/hp` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["braking-distance-calculator", "speed-calculator", "gear-ratio-vehicle-calculator"],
  faq: [
    { question: "How is 0-60 time estimated from HP and weight?", answer: "0-60 time correlates strongly with the power-to-weight ratio (vehicle weight divided by horsepower). Lighter cars with more power accelerate faster. Real-world times also depend on traction, gearing, aerodynamics, and launch technique." },
    { question: "What is a fast 0-60 time?", answer: "Under 4 seconds is very fast (sports cars). Under 6 seconds is quick (performance sedans). 7-9 seconds is average. Over 10 seconds is considered slow. The fastest production cars achieve sub-2-second 0-60 times with electric motors or launch control." },
    { question: "What is the quarter mile formula?", answer: "The Hale formula estimates quarter mile ET (elapsed time) as ET = 6.290 x (Weight/HP)^(1/3). Trap speed is approximately 224 x (HP/Weight)^(1/3). These give good approximations for street cars." },
  ],
  formula: "0-60 Estimate based on power-to-weight ratio; Quarter Mile ET = 6.290 x (Weight/HP)^(1/3); Trap Speed = 224 x (HP/Weight)^(1/3)",
};
