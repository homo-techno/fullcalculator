import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const woodScrewPilotCalculator: CalculatorDefinition = {
  slug: "wood-screw-pilot-calculator",
  title: "Wood Screw Pilot Hole Calculator",
  description: "Free wood screw pilot hole calculator. Determine the correct pilot hole and clearance hole drill bit sizes for wood screws.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pilot hole calculator", "wood screw calculator", "drill bit for screws", "clearance hole size", "screw pilot hole"],
  variants: [
    {
      id: "pilot-hole",
      name: "Pilot Hole Size",
      description: "Calculate pilot and clearance hole sizes for wood screws",
      fields: [
        {
          name: "screwSize",
          label: "Screw Size (gauge)",
          type: "select",
          options: [
            { label: "#2 (0.086 in)", value: "2" },
            { label: "#4 (0.112 in)", value: "4" },
            { label: "#6 (0.138 in)", value: "6" },
            { label: "#8 (0.164 in)", value: "8" },
            { label: "#10 (0.190 in)", value: "10" },
            { label: "#12 (0.216 in)", value: "12" },
            { label: "#14 (0.242 in)", value: "14" },
          ],
        },
        {
          name: "woodType",
          label: "Wood Type",
          type: "select",
          options: [
            { label: "Softwood (pine, cedar, spruce)", value: "soft" },
            { label: "Hardwood (oak, maple, walnut)", value: "hard" },
          ],
        },
        { name: "screwLength", label: "Screw Length (inches)", type: "number", placeholder: "e.g. 1.5" },
      ],
      calculate: (inputs) => {
        const screwGauge = parseInt(inputs.screwSize as string);
        const woodType = inputs.woodType as string;
        const screwLength = inputs.screwLength as number;
        if (screwGauge === undefined || !screwLength) return null;
        const shankDiameters: Record<number, number> = {2:0.086, 4:0.112, 6:0.138, 8:0.164, 10:0.190, 12:0.216, 14:0.242};
        const softPilot: Record<number, number> = {2:0.047, 4:0.063, 6:0.078, 8:0.094, 10:0.109, 12:0.125, 14:0.141};
        const hardPilot: Record<number, number> = {2:0.063, 4:0.078, 6:0.094, 8:0.109, 10:0.125, 12:0.141, 14:0.156};
        const shankDia = shankDiameters[screwGauge] || 0.164;
        const pilotDia = woodType === "hard" ? (hardPilot[screwGauge] || 0.109) : (softPilot[screwGauge] || 0.094);
        const clearanceDia = shankDia + 0.016;
        const drillBitFractions: Record<string, number> = {"1/16":0.0625, "5/64":0.078125, "3/32":0.09375, "7/64":0.109375, "1/8":0.125, "9/64":0.140625, "5/32":0.15625, "11/64":0.171875, "3/16":0.1875, "13/64":0.203125, "7/32":0.21875, "15/64":0.234375, "1/4":0.25};
        let closestPilotBit = "1/8";
        let closestPilotDiff = 999;
        let closestClearBit = "1/4";
        let closestClearDiff = 999;
        for (const [name, size] of Object.entries(drillBitFractions)) {
          const pDiff = Math.abs(size - pilotDia);
          if (pDiff < closestPilotDiff && size <= pilotDia + 0.005) { closestPilotDiff = pDiff; closestPilotBit = name; }
          const cDiff = Math.abs(size - clearanceDia);
          if (cDiff < closestClearDiff && size >= clearanceDia - 0.005) { closestClearDiff = cDiff; closestClearBit = name; }
        }
        const pilotDepth = screwLength * 0.75;
        return {
          primary: { label: "Pilot Hole Drill Bit", value: `${closestPilotBit} inch` },
          details: [
            { label: "Pilot Hole Diameter", value: `${formatNumber(pilotDia, 4)} inches` },
            { label: "Clearance Hole Drill Bit", value: `${closestClearBit} inch` },
            { label: "Clearance Hole Diameter", value: `${formatNumber(clearanceDia, 4)} inches` },
            { label: "Screw Shank Diameter", value: `${formatNumber(shankDia, 4)} inches` },
            { label: "Screw Gauge", value: `#${formatNumber(screwGauge, 0)}` },
            { label: "Pilot Hole Depth", value: `${formatNumber(pilotDepth, 2)} inches` },
            { label: "Wood Type", value: woodType === "hard" ? "Hardwood" : "Softwood" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["drill-bit-size-calculator", "dowel-spacing-calculator", "wood-screw-pilot-calculator"],
  faq: [
    { question: "Why do I need a pilot hole?", answer: "Pilot holes prevent wood from splitting, make driving screws easier, and ensure screws go in straight. They are especially important near edges and in hardwoods." },
    { question: "What is a clearance hole?", answer: "A clearance hole is drilled through the top piece so the screw passes freely. This ensures the screw pulls the top piece tight against the bottom piece." },
  ],
  formula: "Pilot Hole = ~65% of screw shank (softwood) or ~75% (hardwood) | Clearance Hole = Shank Diameter + 1/64 inch",
};
