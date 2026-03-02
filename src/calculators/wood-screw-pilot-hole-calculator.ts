import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const woodScrewPilotHoleCalculator: CalculatorDefinition = {
  slug: "wood-screw-pilot-hole-calculator",
  title: "Wood Screw Pilot Hole Calculator",
  description: "Determine the correct pilot hole diameter for wood screws.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pilot hole","wood screw calculator"],
  variants: [{
    id: "standard",
    name: "Wood Screw Pilot Hole",
    description: "Determine the correct pilot hole diameter for wood screws.",
    fields: [
      { name: "screwGauge", label: "Screw Gauge Number", type: "number", min: 2, max: 14, defaultValue: 8 },
      { name: "woodType", label: "Wood Type", type: "select", options: [{ value: "soft", label: "Softwood" }, { value: "hard", label: "Hardwood" }], defaultValue: "soft" },
    ],
    calculate: (inputs) => {
      const gauge = inputs.screwGauge as number;
      const wood = inputs.woodType as string;
      if (!gauge) return null;
      const majorDia = 0.06 + gauge * 0.013;
      const softPilot = Math.round(majorDia * 0.65 * 1000) / 1000;
      const hardPilot = Math.round(majorDia * 0.85 * 1000) / 1000;
      const pilot = wood === "hard" ? hardPilot : softPilot;
      const pilot64 = Math.round(pilot * 64);
      return {
        primary: { label: "Pilot Hole Diameter", value: formatNumber(pilot) + " in (" + pilot64 + "/64)" },
        details: [
          { label: "Screw Major Diameter", value: formatNumber(Math.round(majorDia * 1000) / 1000) + " in" },
          { label: "Wood Type", value: wood === "hard" ? "Hardwood" : "Softwood" },
          { label: "Ratio Used", value: wood === "hard" ? "85%" : "65%" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "Do I always need a pilot hole?", answer: "Hardwoods always need pilot holes. Softwoods benefit from them to prevent splitting." },
    { question: "What happens without a pilot hole?", answer: "The wood can split, especially near edges, and the screw may not seat properly." },
  ],
  formula: "Pilot = Major Diameter x Factor (65% softwood, 85% hardwood)",
};
