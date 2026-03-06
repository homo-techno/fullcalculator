import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const seismicWaveVelocityCalculator: CalculatorDefinition = {
  slug: "seismic-wave-velocity-calculator",
  title: "Seismic Wave Velocity Calculator",
  description: "Calculate P-wave and S-wave velocities through different rock types based on density and elastic moduli for seismic analysis.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["seismic wave velocity","P-wave speed","S-wave speed","seismic analysis","rock wave propagation"],
  variants: [{
    id: "standard",
    name: "Seismic Wave Velocity",
    description: "Calculate P-wave and S-wave velocities through different rock types based on density and elastic moduli for seismic analysis.",
    fields: [
      { name: "rockType", label: "Rock Type", type: "select", options: [{ value: "1", label: "Granite" }, { value: "2", label: "Basalt" }, { value: "3", label: "Limestone" }, { value: "4", label: "Sandstone" }, { value: "5", label: "Shale" }, { value: "6", label: "Soil/Sediment" }], defaultValue: "1" },
      { name: "depth", label: "Depth (km)", type: "number", min: 0, max: 100, defaultValue: 5 },
      { name: "saturation", label: "Saturation", type: "select", options: [{ value: "1", label: "Dry" }, { value: "1.1", label: "Partially Saturated" }, { value: "1.2", label: "Fully Saturated" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const rock = parseFloat(inputs.rockType as unknown as string);
    const depth = inputs.depth as number;
    const sat = parseFloat(inputs.saturation as unknown as string);
    const vpBase = { 1: 5500, 2: 6200, 3: 5000, 4: 3500, 5: 3000, 6: 1500 } as Record<number, number>;
    const vsBase = { 1: 3200, 2: 3400, 3: 2800, 4: 2000, 5: 1700, 6: 600 } as Record<number, number>;
    const densities = { 1: 2650, 2: 2900, 3: 2700, 4: 2350, 5: 2400, 6: 1800 } as Record<number, number>;
    const depthFactor = 1 + depth * 0.002;
    const vp = vpBase[rock] * depthFactor * sat;
    const vs = vsBase[rock] * depthFactor;
    const ratio = vp / vs;
    const density = densities[rock];
    const poisson = (Math.pow(ratio, 2) - 2) / (2 * (Math.pow(ratio, 2) - 1));
    return {
      primary: { label: "P-Wave Velocity", value: formatNumber(Math.round(vp)) + " m/s" },
      details: [
        { label: "S-Wave Velocity", value: formatNumber(Math.round(vs)) + " m/s" },
        { label: "Vp/Vs Ratio", value: formatNumber(parseFloat(ratio.toFixed(3))) },
        { label: "Rock Density", value: formatNumber(density) + " kg/m3" },
        { label: "Poisson Ratio", value: formatNumber(parseFloat(poisson.toFixed(3))) },
        { label: "Depth Factor", value: depthFactor.toFixed(3) }
      ]
    };
  },
  }],
  relatedSlugs: ["earthquake-magnitude-converter","rock-density-calculator","slope-stability-factor-calculator"],
  faq: [
    { question: "What are P-waves and S-waves?", answer: "P-waves (primary waves) are compressional waves that travel fastest and arrive first. S-waves (secondary waves) are shear waves that are slower but cause more ground shaking. S-waves cannot travel through liquids." },
    { question: "Why does wave velocity increase with depth?", answer: "As depth increases, so does pressure, which compresses the rock and increases its elastic moduli. This causes seismic waves to travel faster through deeper rock layers." },
    { question: "What affects seismic wave velocity?", answer: "Key factors include rock type, density, porosity, fluid saturation, confining pressure (depth), temperature, and fracturing. Saturated rocks transmit P-waves faster than dry rocks." },
  ],
  formula: "Vp = BaseVp x DepthFactor x SaturationFactor
Vs = BaseVs x DepthFactor
Vp/Vs Ratio = Vp / Vs
Poisson Ratio = (Ratio^2 - 2) / (2 x (Ratio^2 - 1))",
};
