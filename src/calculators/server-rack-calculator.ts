import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const serverRackCalculator: CalculatorDefinition = {
  slug: "server-rack-calculator",
  title: "Server Rack Calculator",
  description: "Calculate rack units needed for server equipment.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["server rack units","rack space calculator"],
  variants: [{
    id: "standard",
    name: "Server Rack",
    description: "Calculate rack units needed for server equipment.",
    fields: [
      { name: "servers", label: "Number of 1U Servers", type: "number", min: 0, max: 42, defaultValue: 6 },
      { name: "switches", label: "Number of 1U Switches", type: "number", min: 0, max: 20, defaultValue: 2 },
      { name: "patchPanels", label: "Number of 1U Patch Panels", type: "number", min: 0, max: 10, defaultValue: 2 },
      { name: "ups", label: "Number of 2U UPS Units", type: "number", min: 0, max: 10, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const servers = inputs.servers as number;
      const switches = inputs.switches as number;
      const panels = inputs.patchPanels as number;
      const ups = inputs.ups as number;
      const totalU = servers + switches + panels + (ups * 2);
      const spacers = Math.floor(totalU / 6);
      const totalWithSpacers = totalU + spacers;
      const racksNeeded = Math.ceil(totalWithSpacers / 42);
      return {
        primary: { label: "Total Rack Units", value: String(totalWithSpacers) + " U" },
        details: [
          { label: "Equipment Units", value: String(totalU) + " U" },
          { label: "Spacers / Blanks", value: String(spacers) + " U" },
          { label: "42U Racks Needed", value: String(racksNeeded) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is a rack unit?", answer: "A rack unit (U) is 1.75 inches of vertical rack space." },
    { question: "How many servers fit in a standard rack?", answer: "A standard 42U rack holds up to 42 one-unit servers theoretically." },
  ],
  formula: "Total U = Servers + Switches + Panels + (UPS x 2) + Spacers",
};
