import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const geothermalGradientCalculator: CalculatorDefinition = {
  slug: "geothermal-gradient-calculator",
  title: "Geothermal Gradient Calculator",
  description: "Calculate subsurface temperature at any depth using the geothermal gradient, surface temperature, and thermal conductivity of rock layers.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["geothermal gradient","subsurface temperature","underground temperature","geothermal energy","heat flow"],
  variants: [{
    id: "standard",
    name: "Geothermal Gradient",
    description: "Calculate subsurface temperature at any depth using the geothermal gradient, surface temperature, and thermal conductivity of rock layers.",
    fields: [
      { name: "surfaceTemp", label: "Surface Temperature (C)", type: "number", min: -30, max: 50, defaultValue: 15 },
      { name: "gradient", label: "Geothermal Gradient (C/km)", type: "number", min: 10, max: 100, defaultValue: 25 },
      { name: "depth", label: "Target Depth (meters)", type: "number", min: 10, max: 10000, defaultValue: 3000 },
      { name: "thermalConductivity", label: "Rock Thermal Conductivity (W/mK)", type: "number", min: 0.5, max: 7, defaultValue: 2.5 },
      { name: "heatFlowDensity", label: "Heat Flow Density (mW/m2)", type: "number", min: 20, max: 200, defaultValue: 65 },
    ],
    calculate: (inputs) => {
    const Ts = inputs.surfaceTemp as number;
    const grad = inputs.gradient as number;
    const depth = inputs.depth as number;
    const k = inputs.thermalConductivity as number;
    const q = inputs.heatFlowDensity as number;
    const tempAtDepth = Ts + (grad * depth / 1000);
    const tempFromHeatFlow = Ts + (q * depth) / (k * 1000);
    const depthToBoiling = ((100 - Ts) / grad) * 1000;
    const heatFlowCalc = grad * k;
    const tempF = tempAtDepth * 9/5 + 32;
    const energyPotential = tempAtDepth > 150 ? "High (direct power generation)" : tempAtDepth > 90 ? "Medium (binary cycle power)" : tempAtDepth > 50 ? "Low (direct heating use)" : "Very low (heat pumps only)";
    return {
      primary: { label: "Temperature at Depth", value: formatNumber(parseFloat(tempAtDepth.toFixed(1))) + " C" },
      details: [
        { label: "Temperature (Fahrenheit)", value: formatNumber(parseFloat(tempF.toFixed(1))) + " F" },
        { label: "Heat Flow (calculated)", value: formatNumber(parseFloat(heatFlowCalc.toFixed(1))) + " mW/m2" },
        { label: "Depth to 100C", value: formatNumber(Math.round(depthToBoiling)) + " m" },
        { label: "Geothermal Potential", value: energyPotential },
        { label: "Temp from Heat Flow Model", value: formatNumber(parseFloat(tempFromHeatFlow.toFixed(1))) + " C" }
      ]
    };
  },
  }],
  relatedSlugs: ["volcanic-eruption-index-calculator","well-drilling-cost-calculator","rock-density-calculator"],
  faq: [
    { question: "What is the average geothermal gradient?", answer: "The average geothermal gradient is about 25 to 30 degrees Celsius per kilometer of depth. However, it varies widely from 10 C/km in old continental crust to over 80 C/km near volcanic areas and tectonic boundaries." },
    { question: "How deep do you need to drill for geothermal energy?", answer: "For electricity generation, wells typically need to reach 150 C or higher, which is usually 2-5 km deep. For direct heating, shallower wells of 1-2 km may suffice. Geothermal heat pumps work at just 3-100 meters." },
    { question: "What is heat flow density?", answer: "Heat flow density measures the rate of heat transfer from the Earth interior to the surface per unit area, in milliwatts per square meter. The global average is about 65 mW/m2, higher near plate boundaries and hotspots." },
  ],
  formula: "Temperature at Depth = Surface Temp + (Gradient x Depth / 1000); Heat Flow = Gradient x Thermal Conductivity; Depth to 100C = ((100 - Surface Temp) / Gradient) x 1000",
};
