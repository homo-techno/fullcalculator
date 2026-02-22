import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const backflowPreventerCalculator: CalculatorDefinition = {
  slug: "backflow-preventer-calculator",
  title: "Backflow Preventer Size Calculator",
  description: "Free backflow preventer size calculator. Determine the correct size based on flow rate, pressure loss, and system requirements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["backflow preventer size", "RPZ sizing", "backflow device calculator", "plumbing backflow", "cross connection"],
  variants: [
    {
      id: "size-from-flow",
      name: "Size from Flow Rate",
      description: "Determine backflow preventer size based on peak flow",
      fields: [
        { name: "peakFlow", label: "Peak Flow Rate (GPM)", type: "number", placeholder: "e.g. 50" },
        { name: "deviceType", label: "Device Type", type: "select", options: [
          { label: "RPZ (Reduced Pressure Zone)", value: "rpz" },
          { label: "DCVA (Double Check Valve)", value: "dcva" },
          { label: "PVB (Pressure Vacuum Breaker)", value: "pvb" },
        ], defaultValue: "rpz" },
        { name: "maxPressureLoss", label: "Max Allowable Pressure Loss (PSI)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const peakFlow = inputs.peakFlow as number;
        const deviceType = inputs.deviceType as string;
        const maxPressureLoss = inputs.maxPressureLoss as number;
        if (!peakFlow) return null;
        const sizeTable = [
          { size: 0.75, maxFlow: 20 },
          { size: 1, maxFlow: 35 },
          { size: 1.25, maxFlow: 50 },
          { size: 1.5, maxFlow: 75 },
          { size: 2, maxFlow: 125 },
          { size: 2.5, maxFlow: 175 },
          { size: 3, maxFlow: 275 },
          { size: 4, maxFlow: 500 },
          { size: 6, maxFlow: 1000 },
        ];
        const match = sizeTable.find(s => s.maxFlow >= peakFlow) || sizeTable[sizeTable.length - 1];
        const pressureLossFactors: Record<string, number> = { rpz: 1.0, dcva: 0.6, pvb: 0.4 };
        const pressureLoss = (peakFlow / match.maxFlow) * 10 * (pressureLossFactors[deviceType] || 1.0);
        const typeNames: Record<string, string> = { rpz: "Reduced Pressure Zone", dcva: "Double Check Valve", pvb: "Pressure Vacuum Breaker" };
        return {
          primary: { label: "Recommended Size", value: `${formatNumber(match.size, 2)}` + " inches" },
          details: [
            { label: "Max Flow for Size", value: `${formatNumber(match.maxFlow, 0)}` + " GPM" },
            { label: "Est. Pressure Loss", value: `${formatNumber(pressureLoss, 1)}` + " PSI" },
            { label: "Device Type", value: typeNames[deviceType] || deviceType },
            { label: "Peak Flow", value: `${formatNumber(peakFlow, 0)}` + " GPM" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pipe-sizing-calculator", "water-supply-demand-calculator", "pressure-relief-valve-calculator"],
  faq: [
    { question: "What is a backflow preventer?", answer: "A backflow preventer stops contaminated water from flowing backward into the clean water supply. Required by code at connections to fire systems, irrigation, boilers, and other cross-connections." },
    { question: "RPZ vs DCVA?", answer: "RPZ assemblies provide the highest protection and are required for high-hazard connections. DCVA is used for low-hazard applications. RPZ has higher pressure loss than DCVA." },
  ],
  formula: "Size based on peak flow capacity tables per ASSE/AWWA standards",
};