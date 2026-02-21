import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const upsSizingCalculator: CalculatorDefinition = {
  slug: "ups-sizing-calculator",
  title: "UPS Sizing Calculator",
  description:
    "Free UPS sizing calculator. Calculate the required UPS capacity (VA/W) and battery runtime for your equipment. Size uninterruptible power supplies correctly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "ups sizing",
    "ups calculator",
    "ups capacity",
    "uninterruptible power supply",
    "ups battery runtime",
    "ups sizing calculator",
  ],
  variants: [
    {
      id: "ups-capacity",
      name: "UPS Capacity Sizing",
      description: "Calculate required UPS VA rating for your equipment",
      fields: [
        {
          name: "totalWatts",
          label: "Total Equipment Load (W)",
          type: "number",
          placeholder: "e.g. 800",
        },
        {
          name: "powerFactor",
          label: "Power Factor",
          type: "select",
          options: [
            { label: "0.6 (Older UPS models)", value: "0.6" },
            { label: "0.7 (Budget UPS)", value: "0.7" },
            { label: "0.8 (Standard UPS)", value: "0.8" },
            { label: "0.9 (Modern UPS)", value: "0.9" },
            { label: "1.0 (Unity PF UPS)", value: "1.0" },
          ],
          defaultValue: "0.8",
        },
        {
          name: "growthFactor",
          label: "Growth / Safety Factor (%)",
          type: "number",
          placeholder: "e.g. 25",
          defaultValue: 25,
        },
        {
          name: "redundancy",
          label: "Redundancy",
          type: "select",
          options: [
            { label: "None (N)", value: "1" },
            { label: "N+1", value: "1.5" },
            { label: "2N (Full redundancy)", value: "2" },
          ],
          defaultValue: "1",
        },
      ],
      calculate: (inputs) => {
        const watts = inputs.totalWatts as number;
        const pf = Number(inputs.powerFactor);
        const growth = (inputs.growthFactor as number) || 25;
        const redundancy = Number(inputs.redundancy);
        if (!watts) return null;

        const requiredVa = watts / pf;
        const withGrowth = requiredVa * (1 + growth / 100);
        const withRedundancy = withGrowth * redundancy;

        // Standard UPS sizes
        const sizes = [500, 750, 1000, 1500, 2000, 3000, 5000, 6000, 8000, 10000, 15000, 20000];
        let recommendedVa = sizes[sizes.length - 1];
        for (const s of sizes) {
          if (s >= withRedundancy) {
            recommendedVa = s;
            break;
          }
        }

        const loadPercent = (watts / (recommendedVa * pf)) * 100;

        return {
          primary: {
            label: "Recommended UPS Size",
            value: recommendedVa >= 1000
              ? `${formatNumber(recommendedVa / 1000, 1)} kVA`
              : `${recommendedVa} VA`,
          },
          details: [
            { label: "Recommended UPS", value: `${formatNumber(recommendedVa, 0)} VA (${formatNumber(recommendedVa * pf, 0)} W)` },
            { label: "Equipment Load", value: `${formatNumber(watts, 0)} W` },
            { label: "Required VA", value: `${formatNumber(requiredVa, 0)} VA` },
            { label: "With Growth Factor", value: `${formatNumber(withGrowth, 0)} VA` },
            { label: "With Redundancy", value: `${formatNumber(withRedundancy, 0)} VA` },
            { label: "UPS Load Level", value: `${formatNumber(loadPercent, 1)}%` },
          ],
          note: "UPS should ideally operate at 40-80% load for optimal efficiency and battery runtime.",
        };
      },
    },
    {
      id: "runtime",
      name: "UPS Runtime Estimation",
      description: "Estimate battery runtime based on UPS specs and load",
      fields: [
        {
          name: "upsVa",
          label: "UPS Rating (VA)",
          type: "number",
          placeholder: "e.g. 1500",
        },
        {
          name: "batteryVoltage",
          label: "Battery Voltage (V)",
          type: "number",
          placeholder: "e.g. 36",
        },
        {
          name: "batteryAh",
          label: "Battery Capacity (Ah)",
          type: "number",
          placeholder: "e.g. 9",
        },
        {
          name: "loadWatts",
          label: "Actual Load (W)",
          type: "number",
          placeholder: "e.g. 600",
        },
        {
          name: "inverterEfficiency",
          label: "Inverter Efficiency (%)",
          type: "number",
          placeholder: "e.g. 85",
          defaultValue: 85,
        },
      ],
      calculate: (inputs) => {
        const upsVa = inputs.upsVa as number;
        const batV = inputs.batteryVoltage as number;
        const batAh = inputs.batteryAh as number;
        const loadW = inputs.loadWatts as number;
        const eff = (inputs.inverterEfficiency as number) || 85;
        if (!batV || !batAh || !loadW) return null;

        const efficiency = eff / 100;
        const batteryWh = batV * batAh;
        const actualDraw = loadW / efficiency;
        const runtimeHours = batteryWh / actualDraw;
        const runtimeMinutes = runtimeHours * 60;

        const hours = Math.floor(runtimeHours);
        const minutes = Math.round((runtimeHours - hours) * 60);

        return {
          primary: {
            label: "Estimated Runtime",
            value: runtimeMinutes < 60
              ? `${formatNumber(runtimeMinutes, 0)} minutes`
              : `${hours}h ${minutes}m`,
          },
          details: [
            { label: "Runtime", value: `${formatNumber(runtimeMinutes, 1)} minutes (${formatNumber(runtimeHours, 2)} hours)` },
            { label: "Battery Energy", value: `${formatNumber(batteryWh, 0)} Wh` },
            { label: "Actual DC Draw", value: `${formatNumber(actualDraw, 2)} W` },
            { label: "Load", value: `${formatNumber(loadW, 0)} W` },
            { label: "UPS Load %", value: upsVa ? `${formatNumber(loadW / (upsVa * 0.8) * 100, 1)}%` : "N/A" },
          ],
          note: "Actual runtime varies with battery age, temperature, and discharge rate. New batteries typically provide rated capacity; older batteries may provide 50-80%.",
        };
      },
    },
  ],
  relatedSlugs: ["battery-capacity-calculator", "power-consumption-calculator", "generator-sizing-calculator"],
  faq: [
    {
      question: "How do I size a UPS for my equipment?",
      answer:
        "Add up the wattage of all equipment to be protected. Divide by the UPS power factor (typically 0.8) to get VA. Add 25% for growth. Choose a UPS rated at or above this value. For critical systems, consider N+1 or 2N redundancy.",
    },
    {
      question: "What is the difference between VA and Watts for UPS?",
      answer:
        "VA (volt-amperes) is apparent power, W (watts) is real power. They differ due to power factor: W = VA × PF. A 1500 VA UPS with 0.8 PF can deliver 1200W. Always check both the VA and watt rating when comparing UPS units.",
    },
    {
      question: "How long will a UPS run my computer?",
      answer:
        "A typical desktop computer draws 200-400W. A 1500VA/900W UPS with internal batteries typically provides 5-15 minutes of runtime at full load. At 50% load, runtime approximately doubles. External battery packs can extend runtime to hours.",
    },
  ],
  formula:
    "UPS VA = Total Watts / Power Factor × (1 + Growth%) | Runtime = Battery Wh / (Load W / Efficiency)",
};
