import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const showerWaterUsageCalculator: CalculatorDefinition = {
  slug: "shower-water-usage-calculator",
  title: "Shower Water Usage Calculator",
  description: "Calculate your shower water consumption and cost based on duration, flow rate, and frequency.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["shower water usage", "shower cost", "water consumption shower"],
  variants: [{
    id: "standard",
    name: "Shower Water Usage",
    description: "Calculate your shower water consumption and cost based on duration, flow rate, and frequency",
    fields: [
      { name: "duration", label: "Shower Duration", type: "number", suffix: "minutes", min: 1, max: 60, defaultValue: 8 },
      { name: "flowRate", label: "Showerhead Flow Rate", type: "select", options: [{value:"1.5",label:"Low Flow (1.5 GPM)"},{value:"2.0",label:"Standard (2.0 GPM)"},{value:"2.5",label:"Full Flow (2.5 GPM)"},{value:"3.5",label:"Rain/High Flow (3.5 GPM)"}], defaultValue: "2.0" },
      { name: "frequency", label: "Showers per Week", type: "number", min: 1, max: 14, defaultValue: 7 },
      { name: "waterRate", label: "Water Rate", type: "number", suffix: "per 1000 gal", min: 1, max: 30, defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const duration = inputs.duration as number;
      const flow = parseFloat(inputs.flowRate as string);
      const freq = inputs.frequency as number;
      const rate = inputs.waterRate as number;
      if (!duration || !flow || !freq || !rate) return null;
      const perShower = duration * flow;
      const weekly = perShower * freq;
      const monthly = weekly * 4.33;
      const monthlyCost = (monthly / 1000) * rate;
      const annualCost = monthlyCost * 12;
      return {
        primary: { label: "Gallons per Shower", value: formatNumber(Math.round(perShower)) + " gal" },
        details: [
          { label: "Monthly Usage", value: formatNumber(Math.round(monthly)) + " gal" },
          { label: "Monthly Water Cost", value: "$" + monthlyCost.toFixed(2) },
          { label: "Annual Water Cost", value: "$" + formatNumber(Math.round(annualCost)) },
        ],
      };
    },
  }],
  relatedSlugs: ["dishwasher-vs-hand-wash-calculator", "laundry-schedule-calculator"],
  faq: [
    { question: "How much water does a shower use?", answer: "An average 8-minute shower with a standard 2.0 GPM showerhead uses about 16 gallons of water. Low-flow heads can reduce this to 12 gallons." },
    { question: "How can I reduce shower water usage?", answer: "Install a low-flow showerhead (1.5 GPM or less), take shorter showers, and turn off water while lathering to reduce consumption significantly." },
  ],
  formula: "Water per Shower = Duration (minutes) x Flow Rate (GPM)",
};
