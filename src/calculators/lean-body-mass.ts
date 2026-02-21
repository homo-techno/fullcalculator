import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const leanBodyMassCalculator: CalculatorDefinition = {
  slug: "lean-body-mass-calculator",
  title: "Lean Body Mass Calculator",
  description: "Free lean body mass calculator. Estimate your lean body mass using the Boer, James, and Hume formulas.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["lean body mass calculator", "lbm calculator", "fat free mass", "lean mass calculator"],
  variants: [
    {
      id: "metric",
      name: "Metric (kg/cm)",
      fields: [
        { name: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 75" },
        { name: "height", label: "Height (cm)", type: "number", placeholder: "e.g. 178" },
        {
          name: "sex", label: "Sex", type: "select",
          options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }],
        },
      ],
      calculate: (inputs) => {
        const w = inputs.weight as number, h = inputs.height as number;
        const sex = inputs.sex as string || "male";
        if (!w || !h) return null;
        const boer = sex === "male"
          ? 0.407 * w + 0.267 * h - 19.2
          : 0.252 * w + 0.473 * h - 48.3;
        const james = sex === "male"
          ? 1.1 * w - 128 * Math.pow(w / h, 2)
          : 1.07 * w - 148 * Math.pow(w / h, 2);
        const hume = sex === "male"
          ? 0.32810 * w + 0.33929 * h - 29.5336
          : 0.29569 * w + 0.41813 * h - 43.2933;
        const avg = (boer + james + hume) / 3;
        const fatMass = w - avg;
        const bfPct = (fatMass / w) * 100;
        return {
          primary: { label: "Lean Body Mass (avg)", value: `${formatNumber(avg, 1)} kg` },
          details: [
            { label: "Boer formula", value: `${formatNumber(boer, 1)} kg` },
            { label: "James formula", value: `${formatNumber(james, 1)} kg` },
            { label: "Hume formula", value: `${formatNumber(hume, 1)} kg` },
            { label: "Est. fat mass", value: `${formatNumber(fatMass, 1)} kg` },
            { label: "Est. body fat %", value: `${formatNumber(bfPct, 1)}%` },
          ],
        };
      },
    },
    {
      id: "imperial",
      name: "Imperial (lbs/in)",
      fields: [
        { name: "weight", label: "Weight (lbs)", type: "number", placeholder: "e.g. 165" },
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 70" },
        {
          name: "sex", label: "Sex", type: "select",
          options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }],
        },
      ],
      calculate: (inputs) => {
        const wLbs = inputs.weight as number, hIn = inputs.height as number;
        const sex = inputs.sex as string || "male";
        if (!wLbs || !hIn) return null;
        const w = wLbs * 0.453592, h = hIn * 2.54;
        const boer = sex === "male"
          ? 0.407 * w + 0.267 * h - 19.2
          : 0.252 * w + 0.473 * h - 48.3;
        const lbmLbs = boer / 0.453592;
        const fatLbs = wLbs - lbmLbs;
        return {
          primary: { label: "Lean Body Mass", value: `${formatNumber(lbmLbs, 1)} lbs` },
          details: [
            { label: "Fat mass", value: `${formatNumber(fatLbs, 1)} lbs` },
            { label: "Body fat %", value: `${formatNumber((fatLbs / wLbs) * 100, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["body-fat-calculator", "bmi-calculator", "bmr-calculator"],
  faq: [{ question: "What is lean body mass?", answer: "Lean body mass (LBM) is your total body weight minus fat mass. It includes muscle, bone, organs, and water. LBM is useful for calculating medication doses and setting fitness goals." }],
  formula: "Boer: Male = 0.407W + 0.267H - 19.2 | Female = 0.252W + 0.473H - 48.3",
};
