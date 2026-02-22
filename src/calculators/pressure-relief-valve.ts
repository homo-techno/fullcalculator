import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pressureReliefValveCalculator: CalculatorDefinition = {
  slug: "pressure-relief-valve-calculator",
  title: "Pressure Relief Valve Calculator",
  description: "Free pressure relief valve calculator. Determine the correct PRV size and settings for boilers, water heaters, and pressure vessels.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pressure relief valve calculator", "PRV sizing", "safety valve", "boiler relief valve", "pressure vessel safety"],
  variants: [
    {
      id: "steam-prv",
      name: "Steam/Hot Water PRV",
      description: "Calculate relief valve capacity for steam or hot water systems",
      fields: [
        { name: "boilerInput", label: "Boiler Input (BTU/hr)", type: "number", placeholder: "e.g. 200000" },
        { name: "setPressure", label: "Set Pressure (PSI)", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
        { name: "systemType", label: "System Type", type: "select", options: [
          { label: "Hot Water Boiler", value: "hot_water" },
          { label: "Steam Boiler (low pressure)", value: "steam_low" },
          { label: "Steam Boiler (high pressure)", value: "steam_high" },
          { label: "Water Heater", value: "water_heater" },
        ], defaultValue: "hot_water" },
      ],
      calculate: (inputs) => {
        const boilerInput = inputs.boilerInput as number;
        const setPressure = inputs.setPressure as number;
        const systemType = inputs.systemType as string;
        if (!boilerInput || !setPressure) return null;
        let reliefCapacity = 0;
        let unit = "BTU/hr";
        if (systemType === "hot_water" || systemType === "water_heater") {
          reliefCapacity = boilerInput;
          unit = "BTU/hr";
        } else {
          reliefCapacity = boilerInput / 970;
          unit = "lbs/hr steam";
        }
        const inletSize = reliefCapacity <= 100000 ? 0.75 : reliefCapacity <= 200000 ? 1 : reliefCapacity <= 500000 ? 1.25 : reliefCapacity <= 1000000 ? 1.5 : 2;
        const outletSize = inletSize + (inletSize <= 1 ? 0.25 : 0.5);
        const maxPressure = setPressure * 1.1;
        return {
          primary: { label: "Relief Capacity Required", value: `${formatNumber(reliefCapacity, 0)}` + " " + unit },
          details: [
            { label: "Minimum Inlet Size", value: `${formatNumber(inletSize, 2)}` + " inches" },
            { label: "Minimum Outlet Size", value: `${formatNumber(outletSize, 2)}` + " inches" },
            { label: "Set Pressure", value: `${formatNumber(setPressure, 0)}` + " PSI" },
            { label: "Max Accumulation", value: `${formatNumber(maxPressure, 0)}` + " PSI" },
            { label: "System Type", value: systemType.replace(/_/g, " ") },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["boiler-size-calculator", "expansion-tank-calculator", "water-heater-size-calculator"],
  faq: [
    { question: "What is a pressure relief valve?", answer: "A PRV is a safety device that opens to release pressure when it exceeds a set point, preventing vessel rupture. Required by code on all boilers and water heaters." },
    { question: "How do I determine PRV set pressure?", answer: "The set pressure must not exceed the maximum allowable working pressure (MAWP) of the vessel. For residential water heaters, this is typically 150 PSI and 210F." },
  ],
  formula: "Relief Capacity = Boiler Input (for hot water) or Boiler Input / 970 (for steam lbs/hr)",
};