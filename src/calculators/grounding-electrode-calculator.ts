import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const groundingElectrodeCalculator: CalculatorDefinition = {
  slug: "grounding-electrode-calculator",
  title: "Grounding Electrode Calculator",
  description: "Calculate grounding electrode requirements including conductor size, ground rod specifications, and soil resistivity considerations for electrical system grounding per NEC.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["grounding electrode","ground rod calculator","electrical grounding","NEC grounding requirements"],
  variants: [{
    id: "standard",
    name: "Grounding Electrode",
    description: "Calculate grounding electrode requirements including conductor size, ground rod specifications, and soil resistivity considerations for electrical system grounding per NEC.",
    fields: [
      { name: "serviceSize", label: "Service Size (Amps)", type: "select", options: [{ value: "100", label: "100A" }, { value: "200", label: "200A" }, { value: "400", label: "400A" }, { value: "600", label: "600A" }], defaultValue: "200" },
      { name: "soilType", label: "Soil Type", type: "select", options: [{ value: "1", label: "Wet Clay (low resistivity)" }, { value: "2", label: "Loam/Garden Soil" }, { value: "3", label: "Sandy Soil" }, { value: "4", label: "Rocky/Dry (high resistivity)" }], defaultValue: "2" },
      { name: "rodMaterial", label: "Ground Rod Material", type: "select", options: [{ value: "1", label: "Copper-Bonded Steel (5/8 in)" }, { value: "2", label: "Galvanized Steel (5/8 in)" }, { value: "3", label: "Solid Copper (1/2 in)" }], defaultValue: "1" },
      { name: "rodCount", label: "Number of Ground Rods", type: "number", min: 1, max: 8, defaultValue: 2 },
    ],
    calculate: (inputs) => {
    const serviceAmps = parseFloat(inputs.serviceSize as string);
    const soilType = parseInt(inputs.soilType as string);
    const rodMat = parseInt(inputs.rodMaterial as string);
    const rodCount = inputs.rodCount as number;
    const gecSize = serviceAmps <= 100 ? 8 : serviceAmps <= 200 ? 4 : serviceAmps <= 400 ? 2 : 1;
    const gecSizeLabel = gecSize === 8 ? "8 AWG" : gecSize === 4 ? "4 AWG" : gecSize === 2 ? "2 AWG" : "1/0 AWG";
    const soilResistivity = { 1: 25, 2: 100, 3: 300, 4: 1000 };
    const resistivity = soilResistivity[soilType] || 100;
    const singleRodR = (resistivity * 0.8) / 8;
    const totalR = singleRodR / rodCount;
    const meetsNEC = totalR <= 25 ? "Yes (under 25 ohms)" : "No - add more rods";
    const rodLength = 8;
    const totalRodLength = rodLength * rodCount;
    const minSpacing = rodLength * 2;
    return {
      primary: { label: "GEC Size", value: gecSizeLabel + " copper" },
      details: [
        { label: "Estimated Ground Resistance", value: formatNumber(Math.round(totalR * 10) / 10) + " ohms" },
        { label: "Meets NEC 25-Ohm Rule", value: meetsNEC },
        { label: "Total Rod Length", value: formatNumber(totalRodLength) + " ft (" + formatNumber(rodCount) + " rods)" },
        { label: "Minimum Rod Spacing", value: formatNumber(minSpacing) + " ft apart" }
      ]
    };
  },
  }],
  relatedSlugs: ["wire-gauge-ampacity-calculator","electrical-panel-load-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "GEC Size = Per NEC Table 250.66 based on service size; Single Rod Resistance = (Soil Resistivity x 0.8) / Rod Length; Total Resistance = Single Rod R / Number of Rods; Minimum Rod Spacing = 2 x Rod Length",
};
