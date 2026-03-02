import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const grainStorageMoistureCalculator: CalculatorDefinition = {
  slug: "grain-storage-moisture-calculator",
  title: "Grain Storage Moisture Calculator",
  description: "Determine safe storage duration for grain based on moisture content and temperature, with drying recommendations.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["grain moisture","grain storage calculator","safe grain storage time"],
  variants: [{
    id: "standard",
    name: "Grain Storage Moisture",
    description: "Determine safe storage duration for grain based on moisture content and temperature, with drying recommendations.",
    fields: [
      { name: "grainType", label: "Grain Type", type: "select", options: [{ value: "1", label: "Corn" }, { value: "2", label: "Soybeans" }, { value: "3", label: "Wheat" }, { value: "4", label: "Rice" }], defaultValue: "1" },
      { name: "moisturePct", label: "Moisture Content (%)", type: "number", min: 8, max: 35, defaultValue: 18 },
      { name: "tempF", label: "Grain Temperature (F)", type: "number", min: 20, max: 110, defaultValue: 70 },
      { name: "bushels", label: "Total Bushels", type: "number", min: 100, max: 5000000, defaultValue: 50000 },
    ],
    calculate: (inputs) => {
      const gt = inputs.grainType as number;
      const mc = inputs.moisturePct as number;
      const temp = inputs.tempF as number;
      const bu = inputs.bushels as number;
      if (!mc || !temp || !bu) return null;
      var safeMoisture = gt == 1 ? 15.5 : gt == 2 ? 13 : gt == 3 ? 14 : 14;
      var moistureToRemove = Math.max(0, mc - safeMoisture);
      var daysAllowable = 1000;
      if (mc > safeMoisture) {
        var excessM = mc - safeMoisture;
        var tempFactor = Math.max(1, (temp - 30) / 10);
        daysAllowable = Math.max(1, Math.round(150 / (excessM * tempFactor)));
      }
      var lbsWaterPerBu = gt == 1 ? 56 : gt == 2 ? 60 : gt == 3 ? 60 : 45;
      var waterToRemove = Math.round(bu * lbsWaterPerBu * moistureToRemove / 100);
      var status = mc <= safeMoisture ? "Safe for long-term storage" : daysAllowable > 30 ? "Short-term storage only" : "Dry immediately";
      return {
        primary: { label: "Safe Storage Time", value: mc <= safeMoisture ? "Indefinite" : formatNumber(daysAllowable) + " days" },
        details: [
          { label: "Storage Status", value: status },
          { label: "Safe Moisture Level", value: safeMoisture + "%" },
          { label: "Moisture to Remove", value: formatNumber(Math.round(moistureToRemove * 10) / 10) + "%" },
          { label: "Water to Remove", value: formatNumber(waterToRemove) + " lb" },
        ],
      };
  },
  }],
  relatedSlugs: ["grain-bin-capacity-calculator","crop-yield-calculator"],
  faq: [
    { question: "What moisture level is safe for corn storage?", answer: "Corn should be dried to 15.5% moisture for short-term storage (less than 6 months) and 13 to 14% for long-term storage over a year. Lower moisture reduces spoilage risk." },
    { question: "What happens if grain is stored too wet?", answer: "Wet grain promotes mold growth, mycotoxin production, and heating. This leads to quality loss, reduced test weight, and can cause spontaneous combustion in severe cases." },
  ],
  formula: "Safe Storage Days = 150 / (Excess Moisture x Temperature Factor)
Water to Remove = Bushels x Weight/Bu x Excess Moisture%
Temperature Factor = (Temp - 30) / 10",
};
