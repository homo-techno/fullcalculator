import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ivFlowRateCalculator: CalculatorDefinition = {
  slug: "iv-flow-rate-calculator",
  title: "IV Flow Rate Calculator",
  description:
    "Free IV flow rate calculator. Calculate IV drip rate in drops per minute (gtt/min) and mL per hour. Essential for nursing and clinical calculations.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "IV flow rate",
    "drip rate calculator",
    "drops per minute",
    "gtt per min",
    "IV drip rate",
    "infusion rate",
    "nursing calculator",
  ],
  variants: [
    {
      id: "drip-rate",
      name: "IV Drip Rate (gtt/min)",
      description: "Calculate drops per minute for IV infusion",
      fields: [
        {
          name: "totalVolume",
          label: "Total Volume to Infuse",
          type: "number",
          placeholder: "e.g. 1000",
          suffix: "mL",
          min: 1,
          max: 10000,
        },
        {
          name: "timeHours",
          label: "Infusion Time",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "hours",
          min: 0.1,
          max: 72,
          step: 0.5,
        },
        {
          name: "dropFactor",
          label: "Drop Factor (tubing)",
          type: "select",
          options: [
            { label: "10 gtt/mL (macro drip)", value: "10" },
            { label: "15 gtt/mL (macro drip)", value: "15" },
            { label: "20 gtt/mL (macro drip)", value: "20" },
            { label: "60 gtt/mL (micro drip)", value: "60" },
          ],
        },
      ],
      calculate: (inputs) => {
        const volume = inputs.totalVolume as number;
        const hours = inputs.timeHours as number;
        const dfStr = inputs.dropFactor as string;
        if (!volume || !hours || !dfStr) return null;
        const dropFactor = parseInt(dfStr);

        // gtt/min = (Volume x Drop Factor) / (Time in minutes)
        const totalMinutes = hours * 60;
        const gttPerMin = (volume * dropFactor) / totalMinutes;
        const mlPerHour = volume / hours;

        return {
          primary: { label: "Drip Rate", value: `${formatNumber(gttPerMin, 0)} gtt/min` },
          details: [
            { label: "Drip rate", value: `${formatNumber(gttPerMin, 1)} gtt/min` },
            { label: "Flow rate", value: `${formatNumber(mlPerHour, 1)} mL/hr` },
            { label: "Total volume", value: `${volume} mL` },
            { label: "Infusion time", value: `${hours} hours (${totalMinutes} min)` },
            { label: "Drop factor", value: `${dropFactor} gtt/mL` },
          ],
          note: "Always verify IV flow rate calculations independently. Count drops for 15 seconds and multiply by 4 to confirm the actual drip rate. For critical infusions, use an IV pump. This is an educational tool — not a substitute for clinical training.",
        };
      },
    },
    {
      id: "ml-per-hour",
      name: "mL per Hour (Pump Rate)",
      description: "Calculate mL/hr rate for IV pump settings",
      fields: [
        {
          name: "totalVolume",
          label: "Total Volume",
          type: "number",
          placeholder: "e.g. 1000",
          suffix: "mL",
          min: 1,
          max: 10000,
        },
        {
          name: "timeHours",
          label: "Infusion Time",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "hours",
          min: 0.1,
          max: 72,
          step: 0.5,
        },
      ],
      calculate: (inputs) => {
        const volume = inputs.totalVolume as number;
        const hours = inputs.timeHours as number;
        if (!volume || !hours) return null;

        const mlPerHour = volume / hours;
        const mlPerMin = mlPerHour / 60;
        const completionMin = volume / mlPerMin;

        return {
          primary: { label: "Pump Rate", value: `${formatNumber(mlPerHour, 0)} mL/hr` },
          details: [
            { label: "Rate", value: `${formatNumber(mlPerHour, 1)} mL/hr` },
            { label: "Rate", value: `${formatNumber(mlPerMin, 2)} mL/min` },
            { label: "Total volume", value: `${volume} mL` },
            { label: "Duration", value: `${hours} hours` },
          ],
          note: "Set the IV pump to the calculated rate. Always double-check pump programming. For high-risk medications, use smart pumps with dose-error reduction software.",
        };
      },
    },
    {
      id: "infusion-time",
      name: "Infusion Time Calculator",
      description: "Calculate how long an IV infusion will take",
      fields: [
        {
          name: "totalVolume",
          label: "Total Volume",
          type: "number",
          placeholder: "e.g. 1000",
          suffix: "mL",
          min: 1,
          max: 10000,
        },
        {
          name: "rate",
          label: "Flow Rate",
          type: "number",
          placeholder: "e.g. 125",
          suffix: "mL/hr",
          min: 1,
          max: 2000,
        },
      ],
      calculate: (inputs) => {
        const volume = inputs.totalVolume as number;
        const rate = inputs.rate as number;
        if (!volume || !rate) return null;

        const totalHours = volume / rate;
        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);

        return {
          primary: { label: "Infusion Time", value: `${hours}h ${minutes}m` },
          details: [
            { label: "Total time", value: `${hours} hours ${minutes} minutes` },
            { label: "Total volume", value: `${volume} mL` },
            { label: "Flow rate", value: `${rate} mL/hr` },
          ],
          note: "Actual infusion time may vary due to IV line resistance, patient position changes, and pump accuracy. Monitor infusions regularly and document intake.",
        };
      },
    },
  ],
  relatedSlugs: ["dosage-by-weight-calculator", "fluid-balance-calculator", "blood-volume-calculator"],
  faq: [
    {
      question: "What is a drop factor?",
      answer:
        "The drop factor (calibration) is the number of drops per milliliter that an IV tubing set delivers. Common values: macro drip (10, 15, or 20 gtt/mL) for larger volumes, micro drip (60 gtt/mL) for precise small-volume infusions.",
    },
    {
      question: "How do you calculate IV drip rate?",
      answer:
        "Drip rate (gtt/min) = (Volume in mL x Drop factor in gtt/mL) / (Time in minutes). For example: 1000 mL over 8 hours with 15 gtt/mL tubing = (1000 x 15) / 480 = 31.25 = ~31 gtt/min.",
    },
    {
      question: "When should I use micro drip vs macro drip tubing?",
      answer:
        "Micro drip (60 gtt/mL) is used for pediatric patients, precise medication infusions, and KVO (keep vein open) rates. Macro drip (10-20 gtt/mL) is used for standard adult fluid replacement and blood products.",
    },
    {
      question: "How do I verify the drip rate?",
      answer:
        "Count the drops falling into the drip chamber for 15 seconds and multiply by 4 to get gtt/min. Compare with the calculated rate. Adjust the roller clamp as needed. Recheck periodically.",
    },
  ],
  formula:
    "Drip rate (gtt/min) = (Volume (mL) x Drop factor (gtt/mL)) / Time (min) | mL/hr = Total volume (mL) / Time (hours) | Infusion time (hours) = Total volume (mL) / Rate (mL/hr)",
};
