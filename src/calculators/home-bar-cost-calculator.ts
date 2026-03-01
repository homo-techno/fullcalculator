import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeBarCostCalculator: CalculatorDefinition = {
  slug: "home-bar-cost-calculator",
  title: "Home Bar Cost Calculator",
  description: "Estimate the cost of building a home bar including cabinetry, countertops, and amenities.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["home bar cost", "wet bar cost", "basement bar cost"],
  variants: [{
    id: "standard",
    name: "Home Bar Cost",
    description: "Estimate the cost of building a home bar including cabinetry, countertops, and amenities",
    fields: [
      { name: "length", label: "Bar Length", type: "number", suffix: "linear ft", min: 4, max: 20, defaultValue: 8 },
      { name: "type", label: "Bar Type", type: "select", options: [{value:"dry",label:"Dry Bar (no plumbing)"},{value:"wet",label:"Wet Bar (sink)"},{value:"full",label:"Full Bar (sink + appliances)"}], defaultValue: "wet" },
      { name: "counter", label: "Bar Top Material", type: "select", options: [{value:"butcher",label:"Butcher Block"},{value:"granite",label:"Granite"},{value:"quartz",label:"Quartz"},{value:"epoxy",label:"Live Edge/Epoxy"}], defaultValue: "granite" },
    ],
    calculate: (inputs) => {
      const length = inputs.length as number;
      const type = inputs.type as string;
      const counter = inputs.counter as string;
      if (!length || length <= 0) return null;
      const cabinetRate = 200;
      const counterRate: Record<string, number> = { butcher: 40, granite: 80, quartz: 70, epoxy: 100 };
      const typeCost: Record<string, number> = { dry: 0, wet: 2000, full: 5000 };
      const cabinetry = length * cabinetRate;
      const barTop = length * 2 * (counterRate[counter] || 80);
      const plumbAndAppliances = typeCost[type] || 2000;
      const backSplash = length * 2 * 20;
      const electrical = 500;
      const shelving = length * 50;
      const total = cabinetry + barTop + plumbAndAppliances + backSplash + electrical + shelving;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Cabinetry", value: "$" + formatNumber(cabinetry) },
          { label: "Bar Top", value: "$" + formatNumber(barTop) },
          { label: "Plumbing and Appliances", value: "$" + formatNumber(plumbAndAppliances) },
          { label: "Backsplash", value: "$" + formatNumber(backSplash) },
          { label: "Electrical", value: "$" + formatNumber(electrical) },
          { label: "Shelving and Display", value: "$" + formatNumber(shelving) },
        ],
      };
    },
  }],
  relatedSlugs: ["sunroom-cost-calculator", "porch-cost-calculator"],
  faq: [
    { question: "How much does a home bar cost?", answer: "A basic dry bar costs $2,000 to $5,000. A wet bar with plumbing runs $5,000 to $15,000. A full bar with appliances can cost $10,000 to $25,000 or more." },
    { question: "Does a home bar add value to a house?", answer: "A well-built home bar can add value, especially in finished basements. Wet bars with plumbing offer more appeal to buyers than dry bars." },
  ],
  formula: "Total = Cabinetry + Bar Top + Plumbing/Appliances + Backsplash + Electrical + Shelving",
};
