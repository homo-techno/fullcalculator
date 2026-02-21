import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterFlowRateCalculator: CalculatorDefinition = {
  slug: "water-flow-rate-calculator",
  title: "Water Flow Rate Calculator",
  description: "Free water flow rate calculator. Calculate flow rate through pipes, channels, and hoses using pipe diameter, pressure, and velocity.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["water flow rate calculator", "pipe flow calculator", "GPM calculator", "flow rate calculator", "water velocity calculator"],
  variants: [
    {
      id: "pipe",
      name: "Pipe Flow (Velocity)",
      description: "Calculate flow rate from pipe diameter and velocity",
      fields: [
        { name: "diameter", label: "Pipe Inner Diameter (inches)", type: "number", placeholder: "e.g. 1", step: 0.125 },
        { name: "velocity", label: "Water Velocity (ft/sec)", type: "number", placeholder: "e.g. 5", step: 0.5 },
      ],
      calculate: (inputs) => {
        const d = inputs.diameter as number;
        const v = inputs.velocity as number;
        if (!d || !v) return null;
        const radiusFt = (d / 2) / 12;
        const areaSqFt = Math.PI * radiusFt * radiusFt;
        const cfs = areaSqFt * v; // cubic feet per second
        const gpm = cfs * 448.831;
        const lpm = gpm * 3.785;
        const gph = gpm * 60;
        return {
          primary: { label: "Flow Rate", value: `${formatNumber(gpm, 1)} GPM` },
          details: [
            { label: "Gallons per hour", value: formatNumber(gph, 0) },
            { label: "Liters per minute", value: formatNumber(lpm, 1) },
            { label: "Cubic feet/sec", value: formatNumber(cfs, 4) },
            { label: "Pipe area", value: `${formatNumber(areaSqFt * 144, 3)} sq in` },
            { label: "Velocity", value: `${v} ft/s` },
          ],
          note: "Recommended maximum velocity for residential plumbing is 5-8 ft/sec. Higher velocities cause noise and pipe erosion.",
        };
      },
    },
    {
      id: "pressure",
      name: "From Pressure (Hose/Nozzle)",
      description: "Estimate flow rate from pressure and orifice size",
      fields: [
        { name: "pressure", label: "Water Pressure (PSI)", type: "number", placeholder: "e.g. 50" },
        { name: "diameter", label: "Orifice/Nozzle Diameter (inches)", type: "number", placeholder: "e.g. 0.5", step: 0.0625 },
        { name: "coefficient", label: "Discharge Coefficient", type: "select", options: [
          { label: "Sharp-edged orifice (0.61)", value: "0.61" },
          { label: "Round nozzle (0.98)", value: "0.98" },
          { label: "Garden hose nozzle (0.80)", value: "0.80" },
          { label: "Fire hose nozzle (0.95)", value: "0.95" },
        ], defaultValue: "0.80" },
      ],
      calculate: (inputs) => {
        const p = inputs.pressure as number;
        const d = inputs.diameter as number;
        const cd = parseFloat(inputs.coefficient as string) || 0.80;
        if (!p || !d) return null;
        const areaSqIn = Math.PI * (d / 2) * (d / 2);
        const areaSqFt = areaSqIn / 144;
        // Torricelli's: v = Cd × sqrt(2 × g × h), h = P × 2.307 ft
        const headFt = p * 2.307;
        const velocity = cd * Math.sqrt(2 * 32.174 * headFt);
        const cfs = areaSqFt * velocity;
        const gpm = cfs * 448.831;
        return {
          primary: { label: "Flow Rate", value: `${formatNumber(gpm, 1)} GPM` },
          details: [
            { label: "Velocity", value: `${formatNumber(velocity, 1)} ft/sec` },
            { label: "Pressure", value: `${p} PSI (${formatNumber(headFt, 1)} ft head)` },
            { label: "Orifice area", value: `${formatNumber(areaSqIn, 3)} sq in` },
            { label: "Gallons per hour", value: formatNumber(gpm * 60, 0) },
            { label: "Liters per minute", value: formatNumber(gpm * 3.785, 1) },
          ],
        };
      },
    },
    {
      id: "bucket-test",
      name: "Bucket Test",
      description: "Measure flow rate with a bucket and timer",
      fields: [
        { name: "volume", label: "Container Volume", type: "select", options: [
          { label: "1 gallon", value: "1" },
          { label: "2 gallons", value: "2" },
          { label: "3 gallons", value: "3" },
          { label: "5 gallons", value: "5" },
          { label: "10 gallons", value: "10" },
        ], defaultValue: "5" },
        { name: "seconds", label: "Time to Fill (seconds)", type: "number", placeholder: "e.g. 30" },
      ],
      calculate: (inputs) => {
        const volume = parseFloat(inputs.volume as string) || 5;
        const seconds = inputs.seconds as number;
        if (!seconds) return null;
        const gpm = (volume / seconds) * 60;
        const gph = gpm * 60;
        const lpm = gpm * 3.785;
        return {
          primary: { label: "Flow Rate", value: `${formatNumber(gpm, 1)} GPM` },
          details: [
            { label: "Gallons per hour", value: formatNumber(gph, 0) },
            { label: "Liters per minute", value: formatNumber(lpm, 1) },
            { label: "Container", value: `${volume} gallons in ${seconds} seconds` },
          ],
          note: "Typical residential flow rates: Kitchen faucet 2-3 GPM, Shower 2-2.5 GPM, Garden hose 5-10 GPM, Main supply 8-15 GPM.",
        };
      },
    },
  ],
  relatedSlugs: ["well-pump-calculator", "drainage-calculator", "rain-barrel-calculator"],
  faq: [
    { question: "How do I measure my water flow rate?", answer: "Use the bucket test: turn on the faucet or hose fully, time how long it takes to fill a 5-gallon bucket, then divide 5 by the seconds and multiply by 60 to get GPM. For example, 30 seconds = 10 GPM." },
    { question: "What is normal residential water pressure?", answer: "Normal residential water pressure is 40-80 PSI, with 50-60 PSI being ideal. Pressure below 30 PSI is too low for most fixtures. Pressure above 80 PSI should be regulated to prevent pipe damage." },
    { question: "How many GPM do I need for my house?", answer: "A typical home needs 8-12 GPM for simultaneous use of multiple fixtures. Each fixture uses: Shower 2-2.5 GPM, Faucet 1.5-2 GPM, Toilet 3 GPM (during flush), Dishwasher 1.5 GPM, Washing machine 3-4 GPM." },
  ],
  formula: "Q = A × V | Q = Cd × A × √(2gh) | GPM = ft³/sec × 448.831 | Head (ft) = PSI × 2.307",
};
