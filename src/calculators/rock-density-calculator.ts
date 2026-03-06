import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rockDensityCalculator: CalculatorDefinition = {
  slug: "rock-density-calculator",
  title: "Rock Density Calculator",
  description: "Calculate rock density from mass and volume measurements, or estimate density by rock type with porosity and moisture content adjustments.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["rock density","mineral density","specific gravity","bulk density","rock mass properties"],
  variants: [{
    id: "standard",
    name: "Rock Density",
    description: "Calculate rock density from mass and volume measurements, or estimate density by rock type with porosity and moisture content adjustments.",
    fields: [
      { name: "rockType", label: "Rock Type", type: "select", options: [{ value: "2650", label: "Granite" }, { value: "2900", label: "Basalt" }, { value: "2710", label: "Limestone" }, { value: "2350", label: "Sandstone" }, { value: "2750", label: "Marble" }, { value: "2700", label: "Gneiss" }, { value: "0", label: "Custom (Enter Mass/Volume)" }], defaultValue: "2650" },
      { name: "mass", label: "Sample Mass (grams)", type: "number", min: 0, max: 100000, defaultValue: 500 },
      { name: "volume", label: "Sample Volume (cm3)", type: "number", min: 0, max: 50000, defaultValue: 190 },
      { name: "porosity", label: "Porosity (%)", type: "number", min: 0, max: 60, defaultValue: 5 },
      { name: "moistureContent", label: "Moisture Content (%)", type: "number", min: 0, max: 100, defaultValue: 0 },
    ],
    calculate: (inputs) => {
    const rockType = parseFloat(inputs.rockType as unknown as string);
    const mass = inputs.mass as number;
    const vol = inputs.volume as number;
    const porosity = inputs.porosity as number / 100;
    const moisture = inputs.moistureContent as number / 100;
    let grainDensity = rockType > 0 ? rockType : (vol > 0 ? (mass / vol) * 1000 : 0);
    const bulkDensity = grainDensity * (1 - porosity) + 1000 * porosity * moisture;
    const dryDensity = grainDensity * (1 - porosity);
    const specificGravity = grainDensity / 1000;
    const satDensity = grainDensity * (1 - porosity) + 1000 * porosity;
    const measuredDensity = vol > 0 ? (mass / vol) * 1000 : grainDensity;
    return {
      primary: { label: "Bulk Density", value: formatNumber(Math.round(bulkDensity)) + " kg/m3" },
      details: [
        { label: "Grain Density", value: formatNumber(Math.round(grainDensity)) + " kg/m3" },
        { label: "Dry Density", value: formatNumber(Math.round(dryDensity)) + " kg/m3" },
        { label: "Saturated Density", value: formatNumber(Math.round(satDensity)) + " kg/m3" },
        { label: "Specific Gravity", value: formatNumber(parseFloat(specificGravity.toFixed(3))) },
        { label: "Measured Density", value: formatNumber(Math.round(measuredDensity)) + " kg/m3" }
      ]
    };
  },
  }],
  relatedSlugs: ["mineral-hardness-comparison-calculator","aggregate-volume-calculator","excavation-volume-calculator"],
  faq: [
    { question: "What is the difference between bulk and grain density?", answer: "Grain density is the density of the solid mineral material only. Bulk density includes the pore spaces and any fluids filling them. Bulk density is always lower than or equal to grain density." },
    { question: "How does porosity affect rock density?", answer: "Higher porosity means more void space and lower bulk density. A rock with 20% porosity has 20% of its volume as empty space, which significantly reduces its overall density." },
    { question: "What is the densest common rock?", answer: "Among common rocks, basalt and gabbro are the densest at about 2,900 to 3,100 kg/m3. For comparison, granite averages about 2,650 kg/m3 and sandstone about 2,350 kg/m3." },
  ],
  formula: "Bulk Density = Grain Density x (1 - Porosity) + Water Density x Porosity x Moisture
Dry Density = Grain Density x (1 - Porosity)
Specific Gravity = Grain Density / 1000",
};
