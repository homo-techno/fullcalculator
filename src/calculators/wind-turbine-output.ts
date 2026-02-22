import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const windTurbineOutputCalculator: CalculatorDefinition = {
  slug: "wind-turbine-output-calculator",
  title: "Wind Turbine Output Calculator",
  description:
    "Free wind turbine output calculator. Estimate annual energy production, capacity factor, and electricity value from a wind turbine installation.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "wind turbine output",
    "wind turbine production",
    "wind power output",
    "turbine capacity",
    "wind electricity",
    "turbine annual output",
  ],
  variants: [
    {
      id: "output",
      name: "Annual Turbine Output",
      fields: [
        {
          name: "ratedPower",
          label: "Rated Power (kW)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "avgWindSpeed",
          label: "Average Wind Speed (m/s)",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "turbineType",
          label: "Turbine Type",
          type: "select",
          options: [
            { label: "Small Residential (1-10 kW)", value: "small" },
            { label: "Medium Commercial (10-100 kW)", value: "medium" },
            { label: "Large Utility (1+ MW)", value: "large" },
          ],
        },
        {
          name: "electricRate",
          label: "Electricity Rate ($/kWh)",
          type: "number",
          placeholder: "e.g. 0.13",
          defaultValue: 0.13,
        },
      ],
      calculate: (inputs) => {
        const ratedPower = inputs.ratedPower as number;
        const avgWindSpeed = inputs.avgWindSpeed as number;
        const turbineType = (inputs.turbineType as string) || "small";
        const rate = (inputs.electricRate as number) || 0.13;
        if (!ratedPower || !avgWindSpeed) return null;

        // Capacity factor based on wind speed and turbine type
        const baseCapacity: Record<string, number> = { small: 0.15, medium: 0.25, large: 0.35 };
        const baseCF = baseCapacity[turbineType] || 0.25;
        const windFactor = Math.min(avgWindSpeed / 7, 1.5); // 7 m/s is ideal
        const capacityFactor = Math.min(baseCF * windFactor, 0.55);

        const annualHours = 8760;
        const annualKwh = ratedPower * annualHours * capacityFactor;
        const monthlyKwh = annualKwh / 12;
        const annualValue = annualKwh * rate;
        const co2SavedKg = annualKwh * 0.417;
        const homesServed = annualKwh / 10500; // avg US home uses 10,500 kWh/yr

        return {
          primary: {
            label: "Annual Energy Output",
            value: formatNumber(annualKwh, 0) + " kWh",
          },
          details: [
            { label: "Monthly Output", value: formatNumber(monthlyKwh, 0) + " kWh" },
            { label: "Capacity Factor", value: formatNumber(capacityFactor * 100, 1) + "%" },
            { label: "Annual Value", value: "$" + formatNumber(annualValue, 0) },
            { label: "CO2 Avoided", value: formatNumber(co2SavedKg, 0) + " kg/yr" },
            { label: "Homes Equivalent", value: formatNumber(homesServed, 2) },
            { label: "Avg Wind Speed Rating", value: avgWindSpeed >= 6 ? "Good" : avgWindSpeed >= 4 ? "Moderate" : "Low" },
          ],
          note: "Actual output depends on wind patterns, terrain, turbine height, and maintenance. Wind speeds below 4 m/s are generally insufficient for economical generation.",
        };
      },
    },
  ],
  relatedSlugs: ["wind-energy-calculator", "solar-panel-calculator"],
  faq: [
    {
      question: "What is capacity factor?",
      answer:
        "Capacity factor is the ratio of actual energy output to maximum possible output over a period. A 10 kW turbine with a 25% capacity factor produces as much energy as if it ran at full power 25% of the time. Typical wind capacity factors are 20-40%.",
    },
    {
      question: "What wind speed is needed for a wind turbine?",
      answer:
        "Most wind turbines need a minimum of 3-4 m/s (7-9 mph) to start generating power. Optimal performance is at 10-15 m/s (22-34 mph). Average annual wind speeds of 5-6 m/s or more are generally needed for economical operation.",
    },
  ],
  formula:
    "Annual Output = Rated Power (kW) x 8760 hours x Capacity Factor. Capacity Factor = Base CF x Wind Speed Factor. Annual Value = kWh x Rate.",
};
