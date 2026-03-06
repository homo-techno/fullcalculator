import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soilCompactionTestCalculator: CalculatorDefinition = {
  slug: "soil-compaction-test-calculator",
  title: "Soil Compaction Test Calculator",
  description: "Calculate soil compaction percentage, dry density, and moisture content from Proctor test data for construction quality control.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["soil compaction","Proctor test","dry density","compaction percentage","construction soil testing"],
  variants: [{
    id: "standard",
    name: "Soil Compaction Test",
    description: "Calculate soil compaction percentage, dry density, and moisture content from Proctor test data for construction quality control.",
    fields: [
      { name: "wetWeight", label: "Wet Soil Weight (grams)", type: "number", min: 100, max: 10000, defaultValue: 1850 },
      { name: "moldVolume", label: "Mold Volume (cm3)", type: "number", min: 100, max: 5000, defaultValue: 944 },
      { name: "moistureContent", label: "Moisture Content (%)", type: "number", min: 0, max: 50, defaultValue: 12 },
      { name: "maxDryDensity", label: "Max Dry Density - MDD (g/cm3)", type: "number", min: 1, max: 3, defaultValue: 1.85 },
      { name: "optimumMoisture", label: "Optimum Moisture Content (%)", type: "number", min: 0, max: 40, defaultValue: 14 },
    ],
    calculate: (inputs) => {
    const wetWt = inputs.wetWeight as number;
    const moldVol = inputs.moldVolume as number;
    const mc = inputs.moistureContent as number;
    const mdd = inputs.maxDryDensity as number;
    const omc = inputs.optimumMoisture as number;
    const wetDensity = wetWt / moldVol;
    const dryDensity = wetDensity / (1 + mc / 100);
    const compaction = (dryDensity / mdd) * 100;
    const voidRatio = (2.65 / dryDensity) - 1;
    const saturation = mc > 0 ? (mc * dryDensity) / (voidRatio * 1) * 100 : 0;
    const pass = compaction >= 95 ? "PASS (>= 95%)" : "FAIL (< 95%)";
    return {
      primary: { label: "Compaction Percentage", value: formatNumber(parseFloat(compaction.toFixed(1))) + "%" },
      details: [
        { label: "Dry Density", value: formatNumber(parseFloat(dryDensity.toFixed(3))) + " g/cm3" },
        { label: "Wet Density", value: formatNumber(parseFloat(wetDensity.toFixed(3))) + " g/cm3" },
        { label: "Void Ratio", value: formatNumber(parseFloat(voidRatio.toFixed(3))) },
        { label: "QC Result (95% Spec)", value: pass },
        { label: "Moisture vs Optimum", value: (mc - omc >= 0 ? "+" : "") + formatNumber(parseFloat((mc - omc).toFixed(1))) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["bearing-capacity-calculator","slope-stability-factor-calculator","excavation-volume-calculator"],
  faq: [
    { question: "What is a good soil compaction percentage?", answer: "For most construction projects, 95% of the maximum dry density (standard Proctor) is the minimum acceptable compaction. Highway subgrades often require 98% or higher." },
    { question: "What is the Proctor test?", answer: "The Proctor compaction test determines the optimal moisture content at which a soil reaches its maximum dry density. The standard test uses a specific compaction energy to establish the benchmark for field quality control." },
    { question: "Why is moisture content important for compaction?", answer: "Too little moisture means soil particles cannot slide together efficiently. Too much moisture fills voids with water that cannot be compressed. The optimum moisture content allows maximum particle packing." },
  ],
  formula: "Wet Density = Wet Weight / Mold Volume
Dry Density = Wet Density / (1 + Moisture Content / 100)
Compaction % = (Dry Density / Max Dry Density) x 100
Void Ratio = (Gs / Dry Density) - 1",
};
