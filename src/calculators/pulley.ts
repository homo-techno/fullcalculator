import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pulleyCalculator: CalculatorDefinition = {
  slug: "pulley-calculator",
  title: "Pulley Calculator",
  description:
    "Free pulley mechanical advantage calculator. Calculate the effort force needed to lift a load using a pulley system. MA = number of supporting ropes.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "pulley calculator",
    "mechanical advantage",
    "pulley system",
    "block and tackle",
    "effort force",
    "simple machines",
  ],
  variants: [
    {
      id: "effort-force",
      name: "Calculate Effort Force",
      description: "Effort = Load / Number of supporting ropes",
      fields: [
        {
          name: "loadWeight",
          label: "Load Weight (lbs)",
          type: "number",
          placeholder: "e.g. 500",
        },
        {
          name: "numPulleys",
          label: "Number of Pulleys",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const load = inputs.loadWeight as number;
        const pulleys = inputs.numPulleys as number;
        if (!load || !pulleys) return null;
        if (pulleys < 1) return null;

        // For an ideal pulley system, the number of supporting ropes equals the number of pulleys
        const supportingRopes = pulleys;
        const mechanicalAdvantage = supportingRopes;
        const effortForce = load / mechanicalAdvantage;
        const ropeLength = load > 0 ? mechanicalAdvantage : 0; // feet of rope per foot of lift
        const loadKg = load * 0.453592;
        const effortKg = effortForce * 0.453592;
        const effortN = effortKg * 9.80665;
        const loadN = loadKg * 9.80665;

        return {
          primary: {
            label: "Effort Force Required",
            value: `${formatNumber(effortForce, 4)} lbs`,
          },
          details: [
            { label: "Effort Force", value: `${formatNumber(effortForce, 4)} lbs (${formatNumber(effortN, 2)} N)` },
            { label: "Load Weight", value: `${formatNumber(load, 4)} lbs (${formatNumber(loadN, 2)} N)` },
            { label: "Mechanical Advantage", value: `${mechanicalAdvantage}:1` },
            { label: "Number of Pulleys", value: String(pulleys) },
            { label: "Rope Needed per ft of Lift", value: `${mechanicalAdvantage} ft` },
          ],
          note: "Ideal mechanical advantage assumes frictionless pulleys and weightless ropes. Real-world efficiency is typically 85-95% per pulley.",
        };
      },
    },
    {
      id: "max-load",
      name: "Calculate Maximum Load",
      description: "Load = Effort × Number of supporting ropes",
      fields: [
        {
          name: "effortForce",
          label: "Available Effort Force (lbs)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "numPulleys",
          label: "Number of Pulleys",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const effort = inputs.effortForce as number;
        const pulleys = inputs.numPulleys as number;
        if (!effort || !pulleys) return null;
        if (pulleys < 1) return null;

        const mechanicalAdvantage = pulleys;
        const maxLoad = effort * mechanicalAdvantage;

        return {
          primary: {
            label: "Maximum Load",
            value: `${formatNumber(maxLoad, 4)} lbs`,
          },
          details: [
            { label: "Maximum Load", value: `${formatNumber(maxLoad, 4)} lbs` },
            { label: "Effort Force", value: `${formatNumber(effort, 4)} lbs` },
            { label: "Mechanical Advantage", value: `${mechanicalAdvantage}:1` },
            { label: "Max Load (kg)", value: formatNumber(maxLoad * 0.453592, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["lever-calculator", "inclined-plane-calculator", "gear-speed-calculator"],
  faq: [
    {
      question: "How does a pulley system reduce effort?",
      answer:
        "A pulley system distributes the load across multiple rope segments. The mechanical advantage equals the number of rope segments supporting the load. With 4 pulleys, you only need 1/4 of the force, but you must pull 4 times the rope length.",
    },
    {
      question: "What is mechanical advantage?",
      answer:
        "Mechanical advantage is the ratio of output force to input force. In pulley systems, it equals the number of supporting rope segments. A 4:1 MA means you exert 1/4 the force but pull 4x the distance.",
    },
  ],
  formula: "Effort = Load / MA | MA = Number of supporting ropes",
};
