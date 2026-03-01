import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bathroomVanityCostCalculator: CalculatorDefinition = {
  slug: "bathroom-vanity-cost-calculator",
  title: "Bathroom Vanity Cost Calculator",
  description: "Estimate the cost to replace or install a bathroom vanity including countertop, sink, and plumbing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bathroom vanity cost", "vanity replacement cost", "bathroom vanity install cost"],
  variants: [{
    id: "standard",
    name: "Bathroom Vanity Cost",
    description: "Estimate the cost to replace or install a bathroom vanity including countertop, sink, and plumbing",
    fields: [
      { name: "width", label: "Vanity Width", type: "select", options: [{value:"24",label:"24 inches"},{value:"36",label:"36 inches"},{value:"48",label:"48 inches"},{value:"60",label:"60 inches (double)"}], defaultValue: "36" },
      { name: "material", label: "Vanity Material", type: "select", options: [{value:"stock",label:"Stock/Ready-Made"},{value:"semicustom",label:"Semi-Custom"},{value:"custom",label:"Full Custom"}], defaultValue: "semicustom" },
      { name: "counter", label: "Countertop", type: "select", options: [{value:"laminate",label:"Laminate"},{value:"marble",label:"Cultured Marble"},{value:"quartz",label:"Quartz"},{value:"granite",label:"Granite"}], defaultValue: "quartz" },
      { name: "plumbing", label: "Plumbing Changes", type: "select", options: [{value:"none",label:"No Changes"},{value:"minor",label:"Minor (faucet swap)"},{value:"major",label:"Major (move pipes)"}], defaultValue: "minor" },
    ],
    calculate: (inputs) => {
      const width = parseInt(inputs.width as string) || 36;
      const material = inputs.material as string;
      const counter = inputs.counter as string;
      const plumbing = inputs.plumbing as string;
      const vanityCost: Record<string, number> = { stock: 300, semicustom: 800, custom: 2500 };
      const widthMod: Record<number, number> = { 24: 0.7, 36: 1.0, 48: 1.4, 60: 1.8 };
      const counterRate: Record<string, number> = { laminate: 15, marble: 30, quartz: 50, granite: 60 };
      const plumbCost: Record<string, number> = { none: 0, minor: 250, major: 800 };
      const vanity = (vanityCost[material] || 800) * (widthMod[width] || 1.0);
      const counterCost = (width / 12) * 2 * (counterRate[counter] || 50);
      const sink = 150;
      const faucet = 200;
      const plumb = plumbCost[plumbing] || 250;
      const labor = 400;
      const total = vanity + counterCost + sink + faucet + plumb + labor;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Vanity Cabinet", value: "$" + formatNumber(vanity) },
          { label: "Countertop", value: "$" + formatNumber(counterCost) },
          { label: "Sink", value: "$" + formatNumber(sink) },
          { label: "Faucet", value: "$" + formatNumber(faucet) },
          { label: "Plumbing Work", value: "$" + formatNumber(plumb) },
          { label: "Installation Labor", value: "$" + formatNumber(labor) },
        ],
      };
    },
  }],
  relatedSlugs: ["sunroom-cost-calculator", "porch-cost-calculator"],
  faq: [
    { question: "How much does a bathroom vanity cost?", answer: "A stock vanity costs $200 to $800. Semi-custom vanities range from $500 to $2,000. Custom vanities can cost $2,000 to $5,000 or more depending on size and materials." },
    { question: "Can I install a bathroom vanity myself?", answer: "A handy homeowner can install a stock vanity in a few hours. However, any plumbing changes beyond a simple faucet swap are best handled by a licensed plumber." },
  ],
  formula: "Total = (Vanity x Width Modifier) + Countertop + Sink + Faucet + Plumbing + Labor",
};
