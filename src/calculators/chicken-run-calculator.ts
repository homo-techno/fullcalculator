import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chickenRunCalculator: CalculatorDefinition = {
  slug: "chicken-run-calculator",
  title: "Chicken Run Cost Calculator",
  description: "Estimate the cost to build an outdoor chicken run enclosure for your backyard flock.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["chicken run cost", "chicken enclosure cost", "poultry run cost"],
  variants: [{
    id: "standard",
    name: "Chicken Run Cost",
    description: "Estimate the cost to build an outdoor chicken run enclosure for your backyard flock",
    fields: [
      { name: "chickens", label: "Number of Chickens", type: "number", suffix: "chickens", min: 2, max: 50, defaultValue: 6 },
      { name: "material", label: "Frame Material", type: "select", options: [{value:"wood",label:"Pressure-Treated Wood"},{value:"metal",label:"Metal/Steel Pipe"},{value:"pvc",label:"PVC Pipe"}], defaultValue: "wood" },
      { name: "covered", label: "Roof Type", type: "select", options: [{value:"open",label:"Open Top (netting)"},{value:"partial",label:"Partially Covered"},{value:"full",label:"Fully Roofed"}], defaultValue: "partial" },
    ],
    calculate: (inputs) => {
      const chickens = inputs.chickens as number;
      const material = inputs.material as string;
      const covered = inputs.covered as string;
      if (!chickens || chickens <= 0) return null;
      const sqftPerChicken = 10;
      const totalSqft = chickens * sqftPerChicken;
      const perimeter = Math.sqrt(totalSqft) * 4;
      const frameRate: Record<string, number> = { wood: 8, metal: 12, pvc: 5 };
      const roofCost: Record<string, number> = { open: 1, partial: 3, full: 6 };
      const frameCost = perimeter * (frameRate[material] || 8);
      const wireMesh = perimeter * 6 * 2;
      const roof = totalSqft * (roofCost[covered] || 3);
      const hardware = 100;
      const gate = 75;
      const total = frameCost + wireMesh + roof + hardware + gate;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Run Size", value: formatNumber(totalSqft) + " sq ft" },
          { label: "Frame Material", value: "$" + formatNumber(frameCost) },
          { label: "Wire Mesh/Fencing", value: "$" + formatNumber(wireMesh) },
          { label: "Roof/Cover", value: "$" + formatNumber(roof) },
          { label: "Hardware and Gate", value: "$" + formatNumber(hardware + gate) },
        ],
      };
    },
  }],
  relatedSlugs: ["artificial-turf-cost-calculator", "french-drain-calculator"],
  faq: [
    { question: "How much space does each chicken need in a run?", answer: "Each chicken needs a minimum of 10 square feet of outdoor run space. More space reduces stress and improves egg production." },
    { question: "How much does a chicken run cost?", answer: "A basic DIY chicken run for 6 chickens costs $200 to $600. A professionally built, fully covered run can cost $1,000 to $3,000." },
  ],
  formula: "Total = Frame Cost + Wire Mesh + Roof + Hardware + Gate",
};
