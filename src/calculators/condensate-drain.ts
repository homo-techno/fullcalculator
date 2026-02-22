import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const condensateDrainCalculator: CalculatorDefinition = {
  slug: "condensate-drain-calculator",
  title: "Condensate Drain Line Calculator",
  description: "Free condensate drain line calculator. Determine pipe size and capacity for AC and furnace condensate drain lines.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["condensate drain calculator", "AC drain line", "condensate pipe size", "furnace condensate", "drain line sizing"],
  variants: [
    {
      id: "ac-condensate",
      name: "AC Condensate Drain",
      description: "Calculate condensate production and drain line size",
      fields: [
        { name: "tonnage", label: "AC System Tonnage", type: "number", placeholder: "e.g. 3" },
        { name: "humidity", label: "Ambient Humidity", type: "select", options: [
          { label: "Low (30-40%)", value: "low" },
          { label: "Moderate (40-60%)", value: "moderate" },
          { label: "High (60-80%)", value: "high" },
          { label: "Very High (80%+)", value: "very_high" },
        ], defaultValue: "moderate" },
        { name: "runLength", label: "Drain Run Length (ft)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
      ],
      calculate: (inputs) => {
        const tonnage = inputs.tonnage as number;
        const humidity = inputs.humidity as string;
        const runLength = inputs.runLength as number;
        if (!tonnage) return null;
        const humidityFactor: Record<string, number> = { low: 0.5, moderate: 1.0, high: 1.5, very_high: 2.0 };
        const gallonsPerHour = tonnage * 0.5 * (humidityFactor[humidity] || 1.0);
        const gallonsPerDay = gallonsPerHour * (humidity === "very_high" ? 16 : 12);
        const pipeSize = tonnage <= 3 ? 0.75 : tonnage <= 5 ? 1.0 : 1.25;
        const slope = 0.125;
        const totalDrop = slope * (runLength || 20);
        return {
          primary: { label: "Recommended Drain Size", value: `${formatNumber(pipeSize, 2)}` + " inches" },
          details: [
            { label: "Condensate Production", value: `${formatNumber(gallonsPerHour, 2)}` + " gal/hr" },
            { label: "Daily Production (est)", value: `${formatNumber(gallonsPerDay, 1)}` + " gal/day" },
            { label: "Required Slope", value: `${formatNumber(slope, 3)}` + " in/ft" },
            { label: "Total Drop", value: `${formatNumber(totalDrop, 2)}` + " inches" },
            { label: "System Tonnage", value: `${formatNumber(tonnage, 1)}` + " tons" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["drain-pipe-slope-calculator", "cooling-load-calculator", "dehumidifier-size-calculator"],
  faq: [
    { question: "What size condensate drain line do I need?", answer: "Most residential AC systems (up to 5 tons) use 3/4 inch PVC drain lines. Larger systems may need 1 inch or larger. Always follow manufacturer specs and local code." },
    { question: "How much condensate does an AC produce?", answer: "A typical residential AC produces 5-20 gallons of condensate per day depending on tonnage and humidity levels. In humid climates, production is significantly higher." },
  ],
  formula: "Condensate (gal/hr) = Tonnage x 0.5 x Humidity Factor | Pipe size based on tonnage per code",
};