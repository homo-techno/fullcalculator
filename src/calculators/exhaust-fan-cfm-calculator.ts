import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const exhaustFanCfmCalculator: CalculatorDefinition = {
  slug: "exhaust-fan-cfm-calculator",
  title: "Exhaust Fan CFM Calculator",
  description: "Calculate the required exhaust fan airflow in CFM for bathrooms, kitchens, and utility spaces based on room size, use type, and ventilation code requirements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["exhaust fan CFM","bathroom fan size","kitchen exhaust calculator","ventilation fan sizing"],
  variants: [{
    id: "standard",
    name: "Exhaust Fan CFM",
    description: "Calculate the required exhaust fan airflow in CFM for bathrooms, kitchens, and utility spaces based on room size, use type, and ventilation code requirements.",
    fields: [
      { name: "roomType", label: "Room Type", type: "select", options: [{ value: "1", label: "Bathroom" }, { value: "2", label: "Kitchen" }, { value: "3", label: "Laundry Room" }, { value: "4", label: "Garage/Workshop" }], defaultValue: "1" },
      { name: "roomLength", label: "Room Length (ft)", type: "number", min: 3, max: 50, defaultValue: 10 },
      { name: "roomWidth", label: "Room Width (ft)", type: "number", min: 3, max: 50, defaultValue: 8 },
      { name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", min: 7, max: 14, defaultValue: 8 },
    ],
    calculate: (inputs) => {
    const roomType = parseInt(inputs.roomType as string);
    const length = inputs.roomLength as number;
    const width = inputs.roomWidth as number;
    const ceiling = inputs.ceilingHeight as number;
    const sqft = length * width;
    const volume = sqft * ceiling;
    const acph = { 1: 8, 2: 15, 3: 6, 4: 10 };
    const minCFM = { 1: 50, 2: 100, 3: 50, 4: 75 };
    const cfmByVolume = (volume * (acph[roomType] || 8)) / 60;
    const cfmBySqFt = roomType === 1 ? sqft * 1.0 : roomType === 2 ? sqft * 2.0 : sqft * 0.75;
    const requiredCFM = Math.max(cfmByVolume, cfmBySqFt, minCFM[roomType] || 50);
    const stdSizes = [50, 70, 80, 100, 110, 150, 200, 250, 300, 400, 500];
    let fanSize = 50;
    for (let i = 0; i < stdSizes.length; i++) {
      if (stdSizes[i] >= requiredCFM) { fanSize = stdSizes[i]; break; }
      if (i === stdSizes.length - 1) fanSize = stdSizes[i];
    }
    const sones = fanSize <= 80 ? 0.5 : fanSize <= 110 ? 1.0 : fanSize <= 200 ? 2.0 : 3.0;
    const roomTypeName = { 1: "Bathroom", 2: "Kitchen", 3: "Laundry", 4: "Garage" };
    return {
      primary: { label: "Required CFM", value: formatNumber(Math.round(requiredCFM)) + " CFM" },
      details: [
        { label: "Recommended Fan Size", value: formatNumber(fanSize) + " CFM" },
        { label: "Room Volume", value: formatNumber(Math.round(volume)) + " cu ft" },
        { label: "Estimated Noise Level", value: formatNumber(sones) + " sones" },
        { label: "Room Type", value: roomTypeName[roomType] || "General" }
      ]
    };
  },
  }],
  relatedSlugs: ["duct-sizing-calculator","btu-heating-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "CFM by Volume = (Length x Width x Height x Air Changes/hr) / 60; CFM by Area = Square Footage x CFM Per Sq Ft; Required CFM = Maximum of Volume, Area, and Code Minimum; Air Changes: Bathroom=8, Kitchen=15, Laundry=6, Garage=10",
};
