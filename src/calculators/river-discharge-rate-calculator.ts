import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const riverDischargeRateCalculator: CalculatorDefinition = {
  slug: "river-discharge-rate-calculator",
  title: "River Discharge Rate Calculator",
  description: "Calculate river flow rate (discharge) using channel cross-section area and average velocity with Manning equation for open channel flow.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["river discharge","stream flow rate","Manning equation","channel flow","water discharge calculator"],
  variants: [{
    id: "standard",
    name: "River Discharge Rate",
    description: "Calculate river flow rate (discharge) using channel cross-section area and average velocity with Manning equation for open channel flow.",
    fields: [
      { name: "channelWidth", label: "Channel Width (meters)", type: "number", min: 0.5, max: 5000, defaultValue: 10 },
      { name: "avgDepth", label: "Average Depth (meters)", type: "number", min: 0.1, max: 50, defaultValue: 2 },
      { name: "slope", label: "Channel Slope (m/m)", type: "number", min: 0.0001, max: 0.5, defaultValue: 0.002 },
      { name: "roughness", label: "Manning Roughness (n)", type: "select", options: [{ value: "0.025", label: "Clean, straight (0.025)" }, { value: "0.03", label: "Winding, some pools (0.030)" }, { value: "0.04", label: "Weedy, deep pools (0.040)" }, { value: "0.06", label: "Mountain stream, cobbles (0.060)" }, { value: "0.1", label: "Floodplain, heavy brush (0.100)" }], defaultValue: "0.03" },
    ],
    calculate: (inputs) => {
    const w = inputs.channelWidth as number;
    const d = inputs.avgDepth as number;
    const s = inputs.slope as number;
    const n = parseFloat(inputs.roughness as unknown as string);
    const area = w * d;
    const wettedPerimeter = w + 2 * d;
    const hydraulicRadius = area / wettedPerimeter;
    const velocity = (1 / n) * Math.pow(hydraulicRadius, 2/3) * Math.pow(s, 0.5);
    const discharge = velocity * area;
    const dischargeLps = discharge * 1000;
    const dischargeGpm = discharge * 15850.3;
    const dischargeCfs = discharge * 35.3147;
    return {
      primary: { label: "Discharge (Q)", value: formatNumber(parseFloat(discharge.toFixed(2))) + " m3/s" },
      details: [
        { label: "Flow Velocity", value: formatNumber(parseFloat(velocity.toFixed(3))) + " m/s" },
        { label: "Discharge (CFS)", value: formatNumber(parseFloat(dischargeCfs.toFixed(1))) + " ft3/s" },
        { label: "Cross-Section Area", value: formatNumber(parseFloat(area.toFixed(2))) + " m2" },
        { label: "Hydraulic Radius", value: formatNumber(parseFloat(hydraulicRadius.toFixed(3))) + " m" },
        { label: "Wetted Perimeter", value: formatNumber(parseFloat(wettedPerimeter.toFixed(2))) + " m" }
      ]
    };
  },
  }],
  relatedSlugs: ["sediment-transport-calculator","groundwater-flow-rate-calculator","aquifer-yield-calculator"],
  faq: [
    { question: "What is Manning equation?", answer: "Manning equation calculates flow velocity in open channels based on the hydraulic radius, channel slope, and a roughness coefficient (n). It is one of the most widely used formulas in hydraulic engineering." },
    { question: "What affects river discharge?", answer: "River discharge depends on channel size (width and depth), slope, and roughness. Rainfall, snowmelt, land use, and upstream dams also affect how much water flows through a river at any given time." },
    { question: "What is hydraulic radius?", answer: "Hydraulic radius is the cross-sectional area of flow divided by the wetted perimeter. For wide, shallow channels, it approximately equals the average depth. It is a key parameter in flow calculations." },
  ],
  formula: "V = (1/n) x R^(2/3) x S^(1/2) (Manning Equation); Q = V x A; R = A / P (Hydraulic Radius); A = Width x Depth; P = Width + 2 x Depth",
};
