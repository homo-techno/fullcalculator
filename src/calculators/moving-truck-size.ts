import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const movingTruckSizeCalculator: CalculatorDefinition = {
  slug: "moving-truck-size-calculator",
  title: "Moving Truck Size Calculator",
  description: "Free moving truck size calculator. Determine the right truck size based on your home size, number of rooms, and belongings.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["moving truck size", "what size moving truck", "moving truck calculator", "truck rental size", "U-Haul size calculator"],
  variants: [
    {
      id: "byRooms",
      name: "By Number of Rooms",
      fields: [
        { name: "bedrooms", label: "Number of Bedrooms", type: "number", placeholder: "e.g. 3" },
        { name: "homeType", label: "Home Type", type: "select", options: [
          { label: "Studio / Dorm", value: "studio" },
          { label: "Apartment", value: "apartment" },
          { label: "Small House", value: "small" },
          { label: "Medium House", value: "medium" },
          { label: "Large House", value: "large" },
        ], defaultValue: "apartment" },
        { name: "furnishing", label: "Furnishing Level", type: "select", options: [
          { label: "Lightly furnished", value: "0.7" },
          { label: "Average", value: "1.0" },
          { label: "Heavily furnished", value: "1.4" },
        ], defaultValue: "1.0" },
        { name: "distance", label: "Moving Distance (miles)", type: "number", placeholder: "e.g. 100" },
      ],
      calculate: (inputs) => {
        const bedrooms = inputs.bedrooms as number;
        const homeType = inputs.homeType as string;
        const furnishing = parseFloat(inputs.furnishing as string) || 1.0;
        const distance = inputs.distance as number;
        if (!bedrooms && homeType !== "studio") return null;
        let baseCubicFt: number;
        if (homeType === "studio") baseCubicFt = 200;
        else if (homeType === "apartment") baseCubicFt = 200 + bedrooms * 200;
        else if (homeType === "small") baseCubicFt = 300 + bedrooms * 250;
        else if (homeType === "medium") baseCubicFt = 400 + bedrooms * 300;
        else baseCubicFt = 500 + bedrooms * 350;
        const totalCubicFt = Math.round(baseCubicFt * furnishing);
        let truckSize: string;
        let truckCubicFt: number;
        if (totalCubicFt <= 250) { truckSize = "10-foot truck"; truckCubicFt = 402; }
        else if (totalCubicFt <= 500) { truckSize = "12-foot truck"; truckCubicFt = 484; }
        else if (totalCubicFt <= 800) { truckSize = "15-foot truck"; truckCubicFt = 764; }
        else if (totalCubicFt <= 1100) { truckSize = "17-foot truck"; truckCubicFt = 865; }
        else if (totalCubicFt <= 1400) { truckSize = "20-foot truck"; truckCubicFt = 1015; }
        else if (totalCubicFt <= 1800) { truckSize = "22-foot truck"; truckCubicFt = 1175; }
        else { truckSize = "26-foot truck"; truckCubicFt = 1682; }
        const estimatedCost = distance ? (distance < 50 ? 30 + distance * 0.69 : 50 + distance * 0.59) : 0;
        const details = [
          { label: "Estimated volume", value: `${formatNumber(totalCubicFt, 0)} cu ft` },
          { label: "Truck capacity", value: `${formatNumber(truckCubicFt, 0)} cu ft` },
          { label: "Utilization", value: `${formatNumber((totalCubicFt / truckCubicFt) * 100, 0)}%` },
        ];
        if (distance && estimatedCost > 0) {
          details.push({ label: "Est. truck rental", value: `$${formatNumber(estimatedCost)}` });
          details.push({ label: "Moving distance", value: `${formatNumber(distance, 0)} miles` });
        }
        return {
          primary: { label: "Recommended Truck Size", value: truckSize },
          details,
          note: "Estimates based on average furnishing. Consider a larger truck if you have bulky items like pianos or large appliances.",
        };
      },
    },
  ],
  relatedSlugs: ["storage-unit-size-calculator", "square-footage-calculator", "fuel-cost-calculator"],
  faq: [
    { question: "What size moving truck do I need?", answer: "Studio/1-bedroom: 10-12 ft truck. 2-bedroom: 15-17 ft. 3-bedroom: 20-22 ft. 4+ bedrooms: 26 ft truck. If heavily furnished, go one size up. For long-distance moves, it's better to have extra space than to overpack." },
  ],
  formula: "Estimated Volume = Base Size × Furnishing Factor | Truck size matched to volume",
};
