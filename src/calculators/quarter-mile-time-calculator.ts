import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const quarterMileTimeCalculator: CalculatorDefinition = {
  slug: "quarter-mile-time-calculator",
  title: "Quarter Mile Time Calculator",
  description: "Estimate quarter-mile elapsed time and trap speed based on vehicle horsepower and weight for drag strip performance prediction.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["quarter mile time","drag strip calculator","ET calculator","quarter mile trap speed"],
  variants: [{
    id: "standard",
    name: "Quarter Mile Time",
    description: "Estimate quarter-mile elapsed time and trap speed based on vehicle horsepower and weight for drag strip performance prediction.",
    fields: [
      { name: "horsepower", label: "Engine Horsepower (HP)", type: "number", min: 50, max: 3000, defaultValue: 350 },
      { name: "curbWeight", label: "Vehicle Weight (lbs)", type: "number", min: 1000, max: 10000, defaultValue: 3500 },
      { name: "driverWeight", label: "Driver Weight (lbs)", type: "number", min: 100, max: 400, defaultValue: 180 },
      { name: "altitude", label: "Altitude (feet)", type: "number", min: 0, max: 10000, defaultValue: 500 },
    ],
    calculate: (inputs) => {
    const hp = inputs.horsepower as number;
    const vehicle = inputs.curbWeight as number;
    const driver = inputs.driverWeight as number;
    const altitude = inputs.altitude as number;
    const totalWeight = vehicle + driver;
    const altitudeFactor = 1 + (altitude / 30000);
    const effectiveHP = hp / altitudeFactor;
    const et = 5.825 * Math.pow(totalWeight / effectiveHP, 1 / 3);
    const trapSpeed = 234.24 * Math.pow(effectiveHP / totalWeight, 1 / 3);
    const eighthMileET = Math.round(et * 0.632 * 1000) / 1000;
    const etRounded = Math.round(et * 1000) / 1000;
    const trapRounded = Math.round(trapSpeed * 10) / 10;
    return {
      primary: { label: "Quarter Mile ET", value: formatNumber(etRounded) + " seconds" },
      details: [
        { label: "Trap Speed", value: formatNumber(trapRounded) + " mph" },
        { label: "1/8 Mile ET", value: formatNumber(eighthMileET) + " seconds" },
        { label: "Effective HP (altitude adjusted)", value: formatNumber(Math.round(effectiveHP)) },
        { label: "Total Weight", value: formatNumber(totalWeight) + " lbs" }
      ]
    };
  },
  }],
  relatedSlugs: ["zero-to-sixty-time-calculator","engine-horsepower-to-weight-calculator"],
  faq: [
    { question: "What is the quarter mile ET formula?", answer: "The most common formula is the Roger Huntington equation: ET = 5.825 x (Weight/HP)^(1/3). This assumes reasonable traction and is accurate for most street vehicles." },
    { question: "How does altitude affect quarter mile time?", answer: "Naturally aspirated engines lose roughly 3 percent power per 1,000 feet of elevation. Turbocharged vehicles are less affected since the turbo compensates for thinner air." },
    { question: "What is a good quarter mile time?", answer: "A stock sports car typically runs 12 to 14 seconds, performance sedans 14 to 16 seconds, and economy cars 16 to 18 seconds. Under 10 seconds is professional drag racing territory." },
  ],
  formula: "Quarter Mile ET = 5.825 x (Weight / HP) ^ (1/3)
Trap Speed = 234.24 x (HP / Weight) ^ (1/3)
1/8 Mile ET = Quarter Mile ET x 0.632",
};
