import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sedimentTransportCalculator: CalculatorDefinition = {
  slug: "sediment-transport-calculator",
  title: "Sediment Transport Calculator",
  description: "Estimate sediment transport capacity in rivers using flow velocity, particle size, and channel characteristics with the simplified Engelund-Hansen approach.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["sediment transport","bed load","suspended sediment","river erosion","sediment yield"],
  variants: [{
    id: "standard",
    name: "Sediment Transport",
    description: "Estimate sediment transport capacity in rivers using flow velocity, particle size, and channel characteristics with the simplified Engelund-Hansen approach.",
    fields: [
      { name: "flowVelocity", label: "Flow Velocity (m/s)", type: "number", min: 0.1, max: 10, defaultValue: 1.5 },
      { name: "waterDepth", label: "Water Depth (m)", type: "number", min: 0.1, max: 30, defaultValue: 2 },
      { name: "channelWidth", label: "Channel Width (m)", type: "number", min: 1, max: 5000, defaultValue: 15 },
      { name: "particleSize", label: "Median Particle Size (mm)", type: "select", options: [{ value: "0.1", label: "Fine Sand (0.1 mm)" }, { value: "0.5", label: "Medium Sand (0.5 mm)" }, { value: "2", label: "Coarse Sand (2 mm)" }, { value: "10", label: "Gravel (10 mm)" }, { value: "50", label: "Cobble (50 mm)" }], defaultValue: "0.5" },
      { name: "slope", label: "Channel Slope (m/m)", type: "number", min: 0.0001, max: 0.1, defaultValue: 0.001 },
    ],
    calculate: (inputs) => {
    const V = inputs.flowVelocity as number;
    const d = inputs.waterDepth as number;
    const w = inputs.channelWidth as number;
    const D = parseFloat(inputs.particleSize as unknown as string) / 1000;
    const S = inputs.slope as number;
    const rhoW = 1000;
    const rhoS = 2650;
    const g = 9.81;
    const shearStress = rhoW * g * d * S;
    const shieldsParam = shearStress / ((rhoS - rhoW) * g * D);
    const criticalShields = 0.047;
    const transport = shieldsParam > criticalShields;
    const qs = 0.05 * rhoS * Math.pow(V, 2) * d * S / ((rhoS / rhoW - 1) * g * D * Math.sqrt((rhoS / rhoW - 1) * g * D));
    const totalTransport = Math.max(0, qs) * w;
    const dailyTons = totalTransport * 86400 / 1000;
    const annualTons = dailyTons * 365;
    return {
      primary: { label: "Transport Rate", value: formatNumber(parseFloat(totalTransport.toFixed(4))) + " kg/s" },
      details: [
        { label: "Daily Load", value: formatNumber(Math.round(dailyTons)) + " tonnes/day" },
        { label: "Annual Load", value: formatNumber(Math.round(annualTons)) + " tonnes/year" },
        { label: "Bed Shear Stress", value: formatNumber(parseFloat(shearStress.toFixed(2))) + " Pa" },
        { label: "Shields Parameter", value: formatNumber(parseFloat(shieldsParam.toFixed(4))) },
        { label: "Transport Active", value: transport ? "Yes" : "No (below threshold)" }
      ]
    };
  },
  }],
  relatedSlugs: ["river-discharge-rate-calculator","groundwater-flow-rate-calculator","slope-stability-factor-calculator"],
  faq: [
    { question: "What is sediment transport?", answer: "Sediment transport is the movement of solid particles (sand, gravel, silt) by flowing water. It includes bed load (particles rolling along the bottom) and suspended load (particles carried in the water column)." },
    { question: "What is the Shields parameter?", answer: "The Shields parameter is a dimensionless number comparing the forces trying to move a sediment particle (shear stress) to the forces keeping it in place (gravity). Transport begins when it exceeds a critical value of about 0.047." },
    { question: "Why does sediment transport matter?", answer: "Sediment transport affects river channel shape, reservoir sedimentation, coastal erosion, water quality, and aquatic habitat. Understanding it is essential for dam design, flood control, and environmental management." },
  ],
  formula: "Bed Shear Stress = rho_w x g x depth x slope; Shields Parameter = Shear Stress / ((rho_s - rho_w) x g x D); Transport Rate (Engelund-Hansen) = 0.05 x rho_s x V^2 x d x S / ((SG-1) x g x D x sqrt((SG-1) x g x D))",
};
