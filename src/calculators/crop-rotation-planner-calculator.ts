import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cropRotationPlannerCalculator: CalculatorDefinition = {
  slug: "crop-rotation-planner-calculator",
  title: "Crop Rotation Planner Calculator",
  description: "Plan crop rotation across multiple fields and seasons to optimize soil health, reduce pest pressure, and maximize nutrient cycling.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["crop rotation","field rotation planner","crop sequence calculator"],
  variants: [{
    id: "standard",
    name: "Crop Rotation Planner",
    description: "Plan crop rotation across multiple fields and seasons to optimize soil health, reduce pest pressure, and maximize nutrient cycling.",
    fields: [
      { name: "numFields", label: "Number of Fields", type: "number", min: 2, max: 20, defaultValue: 4 },
      { name: "acresPerField", label: "Acres Per Field", type: "number", min: 1, max: 5000, defaultValue: 80 },
      { name: "rotationType", label: "Rotation Type", type: "select", options: [{ value: "1", label: "Corn-Soybean (2-yr)" }, { value: "2", label: "Corn-Soy-Wheat (3-yr)" }, { value: "3", label: "Corn-Soy-Wheat-Hay (4-yr)" }], defaultValue: "2" },
      { name: "currentYear", label: "Starting Year", type: "number", min: 2020, max: 2040, defaultValue: 2026 },
    ],
    calculate: (inputs) => {
      const nf = inputs.numFields as number;
      const apf = inputs.acresPerField as number;
      const rt = inputs.rotationType as number;
      const yr = inputs.currentYear as number;
      if (!nf || !apf || !yr) return null;
      var crops = [];
      if (rt == 1) crops = ["Corn", "Soybean"];
      else if (rt == 2) crops = ["Corn", "Soybean", "Wheat"];
      else crops = ["Corn", "Soybean", "Wheat", "Hay"];
      const rotLen = crops.length;
      const totalAcres = nf * apf;
      const acresPerCrop = Math.round(totalAcres / rotLen);
      var schedule = [];
      for (var i = 0; i < Math.min(nf, 4); i++) {
        var cropIdx = i % rotLen;
        schedule.push({ label: "Field " + (i + 1) + " (" + yr + ")", value: crops[cropIdx] });
      }
      return {
        primary: { label: "Rotation Length", value: rotLen + " years" },
        details: [
          { label: "Total Acres", value: formatNumber(totalAcres) },
          { label: "Acres Per Crop/Year", value: formatNumber(acresPerCrop) },
        ].concat(schedule),
      };
  },
  }],
  relatedSlugs: ["crop-yield-calculator","seed-rate-calculator"],
  faq: [
    { question: "Why is crop rotation important?", answer: "Crop rotation breaks pest and disease cycles, improves soil structure, balances nutrient use, reduces herbicide resistance, and can improve yields by 10 to 15 percent over continuous cropping." },
    { question: "What is the best crop rotation for corn?", answer: "A corn-soybean rotation is the most common in the US Midwest. Adding a small grain like wheat and a cover crop or hay year provides even greater soil health benefits." },
  ],
  formula: "Rotation Length = Number of unique crops in sequence; Acres Per Crop = Total Acres / Rotation Length; Each field shifts one crop forward each year",
};
