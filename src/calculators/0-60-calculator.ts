import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const zeroToSixtyCalculator: CalculatorDefinition = {
  slug: "0-60-calculator",
  title: "0-60 MPH Time Estimator",
  description:
    "Free online 0-60 mph calculator. Estimate acceleration time based on horsepower, weight, and drivetrain. Compare vehicle performance metrics.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "0-60 calculator",
    "zero to sixty",
    "acceleration calculator",
    "car performance calculator",
    "0-60 time estimator",
  ],
  variants: [
    {
      id: "estimate",
      name: "Estimate 0-60 Time",
      description: "Estimate 0-60 mph time from power-to-weight ratio",
      fields: [
        { name: "hp", label: "Horsepower (at wheels)", type: "number", placeholder: "e.g. 300" },
        { name: "weight", label: "Vehicle Weight", type: "number", placeholder: "e.g. 3500", suffix: "lbs" },
        {
          name: "drivetrain",
          label: "Drivetrain",
          type: "select",
          options: [
            { label: "RWD", value: "rwd" },
            { label: "FWD", value: "fwd" },
            { label: "AWD", value: "awd" },
          ],
          defaultValue: "rwd",
        },
      ],
      calculate: (inputs) => {
        const hp = parseFloat(inputs.hp as string) || 0;
        const weight = parseFloat(inputs.weight as string) || 0;
        const drivetrain = inputs.drivetrain as string;
        if (!hp || !weight) return null;

        const powerToWeight = weight / hp;
        // Empirical formula: t = (w/hp)^0.75 * constant
        let constant = 0.95;
        if (drivetrain === "awd") constant = 0.85;
        if (drivetrain === "fwd") constant = 1.0;

        const zeroToSixty = Math.pow(powerToWeight, 0.75) * constant;
        const quarterMile = zeroToSixty * 2.75;
        const quarterMileSpeed = 234 * Math.pow(hp / weight, 0.3333);

        return {
          primary: { label: "Estimated 0-60 Time", value: `${formatNumber(zeroToSixty)} sec` },
          details: [
            { label: "Power-to-weight ratio", value: `${formatNumber(powerToWeight)} lbs/hp` },
            { label: "Estimated 1/4 mile time", value: `${formatNumber(quarterMile)} sec` },
            { label: "Estimated 1/4 mile speed", value: `${formatNumber(quarterMileSpeed)} mph` },
            { label: "Drivetrain advantage", value: drivetrain.toUpperCase() },
          ],
          note: "Estimates use empirical power-to-weight formulas. Actual times vary with traction, altitude, and conditions.",
        };
      },
    },
    {
      id: "compare",
      name: "Compare Two Vehicles",
      description: "Compare acceleration potential of two vehicles",
      fields: [
        { name: "hp1", label: "Vehicle 1 Horsepower", type: "number", placeholder: "e.g. 300" },
        { name: "weight1", label: "Vehicle 1 Weight (lbs)", type: "number", placeholder: "e.g. 3500" },
        { name: "hp2", label: "Vehicle 2 Horsepower", type: "number", placeholder: "e.g. 400" },
        { name: "weight2", label: "Vehicle 2 Weight (lbs)", type: "number", placeholder: "e.g. 4000" },
      ],
      calculate: (inputs) => {
        const hp1 = parseFloat(inputs.hp1 as string) || 0;
        const w1 = parseFloat(inputs.weight1 as string) || 0;
        const hp2 = parseFloat(inputs.hp2 as string) || 0;
        const w2 = parseFloat(inputs.weight2 as string) || 0;
        if (!hp1 || !w1 || !hp2 || !w2) return null;

        const ptw1 = w1 / hp1;
        const ptw2 = w2 / hp2;
        const time1 = Math.pow(ptw1, 0.75) * 0.95;
        const time2 = Math.pow(ptw2, 0.75) * 0.95;
        const diff = Math.abs(time1 - time2);
        const faster = time1 < time2 ? "Vehicle 1" : "Vehicle 2";

        return {
          primary: { label: "Faster Vehicle", value: `${faster} by ${formatNumber(diff)} sec` },
          details: [
            { label: "Vehicle 1 est. 0-60", value: `${formatNumber(time1)} sec` },
            { label: "Vehicle 2 est. 0-60", value: `${formatNumber(time2)} sec` },
            { label: "Vehicle 1 lbs/hp", value: formatNumber(ptw1) },
            { label: "Vehicle 2 lbs/hp", value: formatNumber(ptw2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["engine-hp-calculator", "speed-calculator"],
  faq: [
    {
      question: "How is 0-60 time estimated from horsepower and weight?",
      answer:
        "The most common empirical formula uses the power-to-weight ratio (weight / HP) raised to an exponent (approximately 0.75) multiplied by a drivetrain constant. AWD cars tend to be faster due to better traction off the line.",
    },
    {
      question: "What is a good 0-60 time?",
      answer:
        "An average sedan does 0-60 in about 7-8 seconds. Sports cars range from 3-5 seconds. Supercars and high-end EVs can achieve under 3 seconds. Economy cars may take 9-11 seconds.",
    },
  ],
  formula: "0-60 time (approx) = (Weight / HP)^0.75 x Drivetrain Constant",
};
