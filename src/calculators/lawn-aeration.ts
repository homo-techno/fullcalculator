import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lawnAerationCalculator: CalculatorDefinition = {
  slug: "lawn-aeration-calculator",
  title: "Lawn Aeration Calculator",
  description: "Free lawn aeration calculator. Estimate the number of aeration holes, time required, and equipment rental for aerating your lawn.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["lawn aeration calculator", "core aeration", "aerate lawn", "aeration holes per square foot", "lawn aeration cost"],
  variants: [
    {
      id: "aeration",
      name: "Lawn Aeration Planner",
      description: "Calculate aeration requirements for your lawn",
      fields: [
        { name: "area", label: "Lawn Area (sq ft)", type: "number", placeholder: "e.g. 5000" },
        { name: "soilType", label: "Soil Type", type: "select", options: [
          { label: "Sandy soil (1 pass)", value: "1" },
          { label: "Loam soil (1-2 passes)", value: "1.5" },
          { label: "Clay soil (2 passes recommended)", value: "2" },
          { label: "Heavily compacted (2-3 passes)", value: "2.5" },
        ], defaultValue: "1.5" },
        { name: "method", label: "Aeration Method", type: "select", options: [
          { label: "Core aerator (machine)", value: "machine" },
          { label: "Manual core aerator", value: "manual" },
          { label: "Spike aerator", value: "spike" },
        ], defaultValue: "machine" },
        { name: "rentalCost", label: "Equipment Rental Cost (optional)", type: "number", placeholder: "e.g. 75", prefix: "$" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const passes = parseFloat(inputs.soilType as string) || 1.5;
        const method = inputs.method as string;
        const rental = inputs.rentalCost as number;
        if (!area) return null;

        const holesPerSqFt = method === "machine" ? 8 : method === "manual" ? 4 : 6;
        const totalHoles = Math.round(area * holesPerSqFt * passes);
        const sqFtPerHour = method === "machine" ? 3000 : method === "manual" ? 200 : 1500;
        const timeHours = (area * passes) / sqFtPerHour;
        const timeMinutes = timeHours * 60;

        const details = [
          { label: "Estimated holes", value: formatNumber(totalHoles) },
          { label: "Holes per sq ft", value: `${holesPerSqFt}` },
          { label: "Number of passes", value: `${passes}` },
          { label: "Estimated time", value: timeMinutes < 60 ? `${formatNumber(timeMinutes)} min` : `${formatNumber(timeHours, 1)} hours` },
          { label: "Coverage rate", value: `${formatNumber(sqFtPerHour)} sq ft/hr` },
        ];
        if (rental) {
          const costPerSqFt = rental / area;
          details.push({ label: "Cost per sq ft", value: `$${formatNumber(costPerSqFt, 3)}` });
        }

        return {
          primary: { label: "Time to Aerate", value: timeMinutes < 60 ? `${formatNumber(timeMinutes)} minutes` : `${formatNumber(timeHours, 1)} hours` },
          details,
          note: "Water your lawn 1-2 days before aerating. Leave the soil plugs on the lawn to decompose naturally. Best done in fall for cool-season grass or late spring for warm-season.",
        };
      },
    },
  ],
  relatedSlugs: ["lawn-overseeding-calculator", "square-footage-calculator", "watering-schedule-calculator"],
  faq: [
    { question: "How often should I aerate my lawn?", answer: "Most lawns benefit from annual aeration. Clay soils or high-traffic areas may need it twice a year. Sandy soils may only need aeration every 2-3 years." },
    { question: "Is core aeration better than spike aeration?", answer: "Yes, core aeration is significantly better. It removes plugs of soil, reducing compaction. Spike aeration can actually increase compaction by pushing soil sideways." },
  ],
  formula: "Holes = Area \u00D7 Holes/sq ft \u00D7 Passes | Time = (Area \u00D7 Passes) / Coverage Rate",
};
