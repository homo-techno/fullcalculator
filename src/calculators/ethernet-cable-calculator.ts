import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ethernetCableCalculator: CalculatorDefinition = {
  slug: "ethernet-cable-calculator",
  title: "Ethernet Cable Calculator",
  description: "Calculate total ethernet cable length for network runs.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["ethernet cable length","network cable calculator"],
  variants: [{
    id: "standard",
    name: "Ethernet Cable",
    description: "Calculate total ethernet cable length for network runs.",
    fields: [
      { name: "runs", label: "Number of Cable Runs", type: "number", min: 1, max: 100, defaultValue: 8 },
      { name: "avgDistance", label: "Avg Run Distance (ft)", type: "number", min: 5, max: 300, defaultValue: 50 },
      { name: "slackPerRun", label: "Slack Per Run (ft)", type: "number", min: 0, max: 20, defaultValue: 6 },
    ],
    calculate: (inputs) => {
      const runs = inputs.runs as number;
      const avgDist = inputs.avgDistance as number;
      const slack = inputs.slackPerRun as number;
      if (!runs || !avgDist) return null;
      const perRun = avgDist + slack;
      const totalFt = Math.round(perRun * runs);
      const boxes = Math.ceil(totalFt / 1000);
      const leftover = boxes * 1000 - totalFt;
      return {
        primary: { label: "Total Cable Needed", value: formatNumber(totalFt) + " ft" },
        details: [
          { label: "Per Run (with slack)", value: formatNumber(perRun) + " ft" },
          { label: "1000 ft Boxes Needed", value: String(boxes) },
          { label: "Leftover Cable", value: formatNumber(leftover) + " ft" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is the max length for an ethernet run?", answer: "Cat5e and Cat6 support runs up to 328 feet or 100 meters." },
    { question: "How much slack should I leave?", answer: "Leave 6 to 10 feet of slack at each end for termination." },
  ],
  formula: "Total Cable = (Avg Distance + Slack) x Number of Runs",
};
