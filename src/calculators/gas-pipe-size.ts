import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gasPipeSizeCalculator: CalculatorDefinition = {
  slug: "gas-pipe-size-calculator",
  title: "Gas Pipe Sizing Calculator",
  description: "Free gas pipe sizing calculator. Determine the correct gas pipe diameter based on BTU load, pipe length, and gas type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gas pipe size calculator", "natural gas pipe sizing", "BTU gas pipe", "gas line sizing", "propane pipe size"],
  variants: [
    {
      id: "gas-pipe",
      name: "Gas Pipe Size from Load",
      description: "Calculate gas pipe diameter from total BTU demand",
      fields: [
        { name: "totalBtu", label: "Total BTU Load (BTU/hr)", type: "number", placeholder: "e.g. 200000" },
        { name: "pipeLength", label: "Pipe Length (ft)", type: "number", placeholder: "e.g. 50" },
        { name: "gasType", label: "Gas Type", type: "select", options: [
          { label: "Natural Gas (1,000 BTU/cf)", value: "natural" },
          { label: "Propane (2,516 BTU/cf)", value: "propane" },
        ], defaultValue: "natural" },
        { name: "pressure", label: "Supply Pressure", type: "select", options: [
          { label: "Low Pressure (< 0.5 PSI)", value: "low" },
          { label: "Medium Pressure (2 PSI)", value: "medium" },
          { label: "High Pressure (5 PSI)", value: "high" },
        ], defaultValue: "low" },
      ],
      calculate: (inputs) => {
        const totalBtu = inputs.totalBtu as number;
        const pipeLength = inputs.pipeLength as number;
        const gasType = inputs.gasType as string;
        const pressure = inputs.pressure as string;
        if (!totalBtu || !pipeLength) return null;
        const btuPerCf = gasType === "propane" ? 2516 : 1000;
        const cfh = totalBtu / btuPerCf;
        const pressureFactor: Record<string, number> = { low: 1.0, medium: 1.5, high: 2.0 };
        const pf = pressureFactor[pressure] || 1.0;
        const sizeTable = [
          { size: 0.5, cap20: 92, cap50: 60, cap100: 43 },
          { size: 0.75, cap20: 190, cap50: 125, cap100: 88 },
          { size: 1, cap20: 350, cap50: 225, cap100: 160 },
          { size: 1.25, cap20: 730, cap50: 470, cap100: 330 },
          { size: 1.5, cap20: 1100, cap50: 700, cap100: 500 },
          { size: 2, cap20: 2100, cap50: 1350, cap100: 960 },
          { size: 2.5, cap20: 3500, cap50: 2250, cap100: 1600 },
          { size: 3, cap20: 5600, cap50: 3600, cap100: 2500 },
        ];
        const capKey = pipeLength <= 20 ? "cap20" : pipeLength <= 50 ? "cap50" : "cap100";
        const adjustedCfh = cfh / pf;
        const match = sizeTable.find(s => s[capKey] >= adjustedCfh) || sizeTable[sizeTable.length - 1];
        return {
          primary: { label: "Required Pipe Size", value: `${formatNumber(match.size, 2)}` + " inches" },
          details: [
            { label: "Gas Flow Required", value: `${formatNumber(cfh, 0)}` + " CFH" },
            { label: "Pipe Capacity", value: `${formatNumber(match[capKey], 0)}` + " CFH" },
            { label: "Total BTU Load", value: `${formatNumber(totalBtu, 0)}` + " BTU/hr" },
            { label: "Pipe Length", value: `${formatNumber(pipeLength, 0)}` + " ft" },
            { label: "Gas Type", value: gasType === "propane" ? "Propane" : "Natural Gas" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pipe-sizing-calculator", "boiler-size-calculator", "water-heater-size-calculator"],
  faq: [
    { question: "How do I calculate gas pipe size?", answer: "Add up the BTU ratings of all gas appliances on the line, convert to cubic feet per hour, then use sizing tables based on pipe length and pressure. Always follow local codes." },
    { question: "What pressure is residential gas?", answer: "Residential natural gas is typically delivered at less than 0.5 PSI (about 7 inches water column) after the regulator. Some appliances use 2 PSI lines." },
  ],
  formula: "CFH = Total BTU / BTU per cubic foot | Pipe size from capacity tables based on length and pressure",
};