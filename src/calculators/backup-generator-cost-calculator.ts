import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const backupGeneratorCostCalculator: CalculatorDefinition = {
  slug: "backup-generator-cost-calculator",
  title: "Backup Generator Cost Calculator",
  description: "Estimate the cost of a whole-home backup generator including installation and transfer switch.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["backup generator cost", "whole home generator cost", "standby generator cost"],
  variants: [{
    id: "standard",
    name: "Backup Cost",
    description: "Estimate the cost of a whole-home backup generator including installation and transfer switch",
    fields: [
      { name: "kw", label: "Generator Size", type: "select", options: [{value:"10",label:"10 kW (essentials)"},{value:"16",label:"16 kW (most circuits)"},{value:"22",label:"22 kW (whole home)"},{value:"30",label:"30+ kW (large home)"}], defaultValue: "22" },
      { name: "fuel", label: "Fuel Type", type: "select", options: [{value:"natural",label:"Natural Gas"},{value:"propane",label:"Propane"},{value:"diesel",label:"Diesel"}], defaultValue: "natural" },
      { name: "pad", label: "Installation Base", type: "select", options: [{value:"existing",label:"Existing Concrete Pad"},{value:"new",label:"New Concrete Pad"},{value:"gravel",label:"Gravel Pad"}], defaultValue: "new" },
    ],
    calculate: (inputs) => {
      const kw = parseInt(inputs.kw as string) || 22;
      const fuel = inputs.fuel as string;
      const pad = inputs.pad as string;
      const unitCost: Record<number, number> = { 10: 3000, 16: 4500, 22: 5500, 30: 8000 };
      const fuelMod: Record<string, number> = { natural: 1.0, propane: 1.1, diesel: 1.2 };
      const padCost: Record<string, number> = { existing: 0, new: 800, gravel: 300 };
      const generator = (unitCost[kw] || 5500) * (fuelMod[fuel] || 1.0);
      const transferSwitch = 1200;
      const electrical = 1500;
      const gasLine = fuel === "natural" ? 800 : fuel === "propane" ? 1200 : 0;
      const base = padCost[pad] || 800;
      const permits = 400;
      const total = generator + transferSwitch + electrical + gasLine + base + permits;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Generator Unit (" + kw + " kW)", value: "$" + formatNumber(generator) },
          { label: "Transfer Switch", value: "$" + formatNumber(transferSwitch) },
          { label: "Electrical Work", value: "$" + formatNumber(electrical) },
          { label: "Fuel Line", value: "$" + formatNumber(gasLine) },
          { label: "Pad/Base", value: "$" + formatNumber(base) },
          { label: "Permits", value: "$" + formatNumber(permits) },
        ],
      };
    },
  }],
  relatedSlugs: ["carport-cost-calculator", "french-drain-calculator"],
  faq: [
    { question: "How much does a whole-home generator cost?", answer: "A standby generator costs $5,000 to $15,000 installed. A 22 kW unit that powers a whole home typically costs $8,000 to $12,000 with installation." },
    { question: "What size generator do I need for my house?", answer: "A 10 kW generator covers essential circuits. A 16-22 kW unit powers most or all of a typical home. Large homes with central AC may need 30 kW or more." },
  ],
  formula: "Total = (Unit Cost x Fuel Mod) + Transfer Switch + Electrical + Fuel Line + Pad + Permits",
};
